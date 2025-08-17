-- Enhanced Viral Sharing System Database Schema
-- Enhanced sharing system that creates unstoppable viral growth
-- Part of the University of Bacon billion-dollar social commerce platform

-- Share links table (enhanced from existing share_events)
-- Tracks individual share links with comprehensive analytics
CREATE TABLE share_links_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    chain_link_id UUID REFERENCES chain_links(id) ON DELETE CASCADE,
    tracking_code VARCHAR(20) UNIQUE NOT NULL,
    share_url TEXT NOT NULL,
    short_url VARCHAR(100), -- Shortened URL for easier sharing
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'twitter', 'linkedin', 'instagram', 'email', 'sms', 'whatsapp'
    content_template TEXT, -- Platform-specific content used
    custom_message TEXT, -- User's custom message
    target_audience VARCHAR(100), -- 'friends', 'professional', 'family', 'public'
    share_type VARCHAR(50) DEFAULT 'referral', -- 'referral', 'organic', 'paid_promotion'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Performance metrics
    clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    signup_conversions INTEGER DEFAULT 0,
    bacon_earned DECIMAL(10,2) DEFAULT 0.00,
    estimated_reach INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Metadata
    utm_parameters JSONB DEFAULT '{}',
    analytics_data JSONB DEFAULT '{}',
    last_clicked_at TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Share link performance analytics
-- Detailed performance tracking for each share link
CREATE TABLE share_link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_link_id UUID REFERENCES share_links_enhanced(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'click', 'view', 'conversion', 'signup', 'purchase'
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User/Session data
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    session_id VARCHAR(255),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- If logged in
    
    -- Device/Location data
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Engagement data
    time_on_page INTEGER, -- Seconds spent on listing page
    pages_viewed INTEGER DEFAULT 1,
    bounce_rate BOOLEAN DEFAULT FALSE,
    conversion_value DECIMAL(10,2), -- If purchase was made
    
    -- Chain tracking
    chain_degree INTEGER, -- Which degree in the chain this represents
    previous_referrer UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    UNIQUE(share_link_id, session_id, event_type, event_timestamp)
);

-- Platform-specific share templates
-- Optimized content templates for each social platform
CREATE TABLE share_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'casual', 'professional', 'urgent', 'celebration'
    subject_line VARCHAR(200), -- For email/messaging
    content_template TEXT NOT NULL,
    hashtags TEXT[], -- Array of recommended hashtags
    call_to_action VARCHAR(200),
    emoji_pack VARCHAR(100), -- Set of recommended emojis
    
    -- Performance data
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    average_engagement DECIMAL(5,2) DEFAULT 0.00,
    
    -- Targeting
    target_demographics JSONB DEFAULT '{}', -- Age, interests, etc.
    optimal_times JSONB DEFAULT '{}', -- Best times to post
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(platform, template_name)
);

-- Viral coefficient tracking
-- Measures how many new users each user brings to the platform
CREATE TABLE viral_coefficients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    measurement_period VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'lifetime'
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Viral metrics
    shares_created INTEGER DEFAULT 0,
    clicks_generated INTEGER DEFAULT 0,
    new_users_brought INTEGER DEFAULT 0,
    purchases_generated INTEGER DEFAULT 0,
    total_bacon_from_referrals DECIMAL(10,2) DEFAULT 0.00,
    
    -- Calculated coefficients
    viral_coefficient DECIMAL(8,4) DEFAULT 0.0000, -- New users per existing user
    k_factor DECIMAL(8,4) DEFAULT 0.0000, -- Viral growth factor
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_order_value DECIMAL(10,2) DEFAULT 0.00,
    
    -- Academic-themed metrics
    academic_gpa DECIMAL(3,2) DEFAULT 0.00, -- GPA based on sharing success
    degree_level VARCHAR(50) DEFAULT 'freshman', -- Academic progression
    honor_status VARCHAR(50) DEFAULT 'enrolled', -- 'enrolled', 'honor_roll', 'deans_list'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, measurement_period, period_start)
);

-- Create indexes for performance
CREATE INDEX idx_share_links_enhanced_user_id ON share_links_enhanced(user_id);
CREATE INDEX idx_share_links_enhanced_listing_id ON share_links_enhanced(listing_id);
CREATE INDEX idx_share_links_enhanced_tracking_code ON share_links_enhanced(tracking_code);
CREATE INDEX idx_share_links_enhanced_platform ON share_links_enhanced(platform);
CREATE INDEX idx_share_links_enhanced_created_at ON share_links_enhanced(created_at);
CREATE INDEX idx_share_links_enhanced_expires_at ON share_links_enhanced(expires_at);

CREATE INDEX idx_share_link_analytics_link_id ON share_link_analytics(share_link_id);
CREATE INDEX idx_share_link_analytics_event_type ON share_link_analytics(event_type);
CREATE INDEX idx_share_link_analytics_timestamp ON share_link_analytics(event_timestamp);
CREATE INDEX idx_share_link_analytics_ip_address ON share_link_analytics(ip_address);

CREATE INDEX idx_share_templates_platform ON share_templates(platform);
CREATE INDEX idx_share_templates_type ON share_templates(template_type);
CREATE INDEX idx_share_templates_success_rate ON share_templates(success_rate);

CREATE INDEX idx_viral_coefficients_user_id ON viral_coefficients(user_id);
CREATE INDEX idx_viral_coefficients_period ON viral_coefficients(measurement_period, period_start);

-- Enable RLS (Row Level Security)
ALTER TABLE share_links_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_coefficients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own share links" ON share_links_enhanced
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own share links" ON share_links_enhanced
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own share links" ON share_links_enhanced
    FOR UPDATE USING (user_id = auth.uid());

-- Share templates are publicly viewable
CREATE POLICY "Share templates are publicly viewable" ON share_templates
    FOR SELECT USING (true);

-- Users can view their own viral coefficients
CREATE POLICY "Users can view their own viral coefficients" ON viral_coefficients
    FOR SELECT USING (user_id = auth.uid());

-- Generate unique tracking code function
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, (random() * length(chars))::int + 1, 1);
    END LOOP;
    RETURN result;
END;
$$;