-- Complete database setup for CRM system
-- This script creates all necessary tables and adds required columns

-- Set encoding to UTF8
SET client_encoding = 'UTF8';

-- 1. Create supplies table
CREATE TABLE IF NOT EXISTS supplies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    supplier VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    date DATE NOT NULL,
    client VARCHAR(255),
    target VARCHAR(100),
    delivery BOOLEAN DEFAULT false,
    return_policy TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create trips table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    trip_type VARCHAR(100),
    supplier VARCHAR(255),
    trip_name VARCHAR(255) NOT NULL,
    trip_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    driver_name VARCHAR(255),
    assistant_driver VARCHAR(255),
    trip_number VARCHAR(100),
    bus_number VARCHAR(100)
);

-- 4. Create pilgrims table
CREATE TABLE IF NOT EXISTS pilgrims (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    passport_number VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    present BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create loyalty_clients table
CREATE TABLE IF NOT EXISTS loyalty_clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) DEFAULT 'bronze',
    points INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing
-- Sample supplies data
INSERT INTO supplies (name, type, quantity, price, supplier) VALUES
('Ihram', 'Umrah Items', 100, 50.00, 'Supplier 1'),
('Prayer Mat', 'Umrah Items', 50, 30.00, 'Supplier 1'),
('Miswak', 'Umrah Items', 200, 5.00, 'Supplier 2'),
('Umbrella', 'Umrah Items', 75, 25.00, 'Supplier 2'),
('Bag', 'Umrah Items', 60, 40.00, 'Supplier 1')
ON CONFLICT DO NOTHING;

-- Sample staff data
INSERT INTO staff (name, job, branch, salary, present) VALUES
('Ahmed Mohamed', 'Manager', 'Riyadh', 8000.00, true),
('Fatima Ali', 'Accountant', 'Jeddah', 6000.00, true),
('Mohamed Hassan', 'Sales Rep', 'Dammam', 5000.00, true),
('Sara Ahmed', 'Secretary', 'Riyadh', 4500.00, false)
ON CONFLICT DO NOTHING;

-- Sample loyalty clients data
INSERT INTO loyalty_clients (name, level, points, rating, avatar_url) VALUES
('Abdullah Khalid', 'gold', 1500, 4.8, 'https://via.placeholder.com/150'),
('Nora Saad', 'silver', 800, 4.5, 'https://via.placeholder.com/150'),
('Khalid Ahmed', 'bronze', 300, 4.2, 'https://via.placeholder.com/150'),
('Mariam Ali', 'gold', 2000, 4.9, 'https://via.placeholder.com/150')
ON CONFLICT DO NOTHING;

-- Sample trips data
INSERT INTO trips (trip_type, supplier, trip_name, trip_date, notes, driver_name, assistant_driver, trip_number, bus_number) VALUES
('bus', 'Holy Transport Co', 'Hajj Transport Trip', '2024-07-15', 'Transport 30 pilgrims from Riyadh to Makkah', 'Ahmed Ali', 'Sami Al-Harbi', 'TR001', 'BUS001'),
('hotel', 'Makkah Hotel', 'Umrah Stay', '2024-08-20', '5-day stay for 15 pilgrims', NULL, NULL, 'TR002', NULL)
ON CONFLICT DO NOTHING;

-- Sample tickets data
INSERT INTO tickets (trip_id, name, type, price, quantity, date, client, target, delivery, return_policy, phone) VALUES
(1, 'Bus Ticket - Ahmed Ali', 'Bus', 1200.00, 1, '2024-07-15', 'Ahmed Ali', 'Individual', true, 'Non-refundable', '+966500000001'),
(2, 'Hotel Ticket - Company Tourism', 'Hotel', 800.00, 1, '2024-08-20', 'Company Tourism', 'Company', false, 'Refundable within 24 hours', '+966500000002')
ON CONFLICT DO NOTHING;

-- Sample pilgrims data
INSERT INTO pilgrims (name, nationality, passport_number, phone, email) VALUES
('Ahmed Ali', 'Saudi', 'A1234567', '+966500000001', 'ahmed@example.com'),
('Fatima Hassan', 'Egyptian', 'E9876543', '+966500000002', 'fatima@example.com'),
('Mohamed Omar', 'Pakistani', 'P4567890', '+966500000003', 'mohamed@example.com')
ON CONFLICT DO NOTHING;

-- Verify all tables exist and have data
SELECT 'supplies' as table_name, COUNT(*) as row_count FROM supplies
UNION ALL
SELECT 'tickets' as table_name, COUNT(*) as row_count FROM tickets
UNION ALL
SELECT 'trips' as table_name, COUNT(*) as row_count FROM trips
UNION ALL
SELECT 'pilgrims' as table_name, COUNT(*) as row_count FROM pilgrims
UNION ALL
SELECT 'staff' as table_name, COUNT(*) as row_count FROM staff
UNION ALL
SELECT 'loyalty_clients' as table_name, COUNT(*) as row_count FROM loyalty_clients; 