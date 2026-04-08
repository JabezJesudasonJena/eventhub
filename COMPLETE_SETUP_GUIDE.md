# Complete Setup & Testing Guide

## 🚀 Quick Start

### Step 1: Backend Setup

```bash
cd backend
npm install
node utils/initDb.js
node server.js
```

The backend will start on **http://localhost:3000**

### Step 2: Frontend Setup

1. Open `frontend/index.html` in your browser, OR
2. Use a simple HTTP server:

```bash
cd frontend
npx http-server -p 8080
```

Then visit **http://localhost:8080**

---

## 🔐 Authentication System

### Demo Accounts (Already Created)

**Admin Account:**
- Email: `admin@eventify.com`
- Password: `Admin123`
- Can create, edit, and delete events
- Can view all registrations

**Regular User Account:**
- Email: `user@eventify.com`
- Password: `User123`
- Can register for events
- Can view events

---

## 🧪 Testing the Application

### Test 1: User Registration Flow

1. Open the frontend in your browser
2. Click **"Register"** in the navbar
3. Fill in the registration form:
   - Name: Your Name
   - Email: test@example.com
   - Password: Test1234
   - Confirm Password: Test1234
4. Click **"Create Account"**
5. You should be redirected to the login page

### Test 2: Login Flow

1. Click **"Login"** in the navbar
2. Use demo admin credentials:
   - Email: `admin@eventify.com`
   - Password: `Admin123`
3. Click **"Login"**
4. You should be redirected to the home page
5. Check navbar - you should see your name and "ADMIN" badge

### Test 3: Create Event (Admin Only)

1. Log in as admin (admin@eventify.com / Admin123)
2. Click **"Create Event"** in navbar or hero section
3. Fill in event details:
   - Name: "Tech Conference 2026"
   - Date: Select a future date
   - Location: "San Francisco, CA"
   - Description: "Annual tech conference for developers"
4. Click **"Create Event"**
5. You should be redirected to home page with success message
6. New event should appear in the events grid

### Test 4: Register for Event (User Only)

1. **Logout** if logged in as admin
2. **Login** as regular user (user@eventify.com / User123)
3. Click on an event card → **"View Details"**
4. You should see a registration form
5. Click **"Register Now"**
6. Success message should appear
7. Reload page - registration form should be hidden (already registered)

### Test 5: View Registrations (Admin Only)

1. **Logout** and **Login** as admin
2. Click on an event → **"View Details"**
3. Scroll down to see **"Registered Attendees"** section
4. You should see all users registered for this event
5. Regular users won't see this section

### Test 6: Edit Event (Admin Only)

1. Log in as admin
2. On home page, click **"Edit"** button on any event card
3. Modify event details
4. Click **"Update Event"**
5. Changes should be reflected on home page

### Test 7: Delete Event (Admin Only)

1. Log in as admin
2. On home page, click **"Delete"** button on an event
3. Confirm deletion
4. Event should be removed from the list

### Test 8: Role-Based Access Control

**As Regular User:**
- ❌ Should NOT see "Create Event" button
- ❌ Should NOT see "Edit" / "Delete" buttons on events
- ✅ Should see "Register Now" option on event details

**As Admin:**
- ✅ Should see "Create Event" button
- ✅ Should see "Edit" / "Delete" buttons on events
- ✅ Should see "Registered Attendees" section
- ❌ Should NOT see registration form (admins don't register)

**Not Logged In:**
- ❌ Should NOT see "Create Event" button
- ❌ Should NOT see admin controls
- ✅ Should see message to log in on event details page

---

## 🎨 UI/UX Features to Notice

### Dark Theme
- Gradient background (dark blue → purple → black)
- Modern card-based design
- Glassmorphism effects

### Animations
- **Fade-in** animations on page load
- **Slide-in-up** animation for cards
- **Hover effects** on cards (scale + shadow)
- **Smooth transitions** on all interactions

### Typography
- **Poppins** font (primary)
- Clean hierarchy (titles, subtitles, body text)
- Consistent spacing throughout

### Responsive Design
- Works on mobile, tablet, and desktop
- Grid layout adapts to screen size
- Navbar collapses on mobile (if needed)

---

## 📋 API Endpoints

### Authentication
```
POST /auth/signup       - Create new account
POST /auth/login        - Login and get JWT token
GET  /auth/me           - Get current user (protected)
```

### Events
```
GET    /events          - List all events (public)
POST   /events          - Create event (admin only)
PUT    /events/:id      - Update event (admin only)
DELETE /events/:id      - Delete event (admin only)
GET    /events/:id      - Get single event (public)
```

### Registrations
```
POST /api/events/:id/register         - Register for event (user only)
PUT  /api/events/:id/cancel           - Cancel registration (user only)
GET  /api/my-registrations            - User's registrations (user only)
GET  /api/events/:id/registrations    - Event registrations (admin only)
```

### Analytics
```
GET /analytics/events           - Event statistics (admin only)
GET /analytics/top-events       - Most popular events (admin only)
GET /analytics/user-activity    - User participation (admin only)
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Delete old database and reinitialize
rm database.sqlite
node utils/initDb.js
node server.js
```

### "Failed to fetch events"
- Make sure backend is running on port 3000
- Check browser console for CORS errors
- Verify API_URL in frontend JavaScript files

### "Only admins can create events"
- Make sure you're logged in as admin
- Check navbar for "ADMIN" badge
- Use demo admin account: admin@eventify.com / Admin123

### Login redirects but navbar doesn't update
- Clear browser localStorage
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console for JavaScript errors

### Fonts not loading
- Check internet connection (Google Fonts requires internet)
- Verify `<link>` tags are in all HTML files
- Check browser DevTools → Network tab for font loading errors

---

## 📂 Project Structure

```
a/
├── backend/
│   ├── controllers/        # Business logic
│   ├── models/            # Database operations
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & error handling
│   ├── utils/             # Helpers & DB init
│   ├── server.js          # Main server file
│   ├── schema.sql         # Database schema
│   └── package.json       # Dependencies
│
└── frontend/
    ├── index.html         # Home page
    ├── login.html         # Login page
    ├── register.html      # Registration page
    ├── form.html          # Create/Edit event
    ├── event.html         # Event details
    └── styles.css         # All styles
```

---

## 🎯 Key Features Implemented

### Frontend
- ✅ Modern dark theme UI with gradients
- ✅ Poppins/Inter fonts from Google Fonts
- ✅ Responsive card-based layout
- ✅ Smooth animations and transitions
- ✅ Login/Register pages with validation
- ✅ Role-based UI (show/hide based on user role)
- ✅ JWT token stored in localStorage
- ✅ User info displayed in navbar
- ✅ Logout functionality

### Backend
- ✅ Normalized database (users, events, registrations)
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ Role-based access control (admin/user)
- ✅ Input validation and sanitization
- ✅ Database transactions for registrations
- ✅ Search, filtering, pagination
- ✅ Analytics endpoints
- ✅ Proper error handling
- ✅ Security best practices

---

## 🎨 Design System

### Colors
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Background:** Dark gradient (dark blue → purple → black)
- **Text:** White (#ffffff) with variations for hierarchy
- **Accent Blue:** #667eea
- **Accent Purple:** #764ba2
- **Success:** #48bb78
- **Error:** #f56565

### Spacing
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 3rem (48px)

---

## 🚀 Production Deployment

1. Update `API_URL` in all frontend JavaScript files to your backend URL
2. Set environment variables in `.env`:
   ```
   JWT_SECRET=your-very-secure-secret-key
   NODE_ENV=production
   PORT=3000
   ```
3. Use a production database (PostgreSQL recommended)
4. Enable HTTPS
5. Add rate limiting
6. Set up monitoring and logging

---

## 📝 Next Steps / Future Enhancements

- [ ] Password reset functionality
- [ ] Email notifications for registrations
- [ ] Event capacity management with waiting list
- [ ] Search and filter on frontend
- [ ] User profile page
- [ ] Event categories/tags
- [ ] File upload for event images
- [ ] Calendar view for events
- [ ] Export registrations as CSV (admin)
- [ ] Two-factor authentication

---

## 💼 Interview Talking Points

This project demonstrates:

1. **Full-stack development:** Frontend + Backend integration
2. **Database design:** Normalized schema, foreign keys, transactions
3. **Security:** JWT auth, bcrypt, input validation, XSS prevention
4. **Architecture:** MVC pattern, modular code structure
5. **UI/UX:** Modern design, animations, responsive layout
6. **Role-based access control:** Different permissions for different users
7. **RESTful API design:** Proper HTTP methods and status codes
8. **Error handling:** User-friendly messages, proper logging
9. **Production readiness:** Environment variables, security best practices

---

## ✅ Success!

Your Event Registration System is now complete with:
- 🎨 Premium dark theme UI
- 🔐 Secure authentication system
- 👥 Role-based access control
- 📊 Database-driven architecture
- 🚀 Production-level code quality

**Recruiter-ready and interview-ready!** 🎉
