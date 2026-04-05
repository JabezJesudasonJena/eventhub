const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create PostgreSQL connection pool
// Pool manages multiple connections efficiently
const pool = new Pool({
    connectionString: process.env.DATABASE_URL  ,
    ssl: {
        rejectUnauthorized: false // Required for Neon and most cloud PostgreSQL providers
    }
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database (Neon)');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Initialize database with schema
async function initializeDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('Database tables created successfully');
    } catch (err) {
        console.error('Error initializing database:', err.message);
        throw err;
    }
}

// Event operations
const eventOperations = {
    // Get all events
    getAllEvents: async () => {
        try {
            const result = await pool.query(
                'SELECT * FROM events ORDER BY date DESC'
            );
            return result.rows;
        } catch (err) {
            console.error('Error getting all events:', err);
            throw err;
        }
    },

    // Get single event by ID
    getEventById: async (id) => {
        try {
            const result = await pool.query(
                'SELECT * FROM events WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('Error getting event by ID:', err);
            throw err;
        }
    },

    // Create new event
    createEvent: async (event) => {
        try {
            const { name, date, location, description } = event;
            const result = await pool.query(
                'INSERT INTO events (name, date, location, description) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, date, location, description]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error creating event:', err);
            throw err;
        }
    },

    // Update event
    updateEvent: async (id, event) => {
        try {
            const { name, date, location, description } = event;
            const result = await pool.query(
                'UPDATE events SET name = $1, date = $2, location = $3, description = $4 WHERE id = $5 RETURNING *',
                [name, date, location, description, id]
            );
            
            if (result.rows.length === 0) {
                throw new Error('Event not found');
            }
            
            return result.rows[0];
        } catch (err) {
            console.error('Error updating event:', err);
            throw err;
        }
    },

    // Delete event
    deleteEvent: async (id) => {
        try {
            const result = await pool.query(
                'DELETE FROM events WHERE id = $1 RETURNING id',
                [id]
            );
            
            if (result.rows.length === 0) {
                throw new Error('Event not found');
            }
            
            return { deleted: true, id: result.rows[0].id };
        } catch (err) {
            console.error('Error deleting event:', err);
            throw err;
        }
    }
};

// Registration operations
const registrationOperations = {
    // Register for an event
    registerForEvent: async (eventId, registration) => {
        try {
            const { name, email } = registration;
            const result = await pool.query(
                'INSERT INTO registrations (event_id, name, email) VALUES ($1, $2, $3) RETURNING *',
                [eventId, name, email]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error registering for event:', err);
            throw err;
        }
    },

    // Get registrations for an event
    getEventRegistrations: async (eventId) => {
        try {
            const result = await pool.query(
                'SELECT * FROM registrations WHERE event_id = $1 ORDER BY registered_at DESC',
                [eventId]
            );
            return result.rows;
        } catch (err) {
            console.error('Error getting event registrations:', err);
            throw err;
        }
    },

    // Get registration count for an event
    getRegistrationCount: async (eventId) => {
        try {
            const result = await pool.query(
                'SELECT COUNT(*) as count FROM registrations WHERE event_id = $1',
                [eventId]
            );
            return parseInt(result.rows[0].count);
        } catch (err) {
            console.error('Error getting registration count:', err);
            throw err;
        }
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    pool.end(() => {
        console.log('Database pool closed');
    });
});

module.exports = {
    pool,
    initializeDatabase,
    eventOperations,
    registrationOperations
};
