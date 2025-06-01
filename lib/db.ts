import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection and create tables if they don't exist
async function initializeDatabase() {
  try {
    // Test connection
    const client = await pool.connect();
    console.log('Database connection successful');

    // Create cities table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS cities_name_idx ON cities (LOWER(name));
    `);
    console.log('Cities table verified/created');

    client.release();
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

// Initialize database on startup
initializeDatabase().catch(console.error);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool; 