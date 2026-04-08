const Event = require('../models/Event');
const { sanitizeInput, isFutureDate, paginate } = require('../utils/validators');

const EventController = {
    /**
     * Get all events with filters and pagination
     */
    getAll: async (req, res) => {
        try {
            const { search, upcoming, past, page = 1, limit = 10 } = req.query;
            const { limit: pLimit, offset } = paginate(page, limit);
            
            const filters = {
                search: search ? sanitizeInput(search) : null,
                upcoming: upcoming === 'true',
                past: past === 'true',
                limit: pLimit,
                offset
            };
            
            const events = await Event.findAll(filters);
            const total = await Event.count(filters);
            
            res.json({
                events,
                pagination: {
                    page: parseInt(page),
                    limit: pLimit,
                    total,
                    totalPages: Math.ceil(total / pLimit)
                }
            });
        } catch (error) {
            console.error('Get events error:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    },
    
    /**
     * Get single event by ID
     */
    getById: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            
            res.json(event);
        } catch (error) {
            console.error('Get event error:', error);
            res.status(500).json({ error: 'Failed to fetch event' });
        }
    },
    
    /**
     * Create new event (Admin only)
     */
    create: async (req, res) => {
        try {
            const eventData = sanitizeInput(req.body);
            const { name, date, location, description, capacity } = eventData;
            
            // Validation
            if (!name || !date || !location) {
                return res.status(400).json({
                    error: 'Name, date, and location are required'
                });
            }
            
            // Validate future date
            if (!isFutureDate(date)) {
                return res.status(400).json({
                    error: 'Event date must be in the future'
                });
            }
            
            // Validate capacity
            if (capacity && (capacity < 1 || capacity > 10000)) {
                return res.status(400).json({
                    error: 'Capacity must be between 1 and 10000'
                });
            }
            
            const event = await Event.create(eventData, req.user.id);
            
            res.status(201).json({
                message: 'Event created successfully',
                event
            });
        } catch (error) {
            console.error('Create event error:', error);
            res.status(500).json({ error: 'Failed to create event' });
        }
    },
    
    /**
     * Update event (Admin only)
     */
    update: async (req, res) => {
        try {
            const updates = sanitizeInput(req.body);
            const { name, date, location, description, capacity } = updates;
            
            // Validation
            if (!name || !date || !location) {
                return res.status(400).json({
                    error: 'Name, date, and location are required'
                });
            }
            
            // Validate capacity
            if (capacity && (capacity < 1 || capacity > 10000)) {
                return res.status(400).json({
                    error: 'Capacity must be between 1 and 10000'
                });
            }
            
            const event = await Event.update(req.params.id, updates);
            
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            
            res.json({
                message: 'Event updated successfully',
                event
            });
        } catch (error) {
            console.error('Update event error:', error);
            res.status(500).json({ error: 'Failed to update event' });
        }
    },
    
    /**
     * Delete event (Admin only)
     */
    delete: async (req, res) => {
        try {
            const result = await Event.delete(req.params.id);
            
            if (!result) {
                return res.status(404).json({ error: 'Event not found' });
            }
            
            res.json({
                message: 'Event deleted successfully',
                id: result.id
            });
        } catch (error) {
            console.error('Delete event error:', error);
            res.status(500).json({ error: 'Failed to delete event' });
        }
    }
};

module.exports = EventController;
