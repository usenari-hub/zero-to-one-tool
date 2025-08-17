import { useState, useEffect, useCallback } from 'react';
import { academicService, DegreeProgression, AcademicTranscript, Achievement } from '@/services/academicService';

interface AcademicDataState {
  progression: DegreeProgression | null;
  recentTranscripts: AcademicTranscript[];
  achievements: Achievement[];
  fullTranscript: AcademicTranscript[];
  loading: boolean;
  error: string | null;
}

interface UseAcademicDataReturn extends AcademicDataState {
  refreshData: () => Promise<void>;
  enrollInCourse: (courseCode: string, courseTitle: string, department: string, creditHours?: number) => Promise<string>;
  awardAchievement: (type: string, name: string, description: string, semester?: string) => Promise<boolean>;
  calculateSemesterGPA: (semester: string, year: string) => Promise<number>;
}

export const useAcademicData = (autoLoad = true): UseAcademicDataReturn => {
  const [state, setState] = useState<AcademicDataState>({
    progression: null,
    recentTranscripts: [],
    achievements: [],
    fullTranscript: [],
    loading: false,
    error: null
  });

  const refreshData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [dashboardData, fullTranscript] = await Promise.all([
        academicService.getDashboard(),
        academicService.getFullTranscript()
      ]);

      setState(prev => ({
        ...prev,
        progression: dashboardData.progression,
        recentTranscripts: dashboardData.recentTranscripts,
        achievements: dashboardData.achievements,
        fullTranscript,
        loading: false
      }));

    } catch (error) {
      console.error('Error refreshing academic data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load academic data'
      }));
    }
  }, []);

  const enrollInCourse = useCallback(async (
    courseCode: string, 
    courseTitle: string, 
    department: string, 
    creditHours = 3.0
  ): Promise<string> => {
    try {
      const transcriptId = await academicService.enrollInCourse(
        courseCode, 
        courseTitle, 
        department, 
        creditHours
      );
      
      // Refresh data to get updated transcript
      await refreshData();
      
      return transcriptId;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }, [refreshData]);

  const awardAchievement = useCallback(async (
    type: string,
    name: string,
    description: string,
    semester?: string
  ): Promise<boolean> => {
    try {
      const awarded = await academicService.awardAchievement(type, name, description, semester);
      
      if (awarded) {
        // Refresh data to get updated achievements
        await refreshData();
      }
      
      return awarded;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      throw error;
    }
  }, [refreshData]);

  const calculateSemesterGPA = useCallback(async (
    semester: string,
    year: string
  ): Promise<number> => {
    try {
      return await academicService.calculateSemesterGPA(semester, year);
    } catch (error) {
      console.error('Error calculating GPA:', error);
      throw error;
    }
  }, []);

  // Auto-load data on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      refreshData();
    }
  }, [autoLoad, refreshData]);

  return {
    ...state,
    refreshData,
    enrollInCourse,
    awardAchievement,
    calculateSemesterGPA
  };
};