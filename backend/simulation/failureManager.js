/**
 * Failure Manager & Prediction Engine
 * Handles node failures, recovery, and predictive alerts
 */

/**
 * Fail a node: set status to 'failed' and deactivate its edges
 */
const failNode = (nodes, edges, nodeId, reason = 'manual') => {
  const updatedNodes = nodes.map(n => 
    n.id === nodeId ? { ...n, status: 'failed', battery: 0, failureReason: reason } : n
  );
  
  const updatedEdges = edges.map(e => 
    (e.source === nodeId || e.target === nodeId) 
      ? { ...e, active: false } 
      : e
  );
  
  return { nodes: updatedNodes, edges: updatedEdges };
};

/**
 * Recover a node (bring it back online)
 */
const recoverNode = (nodes, edges, nodeId) => {
  const updatedNodes = nodes.map(n => 
    n.id === nodeId ? { ...n, status: 'active', battery: 100, failureReason: null } : n
  );
  
  const updatedEdges = edges.map(e => 
    (e.source === nodeId || e.target === nodeId) 
      ? { ...e, active: true } 
      : e
  );
  
  return { nodes: updatedNodes, edges: updatedEdges };
};

/**
 * ML-style prediction: detect if node is likely to fail
 * Based on sensor anomalies and battery level
 */
const predictNodeFailure = (node) => {
  const alerts = [];
  let riskScore = 0;

  // Check battery level
  if (node.battery < 15) {
    alerts.push(`Battery critical: ${node.battery.toFixed(1)}%`);
    riskScore += 40;
  } else if (node.battery < 30) {
    alerts.push(`Battery low: ${node.battery.toFixed(1)}%`);
    riskScore += 20;
  }

  // Check sensor anomalies
  const { temperature, humidity, vibration, smoke, airQuality } = node.sensors;

  // Temperature extremes
  if (temperature.status === 'alert') {
    alerts.push(`Temperature critical: ${temperature.value}${temperature.unit}`);
    riskScore += 25;
  } else if (temperature.status === 'warning') {
    alerts.push(`Temperature abnormal: ${temperature.value}${temperature.unit}`);
    riskScore += 10;
  }

  // Humidity extremes
  if (humidity.status === 'alert') {
    alerts.push(`Humidity critical: ${humidity.value}${humidity.unit}`);
    riskScore += 20;
  } else if (humidity.status === 'warning') {
    alerts.push(`Humidity abnormal: ${humidity.value}${humidity.unit}`);
    riskScore += 5;
  }

  // Vibration spikes
  if (vibration.status === 'alert') {
    alerts.push(`Vibration alert: ${vibration.value}${vibration.unit}`);
    riskScore += 30;
  } else if (vibration.status === 'warning') {
    alerts.push(`Vibration detected: ${vibration.value}${vibration.unit}`);
    riskScore += 15;
  }

  // Smoke detection
  if (smoke.value) {
    alerts.push('Smoke detected!');
    riskScore += 50;
  }

  // Air quality
  if (airQuality.status === 'alert') {
    alerts.push(`Air quality critical: ${airQuality.value} AQI`);
    riskScore += 20;
  } else if (airQuality.status === 'warning') {
    alerts.push(`Air quality poor: ${airQuality.value} AQI`);
    riskScore += 10;
  }

  // Determine prediction
  let prediction = 'healthy';
  if (riskScore >= 50) {
    prediction = 'critical';
  } else if (riskScore >= 30) {
    prediction = 'warning';
  } else if (riskScore >= 15) {
    prediction = 'caution';
  }

  return {
    nodeId: node.id,
    riskScore,
    prediction,
    alerts,
    likelihood: Math.min(100, riskScore)
  };
};

/**
 * Generate prediction alerts for all nodes
 */
const generatePredictions = (nodes) => {
  return nodes
    .map(node => predictNodeFailure(node))
    .filter(pred => pred.riskScore > 0 && pred.alerts.length > 0);
};

/**
 * Handle automatic node recovery after delay
 */
const scheduleRecovery = (nodeId, delayMs = 3000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nodeId);
    }, delayMs);
  });
};

/**
 * Simulate a network-wide disaster: fail multiple random nodes
 */
const simulateDisaster = (nodes, edges, failureCount = 2) => {
  const activeNodeIds = nodes.filter(n => n.status === 'active').map(n => n.id);
  
  if (activeNodeIds.length === 0) {
    return { nodes, edges };
  }

  const nodesToFail = Array.from({ length: Math.min(failureCount, activeNodeIds.length) })
    .map(() => activeNodeIds[Math.floor(Math.random() * activeNodeIds.length)])
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  let updatedNodes = nodes;
  let updatedEdges = edges;

  nodesToFail.forEach(nodeId => {
    const result = failNode(updatedNodes, updatedEdges, nodeId);
    updatedNodes = result.nodes;
    updatedEdges = result.edges;
  });

  return { nodes: updatedNodes, edges: updatedEdges, failedNodes: nodesToFail };
};

/**
 * Reset all nodes to normal state
 */
const resetNetwork = (nodes, edges) => {
  const updatedNodes = nodes.map(n => ({
    ...n,
    status: 'active',
    battery: 100,
    failureReason: null
  }));
  
  const updatedEdges = edges.map(e => ({
    ...e,
    active: true
  }));

  return { nodes: updatedNodes, edges: updatedEdges };
};

module.exports = {
  failNode,
  recoverNode,
  predictNodeFailure,
  generatePredictions,
  scheduleRecovery,
  simulateDisaster,
  resetNetwork
};
