import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';
import { FiFileText } from 'react-icons/fi';

const NoteNode = ({ data }: { data: { roadmapId: number; description?: string; title: string; content?: string; type: NodeType; } }) => {
    return (
        <div className="relative px-4 py-3 shadow-lg rounded-xl bg-amber-50 border-l-4 border-amber-400 min-w-[180px] max-w-[260px] hover:shadow-xl transition-shadow">
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
