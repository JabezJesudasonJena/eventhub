# How to Run the Program

## 🏠 Running Locally

### Step 1: Get Your Neon Database

1. Go to https://neon.tech and sign up (free)
2. Create a new project
3. Copy your connection string (looks like):
   ```
   postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Setup Environment

Navigate to the backend folder and create `.env` file:

```bash
cd backend
```

Create a file named `.env` with this content:
```
DATABASE_URL=postgresql://your-actual-connection-string-here
PORT=3000
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
Connected to PostgreSQL database (Neon)
Database tables created successfully
Server is running on http://localhost:3000
```

### Step 5: Open in Browser

Go to: **http://localhost:3000**

---

## ☁️ Deploying to Render

### Quick Deploy Steps

1. **Push your code to GitHub** (without the .env file - it's gitignored)

2. **Go to Render Dashboard**: https://dashboard.render.com

3. **Create a Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

4. **Configure the Service**:

   **Name:** `event-registration-system` (or anything you like)
   
   **Region:** Choose closest to you
   
   **Branch:** `main` (or your default branch)
   
   **Root Directory:** `backend`
   
   **Environment:** `Node`
   
   **Build Command:**
   ```
   npm install
   ```
   
   **Start Command:**
   ```
   npm start
   ```

5. **Add Environment Variable**:
   - Click "Environment" tab
   - Click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string
   - Click "Add"

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

7. **Access Your App**:
   - Render will give you a URL like: `https://your-app.onrender.com`
   - Open it in your browser!

---

## 📝 Render Configuration Summary

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@host/database?sslmode=require
PORT=3000
```

Note: Render automatically sets PORT, so it's optional.

---

## 🔧 For Development with Auto-Reload

```bash
cd backend
npm run dev
```

This uses nodemon to automatically restart when you change files.

---

## ⚠️ Common Issues

### Issue: "Cannot find module"
**Solution:** Run `npm install` in the backend directory

### Issue: "DATABASE_URL is not defined"
**Solution:** 
- Locally: Create `.env` file in backend folder
- Render: Add DATABASE_URL in Environment Variables

### Issue: "Port already in use"
**Solution:** 
- Kill the process using port 3000, or
- Change PORT in .env to 3001

---

## 📦 Complete Commands Reference

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run in production mode
npm start

# Run in development mode (auto-reload)
npm run dev

# Check if server is running
curl http://localhost:3000/events
```

---

## ✅ Success Checklist

- [ ] Neon database created
- [ ] Connection string copied
- [ ] `.env` file created (for local)
- [ ] `npm install` completed
- [ ] Server starts without errors
- [ ] Can access the application
- [ ] Can create events
- [ ] Can register for events

That's it! Your app is now running! 🎉
