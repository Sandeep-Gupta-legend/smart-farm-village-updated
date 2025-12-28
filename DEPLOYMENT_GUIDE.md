# Deployment Configuration Guide

## Backend (Render)

### Environment Variables to Set on Render:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret_key
FRONTEND_URL=https://your-app.vercel.app

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways (Optional)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_key

# Security
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MS=1800000
```

### Deploy Steps:
1. Push your code to GitHub
2. Connect Render to your GitHub repository
3. Select the `backend` folder as the root directory
4. Add all environment variables above
5. Deploy!

---

## Frontend (Vercel)

### Environment Variables to Set on Vercel:

```
VITE_API_URL=https://your-backend-app.onrender.com/api
```

### Deploy Steps:
1. Push your code to GitHub
2. Import project on Vercel
3. Set Root Directory to `smart-farm-village-main`
4. Add the environment variable `VITE_API_URL`
5. Deploy!

---

## Post-Deployment Checklist

### 1. Test Backend API
```bash
curl https://your-backend-app.onrender.com/api/health
```

### 2. Test Admin Login
- Go to `https://your-app.vercel.app/admin`
- Login with credentials from `ADMIN_USERNAME` and `ADMIN_PASSWORD`

### 3. Common Issues & Fixes

#### Issue: "Cannot access admin panel"
**Solution:**
- Verify `VITE_API_URL` is set correctly on Vercel
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` matches your Vercel URL

#### Issue: "CORS error"
**Solution:**
- Add your Vercel URL to backend `FRONTEND_URL` environment variable
- Redeploy backend after updating env vars

#### Issue: "401 Unauthorized"
**Solution:**
- Check admin credentials in Render environment variables
- Try resetting password in backend logs
- Verify JWT_SECRET is set on backend

#### Issue: "Network Error"
**Solution:**
- Ensure Render backend is running (check logs)
- Verify API URL doesn't have trailing slash
- Check if Render service is sleeping (free tier)

### 4. Enable Logs
- **Render**: View logs in Render dashboard
- **Vercel**: Check deployment logs and runtime logs

### 5. Database Connection
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Render's IP addresses to whitelist

---

## Quick Fix Commands

### Rebuild and Redeploy Frontend:
```bash
cd smart-farm-village-main
npm run build
# Then push to trigger Vercel deployment
```

### Test API Connection:
```bash
# In browser console on Vercel site:
fetch('https://your-backend-app.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## Important Notes

1. **Free Tier Limitations:**
   - Render free tier sleeps after 15 mins of inactivity
   - First request may take 30-60 seconds to wake up
   - Consider upgrading for production use

2. **Security:**
   - Change default admin password immediately
   - Use strong JWT_SECRET (generate with: `openssl rand -base64 32`)
   - Enable 2FA for critical accounts

3. **Performance:**
   - Enable Vercel Edge Network for faster global access
   - Use Render's paid tier for better performance
   - Consider CDN for image assets
