/**
 * Network Graph Data Model
 * Defines the 4-node IoT topology with dual connectivity (LoRa + ESP Mesh)
 */

const NODE_POSITIONS = {
  1: { x: 200, y: 100 },
  2: { x: 350, y: 100 },
  3: { x: 350, y: 250 },
  4: { x: 200, y: 250 }
};

const createNetworkGraph = () => {
  // Initialize 4 nodes with sensor data
  const nodes = [1, 2, 3, 4].map(id => ({
    id,
    status: 'active', // 'active', 'failed', 'warning'
    position: NODE_POSITIONS[id],
    battery: 100,
    failureReason: null,
    sensors: {
      temperature: { value: 22 + Math.random() * 10, unit: '°C', status: 'normal' },
      humidity: { value: 50 + Math.random() * 20, unit: '%', status: 'normal' },
      vibration: { value: 0, unit: 'G', status: 'normal' },
      smoke: { value: false, unit: 'bool', status: 'normal' },
      airQuality: { value: 150 + Math.random() * 100, unit: 'AQI', status: 'normal' }
    },
    lastUpdate: Date.now()
  }));

  // Define edges: LoRa (long-range) + ESP Mesh (WiFi)
  const edges = [
    // LoRa mesh (long-range, slower)
    { source: 1, target: 2, type: 'lora', latency: 150, strength: 85, active: true },
    { source: 2, target: 3, type: 'lora', latency: 150, strength: 80, active: true },
    { source: 3, target: 4, type: 'lora', latency: 150, strength: 85, active: true },
    { source: 4, target: 1, type: 'lora', latency: 150, strength: 80, active: true },

    // ESP Mesh (WiFi, shorter range, faster)
    { source: 1, target: 3, type: 'esp_mesh', latency: 50, strength: 65, active: true },
    { source: 2, target: 4, type: 'esp_mesh', latency: 50, strength: 70, active: true }
  ];

  return { nodes, edges };
};

/**
 * Get node by ID
 */
const getNode = (nodes, nodeId) => nodes.find(n => n.id === nodeId);

/**
 * Get all edges connected to a node
 */
const getConnectedEdges = (edges, nodeId) => 
  edges.filter(e => (e.source === nodeId || e.target === nodeId) && e.active);

/**
 * Get adjacent node IDs (considering current edge status)
 */
const getAdjacentNodes = (edges, nodeId) => {
  const connected = getConnectedEdges(edges, nodeId);
  return connected.map(e => e.source === nodeId ? e.target : e.source);
};

/**
 * Check if a node is currently active in the network
 */
const isNodeActive = (nodes, nodeId) => {
  const node = getNode(nodes, nodeId);
  return node && node.status === 'active';
};

/**
 * Get all active nodes
 */
const getActiveNodes = (nodes) => nodes.filter(n => n.status === 'active').map(n => n.id);

module.exports = {
  createNetworkGraph,
  getNode,
  getConnectedEdges,
  getAdjacentNodes,
  isNodeActive,
  getActiveNodes,
  NODE_POSITIONS
};
