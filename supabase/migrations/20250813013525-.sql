-- Add missing RLS policy for share_link_analytics table
CREATE POLICY "Users can view analytics for their share links" ON share_link_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM share_links_enhanced 
            WHERE share_links_enhanced.id = share_link_analytics.share_link_id 
            AND share_links_enhanced.user_id = auth.uid()
        )
    );

-- Allow public to insert analytics events (for tracking clicks from non-authenticated users)
CREATE POLICY "Public can insert analytics events" ON share_link_analytics
    FOR INSERT WITH CHECK (true);