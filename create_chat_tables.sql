-- Simple chat system tables creation
-- Copy and paste this entire SQL into your Supabase SQL Editor and run it

-- Public chat messages for each listing (Q&A style)
CREATE TABLE IF NOT EXISTS listing_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('question', 'answer')),
    content TEXT NOT NULL,
    filtered_content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'hidden')),
    flagged_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_listing ON listing_chat_messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_chat_sender ON listing_chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_status ON listing_chat_messages(status);
CREATE INDEX IF NOT EXISTS idx_chat_created ON listing_chat_messages(created_at);

-- Direct messages between buyer and seller (post-purchase only)
CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ
);

-- Create indexes for direct messages
CREATE INDEX IF NOT EXISTS idx_direct_listing ON direct_messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_direct_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_recipient ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_created ON direct_messages(created_at);

-- User reports for violations and abuse
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID NOT NULL,
    reported_user_id UUID NOT NULL,
    message_id UUID,
    listing_id UUID,
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
    reviewed_by UUID
);

-- Create indexes for user reports
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON user_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON user_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON user_reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_created ON user_reports(created_at);

-- Content violations log (auto-flagged content)
CREATE TABLE IF NOT EXISTS content_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    message_id UUID,
    message_type TEXT CHECK (message_type IN ('chat', 'direct')),
    violation_patterns TEXT[] NOT NULL,
    original_content TEXT NOT NULL,
    filtered_content TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    automatic_action TEXT CHECK (automatic_action IN ('filter', 'flag', 'block', 'ban')),
    manual_review_required BOOLEAN DEFAULT false,
    reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for content violations
CREATE INDEX IF NOT EXISTS idx_violations_user ON content_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON content_violations(severity);
CREATE INDEX IF NOT EXISTS idx_violations_reviewed ON content_violations(reviewed);
CREATE INDEX IF NOT EXISTS idx_violations_created ON content_violations(created_at);

-- Row Level Security Policies

-- Chat messages RLS
ALTER TABLE listing_chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read approved chat messages" ON listing_chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON listing_chat_messages;

CREATE POLICY "Anyone can read approved chat messages" ON listing_chat_messages
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own chat messages" ON listing_chat_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Direct messages RLS
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own direct messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can send direct messages" ON direct_messages;

CREATE POLICY "Users can read their own direct messages" ON direct_messages
    FOR SELECT USING (
        sender_id = auth.uid() OR recipient_id = auth.uid()
    );

CREATE POLICY "Users can send direct messages" ON direct_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- User reports RLS
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create reports" ON user_reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON user_reports;

CREATE POLICY "Users can create reports" ON user_reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their own reports" ON user_reports
    FOR SELECT USING (reporter_id = auth.uid());

-- Content violations RLS
ALTER TABLE content_violations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own violations" ON content_violations;

CREATE POLICY "Users can view their own violations" ON content_violations
    FOR SELECT USING (user_id = auth.uid());

-- Simple content filtering function
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
    
    -- Auto-approve if no violations, pending if violations found
    IF violation_count = 0 THEN
        NEW.status := 'approved';
    ELSE
        NEW.status := 'pending';
        NEW.flagged_reason := format('%s potential violations detected', violation_count);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply content filtering to chat messages
DROP TRIGGER IF EXISTS trigger_filter_chat_content ON listing_chat_messages;
CREATE TRIGGER trigger_filter_chat_content
    BEFORE INSERT OR UPDATE ON listing_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION filter_message_content();