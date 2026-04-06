/**
 * Sensor Info Modal Component
 * Displays detailed information about a specific sensor
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Thermostat as ThermometerIcon,
  Opacity as WaterDropIcon,
  Vibration as VibrateIcon,
  Warning as SmokeIcon,
  Cloud as AirQualityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const SensorInfo = ({ open, onClose, sensor, nodeId }) => {
  if (!sensor) return null;

  const sensorConfigs = {
    temperature: {
      icon: ThermometerIcon,
      color: '#f97316',
      unit: '°C',
      title: 'Temperature Sensor (DHT22)',
      normal: [15, 35],
      description: 'Monitors environmental temperature variations',
    },
    humidity: {
      icon: WaterDropIcon,
      color: '#0891b2',
      unit: '%',
      title: 'Humidity Sensor (DHT22/BME280)',
      normal: [30, 70],
      description: 'Tracks moisture levels in the air',
    },
    vibration: {
      icon: VibrateIcon,
      color: '#eab308',
      unit: 'G',
      title: 'Vibration Sensor (SW-420)',
      normal: [0, 2],
      description: 'Detects seismic activity and structural movements',
    },
    smoke: {
      icon: SmokeIcon,
      color: '#6b7280',
      unit: 'detected',
      title: 'Smoke Detector (MQ-2)',
      normal: [false],
      description: 'Identifies smoke presence indicating potential fires',
    },
    airQuality: {
      icon: AirQualityIcon,
      color: '#8b5cf6',
      unit: 'AQI',
      title: 'Air Quality Sensor (PMS5003)',
      normal: [0, 100],
      description: 'Measures air pollutant concentration levels',
    },
  };

  const config = sensorConfigs[sensor.type];
  if (!config) return null;

  const Icon = config.icon;

  // Calculate percentage for progress bar (normalized to 0-100)
  let percentage = 0;
  if (sensor.type === 'smoke') {
    percentage = sensor.value ? 100 : 0;
  } else if (sensor.type === 'temperature') {
    percentage = Math.min(100, Math.max(0, ((sensor.value - 10) / 50) * 100));
  } else if (sensor.type === 'humidity') {
    percentage = Math.min(100, Math.max(0, (sensor.value / 100) * 100));
  } else if (sensor.type === 'vibration') {
    percentage = Math.min(100, Math.max(0, (sensor.value / 5) * 100));
  } else if (sensor.type === 'airQuality') {
    percentage = Math.min(100, Math.max(0, (sensor.value / 200) * 100));
  }

  const getStatusColor = () => {
    if (sensor.status === 'alert') return '#ef4444';
    if (sensor.status === 'warning') return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = () => {
    if (sensor.status === 'alert') return '⚠️ ALERT';
    if (sensor.status === 'warning') return '⚡ WARNING';
    return '✓ NORMAL';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }
    }}>
      <DialogTitle sx={{ background: `linear-gradient(135deg, ${config.color}15, ${config.color}25)`, pb: 3 }}>
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Icon sx={{ fontSize: 28, color: config.color }} />
            <div>
              <div style={{ color: config.color }} className="font-bold text-lg">
                {config.title}
              </div>
              <div className="text-xs text-slate-600">Node {nodeId}</div>
            </div>
          </div>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: 'pointer', color: '#64748b', '&:hover': { color: '#1e293b' } }}
          />
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ space: 3 }}>
          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <p className="text-sm text-slate-600 italic">{config.description}</p>
          </Box>

          {/* Current Value */}
          <Box sx={{ mb: 4, p: 3, bgcolor: '#f1f5f9', borderRadius: '8px', border: `2px solid ${config.color}20` }}>
            <div className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-2">Current Value</div>
            <div className="flex items-baseline justify-between">
              <div style={{ color: config.color }} className="text-4xl font-bold">
                {sensor.type === 'smoke' ? (sensor.value ? 'DETECTED' : 'CLEAR') : sensor.value.toFixed(2)}
              </div>
              <div className="text-lg text-slate-600">{config.unit}</div>
            </div>
          </Box>

          {/* Status */}
          <Box sx={{ mb: 4 }}>
            <div className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-2">Status</div>
            <div
              style={{ 
                backgroundColor: getStatusColor() + '20', 
                color: getStatusColor(),
                borderColor: getStatusColor()
              }}
              className="inline-block px-4 py-2 rounded-lg font-bold text-sm border-2"
            >
              {getStatusText()}
            </div>
          </Box>

          {/* Progress Bar */}
          {sensor.type !== 'smoke' && (
            <Box sx={{ mb: 4 }}>
              <div className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-2">Measurement Range</div>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 8,
                  borderRadius: '4px',
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: config.color,
                    borderRadius: '4px',
                  },
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>0</span>
                <span>{percentage.toFixed(0)}%</span>
                <span>100</span>
              </div>
            </Box>
          )}

          {/* Normal Range Info */}
          <Box sx={{ 
            p: 3, 
            bgcolor: '#f0fdf4', 
            borderRadius: '8px',
            border: '2px solid #86efac'
          }}>
            <div className="text-xs text-green-700 font-semibold">📊 Normal Operating Range</div>
            <div className="text-sm text-green-800 mt-2">
              {sensor.type === 'smoke' 
                ? 'No smoke detected' 
                : `${config.normal[0]}- ${config.normal[1]} ${config.unit}`}
            </div>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: config.color,
            '&:hover': {
              backgroundColor: config.color,
              opacity: 0.9,
            },
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SensorInfo;
