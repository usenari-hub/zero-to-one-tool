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

CREATE INDEX idx_gpa_calculations_user_id ON gpa_calculations(user_id);
CREATE INDEX idx_gpa_calculations_type ON gpa_calculations(calculation_type);
CREATE INDEX idx_gpa_calculations_semester ON gpa_calculations(semester, academic_year);

-- Enable RLS (Row Level Security)
ALTER TABLE academic_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE degree_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transcripts" ON academic_transcripts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own achievements" ON academic_achievements
    FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can view their own degree progression" ON degree_progression
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own GPA calculations" ON gpa_calculations
    FOR SELECT USING (user_id = auth.uid());

-- Calculate GPA for a user and semester function
CREATE OR REPLACE FUNCTION calculate_semester_gpa(user_uuid UUID, semester_name VARCHAR, year VARCHAR)
RETURNS DECIMAL 
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;