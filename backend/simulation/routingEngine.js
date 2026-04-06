/**
 * Routing Engine
 * Implements Dijkstra algorithm for shortest path routing with fallback
 */

const { getActiveNodes, getAdjacentNodes } = require('./networkGraph');

/**
 * Build adjacency list from edges considering only active connections
 */
const buildAdjacencyList = (edges, activeNodeIds) => {
  const adj = {};
  
  edges.forEach(edge => {
    // Only consider edges between active nodes
    if (activeNodeIds.includes(edge.source) && activeNodeIds.includes(edge.target) && edge.active) {
      if (!adj[edge.source]) adj[edge.source] = [];
      if (!adj[edge.target]) adj[edge.target] = [];
      
      adj[edge.source].push({
        node: edge.target,
        distance: edge.latency,
        type: edge.type
      });
      adj[edge.target].push({
        node: edge.source,
        distance: edge.latency,
        type: edge.type
      });
    }
  });
  
  return adj;
};

/**
 * Dijkstra's algorithm - find shortest path from source to target
 */
const dijkstra = (adj, source, target) => {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialize distances
  for (const node in adj) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(parseInt(node));
  }
  distances[source] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let minDistance = Infinity;

    // Find unvisited node with minimum distance
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || current === target) break;
    unvisited.delete(current);

    // Update distances for neighbors
    if (adj[current]) {
      for (const neighbor of adj[current]) {
        const newDistance = distances[current] + neighbor.distance;
        if (newDistance < distances[neighbor.node]) {
          distances[neighbor.node] = newDistance;
          previous[neighbor.node] = current;
        }
      }
    }
  }

  // Reconstruct path
  if (distances[target] === Infinity) {
    return { path: [], distance: Infinity };
  }

  const path = [];
  let current = target;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, distance: distances[target] };
};

/**
 * Find all active paths from source to target (BFS for alternative routes)
 */
const findAllPaths = (adj, source, target, visited = new Set(), currentPath = []) => {
  currentPath.push(source);
  visited.add(source);

  if (source === target) {
    return [currentPath.slice()];
  }

  let paths = [];
  if (adj[source]) {
    for (const neighbor of adj[source]) {
      if (!visited.has(neighbor.node)) {
        const foundPaths = findAllPaths(adj, neighbor.node, target, new Set(visited), currentPath);
        paths = paths.concat(foundPaths);
      }
    }
  }

  currentPath.pop();
  return paths;
};

/**
 * Compute route from source node to destination (laptop/dashboard)
 * Returns primary and fallback routes
 */
const computeRoute = (nodes, edges, sourceNodeId, destinationNodeId = 0) => {
  const activeNodeIds = getActiveNodes(nodes);
  
  // If source or destination is not active, return empty route
  if (!activeNodeIds.includes(sourceNodeId)) {
    return {
      primary: [],
      fallback: [],
      available: false,
      reason: 'Source node is not active'
    };
  }

  const adj = buildAdjacencyList(edges, activeNodeIds);

  // Get primary route (shortest path)
  const primaryResult = dijkstra(adj, sourceNodeId, destinationNodeId);
  
  // If primary route found, remove first and last nodes to simplify
  const primaryPath = primaryResult.path.length > 0 
    ? primaryResult.path.slice(0, -1) // Remove destination placeholder
    : [];

  // Get all alternative paths
  const allPaths = findAllPaths(adj, sourceNodeId, destinationNodeId);
  let fallbackPath = [];
  
  if (allPaths.length > 1) {
    // Get the second-shortest or different path
    const fallback = allPaths.find(p => p.join('-') !== primaryPath.join('-'));
    fallbackPath = fallback ? fallback.slice(0, -1) : [];
  }

  return {
    primary: primaryPath,
    fallback: fallbackPath,
    available: primaryPath.length > 0,
    distance: primaryResult.distance,
    reason: primaryPath.length > 0 ? 'Route available' : 'No route available'
  };
};

/**
 * Find next hop from current node towards destination
 */
const getNextHop = (adj, currentNode, destinationNode) => {
  const result = dijkstra(adj, currentNode, destinationNode);
  if (result.path.length > 1) {
    return result.path[1]; // Next node in path
  }
  return null;
};

/**
 * Calculate total latency of a route
 */
const calculateRouteLatency = (edges, path) => {
  let totalLatency = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const source = path[i];
    const target = path[i + 1];
    
    const edge = edges.find(
      e => (e.source === source && e.target === target) ||
           (e.source === target && e.target === source)
    );
    
    if (edge) {
      totalLatency += edge.latency;
    }
  }
  
  return totalLatency;
};

module.exports = {
  buildAdjacencyList,
  dijkstra,
  findAllPaths,
  computeRoute,
  getNextHop,
  calculateRouteLatency
};
