import { useCallback, useMemo } from 'react';
import { ReactFlow, addEdge, Background, Controls, MiniMap, useNodesState, useEdgesState, Node, Edge, NodeChange, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '../components/Navbar';
import TaskNode from '../components/FlowNodes/TaskNode';
import ResourceNode from '../components/FlowNodes/ResourceNode';
import NoteNode from '../components/FlowNodes/NoteNode';
import MilestoneNode from '../components/FlowNodes/MilestoneNode';
import { NODE_TYPES, type NodeType } from '../../electron/services/types';
import type { TaskNode as TaskNodeType, NoteNode as NoteNodeType, ResourceNode as ResourceNodeType, MilestoneNode as MilestoneNodeType } from '../../electron/services/types';


const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: { title: 'Project Initiation', description: 'Define scope and objectives', status: 'completed', roadmapId: 1, type: NODE_TYPES.TASKNODE, content: 'hi this is a tasknode' },
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
    const { screenToFlowPosition } = useReactFlow();


    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = useMemo(() => ({
        custom: TaskNode,
        [NODE_TYPES.TASKNODE]: TaskNode,
        [NODE_TYPES.NOTENODE]: NoteNode,
        [NODE_TYPES.RESOURCENODE]: ResourceNode,
        [NODE_TYPES.MILESTONENODE]: MilestoneNode,
    }), []);

    const handleAddNode = () => {
        const newNode: Node = {
            id: `node-${Date.now()}`,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { title: 'New Task', description: 'Task description', status: 'pending', type: NODE_TYPES.TASKNODE, roadmapId: 1 },
            type: 'custom',
        }
        setNodes((nds: Node[]) => [...nds, newNode]);
    }

    const handlePaneRightClick = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: `node-${Date.now()}`,
                position,
                data: {
                    title: 'New Task',
                    description: 'Task description',
                    status: 'pending',
                    type: NODE_TYPES.TASKNODE,
                    roadmapId: 1,
                },
                type: 'custom',
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, setNodes]
    );


    return (
        <div className="w-screen h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 w-full h-full relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onPaneContextMenu={handlePaneRightClick}
                    fitView
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>

            </div>
        </div>
    );
}

export default RoadMap;
