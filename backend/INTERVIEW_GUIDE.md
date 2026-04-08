# 🎓 DATABASE-FOCUSED INTERVIEW PREP GUIDE

## Event Registration System - Backend v2.0

This document highlights all database concepts, SQL queries, and backend patterns that make this project **interview-ready** and **production-grade**.

---

## 📊 DATABASE CONCEPTS DEMONSTRATED

### 1. Database Normalization (3NF)

**What it demonstrates:**
- No redundant data
- Each table has a single responsibility
- All non-key attributes depend on the primary key

**Example:**
```
❌ BAD (Denormalized):
events: id, name, date, location, attendee_name, attendee_email

✅ GOOD (Normalized):
events: id, name, date, location, created_by
users: id, name, email
registrations: id, user_id, event_id
```

**Interview Question:**
*"Why separate registrations into its own table?"*

**Answer:** 
- Eliminates data redundancy (user info not duplicated per registration)
- Enforces referential integrity via foreign keys
- Allows many-to-many relationship (users ↔ events)
- Easier to query and maintain

---

### 2. Entity Relationships

**Demonstrated Relationships:**

#### One-to-Many: User → Events
```sql
users (1) ─────creates─────> (*) events
```
- One user creates many events
- `events.created_by` references `users.id`

#### Many-to-Many: Users ↔ Events
```sql
users (*) ←──registrations──→ (*) events
```
- Many users register for many events
- Junction table: `registrations`

**SQL Implementation:**
```sql
-- One-to-Many
created_by INTEGER REFERENCES users(id) ON DELETE CASCADE

-- Many-to-Many (junction table)
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
```

---

### 3. Database Constraints

#### Primary Keys
```sql
id SERIAL PRIMARY KEY
```
**Purpose:** Unique identifier, auto-incrementing

#### Foreign Keys with CASCADE
```sql
created_by INTEGER REFERENCES users(id) ON DELETE CASCADE
```
**Purpose:** 
- Maintains referential integrity
- Automatic cleanup when parent deleted

#### Unique Constraints
```sql
email VARCHAR(255) UNIQUE NOT NULL
CONSTRAINT unique_user_event UNIQUE (user_id, event_id)
```
**Purpose:** 
- Prevents duplicate emails
- Prevents double registration

#### Check Constraints
```sql
role VARCHAR(20) CHECK (role IN ('admin', 'user'))
capacity INTEGER CHECK (capacity > 0)
status VARCHAR(20) CHECK (status IN ('registered', 'cancelled'))
```
**Purpose:** Data validation at database level

#### NOT NULL Constraints
```sql
name VARCHAR(255) NOT NULL
email VARCHAR(255) NOT NULL
```
**Purpose:** Ensures required fields are always present

---

### 4. Indexing Strategy

**Why Index?**
- Speeds up SELECT queries
- Essential for foreign keys
- Critical for search operations

**Indexes Created:**
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);        -- Login queries
CREATE INDEX idx_users_role ON users(role);          -- Role filtering

-- Events
CREATE INDEX idx_events_date ON events(date);        -- Date filtering
CREATE INDEX idx_events_created_by ON events(created_by);  -- Creator lookups
CREATE INDEX idx_events_name ON events(name);        -- Search
CREATE INDEX idx_events_location ON events(location);-- Search

-- Registrations
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);
```

**Interview Question:**
*"How do indexes improve performance?"*

**Answer:**
- Converts O(n) scan to O(log n) search
- Creates B-tree structure for fast lookups
- Trade-off: Slower writes, more storage
- Essential for foreign key relationships

---

### 5. Database Transactions (ACID)

**What is a Transaction?**
A sequence of database operations that execute as a single unit.

**ACID Properties:**
- **Atomicity:** All or nothing
- **Consistency:** Valid state before and after
- **Isolation:** Concurrent transactions don't interfere
- **Durability:** Committed changes persist

**Implementation Example:**
```javascript
// Registration with transaction
await transaction(async (client) => {
    // 1. Check existing registration
    const existing = await client.query(
        'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
        [userId, eventId]
    );
    
    // 2. Check capacity
    const capacity = await client.query(
        'SELECT capacity, COUNT(*) as count FROM events e
         LEFT JOIN registrations r ON e.id = r.event_id
         WHERE e.id = $1 AND r.status = \'registered\'
         GROUP BY e.id, e.capacity',
        [eventId]
    );
    
    if (capacity.count >= capacity.capacity) {
        throw new Error('Event is full');
    }
    
    // 3. Insert registration
    const result = await client.query(
        'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *',
        [userId, eventId]
    );
    
    return result.rows[0];
});
```

**Why Use Transactions Here?**
- Prevents race condition (two users booking last slot)
- Ensures capacity check and insert are atomic
- Rollback if any step fails

**Interview Question:**
*"What happens if two users try to register for the last slot simultaneously?"*

**Answer:**
- Transaction isolation prevents race condition
- Database locks the relevant rows
- One transaction completes first
- Second transaction sees updated count
- Second transaction fails with "Event is full"

---

### 6. Aggregate Functions & GROUP BY

**Common Aggregates Used:**

#### COUNT
```sql
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) FILTER (WHERE status = 'registered') as active_count
FROM registrations;
```

#### GROUP BY
```sql
-- Registrations per event
SELECT 
    e.name,
    COUNT(r.id) as registration_count
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.name;
```

#### Top Events Query
```sql
SELECT 
    e.id,
    e.name,
    COUNT(r.id) FILTER (WHERE r.status = 'registered') as reg_count,
    ROUND((COUNT(r.id)::numeric / e.capacity) * 100, 2) as fill_pct
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id
ORDER BY reg_count DESC
LIMIT 10;
```

**Interview Question:**
*"Explain the difference between WHERE and HAVING?"*

**Answer:**
- **WHERE:** Filters rows before grouping
- **HAVING:** Filters groups after aggregation
- Example:
```sql
-- WHERE: Filter events before counting
SELECT event_id, COUNT(*) 
FROM registrations 
WHERE status = 'registered'  -- Filter rows
GROUP BY event_id;

-- HAVING: Filter groups after counting
SELECT event_id, COUNT(*) as count
FROM registrations
GROUP BY event_id
HAVING COUNT(*) > 10;  -- Filter groups
```

---

### 7. Database Views

**What are Views?**
Virtual tables based on SELECT queries

**Materialized Views (PostgreSQL specific):**
Pre-calculated results stored in database

**Example: event_stats View**
```sql
CREATE OR REPLACE VIEW event_stats AS
SELECT 
    e.id,
    e.name,
    e.capacity,
    COUNT(r.id) FILTER (WHERE r.status = 'registered') as registration_count,
    e.capacity - COUNT(r.id) FILTER (WHERE r.status = 'registered') as available_slots,
    ROUND((COUNT(r.id)::numeric / e.capacity) * 100, 2) as capacity_percentage
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id;
```

**Benefits:**
- Simplifies complex queries
- Encapsulates business logic
- Can be indexed for performance
- Reusable across application

**Usage:**
```sql
-- Instead of complex JOIN and GROUP BY every time
SELECT * FROM event_stats WHERE capacity_percentage > 80;
```

---

### 8. Triggers

**What are Triggers?**
Automatic actions when certain events occur

**Example: Auto-update timestamp**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

**When it fires:** Before any UPDATE on users table  
**What it does:** Sets updated_at to current timestamp

---

### 9. SQL Injection Prevention

**❌ Vulnerable Code:**
```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
await pool.query(query);
```

**Problem:** User input directly in query  
**Attack:** `email = "' OR '1'='1"`  
**Result:** `SELECT * FROM users WHERE email = '' OR '1'='1'` (returns all users!)

**✅ Secure Code:**
```javascript
const query = 'SELECT * FROM users WHERE email = $1';
await pool.query(query, [email]);
```

**How it works:**
- Parameterized query with placeholder ($1)
- Database escapes the parameter
- Input treated as data, not SQL code

---

### 10. JOIN Types

**INNER JOIN** (only matching rows)
```sql
SELECT u.name, e.name
FROM users u
INNER JOIN events e ON e.created_by = u.id;
```

**LEFT JOIN** (all from left, matching from right)
```sql
SELECT e.name, COUNT(r.id) as reg_count
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.name;
```
**Key:** Returns all events, even if 0 registrations

**Use Case:** Show all events with registration count (including 0)

---

## 🔐 BACKEND SECURITY CONCEPTS

### 1. Password Hashing (bcrypt)

**Why not store plain text?**
- Database breach exposes all passwords
- Employees can see passwords
- Violates security best practices

**How bcrypt works:**
```javascript
// Signup
const hashedPassword = await bcrypt.hash(password, 10);
// Result: $2b$10$vGxRqM9HJhp4HkPxEJZE0O7k8YqHYmxQHkWJz5hX0N7XqLnGQJQXi

// Login
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

**Key Concepts:**
- **Salt:** Random data added before hashing
- **Rounds:** Number of iterations (10 = 2^10 = 1024)
- **One-way:** Cannot reverse hash to get password
- **Slow by design:** Prevents brute force attacks

**Interview Question:**
*"Why use bcrypt instead of SHA-256?"*

**Answer:**
- bcrypt is slow (intentional) - prevents brute force
- SHA-256 is fast - optimized for speed
- bcrypt includes salt automatically
- bcrypt cost factor can increase over time

---

### 2. JWT Authentication

**What is JWT?**
JSON Web Token - Stateless authentication

**Structure:**
```
Header.Payload.Signature
```

**Example JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIifQ.
signature_here
```

**Decoded Payload:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1617285600,
  "exp": 1617372000
}
```

**How it works:**
1. User logs in with email/password
2. Server verifies credentials
3. Server generates JWT with user info
4. Client stores token (localStorage/cookie)
5. Client sends token in Authorization header
6. Server verifies token signature
7. Server extracts user info from token

**Benefits:**
- Stateless (no session storage)
- Scalable (works across multiple servers)
- Contains user info (no database lookup)
- Signature prevents tampering

**Security:**
```javascript
// Generate
const token = jwt.sign({ id, email, role }, SECRET_KEY, { expiresIn: '24h' });

// Verify
const decoded = jwt.verify(token, SECRET_KEY);
```

---

### 3. Role-Based Access Control (RBAC)

**Concept:** Different permissions for different roles

**Implementation:**

1. **Store role in database**
```sql
role VARCHAR(20) CHECK (role IN ('admin', 'user'))
```

2. **Include role in JWT**
```javascript
const token = generateToken({ id, email, role });
```

3. **Middleware checks role**
```javascript
const allowRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
};

// Usage
app.post('/events', verifyToken, allowRoles('admin'), createEvent);
```

**Authorization Flow:**
```
Request → verifyToken → extract role → allowRoles → controller
```

**Interview Question:**
*"Difference between Authentication and Authorization?"*

**Answer:**
- **Authentication:** Who are you? (verify identity)
- **Authorization:** What can you do? (verify permissions)
- Example: Login (authentication) → Access admin panel (authorization)

---

### 4. Input Validation & Sanitization

**Validation:** Check if input meets requirements  
**Sanitization:** Clean input to remove malicious content

**Example:**
```javascript
// Validation
if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
}

if (!isValidPassword(password)) {
    return res.status(400).json({ 
        error: 'Password must be 8+ chars with uppercase, lowercase, number' 
    });
}

// Sanitization (XSS prevention)
const sanitizedName = xss(req.body.name);
```

**XSS Attack Example:**
```javascript
// Input: <script>alert('hacked')</script>
// Without sanitization: Stored in DB, executed when displayed
// With sanitization: &lt;script&gt;alert('hacked')&lt;/script&gt;
```

---

## 🏗️ ARCHITECTURE PATTERNS

### 1. MVC (Model-View-Controller)

**Separation of Concerns:**

**Model** (Data Layer)
```javascript
// models/User.js
const User = {
    create: async (userData) => { /* DB query */ },
    findByEmail: async (email) => { /* DB query */ },
    // ... other database operations
};
```

**Controller** (Business Logic)
```javascript
// controllers/authController.js
const signup = async (req, res) => {
    // Validate input
    // Call model to create user
    // Generate JWT
    // Send response
};
```

**Routes** (API Endpoints)
```javascript
// routes/auth.js
router.post('/signup', signup);
router.post('/login', login);
```

**Benefits:**
- Clear separation of concerns
- Easy to test each layer
- Modular and maintainable
- Team members can work on different layers

---

### 2. Middleware Pattern

**Concept:** Functions that process requests before reaching controller

**Example Flow:**
```
Request 
  → CORS middleware
  → Body parser middleware
  → Logger middleware
  → Auth middleware
  → Controller
```

**Implementation:**
```javascript
app.use(cors());                    // Enable CORS
app.use(express.json());            // Parse JSON body
app.use(requestLogger);             // Log requests
app.use('/admin', verifyToken);     // Require auth for /admin/*
app.use(errorHandler);              // Catch all errors
```

---

### 3. Connection Pooling

**Problem:** Creating new DB connection for each request is slow

**Solution:** Pool of reusable connections

**Implementation:**
```javascript
const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 20,              // Max connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Reuse connections
const result = await pool.query('SELECT * FROM users');
```

**Benefits:**
- Faster response times
- Reduced database load
- Handles concurrent requests
- Automatic connection management

---

## 🎯 INTERVIEW QUESTIONS & ANSWERS

### Database Questions

**Q1: What is database normalization and why is it important?**

**A:** Normalization is organizing data to reduce redundancy and improve integrity. It involves dividing tables into smaller, related tables. Our project is in 3NF:
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies

Benefits:
- Eliminates data duplication
- Easier to maintain data consistency
- Reduces storage requirements
- Enforces data integrity through relationships

---

**Q2: Explain foreign keys and cascading deletes.**

**A:** A foreign key creates a link between two tables, enforcing referential integrity.

Example in our project:
```sql
created_by INTEGER REFERENCES users(id) ON DELETE CASCADE
```

- `created_by` in events table references `id` in users table
- `ON DELETE CASCADE` means: if user is deleted, all their events are automatically deleted
- Prevents orphaned records (events without a creator)
- Alternative options: `ON DELETE SET NULL`, `ON DELETE RESTRICT`

---

**Q3: What are database indexes and when should you use them?**

**A:** Indexes are data structures that improve query speed.

When to use:
- Foreign key columns (mandatory)
- Frequently queried columns (email, date)
- Columns used in WHERE, ORDER BY, JOIN

When NOT to use:
- Small tables
- Frequently updated columns (slower writes)
- Columns with low cardinality (e.g., boolean)

Trade-offs:
- Pros: Faster reads
- Cons: Slower writes, more storage

---

**Q4: Explain ACID properties with an example.**

**A:** ACID ensures database reliability:

**Atomicity:** All or nothing
```javascript
// Either both queries succeed or both fail
BEGIN;
INSERT INTO registrations ...;
UPDATE events SET slots = slots - 1 ...;
COMMIT;  // or ROLLBACK on error
```

**Consistency:** Valid state before and after
- Constraints ensure valid data (e.g., capacity > 0)

**Isolation:** Concurrent transactions don't interfere
- Two users registering simultaneously won't both get the last slot

**Durability:** Committed data persists
- Once registration is confirmed, it survives server crash

---

**Q5: What's the difference between INNER JOIN and LEFT JOIN?**

**A:** 

**INNER JOIN:** Only returns matching rows
```sql
-- Only users who created events
SELECT u.name, e.name
FROM users u
INNER JOIN events e ON u.id = e.created_by;
```

**LEFT JOIN:** All rows from left table, matching from right
```sql
-- All events, even with 0 registrations
SELECT e.name, COUNT(r.id)
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id;
```

---

### Security Questions

**Q6: How do you prevent SQL injection?**

**A:** Use parameterized queries:

❌ Vulnerable:
```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

✅ Secure:
```javascript
const query = 'SELECT * FROM users WHERE email = $1';
await pool.query(query, [email]);
```

Database driver:
- Escapes special characters
- Treats input as data, not SQL code
- Prevents malicious SQL execution

---

**Q7: Why use JWT instead of sessions?**

**A:** 

**Sessions:**
- Server stores session data (memory/database)
- Client sends session ID in cookie
- Server lookup required for each request
- Doesn't scale well (needs shared session store)

**JWT:**
- Stateless (no server-side storage)
- Self-contained (user info in token)
- Scalable (works across multiple servers)
- No database lookup needed

Trade-offs:
- Sessions: Can revoke instantly
- JWT: Can't revoke until expiration (use refresh tokens to mitigate)

---

**Q8: Explain bcrypt and why it's better than MD5/SHA.**

**A:** 

**bcrypt:**
- Designed for passwords
- Slow by design (prevents brute force)
- Includes salt automatically
- Adaptive (can increase cost factor)

**MD5/SHA:**
- Designed for data integrity
- Fast (bad for passwords)
- No built-in salt
- Rainbow table attacks

Example:
```javascript
// bcrypt (slow - good for passwords)
const hash = await bcrypt.hash(password, 10);  // 10 rounds = 1024 iterations

// SHA-256 (fast - bad for passwords)
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

---

### Backend Questions

**Q9: What is middleware and why use it?**

**A:** Middleware processes requests before reaching the controller.

Benefits:
- Code reuse (don't repeat auth logic everywhere)
- Separation of concerns (auth logic separate from business logic)
- Request/response transformation
- Error handling

Example:
```javascript
// Without middleware (repeated code)
app.get('/events', (req, res) => {
    // Verify token
    // Check role
    // Get events
});

// With middleware (reusable)
app.get('/events', verifyToken, allowRoles('admin'), getEvents);
```

---

**Q10: Explain the architecture of this application.**

**A:** MVC pattern with additional layers:

**Layers:**
1. **Routes** - Define API endpoints
2. **Middleware** - Auth, validation, error handling
3. **Controllers** - Business logic
4. **Models** - Database operations
5. **Utils** - Helper functions

**Data Flow:**
```
Request → Routes → Middleware → Controller → Model → Database
                                                    ↓
Response ← Routes ← Middleware ← Controller ← Model
```

**Benefits:**
- Modular and maintainable
- Easy to test each layer
- Clear separation of concerns
- Scalable architecture

---

## 📚 KEY TAKEAWAYS FOR INTERVIEWS

### Database Skills Demonstrated
✅ Normalized database design (3NF)  
✅ Entity relationships (1-to-many, many-to-many)  
✅ Constraints (PK, FK, UNIQUE, CHECK, NOT NULL)  
✅ Indexes for performance optimization  
✅ Transactions for data consistency  
✅ Aggregate functions (COUNT, GROUP BY, FILTER)  
✅ Database views for complex queries  
✅ Triggers for automation  
✅ JOIN operations  
✅ SQL injection prevention  

### Backend Skills Demonstrated
✅ JWT authentication  
✅ Role-based access control (RBAC)  
✅ Password hashing with bcrypt  
✅ Input validation & sanitization  
✅ MVC architecture  
✅ Middleware pattern  
✅ Connection pooling  
✅ RESTful API design  
✅ Error handling  
✅ Security best practices  

---

**🎉 You now have a comprehensive, interview-ready backend project!**
