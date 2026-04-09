# 🎉 Event Registration System (Eventhub)

A comprehensive, production-ready full-stack Event Registration System with authentication, role-based access control, and advanced features. Built as a complete web application for managing events and user registrations.

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**Eventify** is a modern event management platform that allows administrators to create and manage events while users can browse, register, and manage their event registrations. The system includes comprehensive authentication, role-based access control (RBAC), and real-time analytics.

### Project Purpose
This project demonstrates:
- Full-stack web application development
- RESTful API design and implementation
- Database design with proper relationships and normalization
- Authentication and authorization implementation
- Security best practices (password hashing, JWT, XSS prevention)
- Responsive frontend design with vanilla JavaScript
- Production-ready deployment practices

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **User Signup/Login** with email and password validation
- **JWT-based authentication** for secure API access
- **Role-Based Access Control (RBAC)**: Admin and User roles
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Token-based authentication

### 📅 Event Management (Admin)
- **Create Events**: Add new events with name, date, location, description, and capacity
- **Update Events**: Edit existing event details
- **Delete Events**: Remove events with automatic cleanup of registrations
- **View All Events**: Browse events with search and filtering
- **Capacity Management**: Set and track event capacity limits

### 👥 User Registration System
- **Browse Events**: View all available events
- **Event Details**: See full event information and available slots
- **Register for Events**: Sign up for events with capacity validation
- **Cancel Registration**: Withdraw from events
- **My Registrations**: View personal registration history
- **Registration Status**: Track active and cancelled registrations

### 📊 Analytics Dashboard (Admin Only)
- **Platform Statistics**: Total events, users, and registrations
- **Top Events**: Events with highest registration rates
- **Registration Trends**: Time-based analysis
- **Capacity Analysis**: Event fill rate tracking
- **User Participation**: Engagement metrics

### 🔍 Advanced Features
- **Search & Filtering**: Find events by name, location, or date
- **Pagination**: Efficient data loading with customizable page size
- **Upcoming/Past Events**: Filter by event timeline
- **Real-time Availability**: Live tracking of available slots
- **Data Validation**: Comprehensive input validation on frontend and backend
- **Error Handling**: User-friendly error messages
- **XSS Protection**: Input sanitization to prevent security vulnerabilities

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v14 or higher)
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL 8.20.0 (with proper indexing and views)
- **Authentication**: 
  - bcrypt 5.1.1 (password hashing)
  - jsonwebtoken 9.0.3 (JWT tokens)
- **Security**: 
  - express-validator 7.3.2 (input validation)
  - xss 1.0.15 (XSS prevention)
  - CORS 2.8.5 (cross-origin resource sharing)
- **Environment**: dotenv 16.6.1

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern responsive styling
- **Vanilla JavaScript**: No frameworks/libraries (ES6+)
- **Fetch API**: For AJAX requests
- **LocalStorage**: For JWT token storage

### Database
- **PostgreSQL**: Production-grade relational database
- **Features**:
  - Foreign key constraints
  - Cascade deletion
  - Database indexes for performance
  - Materialized views for analytics
  - Transaction support

### Architecture
- **REST API**: Stateless API design
- **MVC Pattern**: Separation of concerns
- **Modular Structure**: Organized codebase
- **JWT Authentication**: Secure token-based auth

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │ ◄─────► │   Backend    │ ◄─────► │  PostgreSQL  │
│  (HTML/JS)  │  HTTP   │  (Express)   │  SQL    │   Database   │
└─────────────┘         └──────────────┘         └──────────────┘
     │                         │
     │                         │
     └────── JWT Token ────────┘
           Authentication
```

### Request Flow
1. **User Action**: User interacts with frontend (login, create event, register)
2. **API Request**: Frontend sends HTTP request with JWT token (if authenticated)
3. **Authentication**: Backend validates JWT token
4. **Authorization**: Backend checks user role (admin/user)
5. **Business Logic**: Controllers process request
6. **Database Query**: Models interact with PostgreSQL
7. **Response**: JSON response sent back to frontend
8. **UI Update**: Frontend updates DOM dynamically

### Database Architecture
```
┌──────────┐        ┌─────────────┐        ┌────────────┐
│  users   │        │   events    │        │registrations│
├──────────┤        ├─────────────┤        ├────────────┤
│ id (PK)  │───┐    │ id (PK)     │    ┌──│ id (PK)    │
│ name     │   │    │ name        │    │  │ user_id    │
│ email    │   │    │ date        │    │  │ event_id   │
│ password │   │    │ location    │    │  │ status     │
│ role     │   │    │ description │    │  │registered_at│
└──────────┘   │    │ capacity    │    │  └────────────┘
               └───►│ created_by  │◄───┘
                    └─────────────┘
```

---

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (for cloning the repository)
- **Code Editor** (VS Code recommended)
- **Web Browser** (Chrome, Firefox, Edge, Safari)

### Verify Installation
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
psql --version    # Should show PostgreSQL 12 or higher
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd event-registration-system
```

### Step 2: Database Setup

#### Option A: Using PostgreSQL (Recommended for Production)

1. **Install PostgreSQL** (if not already installed)

2. **Create Database**:
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE event_registration;

# Exit
\q
```

3. **Configure Environment**:
```bash
cd backend
cp .env.example .env
```

4. **Edit `.env` file** with your database credentials:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/event_registration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

5. **Initialize Database**:
```bash
npm run init-db
```
This will:
- Create all necessary tables (users, events, registrations)
- Add indexes for performance
- Create database views for analytics
- Insert default admin and user accounts

### Step 3: Install Dependencies
```bash
cd backend
npm install
```

### Step 4: Start the Backend Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

Server will start on `http://localhost:3000`

### Step 5: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

### Default Login Credentials

**Admin Account**:
- Email: `admin@eventify.com`
- Password: `Admin@123`
- Can: Create/edit/delete events, view analytics

**User Account**:
- Email: `user@eventify.com`
- Password: `User@123`
- Can: View events, register for events, manage own registrations

---

## 📖 Usage Guide

### For Users

#### 1. **Sign Up / Login**
- Click "Login" or "Sign Up" button
- Enter your email and password
- Password must be at least 8 characters with uppercase, lowercase, and number

#### 2. **Browse Events**
- View all available events on the home page
- Use search to find specific events by name or location
- Filter upcoming or past events

#### 3. **Register for an Event**
- Click on any event card to view details
- Check available slots
- Click "Register Now" button
- You'll see confirmation message

#### 4. **View Your Registrations**
- Click "My Registrations" in navigation
- See all your active registrations
- View event details and dates

#### 5. **Cancel Registration**
- Go to "My Registrations"
- Click "Cancel" on any registration
- Confirm cancellation

### For Administrators

#### 1. **Login as Admin**
- Use admin credentials
- Access admin dashboard

#### 2. **Create New Event**
- Click "Create Event" button
- Fill in event details:
  - Event Name
  - Date (must be future date)
  - Location
  - Description
  - Capacity (maximum attendees)
- Click "Create Event"

#### 3. **Edit Event**
- Click "Edit" button on any event card
- Modify event details
- Click "Update Event"

#### 4. **Delete Event**
- Click "Delete" button on event card
- Confirm deletion
- Note: All registrations for this event will be removed

#### 5. **View Analytics**
- Click "Analytics" in navigation
- View platform statistics:
  - Total events, users, registrations
  - Top performing events
  - Registration trends
  - Capacity utilization

#### 6. **Manage Registrations**
- View all registrations for any event
- See user details and registration status
- Monitor event capacity

---

## 📡 API Documentation

Comprehensive API documentation is available in [`backend/API_DOCUMENTATION.md`](./backend/API_DOCUMENTATION.md)

### Quick Reference

#### Authentication Endpoints
```
POST   /auth/signup      - Create new user account
POST   /auth/login       - Login and get JWT token
GET    /auth/me          - Get current user info
```

#### Event Endpoints
```
GET    /events           - Get all events (with filters)
GET    /events/:id       - Get single event
POST   /events           - Create event (Admin only)
PUT    /events/:id       - Update event (Admin only)
DELETE /events/:id       - Delete event (Admin only)
```

#### Registration Endpoints
```
POST   /api/events/:id/register    - Register for event
PUT    /api/events/:id/cancel      - Cancel registration
GET    /api/my-registrations       - Get user's registrations
GET    /api/events/:id/registrations - Get event registrations (Admin)
```

#### Analytics Endpoints (Admin Only)
```
GET    /analytics/stats             - Overall statistics
GET    /analytics/top-events        - Top events by registrations
GET    /analytics/trends            - Registration trends
GET    /analytics/participation     - User engagement metrics
GET    /analytics/capacity          - Capacity analysis
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🗄️ Database Schema

### Tables

#### 1. **users**
Stores user account information.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- bcrypt hashed
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**:
- `idx_users_email` - Fast login lookups
- `idx_users_role` - Role-based filtering

#### 2. **events**
Stores event information.
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL DEFAULT 100 CHECK (capacity > 0),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**:
- `idx_events_date` - Date filtering and sorting
- `idx_events_created_by` - Creator lookups
- `idx_events_name` - Search functionality
- `idx_events_location` - Location search

#### 3. **registrations**
Stores user event registrations.
```sql
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled')),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    CONSTRAINT unique_user_event UNIQUE (user_id, event_id)
);
```

**Indexes**:
- `idx_registrations_user_id` - User registration lookup
- `idx_registrations_event_id` - Event attendee list
- `idx_registrations_status` - Status filtering

### Database Views

#### event_stats
Pre-calculated event statistics for analytics.
```sql
CREATE VIEW event_stats AS
SELECT 
    e.id, e.name, e.date, e.location, e.capacity,
    COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count,
    e.capacity - COUNT(r.id) FILTER (WHERE r.status = 'registered') as available_slots,
    ROUND((COUNT(r.id) FILTER (WHERE r.status = 'registered')::DECIMAL / e.capacity) * 100, 2) as capacity_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id;
```

#### user_participation
User engagement metrics.
```sql
CREATE VIEW user_participation AS
SELECT 
    u.id, u.name, u.email,
    COUNT(r.id) FILTER (WHERE r.status = 'registered') as active_registrations,
    COUNT(r.id) FILTER (WHERE r.status = 'cancelled') as cancelled_registrations,
    COUNT(r.id) as total_registrations
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
GROUP BY u.id;
```

### Relationships
- One user can create many events (1:N - users → events)
- One user can register for many events (M:N through registrations)
- One event can have many registrations (1:N - events → registrations)
- **Cascade Deletion**: Deleting a user or event automatically removes related registrations

---

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure, stateless authentication
- **Token Expiration**: Automatic expiry after 24 hours
- **Password Hashing**: bcrypt with 10 salt rounds
- **Password Validation**: Minimum 8 characters, uppercase, lowercase, number required

### Authorization
- **Role-Based Access Control (RBAC)**: Admin and User roles
- **Endpoint Protection**: Middleware validates user permissions
- **Resource Ownership**: Users can only modify their own data

### Data Protection
- **XSS Prevention**: Input sanitization on all user inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data in .env file
- **Password Requirements**: Strong password enforcement

### Best Practices Implemented
✅ Never store passwords in plain text  
✅ JWT tokens stored in httpOnly cookies (if implemented) or localStorage  
✅ Validate all inputs on both frontend and backend  
✅ Use HTTPS in production (recommended)  
✅ Rate limiting (can be added for production)  
✅ Input length limits to prevent DoS  
✅ Error messages don't reveal sensitive information  

---

## 📁 Project Structure

```
event-registration-system/
├── backend/
│   ├── controllers/              # Business logic layer
│   │   ├── authController.js    # Authentication logic
│   │   ├── eventController.js   # Event CRUD operations
│   │   ├── registrationController.js # Registration logic
│   │   └── analyticsController.js    # Analytics & reports
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT verification
│   │   ├── authorize.js         # Role-based authorization
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validators.js        # Input validation
│   ├── models/                   # Database models
│   │   ├── User.js              # User model
│   │   ├── Event.js             # Event model
│   │   └── Registration.js      # Registration model
│   ├── routes/                   # API routes
│   │   ├── auth.js              # /auth endpoints
│   │   ├── events.js            # /events endpoints
│   │   ├── registrations.js     # /api endpoints
│   │   └── analytics.js         # /analytics endpoints
│   ├── utils/                    # Utility functions
│   │   ├── auth.js              # JWT helpers
│   │   ├── db.js                # Database connection
│   │   ├── validators.js        # Custom validators
│   │   └── initDb.js            # Database initialization
│   ├── .env.example             # Environment template
│   ├── .env                     # Environment variables (gitignored)
│   ├── database.js              # Database connection
│   ├── schema.sql               # Database schema
│   ├── server.js                # Main application entry
│   └── package.json             # Dependencies
├── frontend/
│   ├── index.html               # Home page (event listing)
│   ├── event.html               # Event details page
│   ├── form.html                # Create/edit event form
│   ├── login.html               # Login page
│   ├── register.html            # Signup page
│   ├── styles.css               # Global styles
│   ├── DESIGN_GUIDE.md          # UI/UX documentation
│   └── UI_REFACTOR_SUMMARY.md   # Frontend changes log
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
├── HOW_TO_RUN.md               # Quick start guide
├── SETUP_INSTRUCTIONS.md        # Detailed setup
├── COMPLETE_SETUP_GUIDE.md     # Comprehensive guide
└── API_DOCUMENTATION.md         # API reference (in backend/)
```

### Key Components

**Backend**:
- `server.js` - Express app initialization, middleware setup
- `controllers/` - Business logic separated from routes
- `models/` - Database queries and data access
- `middleware/` - Authentication, authorization, validation
- `routes/` - API endpoint definitions
- `utils/` - Helper functions and database setup

**Frontend**:
- Static HTML pages with embedded JavaScript
- No build process required
- Fetch API for AJAX requests
- LocalStorage for JWT token persistence
- Responsive CSS design

---

## 🧪 Testing the Application

### Manual Testing

#### 1. Test User Registration
```bash
# Signup a new user
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

#### 2. Test Login
```bash
# Login and get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eventify.com",
    "password": "Admin@123"
  }'

# Save the token from response
```

#### 3. Test Event Creation (Admin)
```bash
# Create event (replace <TOKEN> with admin token)
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Tech Conference 2026",
    "date": "2026-12-31",
    "location": "San Francisco, CA",
    "description": "Annual technology conference",
    "capacity": 200
  }'
```

#### 4. Test Event Registration (User)
```bash
# Register for event (replace <TOKEN> with user token)
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Authorization: Bearer <TOKEN>"
```

#### 5. Test Analytics (Admin)
```bash
# Get platform statistics
curl http://localhost:3000/analytics/stats \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Browser Testing
1. Open `http://localhost:3000`
2. Test user flows:
   - Sign up → Login → Browse Events → Register → View Registrations
3. Test admin flows:
   - Login as admin → Create Event → Edit Event → View Analytics → Delete Event
4. Test error cases:
   - Invalid credentials
   - Duplicate registration
   - Full capacity events
   - Past event registration

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Cannot connect to server
**Error**: `Failed to fetch` or connection refused

**Solutions**:
- Verify server is running: `npm start` or `npm run dev`
- Check if port 3000 is available: `netstat -an | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)
- Try different port: Change `PORT` in `.env` file
- Check firewall settings

#### Issue 2: Database connection failed
**Error**: `Unable to connect to database` or `ECONNREFUSED`

**Solutions**:
- Verify PostgreSQL is running:
  ```bash
  # Windows
  net start postgresql
  
  # Mac
  brew services start postgresql
  
  # Linux
  sudo systemctl start postgresql
  ```
- Check DATABASE_URL in `.env` matches your PostgreSQL credentials
- Verify database exists: `psql -U postgres -l`
- Try recreating database:
  ```bash
  dropdb event_registration
  createdb event_registration
  npm run init-db
  ```

#### Issue 3: JWT token invalid or expired
**Error**: `401 Unauthorized` or `Token invalid`

**Solutions**:
- Login again to get new token
- Check if JWT_SECRET in `.env` hasn't changed
- Clear browser LocalStorage and re-login
- Token expires after 24h by default

#### Issue 4: Frontend not loading
**Error**: Blank page or 404 errors

**Solutions**:
- Access via `http://localhost:3000` not file:// protocol
- Check if server is serving static files correctly
- Verify frontend files are in correct directory
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

#### Issue 5: Registration fails - "Event is full"
**Error**: `400 Bad Request - Event has reached maximum capacity`

**Solution**:
- This is expected behavior when capacity is reached
- Admin can edit event to increase capacity
- Some users need to cancel registration first

#### Issue 6: Can't create events as user
**Error**: `403 Forbidden - Admin access required`

**Solution**:
- This is correct - only admins can create/edit/delete events
- Login with admin credentials
- Or assign admin role to user in database

#### Issue 7: Dependencies installation fails
**Error**: `npm install` errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node version (v14-v18 recommended)
nvm use 16
npm install
```

#### Issue 8: Port already in use
**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

#### Issue 9: CORS errors
**Error**: `Access-Control-Allow-Origin header`

**Solutions**:
- Server already has CORS enabled
- If using different frontend port, update CORS config in `server.js`
- Check browser console for specific CORS error

#### Issue 10: Password validation fails
**Error**: Password doesn't meet requirements

**Solution**:
- Password must be at least 8 characters
- Must contain: 1 uppercase, 1 lowercase, 1 number
- Example valid password: `Password123`

---

## 🚀 Deployment

### Environment Variables for Production

```env
# Server
PORT=3000
NODE_ENV=production

# Database (use production database URL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT (use strong secret key)
JWT_SECRET=your-super-long-and-random-secret-key
JWT_EXPIRES_IN=24h

# CORS (set to your frontend domain)
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Platforms

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Initialize database
heroku run npm run init-db
```

#### Option 2: Railway
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically on push

#### Option 3: Render
1. Create Web Service from repository
2. Add PostgreSQL database
3. Set environment variables
4. Auto-deploy on git push

#### Option 4: DigitalOcean App Platform
1. Import repository
2. Add managed PostgreSQL database
3. Configure environment
4. Deploy

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Use production database (not SQLite)
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Use environment variables for all secrets
- [ ] Test all features in staging first

---

## 📚 Additional Documentation

- **[Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)** - Comprehensive installation instructions
- **[How to Run](./HOW_TO_RUN.md)** - Quick start guide
- **[API Documentation](./backend/API_DOCUMENTATION.md)** - Complete API reference
- **[Design Guide](./frontend/DESIGN_GUIDE.md)** - Frontend design patterns
- **[Deployment Guide](./RENDER_DEPLOYMENT.md)** - Production deployment instructions

---

## 🔄 Future Enhancements

### Planned Features
- [ ] **Email Notifications**: Send confirmation emails for registrations
- [ ] **Event Categories**: Organize events by category/tags
- [ ] **Event Images**: Upload and display event thumbnails
- [ ] **Calendar View**: Display events in calendar format
- [ ] **Export Data**: Download registrations as CSV/Excel
- [ ] **QR Codes**: Generate QR codes for event check-in
- [ ] **Payment Integration**: Paid events with Stripe/PayPal
- [ ] **Waiting List**: Queue system for full events
- [ ] **Social Sharing**: Share events on social media
- [ ] **Mobile App**: React Native mobile application
- [ ] **Real-time Updates**: WebSocket for live updates
- [ ] **Advanced Search**: Filters by date range, location, capacity
- [ ] **User Profiles**: Profile pictures and bio
- [ ] **Event Reviews**: Rating and feedback system
- [ ] **Multi-language**: Internationalization support
- [ ] **Dark Mode**: Theme switcher
- [ ] **2FA Authentication**: Two-factor authentication
- [ ] **OAuth**: Google/Facebook login

### Performance Improvements
- [ ] Database query optimization
- [ ] Implement caching (Redis)
- [ ] Add pagination to all lists
- [ ] Lazy loading of images
- [ ] Service worker for offline support
- [ ] Database connection pooling

### Security Enhancements
- [ ] Rate limiting on all endpoints
- [ ] CAPTCHA on signup/login
- [ ] Content Security Policy headers
- [ ] Audit logging
- [ ] IP whitelisting for admin
- [ ] Session management improvements

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Code Standards
- Use ES6+ JavaScript syntax
- Follow existing code style
- Add comments for complex logic
- Test all changes before submitting
- Update documentation if needed

---

## 📄 License

This project is made as for Mini project for our Academics 
Team members 
1. Jabez 
1 Janani N M
2 Janani S.

---

## 👨‍💻 Project Information

### Developed For
College Project Submission

### Technologies Demonstrated
- Full-stack web development
- RESTful API design
- Database design and normalization
- Authentication and authorization
- Security best practices
- Responsive web design
- Modern JavaScript (ES6+)

### Learning Outcomes
✅ Understanding of MVC architecture  
✅ JWT-based authentication implementation  
✅ Role-based access control (RBAC)  
✅ Database design with relationships  
✅ RESTful API development  
✅ Frontend-backend integration  
✅ Security considerations in web apps  
✅ Production deployment practices  

---

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the GitHub repository
- Contact: [boycalledjabez@gmail.com]
- Documentation: Check additional .md files in project root

---

##  Acknowledgments

- Express.js documentation
- PostgreSQL documentation
- JWT.io for token debugging
- bcrypt.js for secure password hashing
- MDN Web Docs for JavaScript reference

---

## 📊 Project Stats

- **Total Files**: 30+
- **Lines of Code**: ~3000+
- **API Endpoints**: 15+
- **Database Tables**: 3 (+ 2 views)
- **Features**: 20+
- **Security Layers**: Multiple (JWT, bcrypt, XSS, RBAC)

---

**Built with ❤️ for Academic Excellence**

*Last Updated: April 2026*
