-- Add custom_sections table for persistent custom form sections
CREATE TABLE IF NOT EXISTS custom_sections (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'dropdown', 'checkbox')),
    options JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample custom sections
INSERT INTO custom_sections (label, type, options) VALUES
('نوع الغرفة', 'dropdown', '["مفردة", "مزدوجة", "عائلية", "جناح"]'),
('خدمات إضافية', 'checkbox', '["واي فاي", "مطعم", "مسبح", "جيم", "موقف سيارات"]'),
('ملاحظات خاصة', 'text', '[]'),
('مستوى الخدمة', 'dropdown', '["اقتصادي", "عادي", "فاخر", "VIP"]')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 'custom_sections' as table_name, COUNT(*) as row_count FROM custom_sections; 