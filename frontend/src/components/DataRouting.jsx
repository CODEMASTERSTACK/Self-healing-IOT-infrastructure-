/**
 * Data Routing Component
 * Visualizes active data flow paths between nodes using Dijkstra's algorithm
 */

import React, { useMemo } from 'react';
import { ArrowRightAlt as ArrowIcon, SignalCellularAlt as RoutingIcon } from '@mui/icons-material';

const DataRouting = ({ nodes, networkState }) => {
  // Calculate active routing paths based on network state
  const activePaths = useMemo(() => {
    const paths = [];
    
    if (!networkState || !networkState.dijkstraState) return paths;

    // Get all active nodes
    const activeNodes = nodes.filter(n => n.status === 'active');
    
    // If all nodes connected, show multi-hop paths
    if (activeNodes.length > 0) {
      // Simulate data flow from each active node to others
      activeNodes.forEach(sourceNode => {
        const dijkstraInfo = networkState.dijkstraState[sourceNode.id];
        if (dijkstraInfo && dijkstraInfo.distances) {
          // Get next hop for each reachable node
          Object.entries(dijkstraInfo.distances).forEach(([targetId, distance]) => {
            const targetNode = nodes.find(n => n.id === parseInt(targetId));
            if (targetNode && targetNode.status === 'active' && sourceNode.id !== targetNode.id) {
              // Find next hop from Dijkstra results
              const nextHop = dijkstraInfo.nextHop?.[targetId];
              if (nextHop) {
                const pathKey = `${sourceNode.id}->${nextHop}`;
                const existing = paths.find(p => p.key === pathKey);
                if (!existing) {
                  paths.push({
                    key: pathKey,
                    from: sourceNode.id,
                    to: nextHop,
                    distance: parseFloat(distance).toFixed(1),
                    type: sourceNode.connections?.[nextHop]?.type || 'Unknown'
                  });
                }
              }
            }
          });
        }
      });
    }

    return paths;
  }, [nodes, networkState]);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-300 p-5 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-300 pb-4 mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <RoutingIcon sx={{ fontSize: 24, color: '#0891b2' }} />
          Data Routing Paths
        </h3>
        <p className="text-xs text-slate-600 mt-1">Active data flow using Dijkstra's algorithm</p>
      </div>

      {/* Routing Paths */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activePaths.length === 0 ? (
          <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
            <p className="text-sm text-slate-500">
              {nodes.some(n => n.status === 'active') ? 'Computing routing paths...' : 'No active nodes - routing disabled'}
            </p>
          </div>
        ) : (
          activePaths.map((path, idx) => (
            <div
              key={path.key}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* From Node */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-sm">
                {path.from}
              </div>

              {/* Arrow and Connection Type */}
              <div className="flex-1 flex items-center gap-2">
                <ArrowIcon sx={{ color: '#64748b', fontSize: 20 }} />
                <span className="text-xs font-semibold text-slate-600 px-2 py-1 bg-slate-100 rounded">
                  {path.type === 'LoRa' ? '📡 LoRa' : path.type === 'Mesh' ? '📶 Mesh' : '🔗 ' + path.type}
                </span>
              </div>

              {/* To Node */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold text-sm">
                {path.to}
              </div>

              {/* Latency */}
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 block">{path.distance}ms</span>
                <span className="text-xs text-slate-500">latency</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Routing Info */}
      <div className="mt-4 pt-4 border-t border-slate-200 bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          <strong>ℹ️ How it works:</strong> Data flows from source nodes through active neighbors to reach destination nodes. 
          When a node fails, paths automatically recalculate through remaining active connections.
        </p>
      </div>
    </div>
  );
};

export default DataRouting;
