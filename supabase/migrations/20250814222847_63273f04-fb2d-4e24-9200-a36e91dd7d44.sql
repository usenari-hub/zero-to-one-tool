-- Simple admin user setup without foreign key constraints
INSERT INTO admin_users (
    user_id,
    role,
    permissions,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
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