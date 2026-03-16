import { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiMoreHorizontal, FiFilePlus, FiFolderPlus, FiRefreshCw } from 'react-icons/fi';
import FileNode, { type FileTreeNode } from './FileNode';

/* ── Demo file tree ─────────────────────────────────────────── */
const DEMO_TREE: FileTreeNode[] = [
    {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'components',
                type: 'folder',
                children: [
                    { name: 'Navbar.tsx', type: 'file' },
                    { name: 'TodoItem.tsx', type: 'file' },
                    { name: 'CreateTodoModal.tsx', type: 'file' },
                    { name: 'EditTodoModal.tsx', type: 'file' },
                ],
            },
            {
                name: 'Pages',
                type: 'folder',
                children: [
                    { name: 'App.tsx', type: 'file' },
                    { name: 'RoadMap.tsx', type: 'file' },
                    {
                        name: 'Notes',
                        type: 'folder',
                        children: [
                            { name: 'Notes.tsx', type: 'file' },
                            { name: 'Notes.css', type: 'file' },
                        ],
                    },
                ],
            },
            { name: 'index.css', type: 'file' },
            { name: 'main.tsx', type: 'file' },
            { name: 'vite-env.d.ts', type: 'file' },
        ],
    },
    {
        name: 'electron',
        type: 'folder',
        children: [
            { name: 'main.ts', type: 'file' },
            { name: 'preload.ts', type: 'file' },
            {
                name: 'services',
                type: 'folder',
                children: [
                    { name: 'db.ts', type: 'file' },
                    { name: 'roadmap.ts', type: 'file' },
                    { name: 'types.ts', type: 'file' },
                ],
            },
        ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' },
    { name: 'vite.config.ts', type: 'file' },
    { name: '.gitignore', type: 'file' },
    { name: 'README.md', type: 'file' },
];

/* ── Component ──────────────────────────────────────────────── */
function FileExplorer() {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [explorerOpen, setExplorerOpen] = useState(true);

    return (
        <div className="h-full flex flex-col bg-secondary text-[#cccccc] select-none overflow-hidden" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>

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
                    <span>Todo-2.0</span>

                    {/* Action icons (only when section is open) */}
                    {explorerOpen && (
                        <span className="ml-auto flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                            <span className="p-1 rounded hover:bg-white/10 cursor-pointer transition-colors" title="New File">
                                <FiFilePlus size={14} />
                            </span>
                            <span className="p-1 rounded hover:bg-white/10 cursor-pointer transition-colors" title="New Folder">
                                <FiFolderPlus size={14} />
                            </span>
                            <span className="p-1 rounded hover:bg-white/10 cursor-pointer transition-colors" title="Refresh">
                                <FiRefreshCw size={13} />
                            </span>
                        </span>
                    )}
                </button>

                {/* File tree */}
                {explorerOpen && (
                    <div className="py-0.5">
                        {DEMO_TREE
                            .slice()
                            .sort((a, b) => {
                                if (a.type === b.type) return a.name.localeCompare(b.name);
                                return a.type === 'folder' ? -1 : 1;
                            })
                            .map((node, i) => (
                                <FileNode
                                    key={`${node.name}-${i}`}
                                    node={node}
                                    depth={0}
                                    selectedFile={selectedFile}
                                    onSelectFile={setSelectedFile}
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileExplorer;