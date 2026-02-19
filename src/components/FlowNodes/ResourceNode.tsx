import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';
import { FiLink } from 'react-icons/fi';

const ResourceNode = ({ data }: { data: { roadmapId: number; description?: string; title: string; content?: string; type: NodeType; url?: string; } }) => {
    return (
        <div className="relative px-4 py-3 shadow-lg rounded-xl bg-white border-l-4 border-emerald-500 min-w-[180px] max-w-[260px] hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                    <FiLink className="text-emerald-600 text-xs" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Resource</span>
            </div>

            <div className="font-bold text-sm text-gray-800 mb-1">{data.title}</div>

            {(data.content || data.description) && (
                <div className="text-xs text-gray-500 mb-2 line-clamp-2">{data.content || data.description}</div>
            )}

            {data.url && (
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FiLink className="text-[10px]" />
                    Open Link
                </a>
            )}

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white !-top-1.5" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white !-bottom-1.5" />
        </div>
    );
};

export default memo(ResourceNode);
