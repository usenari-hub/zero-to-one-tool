-- Anonymous Seller Protection Database Schema
-- This schema creates the tables needed to protect seller identity until purchase completion
-- Part of the University of Bacon billion-dollar social commerce platform

-- Anonymous seller profiles table
-- Stores anonymized seller information that's shown to potential buyers
CREATE TABLE anonymous_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    anonymous_name VARCHAR(100) NOT NULL, -- Professor Anonymous, Dr. Bacon, etc.
    anonymous_avatar VARCHAR(255) NOT NULL, -- Consistent avatar URL
    anonymous_bio TEXT, -- Generic academic-style bio
    display_stats JSONB NOT NULL DEFAULT '{}', -- Safe stats to show (rating, sales count, etc.)
    verification_level VARCHAR(50) NOT NULL DEFAULT 'freshman', -- freshman, sophomore, junior, senior, graduate, professor
    location_general VARCHAR(100), -- City/State only, no specific address
    member_since DATE NOT NULL DEFAULT CURRENT_DATE,
    real_seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact lockdown table
-- Ensures seller contact info is only revealed after purchase confirmation
CREATE TABLE contact_lockdown (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    escrow_payment_id VARCHAR(255), -- Stripe payment intent ID
    contact_revealed BOOLEAN DEFAULT FALSE,
    revelation_date TIMESTAMP WITH TIME ZONE,
    purchase_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(listing_id, buyer_id)
);

-- Anonymous verification badges
-- Different verification levels with academic theming
CREATE TABLE verification_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anonymous_profile_id UUID REFERENCES anonymous_profiles(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL, -- 'email_verified', 'phone_verified', 'id_verified', 'background_check'
    badge_level VARCHAR(50) NOT NULL, -- 'freshman', 'sophomore', 'junior', 'senior', 'graduate', 'professor'
    display_name VARCHAR(100) NOT NULL, -- 'Email Verified Student', 'Dean's List Member', etc.
    badge_icon VARCHAR(255), -- Icon URL for the badge
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_date TIMESTAMP WITH TIME ZONE, -- Some badges may expire
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX idx_anonymous_profiles_listing_id ON anonymous_profiles(listing_id);
CREATE INDEX idx_anonymous_profiles_seller_id ON anonymous_profiles(real_seller_id);
CREATE INDEX idx_contact_lockdown_listing_buyer ON contact_lockdown(listing_id, buyer_id);
CREATE INDEX idx_contact_lockdown_payment_id ON contact_lockdown(escrow_payment_id);
CREATE INDEX idx_verification_badges_profile_id ON verification_badges(anonymous_profile_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE anonymous_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lockdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own anonymous profiles
CREATE POLICY "Users can view their own anonymous profiles" ON anonymous_profiles
    FOR SELECT USING (real_seller_id = auth.uid());

-- RLS Policy: Users can only see contact lockdown for their own transactions
CREATE POLICY "Users can view their own contact lockdown records" ON contact_lockdown
    FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- RLS Policy: Verification badges are publicly viewable
CREATE POLICY "Verification badges are publicly viewable" ON verification_badges
    FOR SELECT USING (true);

-- Create function for automatic anonymous profile generation
CREATE OR REPLACE FUNCTION generate_anonymous_profile(listing_id UUID, seller_id UUID)
RETURNS UUID AS $$
DECLARE
    profile_id UUID;
    anonymous_names TEXT[] := ARRAY[
        'Professor Anonymous', 'Dr. Bacon', 'Dean Scholar', 'Prof. Network',
        'Academic Seller', 'University Professor', 'Dr. Commerce', 'Prof. Degree',
        'Dean Anonymous', 'Academic Expert', 'University Seller', 'Prof. Bachelor',
        'Dr. Masters', 'Dean Doctorate', 'Academic Professional'
    ];
    academic_bios TEXT[] := ARRAY[
        'Dedicated academic professional with years of experience in their field.',
        'University-affiliated seller committed to academic excellence.',
        'Experienced professional with strong academic credentials.',
        'Academic community member focused on quality transactions.',
        'Long-standing university community member with excellent reputation.'
    ];
    verification_levels TEXT[] := ARRAY['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'professor'];
BEGIN
    INSERT INTO anonymous_profiles (
        listing_id,
        real_seller_id,
        anonymous_name,
        anonymous_avatar,
        anonymous_bio,
        verification_level,
        location_general,
        display_stats
    ) VALUES (
        listing_id,
        seller_id,
        anonymous_names[1 + (random() * (array_length(anonymous_names, 1) - 1))::int],
        '/assets/anonymous-avatars/professor-' || (1 + (random() * 10)::int) || '.png',
        academic_bios[1 + (random() * (array_length(academic_bios, 1) - 1))::int],
        verification_levels[1 + (random() * (array_length(verification_levels, 1) - 1))::int],
        'Academic District', -- Generic location
        jsonb_build_object(
            'rating', 4.0 + (random() * 1.0),
            'total_sales', (random() * 50)::int,
            'response_rate', 85 + (random() * 15)::int
        )
    ) RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;