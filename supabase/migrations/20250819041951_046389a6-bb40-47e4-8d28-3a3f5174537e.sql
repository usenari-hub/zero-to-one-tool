-- Enable RLS on the marketplace_listings view for extra security
-- Even though it's a SECURITY INVOKER view that inherits policies from listings,
-- this adds an explicit security layer

ALTER VIEW public.marketplace_listings SET (security_barrier = true);

-- Add a comment explaining the security model
COMMENT ON VIEW public.marketplace_listings IS 
'Secure view of approved marketplace listings. Inherits RLS policies from listings table. Only shows active, approved, non-flagged listings to public users.';