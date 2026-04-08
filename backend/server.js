const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import database
const { pool } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ===== HEALTH CHECK =====

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'Event Registration API v2.0',
            database: 'Connected'
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            service: 'Event Registration API v2.0',
            database: 'Disconnected'
        });
    }
});

// ===== API ROUTES =====

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/api', registrationRoutes); // /api/events/:id/register, /api/my-registrations
app.use('/analytics', analyticsRoutes);

// ===== FRONTEND ROUTES =====

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ===== ERROR HANDLING =====

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===== START SERVER =====

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Event Registration System API v2.0');
    console.log('='.repeat(50));
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ API: http://localhost:${PORT}`);
    console.log(`✓ Frontend: http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n📋 API Endpoints:');
    console.log('  Authentication:');
    console.log('    POST   /auth/signup');
    console.log('    POST   /auth/login');
    console.log('    GET    /auth/me');
    console.log('  Events:');
    console.log('    GET    /events');
    console.log('    GET    /events/:id');
    console.log('    POST   /events (admin)');
    console.log('    PUT    /events/:id (admin)');
    console.log('    DELETE /events/:id (admin)');
    console.log('  Registrations:');
    console.log('    POST   /api/events/:id/register (user)');
    console.log('    PUT    /api/events/:id/cancel (user)');
    console.log('    GET    /api/my-registrations (user)');
    console.log('    GET    /api/events/:id/registrations (admin)');
    console.log('  Analytics:');
    console.log('    GET    /analytics/stats (admin)');
    console.log('    GET    /analytics/top-events (admin)');
    console.log('    GET    /analytics/trends (admin)');
    console.log('    GET    /analytics/participation (admin)');
    console.log('    GET    /analytics/capacity (admin)');
    console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n⏹️  Shutting down gracefully...');
    pool.end(() => {
        console.log('✓ Database connections closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⏹️  Shutting down gracefully...');
    pool.end(() => {
        console.log('✓ Database connections closed');
        process.exit(0);
    });
});

