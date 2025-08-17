-- Create referral chains table
CREATE TABLE IF NOT EXISTS public.referral_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    chain_code VARCHAR(20) UNIQUE NOT NULL,
    max_degrees INTEGER DEFAULT 6,
    degree_distribution JSONB,
    total_bacon_pool DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    current_degree_count INTEGER DEFAULT 0,
    purchase_completed BOOLEAN DEFAULT FALSE,
    seller_revealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create chain links table
CREATE TABLE IF NOT EXISTS public.chain_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_id UUID REFERENCES public.referral_chains(id) NOT NULL,
    referrer_id UUID REFERENCES auth.users(id) NOT NULL,
    degree_position INTEGER NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    contact_hash VARCHAR(255),
    contact_lock_expires TIMESTAMP WITH TIME ZONE,
    bacon_percentage DECIMAL(5,2),
    bacon_amount DECIMAL(10,2) DEFAULT 0.00,
    bacon_paid BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chain_id, degree_position)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    buyer_id UUID REFERENCES auth.users(id) NOT NULL,
    seller_id UUID REFERENCES auth.users(id) NOT NULL,
    chain_id UUID REFERENCES public.referral_chains(id),
    final_price DECIMAL(10,2) NOT NULL,
    escrow_fee DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'intent_expressed',
    payment_method VARCHAR(50),
    payment_processor VARCHAR(50),
    escrow_transaction_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    delivery_method VARCHAR(50),
    delivery_address JSONB,
    tracking_info JSONB,
    total_bacon_distributed DECIMAL(10,2) DEFAULT 0.00,
    platform_fee DECIMAL(10,2),
    seller_payout DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    escrow_confirmed_at TIMESTAMP WITH TIME ZONE,
    seller_revealed_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create share events table
CREATE TABLE IF NOT EXISTS public.share_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_link_id UUID REFERENCES public.chain_links(id) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    share_url TEXT,
    custom_message TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    utm_parameters JSONB,
    click_count INTEGER DEFAULT 0,
    signup_conversions INTEGER DEFAULT 0,
    purchase_conversions INTEGER DEFAULT 0,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create click events table
CREATE TABLE IF NOT EXISTS public.click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_event_id UUID REFERENCES public.share_events(id),
    chain_code VARCHAR(20),
    referral_code VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    converted_to_signup BOOLEAN DEFAULT FALSE,
    converted_to_purchase BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bacon transactions table
CREATE TABLE IF NOT EXISTS public.bacon_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    running_balance DECIMAL(10,2) NOT NULL,
    source_type VARCHAR(30),
    source_id UUID,
    chain_id UUID REFERENCES public.referral_chains(id),
    purchase_id UUID REFERENCES public.purchases(id),
    payout_method VARCHAR(30),
    payout_reference VARCHAR(100),
    payout_status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create contact locks table
CREATE TABLE IF NOT EXISTS public.contact_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    contact_hash VARCHAR(255) NOT NULL,
    chain_id UUID REFERENCES public.referral_chains(id) NOT NULL,
    lock_type VARCHAR(20) DEFAULT 'referral',
    locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
    lock_strength INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(listing_id, contact_hash)
);

-- Create fraud alerts table
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    risk_score DECIMAL(5,2),
    detection_method VARCHAR(50),
    suspicious_activity JSONB,
    evidence JSONB,
    status VARCHAR(20) DEFAULT 'open',
    assigned_to VARCHAR(100),
    resolution_notes TEXT,
    related_listing_id UUID REFERENCES public.listings(id),
    related_purchase_id UUID REFERENCES public.purchases(id),
    related_chain_id UUID REFERENCES public.referral_chains(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    investigated_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.referral_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chain_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bacon_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view chains for their listings or referrals" ON public.referral_chains
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.chain_links cl WHERE cl.chain_id = id AND cl.referrer_id = auth.uid())
    );

CREATE POLICY "Users can view their own chain links" ON public.chain_links
    FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "Users can view their purchases" ON public.purchases
    FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can view their bacon transactions" ON public.bacon_transactions
    FOR SELECT USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_chains_listing_id ON public.referral_chains(listing_id);
CREATE INDEX IF NOT EXISTS idx_referral_chains_chain_code ON public.referral_chains(chain_code);
CREATE INDEX IF NOT EXISTS idx_chain_links_chain_id ON public.chain_links(chain_id);
CREATE INDEX IF NOT EXISTS idx_chain_links_referral_code ON public.chain_links(referral_code);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON public.purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_seller_id ON public.purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_bacon_transactions_user_id ON public.bacon_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_locks_listing_contact ON public.contact_locks(listing_id, contact_hash);
CREATE INDEX IF NOT EXISTS idx_share_events_chain_link_id ON public.share_events(chain_link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_chain_code ON public.click_events(chain_code);