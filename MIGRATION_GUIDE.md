# Migration Guide: SQLite to Neon PostgreSQL

This document explains the changes made to migrate from SQLite to Neon PostgreSQL.

## Summary of Changes

### 1. Dependencies Changed

**Removed:**
- `sql.js` (SQLite library)

**Added:**
- `pg` v8.11.3 (PostgreSQL client)
- `dotenv` v16.3.1 (Environment variables)

### 2. Files Modified

#### package.json
```json
"dependencies": {
  "express": "^4.18.2",
  "pg": "^8.11.3",           // ← Added
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"        // ← Added
}
```

#### schema.sql
**Key Changes:**
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
- `DATETIME` → `TIMESTAMP`
- `TEXT` column for dates → `DATE` type
- Foreign key syntax updated for PostgreSQL

**Before (SQLite):**
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**After (PostgreSQL):**
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### database.js
**Complete Rewrite:**

**Before (SQLite with sql.js):**
```javascript
const initSqlJs = require('sql.js');
const db = new SQL.Database(buffer);
const result = db.exec('SELECT * FROM events');
// Synchronous, returns array format
```

**After (PostgreSQL with pg):**
```javascript
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
const result = await pool.query('SELECT * FROM events');
// Asynchronous, returns result.rows
```

**Query Parameter Syntax:**
- SQLite: `SELECT * FROM events WHERE id = ?`
- PostgreSQL: `SELECT * FROM events WHERE id = $1`

**Result Format:**
- SQLite (sql.js): `{ columns: [...], values: [[...]] }`
- PostgreSQL (pg): `{ rows: [{...}], rowCount: n }`

#### server.js
**Changes:**
```javascript
// Added at top
require('dotenv').config();

// Updated port configuration
const PORT = process.env.PORT || 3000;
```

### 3. New Files Created

#### .env.example
Template for environment variables:
```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
PORT=3000
```

#### .env (created by user, gitignored)
Actual environment variables with real credentials.

### 4. Query Changes

All database operations converted from synchronous to asynchronous:

**Example - Get All Events:**

**Before:**
```javascript
getAllEvents: () => {
    const result = db.exec('SELECT * FROM events ORDER BY date DESC');
    if (result.length === 0) return [];
    // Transform columns/values to objects
    return values.map(row => { /* ... */ });
}
```

**After:**
```javascript
getAllEvents: async () => {
    const result = await pool.query(
        'SELECT * FROM events ORDER BY date DESC'
    );
    return result.rows; // Already in object format
}
```

**Example - Create Event:**

**Before:**
```javascript
createEvent: (event) => {
    const { name, date, location, description } = event;
    db.run('INSERT INTO events (...) VALUES (?, ?, ?, ?)', 
           [name, date, location, description]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    saveDatabase(); // Write to file
    return { id, ...event };
}
```

**After:**
```javascript
createEvent: async (event) => {
    const { name, date, location, description } = event;
    const result = await pool.query(
        'INSERT INTO events (...) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, date, location, description]
    );
    return result.rows[0]; // No need to save, auto-persisted
}
```

### 5. Key Architectural Differences

| Aspect | SQLite (sql.js) | Neon PostgreSQL |
|--------|-----------------|-----------------|
| **Connection** | File-based | Network connection pool |
| **Persistence** | Manual `saveDatabase()` | Auto-persisted |
| **Queries** | Synchronous | Asynchronous (async/await) |
| **Parameters** | `?` placeholders | `$1, $2, $3` placeholders |
| **Results** | Custom object format | Standard format |
| **SSL** | N/A | Required for Neon |
| **Environment** | No config needed | Needs DATABASE_URL |

### 6. Connection Pooling

PostgreSQL uses connection pooling for efficiency:

```javascript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Pool automatically manages connections
// Reuses existing connections
// Creates new ones when needed
```

### 7. Error Handling

All operations now use try/catch with async/await:

**Before:**
```javascript
getAllEvents: () => {
    try {
        const result = db.exec('SELECT * FROM events');
        return transformResult(result);
    } catch (err) {
        throw err;
    }
}
```

**After:**
```javascript
getAllEvents: async () => {
    try {
        const result = await pool.query('SELECT * FROM events');
        return result.rows;
    } catch (err) {
        console.error('Error getting all events:', err);
        throw err;
    }
}
```

### 8. Data Type Conversions

| SQLite | PostgreSQL | Notes |
|--------|------------|-------|
| TEXT | TEXT | Same |
| INTEGER | INTEGER | Same |
| REAL | NUMERIC/DECIMAL | Floating point |
| TEXT (for dates) | DATE | Proper date type |
| DATETIME | TIMESTAMP | More precise |
| AUTOINCREMENT | SERIAL | Auto-increment |
| BLOB | BYTEA | Binary data |

### 9. Frontend Changes

**None!** The frontend code remains exactly the same because:
- Same REST API endpoints
- Same request/response format
- Same JSON structure
- Backend handles all database differences

### 10. Testing Changes

**Before:**
```bash
npm start
# Database file created automatically
# No configuration needed
```

**After:**
```bash
# Must set up Neon first
# Create .env with DATABASE_URL
npm start
# Connects to cloud database
```

## Step-by-Step Migration Process

If you're migrating an existing project:

1. **Backup your data:**
   ```bash
   # Export SQLite data to SQL
   sqlite3 events.db .dump > backup.sql
   ```

2. **Update package.json:**
   - Remove `sql.js`
   - Add `pg` and `dotenv`

3. **Install new dependencies:**
   ```bash
   npm install pg dotenv
   npm uninstall sql.js
   ```

4. **Create Neon account and project**

5. **Create .env file with DATABASE_URL**

6. **Update schema.sql for PostgreSQL syntax**

7. **Rewrite database.js:**
   - Use pg Pool
   - Convert to async/await
   - Change query syntax
   - Update parameter placeholders

8. **Update server.js:**
   - Add `require('dotenv').config()`
   - Update PORT configuration

9. **Migrate data (if needed):**
   - Connect to Neon
   - Run CREATE TABLE statements
   - Import data from backup

10. **Test all endpoints:**
    - GET /events
    - POST /events
    - PUT /events/:id
    - DELETE /events/:id
    - POST /events/:id/register
    - GET /events/:id/registrations

## Benefits of PostgreSQL Migration

✅ **Cloud-based**: Access from anywhere
✅ **Scalable**: Handles more concurrent connections
✅ **Production-ready**: Suitable for deployment
✅ **Advanced features**: Better query optimization, indexes
✅ **Standard SQL**: Industry-standard database
✅ **Neon benefits**: Auto-suspend, branching, backups

## Potential Issues During Migration

1. **Date format differences**: SQLite stores dates as TEXT, PostgreSQL uses proper DATE type
2. **Parameter placeholders**: Must change `?` to `$1, $2, $3`
3. **Async operations**: All queries now need `await`
4. **Connection string**: Need valid DATABASE_URL
5. **SSL requirements**: Neon requires SSL connections
6. **Case sensitivity**: PostgreSQL is more strict with identifiers

## Rollback Plan

If you need to revert to SQLite:

1. Keep the original SQLite code in a git branch
2. Or reinstall `sql.js`: `npm install sql.js`
3. Restore original `database.js` and `schema.sql`
4. Remove `.env` dependency
5. Remove `dotenv` and `pg` packages

## Performance Considerations

**SQLite (local file):**
- ✅ Fast for small datasets
- ✅ No network latency
- ❌ Limited concurrent writes
- ❌ Local only

**Neon PostgreSQL (cloud):**
- ✅ Unlimited concurrent connections
- ✅ Accessible globally
- ✅ Automatic backups
- ⚠️ Network latency (minimal with Neon)
- ⚠️ Cold start after auto-suspend (free tier)

## Conclusion

The migration to Neon PostgreSQL makes the application production-ready while maintaining the same functionality. The frontend requires no changes, and the backend improvements include better error handling, connection pooling, and industry-standard practices.
