-- Fix the share_performance_summary view security issue
-- The view currently has overly broad permissions that bypass RLS

-- First, let's drop the existing view
DROP VIEW IF EXISTS public.share_performance_summary;

-- Recreate the view with proper security constraints
-- Instead of a view, we'll create a function that enforces user-based filtering
CREATE OR REPLACE FUNCTION public.get_share_performance_summary(user_id_filter uuid DEFAULT NULL)
RETURNS TABLE (
    id uuid,
    listing_id uuid,
    user_id uuid,
    tracking_code character varying,
    share_url text,
    platform character varying,
    custom_message text,
    content_generated text,
    clicks integer,
    conversions integer,
    bacon_earned numeric,
    status character varying,
    last_clicked_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    item_title character varying,
    asking_price numeric,
    item_description text,
    actual_clicks bigint,
    actual_conversions bigint,
    actual_earnings numeric
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
    -- Security check: ensure user can only see their own data
    IF user_id_filter IS NOT NULL AND user_id_filter != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: You can only view your own share performance data';
    END IF;
    
    RETURN QUERY
    SELECT 
        sl.id,
        sl.listing_id,
        sl.user_id,
        sl.tracking_code,
        sl.share_url,
        sl.platform,
        sl.custom_message,
        sl.content_generated,
        sl.clicks,
        sl.conversions,
        sl.bacon_earned,
        sl.status,
        sl.last_clicked_at,
        sl.created_at,
        sl.updated_at,
        l.item_title,
        l.asking_price,
        l.item_description,
        count(sc.id) AS actual_clicks,
        count(
            CASE
                WHEN sc.converted THEN 1
                ELSE NULL::integer
            END) AS actual_conversions,
        sum(
            CASE
                WHEN sc.converted THEN sc.conversion_amount
                ELSE (0)::numeric
            END) AS actual_earnings
    FROM share_links sl
    JOIN listings l ON sl.listing_id = l.id
    LEFT JOIN share_clicks sc ON sl.id = sc.share_link_id
    WHERE (user_id_filter IS NULL AND sl.user_id = auth.uid()) 
       OR (user_id_filter IS NOT NULL AND sl.user_id = user_id_filter)
    GROUP BY sl.id, l.item_title, l.asking_price, l.item_description;
END;
$$;