import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeProps,
  Handle,
  Position,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NetworkData } from '../../types';
import { getRiskHexColor } from '../../utils';

const CustomNode = ({ data }: NodeProps) => {
  const riskColor = getRiskHexColor(data.riskLevel as string);
  
  return (
    <div className="px-4 py-2 shadow-sm rounded-md bg-white border-2 min-w-[150px] text-center" style={{ borderColor: riskColor }}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" style={{ background: riskColor }} />
      <div className="font-bold text-[#3b2b20] text-sm">{data.label as string}</div>
      <div className="text-xs text-[#8c7a6b] mt-1">{data.id as string}</div>
      <div className="text-[10px] uppercase font-bold mt-2 px-2 py-0.5 rounded-full inline-block" style={{ color: riskColor, backgroundColor: `${riskColor}20` }}>
        {data.riskLevel as string}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" style={{ background: riskColor }} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface NetworkGraphProps {
  data: NetworkData;
  onNodeClick?: (nodeId: string) => void;
}

export function NetworkGraph({ data, onNodeClick }: NetworkGraphProps) {
  // Simple auto-layout for demo purposes (circular/grid layout)
  const initialNodes = useMemo(() => {
    return data.nodes.map((node, i) => {
      // Very basic static layout: central node and surrounding nodes
      const isCenter = i === 0;
      const angle = (i - 1) * (2 * Math.PI) / (data.nodes.length - 1 || 1);
      const radius = 250;
      
      return {
        id: node.id,
        type: 'custom',
        position: isCenter ? { x: 400, y: 300 } : { x: 400 + radius * Math.cos(angle), y: 300 + radius * Math.sin(angle) },
        data: { ...node },
      };
    });
  }, [data.nodes]);

  const initialEdges = useMemo(() => {
    return data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: `₹${(edge.amount / 1000).toFixed(0)}k`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8c7a6b', strokeWidth: 2 },
      labelStyle: { fill: '#3b2b20', fontWeight: 500 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#8c7a6b',
      },
    }));
  }, [data.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  return (
    <div className="w-full h-full bg-[#fdfbf7] rounded-lg border border-[#e6e2d8]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls className="bg-white border-[#e6e2d8] fill-[#3b2b20]" />
        <MiniMap 
          nodeStrokeColor={(n) => {
            return getRiskHexColor(n.data?.riskLevel as string);
          }}
          nodeColor={(n) => '#ffffff'}
          maskColor="rgba(253, 251, 247, 0.7)"
          className="bg-[#f5f4ef] border border-[#e6e2d8]"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#e6e2d8" />
      </ReactFlow>
    </div>
  );
}
