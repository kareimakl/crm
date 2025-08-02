-- Create all missing tables for the CRM system

-- 1. Create custom_sections table for tickets
CREATE TABLE IF NOT EXISTS custom_sections (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'dropdown', 'checkbox')),
    options JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create nationalities table
CREATE TABLE IF NOT EXISTS nationalities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create channels table
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create representatives table
CREATE TABLE IF NOT EXISTS representatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create trip_custom_sections table
CREATE TABLE IF NOT EXISTS trip_custom_sections (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'dropdown', 'checkbox')),
    options JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for custom_sections
INSERT INTO custom_sections (label, type, options) VALUES
('نوع الخدمة', 'dropdown', '["VIP", "عادي", "مميز"]'),
('ملاحظات خاصة', 'text', '[]'),
('مستلزمات إضافية', 'checkbox', '["مكيف", "واي فاي", "وجبة", "ماء"]')
ON CONFLICT DO NOTHING;

-- Insert sample data for nationalities
INSERT INTO nationalities (name) VALUES
('سعودي'),
('مصري'),
('باكستاني'),
('هندي'),
('بنغلاديشي'),
('إندونيسي'),
('ماليزي'),
('تركي'),
('أفغاني'),
('سوري')
ON CONFLICT DO NOTHING;

-- Insert sample data for channels
INSERT INTO channels (name) VALUES
('الموقع الإلكتروني'),
('فيسبوك'),
('إنستغرام'),
('واتساب'),
('الهاتف'),
('المركز الرئيسي'),
('المندوب المباشر'),
('الإحالة')
ON CONFLICT DO NOTHING;

-- Insert sample data for representatives
INSERT INTO representatives (name) VALUES
('أحمد محمد'),
('فاطمة علي'),
('محمد حسن'),
('سارة أحمد'),
('عبدالله خالد'),
('نورا سعد'),
('خالد أحمد'),
('مريم علي')
ON CONFLICT DO NOTHING;

-- Insert sample data for trip_custom_sections
INSERT INTO trip_custom_sections (label, type, options) VALUES
('Bus Type', 'dropdown', '["Small", "Medium", "Large", "VIP"]'),
('Additional Equipment', 'checkbox', '["AC", "WiFi", "Screen", "Comfortable Seats", "Bathroom"]'),
('Driver Notes', 'text', '[]'),
('Service Level', 'dropdown', '["Normal", "Premium", "VIP", "Special"]')
ON CONFLICT DO NOTHING;

-- Verify all tables were created
SELECT 'custom_sections' as table_name, COUNT(*) as row_count FROM custom_sections
UNION ALL
SELECT 'nationalities' as table_name, COUNT(*) as row_count FROM nationalities
UNION ALL
SELECT 'channels' as table_name, COUNT(*) as row_count FROM channels
UNION ALL
SELECT 'representatives' as table_name, COUNT(*) as row_count FROM representatives
UNION ALL
SELECT 'trip_custom_sections' as table_name, COUNT(*) as row_count FROM trip_custom_sections; 