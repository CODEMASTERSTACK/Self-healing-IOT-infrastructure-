/**
 * Sensor Data Simulation Engine
 * Generates realistic IoT sensor readings with natural variation
 */

/**
 * Generate realistic temperature with gradual change
 */
const generateTemperature = (previousValue = 22) => {
  const variation = (Math.random() - 0.5) * 2; // ±1°C variation
  let newValue = previousValue + variation;
  newValue = Math.max(15, Math.min(40, newValue)); // Clamp to 15-40°C
  return parseFloat(newValue.toFixed(2));
};

/**
 * Generate realistic humidity
 */
const generateHumidity = (previousValue = 60) => {
  const variation = (Math.random() - 0.5) * 3; // ±1.5% variation
  let newValue = previousValue + variation;
  newValue = Math.max(30, Math.min(90, newValue)); // Clamp to 30-90%
  return parseFloat(newValue.toFixed(2));
};

/**
 * Generate vibration spikes (event-based)
 * Most of the time 0, occasionally spikes
 */
const generateVibration = (previousValue = 0) => {
  // 95% chance of normal vibration, 5% chance of spike
  if (Math.random() < 0.95) {
    return Math.max(0, previousValue - 0.5); // Decay
  } else {
    return parseFloat((Math.random() * 50).toFixed(2)); // Spike 0-50G
  }
};

/**
 * Generate smoke/fire detection (mostly false, occasional true)
 */
const generateSmoke = () => {
  // 98% false, 2% true (rare event)
  return Math.random() < 0.02;
};

/**
 * Generate air quality index
 */
const generateAirQuality = (previousValue = 150) => {
  const variation = (Math.random() - 0.5) * 20; // ±10 AQI variation
  let newValue = previousValue + variation;
  newValue = Math.max(0, Math.min(500, newValue)); // Clamp to 0-500 (AQI scale)
  return parseFloat(newValue.toFixed(2));
};

/**
 * Determine sensor status based on reading
 */
const getSensorStatus = (sensorType, value) => {
  switch (sensorType) {
    case 'temperature':
      if (value < 18 || value > 35) return 'warning';
      if (value < 15 || value > 40) return 'alert';
      return 'normal';
    case 'humidity':
      if (value < 40 || value > 80) return 'warning';
      if (value < 30 || value > 90) return 'alert';
      return 'normal';
    case 'vibration':
      if (value > 30) return 'warning';
      if (value > 45) return 'alert';
      return 'normal';
    case 'smoke':
      return value ? 'alert' : 'normal';
    case 'airQuality':
      if (value > 200) return 'warning';
      if (value > 300) return 'alert';
      return 'normal';
    default:
      return 'normal';
  }
};

/**
 * Update all sensor readings for a node
 */
const updateNodeSensors = (node) => {
  const updatedNode = { ...node };
  updatedNode.sensors = {
    temperature: {
      value: generateTemperature(node.sensors.temperature.value),
      unit: '°C',
      status: getSensorStatus('temperature', generateTemperature(node.sensors.temperature.value))
    },
    humidity: {
      value: generateHumidity(node.sensors.humidity.value),
      unit: '%',
      status: getSensorStatus('humidity', generateHumidity(node.sensors.humidity.value))
    },
    vibration: {
      value: generateVibration(node.sensors.vibration.value),
      unit: 'G',
      status: getSensorStatus('vibration', generateVibration(node.sensors.vibration.value))
    },
    smoke: {
      value: generateSmoke(),
      unit: 'bool',
      status: getSensorStatus('smoke', generateSmoke())
    },
    airQuality: {
      value: generateAirQuality(node.sensors.airQuality.value),
      unit: 'AQI',
      status: getSensorStatus('airQuality', generateAirQuality(node.sensors.airQuality.value))
    }
  };
  
  updatedNode.lastUpdate = Date.now();
  
  // Consume battery (0.01% per update)
  updatedNode.battery = Math.max(0, updatedNode.battery - 0.01);

  return updatedNode;
};

/**
 * Update all nodes' sensors
 */
const updateAllSensors = (nodes) => {
  return nodes.map(node => updateNodeSensors(node));
};

module.exports = {
  generateTemperature,
  generateHumidity,
  generateVibration,
  generateSmoke,
  generateAirQuality,
  getSensorStatus,
  updateNodeSensors,
  updateAllSensors
};
