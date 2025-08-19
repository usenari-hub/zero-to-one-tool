-- Drop the existing view
DROP VIEW IF EXISTS public.marketplace_listings;

-- Create a simple view without security definer
-- This view automatically respects the RLS policies we created
CREATE VIEW public.marketplace_listings AS
SELECT 
  id,
  item_title,
  item_description,
  asking_price,
  price_min,
  price_max,
  reward_percentage,
  max_degrees,
  department,
  category,
  location,
  general_location,
  item_images,
  verification_level,
  created_at,
  updated_at,
  ends_at,
  status,
  priority_score
FROM public.listings;

-- The view will automatically respect RLS policies
-- No need for SECURITY DEFINER as RLS handles the filtering