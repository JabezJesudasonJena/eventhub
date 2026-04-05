# Setup Instructions - Neon PostgreSQL Version

## Complete Setup in 10 Minutes

### Prerequisites
- ✅ Node.js installed (check with: `node --version`)
- ✅ npm installed (check with: `npm --version`)
- ✅ Internet connection

---

## Step-by-Step Setup

### Step 1: Get Your Neon Database (5 minutes)

1. **Go to Neon**: https://neon.tech

2. **Sign Up/Login**:
   - Click "Sign Up" (free, no credit card required)
   - Use GitHub, Google, or email

3. **Create a Project**:
   - Click "Create Project" or "New Project"
   - Give it a name: `event-registration` (or anything you like)
   - Select region closest to you
   - Click "Create Project"

4. **Get Connection String**:
   - After project is created, you'll see a connection string
   - It looks like: `postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - **Copy this entire string** (you'll need it in Step 3)

   ![Neon Dashboard showing connection string]

---

### Step 2: Install Dependencies (1 minute)

Open terminal/command prompt in your project directory:

```bash
# Navigate to backend directory
cd backend

# Install all required packages
npm install
```

You should see:
```
added 15 packages, and audited 114 packages in 2s
```

---

### Step 3: Configure Environment (2 minutes)

1. **Copy the example file**:
   ```bash
   # On Mac/Linux
   cp .env.example .env

   # On Windows (Command Prompt)
   copy .env.example .env

   # On Windows (PowerShell)
   Copy-Item .env.example .env
   ```

2. **Edit the .env file**:
   - Open `backend/.env` in any text editor
   - Replace the placeholder with your actual Neon connection string

   **Before:**
   ```
   DATABASE_URL=postgresql://username:password@your-neon-host.neon.tech/neondb?sslmode=require
   PORT=3000
   ```

   **After (with your actual string):**
   ```
   DATABASE_URL=postgresql://alex_user_12345:AbCdEf123456@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   PORT=3000
   ```

3. **Save the file**

---

### Step 4: Start the Server (1 minute)

In the terminal (still in `backend` directory):

```bash
npm start
```

**Expected Output:**
```
Connected to PostgreSQL database (Neon)
Database tables created successfully
Server is running on http://localhost:3000
API available at http://localhost:3000/events
```

✅ **Success!** Your server is running!

---

### Step 5: Test the Application (1 minute)

1. **Open your browser**
2. **Go to**: `http://localhost:3000`
3. **You should see**: Event Registration System homepage

---

## Verify Everything Works

### Test 1: Create an Event

1. Click "Create New Event"
2. Fill in:
   - Event Name: `Test Event`
   - Date: Any future date
   - Location: `Your City`
   - Description: `Testing the system`
3. Click "Create Event"
4. ✅ You should see the event in the list

### Test 2: Check Neon Dashboard

1. Go back to Neon dashboard
2. Click on your project
3. Click "SQL Editor" or "Tables"
4. Run: `SELECT * FROM events;`
5. ✅ You should see your test event!

### Test 3: Register for Event

1. Click "View Details" on your test event
2. Enter your name and email
3. Click "Register Now"
4. ✅ You should see yourself in the attendees list

---

## Troubleshooting

### Problem: "MODULE NOT FOUND" Error

**Solution:**
```bash
cd backend
npm install
```

### Problem: "DATABASE_URL is not defined"

**Solution:**
- Check that `.env` file exists in `backend` folder
- Open `.env` and verify `DATABASE_URL=` line is there
- Make sure you copied your actual Neon connection string
- Restart the server

### Problem: "Connection Refused" or "ECONNREFUSED"

**Solution:**
- Check your internet connection
- Verify DATABASE_URL is correct (no typos)
- Go to Neon dashboard, check if project is active
- Try stopping and restarting the server

### Problem: "SSL connection error"

**Solution:**
- Make sure your connection string ends with `?sslmode=require`
- Check `database.js` has `ssl: { rejectUnauthorized: false }`

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Option 1: Stop other process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Option 2: Use different port
# Edit .env file:
PORT=3001
```

### Problem: "Cannot GET /"

**Solution:**
- Make sure you're accessing `http://localhost:3000` (not `file://`)
- Check that frontend files are in the `frontend` folder
- Verify server is running (check terminal)

---

## File Structure After Setup

```
event-registration-system/
├── backend/
│   ├── .env                 ← Your environment variables (DO NOT COMMIT)
│   ├── .env.example         ← Template
│   ├── database.js          ← PostgreSQL connection
│   ├── schema.sql           ← Database schema
│   ├── server.js            ← Express server
│   ├── package.json         ← Dependencies
│   └── node_modules/        ← Installed packages
├── frontend/
│   ├── index.html
│   ├── event.html
│   ├── form.html
│   └── styles.css
└── README_NEON.md
```

---

## Important Notes

### ⚠️ Security

- **NEVER** commit `.env` file to Git
- **NEVER** share your DATABASE_URL publicly
- The `.env` file is already in `.gitignore`

### 💡 Tips

- **Neon Auto-Suspend**: Free tier databases auto-suspend after inactivity. First request after might be slower (it's waking up).

- **Multiple Environments**: 
  - Create `.env.development` for dev
  - Create `.env.production` for prod
  - Use different Neon projects/branches

- **View Logs**: 
  - Check terminal for server logs
  - Check Neon dashboard for database queries

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Check if server is running
curl http://localhost:3000/events

# View environment variables (Mac/Linux)
cat backend/.env

# View environment variables (Windows)
type backend\.env
```

---

## What's Next?

✅ Server is running
✅ Database is connected  
✅ Frontend is accessible

**Now you can:**
- Create events
- Register for events
- Edit and delete events
- View registrations

**Learn more:**
- `README_NEON.md` - Complete documentation
- `MIGRATION_GUIDE.md` - Technical details
- `PROJECT_SUMMARY_NEON.md` - Overview

---

## Need Help?

1. **Check server logs** in terminal
2. **Check browser console** (F12 → Console tab)
3. **Review documentation** files
4. **Neon Help**: https://neon.tech/docs
5. **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## Success Checklist

- [ ] Neon account created
- [ ] Project created in Neon
- [ ] Connection string copied
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created with DATABASE_URL
- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can create an event
- [ ] Can register for event
- [ ] Can see data in Neon dashboard

---

🎉 **Congratulations!** Your Event Registration System is now running with Neon PostgreSQL!

Enjoy building with your production-ready application! 🚀
