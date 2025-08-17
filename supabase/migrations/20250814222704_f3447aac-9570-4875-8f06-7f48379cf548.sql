-- Create admin user with username kevinbacon and password willsueus
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  confirmed_at,
  email_change_sent_at,
  email_change_token_current_candidate,
  email_change_token_new_candidate,
  recovery_sent_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'kevinbacon@admin.com',
  crypt('willsueus', gen_salt('bf')), -- Encrypting password
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '',
  0,
  NULL,
  '{}',
  '{"username": "kevinbacon"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  NOW(),
  NULL,
  '',
  '',
  NULL
);

-- Get the user ID for the admin user we just created
WITH new_admin AS (
  SELECT id FROM auth.users WHERE email = 'kevinbacon@admin.com'
)
-- Insert the admin user into the admin_users table
INSERT INTO admin_users (
  user_id,
  role,
  permissions,
  status
)
SELECT 
  id,
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
FROM new_admin;