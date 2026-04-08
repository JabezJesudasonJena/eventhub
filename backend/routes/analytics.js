const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { verifyToken, allowRoles } = require('../middleware/auth');

// All analytics routes require admin access
router.get('/stats', verifyToken, allowRoles('admin'), AnalyticsController.getOverallStats);
router.get('/top-events', verifyToken, allowRoles('admin'), AnalyticsController.getTopEvents);
router.get('/trends', verifyToken, allowRoles('admin'), AnalyticsController.getRegistrationTrends);
router.get('/participation', verifyToken, allowRoles('admin'), AnalyticsController.getUserParticipation);
router.get('/capacity', verifyToken, allowRoles('admin'), AnalyticsController.getCapacityAnalysis);

module.exports = router;
