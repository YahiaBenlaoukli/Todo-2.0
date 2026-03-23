import { useCallback, useEffect, useRef, useState } from 'react'
import './Notes.css'

import Navbar from '../../components/Navbar'
import FileExplorer from '../../components/Editor/FileExplorer'


import MdEditor from '../../components/Editor/MdEditor'


function Notes() {
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const saveTimerRef = useRef<number | null>(null);

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

        if (saveTimerRef.current) {
            window.clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = window.setTimeout(async () => {
            setSaving(true);
            try {
                const response: any = await window.ipcRenderer.invoke("update-file", activeFile, content);
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

            {/* File explorer sidebar */}
            <div className="hidden md:block ml-14 w-60 h-screen shrink-0 border-r border-white/10">
                <FileExplorer onFileSelect={handleFileSelect} />
                <div >
                    {activeFile ? (loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="h-full relative">
                            <MdEditor
                                height="90vh"
                                value={content}
                                onChange={handleEditorChange}
                                theme="vs-dark"
                                language="markdown"
                            />
                            {saving && (
                                <div className="absolute bottom-2 left-2 text-[12px] text-primary">
                                    Saving...
                                </div>
                            )}
                            {error && (
                                <div className="absolute bottom-2 left-2 text-[12px] text-red-500">
                                    {error}
                                </div>
                            )}
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

        </div>
    )
}

export default Notes;