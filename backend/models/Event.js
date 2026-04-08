const { query } = require('../utils/db');

const Event = {
    /**
     * Create a new event
     */
    create: async (eventData, createdBy) => {
        const { name, date, location, description, capacity = 100 } = eventData;
        
        const result = await query(
            `INSERT INTO events (name, date, location, description, capacity, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, date, location, description, capacity, createdBy]
        );
        
        return result.rows[0];
    },
    
    /**
     * Find event by ID with registration count
     */
    findById: async (id) => {
        const result = await query(
            `SELECT e.*, 
                    u.name as creator_name,
                    COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count,
                    e.capacity - COUNT(r.id) FILTER (WHERE r.status = 'registered') as available_slots
             FROM events e
             LEFT JOIN users u ON e.created_by = u.id
             LEFT JOIN registrations r ON e.id = r.event_id
             WHERE e.id = $1
             GROUP BY e.id, u.name`,
            [id]
        );
        return result.rows[0];
    },
    
    /**
     * Get all events with filters and pagination
     */
    findAll: async (filters = {}) => {
        const { search, upcoming, past, limit = 10, offset = 0 } = filters;
        
        let queryText = `
            SELECT e.*, 
                   u.name as creator_name,
                   COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count,
                   e.capacity - COUNT(r.id) FILTER (WHERE r.status = 'registered') as available_slots
            FROM events e
            LEFT JOIN users u ON e.created_by = u.id
            LEFT JOIN registrations r ON e.id = r.event_id
            WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 1;
        
        // Search filter
        if (search) {
            queryText += ` AND (e.name ILIKE $${paramCount} OR e.location ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }
        
        // Date filters
        if (upcoming) {
            queryText += ` AND e.date >= CURRENT_DATE`;
        } else if (past) {
            queryText += ` AND e.date < CURRENT_DATE`;
        }
        
        queryText += ` GROUP BY e.id, u.name ORDER BY e.date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);
        
        const result = await query(queryText, params);
        return result.rows;
    },
    
    /**
     * Update event
     */
    update: async (id, updates) => {
        const { name, date, location, description, capacity } = updates;
        
        const result = await query(
            `UPDATE events
             SET name = $1, date = $2, location = $3, description = $4, capacity = $5
             WHERE id = $6
             RETURNING *`,
            [name, date, location, description, capacity, id]
        );
        
        return result.rows[0];
    },
    
    /**
     * Delete event
     */
    delete: async (id) => {
        const result = await query(
            'DELETE FROM events WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    },
    
    /**
     * Check if event is full
     */
    isFull: async (eventId) => {
        const result = await query(
            `SELECT 
                e.capacity,
                COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count
             FROM events e
             LEFT JOIN registrations r ON e.id = r.event_id
             WHERE e.id = $1
             GROUP BY e.id, e.capacity`,
            [eventId]
        );
        
        if (!result.rows[0]) return true; // Event not found
        
        const { capacity, registration_count } = result.rows[0];
        return parseInt(registration_count) >= capacity;
    },
    
    /**
     * Check if event date has passed
     */
    isPast: async (eventId) => {
        const result = await query(
            'SELECT date < CURRENT_DATE as is_past FROM events WHERE id = $1',
            [eventId]
        );
        
        return result.rows[0]?.is_past || false;
    },
    
    /**
     * Get total count (for pagination)
     */
    count: async (filters = {}) => {
        const { search, upcoming, past } = filters;
        
        let queryText = 'SELECT COUNT(*) FROM events WHERE 1=1';
        const params = [];
        let paramCount = 1;
        
        if (search) {
            queryText += ` AND (name ILIKE $${paramCount} OR location ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }
        
        if (upcoming) {
            queryText += ` AND date >= CURRENT_DATE`;
        } else if (past) {
            queryText += ` AND date < CURRENT_DATE`;
        }
        
        const result = await query(queryText, params);
        return parseInt(result.rows[0].count);
    }
};

module.exports = Event;
