CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER,
  name VARCHAR(255),
  type VARCHAR(100),
  price INTEGER,
  quantity INTEGER,
  date DATE,
  client VARCHAR(255),
  target VARCHAR(100),
  delivery BOOLEAN,
  return_policy VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS pilgrims (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  nationality VARCHAR(100),
  id_number VARCHAR(100),
  phone VARCHAR(50),
  package VARCHAR(100),
  hotel VARCHAR(100),
  hotel_cost INTEGER,
  bus VARCHAR(100),
  bus_cost INTEGER
); 