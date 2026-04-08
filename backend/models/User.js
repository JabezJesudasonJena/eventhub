const { query } = require('../utils/db');
const { hashPassword, comparePassword } = require('../utils/auth');

const User = {
    /**
     * Create a new user
     */
    create: async (userData) => {
        const { name, email, password, role = 'user' } = userData;
        const hashedPassword = await hashPassword(password);
        
        const result = await query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role, created_at`,
            [name, email, hashedPassword, role]
        );
        
        return result.rows[0];
    },
    
    /**
     * Find user by email
     */
    findByEmail: async (email) => {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },
    
    /**
     * Find user by ID
     */
    findById: async (id) => {
        const result = await query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },
    
    /**
     * Verify user password
     */
    verifyPassword: async (password, hashedPassword) => {
        return await comparePassword(password, hashedPassword);
    },
    
    /**
     * Get all users (admin only)
     */
    findAll: async (limit = 50, offset = 0) => {
        const result = await query(
            `SELECT id, name, email, role, created_at
             FROM users
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    },
    
    /**
     * Update user
     */
    update: async (id, updates) => {
        const { name, email } = updates;
        const result = await query(
            `UPDATE users
             SET name = $1, email = $2
             WHERE id = $3
             RETURNING id, name, email, role, created_at`,
            [name, email, id]
        );
        return result.rows[0];
    },
    
    /**
     * Delete user
     */
    delete: async (id) => {
        const result = await query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    },
    
    /**
     * Check if email exists
     */
    emailExists: async (email) => {
        const result = await query(
            'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists',
            [email]
        );
        return result.rows[0].exists;
    }
};

module.exports = User;
