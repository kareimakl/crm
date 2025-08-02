-- Insert sample trip custom sections with proper encoding
INSERT INTO trip_custom_sections (label, type, options) VALUES
('Bus Type', 'dropdown', '["Small", "Medium", "Large", "VIP"]'),
('Additional Equipment', 'checkbox', '["AC", "WiFi", "Screen", "Comfortable Seats", "Bathroom"]'),
('Driver Notes', 'text', '[]'),
('Service Level', 'dropdown', '["Normal", "Premium", "VIP", "Special"]')
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 'trip_custom_sections' as table_name, COUNT(*) as row_count FROM trip_custom_sections; 