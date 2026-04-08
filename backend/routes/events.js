const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const { verifyToken, allowRoles, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for enhanced data)
router.get('/', optionalAuth, EventController.getAll);
router.get('/:id', optionalAuth, EventController.getById);

// Admin only routes
router.post('/', verifyToken, allowRoles('admin'), EventController.create);
router.put('/:id', verifyToken, allowRoles('admin'), EventController.update);
router.delete('/:id', verifyToken, allowRoles('admin'), EventController.delete);

module.exports = router;
