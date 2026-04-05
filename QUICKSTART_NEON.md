# Quick Start Guide - Neon PostgreSQL Version

## Prerequisites

✅ Node.js installed
✅ A Neon account (free at https://neon.tech)

## 5-Minute Setup

### 1. Get Neon Connection String

1. Go to https://neon.tech
2. Sign up or log in
3. Create a new project (or use existing)
4. Copy the connection string from the dashboard
   - It looks like: `postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and paste your Neon connection string:

```
DATABASE_URL=postgresql://your-actual-connection-string-here
PORT=3000
```

**⚠️ IMPORTANT**: The `.env` file is gitignored. Never commit it!

### 4. Start the Server

```bash
npm start
```

You should see:
```
Connected to PostgreSQL database (Neon)
Database tables created successfully
Server is running on http://localhost:3000
```

### 5. Open Your Browser

Navigate to: **http://localhost:3000**

## Test the Application

### Create Your First Event

1. Click "Create New Event"
2. Fill in:
   - **Event Name**: Tech Meetup 2026
   - **Date**: Pick a future date
   - **Location**: New York, NY
   - **Description**: Join us for networking and tech talks!
3. Click "Create Event"

### Register for the Event

1. Click "View Details" on your event
2. Scroll down to the registration form
3. Enter your name and email
4. Click "Register Now"
5. See yourself in the attendees list!

## Common Commands

```bash
# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Install dependencies
npm install
```

## Verify It's Working

Check if tables were created in Neon:

1. Go to your Neon dashboard
2. Click on "SQL Editor"
3. Run: `SELECT * FROM events;`
4. You should see your created events!

## What's Different from SQLite?

| SQLite Version | Neon PostgreSQL Version |
|----------------|-------------------------|
| File-based (events.db) | Cloud database (Neon) |
| Local only | Accessible from anywhere |
| No configuration needed | Needs DATABASE_URL |
| Automatic (no setup) | Need Neon account |
| Good for dev | Production-ready |

## Troubleshooting

**Error: "CONNECTION REFUSED"**
```
✅ Check DATABASE_URL in .env
✅ Verify Neon project is active
✅ Check internet connection
```

**Error: "DATABASE_URL is not defined"**
```
✅ Create .env file in backend folder
✅ Add DATABASE_URL=your-connection-string
✅ Restart the server
```

**Error: "SSL connection error"**
```
✅ Ensure ?sslmode=require is in URL
✅ Check database.js has ssl: { rejectUnauthorized: false }
```

**Can't access the site**
```
✅ Server must be running (check terminal)
✅ Access http://localhost:3000 (not file://)
✅ Check PORT in .env matches your browser URL
```

## Environment Variables Explained

**DATABASE_URL**
- Your Neon PostgreSQL connection string
- Format: `postgresql://user:pass@host/database?sslmode=require`
- Get it from Neon dashboard

**PORT**
- Server port (default: 3000)
- Change if 3000 is already in use

## Quick Tips

💡 **Neon Auto-Suspends**: If database is idle, first request might be slow (it's waking up)

💡 **Free Tier Limits**: 
- 0.5 GB storage
- 1 project
- Auto-suspend after inactivity

💡 **Connection String Security**: 
- Never share your connection string
- Never commit .env to git
- Rotate credentials if exposed

💡 **Multiple Environments**:
- Use different Neon branches for dev/staging/prod
- Create `.env.development` and `.env.production`

## Next Steps

✅ Create more events
✅ Test registration system
✅ Edit and delete events
✅ Check Neon dashboard to see data
✅ Explore the code in `database.js`

## Need Help?

- 📖 Full documentation: `README_NEON.md`
- 🔧 Code comments in `backend/database.js`
- 🌐 Neon docs: https://neon.tech/docs
- 💬 PostgreSQL docs: https://www.postgresql.org/docs/

Enjoy your cloud-powered Event Registration System! ☁️🎉
