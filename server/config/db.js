/**
 * @file config/db.js
 * @description PostgreSQL connection pool configuration.
 *
 * Creates a single Pool instance shared across the application.
 * The pool automatically manages client checkout / release and
 * handles reconnection on transient failures.
 *
 * Exports:
 *  - pool            — the pg Pool instance for queries & transactions
 *  - testConnection  — one-shot health check used at server startup
 */

const { Pool } = require('pg');

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Enable SSL for external cloud databases (Render, Neon, Supabase) in production
if (process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

// Log unexpected errors on idle clients so they don't crash the process
pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err);
});

/**
 * Verify the database is reachable by running a trivial query.
 * Call this once at server startup; if it throws, abort the boot.
 * @returns {Promise<void>}
 */
const testConnection = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS zone VARCHAR(100),
      ADD COLUMN IF NOT EXISTS notifications VARCHAR(1000),
      ADD COLUMN IF NOT EXISTS session_expiry VARCHAR(50),
      ADD COLUMN IF NOT EXISTS avatar TEXT;

      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        participant1_id INT,
        participant2_id INT,
        participant1_name VARCHAR(255),
        participant2_name VARCHAR(255),
        participant1_role VARCHAR(100),
        participant2_role VARCHAR(100),
        participant1_avatar TEXT,
        participant2_avatar TEXT,
        last_message TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INT,
        sender_name VARCHAR(255),
        sender_role VARCHAR(100),
        text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DB] Connected successfully at', result.rows[0].now);
  } finally {
    client.release();
  }
};

module.exports = { pool, testConnection };
