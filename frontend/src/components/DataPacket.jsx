/**
 * DataPacket Component
 * Renders animated data packets moving from nodes to dashboard
 */

import React from 'react';

const DataPacket = ({ packet, sourcePos, targetPos }) => {
  if (!sourcePos || !targetPos || packet.progress >= 1) return null;

  const { x: x1, y: y1 } = sourcePos;
  const { x: x2, y: y2 } = targetPos;

  // Calculate packet position along path
  const currentX = x1 + (x2 - x1) * packet.progress;
  const currentY = y1 + (y2 - y1) * packet.progress;

  // Fade out as packet reaches destination
  const opacity = Math.max(0, 1 - packet.progress * 1.5);

  // Packet size changes slightly
  const size = 5 + Math.sin(packet.progress * Math.PI) * 2;

  return (
    <g key={packet.id}>
      {/* Packet main circle */}
      <circle
        cx={currentX}
        cy={currentY}
        r={size}
        fill="#22c55e"
        opacity={opacity}
        filter="url(#glow)"
        className="packet"
      />

      {/* Packet trail/glow */}
      <circle
        cx={currentX}
        cy={currentY}
        r={size * 1.5}
        fill="none"
        stroke="#22c55e"
        strokeWidth="1"
        opacity={opacity * 0.5}
        className="packet-trail"
      />

      {/* Optional: data symbol */}
      <text
        x={currentX}
        y={currentY + 1}
        textAnchor="middle"
        fontSize="4"
        fill="white"
        fontWeight="bold"
        opacity={opacity}
      >
        📦
      </text>
    </g>
  );
};

export default DataPacket;
