# Event Registration System

A full-stack Event Registration System built with vanilla JavaScript, Node.js, Express, and SQLite.

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
- **Database**: SQLite (file-based)
- **Architecture**: REST API

## Project Structure

```
event-registration-system/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── database.js        # Database connection and operations
│   ├── schema.sql         # Database schema
│   ├── package.json       # Backend dependencies
│   └── events.db          # SQLite database (created automatically)
├── frontend/
│   ├── index.html         # Home page (event list)
│   ├── event.html         # Event details and registration
│   ├── form.html          # Create/edit event form
│   └── styles.css         # Stylesheet
└── README.md
```

## API Endpoints

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get single event
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Registrations
- `POST /events/:id/register` - Register for an event
- `GET /events/:id/registrations` - Get event registrations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### Step 2: Start the Server

From the backend directory, run:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 3: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

The frontend files are automatically served by the Express server.

## Usage

### Creating an Event
1. Click "Create New Event" button on the home page
2. Fill in the event details (name, date, location, description)
3. Click "Create Event"

### Viewing Events
- All events are displayed on the home page in a grid layout
- Click "View Details" to see full event information

### Editing an Event
1. Click "Edit" button on any event card
2. Modify the event details
3. Click "Update Event"

### Deleting an Event
1. Click "Delete" button on any event card
2. Confirm the deletion
3. All registrations for that event will also be deleted

### Registering for an Event
1. Click "View Details" on any event
2. Fill in your name and email in the registration form
3. Click "Register Now"
4. You'll see your registration appear in the attendees list

## Database Schema

### Events Table
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
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

## Development Notes

- The database file (`events.db`) is created automatically on first run
- CORS is enabled for development
- The frontend is served as static files by the Express server
- All dates are stored in ISO format
- Foreign key constraints ensure data integrity

## Troubleshooting

**Issue**: Cannot connect to server
- Solution: Make sure the server is running on port 3000
- Check if another application is using port 3000

**Issue**: Database errors
- Solution: Delete `events.db` file and restart the server to recreate the database

**Issue**: Frontend not loading
- Solution: Make sure you're accessing via `http://localhost:3000` not directly opening HTML files

## Future Enhancements

- User authentication
- Event capacity limits
- Email notifications
- Event search and filtering
- Event images/thumbnails
- Export registrations to CSV
- Calendar view

            
