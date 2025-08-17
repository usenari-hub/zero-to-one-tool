-- Create test listings with real data for sharing tools demonstration
INSERT INTO listings (
  user_id,
  item_title,
  item_description,
  price_min,
  price_max,
  reward_percentage,
  max_degrees,
  general_location,
  status,
  verification_level
) VALUES 
  -- Test listing 1: MacBook Pro
  (
    '00000000-0000-0000-0000-000000000001',
    'MacBook Pro 16" M3 Max - Like New',
    'Barely used MacBook Pro with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for CS students or professionals. Includes original charger and box.',
    2800.00,
    3200.00,
    25.00,
    6,
    'University District',
    'active',
    'sophomore'
  ),
  -- Test listing 2: Calculus Textbook
  (
    '00000000-0000-0000-0000-000000000001', 
    'Stewart Calculus 8th Edition + Solutions Manual',
    'Complete calculus textbook set in excellent condition. Saved me in MATH 124-126! Has some highlighting but all pages intact.',
    180.00,
    220.00,
    20.00,
    4,
    'Campus Area',
    'active',
    'junior'
  ),
  -- Test listing 3: Dorm Furniture
  (
    '00000000-0000-0000-0000-000000000001',
    'Complete Dorm Room Setup - Desk, Chair, Mini Fridge',
    'Moving out and selling everything! IKEA desk, ergonomic chair, and compact mini fridge. Perfect condition, smoke-free dorm.',
    450.00,
    550.00,
    15.00,
    3,
    'Greek Row',
    'active', 
    'senior'
  ),
  -- Test listing 4: Gaming Setup
  (
    '00000000-0000-0000-0000-000000000001',
    'Gaming PC + Monitor Setup - RTX 4070',
    'Custom built gaming PC with RTX 4070, Ryzen 7, 32GB RAM. Includes 27" 144hz monitor and mechanical keyboard. Great for CS projects and gaming!',
    1800.00,
    2200.00,
    30.00,
    6,
    'Tech District',
    'active',
    'graduate'
  );