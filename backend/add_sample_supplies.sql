-- Add sample supplies data
INSERT INTO supplies (name, type, quantity, price, supplier) VALUES
('Bus VIP', 'Bus', 5, 1200.00, 'Holy Transport Co'),
('Regular Bus', 'Bus', 10, 800.00, 'United Buses Co'),
('Five Star Hotel', 'Hotel', 8, 1500.00, 'Makkah Hotel'),
('Three Star Hotel', 'Hotel', 15, 800.00, 'Madinah Hotel'),
('Cotton Ihram', 'Umrah Items', 50, 50.00, 'Original Ihram Store'),
('Prayer Mat', 'Umrah Items', 30, 30.00, 'Umrah Supplies Co'),
('Economy Flight Ticket', 'Flight', 20, 2000.00, 'Saudi Airlines'),
('VIP Flight Ticket', 'Flight', 5, 5000.00, 'Emirates Airlines')
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 'supplies' as table_name, COUNT(*) as row_count FROM supplies; 