# 🔧 Deployment Troubleshooting Guide

Quick reference for common deployment issues and solutions.

---

## 🚨 CORS Errors

### Error: "Access to XMLHttpRequest at 'https://backend.onrender.com/api/...' has been blocked by CORS policy"

**Cause**: Frontend and backend are on different domains without proper CORS configuration

**Solution**:
1. On Render dashboard, go to your backend service
2. Find "Environment" section
3. Update or add: `FRONTEND_URL=https://your-vercel-app.vercel.app`
4. Click "Save Changes"
5. Render will automatically redeploy
6. Wait 2-3 minutes for deployment
7. Clear browser cache (Ctrl+Shift+Delete) and reload

**Alternative Check**:
1. Open [https://your-backend.onrender.com/api/health](https://your-backend.onrender.com/api/health) in browser
2. If it works, CORS issue is confirmed
3. Verify `FRONTEND_URL` matches your Vercel URL exactly

---

## 🚨 Backend Deployment Issues

### Error: "Cannot connect to MongoDB" / "ECONNREFUSED"

**Cause**: 
- MongoDB connection string wrong
- MongoDB Atlas IP whitelist doesn't include Render

**Solution**:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Go to "Network Access"
4. Click "Add IP Address"
5. Enter `0.0.0.0/0` (allows from anywhere - for free tier)
6. ⚠️ For production, add Render's IP (find in Render docs)
7. Wait 2-3 minutes for changes to apply
8. Go to Render → Your Service → Manual Deploy

**Check Connection String**:
- Go to MongoDB Atlas → Clusters → Connect
- Select "Connect your application"
- Copy connection string and verify:
  - Replace `<username>` with your database user
  - Replace `<password>` with database user password
  - Check database name is correct

---

### Error: "Cannot find module 'express'" / npm install fails

**Cause**: 
- Dependencies not installed
- package.json corrupted

**Solution**:
1. Check Render logs (scroll down to see build logs)
2. Look for lines mentioning which packages failed
3. Go to Render → Service → Settings
4. Check "Build Command" is exactly: `npm install`
5. Try manual redeploy
6. If still fails, check backend/package.json for syntax errors

---

### Error: "Service failed to start" / No logs after build

**Cause**: 
- Start command incorrect
- Node version incompatible
- Port configuration issue

**Solution**:
1. In Render, check "Start Command" is: `node server.js`
2. Verify PORT environment variable is set to `5000`
3. Check Node version: Add env var `NODE_VERSION=18` or `NODE_VERSION=20`
4. In server.js, ensure:
   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

---

### Backend returns 502 Bad Gateway / Service Unavailable

**Cause**:
- Free tier service sleeping (after 15 mins inactivity)
- Backend crashed or out of memory
- Render service quota exceeded

**Solution**:
1. **For Free Tier Auto-Sleep**:
   - Use uptime monitoring service (UptimeRobot, Pingdom)
   - Configure to ping backend URL every 5 minutes
   - This keeps service awake

2. **Check Service Status**:
   - Go to Render → Service → Logs
   - Look for error messages
   - Check if service needs restart

3. **Manual Wake-Up**:
   - Open https://your-backend.onrender.com/api/health
   - Wait 30 seconds for service to start
   - Retry application

4. **Upgrade to Paid**:
   - Free tier sleeps after 15 mins
   - Paid tier ($7/month) runs continuously

---

## 🚨 Frontend Deployment Issues

### Error: "Blank page" / "Cannot GET /"

**Cause**:
- Build failed silently
- Wrong Root Directory
- Vercel routing misconfigured

**Solution**:
1. Go to Vercel → Deployments → Latest deployment
2. Check "Build Logs" tab:
   - Look for errors with `npm run build`
   - If errors found, fix in code and push to GitHub
3. Check "Settings" → "Build & Development Settings":
   - **Root Directory**: Should be `smart-farm-village-main`
   - **Build Command**: Should be `npm run build`
   - **Output Directory**: Should be `dist`
4. Redeploy: Click three dots → "Redeploy"

---

### Error: "Cannot find module" / "Module not found"

**Cause**: 
- Dependencies not in package.json
- Incorrect import paths

**Solution**:
1. Check Vercel build logs for which module is missing
2. Go to smart-farm-village-main/package.json
3. Verify missing dependency is listed
4. If not found:
   ```bash
   cd smart-farm-village-main
   npm install missing-package-name
   git add package.json package-lock.json
   git commit -m "Add missing dependency"
   git push
   ```
5. Vercel will auto-redeploy

---

### Error: "API_URL is undefined" / "Cannot read properties of undefined"

**Cause**: Environment variable not set in Vercel

**Solution**:
1. Go to Vercel → Your Project → Settings
2. Go to "Environment Variables"
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com/api`
   - **Environments**: Select `Production`
4. Click "Save"
5. Go to Deployments → Latest → Redeploy

**Verify in Code**:
- Check `smart-farm-village-main/src/services/api.js`
- Should have: `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';`

---

### Error: "Image not loading" / Broken images

**Cause**: 
- Image paths use localhost
- Assets not properly bundled

**Solution**:
1. Check `public/` folder exists in `smart-farm-village-main`
2. For images in code:
   - Use: `import img from '/images/name.png'` (from public)
   - Or: `import img from '@/assets/name.png'` (from src/assets)
3. Rebuild: `npm run build`
4. Push to GitHub
5. Vercel will auto-redeploy

---

## 🚨 Authentication Issues

### Error: "401 Unauthorized" / "Cannot access admin panel"

**Cause**:
- JWT_SECRET not set or different on backend
- Token expired
- Invalid credentials

**Solution**:
1. **Check Render Environment**:
   - Go to Render → Backend Service
   - Check "Environment" has `JWT_SECRET` set
   - JWT_SECRET should be same in all environments
   - If changed, click "Save" (auto-redeploy)

2. **Reset Admin Password** (if locked out):
   - SSH into Render or use MongoDB directly
   - Or delete admin user and let system create new one
   - Or change ADMIN_PASSWORD in env var and redeploy

3. **Clear Browser Tokens**:
   - F12 → Application → Local Storage
   - Delete `token` key
   - Reload page
   - Try login again

---

### Error: "Invalid token" / "Token expired"

**Cause**: JWT token malformed or expired

**Solution**:
1. Clear browser storage:
   - F12 → Application → Local Storage → Delete `token`
2. Clear cookies:
   - F12 → Application → Cookies → Delete all
3. Login again
4. Check backend logs for token errors

---

## 🚨 Database Issues

### Error: "E11000 duplicate key error" when registering

**Cause**: Email already exists in database

**Solution**:
1. Try registering with different email
2. Or go to MongoDB Atlas:
   - Find your database
   - Go to "Collections"
   - Find `users` collection
   - Delete the old test user
   - Try registering again

---

### Error: "Cannot reach database" / "Connection timeout"

**Cause**:
- MongoDB Atlas IP whitelist wrong
- Connection string incomplete
- Database user password wrong

**Solution**:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Check "Network Access":
   - Should have entry for `0.0.0.0/0` (anywhere)
   - Click to verify it's set
3. Check connection string:
   - Go to "Clusters" → "Connect"
   - Verify username and password in connection string
4. Test connection locally:
   ```bash
   # In backend directory
   npm start
   ```
   - Should see: `✅ Connected to MongoDB Atlas`
   - If not, check credentials

---

## 🚨 File Upload Issues

### Error: "File upload failed" / "Cannot upload image"

**Cause**:
- Cloudinary credentials wrong
- File too large
- Cloudinary quota exceeded

**Solution**:
1. **Verify Cloudinary Setup**:
   - Go to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Copy these values:
     - Cloud Name
     - API Key
     - API Secret
   - Update on Render:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
   - Redeploy

2. **Check File Size**:
   - Verify: `MAX_FILE_SIZE=10485760` (10MB)
   - Files smaller than 10MB required

3. **Test Cloudinary**:
   - Go to Cloudinary Dashboard
   - Try uploading image there (works = credentials OK)

---

## 🚨 Performance Issues

### Site is slow / Takes long to load

**Cause**:
- Free tier Render service sleeping
- Large bundle size
- Slow database queries

**Solution**:
1. **Check if backend sleeping**:
   - First load always slow on free tier
   - Subsequent loads should be faster
   - Subscribe to paid tier to disable sleep

2. **Reduce bundle size**:
   - Check Vercel deployment logs
   - Look for bundle analysis
   - Remove unused dependencies

3. **Database optimization**:
   - Add indexes for frequently queried fields
   - See MongoDB Atlas GUI for index recommendations

---

## 🚨 Deployment Hangs / Stuck

### Render deployment stuck "In Progress" for 10+ minutes

**Cause**: 
- Long build process
- Deadlock in build
- Service quota issue

**Solution**:
1. Cancel deployment:
   - Go to Render → Service
   - Find "Deploys" tab
   - Click on stuck deployment
   - Look for "Cancel" button
2. Try manual deploy again
3. Check build logs for errors
4. If error, fix code locally and push new commit

---

## ✅ Verification Commands

Run these to verify everything is working:

```bash
# Check backend is running
curl https://your-backend.onrender.com/api/health

# Should return:
# {"status":"ok"}

# Check database connection
curl -X GET https://your-backend.onrender.com/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check frontend is served
curl https://your-app.vercel.app

# Should return HTML content (no errors)
```

---

## 📞 Getting Help

### Check Logs First
1. **Render Logs**: Service → Logs (scroll down)
2. **Vercel Logs**: Deployments → Latest → Logs
3. **Browser Console**: F12 → Console tab
4. **Network Tab**: F12 → Network → check failed requests

### Ask for Help With:
- [ ] Full error message from logs
- [ ] Render service URL
- [ ] Vercel project URL
- [ ] Environment variables set (hide sensitive values)
- [ ] Steps to reproduce issue

---

## 🎯 Common Error Quick Links

| Error | Check First |
|-------|------------|
| CORS Error | Render `FRONTEND_URL` env var |
| Cannot connect MongoDB | MongoDB Atlas IP whitelist |
| Cannot find module | Vercel build logs |
| Blank page | Vercel build logs, Root Directory |
| 401 Unauthorized | JWT_SECRET on Render |
| Image not loading | Image paths, public folder |
| Service sleeping | Upgrade to paid tier |
| 502 Bad Gateway | Render logs, service status |

---

Good luck! If you're still stuck, check the logs thoroughly - they almost always contain the answer. 🔍
