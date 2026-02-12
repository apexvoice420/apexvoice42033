const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDB = async () => {
    try {
        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connected');

        // Create tables
        await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(255),
        website VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(2),
        zip_code VARCHAR(10),
        niche VARCHAR(100),
        rating DECIMAL(2,1),
        review_count INTEGER,
        status VARCHAR(50) DEFAULT 'New Lead',
        source VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_called_at TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS calls (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
        vapi_call_id VARCHAR(255),
        phone_number VARCHAR(20),
        duration INTEGER,
        status VARCHAR(50),
        outcome VARCHAR(50),
        transcript TEXT,
        sentiment VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        total_leads INTEGER DEFAULT 0,
        called INTEGER DEFAULT 0,
        answered INTEGER DEFAULT 0,
        voicemail INTEGER DEFAULT 0,
        no_answer INTEGER DEFAULT 0,
        interested INTEGER DEFAULT 0,
        not_interested INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        started_at TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS campaign_leads (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
        lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        called_at TIMESTAMP,
        outcome VARCHAR(50)
      )
    `);

        // Indexes
        await pool.query('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city, state)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_calls_lead_id ON calls(lead_id)');

        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

module.exports = { pool, initDB };
