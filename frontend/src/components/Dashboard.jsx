/**
 * Professional Network Dashboard Component
 * Displays real-time node metrics and system status
 */

import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import ThermometerIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/Opacity';
import VibrateIcon from '@mui/icons-material/Vibration';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import WarningIcon from '@mui/icons-material/Warning';

const Dashboard = ({ nodes }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => [...prev.slice(-29)]);
    }, 1000);
    return () => clearInterval(interval);
  }, [nodes]);

  const getFailureReasonDisplay = (reason) => {
    const reasons = {
      landslide: { icon: '▲', color: 'text-orange-600', bg: 'bg-orange-50' },
      tornado: { icon: '◍', color: 'text-purple-600', bg: 'bg-purple-50' },
      earthquake: { icon: '≈', color: 'text-red-600', bg: 'bg-red-50' },
      flood: { icon: '◈', color: 'text-blue-600', bg: 'bg-blue-50' },
      fire: { icon: '◆', color: 'text-orange-700', bg: 'bg-orange-50' },
      storm: { icon: '⤒', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    };
    return reasons[reason] || { icon: '?', color: 'text-slate-600', bg: 'bg-slate-50' };
  };

  return (
    <div className="space-y-3 bg-gradient-to-b from-white to-slate-50 rounded-xl border-2 border-slate-300 p-4 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-2">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="text-xl">📊</span>
          Status
        </h3>
        <p className="text-xs text-slate-600 mt-1">Real-time metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-300 p-2.5 rounded-lg shadow-md">
          <div className="text-xs text-green-700 font-bold uppercase">Active</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{nodes.filter(n => n.status === 'active').length}/{nodes.length}</div>
          <div className="text-xs text-green-600">online</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-rose-50 border-2 border-red-300 p-2.5 rounded-lg shadow-md">
          <div className="text-xs text-red-700 font-bold uppercase">Failed</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{nodes.filter(n => n.status === 'failed').length}</div>
          <div className="text-xs text-red-600">offline</div>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-300 p-2.5 rounded-lg shadow-md">
          <div className="text-xs text-amber-700 font-bold uppercase">Battery</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{(nodes.reduce((sum, n) => sum + n.battery, 0) / nodes.length).toFixed(0)}%</div>
          <div className="text-xs text-amber-600">avg</div>
        </div>
      </div>

      {/* Node Details */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase">Node Details</div>
        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
          {nodes.map(node => (
            <div
              key={`node-detail-${node.id}`}
              className={`p-2.5 rounded-lg border-2 transition-all shadow-sm ${
                node.status === 'active'
                  ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                  : node.status === 'failed'
                  ? 'border-red-400 bg-gradient-to-br from-red-50 to-rose-50'
                  : 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50'
              }`}
            >
              {/* Node header */}
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-sm text-slate-900">Node {node.id}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  node.status === 'active'
                    ? 'bg-green-200 text-green-800'
                    : node.status === 'failed'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-amber-200 text-amber-800'
                }`}>
                  {node.status === 'active' ? '✓ Active' : node.status === 'failed' ? '✕ Failed' : '⚡ Warning'}
                </span>
              </div>

              {/* Failure reason if failed */}
              {node.failureReason && node.status === 'failed' && (
                <div className={`mb-1.5 p-1 rounded text-center text-xs font-bold ${getFailureReasonDisplay(node.failureReason).bg} ${getFailureReasonDisplay(node.failureReason).color}`}>
                  <span className="mr-1">{getFailureReasonDisplay(node.failureReason).icon}</span>
                  <span className="text-xs">{node.failureReason.toUpperCase()}</span>
                </div>
              )}

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1 p-1 bg-white bg-opacity-60 rounded">
                  <BatteryFullIcon sx={{ fontSize: 14, color: node.battery > 30 ? '#10b981' : '#ef4444' }} />
                  <span className="text-slate-700 font-semibold text-xs">{node.battery.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-white bg-opacity-60 rounded">
                  <ThermometerIcon sx={{ fontSize: 14, color: '#f97316' }} />
                  <span className="text-slate-700 font-semibold text-xs">{node.sensors.temperature.value.toFixed(1)}°</span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-white bg-opacity-60 rounded">
                  <WaterDropIcon sx={{ fontSize: 14, color: '#0891b2' }} />
                  <span className="text-slate-700 font-semibold text-xs">{node.sensors.humidity.value.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-white bg-opacity-60 rounded">
                  <VibrateIcon sx={{ fontSize: 14, color: '#eab308' }} />
                  <span className="text-slate-700 font-semibold text-xs">{node.sensors.vibration.value.toFixed(1)}G</span>
                </div>
              </div>

              {/* Sensor status indicators */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {node.sensors.temperature.status !== 'normal' && (
                  <div className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold" title="Temperature Alert">T</div>
                )}
                {node.sensors.humidity.status !== 'normal' && (
                  <div className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold" title="Humidity Alert">H</div>
                )}
                {node.sensors.vibration.status !== 'normal' && (
                  <div className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-bold" title="Vibration Alert">V</div>
                )}
                {node.sensors.smoke.value && (
                  <div className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold" title="Smoke Detected">S</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-2.5 text-xs text-blue-900 space-y-1 shadow-md">
        <div className="font-bold flex items-center gap-2 text-blue-950">
          <WarningIcon sx={{ fontSize: 16 }} />
          <span className="text-xs">Routing: Dijkstra</span>
        </div>
        <div className="text-blue-800 text-xs ml-5">Reroutes via active nodes</div>
      </div>
    </div>
  );
};

export default Dashboard;

