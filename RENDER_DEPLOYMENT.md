# Deploy to Render - Complete Guide

## 🚀 Deployment Steps

### Prerequisites
- ✅ GitHub account
- ✅ Render account (free at https://render.com)
- ✅ Neon database (free at https://neon.tech)
- ✅ Code pushed to GitHub

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Make sure `.env` is gitignored** (already done):
   ```bash
   # Check .gitignore contains:
   .env
   .env.local
   ```

2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

---

### Step 2: Create Neon Database (if not done)

1. Go to https://neon.tech
2. Sign up/login
3. Create a new project: `event-registration-prod`
4. **Copy the connection string** - you'll need this!
   ```
   postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

### Step 3: Deploy on Render

#### A. Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** button
3. Select **"Web Service"**

#### B. Connect Repository

1. Click **"Connect a repository"**
2. If first time, click **"Connect GitHub"** and authorize
3. Select your repository from the list
4. Click **"Connect"**

#### C. Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `event-registration` (or your choice) |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

#### D. Add Environment Variables

Scroll down to **"Environment Variables"** section:

1. Click **"Add Environment Variable"**
2. Add the following:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `postgresql://your-actual-neon-connection-string`
   
   **Variable 2 (optional, Render sets this automatically):**
   - Key: `PORT`
   - Value: `3000`

3. Click **"Add"**

#### E. Select Plan

- For free tier: Select **"Free"** plan
- Note: Free tier sleeps after 15 min of inactivity

#### F. Deploy!

1. Click **"Create Web Service"** button
2. Watch the deployment logs
3. Wait 2-3 minutes for build and deployment

---

### Step 4: Access Your App

1. Once deployed, Render gives you a URL like:
   ```
   https://event-registration-xyz.onrender.com
   ```

2. Click the URL or open in browser

3. You should see your Event Registration System! 🎉

---

## 📋 Render Configuration File (Optional)

You can also create a `render.yaml` in your project root for easier deployment:

```yaml
services:
  - type: web
    name: event-registration
    env: node
    region: oregon
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: PORT
        value: 3000
```

Then just click "New +" → "Blueprint" → Select your repo

---

## 🔧 Render Build & Start Commands

### Build Command
```bash
npm install
```

**What it does:**
- Installs all dependencies from `package.json`
- Downloads `pg`, `express`, `cors`, `dotenv`

### Start Command
```bash
npm start
```

**What it does:**
- Runs `node server.js`
- Starts the Express server
- Connects to Neon database
- Creates tables if they don't exist

---

## 🌍 Environment Variables on Render

### Required:
```
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### Optional:
```
PORT=3000
NODE_ENV=production
```

**Note:** Render automatically sets `PORT`, so you don't need to add it unless you want a specific port.

---

## 📊 Deployment Logs

After clicking "Create Web Service", you'll see logs like:

```
==> Cloning from https://github.com/yourname/event-registration...
==> Checking out commit abc123...
==> Running build command 'npm install'...
    added 114 packages in 5s
==> Build successful!
==> Starting service with 'npm start'...
    Connected to PostgreSQL database (Neon)
    Database tables created successfully
    Server is running on http://localhost:10000
==> Service is live 🎉
```

---

## 🔍 Verify Deployment

### 1. Check Health
Visit: `https://your-app.onrender.com/events`

Should return: `[]` (empty array) or your events

### 2. Test API
```bash
curl https://your-app.onrender.com/events
```

### 3. Check Logs
- Go to Render dashboard
- Click on your service
- Click "Logs" tab
- Look for any errors

---

## ⚙️ Advanced Render Settings

### Auto-Deploy
- ✅ Enabled by default
- Automatically deploys when you push to GitHub

### Health Check Path
- Set to: `/events`
- Render will ping this to check if app is running

### Custom Domain
1. Go to "Settings" in Render dashboard
2. Click "Add Custom Domain"
3. Enter your domain
4. Follow DNS configuration steps

---

## 🆓 Free Tier Limitations

Render Free Tier:
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Cold start takes ~30 seconds
- ✅ Automatic SSL
- ✅ Free subdomain

**Tip:** First request after sleep will be slow. Subsequent requests are fast!

---

## 🔄 Update/Redeploy

### Automatic (Recommended)
Just push to GitHub:
```bash
git add .
git commit -m "Updated feature"
git push origin main
```
Render auto-deploys!

### Manual
1. Go to Render dashboard
2. Click your service
3. Click "Manual Deploy"
4. Select branch
5. Click "Deploy"

---

## 🐛 Troubleshooting

### Issue: Build Failed
**Check:**
- Is `backend/package.json` present?
- Root Directory set to `backend`?
- Build command is `npm install`?

### Issue: App Crashes on Start
**Check:**
- DATABASE_URL environment variable set?
- Start command is `npm start`?
- Check logs for error messages

### Issue: Database Connection Failed
**Check:**
- DATABASE_URL is correct
- Neon database is active
- Connection string includes `?sslmode=require`

### Issue: 404 Not Found
**Check:**
- Root Directory is `backend`
- Frontend files are in `frontend` folder (relative to backend)
- server.js has: `app.use(express.static(path.join(__dirname, '../frontend')))`

---

## 📱 Monitor Your App

### Render Dashboard
- View real-time logs
- Check CPU and memory usage
- See request metrics
- Monitor uptime

### Neon Dashboard
- View database queries
- Check connection count
- Monitor storage usage

---

## 🎯 Production Checklist

Before going live:
- [ ] DATABASE_URL set in Render
- [ ] .env file NOT committed to GitHub
- [ ] Frontend points to correct API URL
- [ ] Tested creating events
- [ ] Tested registrations
- [ ] Checked error handling
- [ ] Set up custom domain (optional)
- [ ] Enable auto-deploy from GitHub

---

## 💰 Upgrade to Paid (Optional)

If you need:
- ⚡ No cold starts
- 🚀 Better performance
- 💪 More resources

Upgrade to **Starter Plan** ($7/month):
- Always on (no sleep)
- Faster
- More memory
- Priority support

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs
- **Neon Dashboard:** https://console.neon.tech
- **Your App URL:** (Will be provided after deployment)

---

## 🎉 You're Live!

Congratulations! Your Event Registration System is now deployed and accessible worldwide!

**Share your app:**
```
https://your-app-name.onrender.com
```

**Next steps:**
- Share with users
- Monitor performance
- Add features
- Consider custom domain

---

## 📞 Support

**Render Support:** https://render.com/docs/support
**Neon Support:** https://neon.tech/docs
**This Project:** Check the documentation files in your repo

Happy deploying! 🚀
