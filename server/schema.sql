-- Run this in Railway Query Tool

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  business_name TEXT,
  phone TEXT UNIQUE,
  status TEXT DEFAULT 'New Lead',
  city TEXT,
  rating DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calls (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  vapi_call_id TEXT,
  transcript TEXT,
  outcome TEXT,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
