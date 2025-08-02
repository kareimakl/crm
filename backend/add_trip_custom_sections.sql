-- Add trip custom sections table
CREATE TABLE IF NOT EXISTS trip_custom_sections (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'dropdown', 'checkbox')),
    options JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample trip custom sections
INSERT INTO trip_custom_sections (label, type, options) VALUES
('نوع الباص', 'dropdown', '["صغير", "متوسط", "كبير", "VIP"]'),
('معدات إضافية', 'checkbox', '["مكيف", "واي فاي", "شاشة", "مقاعد مريحة", "حمام"]'),
('ملاحظات السائق', 'text', '[]'),
('مستوى الخدمة', 'dropdown', '["عادي", "مميز", "VIP", "خاص"]')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 'trip_custom_sections' as table_name, COUNT(*) as row_count FROM trip_custom_sections; 