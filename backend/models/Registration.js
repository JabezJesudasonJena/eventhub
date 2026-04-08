const { query, transaction } = require('../utils/db');

const Registration = {
    /**
     * Register user for event with transaction
     */
    create: async (userId, eventId) => {
        return await transaction(async (client) => {
            // Check if already registered
            const existingReg = await client.query(
                `SELECT * FROM registrations 
                 WHERE user_id = $1 AND event_id = $2`,
                [userId, eventId]
            );
            
            if (existingReg.rows.length > 0) {
                const reg = existingReg.rows[0];
                if (reg.status === 'registered') {
                    throw new Error('Already registered for this event');
                }
                // If cancelled, re-register
                const result = await client.query(
                    `UPDATE registrations
                     SET status = 'registered', cancelled_at = NULL
                     WHERE id = $1
                     RETURNING *`,
                    [reg.id]
                );
                return result.rows[0];
            }
            
            // Check event capacity
            const capacityCheck = await client.query(
                `SELECT 
                    e.capacity,
                    COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count
                 FROM events e
                 LEFT JOIN registrations r ON e.id = r.event_id
                 WHERE e.id = $1
                 GROUP BY e.id, e.capacity`,
                [eventId]
            );
            
            if (capacityCheck.rows.length === 0) {
                throw new Error('Event not found');
            }
            
            const { capacity, registration_count } = capacityCheck.rows[0];
            if (parseInt(registration_count) >= capacity) {
                throw new Error('Event is full');
            }
            
            // Create registration
            const result = await client.query(
                `INSERT INTO registrations (user_id, event_id, status)
                 VALUES ($1, $2, 'registered')
                 RETURNING *`,
                [userId, eventId]
            );
            
            return result.rows[0];
        });
    },
    
    /**
     * Cancel registration
     */
    cancel: async (userId, eventId) => {
        const result = await query(
            `UPDATE registrations
             SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
             WHERE user_id = $1 AND event_id = $2 AND status = 'registered'
             RETURNING *`,
            [userId, eventId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Registration not found or already cancelled');
        }
        
        return result.rows[0];
    },
    
    /**
     * Get user's registrations
     */
    findByUser: async (userId) => {
        const result = await query(
            `SELECT r.*, e.name as event_name, e.date, e.location
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             WHERE r.user_id = $1
             ORDER BY r.registered_at DESC`,
            [userId]
        );
        return result.rows;
    },
    
    /**
     * Get event's registrations
     */
    findByEvent: async (eventId) => {
        const result = await query(
            `SELECT r.*, u.name as user_name, u.email
             FROM registrations r
             JOIN users u ON r.user_id = u.id
             WHERE r.event_id = $1
             ORDER BY r.registered_at DESC`,
            [eventId]
        );
        return result.rows;
    },
    
    /**
     * Check if user is registered for event
     */
    isRegistered: async (userId, eventId) => {
        const result = await query(
            `SELECT EXISTS(
                SELECT 1 FROM registrations
                WHERE user_id = $1 AND event_id = $2 AND status = 'registered'
             ) as is_registered`,
            [userId, eventId]
        );
        return result.rows[0].is_registered;
    },
    
    /**
     * Get registration count for event
     */
    countByEvent: async (eventId) => {
        const result = await query(
            `SELECT COUNT(*) as count
             FROM registrations
             WHERE event_id = $1 AND status = 'registered'`,
            [eventId]
        );
        return parseInt(result.rows[0].count);
    },
    
    /**
     * Delete registration
     */
    delete: async (id) => {
        const result = await query(
            'DELETE FROM registrations WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = Registration;
