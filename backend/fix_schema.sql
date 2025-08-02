-- Add missing columns to tickets
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Add missing columns to pilgrims
ALTER TABLE pilgrims ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Create staff table if not exists
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  job VARCHAR(100),
  branch VARCHAR(100),
  salary INTEGER,
  present BOOLEAN DEFAULT false
);

-- Create loyalty_clients table if not exists
CREATE TABLE IF NOT EXISTS loyalty_clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  points INTEGER DEFAULT 0,
  level VARCHAR(50),
  bookings INTEGER DEFAULT 0,
  rating FLOAT DEFAULT 0,
  referrals INTEGER DEFAULT 0,
  avatar_url VARCHAR(255),
  last_usage_month INTEGER
); 