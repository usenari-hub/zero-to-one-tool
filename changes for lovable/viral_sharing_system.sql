-- Viral Sharing System Database Schema
-- Enhanced sharing system that creates unstoppable viral growth
-- Part of the University of Bacon billion-dollar social commerce platform

-- Share links table (enhanced from existing share_events)
-- Tracks individual share links with comprehensive analytics
CREATE TABLE share_links (
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
    share_link_id UUID REFERENCES share_links(id) ON DELETE CASCADE,
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

-- Share competitions and campaigns
-- Gamified sharing campaigns to boost viral growth
CREATE TABLE share_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(200) NOT NULL,
    campaign_description TEXT,
    campaign_type VARCHAR(50) NOT NULL, -- 'competition', 'challenge', 'semester', 'academic_year'
    
    -- Academic theming
    academic_theme VARCHAR(100), -- 'Spring Semester Finals', 'Graduation Week', etc.
    professor_sponsor VARCHAR(100), -- 'Sponsored by Prof. Bacon'
    course_credit BOOLEAN DEFAULT FALSE, -- Does participation count for 'course credit'
    
    -- Campaign details
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER,
    entry_requirements JSONB DEFAULT '{}',
    
    -- Rewards
    prize_pool DECIMAL(12,2) DEFAULT 0.00,
    bacon_rewards JSONB DEFAULT '{}', -- Reward structure
    academic_honors JSONB DEFAULT '{}', -- Academic achievements awarded
    
    -- Targeting
    target_listings UUID[], -- Specific listings to promote
    target_demographics JSONB DEFAULT '{}',
    geographic_restrictions JSONB DEFAULT '{}',
    
    -- Metrics
    total_participants INTEGER DEFAULT 0,
    total_shares_generated INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_bacon_distributed DECIMAL(12,2) DEFAULT 0.00,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign participation tracking
CREATE TABLE campaign_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES share_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Performance in campaign
    shares_created INTEGER DEFAULT 0,
    clicks_generated INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    bacon_earned DECIMAL(10,2) DEFAULT 0.00,
    current_rank INTEGER,
    
    -- Academic progress in campaign
    course_credits_earned DECIMAL(3,1) DEFAULT 0.0,
    gpa_for_campaign DECIMAL(3,2) DEFAULT 0.00,
    achievements_unlocked JSONB DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE(campaign_id, user_id)
);

-- Real-time sharing momentum tracking
-- Tracks sharing "hot streaks" and momentum for gamification
CREATE TABLE sharing_momentum (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Current streak data
    current_streak_days INTEGER DEFAULT 0,
    streak_type VARCHAR(50) DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
    streak_start_date TIMESTAMP WITH TIME ZONE,
    last_share_date TIMESTAMP WITH TIME ZONE,
    
    -- Momentum metrics
    shares_this_week INTEGER DEFAULT 0,
    conversions_this_week INTEGER DEFAULT 0,
    momentum_score DECIMAL(8,2) DEFAULT 0.00, -- Calculated momentum
    velocity_trend VARCHAR(50) DEFAULT 'stable', -- 'accelerating', 'stable', 'declining'
    
    -- Gamification
    next_milestone INTEGER, -- Next goal to reach
    achievements_this_period JSONB DEFAULT '[]',
    bonus_multiplier DECIMAL(3,2) DEFAULT 1.00, -- Bonus for streaks
    
    -- Academic progress
    current_semester VARCHAR(50),
    academic_standing VARCHAR(50) DEFAULT 'good', -- 'excellent', 'good', 'probation'
    graduation_progress DECIMAL(5,2) DEFAULT 0.00, -- Percentage to "graduation"
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Platform optimization data
-- AI/ML data for optimizing content for each platform
CREATE TABLE platform_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    optimization_type VARCHAR(50) NOT NULL, -- 'hashtags', 'timing', 'content_length', 'emoji_usage'
    
    -- Optimization data
    optimal_values JSONB NOT NULL, -- The actual optimization recommendations
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    sample_size INTEGER DEFAULT 0,
    
    -- Performance tracking
    before_optimization_rate DECIMAL(5,2) DEFAULT 0.00,
    after_optimization_rate DECIMAL(5,2) DEFAULT 0.00,
    improvement_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Temporal relevance
    effective_date_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_date_end TIMESTAMP WITH TIME ZONE,
    time_of_day_relevant TIME,
    day_of_week_relevant INTEGER, -- 1-7 for Mon-Sun
    seasonal_relevance VARCHAR(50), -- 'spring', 'summer', 'fall', 'winter', 'year_round'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(platform, optimization_type, effective_date_start)
);

-- Create indexes for performance
CREATE INDEX idx_share_links_user_id ON share_links(user_id);
CREATE INDEX idx_share_links_listing_id ON share_links(listing_id);
CREATE INDEX idx_share_links_tracking_code ON share_links(tracking_code);
CREATE INDEX idx_share_links_platform ON share_links(platform);
CREATE INDEX idx_share_links_created_at ON share_links(created_at);
CREATE INDEX idx_share_links_expires_at ON share_links(expires_at);

CREATE INDEX idx_share_link_analytics_link_id ON share_link_analytics(share_link_id);
CREATE INDEX idx_share_link_analytics_event_type ON share_link_analytics(event_type);
CREATE INDEX idx_share_link_analytics_timestamp ON share_link_analytics(event_timestamp);
CREATE INDEX idx_share_link_analytics_ip_address ON share_link_analytics(ip_address);

CREATE INDEX idx_share_templates_platform ON share_templates(platform);
CREATE INDEX idx_share_templates_type ON share_templates(template_type);
CREATE INDEX idx_share_templates_success_rate ON share_templates(success_rate);

CREATE INDEX idx_viral_coefficients_user_id ON viral_coefficients(user_id);
CREATE INDEX idx_viral_coefficients_period ON viral_coefficients(measurement_period, period_start);

CREATE INDEX idx_share_campaigns_active ON share_campaigns(is_active, start_date, end_date);
CREATE INDEX idx_campaign_participants_campaign_id ON campaign_participants(campaign_id);
CREATE INDEX idx_campaign_participants_user_id ON campaign_participants(user_id);

CREATE INDEX idx_sharing_momentum_user_id ON sharing_momentum(user_id);
CREATE INDEX idx_sharing_momentum_streak ON sharing_momentum(current_streak_days);

CREATE INDEX idx_platform_optimization_platform ON platform_optimization(platform);
CREATE INDEX idx_platform_optimization_type ON platform_optimization(optimization_type);

-- Enable RLS (Row Level Security)
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_coefficients ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_momentum ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_optimization ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own share links" ON share_links
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own share links" ON share_links
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own share links" ON share_links
    FOR UPDATE USING (user_id = auth.uid());

-- Share templates are publicly viewable
CREATE POLICY "Share templates are publicly viewable" ON share_templates
    FOR SELECT USING (true);

-- Share campaigns are publicly viewable
CREATE POLICY "Share campaigns are publicly viewable" ON share_campaigns
    FOR SELECT USING (true);

-- Users can view their own viral coefficients
CREATE POLICY "Users can view their own viral coefficients" ON viral_coefficients
    FOR SELECT USING (user_id = auth.uid());

-- Users can view their own momentum data
CREATE POLICY "Users can view their own sharing momentum" ON sharing_momentum
    FOR SELECT USING (user_id = auth.uid());

-- Platform optimization data is publicly viewable
CREATE POLICY "Platform optimization is publicly viewable" ON platform_optimization
    FOR SELECT USING (true);

-- Functions for viral sharing system

-- Generate unique tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Calculate viral coefficient for a user
CREATE OR REPLACE FUNCTION calculate_viral_coefficient(user_uuid UUID, period_days INTEGER DEFAULT 30)
RETURNS DECIMAL AS $$
DECLARE
    shares_count INTEGER;
    new_users_count INTEGER;
    coefficient DECIMAL;
BEGIN
    -- Count shares created in period
    SELECT COUNT(*) INTO shares_count
    FROM share_links
    WHERE user_id = user_uuid
    AND created_at >= NOW() - (period_days || ' days')::INTERVAL;
    
    -- Count new users brought through shares
    SELECT COUNT(DISTINCT sla.user_id) INTO new_users_count
    FROM share_link_analytics sla
    JOIN share_links sl ON sla.share_link_id = sl.id
    WHERE sl.user_id = user_uuid
    AND sla.event_type = 'signup'
    AND sla.event_timestamp >= NOW() - (period_days || ' days')::INTERVAL;
    
    -- Calculate coefficient (new users per share)
    IF shares_count > 0 THEN
        coefficient := new_users_count::DECIMAL / shares_count::DECIMAL;
    ELSE
        coefficient := 0.0;
    END IF;
    
    RETURN coefficient;
END;
$$ LANGUAGE plpgsql;

-- Update momentum tracking
CREATE OR REPLACE FUNCTION update_sharing_momentum(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    last_share_date TIMESTAMP WITH TIME ZONE;
    current_momentum RECORD;
    new_streak INTEGER;
BEGIN
    -- Get user's last share date
    SELECT MAX(created_at) INTO last_share_date
    FROM share_links
    WHERE user_id = user_uuid;
    
    -- Get current momentum record
    SELECT * INTO current_momentum
    FROM sharing_momentum
    WHERE user_id = user_uuid;
    
    -- Calculate new streak
    IF last_share_date >= CURRENT_DATE THEN
        IF current_momentum.last_share_date::DATE = CURRENT_DATE - INTERVAL '1 day' OR
           current_momentum.last_share_date IS NULL THEN
            new_streak := COALESCE(current_momentum.current_streak_days, 0) + 1;
        ELSE
            new_streak := 1; -- Reset streak
        END IF;
    ELSE
        new_streak := 0; -- No share today, break streak
    END IF;
    
    -- Update or insert momentum record
    INSERT INTO sharing_momentum (user_id, current_streak_days, last_share_date, last_updated)
    VALUES (user_uuid, new_streak, last_share_date, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET
        current_streak_days = new_streak,
        last_share_date = last_share_date,
        last_updated = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update momentum on new shares
CREATE OR REPLACE FUNCTION update_momentum_on_share()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_sharing_momentum(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (to be activated after tables exist)
-- CREATE TRIGGER momentum_update_trigger
--     AFTER INSERT ON share_links
--     FOR EACH ROW
--     EXECUTE FUNCTION update_momentum_on_share();