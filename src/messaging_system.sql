-- Messaging System Tables for University of Bacon Platform

-- Messages table for secure communication
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('buyer_to_seller', 'anonymous_inquiry', 'help_desk')),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    filtered_content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'responded')),
    response TEXT,
    responded_at TIMESTAMPTZ,
    responded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Indexes for performance
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_recipient (recipient_id),
    INDEX idx_messages_listing (listing_id),
    INDEX idx_messages_status (status),
    INDEX idx_messages_type (message_type)
);

-- Charity fund tracking table
CREATE TABLE charity_fund (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE NOT NULL,
    unfilled_degrees INTEGER NOT NULL CHECK (unfilled_degrees > 0 AND unfilled_degrees <= 6),
    unclaimed_amount DECIMAL(10,2) NOT NULL CHECK (unclaimed_amount > 0),
    charity_allocation JSONB NOT NULL, -- JSON array of charity allocations
    allocated_at TIMESTAMPTZ DEFAULT now(),
    disbursed BOOLEAN DEFAULT false,
    disbursed_at TIMESTAMPTZ,
    notes TEXT,
    
    -- Ensure one entry per purchase
    UNIQUE(purchase_id),
    
    -- Indexes
    INDEX idx_charity_fund_listing (listing_id),
    INDEX idx_charity_fund_disbursed (disbursed),
    INDEX idx_charity_fund_allocated_at (allocated_at)
);

-- Content filter violations log
CREATE TABLE content_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    violation_type TEXT NOT NULL,
    original_content TEXT NOT NULL,
    filtered_content TEXT NOT NULL,
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    automatic_action TEXT CHECK (automatic_action IN ('warn', 'flag', 'suspend', 'ban')),
    manual_review_required BOOLEAN DEFAULT false,
    reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Indexes
    INDEX idx_violations_user (user_id),
    INDEX idx_violations_severity (severity),
    INDEX idx_violations_reviewed (reviewed),
    INDEX idx_violations_created_at (created_at)
);

-- Row Level Security (RLS) Policies

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages" ON messages
    FOR SELECT USING (
        sender_id = auth.uid() OR 
        recipient_id = auth.uid() OR
        message_type = 'help_desk'
    );

CREATE POLICY "Users can insert their own messages" ON messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admin can read all messages" ON messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Charity fund RLS
ALTER TABLE charity_fund ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage charity fund" ON charity_fund
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Users can view charity fund for their listings" ON charity_fund
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    );

-- Content violations RLS
ALTER TABLE content_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own violations" ON content_violations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all violations" ON content_violations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Functions for charity fund automation

CREATE OR REPLACE FUNCTION allocate_to_charity_fund()
RETURNS TRIGGER AS $$
DECLARE
    listing_record RECORD;
    chain_record RECORD;
    unfilled_count INTEGER;
    pool_amount DECIMAL(10,2);
    unclaimed_amount DECIMAL(10,2);
    charity_split JSONB;
BEGIN
    -- Get listing details
    SELECT * INTO listing_record FROM listings WHERE id = NEW.listing_id;
    
    -- Get referral chain info
    SELECT * INTO chain_record FROM referral_chains WHERE listing_id = NEW.listing_id;
    
    -- Calculate unfilled degrees
    IF chain_record.id IS NOT NULL THEN
        SELECT COUNT(*) INTO unfilled_count 
        FROM generate_series(1, listing_record.max_degrees) AS degree
        WHERE degree NOT IN (
            SELECT degree_position FROM chain_links WHERE chain_id = chain_record.id
        );
    ELSE
        unfilled_count := listing_record.max_degrees;
    END IF;
    
    -- Calculate unclaimed amount
    pool_amount := NEW.final_price * (listing_record.reward_percentage / 100.0);
    
    -- Calculate unclaimed portion based on unfilled degrees
    CASE unfilled_count
        WHEN 1 THEN unclaimed_amount := pool_amount * 0.20; -- 20% for 6th degree
        WHEN 2 THEN unclaimed_amount := pool_amount * 0.30; -- 20% + 10% for 5th/6th
        WHEN 3 THEN unclaimed_amount := pool_amount * 0.40; -- 20% + 10% + 10%
        WHEN 4 THEN unclaimed_amount := pool_amount * 0.50; -- 20% + 10% + 10% + 10%
        WHEN 5 THEN unclaimed_amount := pool_amount * 0.60; -- 20% + 10% + 10% + 10% + 10%
        WHEN 6 THEN unclaimed_amount := pool_amount * 1.00; -- All degrees unfilled
        ELSE unclaimed_amount := 0;
    END CASE;
    
    -- Create charity allocation (equal split between 3 main charities)
    charity_split := jsonb_build_array(
        jsonb_build_object('name', 'Student Emergency Fund', 'amount', unclaimed_amount * 0.40),
        jsonb_build_object('name', 'Textbook Assistance Program', 'amount', unclaimed_amount * 0.35),
        jsonb_build_object('name', 'Digital Access Initiative', 'amount', unclaimed_amount * 0.25)
    );
    
    -- Insert charity fund record if there's unclaimed amount
    IF unclaimed_amount > 0 THEN
        INSERT INTO charity_fund (
            listing_id, 
            purchase_id, 
            unfilled_degrees, 
            unclaimed_amount, 
            charity_allocation,
            notes
        ) VALUES (
            NEW.listing_id,
            NEW.id,
            unfilled_count,
            unclaimed_amount,
            charity_split,
            format('Auto-allocated from sale of "%s" - %s unfilled degrees', 
                   listing_record.item_title, unfilled_count)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically allocate to charity fund when purchase completes
CREATE TRIGGER trigger_allocate_charity_fund
    AFTER INSERT ON purchases
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION allocate_to_charity_fund();

-- Function to get charity fund statistics
CREATE OR REPLACE FUNCTION get_charity_fund_stats()
RETURNS TABLE (
    total_amount DECIMAL(10,2),
    total_listings INTEGER,
    disbursed_amount DECIMAL(10,2),
    pending_amount DECIMAL(10,2),
    charity_breakdown JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(unclaimed_amount), 0) as total_amount,
        COUNT(*)::INTEGER as total_listings,
        COALESCE(SUM(CASE WHEN disbursed THEN unclaimed_amount ELSE 0 END), 0) as disbursed_amount,
        COALESCE(SUM(CASE WHEN NOT disbursed THEN unclaimed_amount ELSE 0 END), 0) as pending_amount,
        COALESCE(
            jsonb_object_agg(
                charity_name, 
                charity_total
            ), 
            '{}'::jsonb
        ) as charity_breakdown
    FROM charity_fund cf
    CROSS JOIN LATERAL (
        SELECT 
            elem->>'name' as charity_name,
            SUM((elem->>'amount')::DECIMAL) as charity_total
        FROM jsonb_array_elements(cf.charity_allocation) as elem
        GROUP BY elem->>'name'
    ) charity_totals;
END;
$$ LANGUAGE plpgsql;