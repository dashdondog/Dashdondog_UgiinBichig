'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeMouseHandler,
} from 'reactflow';
import dagre from '@dagrejs/dagre';
import 'reactflow/dist/style.css';
import { FamilyMember } from '../types/family';
import { seedMembers } from '../data/seedData';
import MemberDetail from './MemberDetail';

interface Props {
  searchQuery: string;
}

const NODE_W = 160;
const NODE_H = 100;

function buildDagreLayout(members: FamilyMember[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 80 });

  members.forEach((m) => g.setNode(m.id, { width: NODE_W, height: NODE_H }));
  members.forEach((m) => {
    m.childrenIds.forEach((cid) => {
      if (members.find((x) => x.id === cid)) g.setEdge(m.id, cid);
    });
  });

  dagre.layout(g);

  const positions: Map<string, { x: number; y: number }> = new Map();
  members.forEach((m) => {
    const node = g.node(m.id);
    if (node) positions.set(m.id, { x: node.x - NODE_W / 2, y: node.y - NODE_H / 2 });
  });
  return positions;
}

export default function FamilyTree({ searchQuery }: Props) {
  const members = seedMembers;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMember = selectedId ? members.find((m) => m.id === selectedId) : null;

  const buildGraph = useCallback(() => {
    const positions = buildDagreLayout(members);
    const lowerQ = searchQuery.toLowerCase();

    const newNodes: Node[] = members.map((m) => {
      const pos = positions.get(m.id) || { x: 0, y: 0 };
      const highlighted = !!searchQuery && m.name.toLowerCase().includes(lowerQ);
      const isSelected = m.id === selectedId;
      return {
        id: m.id,
        position: pos,
        data: {
          label: (
            <div
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all cursor-pointer
                ${isSelected
                  ? 'border-green-600 bg-green-50 shadow-lg shadow-green-200'
                  : highlighted
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-green-200 bg-white hover:border-green-400 hover:shadow-md'}`}
              style={{ width: NODE_W - 8 }}
            >
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover border-2 border-green-200" />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2
                  ${m.gender === 'female' ? 'bg-pink-50 border-pink-200' : 'bg-blue-50 border-blue-200'}`}>
                  {m.gender === 'female' ? '👩' : '👨'}
                </div>
              )}
              <p className="font-semibold text-xs text-gray-800 text-center leading-tight">{m.name}</p>
              {m.birthDate && (
                <p className="text-[10px] text-gray-400">
                  {new Date(m.birthDate).getFullYear()}
                  {m.deathDate && `–${new Date(m.deathDate).getFullYear()}`}
                </p>
              )}
            </div>
          ),
        },
        style: { background: 'transparent', border: 'none', padding: 0, width: NODE_W, height: NODE_H },
        type: 'default',
      };
    });

    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();
    members.forEach((m) => {
      m.childrenIds.forEach((cid) => {
        const key = `${m.id}→${cid}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          newEdges.push({
            id: key,
            source: m.id,
            target: cid,
            type: 'smoothstep',
            style: { stroke: '#16a34a', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
          });
        }
      });
      m.spouseIds.forEach((sid) => {
        const key = [m.id, sid].sort().join('♥');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          newEdges.push({
            id: key,
            source: m.id,
            target: sid,
            type: 'straight',
            style: { stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '5,4' },
            label: '♥',
            labelStyle: { fill: '#dc2626', fontSize: 12 },
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [members, searchQuery, selectedId, setNodes, setEdges]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  const handleNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.05}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background color="#dcfce7" gap={20} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => {
              const m = members.find((x) => x.id === n.id);
              if (!m) return '#16a34a';
              return m.gender === 'female' ? '#f9a8d4' : '#93c5fd';
            }}
            maskColor="rgba(255,255,255,0.6)"
          />
        </ReactFlow>
      </div>

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
