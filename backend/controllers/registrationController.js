const Registration = require('../models/Registration');
const Event = require('../models/Event');

const RegistrationController = {
    /**
     * Register for an event
     */
    register: async (req, res) => {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;
            
            // Check if event exists
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            
            // Check if event is in the past
            const isPast = await Event.isPast(eventId);
            if (isPast) {
                return res.status(400).json({ error: 'Cannot register for past events' });
            }
            
            // Check if event is full
            const isFull = await Event.isFull(eventId);
            if (isFull) {
                return res.status(400).json({ error: 'Event is full' });
            }
            
            // Create registration (with transaction)
            const registration = await Registration.create(userId, eventId);
            
            res.status(201).json({
                message: 'Successfully registered for event',
                registration
            });
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.message === 'Already registered for this event') {
                return res.status(409).json({ error: error.message });
            }
            if (error.message === 'Event is full') {
                return res.status(400).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Failed to register for event' });
        }
    },
    
    /**
     * Cancel registration
     */
    cancel: async (req, res) => {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;
            
            const registration = await Registration.cancel(userId, eventId);
            
            res.json({
                message: 'Registration cancelled successfully',
                registration
            });
        } catch (error) {
            console.error('Cancel registration error:', error);
            
            if (error.message === 'Registration not found or already cancelled') {
                return res.status(404).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Failed to cancel registration' });
        }
    },
    
    /**
     * Get user's registrations
     */
    getUserRegistrations: async (req, res) => {
        try {
            const userId = req.user.id;
            const registrations = await Registration.findByUser(userId);
            
            res.json({ registrations });
        } catch (error) {
            console.error('Get user registrations error:', error);
            res.status(500).json({ error: 'Failed to fetch registrations' });
        }
    },
    
    /**
     * Get event's registrations (Admin only)
     */
    getEventRegistrations: async (req, res) => {
        try {
            const eventId = req.params.id;
            const registrations = await Registration.findByEvent(eventId);
            
            res.json({ registrations });
        } catch (error) {
            console.error('Get event registrations error:', error);
            res.status(500).json({ error: 'Failed to fetch registrations' });
        }
    }
};

module.exports = RegistrationController;
