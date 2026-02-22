import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactFlow, addEdge, Background, Controls, MiniMap, useNodesState, useEdgesState, Node, Edge, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '../components/Navbar';
import TaskNode from '../components/FlowNodes/TaskNode';
import ResourceNode from '../components/FlowNodes/ResourceNode';
import NoteNode from '../components/FlowNodes/NoteNode';
import MilestoneNode from '../components/FlowNodes/MilestoneNode';
import { NODE_TYPES, type NodeType } from '../../electron/services/types';
import type { Roadmap } from '../../electron/services/types';
import { FiPlus, FiTrash2, FiArrowLeft, FiMap, FiEdit2 } from 'react-icons/fi';


function RoadMap() {
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
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

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoadmapName, setNewRoadmapName] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Edit node modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<any>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');



    const fetchRoadmaps = async () => {
        const response: any = await window.ipcRenderer.invoke('get-roadmaps')
        if (response.status === 'success') {
            console.log('Fetched roadmaps:', response.data)
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
            setDeleteConfirmId(null);
        } else {
            console.error('Failed to delete roadmap:', response.message)
        }
    }

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoadmapName.trim()) return;
        handleAddRoadmap(newRoadmapName.trim());
        setNewRoadmapName('');
        setShowCreateModal(false);
    }

    const handleSelectRoadmap = (roadmap: Roadmap) => {
        setSelectedRoadmap(roadmap);
        setNodes([]);
        setEdges([]);
    }

    const handleBackToLanding = () => {
        setSelectedRoadmap(null);
        setNodes([]);
        setEdges([]);
    }

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = useMemo(() => ({
        custom: TaskNode,
        taskNode: TaskNode,
        noteNode: NoteNode,
        resourceNode: ResourceNode,
        milestoneNode: MilestoneNode,
    }), []);

    const getNodeTypeString = (type: NodeType): string => {
        switch (type) {
            case NODE_TYPES.TASKNODE: return 'taskNode';
            case NODE_TYPES.NOTENODE: return 'noteNode';
            case NODE_TYPES.RESOURCENODE: return 'resourceNode';
            case NODE_TYPES.MILESTONENODE: return 'milestoneNode';
            default: return 'custom';
        }
    };

    const handleDeleteNode = async (nodeId: string) => {
        const response: any = await window.ipcRenderer.invoke('delete-node', nodeId);
        if (response.status === 'success') {
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        } else {
            console.error('Failed to delete node:', response.message);
        }
    };

    const openEditModal = (nodeData: any) => {
        setEditingNode(nodeData);
        setEditTitle(nodeData.title || '');
        setEditContent(nodeData.description || nodeData.content || '');
        setIsEditModalOpen(true);
    };

    const handleUpdateNode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNode) return;

        const node = nodes.find((n) => n.id === editingNode.id?.toString());
        if (!node) return;

        const response: any = await window.ipcRenderer.invoke(
            'update-node',
            editingNode.id.toString(),
            editTitle,
            editContent,
            editingNode.status || 'pending',
            editingNode.type,
            node.position.x,
            node.position.y
        );

        if (response.status === 'success') {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === editingNode.id?.toString()
                        ? {
                            ...n,
                            data: {
                                ...n.data,
                                title: editTitle,
                                description: editContent,
                                content: editContent,
                                onDelete: handleDeleteNode,
                                onEdit: openEditModal,
                            },
                        }
                        : n
                )
            );
            setIsEditModalOpen(false);
            setEditingNode(null);
        } else {
            console.error('Failed to update node:', response.message);
        }
    };

    const fetchNodes = async (roadmapId: number) => {
        const response: any = await window.ipcRenderer.invoke('get-roadmap-nodes', roadmapId)
        if (response.status === 'success') {
            const nodesData = response.data;
            const formattedNodes = nodesData.map((node: any) => ({
                id: node.id.toString(),
                type: getNodeTypeString(node.type_id),
                position: { x: node.position_x, y: node.position_y },
                data: {
                    id: node.id,
                    title: node.title,
                    description: node.content,
                    status: node.status,
                    roadmapId: node.roadmap_id,
                    type: node.type_id,
                    url: node.url,
                    dueDate: node.due_date,
                    created_at: node.created_at,
                    updated_at: node.updated_at || null,
                    onDelete: handleDeleteNode,
                    onEdit: openEditModal,
                },
            }));
            setNodes(formattedNodes);
        } else {
            console.error('Failed to fetch nodes:', response.message)
        }
    }

    useEffect(() => {
        if (selectedRoadmap) {
            fetchNodes(selectedRoadmap.id);
        }
    }, [selectedRoadmap]);


    const handleAddNode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nodeTitle.trim()) return;

        switch (nodeType) {
            case NODE_TYPES.TASKNODE:
                const taslResponse: any = await window.ipcRenderer.invoke('add-task-node', selectedRoadmap?.id, nodeTitle, nodeDescription, 'pending', nodeType, position.x, position.y)

                if (taslResponse.status === 'success') {
                    const newNodeData = taslResponse.data;

                    const newNode: Node = {
                        id: newNodeData.id.toString(),
                        type: getNodeTypeString(nodeType),
                        position: { x: newNodeData.position_x, y: newNodeData.position_y },
                        data: {
                            id: newNodeData.id,
                            title: newNodeData.title,
                            description: newNodeData.content,
                            status: newNodeData.status,
                            roadmapId: newNodeData.roadmap_id,
                            type: newNodeData.type_id,
                            created_at: newNodeData.created_at,
                            updated_at: newNodeData.updated_at || null,
                            onDelete: handleDeleteNode,
                            onEdit: openEditModal,
                        },
                    };
                    setNodes((nds) => nds.concat(newNode));
                }
                break;
            case NODE_TYPES.NOTENODE:
                const noteResponse: any = await window.ipcRenderer.invoke('add-note-node', selectedRoadmap?.id, nodeTitle, nodeDescription, nodeType, position.x, position.y)
                if (noteResponse.status === 'success') {
                    const newNodeData = noteResponse.data;

                    const newNode: Node = {
                        id: newNodeData.id.toString(),
                        type: getNodeTypeString(nodeType),
                        position: { x: newNodeData.position_x, y: newNodeData.position_y },
                        data: {
                            id: newNodeData.id,
                            title: newNodeData.title,
                            description: newNodeData.content,
                            status: newNodeData.status,
                            roadmapId: newNodeData.roadmap_id,
                            type: newNodeData.type_id,
                            created_at: newNodeData.created_at,
                            updated_at: newNodeData.updated_at || null,
                            onDelete: handleDeleteNode,
                            onEdit: openEditModal,
                        },
                    };
                    setNodes((nds) => nds.concat(newNode));
                }
                break;
            case NODE_TYPES.RESOURCENODE:
                const resourceResponse: any = await window.ipcRenderer.invoke('add-resource-node', selectedRoadmap?.id, nodeTitle, nodeDescription, nodeUrl, nodeType, position.x, position.y)
                if (resourceResponse.status === 'success') {
                    const newNodeData = resourceResponse.data;

                    const newNode: Node = {
                        id: newNodeData.id.toString(),
                        type: getNodeTypeString(nodeType),
                        position: { x: newNodeData.position_x, y: newNodeData.position_y },
                        data: {
                            id: newNodeData.id,
                            title: newNodeData.title,
                            description: newNodeData.content,
                            status: newNodeData.status,
                            roadmapId: newNodeData.roadmap_id,
                            type: newNodeData.type_id,
                            url: newNodeData.url,
                            created_at: newNodeData.created_at,
                            updated_at: newNodeData.updated_at || null,
                            onDelete: handleDeleteNode,
                            onEdit: openEditModal,
                        },
                    };
                    setNodes((nds) => nds.concat(newNode));
                }
                break;
            case NODE_TYPES.MILESTONENODE:
                console.log('Adding milestone with due date:', nodeDueDate);
                const milestoneResponse: any = await window.ipcRenderer.invoke('add-milestone-node', selectedRoadmap?.id, nodeTitle, nodeDescription, nodeDueDate, nodeType, position.x, position.y)
                if (milestoneResponse.status === 'success') {
                    const newNodeData = milestoneResponse.data;

                    const newNode: Node = {
                        id: newNodeData.id.toString(),
                        type: getNodeTypeString(nodeType),
                        position: { x: newNodeData.position_x, y: newNodeData.position_y },
                        data: {
                            id: newNodeData.id,
                            title: newNodeData.title,
                            description: newNodeData.content,
                            status: newNodeData.status,
                            roadmapId: newNodeData.roadmap_id,
                            type: newNodeData.type_id,
                            dueDate: newNodeData.due_date,
                            created_at: newNodeData.created_at,
                            updated_at: newNodeData.updated_at || null,
                            onDelete: handleDeleteNode,
                            onEdit: openEditModal,
                        },
                    };
                    setNodes((nds) => nds.concat(newNode));
                }
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
        (event: MouseEvent | React.MouseEvent) => {
            event.preventDefault();
            const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
            setPosition(flowPos);
            setIsMenuOpen(true);
        },
        [screenToFlowPosition],
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    if (!selectedRoadmap) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                <div className={`${isSidebarOpen ? 'md:ml-64' : 'ml-0'} min-h-screen transition-all duration-300`}>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-4xl font-bold text-secondary mb-2">My Roadmaps</h1>
                                <p className="text-accent">Plan your learning journeys and projects</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <FiPlus className="text-xl" />
                                <span className="font-medium">New Roadmap</span>
                            </button>
                        </div>

                        {roadmaps.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-gray-300 mb-4 flex justify-center">
                                    <FiMap className="text-6xl" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900">No roadmaps yet</h3>
                                <p className="text-gray-500 mt-2">Get started by creating your first roadmap above.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 min-h-[200px] cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                        <FiPlus className="text-3xl text-primary" />
                                    </div>
                                    <span className="text-lg font-medium text-primary/70 group-hover:text-primary transition-colors">
                                        Create New Roadmap
                                    </span>
                                </button>

                                {roadmaps.map((roadmap) => (
                                    <div
                                        key={roadmap.id}
                                        className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[200px] cursor-pointer overflow-hidden"
                                        onClick={() => handleSelectRoadmap(roadmap)}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/60 rounded-t-2xl"></div>

                                        <div className="mt-2">
                                            <div className="flex items-start justify-between">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                                                    <FiMap className="text-xl text-primary" />
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteRoadmap(roadmap.id);
                                                    }}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                    title="Delete roadmap"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>

                                            <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors duration-300">
                                                {roadmap.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                            <span className="text-sm text-accent">
                                                {formatDate(roadmap.created_at)}
                                            </span>
                                            <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                Open →
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
                        <div className="absolute inset-0" onClick={() => { setShowCreateModal(false); setNewRoadmapName(''); }}></div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 transform transition-all scale-100 relative z-10 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FiMap className="text-xl text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">New Roadmap</h2>
                            </div>

                            <form onSubmit={handleCreateSubmit}>
                                <div className="mb-6">
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Roadmap Name</label>
                                    <input
                                        type="text"
                                        value={newRoadmapName}
                                        onChange={(e) => setNewRoadmapName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g. Learn React, Backend Roadmap..."
                                        autoFocus
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setShowCreateModal(false); setNewRoadmapName(''); }}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deleteConfirmId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
                        <div className="absolute inset-0" onClick={() => setDeleteConfirmId(null)}></div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 transform transition-all scale-100 relative z-10 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <FiTrash2 className="text-xl text-red-500" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Roadmap</h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete this roadmap? This action cannot be undone and all nodes within it will be lost.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteRoadmap(deleteConfirmId)}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex flex-col">
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

            {/* Edit Node Modal */}
            {isEditModalOpen && editingNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
                    <div className="absolute inset-0" onClick={() => { setIsEditModalOpen(false); setEditingNode(null); }}></div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 transform transition-all scale-100 relative z-10 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FiEdit2 className="text-xl text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Node</h2>
                        </div>

                        <form onSubmit={handleUpdateNode}>
                            <div className="mb-4">
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                                    placeholder="Node title"
                                    autoFocus
                                />
                            </div>

                            <div className="mb-6">
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="Brief description..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditModalOpen(false); setEditingNode(null); }}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex-1 w-full h-full relative">
                <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
                    <button
                        onClick={handleBackToLanding}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60 text-secondary hover:bg-white hover:shadow-xl transition-all duration-200 group"
                    >
                        <FiArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
                        <span className="font-medium text-sm">Back</span>
                    </button>

                    <div className="px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60">
                        <div className="flex items-center gap-2">
                            <FiMap className="text-primary" />
                            <span className="font-bold text-secondary text-sm">{selectedRoadmap.name}</span>
                        </div>
                    </div>
                </div>

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
