-- Create user_verifications table
CREATE TABLE public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  identity_verified BOOLEAN DEFAULT false,
  phone_number TEXT,
  verification_code TEXT,
  code_expires_at TIMESTAMPTZ,
  verification_attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_verification_session_id TEXT,
  verification_status TEXT DEFAULT 'pending',
  verification_data JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own verification status" 
ON public.user_verifications 
FOR SELECT 
USING (auth.uid() = user_id OR is_kevin_admin());

CREATE POLICY "Users can update their own verification" 
ON public.user_verifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert verification records" 
ON public.user_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_verifications_updated_at
BEFORE UPDATE ON public.user_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the user_can_share function
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

-- Function to handle new user verification record
CREATE OR REPLACE FUNCTION public.handle_new_user_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_verifications (user_id, email_verified)
  VALUES (NEW.id, NEW.email_confirmed_at IS NOT NULL);
  RETURN NEW;
END;
$$;

-- Trigger to create verification record when user signs up
CREATE TRIGGER on_auth_user_created_verification
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_verification();