-- Create admin user with simpler approach
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Create admin user with email kevinbacon@admin.com
    -- Note: This is a simplified approach. In production, use proper auth signup flow
    
    -- Insert the admin user into the admin_users table  
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
    );
    
    -- Log the admin user creation
    INSERT INTO admin_actions (
        admin_user_id,
        action_type,
        target_type,
        reason
    ) VALUES (
        (SELECT id FROM admin_users WHERE user_id = '00000000-0000-0000-0000-000000000001'),
        'admin_user_created',
        'system',
        'Initial admin user setup for kevinbacon'
    );
    
END $$;