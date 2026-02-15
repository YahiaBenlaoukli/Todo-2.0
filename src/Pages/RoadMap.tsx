import { useCallback, useMemo } from 'react';
import { ReactFlow, addEdge, Background, Controls, MiniMap, useNodesState, useEdgesState, Node, Edge, NodeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '../components/Navbar';
import TaskNode from '../components/FlowNodes/TaskNode';
import { NODE_TYPES, type NodeType } from '../../electron/services/types';

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { title: 'Project Initiation', description: 'Define scope and objectives', status: 'completed', roadmapId: 1, type: NODE_TYPES.TASKNODE },
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 0, y: 150 },
        data: { title: 'Planning', description: 'Create roadmap and allocate resources', status: 'in-progress', roadmapId: 1, type: NODE_TYPES.TASKNODE },
    },
    {
        id: '3',
        type: 'custom',
        position: { x: 0, y: 300 },
        data: { title: 'Development', description: 'Start coding and implementation', status: 'pending', roadmapId: 1, type: NODE_TYPES.TASKNODE },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
];



function RoadMap() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = useMemo(() => ({ custom: TaskNode }), []);

    const handleAddNode = () => {
        const newNode: Node = {
            id: `node-${Date.now()}`,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { title: 'New Task', description: 'Task description', status: 'pending', type: NODE_TYPES.TASKNODE, roadmapId: 1 },
            type: 'custom',
        }
        setNodes((nds: Node[]) => [...nds, newNode]);
    }

    return (
        <div className="w-screen h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
                <div className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-md text-sm text-gray-500">
                    <button
                        onClick={handleAddNode}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2"
                    >
                        <span>+</span> Add Node
                    </button>
                    <p>Click and drag to create nodes. Connect them to build your roadmap!</p>
                </div>
            </div>
        </div>
    );
}

export default RoadMap;
