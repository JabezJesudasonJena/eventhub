# 🚀 Event Registration System - Backend v2.0

## Production-Ready Backend with Authentication, RBAC & Advanced Features

### 📋 Table of Contents
1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [API Documentation](#api-documentation)
4. [Authentication & Security](#authentication--security)
5. [Setup & Installation](#setup--installation)
6. [Testing](#testing)

---

## Overview

A production-level event registration system built with:
- **Node.js & Express** - Robust backend framework
- **PostgreSQL** - Relational database with advanced features
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing
- **RBAC** - Role-based access control (Admin/User)

### Key Features
✅ Normalized database design with proper relationships  
✅ JWT authentication with role-based access control  
✅ Secure password hashing with bcrypt  
✅ Database transactions for data consistency  
✅ Event capacity management  
✅ Search, filtering & pagination  
✅ Analytics dashboard  
✅ Input validation & XSS prevention  
✅ Modular MVC architecture  

---

## Database Architecture

### Entity-Relationship Diagram

```
users (1) ──────< (N) events
  │
  │
  └──────< (N) registrations >────── (1) events
```

### Tables

#### 1. **users**
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(255) NOT NULL
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL (bcrypt hashed)
role            VARCHAR(20) CHECK (role IN ('admin', 'user'))
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Indexes:**
- `idx_users_email` - Fast login lookups
- `idx_users_role` - Role-based queries

#### 2. **events**
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(255) NOT NULL
date            DATE NOT NULL
location        VARCHAR(255) NOT NULL
description     TEXT
capacity        INTEGER NOT NULL DEFAULT 100 CHECK (capacity > 0)
created_by      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Indexes:**
- `idx_events_date` - Date filtering
- `idx_events_created_by` - Creator lookups
- `idx_events_name` - Search queries
- `idx_events_location` - Search queries

#### 3. **registrations**
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
event_id        INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE
status          VARCHAR(20) CHECK (status IN ('registered', 'cancelled'))
registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
cancelled_at    TIMESTAMP

CONSTRAINT unique_user_event UNIQUE (user_id, event_id)
```

**Indexes:**
- `idx_registrations_user_id` - User's registrations
- `idx_registrations_event_id` - Event registrations
- `idx_registrations_status` - Status filtering

### Database Views

**event_stats** - Pre-calculated event statistics
```sql
id, name, date, location, capacity, 
registration_count, available_slots, capacity_percentage
```

**user_participation** - User engagement metrics
```sql
id, name, email, 
active_registrations, cancelled_registrations, total_registrations
```

---

## API Documentation

### Authentication

#### 1. **POST /auth/signup**
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"  // optional, defaults to "user"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. **POST /auth/login**
Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 3. **GET /auth/me**
Get current user info (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2026-04-07T12:00:00.000Z"
}
```

---

### Events

#### 1. **GET /events**
Get all events with optional filters and pagination.

**Query Parameters:**
- `search` - Search by name or location
- `upcoming=true` - Show only upcoming events
- `past=true` - Show only past events
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 100)

**Example:**
```
GET /events?search=conference&upcoming=true&page=1&limit=10
```

**Response (200):**
```json
{
  "events": [
    {
      "id": 1,
      "name": "Tech Conference 2026",
      "date": "2026-05-15",
      "location": "San Francisco, CA",
      "description": "Annual technology conference",
      "capacity": 200,
      "created_by": 1,
      "creator_name": "Admin User",
      "registration_count": 45,
      "available_slots": 155,
      "created_at": "2026-04-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

#### 2. **GET /events/:id**
Get single event details.

**Response (200):**
```json
{
  "id": 1,
  "name": "Tech Conference 2026",
  "date": "2026-05-15",
  "location": "San Francisco, CA",
  "description": "Annual technology conference",
  "capacity": 200,
  "created_by": 1,
  "creator_name": "Admin User",
  "registration_count": 45,
  "available_slots": 155,
  "created_at": "2026-04-01T10:00:00.000Z"
}
```

#### 3. **POST /events** (Admin Only)
Create a new event.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Event",
  "date": "2026-06-15",
  "location": "New York, NY",
  "description": "Event description",
  "capacity": 150
}
```

**Response (201):**
```json
{
  "message": "Event created successfully",
  "event": { ... }
}
```

#### 4. **PUT /events/:id** (Admin Only)
Update an event.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Updated Event Name",
  "date": "2026-06-20",
  "location": "Boston, MA",
  "description": "Updated description",
  "capacity": 200
}
```

#### 5. **DELETE /events/:id** (Admin Only)
Delete an event (cascades to registrations).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "Event deleted successfully",
  "id": 1
}
```

---

### Registrations

#### 1. **POST /api/events/:id/register** (User Only)
Register for an event.

**Headers:**
```
Authorization: Bearer <user-token>
```

**Response (201):**
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "id": 1,
    "user_id": 2,
    "event_id": 1,
    "status": "registered",
    "registered_at": "2026-04-07T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Event is full
- `400` - Cannot register for past events
- `409` - Already registered

#### 2. **PUT /api/events/:id/cancel** (User Only)
Cancel a registration.

**Headers:**
```
Authorization: Bearer <user-token>
```

**Response (200):**
```json
{
  "message": "Registration cancelled successfully",
  "registration": { ... }
}
```

#### 3. **GET /api/my-registrations** (User Only)
Get user's own registrations.

**Headers:**
```
Authorization: Bearer <user-token>
```

**Response (200):**
```json
{
  "registrations": [
    {
      "id": 1,
      "user_id": 2,
      "event_id": 1,
      "status": "registered",
      "event_name": "Tech Conference 2026",
      "date": "2026-05-15",
      "location": "San Francisco, CA",
      "registered_at": "2026-04-07T12:00:00.000Z"
    }
  ]
}
```

#### 4. **GET /api/events/:id/registrations** (Admin Only)
Get all registrations for an event.

**Headers:**
```
Authorization: Bearer <admin-token>
```

---

### Analytics (Admin Only)

All analytics endpoints require admin authentication.

#### 1. **GET /analytics/stats**
Overall platform statistics.

**Response (200):**
```json
{
  "total_events": 10,
  "total_users": 50,
  "total_registrations": 120,
  "upcoming_events": 6,
  "past_events": 4
}
```

#### 2. **GET /analytics/top-events**
Top events by registration count.

**Query Parameters:**
- `limit` - Number of results (default: 10, max: 50)

**Response (200):**
```json
{
  "topEvents": [
    {
      "id": 1,
      "name": "Tech Conference 2026",
      "date": "2026-05-15",
      "location": "San Francisco, CA",
      "capacity": 200,
      "registration_count": 180,
      "fill_percentage": 90.00
    }
  ]
}
```

#### 3. **GET /analytics/trends**
Registration trends (last 30 days).

#### 4. **GET /analytics/participation**
User participation statistics.

#### 5. **GET /analytics/capacity**
Event capacity analysis.

---

## Authentication & Security

### JWT Token Structure
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1617285600,
  "exp": 1617372000
}
```

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Security Features
✅ bcrypt password hashing (10 rounds)  
✅ JWT token expiration (24h default)  
✅ XSS input sanitization  
✅ Role-based access control  
✅ SQL injection prevention (parameterized queries)  
✅ CORS configuration  
✅ Error message sanitization  

### Authorization Header
```
Authorization: Bearer <your-jwt-token>
```

---

## Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

### Default Accounts
```
Admin:
  Email: admin@eventify.com
  Password: Admin@123

User:
  Email: user@eventify.com
  Password: User@123
```

---

## Testing

### Test Authentication
```bash
# Signup
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eventify.com","password":"Admin@123"}'
```

### Test Events (Admin)
```bash
# Create Event
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"name":"Test Event","date":"2026-12-31","location":"Test City","capacity":100}'
```

### Test Registration (User)
```bash
# Register for Event
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Authorization: Bearer <user-token>"
```

---

## Architecture

```
backend/
├── controllers/       # Business logic
├── middleware/        # Auth, validation, error handling
├── models/           # Database models
├── routes/           # API endpoints
├── utils/            # Helpers (auth, db, validators)
├── server.js         # Main application
├── schema.sql        # Database schema
└── package.json      # Dependencies
```

---

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token / invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## License

ISC

---

**Built with ❤️ for production deployment**
