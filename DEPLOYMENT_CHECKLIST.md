# 🚀 Pre-Deployment Checklist

Use this checklist before deploying your application.

## ✅ Code Quality Checks

- [ ] All `console.log()` statements removed or wrapped in `if (process.env.DEBUG)`
- [ ] No hardcoded URLs or API endpoints (use environment variables)
- [ ] No sensitive data (API keys, passwords) in code
- [ ] All error handling implemented
- [ ] Proper HTTP status codes returned (200, 401, 403, 404, 500, etc.)
- [ ] `.env` file added to `.gitignore`
- [ ] All dependencies listed in `package.json`

## ✅ Frontend Checks

- [ ] Build completes without errors: `npm run build`
- [ ] Build preview works: `npm run preview`
- [ ] `VITE_API_URL` environment variable configured
- [ ] No `localhost:5000` hardcoded in code
- [ ] API calls use `VITE_API_URL` environment variable
- [ ] Asset paths are relative (no absolute paths)
- [ ] Images load correctly in production build
- [ ] Responsive design tested on mobile
- [ ] All links and routes work
- [ ] No console errors in browser (F12)

## ✅ Backend Checks

- [ ] Starts locally without errors: `npm start`
- [ ] Database connection tested
- [ ] All environment variables defined
- [ ] `/api/health` endpoint returns `{"status":"ok"}`
- [ ] CORS configured for production URL
- [ ] Rate limiting working
- [ ] Error logging configured
- [ ] No sensitive data in error messages
- [ ] File upload working with Cloudinary
- [ ] Payment gateway webhooks configured (if applicable)

## ✅ Database Checks

- [ ] MongoDB Atlas cluster created and running
- [ ] Network access configured (IP whitelist)
- [ ] Database user created with strong password
- [ ] Connection string correct in `.env`
- [ ] Database name correct in connection string
- [ ] Indexes created for frequently queried fields
- [ ] Backup enabled in MongoDB Atlas

## ✅ External Services

- [ ] Cloudinary account created and keys added
- [ ] JWT secret generated (32+ random characters)
- [ ] Admin username and password set
- [ ] All API keys are correct and active:
  - [ ] Cloudinary API keys
  - [ ] Stripe keys (if using)
  - [ ] Razorpay keys (if using)
  - [ ] Gemini API key (if using)

## ✅ Repository Checks

- [ ] Code committed to GitHub
- [ ] No sensitive data in git history
- [ ] `.env` file in `.gitignore`
- [ ] `node_modules` in `.gitignore`
- [ ] Build artifacts in `.gitignore`
- [ ] All code pushed to main branch

## ✅ Render Backend Setup

- [ ] Create Render account
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Root Directory set to `backend/`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js`
- [ ] All environment variables added
- [ ] Deployment successful (no errors in logs)
- [ ] Backend URL obtained (e.g., `https://xxx.onrender.com`)

## ✅ Vercel Frontend Setup

- [ ] Create Vercel account
- [ ] Project imported from GitHub
- [ ] Root Directory set to `smart-farm-village-main`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] `VITE_API_URL` environment variable set to Render URL
- [ ] Deployment successful
- [ ] Frontend URL obtained (e.g., `https://xxx.vercel.app`)

## ✅ Post-Deployment Tests

### API Tests
- [ ] Backend health endpoint: `curl https://backend-url.onrender.com/api/health`
- [ ] Admin login works
- [ ] User registration works
- [ ] User login works
- [ ] Product listing works
- [ ] Search functionality works
- [ ] File uploads work (Cloudinary)

### Frontend Tests
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Login page accessible
- [ ] Registration page accessible
- [ ] Admin panel accessible
- [ ] Dashboard loads
- [ ] No CORS errors in console (F12)
- [ ] No broken images or assets
- [ ] Responsive design on mobile
- [ ] Forms submit correctly

### Cross-Browser Tests
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## ✅ Security Checks

- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS configured for specific domain
- [ ] Rate limiting implemented
- [ ] JWT validation working
- [ ] Password hashing implemented
- [ ] Sensitive error messages not exposed
- [ ] SQL injection not possible (MongoDB)
- [ ] XSS prevention implemented (React handles this)

## ✅ Monitoring Setup

- [ ] Render logs accessible
- [ ] Vercel logs accessible
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring configured (to prevent free tier sleep)
- [ ] Email alerts configured (optional)

## ✅ Documentation

- [ ] Deployment guide created
- [ ] API documentation available
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Team notified of deployment

## 📋 Before You Deploy

**Last Minute Verification:**
1. Did you update `VITE_API_URL` in Vercel with your Render backend URL?
2. Did you update `FRONTEND_URL` in Render with your Vercel frontend URL?
3. Did you set `NODE_ENV=production` on Render?
4. Are all MongoDB credentials correct?
5. Did you test locally one more time?

---

## 🎯 Deployment Priority

**Critical (Must Deploy):**
1. Backend environment variables
2. Frontend environment variables
3. Database connection
4. CORS configuration

**Important (Should Deploy):**
1. Rate limiting
2. Error handling
3. Logging
4. Security headers

**Nice to Have (Can Deploy Later):**
1. Analytics
2. Error tracking
3. Performance monitoring
4. Custom domain

---

## 🚨 Emergency Rollback

If something goes wrong after deployment:

### Render Rollback
1. Go to Render dashboard
2. Select your service
3. Go to "Settings" → "Deploys"
4. Find previous successful deploy
5. Click "Redeploy"

### Vercel Rollback
1. Go to Vercel dashboard
2. Go to "Deployments"
3. Find previous successful deployment
4. Click three dots → "Promote to Production"

---

Good luck with your deployment! 🚀
