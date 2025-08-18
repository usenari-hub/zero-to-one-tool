-- Add Stripe verification fields to user_verifications table
ALTER TABLE public.user_verifications 
ADD COLUMN IF NOT EXISTS stripe_verification_session_id TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_data JSONB DEFAULT '{}'::jsonb;

-- Update the user_can_share function to require either phone OR identity verification
CREATE OR REPLACE FUNCTION public.user_can_share() 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_verifications 
    WHERE user_id = auth.uid() 
    AND email_verified = true 
    AND (phone_verified = true OR identity_verified = true)
  );
END;
$$;