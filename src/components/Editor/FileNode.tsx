import { useState, useRef, useEffect } from 'react';
import { FiChevronRight, FiChevronDown, FiFolder, FiFile } from 'react-icons/fi';
import {
    FaJs, FaCss3Alt, FaHtml5, FaReact, FaMarkdown, FaGitAlt, FaNpm, FaPython
} from 'react-icons/fa';
import {
    SiTypescript, SiJson, SiVite
} from 'react-icons/si';

import { InlineInput } from './FileExplorer';

export interface FileTreeNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileTreeNode[];
}

interface FileNodeProps {
    node: FileTreeNode;
    depth?: number;
    parentPath?: string;
    selectedFile?: string | null;
    onSelectFile?: (name: string) => void;
    onRefresh?: () => void;
    showConfirm?: (title: string) => Promise<boolean>;
    
    // Inline state passthrough
    creatingNode?: { parentPath: string; type: 'file' | 'folder' } | null;
    setCreatingNode?: (node: { parentPath: string; type: 'file' | 'folder' } | null) => void;
    renamingNode?: string | null;
    setRenamingNode?: (path: string | null) => void;
}

/* Map file extensions → icon + color */
function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'ts':
        case 'tsx':
            return <SiTypescript size={14} className="text-[#3178c6] shrink-0" />;
        case 'js':
        case 'jsx':
            return <FaJs size={14} className="text-[#f7df1e] shrink-0" />;
        case 'css':
            return <FaCss3Alt size={14} className="text-[#1572b6] shrink-0" />;
        case 'html':
            return <FaHtml5 size={14} className="text-[#e34f26] shrink-0" />;
        case 'json':
            return <SiJson size={14} className="text-[#f5a623] shrink-0" />;
        case 'md':
            return <FaMarkdown size={14} className="text-[#519aba] shrink-0" />;
        case 'py':
            return <FaPython size={14} className="text-[#3776ab] shrink-0" />;
        case 'gitignore':
            return <FaGitAlt size={14} className="text-[#f05033] shrink-0" />;
        default:
            if (name === 'package.json' || name === 'package-lock.json')
                return <FaNpm size={14} className="text-[#cb3837] shrink-0" />;
            if (name === 'vite.config.ts' || name === 'vite.config.js')
                return <SiVite size={14} className="text-[#646cff] shrink-0" />;
            return <FiFile size={14} className="text-[#8b8b8b] shrink-0" />;
    }
}

function FileNode({ node, depth = 0, parentPath = '', selectedFile, onSelectFile, onRefresh, showConfirm, creatingNode, setCreatingNode, renamingNode, setRenamingNode }: FileNodeProps) {
    const [isExpanded, setIsExpanded] = useState(depth < 1);
    const isFolder = node.type === 'folder';
    const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isSelected = !isFolder && selectedFile === fullPath;
    const paddingLeft = 12 + depth * 16;
    const isEditing = renamingNode === fullPath;

    /* ── Context menu ── */
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close context menu on outside click
    useEffect(() => {
        if (!contextMenu) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setContextMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [contextMenu]);

    // Force expand when a child is being created
    useEffect(() => {
        if (creatingNode?.parentPath === fullPath && isFolder) {
            setIsExpanded(true);
        }
    }, [creatingNode, fullPath, isFolder]);

    const handleClick = () => {
        if (isEditing) return; // ignore clicks while renaming
        if (isFolder) {
            setIsExpanded(!isExpanded);
        } else {
            onSelectFile?.(fullPath);
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleRenameClick = () => {
        setContextMenu(null);
        setRenamingNode?.(fullPath);
    };

    const handleRenameSubmit = async (newName: string) => {
        let finalName = newName.trim();
        if (!finalName || finalName === node.name) {
            setRenamingNode?.(null);
            return;
        }

        // Enforce .md strictly for files on rename like we do on creation
        if (!isFolder && !finalName.endsWith('.md')) {
            finalName += '.md';
        }

        const channel = isFolder ? 'rename-folder' : 'rename-file';
        const response: any = await window.ipcRenderer.invoke(channel, fullPath, finalName);
        if (response.status === 'success') {
            onRefresh?.();
            setRenamingNode?.(null);
        } else {
            console.error(`Failed to rename: ${response.message}`);
            setRenamingNode?.(null);
        }
    };

    const handleDelete = async () => {
        setContextMenu(null);
        if (!showConfirm) return;
        const confirmed = await showConfirm(`Delete "${node.name}"?`);
        if (!confirmed) return;

        const channel = isFolder ? 'delete-folder' : 'delete-file';
        const response: any = await window.ipcRenderer.invoke(channel, fullPath);
        if (response.status === 'success') {
            // Also deselect if deleted
            if (selectedFile === fullPath || selectedFile?.startsWith(`${fullPath}/`)) {
                 onSelectFile?.('');
            }
            onRefresh?.();
        } else {
            console.error(`Failed to delete: ${response.message}`);
        }
    };

    const handleNewFile = () => {
        setContextMenu(null);
        if (!isFolder) return;
        setIsExpanded(true);
        setCreatingNode?.({ parentPath: fullPath, type: 'file' });
    };

    const handleNewFolder = () => {
        setContextMenu(null);
        if (!isFolder) return;
        setIsExpanded(true);
        setCreatingNode?.({ parentPath: fullPath, type: 'folder' });
    };

    const handleInlineCreateSubmit = async (name: string) => {
        if (!creatingNode) return;
        let finalName = name.trim();
        if (!finalName) {
            setCreatingNode?.(null);
            return;
        }

        if (creatingNode.type === 'file' && !finalName.endsWith('.md')) {
            finalName += '.md';
        }

        const targetPath = creatingNode.parentPath ? `${creatingNode.parentPath}/${finalName}` : finalName;
        const channel = creatingNode.type === 'folder' ? 'create-folder' : 'create-file';

        const response: any = await window.ipcRenderer.invoke(channel, targetPath);
        if (response.status === 'success') {
            onRefresh?.();
            setCreatingNode?.(null);
        } else {
            console.error(`Failed to create ${creatingNode.type}: ${response.message}`);
            setCreatingNode?.(null);
        }
    };

    return (
        <div>
            {isEditing ? (
                /* ── Inline Renaming Input ── */
                <InlineInput
                    type={isFolder ? 'folder' : 'file'}
                    depth={depth}
                    initialValue={node.name}
                    onSubmit={handleRenameSubmit}
                    onCancel={() => setRenamingNode?.(null)}
                />
            ) : (
                /* ── Normal Node Display ── */
                <div
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    className={`flex items-center gap-1.5 py-[3px] pr-3 cursor-pointer select-none text-[13px] leading-[22px] transition-colors duration-75
                        ${isSelected
                            ? 'bg-primary/20 text-white'
                            : 'text-[#cccccc] hover:bg-white/5'
                        }`}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                >
                    {/* Chevron for folders, spacer for files */}
                    {isFolder ? (
                        <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#c5c5c5]">
                            {isExpanded
                                ? <FiChevronDown size={14} />
                                : <FiChevronRight size={14} />
                            }
                        </span>
                    ) : (
                        <span className="w-4 shrink-0" />
                    )}

                    {/* Icon */}
                    {isFolder
                        ? <FiFolder size={14} className={`shrink-0 ${isExpanded ? 'text-primary' : 'text-[#c09553]'}`} />
                        : getFileIcon(node.name)
                    }

                    {/* Label */}
                    <span className="truncate">{node.name}</span>
                </div>
            )}

            {/* Context menu */}
            {contextMenu && (
                <div
                    ref={menuRef}
                    className="fixed z-50 min-w-[160px] bg-[#252526] border border-[#3c3c3c] rounded shadow-xl py-1 text-[13px] text-[#cccccc]"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    {isFolder && (
                        <>
                            <button onClick={handleNewFile} className="w-full text-left px-3 py-1.5 hover:bg-[#094771] transition-colors">
                                New File
                            </button>
                            <button onClick={handleNewFolder} className="w-full text-left px-3 py-1.5 hover:bg-[#094771] transition-colors">
                                New Folder
                            </button>
                            <div className="border-t border-[#3c3c3c] my-1" />
                        </>
                    )}
                    <button onClick={handleRenameClick} className="w-full text-left px-3 py-1.5 hover:bg-[#094771] transition-colors">
                        Rename
                    </button>
                    <button onClick={handleDelete} className="w-full text-left px-3 py-1.5 hover:bg-[#840000] text-[#ff6b6b] transition-colors">
                        Delete
                    </button>
                </div>
            )}

            {/* Children and Inline Creation Child */}
            {isFolder && isExpanded && (
                <div>
                    {creatingNode && creatingNode.parentPath === fullPath && (
                        <InlineInput
                            type={creatingNode.type}
                            depth={depth + 1}
                            onSubmit={handleInlineCreateSubmit}
                            onCancel={() => setCreatingNode?.(null)}
                        />
                    )}
                    
                    {node.children && node.children
                        .slice()
                        .sort((a, b) => {
                            if (a.type === b.type) return a.name.localeCompare(b.name);
                            return a.type === 'folder' ? -1 : 1;
                        })
                        .map((child, i) => (
                            <FileNode
                                key={`${child.name}-${i}`}
                                node={child}
                                depth={depth + 1}
                                parentPath={fullPath}
                                selectedFile={selectedFile}
                                onSelectFile={onSelectFile}
                                onRefresh={onRefresh}
                                showConfirm={showConfirm}
                                creatingNode={creatingNode}
                                setCreatingNode={setCreatingNode}
                                renamingNode={renamingNode}
                                setRenamingNode={setRenamingNode}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

export default FileNode;