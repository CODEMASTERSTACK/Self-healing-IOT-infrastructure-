# 🚀 Vercel Backend Deployment Guide

## ⚠️ Important: Vercel WebSocket Limitations

**Vercel Serverless Functions have limitations:**
- ❌ Long-running connections (WebSocket needs to stay open)
- ❌ Free tier: 10-second function timeout
- ❌ Pro tier: 60-second timeout

**Your app uses WebSocket**, which requires persistent connections. This means:

1. **Free Tier**: Won't work reliably (connections timeout)
2. **Pro Tier ($20/month)**: Works but expensive
3. **Better Alternative**: Use Railway (free) or Render (free)

---

## ✅ Option 1: Deploy to Vercel (Recommended Only for Pro Tier)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login
```

### Step 3: Deploy Backend
```powershell
cd c:\Users\Krish\Desktop\Random\Simulation\backend
vercel
```

### Step 4: Set Environment Variables in Vercel Dashboard
1. Go to vercel.com → Your project
2. Settings → Environment Variables
3. Add:
   - `CORS_ORIGIN` = `https://your-netlify-site.netlify.app`
   - `NODE_ENV` = `production`
   - `PORT` = `5000`

### Step 5: Get Your Vercel Backend URL
- Vercel provides: `https://iot-backend-xxx.vercel.app`
- Use this in Netlify as `REACT_APP_API_URL`

---

## ⚡ Performance Considerations

**Vercel Functions are Stateless:**
- Every request is independent
- State doesn't persist between calls
- WebSocket connections reset after timeout

**Your simulation:**
- Stores state in memory (networkState)
- Broadcasting happens every 500ms
- This is NOT ideal for serverless

---

## 🎯 Best Approach: Hybrid Deployment

### **Frontend**: Netlify ✅
```
REACT_APP_API_URL=https://iot-backend.vercel.app
```

### **Backend**: Vercel OR Railway

| Provider | Free Tier | WebSocket | Recommendation |
|----------|-----------|-----------|-----------------|
| **Vercel** | ⚠️ Limited | ❌ No | Pro/Enterprise only |
| **Railway** | ✅ Good | ✅ Yes | **BEST FOR THIS PROJECT** |
| **Render** | ✅ Good | ✅ Yes | Alternative |
| **Heroku** | ❌ Paid | ✅ Yes | Not free anymore |

---

## 🔄 If You Still Want Vercel...

### Workaround for WebSocket on Vercel

Use Vercel's **REST API** instead of WebSocket:

```javascript
// Frontend: Instead of WebSocket
// Use polling to fetch data every 1 second

const fetchData = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/state`
  );
  const data = await response.json();
  // Update state
};

setInterval(fetchData, 1000);
```

This requires significant code changes and reduces real-time responsiveness.

---

## 📋 Recommended Stack (FREE)

```
┌─────────────────────────────────────────┐
│         Netlify (Frontend)              │
│  ✅ Free tier: 300 minutes/month build  │
│  ✅ Automatic Git deploys               │
└─────────────────────────────────────────┘
           ↕ HTTPS
┌─────────────────────────────────────────┐
│        Railway (Backend)                │
│  ✅ Free tier: $5/month free credit     │
│  ✅ WebSocket support                   │
│  ✅ Persistent connections              │
└─────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step Vercel Deployment (If You Choose It)

### 1. Prepare Backend
```bash
cd backend
npm install
```

### 2. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### 3. Import Project
- Click "New Project"
- Import from GitHub
- Select your repo

### 4. Configure
- **Root Directory**: `Simulation/backend`
- **Framework**: Node.js
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)

### 5. Environment Variables
- Add all from your `.env`:
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-netlify-frontend.netlify.app
```

### 6. Deploy
- Click "Deploy"
- Wait for build to complete
- Get your URL: `https://xxx.vercel.app`

### 7. Connect Frontend
In Netlify dashboard:
- Settings → Environment
- `REACT_APP_API_URL`: `https://xxx.vercel.app`
- Redeploy frontend

---

## 🔐 .vercelignore File

Create to optimize build:

```
node_modules
.git
.env.local
npm-debug.log
*.md
.gitignore
```

---

## ⚠️ Vercel WebSocket Limitations

```
┌─────────────────────────────────────────────────────┐
│ Free Tier                                           │
├─────────────────────────────────────────────────────┤
│ • Function timeout: 10 seconds                      │
│ • WebSocket: ❌ WILL TIME OUT                       │
│ • Concurrency: Limited                              │
│ • Monthly requests: Unlimited                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Pro Tier ($20/month)                                │
├─────────────────────────────────────────────────────┤
│ • Function timeout: 60 seconds                      │
│ • WebSocket: ✅ WORKS (60 second limit)             │
│ • Concurrency: Higher                               │
│ • Better for production                             │
└─────────────────────────────────────────────────────┘
```

---

## 🆚 Vercel vs Railway Comparison

| Feature | Vercel | Railway |
|---------|--------|---------|
| Free Tier | ⚠️ Limited | ✅ $5 credit |
| WebSocket | ❌ Free / ✅ Paid | ✅ Yes |
| Ease | ✅ Very Easy | ✅ Easy |
| Scaling | ✅ Excellent | ✅ Good |
| Persistent Connections | ❌ Free / ✅ Paid | ✅ Yes |
| **Recommendation** | **Not ideal for this project** | **BEST CHOICE** |

---

## 💡 My Recommendation

**Don't use Vercel for this backend.** Use:

1. **Netlify** (Frontend) - FREE ✅
2. **Railway** (Backend) - FREE ✅

**Total Cost: $0** (with limits)

If you want Vercel for backend, you MUST upgrade to Pro tier ($20/month).

---

## 📚 Vercel Documentation

- [Vercel Node.js Support](https://vercel.com/docs/functions/serverless-functions/node-js)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Deployment](https://vercel.com/docs/deployments/overview)

---

## ✅ If You Deploy to Vercel Anyway

After deployment, test with:

```bash
curl https://your-backend.vercel.app/
```

If you get a response, it's working. But WebSocket might hang.

For reliable WebSocket, **switch to Railway**.

---
