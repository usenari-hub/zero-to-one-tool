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

-- Image watermarking tracking
-- Prevents reverse image searches to identify sellers
CREATE TABLE watermarked_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    original_image_url VARCHAR(500) NOT NULL,
    watermarked_image_url VARCHAR(500) NOT NULL,
    watermark_type VARCHAR(50) DEFAULT 'university_logo', -- 'university_logo', 'anonymous_overlay', 'blur_edges'
    processing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'complete', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seller performance metrics (anonymized)
-- Stores safe performance data that can be shown publicly
CREATE TABLE anonymous_seller_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anonymous_profile_id UUID REFERENCES anonymous_profiles(id) ON DELETE CASCADE,
    total_sales_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    response_time_hours INTEGER DEFAULT 24, -- Average response time
    completion_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage of completed sales
    academic_gpa DECIMAL(3,2) DEFAULT 0.00, -- University-themed performance metric
    honor_roll_status BOOLEAN DEFAULT FALSE,
    deans_list_status BOOLEAN DEFAULT FALSE,
    graduation_status VARCHAR(50) DEFAULT 'enrolled', -- 'enrolled', 'graduated', 'professor'
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anonymous listing history
-- Tracks what anonymous profiles have listed (for consistency)
CREATE TABLE anonymous_listing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anonymous_profile_id UUID REFERENCES anonymous_profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    listing_status VARCHAR(50) NOT NULL, -- 'active', 'sold', 'expired', 'removed'
    department VARCHAR(100), -- 'School of Technology', 'Automotive Academy', etc.
    price_range VARCHAR(50), -- '$0-500', '$501-2000', etc. (for stats only)
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_anonymous_profiles_listing_id ON anonymous_profiles(listing_id);
CREATE INDEX idx_anonymous_profiles_seller_id ON anonymous_profiles(real_seller_id);
CREATE INDEX idx_contact_lockdown_listing_buyer ON contact_lockdown(listing_id, buyer_id);
CREATE INDEX idx_contact_lockdown_payment_id ON contact_lockdown(escrow_payment_id);
CREATE INDEX idx_verification_badges_profile_id ON verification_badges(anonymous_profile_id);
CREATE INDEX idx_watermarked_images_listing_id ON watermarked_images(listing_id);
CREATE INDEX idx_anonymous_stats_profile_id ON anonymous_seller_stats(anonymous_profile_id);
CREATE INDEX idx_anonymous_history_profile_id ON anonymous_listing_history(anonymous_profile_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE anonymous_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lockdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE watermarked_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_seller_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_listing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own anonymous profiles
CREATE POLICY "Users can view their own anonymous profiles" ON anonymous_profiles
    FOR SELECT USING (real_seller_id = auth.uid());

-- RLS Policy: Users can only see contact lockdown for their own transactions
CREATE POLICY "Users can view their own contact lockdown records" ON contact_lockdown
    FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- RLS Policy: Verification badges are publicly viewable
CREATE POLICY "Verification badges are publicly viewable" ON verification_badges
    FOR SELECT USING (true);

-- RLS Policy: Anonymous stats are publicly viewable
CREATE POLICY "Anonymous stats are publicly viewable" ON anonymous_seller_stats
    FOR SELECT USING (true);

-- RLS Policy: Anonymous listing history is publicly viewable (for stats)
CREATE POLICY "Anonymous listing history is publicly viewable" ON anonymous_listing_history
    FOR SELECT USING (true);

-- Create functions for automatic anonymous profile generation
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

-- Create function to reveal seller contact after payment
CREATE OR REPLACE FUNCTION reveal_seller_contact(payment_intent_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    lockdown_record RECORD;
BEGIN
    -- Find the contact lockdown record
    SELECT * INTO lockdown_record
    FROM contact_lockdown
    WHERE escrow_payment_id = payment_intent_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update the record to reveal contact
    UPDATE contact_lockdown
    SET 
        contact_revealed = TRUE,
        revelation_date = NOW(),
        purchase_confirmed = TRUE
    WHERE id = lockdown_record.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create anonymous profiles for new listings
CREATE OR REPLACE FUNCTION create_anonymous_profile_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create anonymous profile for certain listing types
    IF NEW.category IN ('technology', 'automotive', 'real_estate', 'arts', 'services', 'luxury') THEN
        PERFORM generate_anonymous_profile(NEW.id, NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The actual trigger creation should be done after the listings table is confirmed to exist
-- CREATE TRIGGER create_anonymous_profile_on_listing
--     AFTER INSERT ON listings
--     FOR EACH ROW
--     EXECUTE FUNCTION create_anonymous_profile_trigger();