-- Add department field to listings table
ALTER TABLE listings ADD COLUMN department varchar(100);

-- Update existing listings with departments based on their titles
UPDATE listings SET department = 'Technology' WHERE item_title ILIKE '%macbook%' OR item_title ILIKE '%gaming%' OR item_title ILIKE '%pc%';
UPDATE listings SET department = 'Academic' WHERE item_title ILIKE '%textbook%' OR item_title ILIKE '%calculus%' OR item_title ILIKE '%book%';
UPDATE listings SET department = 'Furniture' WHERE item_title ILIKE '%furniture%' OR item_title ILIKE '%desk%' OR item_title ILIKE '%chair%';
UPDATE listings SET department = 'General' WHERE department IS NULL;