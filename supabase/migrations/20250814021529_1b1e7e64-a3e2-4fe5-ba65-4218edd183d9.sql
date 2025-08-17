-- Fix security warnings by setting proper search paths for functions
DROP FUNCTION IF EXISTS public.generate_anonymous_profile(uuid, uuid);
CREATE OR REPLACE FUNCTION public.generate_anonymous_profile(listing_id uuid, seller_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
        'Academic District',
        jsonb_build_object(
            'rating', 4.0 + (random() * 1.0),
            'total_sales', (random() * 50)::int,
            'response_rate', 85 + (random() * 15)::int
        )
    ) RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$function$;

DROP FUNCTION IF EXISTS public.generate_tracking_code();
CREATE OR REPLACE FUNCTION public.generate_tracking_code()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, (random() * length(chars))::int + 1, 1);
    END LOOP;
    RETURN result;
END;
$function$;

DROP FUNCTION IF EXISTS public.calculate_semester_gpa(uuid, character varying, character varying);
CREATE OR REPLACE FUNCTION public.calculate_semester_gpa(user_uuid uuid, semester_name character varying, year character varying)
 RETURNS numeric
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    total_quality_points DECIMAL := 0;
    total_credit_hours DECIMAL := 0;
    calculated_gpa DECIMAL;
BEGIN
    SELECT 
        COALESCE(SUM(quality_points), 0),
        COALESCE(SUM(credit_hours), 0)
    INTO total_quality_points, total_credit_hours
    FROM academic_transcripts
    WHERE user_id = user_uuid
    AND semester = semester_name
    AND academic_year = year;
    
    IF total_credit_hours > 0 THEN
        calculated_gpa := total_quality_points / total_credit_hours;
    ELSE
        calculated_gpa := 0.00;
    END IF;
    
    INSERT INTO gpa_calculations (
        user_id, calculation_type, semester, academic_year,
        gpa_value, total_quality_points, total_credit_hours,
        courses_included
    ) VALUES (
        user_uuid, 'semester', semester_name, year,
        calculated_gpa, total_quality_points, total_credit_hours,
        (SELECT COUNT(*) FROM academic_transcripts 
         WHERE user_id = user_uuid AND semester = semester_name AND academic_year = year)
    )
    ON CONFLICT (user_id, calculation_type, semester, academic_year)
    DO UPDATE SET
        gpa_value = calculated_gpa,
        total_quality_points = total_quality_points,
        total_credit_hours = total_credit_hours,
        calculation_date = NOW();
    
    RETURN calculated_gpa;
END;
$function$;