import { useCallback, useEffect, useRef, useState } from 'react'

import Navbar from '../../components/Navbar'
import FileExplorer from '../../components/Editor/FileExplorer'


import MilkdownEditor from '../../components/Editor/MilkdownEditor'


function Notes() {
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [viewMode, setViewMode] = useState<'editor' | 'source'>('editor');

    const handleFileSelect = useCallback(async (filePath: string) => {
        if (!filePath) return;
        setLoading(true);
        setError(null);
        setActiveFile(filePath);
        try {
            const response = await window.ipcRenderer.invoke("get-file-content", filePath);
            if (response.status === "success") {
                setContent(response.data);
                setIsDirty(false);
                setError(null);
            } else {
                setError(response.message);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEditorChange = useCallback((value: string) => {
        setContent(value);
        setIsDirty(true);
        setError(null);
    }, []);

    useEffect(() => {
        if (!activeFile) return;
        if (!isDirty) return;

        const currentFile = activeFile;

        saveTimerRef.current = setTimeout(async () => {
            if (!currentFile) return;

            setSaving(true);
            try {
                const response = await window.ipcRenderer.invoke(
                    "update-file",
                    currentFile,
                    content
                );
                if (response.status === 'success') {
                    setIsDirty(false);
                    setError(null);
                } else {
                    setError(response.message ?? 'Failed to save file');
                }
            } catch (err: any) {
                setError(err?.message ?? 'Failed to save file');
            } finally {
                setSaving(false);
            }
        }, 800);

        return () => {
            if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
        };
    }, [activeFile, content, isDirty]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Navbar />

            {/* Sidebar */}
            <div className="hidden md:block ml-14 w-60 h-screen shrink-0 border-r border-white/10">
                <FileExplorer onFileSelect={handleFileSelect} />
            </div>

            {/* Editor area */}
            <div className="flex-1 relative bg-white dark:bg-[#1e1e1e]">
                {activeFile ? (
                    loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="h-full relative flex flex-col">
                            {/* Editor Header / Action Bar */}
                            <div className="flex items-center justify-end px-6 py-3 border-b border-[#e5e5e5] dark:border-[#333333]">
                                <button
                                    onClick={() => setViewMode(prev => prev === 'editor' ? 'source' : 'editor')}
                                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-[#252525] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-300 rounded transition-colors"
                                >
                                    {viewMode === 'editor' ? 'View Source' : 'View Editor'}
                                </button>
                            </div>
                            
                            {/* Editor Body */}
                            <div className="flex-1 overflow-hidden relative">
                                {viewMode === 'editor' ? (
                                    <MilkdownEditor
                                        value={content}
                                        onChange={handleEditorChange}
                                    />
                                ) : (
                                    <textarea
                                        className="w-full h-full p-8 bg-transparent text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none"
                                        value={content}
                                        onChange={(e) => handleEditorChange(e.target.value)}
                                        placeholder="Type markdown here..."
                                    />
                                )}
                            </div>
                            {saving ? (
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">Saving...</div>
                            ) : error ? (
                                <div className='absolute bottom-2 left-2 text-[12px] text-red-500'>{error}</div>
                            ) : null}
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-primary text-2xl font-bold">No file selected</div>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default Notes;