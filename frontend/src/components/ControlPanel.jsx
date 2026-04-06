/**
 * Professional Control Panel Component
 * Provides interactive controls for simulation with Disaster modes
 */

import React, { useState } from 'react';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloudIcon from '@mui/icons-material/Cloud';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';

const ControlPanel = ({ nodes, sendCommand }) => {
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [modalNodeId, setModalNodeId] = useState(null);

  const failureConditions = [
    { id: 'landslide', label: 'Landslide', icon: '▲', description: 'Structural collapse' },
    { id: 'tornado', label: 'Tornado', icon: '◍', description: 'Strong winds' },
    { id: 'earthquake', label: 'Earthquake', icon: '≈', description: 'Ground vibration' },
    { id: 'flood', label: 'Flood', icon: '◈', description: 'Water damage' },
    { id: 'fire', label: 'Wildfire', icon: '◆', description: 'Heat damage' },
    { id: 'storm', label: 'Lightning Storm', icon: '⤒', description: 'Power surge' },
  ];

  const handleNodeToggle = (nodeId, currentStatus) => {
    if (currentStatus === 'active') {
      // Show condition modal to fail the node
      setModalNodeId(nodeId);
      setShowConditionModal(true);
    } else if (currentStatus === 'failed') {
      // Recover the node
      handleRecoverNode(nodeId);
    }
  };

  const handleFailNode = (nodeId, reason = null) => {
    sendCommand({
      action: 'fail-node',
      nodeId,
      reason: reason || 'manual'
    });
    setShowConditionModal(false);
    setModalNodeId(null);
  };

  const handleRecoverNode = (nodeId) => {
    sendCommand({
      action: 'recover-node',
      nodeId
    });
  };

  const handleReset = () => {
    sendCommand({ action: 'reset' });
    setSelectedNode(null);
  };

  const activeNodes = nodes.filter(n => n.status === 'active');
  const failedNodes = nodes.filter(n => n.status === 'failed');

  return (
    <div className="space-y-4 bg-gradient-to-b from-white to-slate-50 border-2 border-slate-300 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <MobileScreenShareIcon sx={{ fontSize: 24, color: '#334155' }} />
          Network Control
        </h3>
        <p className="text-xs text-slate-600 mt-2">Manage node states and simulate disasters</p>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-300 rounded-lg p-4 shadow-md">
          <div className="text-xs text-green-700 font-bold uppercase tracking-wider">Active</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{activeNodes.length}</div>
          <div className="text-xs text-green-600 mt-1">● nodes online</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-rose-50 border-2 border-red-300 rounded-lg p-4 shadow-md">
          <div className="text-xs text-red-700 font-bold uppercase tracking-wider">Failed</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{failedNodes.length}</div>
          <div className="text-xs text-red-600 mt-1">⚠️ offline</div>
        </div>
      </div>

      {/* Node Control Buttons */}
      <div className="space-y-3">
        <div className="text-sm font-bold text-slate-800 uppercase tracking-widest">Node Management</div>
        <div className="grid grid-cols-2 gap-2">
          {nodes.map(node => (
            <button
              key={`node-btn-${node.id}`}
              onClick={() => handleNodeToggle(node.id, node.status)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center font-semibold text-sm ${
                node.status === 'active'
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:shadow-md'
                  : node.status === 'failed'
                  ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:shadow-md'
                  : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <PowerSettingsNewIcon sx={{ fontSize: 16 }} />
                Node {node.id}
              </div>
              <div className="text-xs font-normal mt-1 capitalize">
                {node.status === 'active' ? 'Fail' : node.status === 'failed' ? 'Recover' : 'Warning'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="space-y-3">
        <div className="text-sm font-bold text-slate-800 uppercase tracking-widest">Disaster Scenarios</div>
        <button
          onClick={() => {
            if (activeNodes.length > 0) {
              const randomNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
              setModalNodeId(randomNode.id);
              setShowConditionModal(true);
            }
          }}
          disabled={activeNodes.length === 0}
          className="w-full px-4 py-3 bg-gradient-to-r from-orange-200 via-orange-100 to-amber-100 text-orange-800 hover:from-orange-300 hover:to-amber-200 border-2 border-orange-300 rounded-lg text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <CloudIcon sx={{ fontSize: 18, color: '#92400e' }} />
          ⚡ Random Failure
        </button>

        <button
          onClick={() => {
            if (activeNodes.length >= 2) {
              const nodesToFail = activeNodes.slice(0, 2);
              nodesToFail.forEach((node, i) => {
                setTimeout(() => {
                  handleFailNode(node.id, 'disaster');
                }, i * 300);
              });
            }
          }}
          disabled={activeNodes.length < 2}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-200 via-red-100 to-rose-100 text-red-800 hover:from-red-300 hover:to-rose-200 border-2 border-red-300 rounded-lg text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <WarningAmberIcon sx={{ fontSize: 18, color: '#7f1d1d' }} />
          🚨 Multi-Node Disaster
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-3 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-800 hover:from-slate-300 hover:to-slate-200 border-2 border-slate-400 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <RestartAltIcon sx={{ fontSize: 18 }} />
        🔄 Reset All Nodes
      </button>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4 text-xs text-blue-900 shadow-md">
        <strong className="text-blue-950">💡 Note:</strong> Failed nodes require manual recovery. System reroutes data using Dijkstra's shortest path algorithm.
      </div>

      {/* Condition Selection Modal */}
      {showConditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border-2 border-slate-300">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Select Failure Scenario</h3>
              <p className="text-sm text-slate-600 mt-3">What caused Node {modalNodeId} to fail?</p>
            </div>

            {/* Condition Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {failureConditions.map(condition => (
                <button
                  key={condition.id}
                  onClick={() => handleFailNode(modalNodeId, condition.id)}
                  className="p-4 border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-3xl font-bold text-slate-700 mb-2">{condition.icon}</div>
                  <div className="text-sm font-bold text-slate-900">{condition.label}</div>
                  <div className="text-xs text-slate-600 mt-2">{condition.description}</div>
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <button
              onClick={() => setShowConditionModal(false)}
              className="w-full px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-all border-2 border-slate-300"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
