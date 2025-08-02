-- Fix missing tables and columns for CRM backend
-- Run this script to resolve all database schema errors

-- 1. Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    present BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create loyalty_clients table
CREATE TABLE IF NOT EXISTS loyalty_clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) DEFAULT 'برونزي',
    points INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add missing columns to tickets table
-- Check if phone column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'phone') THEN
        ALTER TABLE tickets ADD COLUMN phone VARCHAR(20);
    END IF;
END $$;

-- Check if created_at column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'created_at') THEN
        ALTER TABLE tickets ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 4. Add missing columns to pilgrims table
-- Check if created_at column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pilgrims' AND column_name = 'created_at') THEN
        ALTER TABLE pilgrims ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 5. Insert some sample data for testing
-- Sample staff data
INSERT INTO staff (name, job, branch, salary, present) VALUES
('أحمد محمد', 'مدير', 'الرياض', 8000.00, true),
('فاطمة علي', 'محاسبة', 'جدة', 6000.00, true),
('محمد حسن', 'مندوب مبيعات', 'الدمام', 5000.00, true),
('سارة أحمد', 'سكرتيرة', 'الرياض', 4500.00, false)
ON CONFLICT DO NOTHING;

-- Sample loyalty clients data
INSERT INTO loyalty_clients (name, level, points, rating, avatar_url) VALUES
('عبدالله خالد', 'ذهبي', 1500, 4.8, 'https://via.placeholder.com/150'),
('نورا سعد', 'فضي', 800, 4.5, 'https://via.placeholder.com/150'),
('خالد أحمد', 'برونزي', 300, 4.2, 'https://via.placeholder.com/150'),
('مريم علي', 'ذهبي', 2000, 4.9, 'https://via.placeholder.com/150')
ON CONFLICT DO NOTHING;

-- Update existing tickets with phone numbers if they don't have them
UPDATE tickets SET phone = '+966500000000' WHERE phone IS NULL;

-- Update existing tickets with created_at if they don't have it
UPDATE tickets SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

-- Update existing pilgrims with created_at if they don't have it
UPDATE pilgrims SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

-- Verify tables exist
SELECT 'staff' as table_name, COUNT(*) as row_count FROM staff
UNION ALL
SELECT 'loyalty_clients' as table_name, COUNT(*) as row_count FROM loyalty_clients
UNION ALL
SELECT 'tickets' as table_name, COUNT(*) as row_count FROM tickets
UNION ALL
SELECT 'pilgrims' as table_name, COUNT(*) as row_count FROM pilgrims; 