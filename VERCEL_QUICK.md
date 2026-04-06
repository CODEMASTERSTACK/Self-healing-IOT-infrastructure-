# ⚡ Vercel Backend - Quick Deploy

## ⚠️ IMPORTANT WARNING

**Your app uses WebSocket persistent connections.**

- ❌ **Vercel FREE**: Will NOT work (10 second timeout)
- ✅ **Vercel PRO**: WILL work ($20/month)
- ✅ **Railway**: WILL work (FREE)

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login
```powershell
vercel login
```

### Step 3: Navigate & Deploy
```powershell
cd c:\Users\Krish\Desktop\Random\Simulation\backend
vercel
```

### Step 4: Follow Prompts
```
? Set up and deploy "backend"? yes
? Which scope? (your account)
? Link to existing project? no
? What's your project's name? iot-simulation-backend
? In which directory is your code? (.)
? Want to modify these settings? no
```

### Step 5: Get Your URL
Vercel will show: `https://iot-simulation-backend-xxx.vercel.app`

### Step 6: Add Environment Variables
In Vercel Dashboard (vercel.com):
```
CORS_ORIGIN = https://your-netlify-site.netlify.app
NODE_ENV = production
```

### Step 7: Update Netlify
In Netlify Dashboard:
```
REACT_APP_API_URL = https://iot-simulation-backend-xxx.vercel.app
```

Redeploy frontend.

---

## ✅ Testing

1. Open your Netlify site
2. Check Console (F12)
3. You should see either:
   - ✅ "Connected to simulation server"
   - ❌ "Connection failed" (likely timeout)

---

## 🟢 SUCCESS vs 🔴 FAILURE

### ✅ If It Works
- Nodes appear and update
- Can click buttons
- Data Routing shows paths
- Connected message in console

### ❌ If It Fails
- Constant reconnection attempts
- "WebSocket connection failed" errors
- Vercel free tier can't handle WebSocket
- **Solution: Switch to Railway (free) or Vercel Pro ($20/month)**

---

## 📊 Comparison

| Feature | Vercel FREE | Vercel PRO | Railway |
|---------|-------------|-----------|---------|
| WebSocket | ❌ NO | ✅ YES | ✅ YES |
| Cost | FREE | $20/mo | FREE |
| Setup | ✅ Easy | ✅ Easy | ✅ Easy |
| **Good for this project?** | ❌ NO | ✅ YES | ✅ BEST |

---

## 🔄 Commands Reference

```powershell
# Deploy again after changes
vercel --prod

# View logs
vercel logs

# Remove project
vercel remove

# List projects
vercel list
```

---

## 🆘 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| WebSocket times out | Free tier limit | Upgrade to Pro or use Railway |
| Build fails | Missing dependencies | Run `npm install` locally first |
| Port issues | Vercel auto-assigns port | Remove hardcoded port 5000 |
| CORS errors | CORS_ORIGIN mismatch | Check environment variables |
| Constant reconnects | WebSocket timeout | Switch to Railway (free) |

---

## 💰 Cost Breakdown

- **Netlify**: FREE
- **Vercel Pro**: $20/month
- **Railway**: FREE ($5 credit)

---

## 🎯 My Honest Recommendation

**Vercel + Vercel Pro** = $20/month (unnecessary expense)
**Netlify + Railway** = $0 (works perfectly, same as your current setup)

Since I previously recommended **Netlify (frontend) + Railway (backend)**, I still think that's the best choice.

If you want Vercel for personal reasons:
1. **Free tier**: Expect WebSocket to fail
2. **Pro tier**: Works great, but expensive
3. **Hybrid**: Use Vercel for frontend only, Railway for backend

---

## 📖 Full Guide

See `VERCEL_DEPLOYMENT.md` for comprehensive details.

---
