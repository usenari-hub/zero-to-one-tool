-- Fix function search path for security
DROP FUNCTION IF EXISTS generate_anonymous_profile(UUID, UUID);

CREATE OR REPLACE FUNCTION generate_anonymous_profile(listing_id UUID, seller_id UUID)
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;