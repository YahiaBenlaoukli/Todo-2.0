import { useState, useEffect, useCallback, useRef } from 'react';
import { FiChevronDown, FiChevronRight, FiMoreHorizontal, FiFilePlus, FiFolderPlus, FiRefreshCw } from 'react-icons/fi';
import FileNode, { type FileTreeNode } from './FileNode';

/* ── Component ──────────────────────────────────────────────── */
export interface FileExplorerProps {
    onFileSelect?: (filePath: string) => void;
}

function FileExplorer({ onFileSelect }: FileExplorerProps = {}) {
    const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [explorerOpen, setExplorerOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    /* ── Inline Editing State ── */
    const [creatingNode, setCreatingNode] = useState<{ parentPath: string; type: 'file' | 'folder' } | null>(null);
    const [renamingNode, setRenamingNode] = useState<string | null>(null);

    const handleSelectFile = useCallback((path: string) => {
        setSelectedFile(path);
        onFileSelect?.(path);
    }, [onFileSelect]);

    /* ── Custom Confirm Dialog (Retained for Destructive Actions) ── */
    const [dialog, setDialog] = useState<{
        isOpen: boolean;
        title: string;
        onResolveConfirm?: (val: boolean) => void;
    }>({ isOpen: false, title: '' });

    const showConfirm = useCallback((title: string) => {
        return new Promise<boolean>((resolve) => {
            setDialog({
                isOpen: true,
                title,
                onResolveConfirm: resolve,
            });
        });
    }, []);

    const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));

    /* ── Load file tree from backend ── */
    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            const response: any = await window.ipcRenderer.invoke('get-files');
            if (response.status === 'success') {
                setFileTree(response.data);
            } else {
                console.error('Failed to load files:', response.message);
            }
        } catch (err) {
            console.error('Error loading files:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    /* ── Action handlers ── */
    const handleNewFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExplorerOpen(true);
        setCreatingNode({ parentPath: '', type: 'file' });
    };

    const handleNewFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExplorerOpen(true);
        setCreatingNode({ parentPath: '', type: 'folder' });
    };

    const handleRefresh = (e: React.MouseEvent) => {
        e.stopPropagation();
        loadFiles();
    };

    /* ── Inline Creation Submit ── */
    const handleInlineCreateSubmit = async (name: string) => {
        if (!creatingNode) return;
        let finalName = name.trim();
        
        if (!finalName) {
            setCreatingNode(null);
            return;
        }

        // Enforce .md extension for files
        if (creatingNode.type === 'file' && !finalName.endsWith('.md')) {
            finalName += '.md';
        }

        const targetPath = creatingNode.parentPath ? `${creatingNode.parentPath}/${finalName}` : finalName;
        const channel = creatingNode.type === 'folder' ? 'create-folder' : 'create-file';

        const response: any = await window.ipcRenderer.invoke(channel, targetPath);
        if (response.status === 'success') {
            await loadFiles();
            setCreatingNode(null);
        } else {
            console.error(`Failed to create ${creatingNode.type}:`, response.message);
            setCreatingNode(null);
        }
    };

    /* ── Sort helper ── */
    const sorted = (nodes: FileTreeNode[]) =>
        nodes.slice().sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        });

    return (
        <div className="h-full flex flex-col bg-secondary text-[#cccccc] select-none overflow-hidden relative" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>

            {/* ── Top bar: "EXPLORER" label ── */}
            <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#bbbbbb] shrink-0">
                <span>Explorer</span>
                <button className="p-1 rounded hover:bg-white/10 transition-colors text-[#bbbbbb] hover:text-white">
                    <FiMoreHorizontal size={16} />
                </button>
            </div>

            {/* ── Section: project name collapsible ── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Section header */}
                <button
                    onClick={() => setExplorerOpen(!explorerOpen)}
                    className="flex items-center gap-1 w-full px-2 py-[5px] text-[11px] font-bold uppercase tracking-wide bg-secondary hover:bg-white/5 transition-colors text-[#cccccc] border-t border-b border-white/5"
                >
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        {explorerOpen ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                    </span>
                    <span>Notes</span>

                    {/* Action icons (only when section is open) */}
                    {explorerOpen && (
                        <span className="ml-auto flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                            <span className="p-1 rounded hover:bg-white/10 cursor-pointer transition-colors" title="New File" onClick={handleNewFile}>
                                <FiFilePlus size={14} />
                            </span>
                            <span className="p-1 rounded hover:bg-white/10 cursor-pointer transition-colors" title="New Folder" onClick={handleNewFolder}>
                                <FiFolderPlus size={14} />
                            </span>
                            <span className="p-1 rounded hover:bg-white/10 cursor-pointer transition-colors" title="Refresh" onClick={handleRefresh}>
                                <FiRefreshCw size={13} />
                            </span>
                        </span>
                    )}
                </button>

                {/* File tree */}
                {explorerOpen && (
                    <div className="py-0.5">
                        {/* Root inline creation slot */}
                        {creatingNode && creatingNode.parentPath === '' && (
                            <InlineInput
                                type={creatingNode.type}
                                depth={0}
                                onSubmit={handleInlineCreateSubmit}
                                onCancel={() => setCreatingNode(null)}
                            />
                        )}

                        {loading ? (
                            <div className="px-4 py-3 text-[12px] text-[#888888]">Loading...</div>
                        ) : fileTree.length === 0 && !creatingNode ? (
                            <div className="px-4 py-3 text-[12px] text-[#888888]">No files yet</div>
                        ) : (
                            sorted(fileTree).map((node, i) => (
                                <FileNode
                                    key={`${node.name}-${i}`}
                                    node={node}
                                    depth={0}
                                    parentPath=""
                                    selectedFile={selectedFile}
                                    onSelectFile={handleSelectFile}
                                    onRefresh={loadFiles}
                                    showConfirm={showConfirm}
                                    creatingNode={creatingNode}
                                    setCreatingNode={setCreatingNode}
                                    renamingNode={renamingNode}
                                    setRenamingNode={setRenamingNode}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ── Custom Confirm Overlay (For Deletions Only) ── */}
            {dialog.isOpen && (
                <div className="absolute inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-sm">
                    <div className="bg-[#252526] border border-[#3c3c3c] rounded-md shadow-2xl p-4 w-11/12 max-w-[300px]" onClick={e => e.stopPropagation()}>
                        <h3 className="text-[13px] font-medium text-[#cccccc] mb-5">{dialog.title}</h3>

                        <div className="flex justify-end gap-2 text-[12px]">
                            <button
                                className="px-3 py-1.5 hover:bg-white/10 rounded transition-colors"
                                onClick={() => {
                                    dialog.onResolveConfirm?.(false);
                                    closeDialog();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1.5 bg-[#840000] hover:bg-[#a60000] text-white rounded transition-colors"
                                onClick={() => {
                                    dialog.onResolveConfirm?.(true);
                                    closeDialog();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Helper Component for Inline Inputs ── */
export function InlineInput({ type, depth, initialValue = '', onSubmit, onCancel }: { type: 'file' | 'folder', depth: number, initialValue?: string, onSubmit: (val: string) => void, onCancel: () => void }) {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const paddingLeft = 12 + depth * 16;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            if (initialValue) {
                // Select only the filename part, excluding extension if present
                const lastDot = initialValue.lastIndexOf('.');
                if (lastDot > 0) {
                    inputRef.current.setSelectionRange(0, lastDot);
                } else {
                    inputRef.current.select();
                }
            } else {
                inputRef.current.select();
            }
        }
    }, [initialValue]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSubmit(value);
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const handleBlur = () => {
        if (value.trim() && value !== initialValue) {
            onSubmit(value);
        } else {
            onCancel();
        }
    };

    return (
        <div
            className="flex items-center gap-1.5 py-[3px] pr-3 select-none text-[13px] leading-[22px]"
            style={{ paddingLeft: `${paddingLeft}px` }}
        >
            <span className="w-4 shrink-0" />
            
            {/* Visual Icon hint */}
            <span className="text-[#888888] shrink-0">
               {type === 'folder' ? '📁' : '📄'}
            </span>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="flex-1 bg-[#3c3c3c] border border-[#007acc] outline-none text-[#cccccc] px-1 py-0 h-[22px]"
            />
        </div>
    );
}

export default FileExplorer;