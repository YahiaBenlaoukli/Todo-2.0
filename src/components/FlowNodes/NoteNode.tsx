import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';
import { FiFileText, FiEdit2, FiTrash2 } from 'react-icons/fi';

const NoteNode = ({ data }: { data: { id: number; roadmapId: number; description?: string; title: string; content?: string; type: NodeType; onDelete?: (id: string) => void; onEdit?: (data: any) => void; } }) => {
    return (
        <div className="group relative px-4 py-3 shadow-lg rounded-xl bg-amber-50 border-l-4 border-amber-400 min-w-[180px] max-w-[260px] hover:shadow-xl transition-shadow">
            {/* Hover action buttons */}
            <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); data.onEdit?.(data); }}
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-amber-500 hover:bg-amber-50 hover:text-amber-700 hover:scale-110 transition-all duration-150"
                    title="Edit node"
                >
                    <FiEdit2 className="text-xs" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); data.onDelete?.(data.id.toString()); }}
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-150"
                    title="Delete node"
                >
                    <FiTrash2 className="text-xs" />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                    <FiFileText className="text-amber-600 text-xs" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Note</span>
            </div>

            <div className="font-bold text-sm text-gray-800 mb-1">{data.title}</div>

            {(data.content || data.description) && (
                <div className="text-xs text-gray-600 mb-1 line-clamp-3 bg-white/60 rounded-lg p-2 border border-amber-100">
                    {data.content || data.description}
                </div>
            )}

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white !-top-1.5" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white !-bottom-1.5" />
        </div>
    );
};

export default memo(NoteNode);
