const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initializeDatabase, eventOperations, registrationOperations } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow all origins for now
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files

// Log all requests with timestamp
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Event Registration API'
    });
});

// Initialize database before starting server
initializeDatabase().then(() => {
    console.log('Database initialized');
    
    // ===== EVENT ROUTES =====

    // GET /events - Get all events
    app.get('/events', async (req, res) => {
        try {
            const events = await eventOperations.getAllEvents();
            res.json(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    });

    // GET /events/:id - Get single event
    app.get('/events/:id', async (req, res) => {
        try {
            const event = await eventOperations.getEventById(req.params.id);
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

            const event = await eventOperations.createEvent({ name, date, location, description });
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

            const event = await eventOperations.updateEvent(req.params.id, { name, date, location, description });
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
            const result = await eventOperations.deleteEvent(req.params.id);
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
            const event = await eventOperations.getEventById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const registration = await registrationOperations.registerForEvent(req.params.id, { name, email });
            res.status(201).json(registration);
        } catch (error) {
            console.error('Error registering for event:', error);
            res.status(500).json({ error: 'Failed to register for event' });
        }
    });

    // GET /events/:id/registrations - Get registrations for an event
    app.get('/events/:id/registrations', async (req, res) => {
        try {
            const registrations = await registrationOperations.getEventRegistrations(req.params.id);
            res.json(registrations);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            res.status(500).json({ error: 'Failed to fetch registrations' });
        }
    });

    // ===== SERVER START =====

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`API available at /events`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
