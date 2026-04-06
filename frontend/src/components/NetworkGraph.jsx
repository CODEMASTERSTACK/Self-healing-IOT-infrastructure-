/**
 * Professional Network Graph Component
 * Displays nodes, edges, and animated data packets with Dijkstra routing
 */

import React, { useMemo } from 'react';
import ConnectionLine from './ConnectionLine';
import DataPacket from './DataPacket';
import NodeVisual from './NodeVisual';

const NetworkGraph = ({ nodes, edges, activePackets, onSensorClick }) => {
  const svgWidth = 600;
  const svgHeight = 400;

  // Calculate node positions in a circle
  const nodePositions = useMemo(() => {
    const positions = {};
    const padding = 70;
    const canvasWidth = svgWidth - padding * 2;
    const canvasHeight = svgHeight - padding * 2;

    const nodeCount = nodes.length;
    nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(canvasWidth, canvasHeight) / 2 - 10;
      positions[node.id] = {
        x: padding + canvasWidth / 2 + radius * Math.cos(angle),
        y: padding + canvasHeight / 2 + radius * Math.sin(angle),
        node
      };
    });

    return positions;
  }, [nodes]);

  // Dashboard/monitoring station position
  const dashboardPosition = {
    x: svgWidth / 2,
    y: svgHeight - 25,
    node: { id: 0, label: 'Monitoring' }
  };

  // Count active/failed nodes for status
  const activeNodeCount = nodes.filter(n => n.status === 'active').length;
  const failedNodeCount = nodes.filter(n => n.status === 'failed').length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="w-full h-full"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {/* Define gradients and filters */}
        <defs>
          {/* Subtle background pattern */}
          <pattern id="dotPattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="#cbd5e1" opacity="0.1" />
          </pattern>

          {/* Glow effect for towers */}
          <filter id="towerGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow for data packets */}
          <filter id="packetGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Background */}
        <rect 
          width={svgWidth} 
          height={svgHeight} 
          fill="white"
        />
        <rect 
          width={svgWidth} 
          height={svgHeight} 
          fill="url(#dotPattern)" 
        />

        {/* Center connection hub indicator */}
        <circle
          cx={svgWidth / 2}
          cy={svgHeight / 2}
          r="3"
          fill="#0f172a"
          opacity="0.1"
        />

        {/* Connection lines (edges) */}
        {edges.map(edge => (
          <ConnectionLine
            key={`edge-${edge.source}-${edge.target}`}
            edge={edge}
            sourcePos={nodePositions[edge.source]}
            targetPos={nodePositions[edge.target]}
          />
        ))}

        {/* Render tower nodes */}
        {Object.values(nodePositions).map(({ x, y, node }) => (
          <g key={`node-group-${node.id}`} filter="url(#shadow)">
            <NodeVisual
              node={node}
              x={x}
              y={y}
              onClick={() => {}}
              onSensorClick={onSensorClick}
            />
          </g>
        ))}

        {/* Monitoring station */}
        <g filter="url(#shadow)">
          {/* Station base circle */}
          <circle
            cx={dashboardPosition.x}
            cy={dashboardPosition.y}
            r="18"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
            opacity="0.95"
          />

          {/* Screen indicator */}
          <rect
            x={dashboardPosition.x - 10}
            y={dashboardPosition.y - 7}
            width="20"
            height="12"
            rx="2"
            fill="#0f172a"
            stroke="#64748b"
            strokeWidth="0.5"
          />

          {/* Scanlines effect */}
          <line
            x1={dashboardPosition.x - 8}
            y1={dashboardPosition.y - 3}
            x2={dashboardPosition.x + 8}
            y2={dashboardPosition.y - 3}
            stroke="#10b981"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <line
            x1={dashboardPosition.x - 8}
            y1={dashboardPosition.y}
            x2={dashboardPosition.x + 8}
            y2={dashboardPosition.y}
            stroke="#10b981"
            strokeWidth="0.5"
            opacity="0.4"
          />

          {/* Status indicator */}
          <circle
            cx={dashboardPosition.x + 12}
            cy={dashboardPosition.y - 8}
            r="2.5"
            fill={failedNodeCount > 0 ? '#ef4444' : '#10b981'}
            opacity="0.9"
          />

          {/* Label */}
          <text
            x={dashboardPosition.x}
            y={dashboardPosition.y + 25}
            textAnchor="middle"
            fontSize="11"
            fill="#475569"
            fontWeight="600"
          >
            Monitoring
          </text>
        </g>

        {/* Data packets in transit */}
        {activePackets.map(packet => (
          <DataPacket
            key={packet.id}
            packet={packet}
            sourcePos={nodePositions[packet.from]}
            targetPos={dashboardPosition}
          />
        ))}

        {/* Network status information */}
        <g>
          {/* Active nodes count */}
          <rect
            x="12"
            y="12"
            width="140"
            height="32"
            rx="6"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
            opacity="0.95"
          />
          <circle cx="24" cy="23" r="3" fill="#10b981" />
          <text
            x="32"
            y="21"
            fontSize="11"
            fill="#475569"
            fontWeight="600"
          >
            Active: <tspan fill="#10b981" fontWeight="bold">{activeNodeCount}</tspan>/{nodes.length}
          </text>
          <circle cx="24" cy="35" r="3" fill={failedNodeCount > 0 ? '#ef4444' : '#cbd5e1'} />
          <text
            x="32"
            y="37"
            fontSize="11"
            fill="#475569"
            fontWeight="600"
          >
            Failed: <tspan fill={failedNodeCount > 0 ? '#ef4444' : '#cbd5e1'} fontWeight="bold">{failedNodeCount}</tspan>
          </text>
        </g>

        {/* Packets in transit count */}
        <g>
          <rect
            x={svgWidth - 152}
            y="12"
            width="140"
            height="32"
            rx="6"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
            opacity="0.95"
          />
          <circle cx={svgWidth - 130} cy="23" r="2.5" fill="#3b82f6" />
          <text
            x={svgWidth - 122}
            y="21"
            fontSize="11"
            fill="#475569"
            fontWeight="600"
          >
            Packets: <tspan fill="#3b82f6" fontWeight="bold">{activePackets.length}</tspan>
          </text>
          <circle cx={svgWidth - 130} cy="35" r="2.5" fill="#06b6d4" />
          <text
            x={svgWidth - 122}
            y="37"
            fontSize="10"
            fill="#64748b"
            fontWeight="500"
          >
            Dijkstra routing
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NetworkGraph;
