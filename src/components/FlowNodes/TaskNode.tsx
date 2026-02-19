import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';
import { FiCheckSquare } from 'react-icons/fi';

const TaskNode = ({ data }: { data: { roadmapId: number; description?: string; title: string; content?: string; type: NodeType; status?: 'pending' | 'in-progress' | 'completed'; } }) => {
    const statusConfig = {
        'completed': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
        'pending': { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
    };
    const status = data.status ? statusConfig[data.status] : statusConfig['pending'];

    return (
        <div className="relative px-4 py-3 shadow-lg rounded-xl bg-white border-l-4 border-blue-500 min-w-[180px] max-w-[260px] hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                    <FiCheckSquare className="text-blue-600 text-xs" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Task</span>
            </div>

            <div className="font-bold text-sm text-gray-800 mb-1">{data.title}</div>

            {data.content && (
                <div className="text-xs text-gray-500 mb-2 line-clamp-2">{data.content}</div>
            )}

            {data.status && (
                <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></div>
                    {data.status}
                </div>
            )}

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !-top-1.5" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !-bottom-1.5" />
        </div>
    );
};

export default memo(TaskNode);
