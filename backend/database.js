const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'events.db');

let db;

// Initialize database
async function initializeDatabase() {
    try {
        const SQL = await initSqlJs();
        
        // Load existing database or create new one
        if (fs.existsSync(DB_PATH)) {
            const buffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(buffer);
            console.log('Loaded existing database');
        } else {
            db = new SQL.Database();
            console.log('Created new database');
        }
        
        // Run schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.run(schema);
        console.log('Database tables created successfully');
        
        // Save database to file
        saveDatabase();
    } catch (err) {
        console.error('Error initializing database:', err.message);
        throw err;
    }
}

// Save database to file
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// Event operations
const eventOperations = {
    // Get all events
    getAllEvents: () => {
        try {
            const result = db.exec('SELECT * FROM events ORDER BY date DESC');
            if (result.length === 0) return [];
            
            const columns = result[0].columns;
            const values = result[0].values;
            
            return values.map(row => {
                const obj = {};
                columns.forEach((col, idx) => {
                    obj[col] = row[idx];
                });
                return obj;
            });
        } catch (err) {
            throw err;
        }
    },

    // Get single event by ID
    getEventById: (id) => {
        try {
            const result = db.exec('SELECT * FROM events WHERE id = ?', [id]);
            if (result.length === 0 || result[0].values.length === 0) return null;
            
            const columns = result[0].columns;
            const row = result[0].values[0];
            const obj = {};
            columns.forEach((col, idx) => {
                obj[col] = row[idx];
            });
            return obj;
        } catch (err) {
            throw err;
        }
    },

    // Create new event
    createEvent: (event) => {
        try {
            const { name, date, location, description } = event;
            db.run('INSERT INTO events (name, date, location, description) VALUES (?, ?, ?, ?)', 
                   [name, date, location, description]);
            
            // Get the last inserted ID
            const result = db.exec('SELECT last_insert_rowid() as id');
            const id = result[0].values[0][0];
            
            saveDatabase();
            return { id, ...event };
        } catch (err) {
            throw err;
        }
    },

    // Update event
    updateEvent: (id, event) => {
        try {
            const { name, date, location, description } = event;
            db.run('UPDATE events SET name = ?, date = ?, location = ?, description = ? WHERE id = ?',
                   [name, date, location, description, id]);
            
            // Check if any rows were affected
            const result = db.exec('SELECT changes() as changed');
            const changes = result[0].values[0][0];
            
            if (changes === 0) throw new Error('Event not found');
            
            saveDatabase();
            return { id, ...event };
        } catch (err) {
            throw err;
        }
    },

    // Delete event
    deleteEvent: (id) => {
        try {
            db.run('DELETE FROM events WHERE id = ?', [id]);
            
            // Check if any rows were affected
            const result = db.exec('SELECT changes() as changed');
            const changes = result[0].values[0][0];
            
            if (changes === 0) throw new Error('Event not found');
            
            saveDatabase();
            return { deleted: true, id };
        } catch (err) {
            throw err;
        }
    }
};

// Registration operations
const registrationOperations = {
    // Register for an event
    registerForEvent: (eventId, registration) => {
        try {
            const { name, email } = registration;
            db.run('INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)',
                   [eventId, name, email]);
            
            // Get the last inserted ID
            const result = db.exec('SELECT last_insert_rowid() as id');
            const id = result[0].values[0][0];
            
            saveDatabase();
            return { id, event_id: eventId, ...registration };
        } catch (err) {
            throw err;
        }
    },

    // Get registrations for an event
    getEventRegistrations: (eventId) => {
        try {
            const result = db.exec('SELECT * FROM registrations WHERE event_id = ? ORDER BY registered_at DESC', 
                                  [eventId]);
            if (result.length === 0) return [];
            
            const columns = result[0].columns;
            const values = result[0].values;
            
            return values.map(row => {
                const obj = {};
                columns.forEach((col, idx) => {
                    obj[col] = row[idx];
                });
                return obj;
            });
        } catch (err) {
            throw err;
        }
    },

    // Get registration count for an event
    getRegistrationCount: (eventId) => {
        try {
            const result = db.exec('SELECT COUNT(*) as count FROM registrations WHERE event_id = ?', 
                                  [eventId]);
            return result[0].values[0][0];
        } catch (err) {
            throw err;
        }
    }
};

module.exports = {
    initializeDatabase,
    eventOperations,
    registrationOperations
};
