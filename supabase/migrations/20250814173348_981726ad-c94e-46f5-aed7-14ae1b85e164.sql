-- Create escrow_transactions table for secure payments
CREATE TABLE public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  escrow_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  referral_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  seller_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'created',
  stripe_payment_intent_id VARCHAR(255),
  paypal_order_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  funded_at TIMESTAMP WITH TIME ZONE,
  seller_revealed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their escrow transactions" 
ON public.escrow_transactions 
FOR SELECT 
USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers can create escrow transactions" 
ON public.escrow_transactions 
FOR INSERT 
WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "System can update escrow transactions" 
ON public.escrow_transactions 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_escrow_transactions_updated_at
BEFORE UPDATE ON public.escrow_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update payment_methods table to include real payment service fields
ALTER TABLE public.payment_methods 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS fees JSONB DEFAULT '{"percentage": 0, "fixed": 0, "minimum": 0}';

-- Create listing_fees table to track upfront listing payments
CREATE TABLE public.listing_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'stripe',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  stripe_session_id VARCHAR(255),
  paypal_order_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listing_fees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their listing fees" 
ON public.listing_fees 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create listing fees" 
ON public.listing_fees 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update listing fees" 
ON public.listing_fees 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_listing_fees_updated_at
BEFORE UPDATE ON public.listing_fees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();