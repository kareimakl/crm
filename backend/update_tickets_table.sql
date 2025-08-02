-- Add supply-related columns to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS supply_id INTEGER REFERENCES supplies(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS service_type VARCHAR(100);

-- Verify the columns were added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'tickets' AND column_name IN ('supply_id', 'service_type'); 