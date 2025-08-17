-- Enhanced Messaging System with Public Chat Boards and Direct Messaging
-- Replaces the existing messaging system with improved functionality

-- Drop existing messaging tables if they exist
DROP TABLE IF EXISTS content_violations CASCADE;
DROP TABLE IF EXISTS charity_fund CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

-- Public chat messages for each listing (Q&A style)
CREATE TABLE listing_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('question', 'answer')),
    content TEXT NOT NULL,
    filtered_content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'hidden')),
    flagged_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Indexes for performance
    INDEX idx_chat_listing (listing_id),
    INDEX idx_chat_sender (sender_id),
    INDEX idx_chat_status (status),
    INDEX idx_chat_created (created_at)
);

-- Direct messages between buyer and seller (post-purchase only)
CREATE TABLE direct_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ,
    
    -- Ensure direct messaging is only between verified buyer/seller pairs
    CONSTRAINT check_purchase_exists CHECK (
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.listing_id = direct_messages.listing_id 
            AND p.buyer_id = CASE 
                WHEN sender_id != (SELECT user_id FROM listings WHERE id = listing_id) 
                THEN sender_id 
                ELSE recipient_id 
            END
            AND p.status = 'completed'
        )
    ),
    
    -- Indexes
    INDEX idx_direct_listing (listing_id),
    INDEX idx_direct_sender (sender_id),
    INDEX idx_direct_recipient (recipient_id),
    INDEX idx_direct_created (created_at)
);

-- User reports for violations and abuse
CREATE TABLE user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    message_id UUID, -- Can reference either chat or direct message
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN (
        'contact_sharing', 'circumvention', 'inappropriate_content', 
        'spam', 'scam_attempt', 'harassment', 'fake_listing', 
        'price_manipulation', 'other'
    )),
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id),
    
    -- Prevent duplicate reports
    UNIQUE(reporter_id, message_id),
    
    -- Indexes
    INDEX idx_reports_reporter (reporter_id),
    INDEX idx_reports_reported (reported_user_id),
    INDEX idx_reports_status (status),
    INDEX idx_reports_severity (severity),
    INDEX idx_reports_created (created_at)
);

-- Content violations log (auto-flagged content)
CREATE TABLE content_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    message_id UUID, -- Can reference either table
    message_type TEXT CHECK (message_type IN ('chat', 'direct')),
    violation_patterns TEXT[] NOT NULL, -- Array of matched patterns
    original_content TEXT NOT NULL,
    filtered_content TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    automatic_action TEXT CHECK (automatic_action IN ('filter', 'flag', 'block', 'ban')),
    manual_review_required BOOLEAN DEFAULT false,
    reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Indexes
    INDEX idx_violations_user (user_id),
    INDEX idx_violations_severity (severity),
    INDEX idx_violations_reviewed (reviewed),
    INDEX idx_violations_created (created_at)
);

-- Charity fund tracking (preserved from original)
CREATE TABLE charity_fund (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE NOT NULL,
    unfilled_degrees INTEGER NOT NULL CHECK (unfilled_degrees > 0 AND unfilled_degrees <= 6),
    unclaimed_amount DECIMAL(10,2) NOT NULL CHECK (unclaimed_amount > 0),
    charity_allocation JSONB NOT NULL,
    allocated_at TIMESTAMPTZ DEFAULT now(),
    disbursed BOOLEAN DEFAULT false,
    disbursed_at TIMESTAMPTZ,
    notes TEXT,
    
    UNIQUE(purchase_id),
    INDEX idx_charity_fund_listing (listing_id),
    INDEX idx_charity_fund_disbursed (disbursed),
    INDEX idx_charity_fund_allocated_at (allocated_at)
);

-- Row Level Security Policies

-- Chat messages RLS
ALTER TABLE listing_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved chat messages" ON listing_chat_messages
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own chat messages" ON listing_chat_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can manage all chat messages" ON listing_chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Direct messages RLS
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own direct messages" ON direct_messages
    FOR SELECT USING (
        sender_id = auth.uid() OR recipient_id = auth.uid()
    );

CREATE POLICY "Users can send direct messages if they purchased" ON direct_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.listing_id = direct_messages.listing_id 
            AND (p.buyer_id = auth.uid() OR 
                 (SELECT user_id FROM listings WHERE id = p.listing_id) = auth.uid())
            AND p.status = 'completed'
        )
    );

-- User reports RLS
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON user_reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their own reports" ON user_reports
    FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Admins can manage all reports" ON user_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Content violations RLS
ALTER TABLE content_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own violations" ON content_violations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all violations" ON content_violations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Charity fund RLS (preserved)
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

-- Functions for content filtering and auto-moderation

CREATE OR REPLACE FUNCTION filter_message_content()
RETURNS TRIGGER AS $$
DECLARE
    banned_patterns TEXT[] := ARRAY[
        '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  -- Phone numbers
        '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  -- Emails
        '\b(?:instagram|ig|insta|snap|snapchat|facebook|fb|twitter|tiktok|whatsapp|telegram|discord)\s*[:@]?\s*[a-zA-Z0-9._-]+\b',  -- Social media
        '\b(?:call|text|email|message|contact|reach)\s+me\b',  -- Contact requests
        '\b(?:meet|meetup|outside|off.?platform|direct|private|personal)\b',  -- Bypass attempts
        '\b(?:venmo|paypal|cashapp|zelle|bitcoin|crypto)\b'  -- Payment methods
    ];
    pattern TEXT;
    violation_count INTEGER := 0;
    matched_patterns TEXT[] := '{}';
    severity TEXT := 'low';
BEGIN
    NEW.filtered_content := NEW.content;
    
    -- Check each banned pattern
    FOREACH pattern IN ARRAY banned_patterns
    LOOP
        IF NEW.content ~* pattern THEN
            violation_count := violation_count + 1;
            matched_patterns := array_append(matched_patterns, pattern);
            NEW.filtered_content := regexp_replace(NEW.filtered_content, pattern, '[FILTERED]', 'gi');
        END IF;
    END LOOP;
    
    -- Determine severity and action based on violation count
    IF violation_count > 0 THEN
        CASE
            WHEN violation_count >= 3 THEN severity := 'critical';
            WHEN violation_count = 2 THEN severity := 'high';
            WHEN violation_count = 1 THEN severity := 'medium';
        END CASE;
        
        -- Auto-flag serious violations
        IF severity IN ('high', 'critical') THEN
            NEW.status := 'flagged';
            NEW.flagged_reason := format('Auto-flagged: %s violations detected', violation_count);
        END IF;
        
        -- Log violation
        INSERT INTO content_violations (
            user_id,
            message_id,
            message_type,
            violation_patterns,
            original_content,
            filtered_content,
            severity,
            automatic_action,
            manual_review_required
        ) VALUES (
            NEW.sender_id,
            NEW.id,
            CASE WHEN TG_TABLE_NAME = 'listing_chat_messages' THEN 'chat' ELSE 'direct' END,
            matched_patterns,
            NEW.content,
            NEW.filtered_content,
            severity,
            CASE WHEN NEW.status = 'flagged' THEN 'flag' ELSE 'filter' END,
            severity IN ('high', 'critical')
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply content filtering to chat messages
CREATE TRIGGER trigger_filter_chat_content
    BEFORE INSERT OR UPDATE ON listing_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION filter_message_content();

-- Charity fund allocation (preserved from original)
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
    SELECT * INTO listing_record FROM listings WHERE id = NEW.listing_id;
    SELECT * INTO chain_record FROM referral_chains WHERE listing_id = NEW.listing_id;
    
    IF chain_record.id IS NOT NULL THEN
        SELECT COUNT(*) INTO unfilled_count 
        FROM generate_series(1, listing_record.max_degrees) AS degree
        WHERE degree NOT IN (
            SELECT degree_position FROM chain_links WHERE chain_id = chain_record.id
        );
    ELSE
        unfilled_count := listing_record.max_degrees;
    END IF;
    
    pool_amount := NEW.final_price * (listing_record.reward_percentage / 100.0);
    
    CASE unfilled_count
        WHEN 1 THEN unclaimed_amount := pool_amount * 0.20;
        WHEN 2 THEN unclaimed_amount := pool_amount * 0.30;
        WHEN 3 THEN unclaimed_amount := pool_amount * 0.40;
        WHEN 4 THEN unclaimed_amount := pool_amount * 0.50;
        WHEN 5 THEN unclaimed_amount := pool_amount * 0.60;
        WHEN 6 THEN unclaimed_amount := pool_amount * 1.00;
        ELSE unclaimed_amount := 0;
    END CASE;
    
    charity_split := jsonb_build_array(
        jsonb_build_object('name', 'Student Emergency Fund', 'amount', unclaimed_amount * 0.40),
        jsonb_build_object('name', 'Textbook Assistance Program', 'amount', unclaimed_amount * 0.35),
        jsonb_build_object('name', 'Digital Access Initiative', 'amount', unclaimed_amount * 0.25)
    );
    
    IF unclaimed_amount > 0 THEN
        INSERT INTO charity_fund (
            listing_id, purchase_id, unfilled_degrees, unclaimed_amount, 
            charity_allocation, notes
        ) VALUES (
            NEW.listing_id, NEW.id, unfilled_count, unclaimed_amount,
            charity_split,
            format('Auto-allocated from sale of "%s" - %s unfilled degrees', 
                   listing_record.item_title, unfilled_count)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_allocate_charity_fund
    AFTER INSERT ON purchases
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION allocate_to_charity_fund();

-- Statistics functions
CREATE OR REPLACE FUNCTION get_chat_moderation_stats()
RETURNS TABLE (
    total_messages BIGINT,
    flagged_messages BIGINT,
    violations_detected BIGINT,
    reports_submitted BIGINT,
    critical_violations BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM listing_chat_messages) as total_messages,
        (SELECT COUNT(*) FROM listing_chat_messages WHERE status = 'flagged') as flagged_messages,
        (SELECT COUNT(*) FROM content_violations) as violations_detected,
        (SELECT COUNT(*) FROM user_reports) as reports_submitted,
        (SELECT COUNT(*) FROM content_violations WHERE severity = 'critical') as critical_violations;
END;
$$ LANGUAGE plpgsql;