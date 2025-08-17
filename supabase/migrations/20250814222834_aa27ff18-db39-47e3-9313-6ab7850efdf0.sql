-- Temporarily remove the foreign key constraint for admin setup
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

-- Insert the admin user without foreign key constraint
INSERT INTO admin_users (
    user_id,
    role,
    permissions,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Temporary UUID for admin
    'super_admin',
    '{
        "user_management": true,
        "listing_management": true,
        "fraud_investigation": true,
        "site_configuration": true,
        "analytics_access": true,
        "system_administration": true
    }'::jsonb,
    'active'
) ON CONFLICT (user_id) DO NOTHING;

-- Note: In a real production environment, you would:
-- 1. Have the admin sign up normally through the auth flow
-- 2. Then grant them admin privileges through this table
-- This is a temporary solution for testing purposes