-- Create only the missing listing_chat_messages table
-- Run this in your Supabase SQL editor

-- Public chat messages for each listing (Q&A style)
CREATE TABLE IF NOT EXISTS listing_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Content violations log (auto-flagged content)
CREATE TABLE IF NOT EXISTS content_violations (
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
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for content violations
CREATE INDEX IF NOT EXISTS idx_violations_user ON content_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON content_violations(severity);
CREATE INDEX IF NOT EXISTS idx_violations_reviewed ON content_violations(reviewed);
CREATE INDEX IF NOT EXISTS idx_violations_created ON content_violations(created_at);

-- Row Level Security Policies
ALTER TABLE listing_chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read approved chat messages" ON listing_chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON listing_chat_messages;
DROP POLICY IF EXISTS "Admins can manage all chat messages" ON listing_chat_messages;

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

-- Content filtering function
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
        
        -- Log violation (only if content_violations table exists)
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
            'chat',
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
DROP TRIGGER IF EXISTS trigger_filter_chat_content ON listing_chat_messages;
CREATE TRIGGER trigger_filter_chat_content
    BEFORE INSERT OR UPDATE ON listing_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION filter_message_content();