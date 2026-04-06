# 🚀 Quick Start Guide

## ✅ Installation Complete!

All dependencies have been installed. Your simulation is ready to run!

## 🔧 Running the Simulation Locally

### Option 1: Two Terminal Windows (Recommended for Development)

#### Terminal 1 - Backend Server

```bash
cd Simulation/backend
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║  IoT Self-Healing Infrastructure Simulation                ║
║  Server running on http://localhost:5000                   ║
║  WebSocket: ws://localhost:5000                            ║
╚════════════════════════════════════════════════════════════╝

✓ Simulation started (500ms interval)
```

#### Terminal 2 - Frontend Application

```bash
cd Simulation/frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view iot-infrastructure-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://<your-ip>:3000
```

#### Terminal 3 - Open Browser

```
http://localhost:3000
```

---

### Option 2: Docker (Production-like Setup)

```bash
# Navigate to Simulation folder
cd Simulation

# Build and start with Docker Compose
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - WebSocket API: ws://localhost:5000
```

---

## 🎮 Using the Simulation

### Initial Load

1. **Wait for connection** - You'll see a "Connecting..." screen
2. **Dashboard loads** - Once connected, the network graph appears
3. **Simulation runs** - Sensor data updates every 500ms

### Simulating Failures

1. **Click "Fail Node [1-4]"** in the left Control Panel
2. **Node turns RED** - Connection drops
3. **Alert appears** - "Self-healing in progress..."
4. **Network reroutes** - Alternative paths light up
5. **After 3 seconds** - Node recovers automatically

### Monitoring

- **Left Panel**: Control failures and monitor status
- **Center**: Network graph with packet animations
- **Right Panel**: Sensor readings and live charts

---

## ⚙️ Configuration

### Backend Settings

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
SIMULATION_UPDATE_INTERVAL=500   # Update frequency in ms
```

### Sensor Thresholds

Edit `backend/simulation/failureManager.js` to adjust:
- Risk scoring for predictions
- Alert thresholds for each sensor
- Recovery delay time

### Recovery Time

In `backend/server.js`, line ~145:
```javascript
setTimeout(() => {
  // Recovery happens here after this delay
}, 3000); // Change 3000 to your desired milliseconds
```

---

## 📊 What to Watch For

### Normal Operation
- ✅ All nodes GREEN
- ✅ Solid/dashed lines connecting nodes
- ✅ Green packets flowing continuously

### Network Failure
- ⚠️ One node turns RED
- ⚠️ Some connections disappear
- ⚠️ "Self-healing..." alert shows

### Rerouting in Action
- 🔄 New connections highlight
- 📦 Packets take alternative routes
- ⏱️ Latency may increase (LoRa = slower)

### Recovery Complete
- ✅ Red node turns GREEN again
- ✅ All connections restore

---

## 🐛 Common Issues

### "Connecting..." spinner doesn't disappear

**Problem**: Frontend can't reach backend

**Solution**:
```bash
# Check backend is running
cd backend
npm run dev

# Verify port 5000 is listening
netstat -ano | findstr :5000

# If already in use, kill it:
taskkill /PID <PID> /F

# Or change PORT in backend/.env to 5001
```

### Blank network graph

**Problem**: SVG not rendering

**Solution**:
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Hard refresh (Ctrl+F5)
# Check console (F12) for errors
```

### High CPU usage

**Problem**: Animations causing performance issues

**Solution**:
- Reduce update interval in `backend/.env`
- Close other browser tabs
- Use Chrome instead of Firefox for better performance

### Missing icons/styles

**Problem**: Tailwind CSS not applied

**Solution**:
```bash
# Rebuild frontend
cd frontend
npm run build

# Or restart dev server
npm start
```

---

## 📈 Monitoring the Simulation

### WebSocket Events

All real-time data flows via WebSocket. Open browser DevTools (F12):

```javascript
// In Console tab, you can log WebSocket messages:
// (This is for development only)
setInterval(() => {
  console.log('Current packet count:', activePackets.length);
}, 1000);
```

### Backend Logs

The backend logs important events:
```
✓ Client connected via WebSocket
⚠️ Failing node 2
🔄 Rerouting packets
✓ Recovering node 2
✓ Client disconnected
```

### Frontend Performance

Check performance metrics:
1. Open DevTools (F12)
2. Go to **Performance** tab
3. Record a simulation sequence
4. Look for smooth animations (60 FPS target)

---

## 🚢 Deployment

### Deploy to Render.com

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect your GitHub repo to Render
# 3. Create new Web Service
# 4. Select your repo
# 5. Build command: npm install
# 6. Start command: cd backend && npm start
# 7. Environment: Add NODE_ENV=production
```

### Deploy to Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### Deploy to DigitalOcean App Platform

1. Create `do-app.yaml` in root:
```yaml
services:
- name: iot-simulation-backend
  github:
    repo: your-username/your-repo
    branch: main
  build_command: npm install
  run_command: node backend/server.js
  http_port: 5000
```

2. Push to GitHub and deploy via DigitalOcean dashboard

---

## 📞 Support

If you encounter issues:

1. **Check the README.md** for detailed documentation
2. **Review browser console** (F12 → Console tab)
3. **Check terminal output** for error messages
4. **Verify both services are running**:
   ```bash
   # Backend listening?
   netstat -ano | findstr :5000
   
   # Frontend listening?
   netstat -ano | findstr :3000
   ```

---

## ✨ Next Steps

Explore the code and consider adding:
- [ ] More sensor types (pressure, acceleration)
- [ ] Multiple networks (interconnected IoT clusters)
- [ ] Historical data storage (SQLite/MongoDB)
- [ ] More advanced routing algorithms (A*, RRT)
- [ ] 3D visualization (Three.js)
- [ ] Real hardware integration (actual ESP32 devices)

---

**Enjoy your IoT simulation! 🎉**
