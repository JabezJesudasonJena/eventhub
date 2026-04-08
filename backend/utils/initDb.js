const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('✓ Database schema created successfully');
        console.log('✓ Seed data inserted');
        console.log('\nDefault Accounts:');
        console.log('  Admin: admin@eventify.com / Admin@123');
        console.log('  User:  user@eventify.com / User@123');
        
        process.exit(0);
    } catch (err) {
        console.error('✗ Error initializing database:', err.message);
        process.exit(1);
    }
}

initializeDatabase();
