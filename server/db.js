// PostgreSQL connection pool
// Uses DATABASE_URL from .env or defaults to localhost
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/sdde',
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

// Test connection on startup
try {
  const result = await pool.query('SELECT 1');
  console.log('✅ Connected to PostgreSQL');
} catch (err) {
  console.error('❌ Failed to connect to PostgreSQL:', err.message);
  process.exit(1);
}

export default pool;
