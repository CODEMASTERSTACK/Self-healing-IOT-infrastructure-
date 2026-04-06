/**
 * Main Express Server with WebSocket Support
 * Manages the IoT simulation engine and broadcasts state to connected clients
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const { createNetworkGraph } = require('./simulation/networkGraph');
const { updateAllSensors } = require('./simulation/sensorEngine');
const { generatePredictions, failNode, recoverNode, resetNetwork } = require('./simulation/failureManager');
const { computeRoute } = require('./simulation/routingEngine');

const PORT = process.env.PORT || 5000;

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Global simulation state
let networkState = createNetworkGraph();
let activePackets = [];
let healingInProgress = false;
let predictions = [];

// Packet ID counter
let packetIdCounter = 0;

/**
 * Generate a new data packet
 */
const generatePacket = (sourceNodeId) => {
  return {
    id: `packet-${packetIdCounter++}`,
    from: sourceNodeId,
    to: 0, // 0 = laptop/dashboard
    progress: 0,
    startTime: Date.now(),
    duration: 2000 + Math.random() * 1000 // 2-3 seconds
  };
};

/**
 * Compute Dijkstra state for all nodes (routing information)
 */
const computeDijkstraState = () => {
  const { buildAdjacencyList, dijkstra } = require('./simulation/routingEngine');
  const activeNodeIds = networkState.nodes
    .filter(n => n.status === 'active')
    .map(n => n.id);
  
  const adj = buildAdjacencyList(networkState.edges, activeNodeIds);
  const dijkstraState = {};
  
  // Compute routing from each active node
  activeNodeIds.forEach(sourceId => {
    const distances = {};
    const nextHop = {};
    
    activeNodeIds.forEach(targetId => {
      if (sourceId !== targetId) {
        const route = dijkstra(adj, sourceId, targetId);
        distances[targetId] = route.distance;
        
        // Get next hop (first node after source in the path)
        if (route.path.length > 1) {
          nextHop[targetId] = route.path[1];
        }
      }
    });
    
    dijkstraState[sourceId] = { distances, nextHop };
  });
  
  return dijkstraState;
};

/**
 * Broadcast network state to all connected clients
 */
const broadcastState = () => {
  const dijkstraState = computeDijkstraState();
  
  const stateData = JSON.stringify({
    type: 'network-state',
    nodes: networkState.nodes,
    edges: networkState.edges,
    activePackets,
    healingInProgress,
    predictions,
    dijkstraState,
    timestamp: Date.now()
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(stateData);
    }
  });
};

/**
 * Update simulation step (called every 500ms)
 */
const simulationStep = () => {
  // Update sensor readings
  networkState.nodes = updateAllSensors(networkState.nodes);

  // Generate new packets from active nodes
  const activeNodes = networkState.nodes.filter(n => n.status === 'active');
  if (activeNodes.length > 0 && Math.random() < 0.7) {
    const randomNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
    activePackets.push(generatePacket(randomNode.id));
  }

  // Update packet progress
  const currentTime = Date.now();
  activePackets = activePackets
    .map(packet => ({
      ...packet,
      progress: (currentTime - packet.startTime) / packet.duration
    }))
    .filter(packet => packet.progress < 1); // Remove completed packets

  // Generate predictions
  predictions = generatePredictions(networkState.nodes);

  // Broadcast state
  broadcastState();
};

/**
 * Start simulation loop
 */
const startSimulation = () => {
  setInterval(simulationStep, 500);
  console.log('✓ Simulation started (500ms interval)');
};

/**
 * WebSocket connection handler
 */
wss.on('connection', (ws) => {
  console.log('✓ Client connected via WebSocket');

  // Send initial state
  ws.send(JSON.stringify({
    type: 'network-state',
    nodes: networkState.nodes,
    edges: networkState.edges,
    activePackets,
    predictions,
    timestamp: Date.now()
  }));

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const command = JSON.parse(message);

      switch (command.action) {
        case 'fail-node':
          const reason = command.reason || 'manual';
          console.log(`⚠️  Failing node ${command.nodeId} - Reason: ${reason}`);
          const failResult = failNode(networkState.nodes, networkState.edges, command.nodeId, reason);
          networkState.nodes = failResult.nodes;
          networkState.edges = failResult.edges;
          // Node stays failed - no auto-recovery
          broadcastState();
          break;

        case 'recover-node':
          console.log(`✓ Manually recovering node ${command.nodeId}`);
          const recoverManualResult = recoverNode(networkState.nodes, networkState.edges, command.nodeId);
          networkState.nodes = recoverManualResult.nodes;
          networkState.edges = recoverManualResult.edges;
          broadcastState();
          break;

        case 'reset':
          console.log('🔄 Resetting network');
          const resetResult = resetNetwork(networkState.nodes, networkState.edges);
          networkState.nodes = resetResult.nodes;
          networkState.edges = resetResult.edges;
          activePackets = [];
          predictions = [];
          healingInProgress = false;
          broadcastState();
          break;

        case 'get-route':
          const route = computeRoute(networkState.nodes, networkState.edges, command.sourceNodeId);
          ws.send(JSON.stringify({
            type: 'route-response',
            sourceNodeId: command.sourceNodeId,
            route
          }));
          break;

        default:
          console.log('Unknown action:', command.action);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('✓ Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// REST API Routes

/**
 * GET /api/state - Get current network state
 */
app.get('/api/state', (req, res) => {
  res.json({
    nodes: networkState.nodes,
    edges: networkState.edges,
    activePackets,
    healingInProgress,
    predictions,
    timestamp: Date.now()
  });
});

/**
 * POST /api/fail-node/:nodeId - Fail a specific node
 */
app.post('/api/fail-node/:nodeId', (req, res) => {
  const nodeId = parseInt(req.params.nodeId);
  console.log(`⚠️  Failing node ${nodeId} via REST API`);
  
  healingInProgress = true;
  const failResult = failNode(networkState.nodes, networkState.edges, nodeId);
  networkState.nodes = failResult.nodes;
  networkState.edges = failResult.edges;

  // Schedule recovery
  setTimeout(() => {
    console.log(`✓ Recovering node ${nodeId}`);
    const recoverResult = recoverNode(networkState.nodes, networkState.edges, nodeId);
    networkState.nodes = recoverResult.nodes;
    networkState.edges = recoverResult.edges;
    healingInProgress = false;
    broadcastState();
  }, 3000);

  broadcastState();

  res.json({
    message: `Node ${nodeId} failed. Recovery scheduled in 3 seconds.`,
    healingInProgress: true
  });
});

/**
 * POST /api/reset - Reset network to normal state
 */
app.post('/api/reset', (req, res) => {
  console.log('🔄 Resetting network via REST API');
  
  const resetResult = resetNetwork(networkState.nodes, networkState.edges);
  networkState = { nodes: resetResult.nodes, edges: resetResult.edges };
  activePackets = [];
  predictions = [];
  healingInProgress = false;

  broadcastState();

  res.json({
    message: 'Network reset to normal state',
    state: 'active'
  });
});

/**
 * GET /api/predictions - Get current predictions
 */
app.get('/api/predictions', (req, res) => {
  res.json({ predictions });
});

/**
 * GET /api/route/:sourceNodeId - Get route for a node
 */
app.get('/api/route/:sourceNodeId', (req, res) => {
  const sourceNodeId = parseInt(req.params.sourceNodeId);
  const route = computeRoute(networkState.nodes, networkState.edges, sourceNodeId);
  
  res.json({
    sourceNodeId,
    route,
    timestamp: Date.now()
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  IoT Self-Healing Infrastructure Simulation                ║
║  Server running on http://localhost:${PORT}                ║
║  WebSocket: ws://localhost:${PORT}                        ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  startSimulation();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
