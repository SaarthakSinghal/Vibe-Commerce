# Backend Deployment to Render - Step-by-Step Guide

## Overview
This document provides a complete step-by-step guide to deploy the Vibe Commerce backend to Render.com.

## Prerequisites
- GitHub repository with your code pushed
- Render.com account (free tier available)
- MongoDB Atlas account (for production database)

---

## Step 1: ✅ Build Configuration Verified
**Status:** COMPLETED
**Date:** 2025-11-08

Verified that the backend builds successfully:
- TypeScript compilation working correctly
- Build command: `npm run build` compiles to `dist/` folder
- All dependencies properly configured
- Server entry point: `dist/server.js`

---

## Step 2: ✅ Render Configuration File Created
**Status:** COMPLETED
**Date:** 2025-11-08

Created `backend/render.yaml` with the following configuration:
- Environment: Node.js
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check Path: `/health`
- Free tier plan configured

---

## Step 3: ✅ Set Up MongoDB Database
**Status:** COMPLETED
**Recommended:** Use MongoDB Atlas

### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Log in to the Atlas dashboard

2. **Create a New Cluster**
   - Click "Create a New Cluster"
   - Choose the free tier (M0)
   - Select a region close to your location
   - Click "Create Cluster"
   - Wait for cluster to be created (2-3 minutes)

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Select "Atlas admin" role (or "Read and write to any database")
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - **For Development/Testing (Recommended):** Choose "Allow access from anywhere" (0.0.0.0/0)
   - **For Production:** Add specific IP addresses or use VPC peering
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select Node.js driver version 4.1 or later
   - Copy the connection string
   - Replace `<password>` with the database user password you created
   - Replace `<dbname>` with `vibe-commerce` (or your preferred name)

   Example connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxxx.mongodb.net/vibe-commerce?retryWrites=true&w=majority
   ```

### Option B: Render MongoDB (Alternative)
- Render also offers MongoDB services
- You can create a MongoDB instance from the Render dashboard
- However, MongoDB Atlas is generally more reliable for production

---

## 🔥 CRITICAL FIX: MongoDB Memory Server Issue

**If you see this error in Render logs:**
```
KnownVersionIncompatibilityError: Requested Version "6.0.14" is not available for "Debian 12"
```

**This is caused by:** The backend was trying to use MongoDB Memory Server (a testing library) in production.

**FIXED:** The database connection logic has been updated in `backend/src/utils/database.ts`. The backend will now:
- Use MongoDB Memory Server ONLY when `USE_FAKE_STORE=true` (development mode)
- Use real MongoDB when `USE_FAKE_STORE=false` (production mode)

**To apply the fix:**
1. ✅ Code has been updated and rebuilt
2. Push changes to GitHub: `git add . && git commit -m "Fix MongoDB Memory Server in production" && git push origin main`
3. In Render environment variables, set: `USE_FAKE_STORE=false`
4. In Render environment variables, set: `MONGODB_URI` to your MongoDB Atlas connection string
5. Redeploy the service

---

## Step 4: Deploy to Render

### Step 4.1: Push Code to GitHub
Ensure your code is pushed to a GitHub repository:
```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### Step 4.2: Connect GitHub to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up using your GitHub account

2. **Create a New Web Service**
   - Click "New" in the dashboard
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend

3. **Configure Service Settings**

   **Build and Deploy Settings:**
   - **Name:** vibe-commerce-backend (or your preferred name)
   - **Region:** Choose closest to your users
   - **Branch:** main (or your deployment branch)
   - **Root Directory:** backend (if your backend is in a subdirectory)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

   **Environment Variables (in the Render dashboard):**
   - Click "Add Environment Variable" and add each of these:
     - `NODE_VERSION` = `18`
     - `PORT` = `10000` (Render will override this, but set as default)
     - `MONGODB_URI` = `[YOUR_MONGODB_ATLAS_CONNECTION_STRING]`
     - `MOCK_USER_ID` = `mock-user-123`
     - `CORS_ORIGIN` = `*` (or your frontend domain)
     - `USE_FAKE_STORE` = `false` ⚠️ **IMPORTANT: Must be false for production**

4. **Create Service**
   - Click "Create Web Service"
   - Render will automatically start the build process

---

## Step 5: ✅ Configure Environment Variables
**Status:** COMPLETED

After creating the service, make sure all environment variables are set in the Render dashboard:
1. Go to your service dashboard on Render
2. Click on "Environment" tab
3. Verify all environment variables are set correctly

---

## Step 6: Monitor Deployment

### Build Logs
- Watch the build logs in the Render dashboard
- Look for any errors during the build process
- Successful build should show: "Build completed successfully"

### Runtime Logs
- After deployment, check runtime logs
- You should see: "Server is running on port 10000" (or similar)

---

## Step 7: Test Deployed Backend
**Status:** PENDING

### Step 7.1: Health Check
Once deployed, test the health endpoint:
```bash
curl https://[your-service-name].onrender.com/health
```

Expected response:
```json
{
  "status": "ok"
}
```

### Step 7.2: Test API Endpoints
Test a few API endpoints to ensure everything is working:
```bash
curl https://[your-service-name].onrender.com/api/products
```

---

## Step 8: Update Frontend Configuration
After successful deployment, update your frontend environment to point to the new backend URL:

1. Find your backend URL in the Render dashboard (e.g., `https://vibe-commerce-backend.onrender.com`)

2. Update frontend environment variables or configuration to use this URL instead of `localhost:5001`

---

## Troubleshooting

### Build Fails
- Check build logs for TypeScript errors
- Ensure all dependencies are listed in package.json
- Verify the build command is correct

### Runtime Errors
- Check environment variables are set correctly
- Verify MongoDB URI is valid and accessible
- Check CORS_ORIGIN setting

### Database Connection Issues
- Verify IP access list in MongoDB Atlas
- Check username and password in connection string
- Ensure database name in connection string exists

### Application Crashes on Startup
- Check runtime logs in Render dashboard
- Verify start command: `npm start` (not `npm run start`)

---

## Important Notes

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds
   - For production, consider upgrading to paid tier

2. **Environment Variables:**
   - Never commit .env files to Git
   - Use Render's environment variable section
   - For sensitive data, use Render's "Secret Files" feature

3. **MongoDB Connection:**
   - Local MongoDB (`mongodb://localhost:27017`) won't work in production
   - Must use cloud-hosted MongoDB (Atlas recommended)
   - Update connection string for production

---

## Success Criteria

✅ Backend builds successfully
✅ render.yaml configuration file created
✅ Database connection logic fixed (MongoDB Memory Server issue resolved)
✅ MongoDB database set up (Atlas)
✅ Render deployment completed
✅ Environment variables configured (USE_FAKE_STORE=false)
✅ Health endpoint responds
✅ API endpoints functional (products API working at https://vibe-commerce-ren9.onrender.com/api/products)

## 🎉 Deployment Successful!

**Backend URL:** https://vibe-commerce-ren9.onrender.com
**Status:** Live and working
**API Endpoint:** https://vibe-commerce-ren9.onrender.com/api/products
**Health Check:** https://vibe-commerce-ren9.onrender.com/health

---

## Useful Links

- Render Dashboard: https://dashboard.render.com
- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vibe Commerce Frontend: (update with your frontend URL)

---

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure CI/CD pipeline
3. Set up monitoring and logging
4. Configure automated backups for MongoDB
5. Set up error tracking (e.g., Sentry)

---

*Last Updated: 2025-11-08*
*Deployment Guide Version: 1.0*
