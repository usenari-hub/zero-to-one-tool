-- Share Links Table
CREATE TABLE share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id UUID REFERENCES listings(id) NOT NULL,
    
    -- Link Information
    tracking_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "SARAH-K7X9"
    share_url TEXT NOT NULL,
    sharing_method VARCHAR(50) NOT NULL, -- social_media, email, sms, copy_link
    
    -- Content & Settings
    custom_message TEXT,
    selected_platform VARCHAR(50), -- facebook, twitter, linkedin, etc.
    selected_template VARCHAR(50),
    selected_image_url TEXT,
    audience_setting VARCHAR(50), -- public, friends, groups
    
    -- Status & Timing
    status VARCHAR(20) DEFAULT 'active', -- active, paused, archived, expired
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    last_shared_at TIMESTAMP,
    
    -- Performance Tracking
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    bacon_earned DECIMAL(10,2) DEFAULT 0.00
);

-- Enable Row Level Security
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Create policies for share links
CREATE POLICY "Users can view their own share links" 
ON share_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own share links" 
ON share_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own share links" 
ON share_links 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own share links" 
ON share_links 
FOR DELETE 
USING (auth.uid() = user_id);

-- Share Events Table (Individual Shares)
CREATE TABLE share_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_link_id UUID REFERENCES share_links(id) NOT NULL,
    
    -- Platform Information
    platform VARCHAR(50) NOT NULL, -- facebook, twitter, linkedin, instagram, email, sms
    post_id VARCHAR(255), -- Platform-specific post ID if available
    post_url TEXT, -- Direct URL to the post
    
    -- Content Information
    final_content TEXT, -- The actual content that was posted
    content_template VARCHAR(50),
    included_image_url TEXT,
    hashtags TEXT[], -- Array of hashtags used
    
    -- Audience & Targeting
    audience_type VARCHAR(50), -- public, friends, specific_groups
    targeted_groups TEXT[], -- For group-specific shares
    
    -- Performance Data
    platform_clicks INTEGER DEFAULT 0,
    platform_likes INTEGER DEFAULT 0,
    platform_shares INTEGER DEFAULT 0,
    platform_comments INTEGER DEFAULT 0,
    conversions_from_this_share INTEGER DEFAULT 0,
    
    -- Timing
    shared_at TIMESTAMP DEFAULT NOW(),
    scheduled_for TIMESTAMP, -- For scheduled posts
    
    -- Status
    status VARCHAR(20) DEFAULT 'posted' -- scheduled, posted, failed, deleted
);

-- Enable RLS
ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own share events" 
ON share_events 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM share_links 
    WHERE share_links.id = share_events.share_link_id 
    AND share_links.user_id = auth.uid()
));

CREATE POLICY "Users can create share events for their links" 
ON share_events 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM share_links 
    WHERE share_links.id = share_events.share_link_id 
    AND share_links.user_id = auth.uid()
));

-- Click Tracking Table
CREATE TABLE share_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_link_id UUID REFERENCES share_links(id) NOT NULL,
    share_event_id UUID REFERENCES share_events(id), -- Which specific share generated this click
    
    -- Click Information
    clicked_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    
    -- Geographic Data
    country VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Device Information
    device_type VARCHAR(20), -- mobile, desktop, tablet
    device_brand VARCHAR(50),
    device_model VARCHAR(50),
    browser VARCHAR(50),
    browser_version VARCHAR(20),
    operating_system VARCHAR(50),
    
    -- Tracking Data
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    
    -- Conversion Tracking
    converted BOOLEAN DEFAULT FALSE,
    conversion_time TIMESTAMP,
    conversion_value DECIMAL(10,2),
    
    -- Chain Information
    created_chain BOOLEAN DEFAULT FALSE, -- Did this click create a new referral chain
    chain_id UUID REFERENCES referral_chains(id),
    degree_position INTEGER -- Position in referral chain if applicable
);

-- Enable RLS  
ALTER TABLE share_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view clicks for their share links" 
ON share_clicks 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM share_links 
    WHERE share_links.id = share_clicks.share_link_id 
    AND share_links.user_id = auth.uid()
));

-- Content Templates Table
CREATE TABLE share_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id), -- NULL for system templates
    
    -- Template Information
    template_name VARCHAR(100) NOT NULL,
    template_category VARCHAR(50), -- casual, professional, exciting, custom
    platform VARCHAR(50) NOT NULL, -- facebook, twitter, linkedin, etc.
    
    -- Content
    template_content TEXT NOT NULL,
    default_hashtags TEXT[],
    suggested_images TEXT[],
    
    -- Settings
    is_public BOOLEAN DEFAULT FALSE, -- Can other users use this template
    is_system_template BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Timing
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE share_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view public and their own templates" 
ON share_templates 
FOR SELECT 
USING (is_public = true OR user_id = auth.uid() OR is_system_template = true);

CREATE POLICY "Users can create their own templates" 
ON share_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
ON share_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Scheduled Shares Table
CREATE TABLE scheduled_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_link_id UUID REFERENCES share_links(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Schedule Information
    scheduled_for TIMESTAMP NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    
    -- Platform & Content
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    audience_setting VARCHAR(50),
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, posting, posted, failed, cancelled
    posted_at TIMESTAMP,
    failure_reason TEXT,
    
    -- Retry Logic
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP
);

-- Enable RLS
ALTER TABLE scheduled_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own scheduled shares" 
ON scheduled_shares 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled shares" 
ON scheduled_shares 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled shares" 
ON scheduled_shares 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Share Performance Analytics Table
CREATE TABLE share_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_link_id UUID REFERENCES share_links(id) NOT NULL,
    
    -- Time Period
    date_period DATE NOT NULL,
    period_type VARCHAR(10) NOT NULL, -- daily, weekly, monthly
    
    -- Aggregated Metrics
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,4) DEFAULT 0.0000,
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    total_conversions INTEGER DEFAULT 0,
    bacon_earned DECIMAL(10,2) DEFAULT 0.00,
    
    -- Platform Breakdown
    facebook_clicks INTEGER DEFAULT 0,
    twitter_clicks INTEGER DEFAULT 0,
    linkedin_clicks INTEGER DEFAULT 0,
    instagram_clicks INTEGER DEFAULT 0,
    email_clicks INTEGER DEFAULT 0,
    sms_clicks INTEGER DEFAULT 0,
    direct_clicks INTEGER DEFAULT 0,
    
    -- Geographic Breakdown
    top_countries JSONB, -- {"US": 234, "CA": 45, "UK": 23}
    top_cities JSONB,
    
    -- Device Breakdown
    mobile_clicks INTEGER DEFAULT 0,
    desktop_clicks INTEGER DEFAULT 0,
    tablet_clicks INTEGER DEFAULT 0,
    
    -- Timing Analysis
    peak_hour INTEGER, -- Hour of day with most clicks (0-23)
    peak_day_of_week INTEGER, -- Day with most clicks (0-6)
    
    -- Updated timestamp
    last_updated TIMESTAMP DEFAULT NOW(),
    
    -- Constraints & Indexes
    UNIQUE(share_link_id, date_period, period_type)
);

-- Enable RLS
ALTER TABLE share_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view analytics for their share links" 
ON share_analytics 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM share_links 
    WHERE share_links.id = share_analytics.share_link_id 
    AND share_links.user_id = auth.uid()
));

-- Add trigger for timestamps
CREATE TRIGGER update_share_templates_updated_at
BEFORE UPDATE ON share_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_share_links_user_status ON share_links(user_id, status);
CREATE INDEX idx_share_links_tracking_code ON share_links(tracking_code);
CREATE INDEX idx_share_links_course_id ON share_links(course_id);
CREATE INDEX idx_share_links_created_at ON share_links(created_at);

CREATE INDEX idx_share_events_share_link_platform ON share_events(share_link_id, platform);
CREATE INDEX idx_share_events_shared_at ON share_events(shared_at);
CREATE INDEX idx_share_events_status ON share_events(status);

CREATE INDEX idx_share_clicks_share_link_clicked_at ON share_clicks(share_link_id, clicked_at);
CREATE INDEX idx_share_clicks_ip_clicked_at ON share_clicks(ip_address, clicked_at);
CREATE INDEX idx_share_clicks_converted_conversion_time ON share_clicks(converted, conversion_time);
CREATE INDEX idx_share_clicks_chain_id ON share_clicks(chain_id);

CREATE INDEX idx_share_templates_platform_category ON share_templates(platform, template_category);
CREATE INDEX idx_share_templates_user_public ON share_templates(user_id, is_public);
CREATE INDEX idx_share_templates_system_success_rate ON share_templates(is_system_template, success_rate);

CREATE INDEX idx_scheduled_shares_scheduled_status ON scheduled_shares(scheduled_for, status);
CREATE INDEX idx_scheduled_shares_user_status ON scheduled_shares(user_id, status);
CREATE INDEX idx_scheduled_shares_status_retry ON scheduled_shares(status, next_retry_at);

CREATE INDEX idx_share_analytics_date_period ON share_analytics(date_period, period_type);
CREATE INDEX idx_share_analytics_share_link_date ON share_analytics(share_link_id, date_period);