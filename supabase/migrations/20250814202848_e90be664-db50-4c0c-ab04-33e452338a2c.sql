-- Fix Security Definer function by adding proper RLS policies and security checks

-- First, let's add an INSERT policy for anonymous_profiles that allows users to create profiles for their own listings
CREATE POLICY "Users can create anonymous profiles for their listings" 
ON public.anonymous_profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE id = anonymous_profiles.listing_id 
    AND user_id = auth.uid()
  )
);

-- Now we can recreate the function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.generate_anonymous_profile(listing_id uuid, seller_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SET search_path TO 'public'
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
    -- Security check: Ensure the caller owns the listing
    IF NOT EXISTS (
        SELECT 1 FROM public.listings 
        WHERE id = listing_id 
        AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied: You can only create anonymous profiles for your own listings';
    END IF;
    
    -- Security check: Ensure seller_id matches the current user
    IF seller_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: seller_id must match your user ID';
    END IF;
    
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
        'Academic District',
        jsonb_build_object(
            'rating', 4.0 + (random() * 1.0),
            'total_sales', (random() * 50)::int,
            'response_rate', 85 + (random() * 15)::int
        )
    ) RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$;