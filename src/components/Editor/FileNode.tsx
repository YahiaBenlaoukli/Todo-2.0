import { useState } from 'react';
import { FiChevronRight, FiChevronDown, FiFolder, FiFile } from 'react-icons/fi';
import {
    FaJs, FaCss3Alt, FaHtml5, FaReact, FaMarkdown, FaGitAlt, FaNpm, FaPython
} from 'react-icons/fa';
import {
    SiTypescript, SiJson, SiVite
} from 'react-icons/si';

export interface FileTreeNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileTreeNode[];
}

interface FileNodeProps {
    node: FileTreeNode;
    depth?: number;
    selectedFile?: string | null;
    onSelectFile?: (name: string) => void;
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

function FileNode({ node, depth = 0, selectedFile, onSelectFile }: FileNodeProps) {
    const [isExpanded, setIsExpanded] = useState(depth < 1);
    const isFolder = node.type === 'folder';
    const isSelected = !isFolder && selectedFile === node.name;
    const paddingLeft = 12 + depth * 16;

    const handleClick = () => {
        if (isFolder) {
            setIsExpanded(!isExpanded);
        } else {
            onSelectFile?.(node.name);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
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

            {/* Children */}
            {isFolder && isExpanded && node.children && (
                <div>
                    {node.children
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
                                selectedFile={selectedFile}
                                onSelectFile={onSelectFile}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

export default FileNode;