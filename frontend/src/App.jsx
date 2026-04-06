/**
 * Main App Component
 * Orchestrates all components and manages WebSocket connection
 */

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useWebSocket from './hooks/useWebSocket';
import NetworkGraph from './components/NetworkGraph';
import Dashboard from './components/Dashboard';
import ControlPanel from './components/ControlPanel';
import DataRouting from './components/DataRouting';
import SensorInfo from './components/SensorInfo';

function App() {
  const {
    nodes,
    edges,
    activePackets,
    predictions,
    connected,
    error,
    sendCommand,
    networkState
  } = useWebSocket('ws://localhost:5000');

  const [previousFailures, setPreviousFailures] = useState(new Set());
  const [showMobileWarning, setShowMobileWarning] = useState(window.innerWidth < 1024);
  const [showedConnectionAlert, setShowedConnectionAlert] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorInfoOpen, setSensorInfoOpen] = useState(false);

  // Handle connection status (only show once)
  useEffect(() => {
    if (connected && !showedConnectionAlert) {
      toast.success('✓ Connected to simulation server', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true
      });
      setShowedConnectionAlert(true);
    }
  }, [connected, showedConnectionAlert]);

  // Handle sensor click
  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setSensorInfoOpen(true);
  };

  // Handle node failures only (not all predictions)
  useEffect(() => {
    nodes.forEach(node => {
      const failureKey = `node-${node.id}-${node.status}`;
      
      if (node.status === 'failed' && !previousFailures.has(failureKey)) {
        const condition = node.failureReason || 'Unknown';
        toast.error(`🔴 Node ${node.id} FAILED (${condition}) - Starting self-healing...`, {
          position: 'top-right',
          autoClose: 5000
        });
        setPreviousFailures(prev => new Set([...prev, failureKey]));
      } else if (node.status === 'active' && previousFailures.has(`node-${node.id}-failed`)) {
        // Node recovered
        toast.success(`✅ Node ${node.id} RECOVERED - Infrastructure healed!`, {
          position: 'top-right',
          autoClose: 4000
        });
        setPreviousFailures(prev => {
          const updated = new Set(prev);
          updated.delete(`node-${node.id}-failed`);
          return updated;
        });
      }
    });
  }, [nodes, previousFailures]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setShowMobileWarning(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!connected) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h1 className="text-3xl font-bold text-white mb-4">Connecting...</h1>
          <p className="text-slate-400 mb-6">
            Make sure the backend server is running on port 5000
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          {error && (
            <p className="text-red-400 text-sm">
              Error: {error.message || 'Connection failed'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Warning */}
      {showMobileWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-3 text-center text-sm text-yellow-800 z-50">
          ⚠️ This simulation works best on larger screens (1024px+). Some features may be cramped.
        </div>
      )}

      {/* Main Layout */}
      <div className="flex h-screen gap-4 p-4" style={{ marginTop: showMobileWarning ? '50px' : '0' }}>
        {/* Left Sidebar - Control Panel & Data Routing */}
        <div className="w-80 overflow-y-auto space-y-4">
          <ControlPanel
            nodes={nodes}
            sendCommand={sendCommand}
          />
          <DataRouting
            nodes={nodes}
            networkState={networkState}
          />
        </div>

        {/* Center - Network Visualization */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <NetworkGraph
              nodes={nodes}
              edges={edges}
              activePackets={activePackets}
              onSensorClick={handleSensorClick}
            />
          </div>
          
          {/* Status Bar */}
          <div className="mt-3 bg-white rounded-lg border border-slate-200 p-3 flex justify-between items-center text-xs text-slate-600">
            <div>
              <span className="font-semibold">Active Nodes:</span>
              <span className="ml-2 text-green-600">
                {nodes.filter(n => n.status === 'active').length}/{nodes.length}
              </span>
            </div>
            <div>
              <span className="font-semibold">Packets in Transit:</span>
              <span className="ml-2 text-blue-600">{activePackets.length}</span>
            </div>
            <div>
              <span className="font-semibold">Status:</span>
              <span className={`ml-2 font-mono ${connected ? 'text-green-600' : 'text-red-600'}`}>
                {connected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Dashboard */}
        <div className="w-80 overflow-y-auto">
          <Dashboard
            nodes={nodes}
            predictions={predictions}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />

      {/* Sensor Info Modal */}
      <SensorInfo
        open={sensorInfoOpen}
        onClose={() => {
          setSensorInfoOpen(false);
          setSelectedSensor(null);
        }}
        sensor={selectedSensor}
        nodeId={selectedSensor?.nodeId}
      />

      {/* Footer */}
      <div className="fixed bottom-4 left-4 text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200">
        IoT Self-Healing Infrastructure Simulation v1.0
      </div>
    </div>
  );
}

export default App;
