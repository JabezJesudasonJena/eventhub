# 🚀 QUICK START GUIDE

## Get Your Production-Ready Backend Running in 3 Minutes

### Prerequisites
- Node.js installed (v14+)
- PostgreSQL database (Neon or local)
- Git (optional)

---

## Step 1: Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Required: Your PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host/database

# Required: Strong JWT secret (generate one below)
JWT_SECRET=your-super-secret-key-here

# Optional: Change if needed
PORT=3000
NODE_ENV=development
```

### Generate JWT Secret (Run this command):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step 2: Initialize Database

This will create all tables, constraints, indexes, views, and seed data:

```bash
npm run init-db
```

You should see:
```
✓ Database schema created successfully
✓ Seed data inserted

Default Accounts:
  Admin: admin@eventify.com / Admin@123
  User:  user@eventify.com / User@123
```

---

## Step 3: Start the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

You should see:
```
==================================================
🚀 Event Registration System API v2.0
==================================================
✓ Server running on port 3000
✓ API: http://localhost:3000
✓ Frontend: http://localhost:3000
==================================================
```

---

## Step 4: Test the API

### Option A: Using curl

#### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eventify.com",
    "password": "Admin@123"
  }'
```

Save the token from the response!

#### 2. Create an Event (Admin)
```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My First Event",
    "date": "2026-12-31",
    "location": "New York",
    "description": "Test event",
    "capacity": 100
  }'
```

#### 3. Get All Events
```bash
curl http://localhost:3000/events
```

#### 4. Register as User
```bash
# Login as user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@eventify.com",
    "password": "User@123"
  }'

# Register for event (use user token)
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

### Option B: Using Browser

1. Open http://localhost:3000
2. Use the frontend UI to interact with the API

### Option C: Using Postman

Import this collection:
- Base URL: `http://localhost:3000`
- Set Authorization header: `Bearer <token>`

---

## Step 5: Verify Everything Works

### Check Health
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-04-07T...",
  "service": "Event Registration API v2.0",
  "database": "Connected"
}
```

### Check Analytics (Admin)
```bash
curl http://localhost:3000/analytics/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📋 Default Accounts

### Admin Account
- **Email:** admin@eventify.com
- **Password:** Admin@123
- **Permissions:** Full access (create/edit/delete events, view analytics)

### User Account
- **Email:** user@eventify.com
- **Password:** User@123
- **Permissions:** View events, register, cancel registrations

---

## 🎯 Common Tasks

### Create a New Admin
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "SecurePass123",
    "role": "admin"
  }'
```

### Create a New User
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Search Events
```bash
curl "http://localhost:3000/events?search=conference&upcoming=true&limit=5"
```

### Get Top Events (Admin)
```bash
curl http://localhost:3000/analytics/top-events?limit=10 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔧 Troubleshooting

### Issue: Database connection failed
```
Solution: Check your DATABASE_URL in .env file
Verify your database is running and accessible
```

### Issue: "Failed to initialize database"
```
Solution: Ensure PostgreSQL is running
Check connection string format
Verify database user has CREATE privileges
```

### Issue: "Invalid or expired token"
```
Solution: Token might have expired (24h default)
Login again to get a new token
Check JWT_SECRET is same between restarts
```

### Issue: npm install errors
```
Solution: Delete node_modules and package-lock.json
Run: npm cache clean --force
Run: npm install
```

---

## 📚 Next Steps

1. **Read API Documentation:** `API_DOCUMENTATION.md`
2. **Understand Database Schema:** `schema.sql`
3. **Review Security Features:** `BACKEND_UPGRADE_SUMMARY.md`
4. **Explore the Code:** Start with `server.js` and follow the routes
5. **Customize:** Add your own features!

---

## 🎓 Learning Resources

### Database Concepts
- Normalization & relationships
- Foreign keys & constraints
- Indexes & query optimization
- Transactions & ACID properties
- Database views for analytics

### Backend Concepts
- JWT authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation & sanitization
- MVC architecture
- RESTful API design

### Security Concepts
- XSS prevention
- SQL injection prevention
- Token-based authentication
- Password strength requirements
- Error message sanitization

---

## 📞 Support

### View Logs
```bash
# Logs show all requests and database queries
# Check console output when server is running
```

### Database Issues
```bash
# Reinitialize database
npm run init-db

# This will drop and recreate all tables
# WARNING: This deletes all data!
```

---

## ✅ Checklist

- [ ] .env file configured
- [ ] Database initialized
- [ ] Server started successfully
- [ ] Health check passed
- [ ] Can login as admin
- [ ] Can create an event
- [ ] Can login as user
- [ ] Can register for event
- [ ] Analytics working

---

**🎉 You're all set! Happy coding!**

For detailed API documentation, see `API_DOCUMENTATION.md`
