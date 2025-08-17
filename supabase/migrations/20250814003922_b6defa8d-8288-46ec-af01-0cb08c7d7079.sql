-- Create payment_methods table for storing user payment information
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  payment_type VARCHAR(50) NOT NULL, -- 'bank_account', 'paypal', 'venmo', 'crypto', 'gift_card'
  account_name VARCHAR(255) NOT NULL,
  account_details VARCHAR(255) NOT NULL, -- masked/encrypted account info
  is_verified BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  verification_data JSONB DEFAULT '{}',
  fees JSONB DEFAULT '{"percentage": 0, "fixed": 0, "minimum": 0}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for payment methods
CREATE POLICY "Users can view their own payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (user_id = auth.uid());

-- Create share_link_performance table for tracking enhanced share metrics
CREATE TABLE public.share_link_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_link_id UUID NOT NULL,
  user_id UUID NOT NULL,
  platform VARCHAR(50) NOT NULL,
  content_hash VARCHAR(255),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_value DECIMAL(10,2) DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,
  performance_rating VARCHAR(20) DEFAULT 'average',
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS  
ALTER TABLE public.share_link_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for share link performance
CREATE POLICY "Users can view their own share performance" 
ON public.share_link_performance 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own share performance records" 
ON public.share_link_performance 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own share performance" 
ON public.share_link_performance 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create verification_requests table for account verification
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verification_type VARCHAR(50) NOT NULL, -- 'email', 'phone', 'identity', 'academic', 'address'
  verification_level VARCHAR(50) DEFAULT 'basic', -- 'basic', 'standard', 'premium', 'academic'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
  documents JSONB DEFAULT '[]',
  verification_data JSONB DEFAULT '{}',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for verification requests
CREATE POLICY "Users can view their own verification requests" 
ON public.verification_requests 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own verification requests" 
ON public.verification_requests 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own verification requests" 
ON public.verification_requests 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add some sample bacon transactions for testing
INSERT INTO public.bacon_transactions (user_id, transaction_type, amount, running_balance, description, payout_status) 
SELECT 
  auth.uid(),
  'earned',
  125.00,
  125.00,
  'MacBook Pro Referral - Degree 3',
  'completed'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.bacon_transactions (user_id, transaction_type, amount, running_balance, description, payout_status) 
SELECT 
  auth.uid(),
  'earned',
  75.50,
  200.50,
  'iPhone 15 Referral - Degree 2',
  'pending'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.bacon_transactions (user_id, transaction_type, amount, running_balance, description, payout_status) 
SELECT 
  auth.uid(),
  'bonus',
  50.00,
  250.50,
  'First 10 Referrals Milestone',
  'completed'
WHERE auth.uid() IS NOT NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_payment_methods()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment_methods
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_payment_methods();

-- Create trigger for verification_requests  
CREATE TRIGGER update_verification_requests_updated_at
    BEFORE UPDATE ON public.verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();