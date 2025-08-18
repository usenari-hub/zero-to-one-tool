-- Create the single admin user kevinadmin
-- First, we need to insert the user into auth.users (this would normally be done through signup)
-- But since we want only one specific admin, we'll handle this specially

-- Insert the admin user record into admin_users table
-- Note: The user_id will need to match the actual auth.users id after the user signs up
-- For now, let's create a placeholder that can be updated

-- Create a function to check if user is the specific admin
CREATE OR REPLACE FUNCTION public.is_kevin_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user email is kevinadmin and exists in admin_users
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users au
    JOIN public.admin_users adu ON au.id = adu.user_id
    WHERE au.id = auth.uid() 
    AND au.email = 'kevinadmin@uob.edu'
    AND adu.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update all admin policies to use the new function
DROP POLICY IF EXISTS "Admin users can manage admin table" ON public.admin_users;
CREATE POLICY "Only Kevin admin can manage admin table" 
ON public.admin_users 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin actions access" ON public.admin_actions;
CREATE POLICY "Only Kevin admin actions access" 
ON public.admin_actions 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin advertisements access" ON public.advertisements;
CREATE POLICY "Only Kevin admin advertisements access" 
ON public.advertisements 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin analytics access" ON public.analytics_metrics;
CREATE POLICY "Only Kevin admin analytics access" 
ON public.analytics_metrics 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admins can read audit trail" ON public.audit_trail;
CREATE POLICY "Only Kevin admin can read audit trail" 
ON public.audit_trail 
FOR SELECT 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admins can modify audit trail" ON public.audit_trail;
CREATE POLICY "Only Kevin admin can modify audit trail" 
ON public.audit_trail 
FOR UPDATE
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admins can delete audit trail" ON public.audit_trail;
CREATE POLICY "Only Kevin admin can delete audit trail" 
ON public.audit_trail 
FOR DELETE
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin email templates access" ON public.email_templates;
CREATE POLICY "Only Kevin admin email templates access" 
ON public.email_templates 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin feature flags access" ON public.feature_flags;
CREATE POLICY "Only Kevin admin feature flags access" 
ON public.feature_flags 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin fraud reports access" ON public.fraud_reports;
CREATE POLICY "Only Kevin admin fraud reports access" 
ON public.fraud_reports 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin media access" ON public.media_library;
CREATE POLICY "Only Kevin admin media access" 
ON public.media_library 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admin can manage charity fund" ON public.charity_fund;
CREATE POLICY "Only Kevin admin can manage charity fund" 
ON public.charity_fund 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admins can manage all violations" ON public.content_violations;
CREATE POLICY "Only Kevin admin can manage all violations" 
ON public.content_violations 
FOR ALL 
USING (public.is_kevin_admin());

DROP POLICY IF EXISTS "Admins can manage all chat messages" ON public.listing_chat_messages;
CREATE POLICY "Only Kevin admin can manage all chat messages" 
ON public.listing_chat_messages 
FOR ALL 
USING (public.is_kevin_admin());

-- Create a trigger function to automatically add the admin user to admin_users table when they sign up
CREATE OR REPLACE FUNCTION public.handle_kevin_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Only add to admin_users if this is the kevinadmin email
  IF NEW.email = 'kevinadmin@uob.edu' THEN
    INSERT INTO public.admin_users (user_id, role, status, permissions)
    VALUES (
      NEW.id, 
      'super_admin', 
      'active',
      jsonb_build_object(
        'can_manage_users', true,
        'can_manage_listings', true,
        'can_manage_fraud', true,
        'can_manage_system', true,
        'can_access_analytics', true
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set up admin user when kevinadmin signs up
DROP TRIGGER IF EXISTS on_kevin_admin_created ON auth.users;
CREATE TRIGGER on_kevin_admin_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email = 'kevinadmin@uob.edu')
  EXECUTE FUNCTION public.handle_kevin_admin_signup();

-- Prevent anyone else from being added to admin_users table
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_admin_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow if the user is kevinadmin email
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.user_id 
    AND email = 'kevinadmin@uob.edu'
  ) THEN
    RAISE EXCEPTION 'Unauthorized admin creation attempt';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to prevent unauthorized admin creation
DROP TRIGGER IF EXISTS prevent_unauthorized_admin ON public.admin_users;
CREATE TRIGGER prevent_unauthorized_admin
  BEFORE INSERT ON public.admin_users
  FOR EACH ROW 
  EXECUTE FUNCTION public.prevent_unauthorized_admin_creation();