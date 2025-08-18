-- Fix infinite recursion in admin_users RLS policy
-- First drop the problematic policy
DROP POLICY IF EXISTS "Admin users only" ON public.admin_users;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new policies for admin_users table
CREATE POLICY "Admin users can manage admin table" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin());

-- Also fix any other admin-related policies that might have the same issue
DROP POLICY IF EXISTS "Admin actions access" ON public.admin_actions;
CREATE POLICY "Admin actions access" 
ON public.admin_actions 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin advertisements access" ON public.advertisements;
CREATE POLICY "Admin advertisements access" 
ON public.advertisements 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin analytics access" ON public.analytics_metrics;
CREATE POLICY "Admin analytics access" 
ON public.analytics_metrics 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin audit trail access" ON public.audit_trail;
CREATE POLICY "Admin audit trail access" 
ON public.audit_trail 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin email templates access" ON public.email_templates;
CREATE POLICY "Admin email templates access" 
ON public.email_templates 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin feature flags access" ON public.feature_flags;
CREATE POLICY "Admin feature flags access" 
ON public.feature_flags 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin fraud reports access" ON public.fraud_reports;
CREATE POLICY "Admin fraud reports access" 
ON public.fraud_reports 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin media access" ON public.media_library;
CREATE POLICY "Admin media access" 
ON public.media_library 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage charity fund" ON public.charity_fund;
CREATE POLICY "Admin can manage charity fund" 
ON public.charity_fund 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all violations" ON public.content_violations;
CREATE POLICY "Admins can manage all violations" 
ON public.content_violations 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all chat messages" ON public.listing_chat_messages;
CREATE POLICY "Admins can manage all chat messages" 
ON public.listing_chat_messages 
FOR ALL 
USING (public.is_admin());