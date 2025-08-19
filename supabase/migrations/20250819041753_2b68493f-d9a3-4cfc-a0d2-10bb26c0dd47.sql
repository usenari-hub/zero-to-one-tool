-- Fix security definer view issue by recreating the view with explicit SECURITY INVOKER
-- This ensures the view respects the RLS policies of the querying user

-- Drop the existing view
DROP VIEW IF EXISTS public.marketplace_listings;

-- Create the view with explicit SECURITY INVOKER (default behavior)
-- This ensures the view respects the RLS policies of the querying user
CREATE VIEW public.marketplace_listings 
WITH (security_invoker = true) AS
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

-- Grant appropriate permissions
GRANT SELECT ON public.marketplace_listings TO public, authenticated;