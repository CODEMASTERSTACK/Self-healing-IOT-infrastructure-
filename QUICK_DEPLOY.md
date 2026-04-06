# 🎯 Netlify Deployment - Quick Reference

## ✨ What I've Set Up For You

✅ Updated frontend to use environment variables  
✅ Updated backend CORS for production  
✅ Created netlify.toml configuration  
✅ Added .env.example for reference  
✅ Created comprehensive deployment guide  

---

## 📦 Deployment Steps (5 minutes)

### Step 1: GitHub
```bash
cd c:\Users\Krish\Desktop\Random\Simulation
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR-USERNAME/iot-simulation.git
git branch -M main
git push -u origin main
```

### Step 2: Netlify (Frontend)
1. Go to https://netlify.com → Sign up
2. Click "New site from Git"
3. Connect GitHub → Select repository
4. **Base directory**: `Simulation/frontend`
5. **Build command**: `npm run build`
6. **Publish directory**: `build`
7. Deploy!

### Step 3: Railway (Backend)
1. Go to https://railway.app → Sign up with GitHub
2. Create project → Select GitHub repo
3. Railway auto-detects Node.js backend
4. Deploys automatically
5. Copy the URL (e.g., `https://xxx.railway.app`)

### Step 4: Connect Frontend to Backend
1. In Netlify → Site Settings → Build & Deploy → Environment
2. Add variable: `REACT_APP_API_URL` = `https://your-railway-backend.railway.app`
3. Redeploy site

### Step 5: Update Backend CORS
1. In Railway → Variables
2. Add: `CORS_ORIGIN` = `https://your-netlify-site.netlify.app`
3. Redeploy

---

## 🔐 Environment Variables

### Netlify (Frontend)
```
REACT_APP_API_URL = https://your-backend-url.railway.app
```

### Railway (Backend)
```
PORT = 5000
NODE_ENV = production
CORS_ORIGIN = https://your-netlify-site.netlify.app
```

---

## ✅ Testing After Deployment

1. Open your Netlify site URL
2. Open DevTools (F12)
3. Check Console - should say "✓ Connected to simulation server"
4. All nodes should be visible and updating in real-time
5. Click buttons to trigger failures

---

## 🆘 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| WebSocket connection fails | Check `REACT_APP_API_URL` in Netlify env vars |
| CORS error in console | Add `CORS_ORIGIN` to Railway environment |
| Build fails on Netlify | Run `npm run build` locally first to debug |
| Backend can't be reached | Use full URL: `https://` not `http://` |
| Site rebuilds don't pick up changes | Trigger manual redeploy in Netlify |

---

## 📱 Success Indicators

- ✅ Frontend loads at Netlify URL
- ✅ Console shows WebSocket connected message
- ✅ Nodes display and update in real-time
- ✅ Can click nodes and trigger failures
- ✅ Data Routing section shows active paths
- ✅ Sensor information modals work

---

## 🎓 What Each Service Does

**Netlify**: Hosts your React frontend  
**Railway**: Hosts your Node.js/Express backend  
**GitHub**: Version control & triggers auto-deploys  

When you push to GitHub:
- Netlify auto-rebuilds & redeploys frontend
- Railway auto-rebuilds & redeploys backend
- They communicate via WebSocket using environment-defined URLs

---

## 💡 Pro Tips

1. **Free tier is generous** - Start with free tiers, upgrade only if needed
2. **Auto-redeploy** - Every push to `main` auto-deploys (no manual steps!)
3. **Logs available** - Both Netlify and Railway show live logs for debugging
4. **Easy rollback** - Click a previous deployment to revert instantly
5. **Custom domain** - Add your domain to Netlify later if desired

---

## 📚 More Resources

- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [Environment Variables Guide](https://docs.netlify.com/configure-builds/environment-variables/)

---
