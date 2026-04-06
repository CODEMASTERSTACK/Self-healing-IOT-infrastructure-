# 🚀 Deployment Guide: IoT Self-Healing Infrastructure Simulation

## Quick Start: Deploy to Netlify + Railway

### **Part 1: Deploy Frontend to Netlify**

1. **Push code to GitHub**
   ```bash
   cd c:\Users\Krish\Desktop\Random\Simulation
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/iot-simulation.git
   git push -u origin main
   ```

2. **Connect Netlify to GitHub**
   - Go to https://netlify.com and sign up (free)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Select your repository

3. **Configure Netlify Build Settings**
   - **Branch**: main
   - **Base directory**: Simulation/frontend
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

4. **Add Environment Variables in Netlify**
   - Go to Site Settings → Build & Deploy → Environment
   - Add: `REACT_APP_API_URL` = `https://your-railway-backend.up.railway.app`

---

### **Part 2: Deploy Backend to Railway**

1. **Deploy Backend to Railway (Free Tier)**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project → GitHub Repo
   - Select backend folder

2. **Configure Railway Variables**
   - In Railway Dashboard → Variables
   - Add: `PORT` = `5000`
   - Add: `NODE_ENV` = `production`

3. **Get Production Backend URL**
   - Railway generates a URL like: `https://iot-backend-prod.railway.app`
   - Copy this URL to Netlify environment variable

---

## 📋 Environment Variables Required

### **Frontend (.env)**
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### **Backend (.env)**
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

---

## ✅ Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend to Netlify
- [ ] Deploy backend to Railway
- [ ] Add `REACT_APP_API_URL` environment variable in Netlify
- [ ] Add `CORS_ORIGIN` environment variable in Railway
- [ ] Update backend CORS settings
- [ ] Test connection between frontend and backend

---

## 🔧 Backend CORS Configuration

Update your backend `server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

---

## 🌐 WebSocket Configuration for Production

Your frontend already handles this with environment variables. When deployed:
- Frontend will connect to: `wss://your-backend-url.railway.app`
- Uses WSS (secure WebSocket) for HTTPS sites

---

## 💰 Cost Summary

- **Netlify**: Free tier (excellent for React apps)
- **Railway**: Free tier with limits (perfect for Node.js backend)
- **Total**: $0 initially

---

## 🆘 Troubleshooting

### Connection Fails
- Check `REACT_APP_API_URL` matches your backend URL
- Verify CORS settings on backend
- Check browser console for WebSocket errors

### Build Fails
- Ensure `npm run build` works locally first
- Check that `netlify.toml` is in correct directory
- Verify all dependencies are in `package.json`

### Backend URL Issues
- Railway provides public URLs automatically
- Use the full URL including `https://`
- Don't forget to update after deploying backend changes

---

## 📱 Testing Production Deployment

1. Visit your Netlify URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Should see: "✓ Connected to simulation server" message
5. Network tab should show WebSocket connection to your backend

---

## 🎯 Alternative Deployment Options

If you want to use different services:

| Service | Frontend | Backend | Cost |
|---------|----------|---------|------|
| Netlify + Railway | ✅ Excellent | ✅ Good | Free |
| Vercel + Heroku | ✅ Excellent | ✅ Paid | $7+ |
| AWS Amplify + EC2 | ✅ Good | ✅ Good | Variable |
| GitHub Pages + Render | ⚠️ Limited | ✅ Good | Free |

---
