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
  total_connections: number
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
        progression: progressionResult.data,
        recentTranscripts: transcriptsResult.data || [],
        achievements: achievementsResult.data || [],
        currentGPA: gpaResult.data
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
          total_connections: 0,
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
   * Update overall GPA and degree progression
   */
  async updateAcademicProgress(userId?: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const targetUserId = userId || user?.id
      
      if (!targetUserId) throw new Error('User not authenticated')

      // Calculate cumulative GPA
      const { data: transcripts } = await supabase
        .from('academic_transcripts')
        .select('grade_points, credit_hours, bacon_earned_course, successful_referrals')
        .eq('user_id', targetUserId)

      if (!transcripts || transcripts.length === 0) return

      const totalQualityPoints = transcripts.reduce((sum, t) => sum + (t.grade_points * t.credit_hours), 0)
      const totalCreditHours = transcripts.reduce((sum, t) => sum + t.credit_hours, 0)
      const totalBacon = transcripts.reduce((sum, t) => sum + t.bacon_earned_course, 0)
      const totalReferrals = transcripts.reduce((sum, t) => sum + t.successful_referrals, 0)
      
      const overallGPA = totalCreditHours > 0 ? totalQualityPoints / totalCreditHours : 0.0

      // Determine new degree level
      const newDegreeLevel = await this.determineDegreeLevel(totalBacon, totalReferrals, overallGPA)

      // Update degree progression
      await supabase
        .from('degree_progression')
        .update({
          overall_gpa: overallGPA,
          total_credit_hours: totalCreditHours,
          total_bacon_earned: totalBacon,
          total_successful_referrals: totalReferrals,
          current_degree: newDegreeLevel,
          last_activity_date: new Date().toISOString()
        })
        .eq('user_id', targetUserId)

      // Create GPA calculation record
      await supabase
        .from('gpa_calculations')
        .insert({
          user_id: targetUserId,
          calculation_type: 'cumulative',
          gpa_value: overallGPA,
          total_quality_points: totalQualityPoints,
          total_credit_hours: totalCreditHours,
          courses_included: transcripts.length
        })

    } catch (error) {
      console.error('Error updating academic progress:', error)
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
        .select('overall_gpa, total_bacon_earned, total_connections')
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
        actual_connections: progression?.total_connections || 0,
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
   * Complete a course and assign grade
   */
  async completeCourse(
    transcriptId: string,
    finalGrade: string,
    baconEarned: number,
    successfulReferrals: number
  ): Promise<void> {
    try {
      // Grade point mapping
      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
      }

      const points = gradePoints[finalGrade] || 0.0

      // Get credit hours for quality points calculation
      const { data: transcript } = await supabase
        .from('academic_transcripts')
        .select('credit_hours, user_id')
        .eq('id', transcriptId)
        .single()

      if (!transcript) throw new Error('Transcript not found')

      const qualityPoints = points * transcript.credit_hours

      // Update transcript
      await supabase
        .from('academic_transcripts')
        .update({
          final_grade: finalGrade,
          grade_points: points,
          quality_points: qualityPoints,
          bacon_earned_course: baconEarned,
          successful_referrals: successfulReferrals,
          completion_date: new Date().toISOString()
        })
        .eq('id', transcriptId)

      // Update overall academic progress
      await this.updateAcademicProgress(transcript.user_id)

      // Check for achievements
      await this.checkAndAwardAchievements(transcript.user_id, finalGrade, baconEarned)

    } catch (error) {
      console.error('Error completing course:', error)
      throw new Error('Failed to complete course')
    }
  },

  /**
   * Check and award achievements based on performance
   */
  async checkAndAwardAchievements(
    userId: string,
    grade: string,
    baconEarned: number
  ): Promise<void> {
    try {
      // Award grade-based achievements
      if (grade === 'A+' || grade === 'A') {
        await this.awardAchievement(
          'honor_roll',
          'Academic Excellence',
          'Achieved A grade in a course'
        )
      }

      // Award bacon milestone achievements
      if (baconEarned >= 100) {
        await this.awardAchievement(
          'earnings',
          'Century Earner',
          'Earned over $100 bacon in a single course'
        )
      }

      if (baconEarned >= 500) {
        await this.awardAchievement(
          'earnings',
          'Bacon Scholar',
          'Earned over $500 bacon in a single course'
        )
      }

    } catch (error) {
      console.error('Error checking achievements:', error)
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
      console.error('Error fetching transcript:', error)
      throw new Error('Failed to fetch transcript')
    }
  },

  /**
   * Get user's achievements
   */
  async getAchievements(): Promise<Achievement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('academic_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching achievements:', error)
      return []
    }
  },

  /**
   * Generate academic report card
   */
  async generateReportCard(semester?: string, academicYear?: string): Promise<{
    semester: string
    academicYear: string
    courses: AcademicTranscript[]
    semesterGPA: number
    cumulativeGPA: number
    totalCredits: number
    achievements: Achievement[]
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get current or specified semester
      const currentDate = new Date()
      const targetSemester = semester || (currentDate.getMonth() >= 6 ? 'Fall' : 'Spring') + ' ' + currentDate.getFullYear()
      const targetYear = academicYear || currentDate.getFullYear().toString() + '-' + (currentDate.getFullYear() + 1).toString().slice(-2)

      const [coursesResult, progressionResult, achievementsResult] = await Promise.all([
        supabase
          .from('academic_transcripts')
          .select('*')
          .eq('user_id', user.id)
          .eq('semester', targetSemester)
          .eq('academic_year', targetYear),

        supabase
          .from('degree_progression')
          .select('overall_gpa, total_credit_hours')
          .eq('user_id', user.id)
          .single(),

        supabase
          .from('academic_achievements')
          .select('*')
          .eq('user_id', user.id)
          .eq('semester_earned', targetSemester)
      ])

      const courses = coursesResult.data || []
      const semesterGPA = await this.calculateSemesterGPA(targetSemester, targetYear)

      return {
        semester: targetSemester,
        academicYear: targetYear,
        courses,
        semesterGPA,
        cumulativeGPA: progressionResult.data?.overall_gpa || 0.0,
        totalCredits: progressionResult.data?.total_credit_hours || 0.0,
        achievements: achievementsResult.data || []
      }

    } catch (error) {
      console.error('Error generating report card:', error)
      throw new Error('Failed to generate report card')
    }
  }
}