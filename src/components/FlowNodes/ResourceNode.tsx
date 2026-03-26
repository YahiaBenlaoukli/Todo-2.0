import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';
import { FiLink, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ResourceNode = ({ data }: { data: { id: number; roadmapId: number; description?: string; title: string; content?: string; type: NodeType; url?: string; onDelete?: (id: string) => void; onEdit?: (data: any) => void; } }) => {
    return (
        <div className="group relative px-4 py-3 shadow-lg rounded-xl bg-sidebar border-l-4 border-emerald-500 min-w-[180px] max-w-[260px] hover:shadow-xl transition-shadow">
            <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); data.onEdit?.(data); }}
                    className="w-7 h-7 rounded-full bg-sidebar shadow-md border border-border flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-700 hover:scale-110 transition-all duration-150"
                    title="Edit node"
                >
                    <FiEdit2 className="text-xs" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); data.onDelete?.(data.id.toString()); }}
                    className="w-7 h-7 rounded-full bg-sidebar shadow-md border border-border flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:text-red-700 hover:scale-110 transition-all duration-150"
                    title="Delete node"
                >
                    <FiTrash2 className="text-xs" />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <FiLink className="text-emerald-500 text-xs" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Resource</span>
            </div>

            <div className="font-bold text-sm text-text mb-1">{data.title}</div>

            {(data.content || data.description) && (
                <div className="text-xs text-text/70 mb-2 line-clamp-2">{data.content || data.description}</div>
            )}

            {data.url && (
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-700 font-medium bg-emerald-500/10 px-2 py-1 rounded-md hover:bg-emerald-500/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FiLink className="text-[10px]" />
                    Open Link
                </a>
            )}

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-bg !-top-1.5" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-bg !-bottom-1.5" />
        </div>
    );
};

export default memo(ResourceNode);
