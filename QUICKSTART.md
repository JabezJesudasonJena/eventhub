# Quick Start Guide

## Installation

1. Open a terminal/command prompt in the `backend` directory
2. Run: `npm install`

## Running the Application

1. Start the server from the `backend` directory:
   ```
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. You'll see the Event Registration System homepage!

## Testing the Application

### Create an Event
1. Click "Create New Event"
2. Fill in:
   - Event Name: "Tech Conference 2026"
   - Date: Select any future date
   - Location: "San Francisco, CA"
   - Description: "Join us for an amazing tech conference!"
3. Click "Create Event"

### View Event Details
1. Click "View Details" on the event card
2. You'll see full event information

### Register for an Event
1. On the event details page, scroll to the registration form
2. Enter your name and email
3. Click "Register Now"
4. You'll see yourself in the attendees list

### Edit an Event
1. Click "Edit" button on an event card
2. Modify the details
3. Click "Update Event"

### Delete an Event
1. Click "Delete" button on an event card
2. Confirm the deletion

## Project Features

✅ Full CRUD operations for events
✅ User registration system
✅ Clean, responsive UI
✅ No page reloads (JavaScript SPA)
✅ Form validation
✅ Success/error messages
✅ SQLite database (auto-created)

## Troubleshooting

**Port 3000 already in use:**
- Change the PORT value in `backend/server.js` line 6

**Cannot access the site:**
- Make sure the server is running (check terminal for "Server is running")
- Access via http://localhost:3000, not by opening HTML files directly

**Want to reset the database:**
- Stop the server
- Delete `backend/events.db`
- Restart the server

## Development

For auto-reload during development:
```
npm run dev
```

## API Documentation

### Events
- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Registrations
- `POST /events/:id/register` - Register for event
- `GET /events/:id/registrations` - Get event registrations

Enjoy your Event Registration System! 🎉
