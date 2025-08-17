-- Add image support and simplify pricing structure for listings
ALTER TABLE listings ADD COLUMN item_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE listings ADD COLUMN asking_price numeric;

-- Update existing listings to use asking_price (use price_max if available, otherwise price_min)
UPDATE listings 
SET asking_price = COALESCE(price_max, price_min)
WHERE asking_price IS NULL;

-- Set max_degrees to 6 for all listings since class size is standardized
UPDATE listings SET max_degrees = 6;