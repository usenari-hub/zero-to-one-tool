-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON public.listings;

-- Create a secure RLS policy for public listing views
-- Public can only see basic, non-sensitive listing information for active/approved listings
CREATE POLICY "Public can view approved listings basic info" 
ON public.listings 
FOR SELECT 
TO public
USING (
  status = 'active' 
  AND admin_status = 'approved' 
  AND flagged_at IS NULL
);

-- Create a policy for sellers to view their own listings fully
CREATE POLICY "Sellers can view their own listings" 
ON public.listings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create a policy for purchasers to view full listing details after purchase
CREATE POLICY "Purchasers can view listings they bought" 
ON public.listings 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM purchases 
    WHERE purchases.listing_id = listings.id 
    AND purchases.buyer_id = auth.uid()
    AND purchases.status = 'completed'
  )
);

-- Admin policy for Kevin admin to view all listings
CREATE POLICY "Kevin admin can view all listings" 
ON public.listings 
FOR SELECT 
TO authenticated
USING (is_kevin_admin());

-- Create a secure view for public marketplace that excludes sensitive data
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
FROM public.listings
WHERE status = 'active' 
AND admin_status = 'approved' 
AND flagged_at IS NULL;

-- Grant access to the marketplace view
GRANT SELECT ON public.marketplace_listings TO public, authenticated;