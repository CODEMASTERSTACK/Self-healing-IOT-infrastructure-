# 🌐 Self-Healing IoT Infrastructure Simulation

A **full-stack interactive simulation** of a disaster-resilient IoT network featuring autonomous mesh communication, real-time sensor data, and intelligent self-healing routing.

![Status](https://img.shields.io/badge/status-Active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Features

### Network Architecture
- **4 IoT Sensor Nodes** with embedded components (ESP32, sensors, battery)
- **Dual Connectivity**: LoRa (long-range, ~150ms) + ESP32 Mesh (WiFi, ~50ms)
- **Real-time Sensor Simulation**: Temperature, Humidity, Vibration, Smoke Detection, Air Quality
- **Battery Management**: Realistic battery depletion and status tracking

### Self-Healing System
- **Automatic Failure Detection**: Nodes fail gracefully when sensors spike or battery is critical
- **Dynamic Rerouting**: Network automatically finds alternative paths using Dijkstra's algorithm
- **Predictive Alerts**: ML-style risk scoring predicts node failures before they occur
- **Auto-Recovery**: Failed nodes come back online after 3 seconds (configurable)

### Interactive Dashboard
- **Network Visualization**: SVG-based circuit diagram showing live node/edge status
- **Real-time Charts**: Node status timeline, temperature trends, battery levels
- **Live Metrics**: Active nodes, failed nodes, average battery capacity
- **Animated Data Packets**: Visual representation of data flowing from sensors to dashboard

### Control Panel
- **Simulate Failures**: Click to fail any active node
- **Disaster Mode**: Fail multiple nodes simultaneously
- **Reset Network**: Restore all nodes to healthy state
- **Predictions View**: See which nodes are at risk and why

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Network Graph (SVG)                 │   │
│  │  - Nodes (4 IoT devices with sensors & icons)       │   │
│  │  - Edges (LoRa dashed, ESP32 Mesh solid)            │   │
│  │  - Data Packets (animated green circles)             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Dashboard (Status, Charts, Alerts)           │   │
│  │         Control Panel (Fail Node, Reset)             │   │
│  └──────────────────────────────────────────────────────┘   │
│          WebSocket: Real-time state updates                 │
└────────────────────────────────────────────────────────────┬─
                                                               │
                                          ┌────────────────────
                                          │
                    ┌─────────────────────▼──────────────┐
                    │    Backend (Node.js + Express)     │
                    ├─────────────────────────────────────┤
                    │ • Network Graph Model               │
                    │ • Sensor Simulation Engine          │
                    │ • Routing Engine (Dijkstra)         │
                    │ • Failure Manager                   │
                    │ • WebSocket Broadcaster             │
                    │ • REST API (/api/fail-node, etc)   │
                    └─────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Tailwind CSS + SVG |
| **Visualizations** | Custom SVG + CSS Animations |
| **Charts** | Recharts |
| **Icons** | Material UI Icons |
| **Real-time** | WebSocket (native) |
| **Backend** | Node.js + Express |
| **Deployment** | Docker + Docker Compose |
| **Hosting** | Render/Railway/DigitalOcean |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Docker** (optional, for containerized deployment)

### 1️⃣ **Local Development Setup**

```bash
# Clone the repository
git clone <repo-url>
cd Simulation

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 2️⃣ **Run Backend Server**

```bash
cd backend
npm run dev
# Server starts on ws://localhost:5000
```

### 3️⃣ **Run Frontend (in a new terminal)**

```bash
cd frontend
npm start
# Frontend opens on http://localhost:3000
```

### 4️⃣ **Access the Simulation**

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

### Build & Run with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - WebSocket: ws://localhost:5000
```

### Production Deployment

```bash
# Build multi-stage production image
docker build -t iot-simulation:latest .

# Run container
docker run -p 5000:5000 -p 3000:3000 iot-simulation:latest
```

---

## 📊 API Reference

### WebSocket Events

#### Broadcast (Server → Client)
```json
{
  "type": "network-state",
  "nodes": [...],
  "edges": [...],
  "activePackets": [...],
  "healingInProgress": boolean,
  "predictions": [...],
  "timestamp": number
}
```

#### Commands (Client → Server)
```json
{ "action": "fail-node", "nodeId": 2 }
{ "action": "reset" }
{ "action": "get-route", "sourceNodeId": 1 }
```

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/state` | Get current network state |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/predictions` | Get risk predictions |
| `GET` | `/api/route/:nodeId` | Compute route for node |
| `POST` | `/api/fail-node/:nodeId` | Fail a specific node |
| `POST` | `/api/reset` | Reset network |

---

## 🎮 Usage Guide

### Simulating a Node Failure

1. **Click "Fail Node X"** in the left control panel
2. **Node turns red**, connections drop
3. **"Self-healing in progress..."** alert appears
4. **Network reroutes** to alternative paths (visible on graph)
5. **After 3 seconds**, node recovers (turns green again)

### Understanding the Visualization

- **Green nodes** = Active & healthy
- **Red nodes** = Failed (will recover soon)
- **Yellow nodes** = Warning (sensors detecting anomalies)
- **Dashed blue lines** = LoRa (long-range, slower)
- **Solid cyan lines** = ESP32 Mesh (WiFi, faster)
- **Green dots** = Data packets traveling to dashboard

### Predictions & Alerts

The prediction system monitors each node and shows risk scores based on:
- Battery level (↓% → ↑risk)
- Temperature extremes
- Humidity spikes
- Vibration events
- Smoke/fire detection
- Air quality degradation

---

## 🔧 Configuration

### Backend Environment

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
SIMULATION_UPDATE_INTERVAL=500
```

### Simulation Parameters

Edit `backend/simulation/failureManager.js` to adjust:
- Recovery delay (default: 3000ms)
- Risk thresholds for predictions
- Sensor alert thresholds

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| **Update Interval** | 500ms |
| **Max Packets/Second** | ~5 |
| **Node Count** | 4 |
| **Edge Count** | 6 |
| **Frontend Bundle** | ~150KB (production) |
| **Backend Memory** | ~30MB |

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Connecting..." spinner stays on
**Solution**: 
- Ensure backend is running: `npm run dev` in `/backend`
- Check if port 5000 is available: `netstat -an | grep 5000`
- Verify WebSocket URL in `frontend/src/hooks/useWebSocket.js`

### Dark UI / Icons Not Showing

**Problem**: Nodes appear blank or icons missing
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend: `npm start`
- Check browser console for errors (F12)

### High CPU Usage

**Problem**: Frontend or backend consuming CPU
**Solution**:
- Reduce simulation interval in `backend/.env`
- Check for memory leaks in browser DevTools
- Restart both services

---

## 🎓 Learning Resources

### Routing Algorithm
The simulation uses **Dijkstra's algorithm** for finding shortest paths:
- Finds minimum-latency route from source to destination
- Handles failed nodes by excluding them from graph
- Computes fallback routes in advance

### Network Topology
```
      Node 1 ←LoRa→ Node 2
        ↓     \      ↓
       Mesh    Mesh  Mesh
        ↓       \    ↓
      Node 4 ←LoRa→ Node 3
```

### Sensor Simulation
Each sensor generates realistic data with:
- Gradual variation (±1-3 units per update)
- Occasional spikes (vibration, smoke)
- Bounded ranges (temperature: 15-40°C, etc.)

---

## 🚢 Deployment to Cloud

### Render.com
1. Create Render account
2. Connect GitHub repo
3. Create two services:
   - **Backend**: Docker service pointing to `backend/`
   - **Frontend**: Static site pointing to `frontend/build/`
4. Set WebSocket URL in frontend to match backend

### Railway
```bash
# Login
railway login

# Deploy
railway up
```

### DigitalOcean App Platform
1. Create do-app.yaml
2. Push to GitHub
3. Connect in App Platform dashboard

---

## 📄 Project Structure

```
Simulation/
├── backend/
│   ├── server.js                 # Express + WebSocket
│   ├── package.json
│   ├── .env
│   └── simulation/
│       ├── networkGraph.js       # Topology definition
│       ├── sensorEngine.js       # Data generation
│       ├── routingEngine.js      # Dijkstra algorithm
│       └── failureManager.js     # Failure/recovery logic
├── frontend/
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx               # Main app
│       ├── index.js
│       ├── index.css
│       ├── hooks/
│       │   └── useWebSocket.js   # WebSocket client
│       ├── components/
│       │   ├── NetworkGraph.jsx  # SVG visualization
│       │   ├── NodeVisual.jsx    # Node rendering
│       │   ├── ConnectionLine.jsx# Edge rendering
│       │   ├── DataPacket.jsx    # Packet animation
│       │   ├── Dashboard.jsx     # Status & charts
│       │   └── ControlPanel.jsx  # Controls
│       └── utils/
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

## 🤝 Contributing

Want to improve the simulation? Ideas:
- Add more sensor types (pressure, acceleration)
- Implement different routing algorithms
- Add 3D visualization (Three.js)
- Create multi-network support
- Add database persistence

---

## 📝 License

MIT © 2024

---

## 🙏 Support

For questions or issues:
1. Check the **Troubleshooting** section above
2. Review browser console logs (F12)
3. Verify all dependencies are installed
4. Restart backend and frontend services

---

**Happy simulating! 🚀**
