import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';
import { FiFlag, FiEdit2, FiTrash2 } from 'react-icons/fi';

const MilestoneNode = ({ data }: { data: { id: number; roadmapId: number; description?: string; title: string; content?: string; type: NodeType; status?: 'pending' | 'in-progress' | 'completed'; dueDate?: string; onDelete?: (id: string) => void; onEdit?: (data: any) => void; } }) => {
    const isOverdue = data.dueDate && new Date(data.dueDate) < new Date();

    return (
        <div className="group relative px-4 py-3 shadow-lg rounded-xl bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500 min-w-[180px] max-w-[260px] hover:shadow-xl transition-shadow">
            {/* Hover action buttons */}
            <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); data.onEdit?.(data); }}
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-purple-500 hover:bg-purple-50 hover:text-purple-700 hover:scale-110 transition-all duration-150"
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
                <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                    <FiFlag className="text-purple-600 text-xs" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Milestone</span>
            </div>

            <div className="font-bold text-sm text-gray-800 mb-1">{data.title}</div>

            {data.content && (
                <div className="text-xs text-gray-500 mb-2 line-clamp-2">{data.content}</div>
            )}

            {data.dueDate && (
                <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                    <FiFlag className="text-[9px]" />
                    {isOverdue ? 'Overdue: ' : 'Due: '}
                    {new Date(data.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            )}

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !-top-1.5" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !-bottom-1.5" />
        </div>
    );
};

export default memo(MilestoneNode);
