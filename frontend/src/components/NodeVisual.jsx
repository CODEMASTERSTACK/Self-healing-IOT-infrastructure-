/**
 * Professional Tower Node Visualization
 * Displays IoT nodes as communication towers with organized sensors
 */

import React, { useState } from 'react';

const NodeVisual = ({ node, x, y, onClick, onSensorClick }) => {
  const [hoveredSensor, setHoveredSensor] = useState(null);

  const getTowerColor = () => {
    if (node.status === 'active') return '#10b981'; // green
    if (node.status === 'failed') return '#ef4444'; // red
    return '#f59e0b'; // amber
  };

  const getSensorColor = (sensorName) => {
    const sensor = node.sensors[sensorName];
    if (sensor.status === 'alert') return '#dc2626';
    if (sensor.status === 'warning') return '#f59e0b';
    return '#6b7280';
  };

  const sensorConfigs = [
    { 
      name: 'temperature', 
      label: 'Temperature', 
      angle: 0,
      icon: '🌡️'
    },
    { 
      name: 'humidity', 
      label: 'Humidity', 
      angle: 72,
      icon: '💧'
    },
    { 
      name: 'vibration', 
      label: 'Vibration', 
      angle: 144,
      icon: '📳'
    },
    { 
      name: 'smoke', 
      label: 'Smoke Detector', 
      angle: 216,
      icon: '💨'
    },
    { 
      name: 'airQuality', 
      label: 'Air Quality', 
      angle: 288,
      icon: '🌫️'
    }
  ];

  const sensorRadius = 45;
  const towerSize = 28;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Tower Structure with shadow */}
      <g filter="drop-shadow(0 2px 8px rgba(0,0,0,0.15))">
        {/* Tower base (trapezoid) */}
        <polygon
          points={`${x - 12},${y + towerSize / 2} ${x + 12},${y + towerSize / 2} ${x + 8},${y - towerSize / 2} ${x - 8},${y - towerSize / 2}`}
          fill={getTowerColor()}
          opacity="0.95"
        />

        {/* Tower antenna */}
        <line
          x1={x}
          y1={y - towerSize / 2}
          x2={x}
          y2={y - towerSize / 2 - 16}
          stroke={getTowerColor()}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={x} cy={y - towerSize / 2 - 16} r="2.5" fill={getTowerColor()} />

        {/* Tower highlight for 3D effect */}
        <polygon
          points={`${x - 10},${y + towerSize / 2 - 2} ${x - 8},${y - towerSize / 2 + 2} ${x - 6},${y - towerSize / 2 + 2} ${x - 8},${y + towerSize / 2 - 2}`}
          fill="white"
          opacity="0.25"
        />
      </g>

      {/* Node ID label above tower */}
      <text
        x={x}
        y={y - towerSize / 2 - 25}
        textAnchor="middle"
        fontSize="13"
        fontWeight="bold"
        fill="#1e293b"
      >
        Node {node.id}
      </text>

      {/* Node ID inside tower */}
      <text
        x={x}
        y={y + 3}
        textAnchor="middle"
        fontSize="13"
        fontWeight="bold"
        fill="white"
        pointerEvents="none"
      >
        {node.id}
      </text>

      {/* Battery indicator at base */}
      <circle
        cx={x}
        cy={y + towerSize / 2 + 10}
        r="5.5"
        fill={node.battery > 30 ? '#10b981' : node.battery > 15 ? '#f59e0b' : '#ef4444'}
        stroke="white"
        strokeWidth="1.5"
        opacity="0.95"
      />
      <text
        x={x}
        y={y + towerSize / 2 + 13}
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="white"
        pointerEvents="none"
      >
        {node.battery.toFixed(0)}
      </text>

      {/* Sensors arranged in circle */}
      {sensorConfigs.map((sensor, idx) => {
        const angle = (sensor.angle * Math.PI) / 180;
        const sensorX = x + sensorRadius * Math.cos(angle);
        const sensorY = y + sensorRadius * Math.sin(angle);
        const sensorColor = getSensorColor(sensor.name);
        const sensorValue = node.sensors[sensor.name];
        const isHovered = hoveredSensor === sensor.name;

        return (
          <g key={sensor.name}>
            {/* Connector line */}
            <line
              x1={x}
              y1={y}
              x2={sensorX}
              y2={sensorY}
              stroke={sensorColor}
              strokeWidth="1.2"
              strokeDasharray="3,3"
              opacity="0.3"
            />

            {/* Sensor circle */}
            <circle
              cx={sensorX}
              cy={sensorY}
              r={isHovered ? 8.5 : 7}
              fill={sensorColor}
              opacity={isHovered ? 1 : 0.85}
              stroke="white"
              strokeWidth="1.5"
              onMouseEnter={() => setHoveredSensor(sensor.name)}
              onMouseLeave={() => setHoveredSensor(null)}
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
              }}
              filter="drop-shadow(0 1px 3px rgba(0,0,0,0.1))"
            />

            {/* Sensor icon/emoji */}
            <text
              x={sensorX}
              y={sensorY + 3}
              textAnchor="middle"
              fontSize="16"
              fill="white"
              pointerEvents="none"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                userSelect: 'none',
              }}
            >
              {sensor.icon}
            </text>

            {/* Sensor click handler - invisible click area */}
            <circle
              cx={sensorX}
              cy={sensorY}
              r={7}
              fill="transparent"
              stroke="none"
              style={{ 
                cursor: 'pointer', 
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSensorClick) {
                  onSensorClick({
                    type: sensor.name,
                    value: sensorValue.value,
                    status: sensorValue.status,
                    unit: sensorValue.unit,
                    nodeId: node.id,
                  });
                }
              }}
              onMouseEnter={() => setHoveredSensor(sensor.name)}
              onMouseLeave={() => setHoveredSensor(null)}
            />

            {/* Sensor tooltip */}
            {isHovered && (
              <g>
                {/* Tooltip background */}
                <rect
                  x={sensorX - 55}
                  y={sensorY - 38}
                  width="110"
                  height="70"
                  rx="6"
                  fill="rgba(15,23,42,0.95)"
                  stroke={sensorColor}
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                />

                {/* Sensor label */}
                <text
                  x={sensorX}
                  y={sensorY - 22}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={sensorColor}
                >
                  {sensor.label}
                </text>

                {/* Sensor value */}
                <text
                  x={sensorX}
                  y={sensorY - 6}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="white"
                >
                  {sensorValue.value.toFixed(1)}
                  <tspan fontSize="10" fill={sensorColor}>
                    {sensorValue.unit}
                  </tspan>
                </text>

                {/* Status indicator */}
                <text
                  x={sensorX}
                  y={sensorY + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={
                    sensorValue.status === 'alert'
                      ? '#ef4444'
                      : sensorValue.status === 'warning'
                      ? '#f59e0b'
                      : '#10b981'
                  }
                >
                  {sensorValue.status?.toUpperCase() || 'NORMAL'}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Selection ring */}
      {node.isSelected && (
        <circle
          cx={x}
          cy={y}
          r="68"
          fill="none"
          stroke={getTowerColor()}
          strokeWidth="1.5"
          strokeDasharray="5,5"
          opacity="0.5"
          style={{ animation: 'pulse-ring 2s infinite' }}
        />
      )}
    </g>
  );
};

export default NodeVisual;
