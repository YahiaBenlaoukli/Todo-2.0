import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Node, Edge, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '../components/Navbar';

function RoadMap() {

    const initialNodes = [
        {
            id: 'n1',
            position: { x: 0, y: 0 },
            data: { label: 'Node 1' },
            type: 'input',
        },
        {
            id: 'n2',
            position: { x: 100, y: 100 },
            data: { label: 'Node 2' },
            type: 'output',
        },
    ];

    const initialEdges = [
        { id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'smoothstep', label: 'connects With' },
    ];
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), [])
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])
    const connect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );




    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Navbar />
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={connect} fitView panOnScroll={true} selectionOnDrag={true} panOnDrag={false}>
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );

}
export default RoadMap;