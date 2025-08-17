-- Database Schema for University of Bacon Share Links System

-- 1. Share Links Table
CREATE TABLE share_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tracking_code VARCHAR(20) UNIQUE NOT NULL,
    share_url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'twitter', 'linkedin', 'email', etc.
    custom_message TEXT,
    content_generated TEXT NOT NULL, -- The full generated content
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    bacon_earned DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'expired'
    last_clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Share Clicks Table (detailed tracking)
CREATE TABLE share_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    share_link_id UUID NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    location JSONB, -- Store geo data if available
    session_id VARCHAR(100),
    converted BOOLEAN DEFAULT FALSE,
    conversion_amount DECIMAL(10,2),
    conversion_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Share Conversions Table (when clicks lead to purchases)
CREATE TABLE share_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    share_click_id UUID NOT NULL REFERENCES share_clicks(id) ON DELETE CASCADE,
    share_link_id UUID NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    purchase_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_percentage DECIMAL(5,2) NOT NULL,
    degree INTEGER NOT NULL, -- 1st degree, 2nd degree, etc.
    converted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enhanced listings table (add fields if they don't exist)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location VARCHAR(200);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS reward_percentage DECIMAL(5,2) DEFAULT 20.00;

-- 5. Indexes for performance
CREATE INDEX idx_share_links_user_id ON share_links(user_id);
CREATE INDEX idx_share_links_listing_id ON share_links(listing_id);
CREATE INDEX idx_share_links_tracking_code ON share_links(tracking_code);
CREATE INDEX idx_share_links_platform ON share_links(platform);
CREATE INDEX idx_share_clicks_share_link_id ON share_clicks(share_link_id);
CREATE INDEX idx_share_clicks_clicked_at ON share_clicks(clicked_at);
CREATE INDEX idx_share_conversions_share_link_id ON share_conversions(share_link_id);

-- 6. Functions for analytics
CREATE OR REPLACE FUNCTION get_share_analytics(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH user_share_links AS (
        SELECT * FROM share_links WHERE user_id = user_id_param
    ),
    click_stats AS (
        SELECT 
            COUNT(*) as total_clicks,
            COUNT(CASE WHEN converted = TRUE THEN 1 END) as total_conversions,
            SUM(CASE WHEN converted = TRUE THEN conversion_amount ELSE 0 END) as total_bacon_earned
        FROM share_clicks sc
        JOIN user_share_links usl ON sc.share_link_id = usl.id
    ),
    platform_stats AS (
        SELECT 
            usl.platform,
            COUNT(sc.id) as clicks,
            COUNT(CASE WHEN sc.converted = TRUE THEN 1 END) as conversions
        FROM user_share_links usl
        LEFT JOIN share_clicks sc ON usl.id = sc.share_link_id
        GROUP BY usl.platform
        ORDER BY clicks DESC
    ),
    daily_stats AS (
        SELECT 
            DATE(sc.clicked_at) as date,
            COUNT(*) as clicks,
            COUNT(CASE WHEN sc.converted = TRUE THEN 1 END) as conversions,
            SUM(CASE WHEN sc.converted = TRUE THEN sc.conversion_amount ELSE 0 END) as earnings
        FROM share_clicks sc
        JOIN user_share_links usl ON sc.share_link_id = usl.id
        WHERE sc.clicked_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(sc.clicked_at)
        ORDER BY date DESC
    )
    SELECT json_build_object(
        'total_clicks', COALESCE(cs.total_clicks, 0),
        'total_conversions', COALESCE(cs.total_conversions, 0),
        'total_bacon_earned', COALESCE(cs.total_bacon_earned, 0),
        'conversion_rate', CASE 
            WHEN cs.total_clicks > 0 THEN ROUND((cs.total_conversions::DECIMAL / cs.total_clicks) * 100, 2)
            ELSE 0 
        END,
        'top_platforms', COALESCE(array_agg(
            json_build_object(
                'platform', ps.platform,
                'clicks', ps.clicks,
                'conversions', ps.conversions
            )
        ) FILTER (WHERE ps.platform IS NOT NULL), ARRAY[]::JSON[]),
        'daily_stats', COALESCE(array_agg(
            json_build_object(
                'date', ds.date,
                'clicks', ds.clicks,
                'conversions', ds.conversions,
                'earnings', ds.earnings
            )
        ) FILTER (WHERE ds.date IS NOT NULL), ARRAY[]::JSON[])
    ) INTO result
    FROM click_stats cs
    FULL OUTER JOIN platform_stats ps ON TRUE
    FULL OUTER JOIN daily_stats ds ON TRUE;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 7. Function to track a click
CREATE OR REPLACE FUNCTION track_share_click(
    tracking_code_param VARCHAR(20),
    ip_address_param INET DEFAULT NULL,
    user_agent_param TEXT DEFAULT NULL,
    referrer_url_param TEXT DEFAULT NULL,
    session_id_param VARCHAR(100) DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    share_link_record share_links%ROWTYPE;
    click_id UUID;
    result JSON;
BEGIN
    -- Find the share link
    SELECT * INTO share_link_record 
    FROM share_links 
    WHERE tracking_code = tracking_code_param AND status = 'active';
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid tracking code');
    END IF;
    
    -- Insert click record
    INSERT INTO share_clicks (
        share_link_id,
        ip_address,
        user_agent,
        referrer_url,
        session_id
    ) VALUES (
        share_link_record.id,
        ip_address_param,
        user_agent_param,
        referrer_url_param,
        session_id_param
    ) RETURNING id INTO click_id;
    
    -- Update share link click count
    UPDATE share_links 
    SET 
        clicks = clicks + 1,
        last_clicked_at = NOW(),
        updated_at = NOW()
    WHERE id = share_link_record.id;
    
    RETURN json_build_object(
        'success', true,
        'click_id', click_id,
        'listing_id', share_link_record.listing_id,
        'redirect_url', '/course/' || share_link_record.listing_id
    );
END;
$$ LANGUAGE plpgsql;

-- 8. Function to record a conversion
CREATE OR REPLACE FUNCTION record_share_conversion(
    click_id_param UUID,
    buyer_id_param UUID,
    purchase_amount_param DECIMAL(10,2),
    degree_param INTEGER DEFAULT 1
)
RETURNS JSON AS $$
DECLARE
    click_record share_clicks%ROWTYPE;
    share_link_record share_links%ROWTYPE;
    listing_record listings%ROWTYPE;
    commission_amount DECIMAL(10,2);
    commission_percentage DECIMAL(5,2);
    conversion_id UUID;
BEGIN
    -- Get click record
    SELECT * INTO click_record FROM share_clicks WHERE id = click_id_param;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Click not found');
    END IF;
    
    -- Get share link record
    SELECT * INTO share_link_record FROM share_links WHERE id = click_record.share_link_id;
    
    -- Get listing record
    SELECT * INTO listing_record FROM listings WHERE id = share_link_record.listing_id;
    
    -- Calculate commission based on degree
    commission_percentage := CASE degree_param
        WHEN 1 THEN 40.0  -- 40% for 1st degree
        WHEN 2 THEN 30.0  -- 30% for 2nd degree
        WHEN 3 THEN 20.0  -- 20% for 3rd degree
        WHEN 4 THEN 7.0   -- 7% for 4th degree
        WHEN 5 THEN 2.0   -- 2% for 5th degree
        WHEN 6 THEN 1.0   -- 1% for 6th degree
        ELSE 0.0
    END;
    
    commission_amount := (purchase_amount_param * listing_record.reward_percentage / 100) * commission_percentage / 100;
    
    -- Insert conversion record
    INSERT INTO share_conversions (
        share_click_id,
        share_link_id,
        listing_id,
        buyer_id,
        purchase_amount,
        commission_amount,
        commission_percentage,
        degree
    ) VALUES (
        click_id_param,
        share_link_record.id,
        share_link_record.listing_id,
        buyer_id_param,
        purchase_amount_param,
        commission_amount,
        commission_percentage,
        degree_param
    ) RETURNING id INTO conversion_id;
    
    -- Update click record
    UPDATE share_clicks 
    SET 
        converted = TRUE,
        conversion_amount = commission_amount,
        conversion_at = NOW()
    WHERE id = click_id_param;
    
    -- Update share link stats
    UPDATE share_links 
    SET 
        conversions = conversions + 1,
        bacon_earned = bacon_earned + commission_amount,
        updated_at = NOW()
    WHERE id = share_link_record.id;
    
    RETURN json_build_object(
        'success', true,
        'conversion_id', conversion_id,
        'commission_amount', commission_amount,
        'commission_percentage', commission_percentage
    );
END;
$$ LANGUAGE plpgsql;

-- 9. Function to get share link performance
CREATE OR REPLACE FUNCTION get_share_link_performance(share_link_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'share_link_id', sl.id,
        'tracking_code', sl.tracking_code,
        'platform', sl.platform,
        'total_clicks', sl.clicks,
        'total_conversions', sl.conversions,
        'total_earnings', sl.bacon_earned,
        'conversion_rate', CASE 
            WHEN sl.clicks > 0 THEN ROUND((sl.conversions::DECIMAL / sl.clicks) * 100, 2)
            ELSE 0 
        END,
        'recent_clicks', (
            SELECT COALESCE(array_agg(
                json_build_object(
                    'clicked_at', sc.clicked_at,
                    'converted', sc.converted,
                    'conversion_amount', sc.conversion_amount,
                    'ip_address', sc.ip_address
                )
                ORDER BY sc.clicked_at DESC
            ), ARRAY[]::JSON[])
            FROM share_clicks sc 
            WHERE sc.share_link_id = sl.id 
            LIMIT 10
        ),
        'hourly_stats', (
            SELECT COALESCE(array_agg(
                json_build_object(
                    'hour', date_trunc('hour', sc.clicked_at),
                    'clicks', COUNT(*),
                    'conversions', COUNT(CASE WHEN sc.converted THEN 1 END)
                )
                ORDER BY date_trunc('hour', sc.clicked_at) DESC
            ), ARRAY[]::JSON[])
            FROM share_clicks sc 
            WHERE sc.share_link_id = sl.id 
            AND sc.clicked_at >= NOW() - INTERVAL '24 hours'
            GROUP BY date_trunc('hour', sc.clicked_at)
        )
    ) INTO result
    FROM share_links sl
    WHERE sl.id = share_link_id_param;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 10. RLS (Row Level Security) Policies
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_conversions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own share links
CREATE POLICY "Users can view own share links" ON share_links
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own share links" ON share_links
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own share links" ON share_links
    FOR UPDATE USING (auth.uid() = user_id);

-- Share clicks are viewable by share link owner
CREATE POLICY "Share link owners can view clicks" ON share_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM share_links sl 
            WHERE sl.id = share_clicks.share_link_id 
            AND sl.user_id = auth.uid()
        )
    );

-- Share clicks can be inserted by anyone (for tracking)
CREATE POLICY "Anyone can insert share clicks" ON share_clicks
    FOR INSERT WITH CHECK (true);

-- Conversions viewable by share link owner
CREATE POLICY "Share link owners can view conversions" ON share_conversions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM share_links sl 
            WHERE sl.id = share_conversions.share_link_id 
            AND sl.user_id = auth.uid()
        )
    );

-- 11. Triggers for updated_at
CREATE TRIGGER update_share_links_updated_at 
    BEFORE UPDATE ON share_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Views for easier querying
CREATE VIEW share_performance_summary AS
SELECT 
    sl.*,
    l.item_title,
    l.asking_price,
    l.item_description,
    COUNT(sc.id) as actual_clicks,
    COUNT(CASE WHEN sc.converted THEN 1 END) as actual_conversions,
    SUM(CASE WHEN sc.converted THEN sc.conversion_amount ELSE 0 END) as actual_earnings
FROM share_links sl
JOIN listings l ON sl.listing_id = l.id
LEFT JOIN share_clicks sc ON sl.id = sc.share_link_id
GROUP BY sl.id, l.item_title, l.asking_price, l.item_description;