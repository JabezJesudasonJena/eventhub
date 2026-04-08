const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/registrationController');
const { verifyToken, allowRoles } = require('../middleware/auth');

// User routes - must be authenticated
router.post('/events/:id/register', verifyToken, allowRoles('user'), RegistrationController.register);
router.put('/events/:id/cancel', verifyToken, allowRoles('user'), RegistrationController.cancel);
router.get('/my-registrations', verifyToken, allowRoles('user'), RegistrationController.getUserRegistrations);

// Admin routes - view all registrations for an event
router.get('/events/:id/registrations', verifyToken, allowRoles('admin'), RegistrationController.getEventRegistrations);

module.exports = router;
