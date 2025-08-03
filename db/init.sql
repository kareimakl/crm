CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO items (name, description) VALUES
  ('Item 1', 'Description for item 1'),
  ('Item 2', 'Description for item 2'),
  ('Item 3', 'Description for item 3')
ON CONFLICT DO NOTHING;

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  trip_type VARCHAR(50),
  supplier VARCHAR(100),
  trip_name VARCHAR(100),
  trip_date DATE,
  notes TEXT,
  created_at TIMESTAMP,
  driver_name VARCHAR(100),
  assistant_driver VARCHAR(100),
  trip_number VARCHAR(50),
  bus_number VARCHAR(50)
);

INSERT INTO trips (trip_type, supplier, trip_name, trip_date, notes, created_at, driver_name, assistant_driver, trip_number, bus_number) VALUES
  ('bus', 'Bus Supplier', 'Pilgrims Bus Trip', '2024-07-15', 'Transfer group from Riyadh to Mecca', '2024-06-01T10:00:00Z', 'Driver 1', 'Assistant 1', '100', '3119'),
  ('hotel', 'Mecca Hotel', 'Umrah Stay', '2024-08-20', '5 days stay for 15 pilgrims', '2024-06-02T14:30:00Z', 'Driver 2', 'Assistant 2', '101', '3120')
ON CONFLICT DO NOTHING;

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(100),
  type VARCHAR(50),
  price NUMERIC,
  quantity INTEGER,
  date DATE,
  client VARCHAR(100),
  target VARCHAR(50),
  delivery BOOLEAN,
  return_policy VARCHAR(100)
);

INSERT INTO tickets (trip_id, name, type, price, quantity, date, client, target, delivery, return_policy) VALUES
  (1, 'Jeddah-Riyadh Flight Ticket', 'Flight', 1200, 10, '2024-07-01', 'Ahmed Ali', 'Individuals', true, 'Non-refundable'),
  (2, '5-Star Hotel Ticket', 'Hotel', 800, 5, '2024-07-10', 'Tourism Company', 'Companies', false, 'Refundable within 24 hours')
ON CONFLICT DO NOTHING;

-- Supplies table
CREATE TABLE IF NOT EXISTS supplies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(50),
  price NUMERIC,
  quantity INTEGER,
  date DATE,
  supplier VARCHAR(100),
  notes TEXT
);

INSERT INTO supplies (name, type, price, quantity, date, supplier, notes) VALUES
  ('Cotton Ihram', 'Umrah Supplies', 50, 100, '2024-06-01', 'Supplier 1', 'Note 1'),
  ('Umbrella', 'Umrah Supplies', 20, 200, '2024-06-02', 'Supplier 2', 'Note 2')
ON CONFLICT DO NOTHING;

-- Pilgrims table
CREATE TABLE IF NOT EXISTS pilgrims (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  nationality VARCHAR(50),
  id_number VARCHAR(50),
  phone VARCHAR(20),
  package VARCHAR(100),
  hotel VARCHAR(100),
  hotel_cost NUMERIC,
  bus VARCHAR(100),
  bus_cost NUMERIC
);

INSERT INTO pilgrims (name, nationality, id_number, phone, package, hotel, hotel_cost, bus, bus_cost) VALUES
  ('Mohamed Ahmed', 'Saudi', '1234567890', '0501234567', 'Economy Package', 'Mecca Hotel', 2000, 'Bus 1', 500),
  ('Sara Ali', 'Egyptian', '9876543210', '0509876543', 'Luxury Package', 'Medina Hotel', 3000, 'Bus 2', 700)
ON CONFLICT DO NOTHING; 


-- invoices 
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  client VARCHAR(100),
  total_price NUMERIC DEFAULT 0,
  notes TEXT
);

ALTER TABLE tickets
ADD COLUMN invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL;

ALTER TABLE supplies
ADD COLUMN invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL;
