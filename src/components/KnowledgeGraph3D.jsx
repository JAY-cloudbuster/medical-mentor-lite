import React, { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

// Colors for node types based on requirement
const NODE_COLORS = {
  disease: '#ff50fc',   // using secondary (pinkish) or red
  symptom: '#eab308',   // yellow
  drug: '#43f3f6',      // primary (blueish)
  concept: '#bf81ff'    // purple (tertiary)
};

const NodeMesh = React.memo(({ node, position, isCentral, onSelect }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const color = NODE_COLORS[node.type] || '#ffffff';
  const radius = isCentral ? 0.8 : 0.5;

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(node);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto'; // Reset before navigation
    navigate(`/graph/${encodeURIComponent(node.label)}`);
  };

  // Pulse effect using useFrame
  useFrame(({ clock }) => {
    if (hovered && meshRef.current) {
        meshRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 6) * 0.1;
        meshRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 6) * 0.1;
        meshRef.current.scale.z = 1 + Math.sin(clock.elapsedTime * 6) * 0.1;
    } else if (meshRef.current) {
        meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered || isCentral ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Node Label */}
      <Text
        position={[0, radius + 0.3, 0]}
        fontSize={isCentral ? 0.4 : 0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.label}
      </Text>
    </group>
  );
});

const Edge = React.memo(({ start, end }) => {
  const points = [[start.x, start.y, start.z], [end.x, end.y, end.z]];
  return (
    <Line 
        points={points} 
        color="#ffffff" 
        lineWidth={1.5} 
        opacity={0.3} 
        transparent 
    />
  );
});

const KnowledgeGraph3D = ({ term }) => {
  const { graphData, setSelectedNode } = useAppStore();

  const layout = useMemo(() => {
    if (!graphData || !graphData.nodes) return { nodePos: {}, edges: [] };
    
    const nodePos = {};
    const radius = 5;
    
    // Find central node (matches term, or just the first node)
    let centralNodeIndex = graphData.nodes.findIndex(n => n.label.toLowerCase() === term.toLowerCase());
    if (centralNodeIndex === -1 && graphData.nodes.length > 0) {
        centralNodeIndex = 0;
    }

    const otherNodes = [];
    let centralNode = null;

    graphData.nodes.forEach((node, idx) => {
        if (idx === centralNodeIndex) {
            centralNode = node;
            nodePos[node.id] = new THREE.Vector3(0, 0, 0);
        } else {
            otherNodes.push(node);
        }
    });

    // Radial layout for others
    const totalOthers = otherNodes.length;
    otherNodes.forEach((node, i) => {
        const angle = (i / totalOthers) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        // Add random scatter to Y for 3D depth aesthetic
        const y = (Math.random() - 0.5) * 3;
        nodePos[node.id] = new THREE.Vector3(x, y, z);
    });

    const edges = graphData.edges?.map((edge, i) => {
        const sourcePos = nodePos[edge.source];
        const targetPos = nodePos[edge.target];
        if (sourcePos && targetPos) {
            return { id: `edge-${i}`, start: sourcePos, end: targetPos };
        }
        return null;
    }).filter(Boolean) || [];

    return { nodePos, edges, nodes: graphData.nodes, centralNodeId: centralNode?.id };
  }, [graphData, term]);

  if (!graphData) return null;

  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#43f3f6" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff50fc" />
      
      {/* Render Edges */}
      {layout.edges.map(edge => (
        <Edge key={edge.id} start={edge.start} end={edge.end} />
      ))}

      {/* Render Nodes */}
      {layout.nodes.map(node => (
        <NodeMesh 
            key={node.id} 
            node={node} 
            position={layout.nodePos[node.id]} 
            isCentral={node.id === layout.centralNodeId}
            onSelect={setSelectedNode}
        />
      ))}

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={20}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default KnowledgeGraph3D;
