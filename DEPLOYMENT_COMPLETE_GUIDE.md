# Complete Deployment Guide - Smart Farm Village
## Deploy to Render (Backend) & Vercel (Frontend)

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account with your code pushed to a repository
- ✅ MongoDB Atlas cluster set up (free tier available)
- ✅ Render account (free tier available)
- ✅ Vercel account (free tier available)
- ✅ Cloudinary account for image uploads
- ✅ All API keys and secrets from your `.env` file

---

## 🔧 Pre-Deployment Checklist

### 1. Verify Local Build Works
```bash
# Backend
cd backend
npm install
npm start

# In another terminal - Frontend
cd smart-farm-village-main
npm install
npm run build
npm run preview
```

### 2. Environment Variables Verification
Ensure your `.env` file has all required variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=https://your-app.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
GEMINI_API_KEY=your_gemini_api_key
MAX_FILE_SIZE=10485760
```

### 3. MongoDB Atlas Configuration
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Go to **Database Access** → Create a user with username/password
4. Go to **Network Access** → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for free tier
   - ⚠️ For production, restrict to Render's IP
5. Go to **Databases** → Click "Connect"
6. Select "Connect your application"
7. Copy the connection string (replace `<username>` and `<password>`)

---

## 🚀 PART 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
cd c:\code\smart-farm-village-updated-main
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +"
4. Select "Web Service"

### Step 3: Connect Repository
1. Select "Build and deploy from a Git repository"
2. Click "Connect account" (authorize Render)
3. Find and select your repository
4. Set:
   - **Name**: `smart-farm-village-backend`
   - **Runtime**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `backend/` (✅ IMPORTANT!)

### Step 4: Set Environment Variables
In Render dashboard, go to **Environment** section and add all these:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_farm_village?retryWrites=true&w=majority
JWT_SECRET=your_very_strong_random_secret_key_min_32_chars
FRONTEND_URL=https://your-app.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
GEMINI_API_KEY=your_gemini_api_key
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/tmp/uploads
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (usually 5-10 minutes)
3. You'll see a URL like: `https://smart-farm-village-backend.onrender.com`
4. Check logs for errors (scroll down to see build & deployment logs)

### Step 6: Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/health
```
Expected response: `{"status":"ok"}`

### Step 7: Fix Render Auto-Sleep (Important!)
Free tier services sleep after 15 minutes of inactivity.
- **Solution**: Upgrade to Paid ($7/month) OR add a monitoring service
- **Temporary Fix**: Access your site regularly to keep it awake

---

## 🎨 PART 2: Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub

### Step 2: Import Project
1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Find your repository
4. Click "Import"

### Step 3: Configure Build Settings
1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Set to `smart-farm-village-main`
3. **Build Command**: `npm run build` (should auto-detect)
4. **Output Directory**: `dist` (should auto-detect)
5. **Install Command**: `npm install`

### Step 4: Set Environment Variables
Add this environment variable:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```
Replace `your-backend-url` with your actual Render URL from Step 1.

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (usually 2-5 minutes)
3. You'll get a URL like: `https://smart-farm-village.vercel.app`

### Step 6: Verify Frontend Loads
1. Open your Vercel URL in browser
2. Check browser console (F12) for errors
3. Verify no CORS errors appear

---

## ✅ POST-DEPLOYMENT TESTING

### Test 1: Backend Health
```bash
curl https://your-backend.onrender.com/api/health
```
✅ Should return: `{"status":"ok"}`

### Test 2: Login Functionality
1. Go to `https://your-app.vercel.app/login`
2. Test buyer/seller registration
3. Try login with created account
4. Check browser console (F12) for errors

### Test 3: Admin Panel
1. Go to `https://your-app.vercel.app/admin`
2. Login with credentials:
   - Username: Value from `ADMIN_USERNAME`
   - Password: Value from `ADMIN_PASSWORD`
3. Verify you can access dashboard

### Test 4: Product Upload (if admin)
1. Try uploading an image
2. Verify Cloudinary integration works
3. Check image appears correctly

### Test 5: API Endpoints
```bash
# Test API connectivity from frontend
curl https://your-app.vercel.app
# Should load HTML without errors
```

---

## 🐛 Common Issues & Solutions

### ❌ CORS Error: "Access to XMLHttpRequest blocked"
**Problem**: Frontend can't reach backend
**Solution**:
```bash
# On Render, update FRONTEND_URL to match your Vercel URL
FRONTEND_URL=https://your-app.vercel.app
```
Then redeploy backend.

### ❌ Blank Page / 404 Error
**Problem**: Frontend build failed or routes misconfigured
**Solution**:
1. Check Vercel deployment logs
2. Ensure `vercel.json` has correct rewrites
3. Verify Root Directory is `smart-farm-village-main`

### ❌ "Cannot reach backend" / API 502
**Problem**: Backend service is down or sleeping
**Solution**:
1. Check Render service logs
2. Verify MongoDB connection string in env vars
3. For free tier: Access backend URL to wake it up
4. Consider upgrading to paid tier

### ❌ 401 Unauthorized on Admin Login
**Problem**: Admin credentials issue
**Solution**:
1. Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` on Render
2. Verify `JWT_SECRET` is set on Render
3. Ensure backend redeployed after changing env vars

### ❌ Images Not Uploading
**Problem**: Cloudinary configuration issue
**Solution**:
1. Verify all Cloudinary variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Ensure they match your Cloudinary account
3. Redeploy backend after updating

### ❌ "Cannot find module" errors in backend
**Problem**: Missing dependencies
**Solution**:
1. Ensure `backend/package.json` has all dependencies
2. Render's build command runs `npm install` automatically
3. Check Render build logs for missing packages

### ❌ Slow Performance / Timeouts
**Problem**: 
- Free tier MongoDB has limitations
- Free tier Render auto-pauses after 15 mins
**Solution**:
1. Upgrade MongoDB plan if needed
2. Upgrade Render to paid plan ($7/month)
3. Or add uptime monitoring to prevent sleep

---

## 📱 Mobile App Deployment (React Native/Flutter)

If you have mobile apps, update their API URLs:

```javascript
// For React Native
const API_URL = 'https://your-backend.onrender.com/api';

// For Flutter
final apiUrl = 'https://your-backend.onrender.com/api';
```

Rebuild and redeploy your mobile apps.

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` file to GitHub
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Rotate admin password regularly
- ✅ Keep API keys secret

### 2. Database Security
- ✅ Enable MongoDB Atlas IP whitelist (don't use 0.0.0.0/0 in production)
- ✅ Use strong database user password
- ✅ Enable database authentication

### 3. HTTPS Only
- ✅ Both Render and Vercel provide free HTTPS
- ✅ Never send sensitive data over HTTP

### 4. Rate Limiting
- ✅ Backend includes rate limiting (15 min/100 requests)
- ✅ Login attempts limited to 6 per minute
- ✅ Adjust in `backend/server.js` if needed

### 5. CORS Configuration
- ✅ Backend only allows requests from your Vercel URL
- ✅ Uses `FRONTEND_URL` environment variable
- ✅ Restricts methods and headers

---

## 📊 Monitoring & Logs

### View Render Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Check for errors or connection issues

### View Vercel Logs
1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Click on specific deployment
5. Check "Build Logs" and "Runtime Logs"

### Monitor with Uptime Service
Add monitoring to prevent free tier auto-pause:
1. Use free services: UptimeRobot, Pingdom, or Freshping
2. Set to ping backend every 5 minutes
3. This keeps it from sleeping

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
Both Render and Vercel auto-deploy when you push to your repository:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Render & Vercel automatically redeploy!
```

To disable auto-deploy:
- **Render**: Settings → Disable "Auto-Deploy"
- **Vercel**: Settings → Git → Disable "Redeploy on push"

---

## 🎓 Next Steps

1. ✅ Complete all deployment steps above
2. ✅ Test all functionality listed in POST-DEPLOYMENT TESTING
3. ✅ Share deployment URLs with team
4. ✅ Set up monitoring
5. ✅ Configure custom domain (optional)
6. ✅ Set up CI/CD pipeline (optional)

---

## 📞 Troubleshooting Support

### Check These First:
1. **Render Logs** - Click service → Logs
2. **Vercel Logs** - Deployments → Click deployment
3. **Browser Console** - F12 → Console tab
4. **Network Tab** - F12 → Network tab, check API calls

### Common URLs to Test:
```
Backend Health: https://your-backend.onrender.com/api/health
Frontend Home: https://your-app.vercel.app
Admin Panel: https://your-app.vercel.app/admin
Login: https://your-app.vercel.app/login
```

---

## 🎉 You're Done!

Your Smart Farm Village is now deployed and live! 

**Backend**: `https://your-backend.onrender.com`
**Frontend**: `https://your-app.vercel.app`

Share these URLs with your users!
