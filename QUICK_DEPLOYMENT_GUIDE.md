# ⚡ Quick Deployment Reference

## 🎯 The 10-Minute Deployment

### Prerequisites (Do Once)
- [ ] GitHub account with code pushed
- [ ] MongoDB Atlas free cluster created
- [ ] Render account created (render.com)
- [ ] Vercel account created (vercel.com)
- [ ] Cloudinary account created (cloudinary.com)

### Backend Deployment (Render)
1. Go to [render.com](https://render.com) → "New Web Service"
2. Connect GitHub repository
3. Set **Root Directory** to `backend/`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db_name
JWT_SECRET=use_32_random_characters_here
FRONTEND_URL=https://your-app.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
UPLOAD_PATH=/tmp/uploads
```

7. Click "Create Web Service"
8. Wait for deployment (~5 min) → Get backend URL: `https://xxx.onrender.com`

### Frontend Deployment (Vercel)
1. Go to [vercel.com](https://vercel.com) → "Add New" → "Project"
2. Import GitHub repository
3. Set **Root Directory** to `smart-farm-village-main`
4. Framework should auto-detect as "Vite"
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Click "Deploy"
7. Wait for deployment (~2 min) → Get frontend URL: `https://xxx.vercel.app`

### ✅ You're Live!
- **Backend**: `https://your-backend.onrender.com`
- **Frontend**: `https://your-app.vercel.app`
- **Admin**: `https://your-app.vercel.app/admin`

---

## 🔑 Environment Variables Needed

### Backend (Render) - ALL Required:
```
MONGODB_URI              # From MongoDB Atlas connection string
JWT_SECRET               # Generate: openssl rand -base64 32
ADMIN_USERNAME          # Username for admin panel
ADMIN_PASSWORD          # Password for admin panel  
FRONTEND_URL            # Your Vercel URL
CLOUDINARY_CLOUD_NAME   # From Cloudinary dashboard
CLOUDINARY_API_KEY      # From Cloudinary dashboard
CLOUDINARY_API_SECRET   # From Cloudinary dashboard
```

### Frontend (Vercel) - REQUIRED:
```
VITE_API_URL            # Your Render backend URL + /api
```

---

## ✅ Quick Tests After Deploy

```bash
# Test backend is alive
curl https://your-backend.onrender.com/api/health

# Should return: {"status":"ok"}
```

Then:
1. Open `https://your-app.vercel.app` in browser
2. Try login or registration
3. Open DevTools (F12) → Console
4. Should have NO errors

---

## 🚨 If Something's Wrong

### CORS Error (XMLHttpRequest blocked)
→ Check `FRONTEND_URL` on Render matches your Vercel URL

### Cannot Connect to Backend
→ Check `VITE_API_URL` on Vercel is correct
→ Check backend health: `curl https://your-backend.onrender.com/api/health`

### Blank Page / 404
→ Check Vercel logs: go to Deployment → Build Logs
→ Verify Root Directory is `smart-farm-village-main`

### Cannot Connect to Database
→ Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
→ Verify connection string in `MONGODB_URI`

### 502 Bad Gateway
→ Wait 30 seconds (free tier cold start)
→ Open backend URL directly to wake it up
→ Check Render service logs

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend Root Directory set to `backend/`
- [ ] Frontend Root Directory set to `smart-farm-village-main/`
- [ ] All environment variables set on Render
- [ ] `VITE_API_URL` set on Vercel
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Backend health check works
- [ ] Frontend loads without CORS errors
- [ ] Login/registration works

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Render Dashboard | [render.com/dashboard](https://render.com/dashboard) |
| Vercel Dashboard | [vercel.com/dashboard](https://vercel.com/dashboard) |
| MongoDB Atlas | [cloud.mongodb.com](https://cloud.mongodb.com) |
| Cloudinary | [cloudinary.com/console](https://cloudinary.com/console) |

---

## 💡 Pro Tips

1. **Free tier Render sleeps** after 15 mins inactivity
   - Solution: Upgrade to paid ($7/mo) OR use uptime monitor

2. **Save your URLs**
   - Backend: `https://your-backend.onrender.com`
   - Frontend: `https://your-app.vercel.app`
   - Share these with your team

3. **Auto-redeploy on push**
   - Both Render & Vercel auto-deploy when you push to GitHub
   - Just `git push` and they handle the rest

4. **Rollback if broken**
   - Render: Service → Deploys → Click old deployment → Redeploy
   - Vercel: Deployments → Click old one → Promote to Production

---

## 📞 Need Help?

1. **Check logs first** (always has the answer)
   - Render: Service → Logs
   - Vercel: Deployments → Latest → Logs
   - Browser: F12 → Console

2. **Read TROUBLESHOOTING_DEPLOYMENT.md** for solutions

3. **Common issues**:
   - CORS → Check env vars match
   - Cannot reach DB → Check MongoDB whitelist
   - Cannot find module → Check build logs

---

See `DEPLOYMENT_COMPLETE_GUIDE.md` for detailed step-by-step instructions.
