import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { type NodeType } from '../../../electron/services/types';

const TaskNode = ({ data }: { data: { roadmapId: number; description?: string; title: string; content?: string; type: NodeType; status?: 'pending' | 'in-progress' | 'completed'; url?: string, } }) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm text-gray-700">{data.title}</div>
                    {data.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${data.status === 'completed' ? 'bg-green-100 text-green-700' :
                            data.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                            {data.status}
                        </span>
                    )}
                </div>

                {data.content && (
                    <div className="text-xs text-gray-500">{data.content}</div>
                )}
            </div>

            <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
            <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
        </div>
    );
};

export default memo(TaskNode);
