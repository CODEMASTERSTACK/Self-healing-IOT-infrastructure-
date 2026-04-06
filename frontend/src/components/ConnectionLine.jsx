/**
 * Professional Connection Line Component
 * Renders network edges (LoRa and ESP Mesh) with status indication
 */

import React from 'react';

const ConnectionLine = ({ edge, sourcePos, targetPos }) => {
  if (!sourcePos || !targetPos) return null;

  const { x: x1, y: y1 } = sourcePos;
  const { x: x2, y: y2 } = targetPos;

  const isActive = edge.active;
  const opacity = isActive ? 0.85 : 0.2;
  const strokeWidth = edge.type === 'lora' ? 2 : 1.5;
  const strokeDasharray = edge.type === 'lora' ? '4,4' : 'none';
  const color = edge.type === 'lora' ? '#3b82f6' : '#06b6d4';

  const gradientId = `gradient-${edge.source}-${edge.target}`;

  return (
    <g key={`line-${edge.source}-${edge.target}`}>
      {/* Gradient definition for smooth transitions */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={isActive ? 0.2 : 0.1} />
          <stop offset="50%" stopColor={color} stopOpacity={isActive ? 0.9 : 0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={isActive ? 0.2 : 0.1} />
        </linearGradient>
      </defs>

      {/* Background line (for glow effect) */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth + 3}
        strokeDasharray={strokeDasharray}
        opacity={isActive ? 0.15 : 0}
        style={{ transition: 'opacity 0.3s ease' }}
      />

      {/* Main connection line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
        style={{
          transition: 'opacity 0.3s ease',
          filter: isActive ? `drop-shadow(0 0 3px ${color})` : 'none'
        }}
      />

      {/* Active connection indicators */}
      {isActive && (
        <>
          {/* Center indicator */}
          <circle
            cx={(x1 + x2) / 2}
            cy={(y1 + y2) / 2}
            r="3.5"
            fill={color}
            opacity="0.7"
          />

          {/* LoRa strength indicators */}
          {edge.type === 'lora' && (
            <>
              <circle
                cx={(x1 + x2) / 2 - 25}
                cy={(y1 + y2) / 2}
                r="2"
                fill={color}
                opacity="0.4"
              />
              <circle
                cx={(x1 + x2) / 2 + 25}
                cy={(y1 + y2) / 2}
                r="2"
                fill={color}
                opacity="0.4"
              />
            </>
          )}

          {/* Connection type label */}
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 - 10}
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill={color}
            opacity="0.75"
            style={{ pointerEvents: 'none' }}
          >
            {edge.type === 'lora' ? 'LoRa' : 'Mesh'}
          </text>
        </>
      )}

      {/* Inactive state indicator */}
      {!isActive && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2}
          textAnchor="middle"
          fontSize="8"
          fill="#ef4444"
          opacity="0.6"
          fontWeight="600"
          style={{ pointerEvents: 'none' }}
        >
          ✕
        </text>
      )}

      {/* Tooltip */}
      <title>
        {edge.type === 'lora' ? 'LoRa Connection' : 'ESP32 Mesh'}
        {` | Latency: ${edge.latency}ms | Strength: ${edge.strength}% | Status: ${isActive ? 'Active' : 'Failed'}`}
      </title>
    </g>
  );
};

export default ConnectionLine;
