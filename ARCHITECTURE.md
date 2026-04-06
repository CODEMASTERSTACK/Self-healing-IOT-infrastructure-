# 🏗️ System Architecture & Data Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (http://localhost:3000)         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    React App (App.jsx)                   │   │
│  │  ┌────────────────┐  ┌───────────┐  ┌──────────────┐    │   │
│  │  │ NetworkGraph   │  │ Dashboard │  │ControlPanel │    │   │
│  │  │   (SVG)        │  │ (Charts)  │  │ (Buttons)   │    │   │
│  │  └────────────────┘  └───────────┘  └──────────────┘    │   │
│  │         ↑                  ↑               ↑              │   │
│  │         └──────────────────┴───────────────┘              │   │
│  │                      │                                     │   │
│  │         useWebSocket Hook (WebSocket Client)              │   │
│  │                      │                                     │   │
│  └──────────────────────┼─────────────────────────────────┘   │
│                         │ WebSocket Messages                   │
│                 ┌───────▼────────┐                            │
└─────────────────┤   Network      ├────────────────────────────┘
                  │  Connection    │
         ┌────────┤   (Native WS)  ├────────┐
         │        └────────┬────────┘        │
         │                 │                 │
    SEND COMMANDS     RECEIVE UPDATES    CONNECTION
    (fail-node)       (network state)    (automatic
     (reset)           (events)          reconnect)
         │                 │                 │
         │                 ▼                 │
         │    ┌─────────────────────┐       │
         │    │  ws://localhost:5000│       │
         └───▶│                     │◀──────┘
              │  WebSocket Server   │
              │  (Express.js)       │
              └─────────────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    ┌─────────┐ ┌──────────┐ ┌──────────┐
    │  Network│ │ Sensor   │ │ Routing  │
    │  Graph  │ │ Engine   │ │ Engine   │
    │  Model  │ │          │ │          │
    └─────────┘ └──────────┘ └──────────┘
          │           │           │
          │ Control   │ Update    │ Compute
          └───┬───────┴───────────┴──┐
              │ Updated State        │
              ▼                      ▼
         ┌──────────────────────────┐
         │   Global State           │
         │  (nodes, edges,          │
         │   activePackets,         │
         │   predictions)           │
         └──────────────────────────┘
              │
         ┌────┴─────┐
         │ Broadcast│
         │  every   │
         │  500ms   │
         └────┬─────┘
              │
         (Back to WebSocket)
```

---

## Data Flow Sequence Diagram

### Initialization

```
USER OPENS http://localhost:3000

    ↓

React App loads
- Initializes useWebSocket hook
- Attempts connection to ws://localhost:5000

    ↓

WebSocket Connection Established
- Backend sends initial network state
- Frontend renders network graph

    ↓

Simulation Loop Starts
- Backend: 500ms updates
- Frontend: Real-time display
```

### Node Failure Scenario

```
USER CLICKS "Fail Node 2"

    ↓

Command sent via WebSocket:
{ action: 'fail-node', nodeId: 2 }

    ↓ BACKEND

failureManager.failNode()
- Change node status: 'active' → 'failed'
- Set battery: 100 → 0
- Deactivate connected edges

    ↓

healingInProgress = true

    ↓

Broadcast updated state to all clients:
{
  nodes: [updated with node 2 status='failed'],
  edges: [updated with deactivated edges],
  healingInProgress: true,
  predictions: []
}

    ↓ FRONTEND

Receive state update

    ↓

Re-render NetworkGraph:
- Node 2 circle changes to red
- Connected edges fade out
- Show "Self-healing..." indicator

    ↓

Display toast alert:
"⚠️ Node 2 down - rerouting..."

    ↓ (Continue simulation, 3 seconds pass)

BACKEND: Recovery triggered

    ↓

recoverNode(nodeId)
- Change status: 'failed' → 'active'
- Set battery: 0 → 100
- Reactivate edges

    ↓

healingInProgress = false

    ↓

Broadcast recovery state

    ↓ FRONTEND

Node 2 turns GREEN
All connections restore
Alert dismissed
```

### Routing & Packet Flow

```
SENSOR DATA READY AT NODE 1

    ↓

Backend generatePacket():
{
  id: 'packet-123',
  from: 1,
  to: 0 (laptop),
  progress: 0,
  startTime: timestamp,
  duration: 2500ms
}

    ↓

Add to activePackets array

    ↓

Broadcast to frontend:
activePackets: [{ packet data }]

    ↓ FRONTEND

DataPacket component receives packet

    ↓

Calculate interpolated position:
progredss = (now - startTime) / duration
x = from.x + (to.x - from.x) * progress
y = from.y + (to.y - from.y) * progress

    ↓

Render SVG circle at (x, y)

    ↓

Every 500ms from backend:
Update packet progress

    ↓

Frontend updates circle position
(Smooth continuous animation)

    ↓ (After ~2500ms)

progress >= 1.0

    ↓

Remove packet from DOM

    ↓ (Repeat for all active packets)
```

---

## State Management

### Backend State

```javascript
// Global simulation state
let networkState = {
  nodes: [
    { id: 1, status: 'active', battery: 100, sensors: {...} },
    { id: 2, status: 'failed', battery: 0, sensors: {...} },
    ...
  ],
  edges: [
    { source: 1, target: 2, type: 'lora', active: true },
    { source: 2, target: 3, type: 'esp_mesh', active: false },
    ...
  ]
}

let activePackets = [
  { id: 'packet-1', from: 1, to: 0, progress: 0.35 },
  { id: 'packet-2', from: 3, to: 0, progress: 0.72 },
  ...
]

let healingInProgress = false

let predictions = [
  { nodeId: 3, risk: 45, prediction: 'warning', alerts: [...] },
  ...
]
```

### Frontend State (React)

```javascript
// From useWebSocket hook
const [state, dispatch] = useReducer(networkReducer, {
  nodes: [],           // Updated every 500ms from backend
  edges: [],           // Updated when topology changes
  activePackets: [],   // Updated every 500ms
  healingInProgress: false,
  predictions: [],     // Updated every 500ms
  connected: true,     // WebSocket connection status
  error: null
})
```

---

## API Contracts

### WebSocket Message Format

#### Server → Client (Broadcast)
```json
{
  "type": "network-state",
  "nodes": [
    {
      "id": 1,
      "status": "active",
      "position": { "x": 200, "y": 100 },
      "battery": 95.5,
      "sensors": {
        "temperature": { "value": 23.5, "unit": "°C", "status": "normal" },
        "humidity": { "value": 55.2, "unit": "%", "status": "normal" },
        "vibration": { "value": 2.1, "unit": "G", "status": "normal" },
        "smoke": { "value": false, "unit": "bool", "status": "normal" },
        "airQuality": { "value": 125, "unit": "AQI", "status": "warning" }
      },
      "lastUpdate": 1712511234567
    }
  ],
  "edges": [
    {
      "source": 1,
      "target": 2,
      "type": "lora",
      "latency": 150,
      "strength": 85,
      "active": true
    }
  ],
  "activePackets": [
    {
      "id": "packet-0",
      "from": 1,
      "to": 0,
      "progress": 0.45,
      "startTime": 1712511234567,
      "duration": 2500
    }
  ],
  "healingInProgress": false,
  "predictions": [
    {
      "nodeId": 3,
      "riskScore": 35,
      "prediction": "caution",
      "alerts": ["Air quality poor: 175 AQI"],
      "likelihood": 35
    }
  ],
  "timestamp": 1712511234567
}
```

#### Client → Server (Command)
```json
{
  "action": "fail-node",
  "nodeId": 2
}
```

or

```json
{
  "action": "reset"
}
```

or

```json
{
  "action": "get-route",
  "sourceNodeId": 1
}
```

### REST API Endpoints

#### GET /api/state
Returns complete network state (same as WebSocket broadcast)

#### POST /api/fail-node/:nodeId
Triggers node failure for nodeId (1-4)

Response:
```json
{
  "message": "Node 2 failed. Recovery scheduled in 3 seconds.",
  "healingInProgress": true
}
```

#### POST /api/reset
Resets entire network to healthy state

Response:
```json
{
  "message": "Network reset to normal state",
  "state": "active"
}
```

#### GET /api/predictions
Returns current risk predictions

Response:
```json
{
  "predictions": [
    { "nodeId": 3, "riskScore": 35, "prediction": "caution", ... }
  ]
}
```

#### GET /api/route/:sourceNodeId
Computes routing path from source to dashboard

Response:
```json
{
  "sourceNodeId": 1,
  "route": {
    "primary": [1, 3, 0],
    "fallback": [1, 4, 0],
    "available": true,
    "distance": 300,
    "reason": "Route available"
  }
}
```

#### GET /api/health
Health check endpoint

Response:
```json
{
  "status": "healthy",
  "timestamp": 1712511234567,
  "uptime": 3456.789
}
```

---

## Component Hierarchy

```
<App>
  │
  ├─ useWebSocket
  │   └─ WebSocket Client
  │       └─ ws://localhost:5000
  │
  ├─ <ControlPanel>
  │   ├─ Network Status Indicator
  │   ├─ Fail Node Buttons [1-4]
  │   ├─ Random Fail Button
  │   ├─ Disaster Mode Button
  │   ├─ Reset Button
  │   └─ Legend
  │
  ├─ <NetworkGraph> (Main SVG Canvas)
  │   ├─ <ConnectionLine> (× 6 edges)
  │   │   └─ SVG Path + Labels
  │   ├─ <NodeVisual> (× 4 nodes)
  │   │   ├─ Node Circle
  │   │   ├─ Status Indicator
  │   │   ├─ Battery % Display
  │   │   └─ Sensor Icons (× 5)
  │   ├─ <DataPacket> (× N packets)
  │   │   └─ SVG Animation
  │   └─ Healing Indicator
  │
  ├─ Status Bar
  │   ├─ Active Node Count
  │   ├─ Packet Count
  │   └─ Connection Status
  │
  └─ <Dashboard>
     ├─ Node Status Grid (× 4 cards)
     ├─ Predictions Alerts
     ├─ Network Summary Cards
     └─ Live Charts
        ├─ Node Status Timeline
        ├─ Temperature Trend
        └─ Battery Status
```

---

## Performance Characteristics

### Update Frequency

| Component | Interval | Source |
|-----------|----------|--------|
| Sensor data | 500ms | Backend simulation |
| Network state broadcast | 500ms | Backend WebSocket |
| Frontend re-render | Variable | React (batched updates) |
| Packet animation | 60fps | requestAnimationFrame |
| Dashboard charts | 1000ms | useEffect interval |

### Memory Usage

| Component | Estimated |
|-----------|-----------|
| Backend node simulation | ~30 MB |
| Frontend React component tree | ~5 MB |
| WebSocket connections (per client) | ~1 MB |
| Historical chart data (1 min) | ~1 MB |

### Latency

| Operation | Latency |
|-----------|---------|
| WebSocket message round-trip | <10ms (local) |
| REST API response | <5ms |
| SVG re-render | <16ms (60fps) |
| Node failure → visual update | <500ms (next broadcast) |
| Packet animation | Continuous (smooth) |

---

**Architecture designed for scalability while maintaining simplicity for a 4-node demonstration network.**
