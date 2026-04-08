const xss = require('xss');

/**
 * Sanitize input to prevent XSS attacks
 */
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return xss(input.trim());
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const key in input) {
            sanitized[key] = sanitizeInput(input[key]);
        }
        return sanitized;
    }
    return input;
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
const isValidPassword = (password) => {
    if (password.length < 8) return false;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpper && hasLower && hasNumber;
};

/**
 * Validate date is in the future
 */
const isFutureDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time to start of day
    return date >= now;
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;
    return { limit: limitNum, offset, page: pageNum };
};

module.exports = {
    sanitizeInput,
    isValidEmail,
    isValidPassword,
    isFutureDate,
    paginate
};
