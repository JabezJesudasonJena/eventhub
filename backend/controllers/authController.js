const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { sanitizeInput, isValidEmail, isValidPassword } = require('../utils/validators');

const AuthController = {
    /**
     * User signup
     */
    signup: async (req, res) => {
        try {
            const { name, email, password, role = 'user' } = sanitizeInput(req.body);
            
            // Validate email
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            
            // Validate password
            if (!isValidPassword(password)) {
                return res.status(400).json({
                    error: 'Password must be at least 8 characters with uppercase, lowercase, and number'
                });
            }
            
            // Check if email already exists
            const emailExists = await User.emailExists(email);
            if (emailExists) {
                return res.status(409).json({ error: 'Email already registered' });
            }
            
            // Only admins can create admin accounts
            const userRole = role === 'admin' && req.user?.role !== 'admin' ? 'user' : role;
            
            // Create user
            const user = await User.create({ name, email, password, role: userRole });
            
            // Generate token
            const token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });
            
            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },
    
    /**
     * User login
     */
    login: async (req, res) => {
        try {
            const { email, password } = sanitizeInput(req.body);
            
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            
            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            // Verify password
            const isValid = await User.verifyPassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            // Generate token
            const token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    },
    
    /**
     * Get current user info
     */
    me: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ error: 'Failed to get user info' });
        }
    }
};

module.exports = AuthController;
