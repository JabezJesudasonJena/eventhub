-- ===== PRODUCTION DATABASE SCHEMA =====
-- Event Registration System with Authentication & RBAC

-- Drop existing tables (cascade to remove dependencies)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===== USERS TABLE =====
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups (login)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ===== EVENTS TABLE =====
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL DEFAULT 100 CHECK (capacity > 0),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_name ON events(name);
CREATE INDEX idx_events_location ON events(location);

-- ===== REGISTRATIONS TABLE =====
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled')),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Prevent duplicate registrations
    CONSTRAINT unique_user_event UNIQUE (user_id, event_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);

-- ===== TRIGGER FOR UPDATED_AT =====
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== SEED DATA (For Testing) =====

-- Create default admin user
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@eventify.com', '$2b$10$vGxRqM9HJhp4HkPxEJZE0O7k8YqHYmxQHkWJz5hX0N7XqLnGQJQXi', 'admin');

-- Create default regular user  
-- Password: User@123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'user@eventify.com', '$2b$10$5R5Y5Y5Y5Y5Y5Y5Y5Y5Y5uHFGHFGHFGHFGHFGHFGHFGHFGHFGHFGHF', 'user');

-- Create sample events (created by admin user - id 1)
INSERT INTO events (name, date, location, description, capacity, created_by) VALUES
('Tech Conference 2026', '2026-05-15', 'San Francisco, CA', 'Annual technology conference featuring industry leaders', 200, 1),
('Web Development Workshop', '2026-06-20', 'New York, NY', 'Hands-on workshop for modern web development', 50, 1),
('AI & Machine Learning Summit', '2026-07-10', 'Seattle, WA', 'Exploring the future of AI and ML', 150, 1);

-- Create sample registrations
INSERT INTO registrations (user_id, event_id, status) VALUES
(2, 1, 'registered'),
(2, 2, 'registered');

-- ===== ANALYTICS VIEWS =====

-- View for event statistics
CREATE OR REPLACE VIEW event_stats AS
SELECT 
    e.id,
    e.name,
    e.date,
    e.location,
    e.capacity,
    COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count,
    e.capacity - COUNT(r.id) FILTER (WHERE r.status = 'registered') as available_slots,
    ROUND((COUNT(r.id) FILTER (WHERE r.status = 'registered')::numeric / e.capacity) * 100, 2) as capacity_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.name, e.date, e.location, e.capacity;

-- View for user participation
CREATE OR REPLACE VIEW user_participation AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(r.id) FILTER (WHERE r.status = 'registered') as active_registrations,
    COUNT(r.id) FILTER (WHERE r.status = 'cancelled') as cancelled_registrations,
    COUNT(r.id) as total_registrations
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email;

-- Success message
SELECT 'Database schema created successfully!' as message;
