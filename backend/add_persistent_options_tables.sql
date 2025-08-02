-- Add tables for persistent options (nationality, channel, representative)

-- Nationalities table
CREATE TABLE IF NOT EXISTS nationalities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Representatives table
CREATE TABLE IF NOT EXISTS representatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO nationalities (name) VALUES
('سعودي'),
('مصري'),
('باكستاني'),
('هندي'),
('أخرى')
ON CONFLICT (name) DO NOTHING;

INSERT INTO channels (name) VALUES
('إحالة'),
('إنستجرام'),
('واتساب'),
('مباشر'),
('أخرى')
ON CONFLICT (name) DO NOTHING;

INSERT INTO representatives (name) VALUES
('أحمد محمد'),
('سارة علي'),
('خالد يوسف')
ON CONFLICT (name) DO NOTHING;

-- Verify tables were created
SELECT 'nationalities' as table_name, COUNT(*) as row_count FROM nationalities
UNION ALL
SELECT 'channels' as table_name, COUNT(*) as row_count FROM channels
UNION ALL
SELECT 'representatives' as table_name, COUNT(*) as row_count FROM representatives; 