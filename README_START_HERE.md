# 🚀 Event Registration System - START HERE

## ✨ Welcome!

This is a **production-level Event Registration System** with modern UI, secure authentication, and advanced database features.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Backend

```bash
cd backend
npm install
node utils/initDb.js
node server.js
```

✅ Backend will be running on **http://localhost:3000**

### Step 2: Open the Frontend

Simply open this file in your browser:
```
C:\Users\admin\Desktop\mini-proj\a\frontend\index.html
```

Or use a local server:
```bash
cd frontend
npx http-server -p 8080
```

### Step 3: Login and Test

Click **"Login"** and use these credentials:

**Admin Account:**
- Email: `admin@eventify.com`
- Password: `Admin@123`

**Regular User:**
- Email: `user@eventify.com`  
- Password: `User@123`

---

## 🎨 What You'll See

### Beautiful Modern UI
- 🌑 Dark theme with purple/blue gradients
- ✨ Smooth animations and transitions
- 📱 Fully responsive (works on mobile, tablet, desktop)
- 🎭 Glassmorphism effects
- 🎯 Card-based modern design

### Smart Role-Based Interface
- **As Admin:** You can create, edit, delete events + view registrations
- **As User:** You can register for events  
- **Not Logged In:** You can browse events (read-only)

---

## 📚 Documentation

- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Full testing guide with step-by-step instructions
- **[FINAL_DELIVERY.md](FINAL_DELIVERY.md)** - Complete project summary and features
- **[backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - All API endpoints
- **[backend/INTERVIEW_GUIDE.md](backend/INTERVIEW_GUIDE.md)** - Interview prep Q&A
- **[frontend/DESIGN_GUIDE.md](frontend/DESIGN_GUIDE.md)** - UI/UX design system

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **bcrypt Password Hashing** - Industry-standard encryption  
✅ **Role-Based Access Control** - Admin vs User permissions  
✅ **Input Validation** - Prevent malicious data  
✅ **XSS Prevention** - Sanitized inputs  
✅ **SQL Injection Protection** - Parameterized queries  

---

## 💾 Database Architecture

**3 Normalized Tables:**
- `users` - User accounts with roles
- `events` - Event information with capacity
- `registrations` - User-Event relationships

**Advanced Features:**
- Foreign keys with CASCADE delete
- Unique constraints (prevent duplicates)
- Database transactions (prevent race conditions)
- Indexes for fast queries
- Analytics views

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Google Fonts (Poppins, Inter)
- CSS Variables, Flexbox, Grid
- Animations & Transitions

**Backend:**
- Node.js + Express
- PostgreSQL (Neon Database)
- JWT + bcrypt
- MVC Architecture

---

## 📸 Screenshots & Features

### Home Page
- Event cards in responsive grid
- Search and filter (coming soon)
- Create event button (admin only)

### Event Details
- Full event information
- Registration form (users only)
- Attendee list (admin only)

### Authentication
- Professional login/register pages
- Password validation
- Auto-redirect after login
- User info in navbar

---

## 🧪 Test Scenarios

1. **Browse as Guest** → See events, can't create/register
2. **Login as Admin** → Create/edit/delete events
3. **Login as User** → Register for events
4. **Role Switching** → Logout and login as different role
5. **Registration Flow** → User registers, admin sees attendee

---

## 📁 Project Structure

```
a/
├── frontend/
│   ├── index.html          ← Home page (start here)
│   ├── login.html          ← Login page
│   ├── register.html       ← Sign up page
│   ├── form.html           ← Create/Edit event
│   ├── event.html          ← Event details
│   └── styles.css          ← All styles
│
├── backend/
│   ├── server.js           ← Start backend server
│   ├── controllers/        ← Business logic
│   ├── models/             ← Database operations
│   ├── routes/             ← API endpoints
│   ├── middleware/         ← Auth & validation
│   └── utils/              ← Helpers & DB init
│
└── README_START_HERE.md    ← This file!
```

---

## 🎓 Learning Highlights

This project demonstrates:

- **Full-Stack Development** - Frontend + Backend integration
- **Database Design** - Normalization, relationships, constraints
- **Security** - Authentication, authorization, input validation
- **UI/UX Design** - Modern, professional interface
- **Code Quality** - Modular, organized, documented
- **Best Practices** - MVC, RESTful API, error handling

---

## 🆘 Troubleshooting

### Backend won't start?
```bash
# Kill any process on port 3000
netstat -ano | findstr :3000
# Note the PID, then:
taskkill /PID <PID> /F

# Restart
node server.js
```

### Frontend can't connect to backend?
- Make sure backend is running on port 3000
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)

### Login not working?
- Use exact credentials: `admin@eventify.com` / `Admin@123`
- Check browser console for errors
- Clear localStorage and try again

---

## 🎯 Next Steps

1. ✅ **Start the backend** (follow Step 1 above)
2. ✅ **Open frontend** (follow Step 2 above)
3. ✅ **Login as admin** (follow Step 3 above)
4. ✅ **Create an event** (click "Create Event")
5. ✅ **Logout and login as user**
6. ✅ **Register for the event**
7. ✅ **Explore all features!**

---

## 📞 Quick Reference

**Demo Accounts:**
```
Admin:  admin@eventify.com / Admin@123
User:   user@eventify.com / User@123
```

**Ports:**
```
Backend:  http://localhost:3000
Frontend: Open index.html directly (or port 8080 if using http-server)
```

**Key Commands:**
```bash
# Initialize database
node utils/initDb.js

# Start server
node server.js

# Install dependencies
npm install
```

---

## 🎉 That's It!

You now have a fully functional, production-level event registration system!

**Features:**
- ✅ Modern UI with dark theme
- ✅ Secure authentication
- ✅ Role-based access
- ✅ Database-driven
- ✅ Fully responsive
- ✅ Production-ready

**Perfect for:**
- 💼 Portfolio projects
- 🎓 Learning full-stack development
- 👔 Interview preparation
- 🚀 Real-world applications

---

### 📚 Read Next:
- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** for detailed testing
- **[FINAL_DELIVERY.md](FINAL_DELIVERY.md)** for complete feature list

---

**Made with ❤️ using modern web technologies**

**Status:** ✅ Production Ready | 🔒 Secure | 🎨 Beautiful | 📱 Responsive
