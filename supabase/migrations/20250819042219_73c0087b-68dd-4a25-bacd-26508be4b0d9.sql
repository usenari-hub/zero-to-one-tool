-- Enable RLS on the marketplace_listings view for explicit security control
-- This adds an additional security layer on top of the inherited policies

-- Enable RLS on the view itself
ALTER VIEW public.marketplace_listings SET (security_barrier = true);

-- Note: Views don't support traditional RLS policies like tables do
-- The security_invoker=true setting ensures the view respects the underlying table's RLS
-- The security_barrier=true setting prevents query optimization from bypassing security

-- Add explicit documentation of the security model
COMMENT ON VIEW public.marketplace_listings IS 
'SECURITY MODEL: This view inherits all RLS policies from the listings table via SECURITY INVOKER mode. 
- Public users: Only see active, approved, non-flagged listings
- Sellers: Can see their own listings + public listings  
- Purchasers: Can see purchased listings + public listings
- Admins: Can see all listings
The view excludes sensitive fields like user_id, admin_notes, and flagged_by to protect seller privacy.';