import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactFlow, addEdge, Background, Controls, MiniMap, useNodesState, useEdgesState, Node, Edge, NodeChange, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '../components/Navbar';
import TaskNode from '../components/FlowNodes/TaskNode';
import ResourceNode from '../components/FlowNodes/ResourceNode';
import NoteNode from '../components/FlowNodes/NoteNode';
import MilestoneNode from '../components/FlowNodes/MilestoneNode';
import { NODE_TYPES, type NodeType } from '../../electron/services/types';
import type { TaskNode as TaskNodeType, NoteNode as NoteNodeType, ResourceNode as ResourceNodeType, MilestoneNode as MilestoneNodeType, Roadmap } from '../../electron/services/types';
import { ipcMain } from 'electron';


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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { screenToFlowPosition } = useReactFlow();

    const [nodeTitle, setNodeTitle] = useState('');
    const [nodeDescription, setNodeDescription] = useState('');
    const [nodeType, setNodeType] = useState<NodeType>(NODE_TYPES.TASKNODE);
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const [nodeUrl, setNodeUrl] = useState('');
    const [nodeDueDate, setNodeDueDate] = useState('');


    const fetchRoadmaps = async () => {
        const response: any = await window.ipcRenderer.invoke('get-roadmaps')
        if (response.status === 'success') {
            setRoadmaps(response.data)
        } else {
            console.error('Failed to fetch roadmaps:', response.message)
        }
    }
    useEffect(() => {
        fetchRoadmaps()
    }, [])


    const handleAddRoadmap = async (name: string) => {
        const response: any = await window.ipcRenderer.invoke('add-roadmap', name)
        if (response.status === 'success') {
            fetchRoadmaps()
        } else {
            console.error('Failed to add roadmap:', response.message)
        }
    }

    const handleDeleteRoadmap = async (id: number) => {
        const response: any = await window.ipcRenderer.invoke('delete-roadmap', id)
        if (response.status === 'success') {
            fetchRoadmaps()
        } else {
            console.error('Failed to delete roadmap:', response.message)
        }
    }





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

    const handleAddNode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nodeTitle.trim()) return;

        switch (nodeType) {
            case NODE_TYPES.TASKNODE:
                const response: any = await window.ipcRenderer.invoke('add-task-node', selectedRoadmap?.id, nodeTitle, nodeDescription, 'pending', nodeType, position.x, position.y)

                if (response.status === 'success') {
                    const newNodeData = response.data;

                    const newNode: Node = {
                        id: newNodeData.id.toString(),
                        type: 'custom',
                        position: { x: newNodeData.position_x, y: newNodeData.position_y },
                        data: {
                            id: newNodeData.id,
                            title: newNodeData.title,
                            description: newNodeData.content,
                            status: newNodeData.status,
                            roadmapId: newNodeData.roadmap_id,
                            type: newNodeData.type_id,
                            created_at: newNodeData.created_at,
                            updated_at: newNodeData.updated_at || null
                        },
                    };
                    setNodes((nds) => nds.concat(newNode));
                }
                break;
            case NODE_TYPES.NOTENODE:
                await window.ipcRenderer.invoke('add-note-node', selectedRoadmap?.id, nodeTitle, nodeDescription, nodeType, position.x, position.y)
                //todo later
                break;
            case NODE_TYPES.RESOURCENODE:
                await window.ipcRenderer.invoke('add-resource-node', selectedRoadmap?.id, nodeTitle, nodeDescription, nodeUrl, nodeType, position.x, position.y)
                //todo later
                break;
            case NODE_TYPES.MILESTONENODE:
                await window.ipcRenderer.invoke('add-milestone-node', selectedRoadmap?.id, nodeTitle, nodeDescription, nodeDueDate, nodeType, position.x, position.y)
                //todo later
                break;
            default:
                break;
        }

        closeMenu();
    }

    const closeMenu = () => {
        setIsMenuOpen(false);
        setNodeTitle('');
        setNodeDescription('');
        setNodeType(NODE_TYPES.TASKNODE);
        setNodeUrl('');
        setNodeDueDate('');
    }

    const handlePaneRightClick = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
            setPosition(flowPos);
            setIsMenuOpen(true);
        },
        [screenToFlowPosition],
    );




    return (
        <div className="w-screen h-screen flex flex-col">
            <Navbar />

            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
                    <div className="absolute inset-0" onClick={closeMenu}></div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 transform transition-all scale-100 relative z-10 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Add New Node</h2>

                        <form onSubmit={handleAddNode}>
                            <div className="mb-4">
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Title</label>
                                <input
                                    type="text"
                                    value={nodeTitle}
                                    onChange={(e) => setNodeTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                                    placeholder="e.g. Research Phase"
                                    autoFocus
                                />
                            </div>

                            <div className="mb-4">
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
                                <textarea
                                    value={nodeDescription}
                                    onChange={(e) => setNodeDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="Brief description..."
                                    rows={3}
                                />
                            </div>

                            <div className="mb-6">
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Type</label>
                                <select
                                    value={nodeType}
                                    onChange={(e) => setNodeType(Number(e.target.value) as NodeType)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                                >
                                    <option value={NODE_TYPES.TASKNODE}>Task</option>
                                    <option value={NODE_TYPES.NOTENODE}>Note</option>
                                    <option value={NODE_TYPES.RESOURCENODE}>Resource</option>
                                    <option value={NODE_TYPES.MILESTONENODE}>Milestone</option>
                                </select>
                            </div>

                            {nodeType === NODE_TYPES.RESOURCENODE && (
                                <div className="mb-4 animate-fadeIn">
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Resource URL</label>
                                    <input
                                        type="url"
                                        value={nodeUrl}
                                        onChange={(e) => setNodeUrl(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            )}

                            {nodeType === NODE_TYPES.MILESTONENODE && (
                                <div className="mb-4 animate-fadeIn">
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Due Date</label>
                                    <input
                                        type="date"
                                        value={nodeDueDate}
                                        onChange={(e) => setNodeDueDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeMenu}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                                >
                                    Add Node
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
