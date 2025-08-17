-- Add missing RLS policies for the new tables

-- Policies for share_events table
CREATE POLICY "Users can view share events for their chain links" ON public.share_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.chain_links cl WHERE cl.id = chain_link_id AND cl.referrer_id = auth.uid())
    );

CREATE POLICY "Users can create share events for their chain links" ON public.share_events
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.chain_links cl WHERE cl.id = chain_link_id AND cl.referrer_id = auth.uid())
    );

-- Policies for click_events table  
CREATE POLICY "Users can view click events for their shares" ON public.click_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.share_events se 
            JOIN public.chain_links cl ON se.chain_link_id = cl.id 
            WHERE se.id = share_event_id AND cl.referrer_id = auth.uid()
        )
    );

CREATE POLICY "Public can create click events" ON public.click_events
    FOR INSERT WITH CHECK (true);

-- Policies for contact_locks table
CREATE POLICY "Users can view contact locks for their listings" ON public.contact_locks
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.user_id = auth.uid())
    );

-- Policies for fraud_alerts table
CREATE POLICY "Users can view their own fraud alerts" ON public.fraud_alerts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create fraud alerts" ON public.fraud_alerts
    FOR INSERT WITH CHECK (true);