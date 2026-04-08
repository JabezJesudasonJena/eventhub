const { query } = require('../utils/db');

const AnalyticsController = {
    /**
     * Get overall analytics
     */
    getOverallStats: async (req, res) => {
        try {
            const stats = await query(`
                SELECT 
                    (SELECT COUNT(*) FROM events) as total_events,
                    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
                    (SELECT COUNT(*) FROM registrations WHERE status = 'registered') as total_registrations,
                    (SELECT COUNT(*) FROM events WHERE date >= CURRENT_DATE) as upcoming_events,
                    (SELECT COUNT(*) FROM events WHERE date < CURRENT_DATE) as past_events
            `);
            
            res.json(stats.rows[0]);
        } catch (error) {
            console.error('Analytics error:', error);
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    },
    
    /**
     * Get top events by registration count
     */
    getTopEvents: async (req, res) => {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 10, 50);
            
            const topEvents = await query(`
                SELECT 
                    e.id,
                    e.name,
                    e.date,
                    e.location,
                    e.capacity,
                    COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count,
                    ROUND((COUNT(r.id) FILTER (WHERE r.status = 'registered')::numeric / e.capacity) * 100, 2) as fill_percentage
                FROM events e
                LEFT JOIN registrations r ON e.id = r.event_id
                GROUP BY e.id
                ORDER BY registration_count DESC
                LIMIT $1
            `, [limit]);
            
            res.json({ topEvents: topEvents.rows });
        } catch (error) {
            console.error('Top events error:', error);
            res.status(500).json({ error: 'Failed to fetch top events' });
        }
    },
    
    /**
     * Get event registration trends
     */
    getRegistrationTrends: async (req, res) => {
        try {
            const trends = await query(`
                SELECT 
                    DATE_TRUNC('day', registered_at) as date,
                    COUNT(*) as registrations
                FROM registrations
                WHERE status = 'registered'
                    AND registered_at >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY DATE_TRUNC('day', registered_at)
                ORDER BY date DESC
            `);
            
            res.json({ trends: trends.rows });
        } catch (error) {
            console.error('Trends error:', error);
            res.status(500).json({ error: 'Failed to fetch trends' });
        }
    },
    
    /**
     * Get user participation stats
     */
    getUserParticipation: async (req, res) => {
        try {
            const participation = await query(`
                SELECT 
                    u.id,
                    u.name,
                    u.email,
                    COUNT(r.id) FILTER (WHERE r.status = 'registered') as active_registrations,
                    COUNT(r.id) FILTER (WHERE r.status = 'cancelled') as cancelled_registrations,
                    COUNT(r.id) as total_registrations
                FROM users u
                LEFT JOIN registrations r ON u.id = r.user_id
                WHERE u.role = 'user'
                GROUP BY u.id, u.name, u.email
                HAVING COUNT(r.id) > 0
                ORDER BY active_registrations DESC
                LIMIT 20
            `);
            
            res.json({ participation: participation.rows });
        } catch (error) {
            console.error('Participation error:', error);
            res.status(500).json({ error: 'Failed to fetch participation' });
        }
    },
    
    /**
     * Get event capacity analysis
     */
    getCapacityAnalysis: async (req, res) => {
        try {
            const analysis = await query(`
                SELECT 
                    CASE 
                        WHEN capacity_percentage >= 90 THEN 'Nearly Full (90-100%)'
                        WHEN capacity_percentage >= 70 THEN 'High (70-89%)'
                        WHEN capacity_percentage >= 50 THEN 'Medium (50-69%)'
                        WHEN capacity_percentage >= 25 THEN 'Low (25-49%)'
                        ELSE 'Very Low (0-24%)'
                    END as capacity_range,
                    COUNT(*) as event_count
                FROM event_stats
                WHERE date >= CURRENT_DATE
                GROUP BY capacity_range
                ORDER BY MIN(capacity_percentage) DESC
            `);
            
            res.json({ capacityAnalysis: analysis.rows });
        } catch (error) {
            console.error('Capacity analysis error:', error);
            res.status(500).json({ error: 'Failed to fetch capacity analysis' });
        }
    }
};

module.exports = AnalyticsController;
