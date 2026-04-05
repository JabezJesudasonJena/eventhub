const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, eventOperations, registrationOperations } = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Initialize database before starting server
initializeDatabase().then(() => {
    console.log('Database initialized');
    
    // ===== EVENT ROUTES =====

    // GET /events - Get all events
    app.get('/events', async (req, res) => {
        try {
            const events = eventOperations.getAllEvents();
            res.json(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    });

    // GET /events/:id - Get single event
    app.get('/events/:id', async (req, res) => {
        try {
            const event = eventOperations.getEventById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json(event);
        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({ error: 'Failed to fetch event' });
        }
    });

    // POST /events - Create new event
    app.post('/events', async (req, res) => {
        try {
            const { name, date, location, description } = req.body;

            // Validation
            if (!name || !date || !location) {
                return res.status(400).json({ error: 'Name, date, and location are required' });
            }

            const event = eventOperations.createEvent({ name, date, location, description });
            res.status(201).json(event);
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ error: 'Failed to create event' });
        }
    });

    // PUT /events/:id - Update event
    app.put('/events/:id', async (req, res) => {
        try {
            const { name, date, location, description } = req.body;

            // Validation
            if (!name || !date || !location) {
                return res.status(400).json({ error: 'Name, date, and location are required' });
            }

            const event = eventOperations.updateEvent(req.params.id, { name, date, location, description });
            res.json(event);
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.message === 'Event not found') {
                res.status(404).json({ error: 'Event not found' });
            } else {
                res.status(500).json({ error: 'Failed to update event' });
            }
        }
    });

    // DELETE /events/:id - Delete event
    app.delete('/events/:id', async (req, res) => {
        try {
            const result = eventOperations.deleteEvent(req.params.id);
            res.json(result);
        } catch (error) {
            console.error('Error deleting event:', error);
            if (error.message === 'Event not found') {
                res.status(404).json({ error: 'Event not found' });
            } else {
                res.status(500).json({ error: 'Failed to delete event' });
            }
        }
    });

    // ===== REGISTRATION ROUTES =====

    // POST /events/:id/register - Register for an event
    app.post('/events/:id/register', async (req, res) => {
        try {
            const { name, email } = req.body;

            // Validation
            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }

            // Check if event exists
            const event = eventOperations.getEventById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const registration = registrationOperations.registerForEvent(req.params.id, { name, email });
            res.status(201).json(registration);
        } catch (error) {
            console.error('Error registering for event:', error);
            res.status(500).json({ error: 'Failed to register for event' });
        }
    });

    // GET /events/:id/registrations - Get registrations for an event
    app.get('/events/:id/registrations', async (req, res) => {
        try {
            const registrations = registrationOperations.getEventRegistrations(req.params.id);
            res.json(registrations);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            res.status(500).json({ error: 'Failed to fetch registrations' });
        }
    });

    // ===== SERVER START =====

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`API available at http://localhost:${PORT}/events`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
