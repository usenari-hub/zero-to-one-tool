-- Complete Admin Database Schema for University of Bacon
-- This schema provides comprehensive admin control over all website aspects

-- 1. Admin Users and Permissions
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator', 'support'
    permissions JSONB DEFAULT '{}', -- Detailed permissions object
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active' -- 'active', 'suspended', 'inactive'
);

-- 2. Site Configuration
CREATE TABLE site_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(50) NOT NULL, -- 'branding', 'colors', 'features', 'payments', 'security'
    description TEXT,
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Activity Logs
CREATE TABLE user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'login', 'logout', 'listing_create', 'share_create', etc.
    activity_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Listings Management Enhancement
ALTER TABLE listings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flagged_by UUID REFERENCES admin_users(id);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flag_reason TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS admin_status VARCHAR(20) DEFAULT 'approved';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0;

-- 5. Fraud Detection and Reports
CREATE TABLE fraud_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reported_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reported_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    reported_share_link_id UUID REFERENCES share_links(id) ON DELETE SET NULL,
    reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    report_type VARCHAR(50) NOT NULL, -- 'fake_listing', 'fraud_activity', 'inappropriate_content', 'spam'
    report_reason TEXT NOT NULL,
    evidence_urls TEXT[], -- Array of evidence URLs
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'investigating', 'resolved', 'dismissed'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    assigned_to UUID REFERENCES admin_users(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Actions Log
CREATE TABLE admin_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id),
    action_type VARCHAR(100) NOT NULL, -- 'user_ban', 'listing_remove', 'bacon_forfeit', etc.
    target_type VARCHAR(50), -- 'user', 'listing', 'share_link', 'site_config'
    target_id UUID,
    action_data JSONB DEFAULT '{}',
    reason TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Advertisements Management
CREATE TABLE advertisements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ad_type VARCHAR(50) NOT NULL, -- 'banner', 'sidebar', 'popup', 'inline'
    placement VARCHAR(100) NOT NULL, -- 'header', 'footer', 'listing_page', 'dashboard'
    content_type VARCHAR(50) NOT NULL, -- 'html', 'image', 'video'
    content_data JSONB NOT NULL, -- Contains HTML, image URLs, video URLs, etc.
    target_audience JSONB DEFAULT '{}', -- Targeting criteria
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    budget DECIMAL(10,2),
    spent DECIMAL(10,2) DEFAULT 0.00,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'expired'
    priority INTEGER DEFAULT 0,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Media Management
CREATE TABLE media_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document', 'audio'
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    caption TEXT,
    tags TEXT[], -- Array of tags for organization
    uploaded_by UUID REFERENCES admin_users(id),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Email Templates
CREATE TABLE email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'welcome', 'verification', 'fraud_alert', 'ban_notice'
    subject VARCHAR(200) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB DEFAULT '{}', -- Available template variables
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Analytics and Metrics
CREATE TABLE analytics_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'counter', 'gauge', 'histogram'
    metric_value DECIMAL(15,2) NOT NULL,
    dimensions JSONB DEFAULT '{}', -- Additional metric dimensions
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(metric_name, recorded_at, dimensions)
);

-- 11. System Alerts and Notifications
CREATE TABLE system_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- 'fraud_detected', 'system_error', 'high_traffic'
    severity VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_data JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
    acknowledged_by UUID REFERENCES admin_users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Feature Flags
CREATE TABLE feature_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    flag_name VARCHAR(100) UNIQUE NOT NULL,
    flag_description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0, -- 0-100 for gradual rollouts
    target_users JSONB DEFAULT '{}', -- Specific user targeting
    conditions JSONB DEFAULT '{}', -- Conditions for flag activation
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Backup and Audit Trail
CREATE TABLE audit_trail (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for Performance
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_status ON admin_users(status);
CREATE INDEX idx_site_config_type ON site_config(config_type);
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_activity_type ON user_activity_logs(activity_type);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX idx_fraud_reports_reported_user ON fraud_reports(reported_user_id);
CREATE INDEX idx_admin_actions_admin_user ON admin_actions(admin_user_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_advertisements_status ON advertisements(status);
CREATE INDEX idx_advertisements_placement ON advertisements(placement);
CREATE INDEX idx_analytics_metrics_name_date ON analytics_metrics(metric_name, recorded_at);
CREATE INDEX idx_system_alerts_status ON system_alerts(status);
CREATE INDEX idx_system_alerts_severity ON system_alerts(severity);
CREATE INDEX idx_audit_trail_table_record ON audit_trail(table_name, record_id);

-- FUNCTIONS for Admin Operations

-- 1. Function to ban a user
CREATE OR REPLACE FUNCTION admin_ban_user(
    user_id_param UUID,
    admin_id_param UUID,
    ban_reason_param TEXT,
    ban_duration_days INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    ban_until TIMESTAMPTZ;
BEGIN
    -- Calculate ban end date
    IF ban_duration_days IS NOT NULL THEN
        ban_until := NOW() + (ban_duration_days || ' days')::INTERVAL;
    END IF;
    
    -- Freeze all bacon earnings
    UPDATE share_links 
    SET status = 'frozen'
    WHERE user_id = user_id_param;
    
    -- Log admin action
    INSERT INTO admin_actions (
        admin_user_id, action_type, target_type, target_id, 
        action_data, reason
    ) VALUES (
        admin_id_param, 'user_ban', 'user', user_id_param,
        json_build_object(
            'ban_duration_days', ban_duration_days,
            'ban_until', ban_until
        ),
        ban_reason_param
    );
    
    RETURN json_build_object(
        'success', true,
        'message', 'User banned successfully',
        'banned_until', ban_until
    );
END;
$$ LANGUAGE plpgsql;

-- 2. Function to forfeit user bacon
CREATE OR REPLACE FUNCTION admin_forfeit_bacon(
    user_id_param UUID,
    admin_id_param UUID,
    reason_param TEXT,
    amount_param DECIMAL(10,2) DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    total_forfeited DECIMAL(10,2) := 0;
BEGIN
    -- Forfeit specific amount or all bacon
    IF amount_param IS NOT NULL THEN
        UPDATE share_links 
        SET 
            bacon_earned = GREATEST(0, bacon_earned - amount_param),
            status = 'penalty_applied'
        WHERE user_id = user_id_param
        AND bacon_earned > 0;
        
        total_forfeited := amount_param;
    ELSE
        -- Forfeit all bacon
        SELECT COALESCE(SUM(bacon_earned), 0) INTO total_forfeited
        FROM share_links 
        WHERE user_id = user_id_param;
        
        UPDATE share_links 
        SET 
            bacon_earned = 0,
            status = 'forfeited'
        WHERE user_id = user_id_param;
    END IF;
    
    -- Log admin action
    INSERT INTO admin_actions (
        admin_user_id, action_type, target_type, target_id,
        action_data, reason
    ) VALUES (
        admin_id_param, 'bacon_forfeit', 'user', user_id_param,
        json_build_object('amount_forfeited', total_forfeited),
        reason_param
    );
    
    RETURN json_build_object(
        'success', true,
        'amount_forfeited', total_forfeited,
        'message', 'Bacon forfeited successfully'
    );
END;
$$ LANGUAGE plpgsql;

-- 3. Function to get admin dashboard metrics
CREATE OR REPLACE FUNCTION get_admin_dashboard_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM auth.users),
        'active_users', (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL),
        'total_listings', (SELECT COUNT(*) FROM listings),
        'active_listings', (SELECT COUNT(*) FROM listings WHERE status = 'active'),
        'flagged_listings', (SELECT COUNT(*) FROM listings WHERE flagged_at IS NOT NULL),
        'total_share_links', (SELECT COUNT(*) FROM share_links),
        'total_bacon_earned', (SELECT COALESCE(SUM(bacon_earned), 0) FROM share_links),
        'pending_reports', (SELECT COUNT(*) FROM fraud_reports WHERE status = 'pending'),
        'today_signups', (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE),
        'today_listings', (SELECT COUNT(*) FROM listings WHERE DATE(created_at) = CURRENT_DATE),
        'today_revenue', (SELECT COALESCE(SUM(bacon_earned), 0) FROM share_links WHERE DATE(updated_at) = CURRENT_DATE),
        'system_alerts', (SELECT COUNT(*) FROM system_alerts WHERE status = 'active')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. Insert default site configuration with updated commission rates
INSERT INTO site_config (config_key, config_value, config_type, description) VALUES
('brand_colors', '{
    "primary": "#f97316",
    "secondary": "#eab308", 
    "accent": "#fbbf24",
    "academic": "#1e40af",
    "background": "#ffffff",
    "foreground": "#0f172a"
}', 'branding', 'Main brand colors for the website'),

('site_logo', '{
    "main_logo": "/logos/main-logo.png",
    "favicon": "/logos/favicon.ico",
    "logo_text": "University of Bacon"
}', 'branding', 'Site logos and branding assets'),

('commission_rates', '{
    "degree_1": 50,
    "degree_2": 25,
    "degree_3": 10,
    "degree_4": 7.5,
    "degree_5": 5,
    "degree_6": 2.5,
    "default_reward_percentage": 20
}', 'payments', 'Commission rates for referral degrees'),

('feature_toggles', '{
    "share_links_enabled": true,
    "referral_chains_enabled": true,
    "user_verification_required": false,
    "auto_bacon_payouts": true,
    "fraud_detection_enabled": true
}', 'features', 'Feature toggle switches'),

('security_settings', '{
    "max_login_attempts": 5,
    "session_timeout_hours": 24,
    "require_2fa_for_payouts": false,
    "min_payout_amount": 10.00,
    "fraud_investigation_days": 90
}', 'security', 'Security and fraud prevention settings');

-- Row Level Security Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Only admin users can access admin tables
CREATE POLICY "Admin users only" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin config access" ON site_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin fraud reports access" ON fraud_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin actions access" ON admin_actions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin activity logs access" ON user_activity_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin advertisements access" ON advertisements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin media access" ON media_library
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin email templates access" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin analytics access" ON analytics_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin alerts access" ON system_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin feature flags access" ON feature_flags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

CREATE POLICY "Admin audit trail access" ON audit_trail
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.status = 'active'
        )
    );

-- Audit trail trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_trail (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_trail (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_trail (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_listings AFTER INSERT OR UPDATE OR DELETE ON listings
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    
CREATE TRIGGER audit_share_links AFTER INSERT OR UPDATE OR DELETE ON share_links
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();