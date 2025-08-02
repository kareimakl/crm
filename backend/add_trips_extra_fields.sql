-- Add extra_fields column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS extra_fields JSONB DEFAULT '{}';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'trips' AND column_name = 'extra_fields'; 