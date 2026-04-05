# Event Registration System - Neon PostgreSQL Setup

A full-stack Event Registration System built with vanilla JavaScript, Node.js, Express, and **Neon PostgreSQL**.

## Features

### Event Management (CRUD)
- Create new events with name, date, location, and description
- View all events in a grid layout
- Edit/update existing events
- Delete events (with cascade deletion of registrations)

### Registration System
- Users can register for events with name and email
- View all registrations for each event
- Registration count display

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript (no frameworks)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (Neon - Serverless PostgreSQL)
- **Architecture**: REST API

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A Neon PostgreSQL account (free tier available at https://neon.tech)

## Setup Instructions

### Step 1: Get Your Neon Database

1. Go to https://neon.tech and sign up for a free account
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

### Step 2: Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

This will install:
- express - Web framework
- pg - PostgreSQL client
- cors - Enable CORS
- dotenv - Environment variable management

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your Neon connection string:
```
DATABASE_URL=postgresql://username:password@your-neon-host.neon.tech/neondb?sslmode=require
PORT=3000
```

**IMPORTANT**: Never commit the `.env` file to version control!

### Step 4: Initialize Database

The database tables will be created automatically when you first start the server. The schema includes:

**Events Table:**
- id (SERIAL PRIMARY KEY)
- name (TEXT NOT NULL)
- date (DATE NOT NULL)
- location (TEXT NOT NULL)
- description (TEXT)
- created_at (TIMESTAMP)

**Registrations Table:**
- id (SERIAL PRIMARY KEY)
- event_id (INTEGER REFERENCES events)
- name (TEXT NOT NULL)
- email (TEXT NOT NULL)
- registered_at (TIMESTAMP)

### Step 5: Start the Server

From the backend directory, run:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 6: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## API Endpoints

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get single event
- `POST /events` - Create new event
  ```json
  {
    "name": "Tech Conference",
    "date": "2026-06-15",
    "location": "San Francisco, CA",
    "description": "Annual tech conference"
  }
  ```
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Registrations
- `POST /events/:id/register` - Register for an event
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `GET /events/:id/registrations` - Get event registrations

## Project Structure

```
event-registration-system/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── database.js        # PostgreSQL connection and operations
│   ├── schema.sql         # Database schema
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment variables template
│   └── .env               # Your environment variables (DO NOT COMMIT)
├── frontend/
│   ├── index.html         # Home page (event list)
│   ├── event.html         # Event details and registration
│   ├── form.html          # Create/edit event form
│   └── styles.css         # Stylesheet
└── README.md
```

## Key Differences from SQLite Version

### Database Connection
- **SQLite**: File-based, no network connection
- **Neon**: Cloud-based, requires connection string and SSL

### SQL Syntax Changes
- `AUTOINCREMENT` → `SERIAL`
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
- `DATETIME` → `TIMESTAMP`
- Parameter placeholders: `?` → `$1, $2, $3`

### Connection Pooling
The application uses PostgreSQL connection pooling for better performance:
```javascript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
```

## Features Implemented

✅ Full CRUD operations for events
✅ Event registration system
✅ REST API architecture
✅ Clean and responsive UI
✅ No page reloads (JavaScript fetch API)
✅ Form validation
✅ Success/error messages
✅ Modular code structure
✅ Error handling
✅ XSS protection (HTML escaping)
✅ PostgreSQL with Neon
✅ Environment variable configuration
✅ Connection pooling
✅ SSL connections

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | Neon PostgreSQL connection string | postgresql://user:pass@host/db |
| PORT | Server port | 3000 |

## Troubleshooting

**Issue**: Connection refused or timeout
- Solution: Check your DATABASE_URL is correct
- Verify your Neon project is active
- Check firewall/network settings

**Issue**: "relation does not exist" errors
- Solution: Make sure the database initialized properly
- Check server logs for schema creation errors

**Issue**: SSL connection errors
- Solution: Ensure `?sslmode=require` is in your connection string
- Verify SSL settings in database.js

**Issue**: Frontend not loading
- Solution: Make sure you're accessing via `http://localhost:3000` not directly opening HTML files

## Neon PostgreSQL Benefits

1. **Serverless**: Automatically scales, no server management
2. **Free Tier**: Generous free tier for development
3. **Fast**: Built on PostgreSQL 16 with optimizations
4. **Branching**: Create database branches for development
5. **Auto-suspend**: Database suspends when idle to save resources

## Security Best Practices

1. ✅ Never commit `.env` file to version control
2. ✅ Use environment variables for sensitive data
3. ✅ SSL/TLS connections enabled
4. ✅ Parameterized queries (prevents SQL injection)
5. ✅ Input validation on both frontend and backend

## Development Notes

- The database connection pool is created once and reused
- All database operations use async/await for better error handling
- PostgreSQL uses parameterized queries ($1, $2) instead of string interpolation
- Cascade deletion ensures registrations are removed when events are deleted
- Connection pooling improves performance for concurrent requests

## Future Enhancements

- User authentication with JWT
- Event capacity limits
- Email notifications using background jobs
- Event search and filtering
- Event images/thumbnails stored in object storage
- Export registrations to CSV
- Calendar view
- Database migrations with tools like node-pg-migrate

## License

MIT License - feel free to use this project for learning and development purposes.

## Support

For issues with:
- **Neon**: Visit https://neon.tech/docs
- **PostgreSQL**: Visit https://www.postgresql.org/docs/
- **This project**: Check the code comments and error logs
