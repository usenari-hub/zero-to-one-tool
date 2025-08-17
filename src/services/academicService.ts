import { supabase } from '@/integrations/supabase/client'

export interface AcademicTranscript {
  id: string
  user_id: string
  semester: string
  academic_year: string
  course_code: string
  course_title: string
  department: string
  credit_hours: number
  final_grade: string
  grade_points: number
  quality_points: number
  bacon_earned_course: number
  successful_referrals: number
  created_at: string
}

export interface DegreeProgression {
  id: string
  user_id: string
  current_degree: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | 'professor' | 'dean'
  degree_title: string
  major: string
  minor?: string
  overall_gpa: number
  major_gpa: number
  total_credit_hours: number
  credits_needed_next_level: number
  total_bacon_earned: number
  total_connections_made: number
  total_successful_referrals: number
  academic_standing: 'excellent' | 'good' | 'probation' | 'dean_list'
  honor_roll_semesters: number
  deans_list_semesters: number
  expected_graduation_date?: string
  last_activity_date: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  achievement_name: string
  achievement_description: string
  semester_earned?: string
  academic_year?: string
  actual_gpa: number
  actual_bacon: number
  actual_connections: number
  badge_icon: string
  is_public: boolean
  earned_date: string
}

export interface GPACalculation {
  id: string
  user_id: string
  calculation_type: 'semester' | 'cumulative' | 'major' | 'recent'
  semester?: string
  academic_year?: string
  gpa_value: number
  total_quality_points: number
  total_credit_hours: number
  courses_included: number
  class_rank?: number
  percentile?: number
  honor_status?: string
}

export const academicService = {
  /**
   * Get comprehensive academic dashboard data
   */
  async getDashboard(): Promise<{
    progression: DegreeProgression | null
    recentTranscripts: AcademicTranscript[]
    achievements: Achievement[]
    currentGPA: GPACalculation | null
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Initialize academic progression if it doesn't exist
      await this.initializeAcademicProgression(user.id)

      const [progressionResult, transcriptsResult, achievementsResult, gpaResult] = await Promise.all([
        supabase
          .from('degree_progression')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        
        supabase
          .from('academic_transcripts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('academic_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_date', { ascending: false })
          .limit(10),

        supabase
          .from('gpa_calculations')
          .select('*')
          .eq('user_id', user.id)
          .eq('calculation_type', 'cumulative')
          .order('calculation_date', { ascending: false })
          .limit(1)
          .single()
      ])

      return {
        progression: progressionResult.data ? {
          ...progressionResult.data,
          current_degree: progressionResult.data.current_degree as 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | 'professor' | 'dean',
          academic_standing: progressionResult.data.academic_standing as 'excellent' | 'good' | 'probation' | 'dean_list'
        } : null,
        recentTranscripts: transcriptsResult.data || [],
        achievements: achievementsResult.data || [],
        currentGPA: gpaResult.data ? {
          ...gpaResult.data,
          calculation_type: gpaResult.data.calculation_type as 'semester' | 'cumulative' | 'major' | 'recent'
        } : null
      }
    } catch (error) {
      console.error('Error fetching academic dashboard:', error)
      throw new Error('Failed to fetch academic dashboard')
    }
  },

  /**
   * Initialize academic progression for new users
   */
  async initializeAcademicProgression(userId: string): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('degree_progression')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existing) return // Already initialized

      await supabase
        .from('degree_progression')
        .insert({
          user_id: userId,
          current_degree: 'freshman',
          degree_title: 'Bachelor of Social Commerce',
          major: 'Network Science',
          overall_gpa: 0.00,
          total_credit_hours: 0.0,
          credits_needed_next_level: 30.0,
          total_bacon_earned: 0.00,
          total_connections_made: 0,
          academic_standing: 'good'
        })

    } catch (error) {
      console.error('Error initializing academic progression:', error)
    }
  },

  /**
   * Calculate GPA for a specific semester
   */
  async calculateSemesterGPA(semester: string, academicYear: string): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .rpc('calculate_semester_gpa', {
          user_uuid: user.id,
          semester_name: semester,
          year: academicYear
        })

      if (error) throw error
      return data || 0.0
    } catch (error) {
      console.error('Error calculating semester GPA:', error)
      return 0.0
    }
  },

  /**
   * Award achievement to user
   */
  async awardAchievement(
    achievementType: string,
    achievementName: string,
    achievementDescription: string,
    semester?: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if user already has this achievement
      const { data: existing } = await supabase
        .from('academic_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_type', achievementType)
        .eq('semester_earned', semester || null)
        .single()

      if (existing) return false // Already has this achievement

      // Get current user stats
      const { data: progression } = await supabase
        .from('degree_progression')
        .select('overall_gpa, total_bacon_earned, total_connections_made')
        .eq('user_id', user.id)
        .single()

      const achievement = {
        user_id: user.id,
        achievement_type: achievementType,
        achievement_name: achievementName,
        achievement_description: achievementDescription,
        semester_earned: semester,
        academic_year: new Date().getFullYear().toString(),
        actual_gpa: progression?.overall_gpa || 0,
        actual_bacon: progression?.total_bacon_earned || 0,
        actual_connections: progression?.total_connections_made || 0,
        badge_icon: this.getAchievementIcon(achievementType),
        is_public: true
      }

      const { error } = await supabase
        .from('academic_achievements')
        .insert(achievement)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error awarding achievement:', error)
      return false
    }
  },

  /**
   * Get achievement icon based on type
   */
  getAchievementIcon(achievementType: string): string {
    const icons: Record<string, string> = {
      'honor_roll': '🏆',
      'deans_list': '🌟',
      'networking': '🔗',
      'earnings': '🥓',
      'sharing': '📤',
      'conversion': '💰',
      'streak': '🔥',
      'graduation': '🎓',
      'milestone': '🎯'
    }
    return icons[achievementType] || '🏅'
  },

  /**
   * Enroll user in a course (create transcript entry)
   */
  async enrollInCourse(
    courseCode: string,
    courseTitle: string,
    department: string,
    creditHours: number = 3.0,
    semester?: string,
    academicYear?: string
  ): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const currentDate = new Date()
      const currentSemester = semester || (currentDate.getMonth() >= 6 ? 'Fall' : 'Spring') + ' ' + currentDate.getFullYear()
      const currentYear = academicYear || currentDate.getFullYear().toString() + '-' + (currentDate.getFullYear() + 1).toString().slice(-2)

      const { data, error } = await supabase
        .from('academic_transcripts')
        .insert({
          user_id: user.id,
          semester: currentSemester,
          academic_year: currentYear,
          course_code: courseCode,
          course_title: courseTitle,
          department: department,
          credit_hours: creditHours,
          final_grade: 'IP', // In Progress
          grade_points: 0.00,
          quality_points: 0.00,
          bacon_earned_course: 0.00,
          successful_referrals: 0
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw new Error('Failed to enroll in course')
    }
  },

  /**
   * Get full academic transcript
   */
  async getFullTranscript(): Promise<AcademicTranscript[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('academic_transcripts')
        .select('*')
        .eq('user_id', user.id)
        .order('semester', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching full transcript:', error)
      throw new Error('Failed to fetch transcript')
    }
  },

  /**
   * Determine degree level based on achievements
   */
  async determineDegreeLevel(
    totalBacon: number, 
    totalReferrals: number, 
    currentGPA: number
  ): Promise<string> {
    // Degree progression thresholds
    if (totalBacon >= 100000 && totalReferrals >= 1000 && currentGPA >= 3.8) {
      return 'dean'
    } else if (totalBacon >= 50000 && totalReferrals >= 500 && currentGPA >= 3.5) {
      return 'professor'
    } else if (totalBacon >= 20000 && totalReferrals >= 200 && currentGPA >= 3.2) {
      return 'graduate'
    } else if (totalBacon >= 5000 && totalReferrals >= 50 && currentGPA >= 2.8) {
      return 'senior'
    } else if (totalBacon >= 2000 && totalReferrals >= 20 && currentGPA >= 2.5) {
      return 'junior'
    } else if (totalBacon >= 500 && totalReferrals >= 5 && currentGPA >= 2.0) {
      return 'sophomore'
    } else {
      return 'freshman'
    }
  }
}