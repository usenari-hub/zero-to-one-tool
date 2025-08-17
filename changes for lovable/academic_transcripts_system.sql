-- Academic Transcripts and University System Database Schema
-- Complete university-themed academic system with transcripts, GPA, and achievements
-- Part of the University of Bacon billion-dollar social commerce platform

-- Academic transcripts table
-- Stores university-style academic records for each user's networking achievements
CREATE TABLE academic_transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL, -- 'Spring 2024', 'Fall 2024', etc.
    academic_year VARCHAR(10) NOT NULL, -- '2024-25'
    
    -- Course information (mapped to sharing/networking activities)
    course_code VARCHAR(20) NOT NULL, -- 'BACON 101', 'NTWK 201', etc.
    course_title VARCHAR(255) NOT NULL, -- 'Introduction to Social Commerce'
    department VARCHAR(100) NOT NULL, -- 'School of Technology', 'Automotive Academy'
    credit_hours DECIMAL(3,1) DEFAULT 3.0,
    
    -- Performance metrics
    assignments_completed INTEGER DEFAULT 0, -- Shares created
    participation_score DECIMAL(5,2) DEFAULT 0.00, -- Engagement level
    final_grade VARCHAR(5) NOT NULL, -- 'A+', 'A', 'B+', etc.
    grade_points DECIMAL(3,2) NOT NULL, -- 4.0 scale
    quality_points DECIMAL(6,2) NOT NULL, -- credit_hours * grade_points
    
    -- Networking achievements
    connections_made INTEGER DEFAULT 0, -- People in referral chains
    successful_referrals INTEGER DEFAULT 0, -- Completed purchases
    bacon_earned_course DECIMAL(10,2) DEFAULT 0.00, -- Bacon from this "course"
    networking_efficiency DECIMAL(5,2) DEFAULT 0.00, -- Success rate
    
    -- Academic metadata
    professor_name VARCHAR(100) DEFAULT 'Prof. Anonymous', -- Anonymous instructor
    course_description TEXT,
    learning_outcomes TEXT[],
    honors BOOLEAN DEFAULT FALSE, -- Exceptional performance
    deans_list BOOLEAN DEFAULT FALSE, -- Top 10% performance
    
    -- Administrative
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE,
    transcript_locked BOOLEAN DEFAULT FALSE, -- Official transcript
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, semester, course_code)
);

-- Academic achievements and honors
-- University-style achievements for networking milestones
CREATE TABLE academic_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Achievement details
    achievement_type VARCHAR(50) NOT NULL, -- 'honor_roll', 'deans_list', 'valedictorian', 'summa_cum_laude'
    achievement_name VARCHAR(200) NOT NULL,
    achievement_description TEXT,
    achievement_level VARCHAR(50), -- 'semester', 'annual', 'lifetime'
    
    -- Academic context
    semester_earned VARCHAR(50),
    academic_year VARCHAR(10),
    department VARCHAR(100),
    
    -- Requirements met
    gpa_requirement DECIMAL(3,2), -- Minimum GPA needed
    actual_gpa DECIMAL(3,2), -- User's actual GPA when earned
    bacon_threshold DECIMAL(10,2), -- Minimum bacon earned
    actual_bacon DECIMAL(10,2), -- Actual bacon when earned
    networking_threshold INTEGER, -- Minimum connections needed
    actual_connections INTEGER, -- Actual connections when earned
    
    -- Visual representation
    badge_icon VARCHAR(255), -- Badge image URL
    certificate_template VARCHAR(255), -- Certificate template
    display_order INTEGER DEFAULT 0, -- Order to display achievements
    
    -- Status
    is_public BOOLEAN DEFAULT TRUE, -- Show on public profile
    is_verified BOOLEAN DEFAULT TRUE, -- Official achievement
    
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_date TIMESTAMP WITH TIME ZONE, -- Some achievements may expire
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic degree progression
-- Tracks progression through academic "degrees" based on networking success
CREATE TABLE degree_progression (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Current degree status
    current_degree VARCHAR(50) NOT NULL DEFAULT 'freshman', -- 'freshman', 'sophomore', 'junior', 'senior', 'graduate', 'professor', 'dean'
    degree_title VARCHAR(200), -- 'Bachelor of Social Commerce', 'Master of Network Science'
    major VARCHAR(100), -- 'Social Commerce', 'Network Engineering', 'Viral Marketing'
    minor VARCHAR(100), -- Optional specialization
    concentration VARCHAR(100), -- Specific focus area
    
    -- Academic progress
    total_credit_hours DECIMAL(6,1) DEFAULT 0.0,
    credits_needed_next_level DECIMAL(6,1) DEFAULT 30.0,
    overall_gpa DECIMAL(3,2) DEFAULT 0.00,
    major_gpa DECIMAL(3,2) DEFAULT 0.00,
    
    -- Networking achievements
    total_bacon_earned DECIMAL(12,2) DEFAULT 0.00,
    total_connections_made INTEGER DEFAULT 0,
    total_successful_referrals INTEGER DEFAULT 0,
    network_reach INTEGER DEFAULT 0, -- People in extended network
    
    -- Academic standing
    academic_standing VARCHAR(50) DEFAULT 'good', -- 'excellent', 'good', 'probation', 'dean_list'
    honor_roll_semesters INTEGER DEFAULT 0,
    deans_list_semesters INTEGER DEFAULT 0,
    
    -- Degree requirements tracking
    core_requirements_completed JSONB DEFAULT '{}',
    elective_requirements_completed JSONB DEFAULT '{}',
    specialization_requirements JSONB DEFAULT '{}',
    thesis_project_id UUID, -- For graduate degrees
    
    -- Graduation info
    expected_graduation_date DATE,
    actual_graduation_date DATE,
    graduation_honors VARCHAR(50), -- 'summa_cum_laude', 'magna_cum_laude', 'cum_laude'
    
    -- Administrative
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Course catalog (mapping real activities to academic courses)
-- Defines how real-world networking activities map to academic courses
CREATE TABLE course_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Course identification
    course_code VARCHAR(20) NOT NULL UNIQUE, -- 'BACON 101', 'NTWK 201'
    course_title VARCHAR(255) NOT NULL,
    course_description TEXT,
    department VARCHAR(100) NOT NULL,
    
    -- Academic details
    credit_hours DECIMAL(3,1) DEFAULT 3.0,
    difficulty_level VARCHAR(50) DEFAULT 'undergraduate', -- 'undergraduate', 'graduate', 'doctoral'
    prerequisites TEXT[], -- Array of prerequisite course codes
    
    -- Mapping to real activities
    activity_type VARCHAR(50) NOT NULL, -- 'sharing', 'referral', 'conversion', 'networking'
    success_criteria JSONB NOT NULL, -- What defines success in this course
    grading_rubric JSONB NOT NULL, -- How to calculate grades
    
    -- Course logistics
    duration_weeks INTEGER DEFAULT 16, -- Length of "semester"
    max_enrollments INTEGER, -- Limit concurrent students
    professor_name VARCHAR(100) DEFAULT 'Prof. Anonymous',
    
    -- Performance tracking
    total_enrollments INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_grade DECIMAL(3,2) DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_honors_course BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GPA calculations and academic periods
-- Stores calculated GPA for different time periods and contexts
CREATE TABLE gpa_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- GPA context
    calculation_type VARCHAR(50) NOT NULL, -- 'semester', 'cumulative', 'major', 'recent'
    semester VARCHAR(50), -- Specific semester (if applicable)
    academic_year VARCHAR(10), -- Academic year
    
    -- GPA metrics
    gpa_value DECIMAL(3,2) NOT NULL,
    total_quality_points DECIMAL(8,2) NOT NULL,
    total_credit_hours DECIMAL(6,1) NOT NULL,
    courses_included INTEGER NOT NULL,
    
    -- Performance context
    class_rank INTEGER, -- Rank among all students
    percentile DECIMAL(5,2), -- Percentile ranking
    honor_status VARCHAR(50), -- 'honor_roll', 'deans_list', 'academic_probation'
    
    -- Networking context (what drove this GPA)
    total_bacon_period DECIMAL(10,2) DEFAULT 0.00,
    successful_referrals_period INTEGER DEFAULT 0,
    networking_efficiency DECIMAL(5,2) DEFAULT 0.00,
    
    -- Calculation metadata
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_official BOOLEAN DEFAULT TRUE, -- Official transcript vs. estimated
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, calculation_type, semester, academic_year)
);

-- Alumni network and graduation records
-- Official graduation records and alumni networking
CREATE TABLE alumni_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Graduation details
    graduation_date DATE NOT NULL,
    degree_type VARCHAR(50) NOT NULL, -- 'bachelor', 'master', 'phd', 'certificate'
    degree_title VARCHAR(200) NOT NULL,
    major VARCHAR(100) NOT NULL,
    minor VARCHAR(100),
    
    -- Academic honors
    graduation_gpa DECIMAL(3,2) NOT NULL,
    graduation_honors VARCHAR(50), -- 'summa_cum_laude', etc.
    special_recognitions TEXT[],
    
    -- Thesis/Capstone (for graduate degrees)
    thesis_title VARCHAR(500),
    thesis_abstract TEXT,
    thesis_advisor VARCHAR(100),
    thesis_committee TEXT[],
    
    -- Lifetime achievements
    lifetime_bacon_earned DECIMAL(15,2) DEFAULT 0.00,
    lifetime_connections INTEGER DEFAULT 0,
    lifetime_referrals INTEGER DEFAULT 0,
    network_impact_score DECIMAL(8,2) DEFAULT 0.00,
    
    -- Alumni engagement
    alumni_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'honorary'
    mentorship_available BOOLEAN DEFAULT FALSE,
    industry_expertise TEXT[],
    current_role VARCHAR(200),
    
    -- Legacy tracking
    students_mentored INTEGER DEFAULT 0,
    referrals_after_graduation INTEGER DEFAULT 0,
    continued_bacon_earnings DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, graduation_date, degree_type)
);

-- Create indexes for performance
CREATE INDEX idx_academic_transcripts_user_id ON academic_transcripts(user_id);
CREATE INDEX idx_academic_transcripts_semester ON academic_transcripts(semester, academic_year);
CREATE INDEX idx_academic_transcripts_department ON academic_transcripts(department);
CREATE INDEX idx_academic_transcripts_grade ON academic_transcripts(final_grade, grade_points);

CREATE INDEX idx_academic_achievements_user_id ON academic_achievements(user_id);
CREATE INDEX idx_academic_achievements_type ON academic_achievements(achievement_type);
CREATE INDEX idx_academic_achievements_earned_date ON academic_achievements(earned_date);

CREATE INDEX idx_degree_progression_user_id ON degree_progression(user_id);
CREATE INDEX idx_degree_progression_current_degree ON degree_progression(current_degree);
CREATE INDEX idx_degree_progression_gpa ON degree_progression(overall_gpa);

CREATE INDEX idx_course_catalog_code ON course_catalog(course_code);
CREATE INDEX idx_course_catalog_department ON course_catalog(department);
CREATE INDEX idx_course_catalog_activity_type ON course_catalog(activity_type);

CREATE INDEX idx_gpa_calculations_user_id ON gpa_calculations(user_id);
CREATE INDEX idx_gpa_calculations_type ON gpa_calculations(calculation_type);
CREATE INDEX idx_gpa_calculations_semester ON gpa_calculations(semester, academic_year);

CREATE INDEX idx_alumni_records_user_id ON alumni_records(user_id);
CREATE INDEX idx_alumni_records_graduation_date ON alumni_records(graduation_date);
CREATE INDEX idx_alumni_records_degree_type ON alumni_records(degree_type);

-- Enable RLS (Row Level Security)
ALTER TABLE academic_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE degree_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transcripts" ON academic_transcripts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own achievements" ON academic_achievements
    FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can view their own degree progression" ON degree_progression
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Course catalog is publicly viewable" ON course_catalog
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own GPA calculations" ON gpa_calculations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Alumni records are publicly viewable for active alumni" ON alumni_records
    FOR SELECT USING (alumni_status = 'active');

-- Functions for academic system

-- Calculate GPA for a user and semester
CREATE OR REPLACE FUNCTION calculate_semester_gpa(user_uuid UUID, semester_name VARCHAR, year VARCHAR)
RETURNS DECIMAL AS $$
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
    
    -- Insert or update GPA calculation record
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
$$ LANGUAGE plpgsql;

-- Determine academic degree level based on achievements
CREATE OR REPLACE FUNCTION determine_degree_level(user_uuid UUID)
RETURNS VARCHAR AS $$
DECLARE
    total_bacon DECIMAL;
    total_referrals INTEGER;
    current_gpa DECIMAL;
    degree_level VARCHAR;
BEGIN
    -- Get user's current stats
    SELECT 
        COALESCE(total_bacon_earned, 0),
        COALESCE(total_successful_referrals, 0),
        COALESCE(overall_gpa, 0)
    INTO total_bacon, total_referrals, current_gpa
    FROM degree_progression
    WHERE user_id = user_uuid;
    
    -- Determine degree level based on achievements
    CASE 
        WHEN total_bacon >= 100000 AND total_referrals >= 1000 AND current_gpa >= 3.8 THEN
            degree_level := 'dean';
        WHEN total_bacon >= 50000 AND total_referrals >= 500 AND current_gpa >= 3.5 THEN
            degree_level := 'professor';
        WHEN total_bacon >= 20000 AND total_referrals >= 200 AND current_gpa >= 3.2 THEN
            degree_level := 'graduate';
        WHEN total_bacon >= 5000 AND total_referrals >= 50 AND current_gpa >= 2.8 THEN
            degree_level := 'senior';
        WHEN total_bacon >= 2000 AND total_referrals >= 20 AND current_gpa >= 2.5 THEN
            degree_level := 'junior';
        WHEN total_bacon >= 500 AND total_referrals >= 5 AND current_gpa >= 2.0 THEN
            degree_level := 'sophomore';
        ELSE
            degree_level := 'freshman';
    END CASE;
    
    -- Update degree progression
    UPDATE degree_progression
    SET 
        current_degree = degree_level,
        last_activity_date = NOW(),
        updated_at = NOW()
    WHERE user_id = user_uuid;
    
    RETURN degree_level;
END;
$$ LANGUAGE plpgsql;

-- Award academic achievement
CREATE OR REPLACE FUNCTION award_achievement(
    user_uuid UUID,
    achievement_type_val VARCHAR,
    achievement_name_val VARCHAR,
    semester_val VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_stats RECORD;
BEGIN
    -- Get current user stats
    SELECT 
        overall_gpa,
        total_bacon_earned,
        total_connections_made
    INTO user_stats
    FROM degree_progression
    WHERE user_id = user_uuid;
    
    -- Insert achievement if it doesn't exist
    INSERT INTO academic_achievements (
        user_id,
        achievement_type,
        achievement_name,
        semester_earned,
        actual_gpa,
        actual_bacon,
        actual_connections
    ) VALUES (
        user_uuid,
        achievement_type_val,
        achievement_name_val,
        semester_val,
        user_stats.overall_gpa,
        user_stats.total_bacon_earned,
        user_stats.total_connections_made
    )
    ON CONFLICT (user_id, achievement_type, semester_earned) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create course enrollment when user starts networking activity
CREATE OR REPLACE FUNCTION enroll_in_course(
    user_uuid UUID,
    course_code_val VARCHAR,
    semester_val VARCHAR,
    year_val VARCHAR
)
RETURNS UUID AS $$
DECLARE
    course_info RECORD;
    enrollment_id UUID;
BEGIN
    -- Get course information
    SELECT * INTO course_info
    FROM course_catalog
    WHERE course_code = course_code_val;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Course % not found in catalog', course_code_val;
    END IF;
    
    -- Create transcript entry
    INSERT INTO academic_transcripts (
        user_id,
        semester,
        academic_year,
        course_code,
        course_title,
        department,
        credit_hours,
        final_grade,
        grade_points,
        quality_points,
        course_description
    ) VALUES (
        user_uuid,
        semester_val,
        year_val,
        course_info.course_code,
        course_info.course_title,
        course_info.department,
        course_info.credit_hours,
        'IP', -- In Progress
        0.00, -- Will be calculated later
        0.00, -- Will be calculated later
        course_info.course_description
    )
    RETURNING id INTO enrollment_id;
    
    RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql;

-- Initialize academic progression for new user
CREATE OR REPLACE FUNCTION initialize_academic_progression(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Create degree progression record
    INSERT INTO degree_progression (
        user_id,
        current_degree,
        degree_title,
        major,
        overall_gpa,
        total_credit_hours
    ) VALUES (
        user_uuid,
        'freshman',
        'Bachelor of Social Commerce',
        'Network Science',
        0.00,
        0.0
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Triggers and automation (to be created after tables exist)
-- CREATE TRIGGER initialize_academic_progression_trigger
--     AFTER INSERT ON profiles
--     FOR EACH ROW
--     EXECUTE FUNCTION initialize_academic_progression(NEW.id);