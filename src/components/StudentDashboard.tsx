import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Award,
  BookOpen,
  Target,
  ChevronRight
} from 'lucide-react';
import { useAcademicData } from '@/hooks/useAcademicData';
import { useBaconBank } from '@/hooks/useBaconBank';
import { AcademicTimeline } from '@/components/AcademicTimeline';

export const StudentDashboard: React.FC = () => {
  const { 
    progression, 
    recentTranscripts, 
    achievements, 
    loading: academicLoading 
  } = useAcademicData();
  
  const { 
    balance, 
    loading: baconLoading 
  } = useBaconBank();

  const degreeProgression = [
    '👨‍🎓 Freshman',
    '📚 Sophomore', 
    '🎯 Junior',
    '🏆 Senior',
    '👨‍💼 Graduate Student',
    '👨‍🏫 Professor',
    '👑 Dean'
  ];

  const getCurrentStepIndex = () => {
    const degreeMap: { [key: string]: number } = {
      'freshman': 0,
      'sophomore': 1,
      'junior': 2,
      'senior': 3,
      'graduate': 4,
      'professor': 5,
      'dean': 6
    };
    return degreeMap[progression?.current_degree || 'freshman'] || 0;
  };

  const getNextDegreeRequirements = () => {
    const current = progression?.current_degree || 'freshman';
    const requirements: { [key: string]: { bacon: number, referrals: number, gpa: number, credits: number } } = {
      'freshman': { bacon: 500, referrals: 5, gpa: 2.0, credits: 30 },
      'sophomore': { bacon: 2000, referrals: 20, gpa: 2.5, credits: 60 },
      'junior': { bacon: 5000, referrals: 50, gpa: 2.8, credits: 90 },
      'senior': { bacon: 20000, referrals: 200, gpa: 3.2, credits: 120 },
      'graduate': { bacon: 50000, referrals: 500, gpa: 3.5, credits: 150 },
      'professor': { bacon: 100000, referrals: 1000, gpa: 3.8, credits: 180 }
    };
    return requirements[current] || requirements.freshman;
  };

  const requirements = getNextDegreeRequirements();
  const currentBacon = balance?.lifetimeEarnings || 0;
  const currentReferrals = progression?.total_successful_referrals || 0;
  const gpa = progression?.overall_gpa || 0;
  const credits = progression?.total_credit_hours || 0;

  const getProgressPercent = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Academic Status Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Degree</p>
                <p className="text-2xl font-bold capitalize">{progression?.current_degree || 'Freshman'}</p>
                <p className="text-sm text-muted-foreground">{progression?.major || 'Network Science'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">GPA</p>
                <p className="text-2xl font-bold">{gpa.toFixed(2)}</p>
                <Badge variant={gpa >= 3.5 ? 'default' : gpa >= 3.0 ? 'secondary' : 'destructive'}>
                  {gpa >= 3.8 ? "Dean's List" : gpa >= 3.5 ? 'Honor Roll' : gpa >= 3.0 ? 'Good Standing' : 'Needs Improvement'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bacon Earned</p>
                <p className="text-2xl font-bold">${currentBacon.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{currentReferrals} successful referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Journey Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Academic Journey</span>
          </CardTitle>
          <CardDescription>
            Your progression through the University of Bacon degree program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AcademicTimeline 
            items={degreeProgression} 
            currentStep={getCurrentStepIndex()} 
          />
        </CardContent>
      </Card>

      {/* Detailed Dashboard */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Next Degree Requirements</span>
              </CardTitle>
              <CardDescription>
                Complete these requirements to advance to the next academic level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bacon Earned</span>
                    <span>${currentBacon.toFixed(0)} / ${requirements.bacon}</span>
                  </div>
                  <Progress value={getProgressPercent(currentBacon, requirements.bacon)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Successful Referrals</span>
                    <span>{currentReferrals} / {requirements.referrals}</span>
                  </div>
                  <Progress value={getProgressPercent(currentReferrals, requirements.referrals)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>GPA Requirement</span>
                    <span>{gpa.toFixed(2)} / {requirements.gpa.toFixed(1)}</span>
                  </div>
                  <Progress value={getProgressPercent(gpa, requirements.gpa)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credit Hours</span>
                    <span>{credits.toFixed(0)} / {requirements.credits}</span>
                  </div>
                  <Progress value={getProgressPercent(credits, requirements.credits)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your latest academic transcript entries</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTranscripts.length > 0 ? (
                <div className="space-y-4">
                  {recentTranscripts.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{course.course_title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.course_code} • {course.semester} • {course.credit_hours} credits
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={course.final_grade === 'A' || course.final_grade === 'A+' ? 'default' : 'secondary'}>
                          {course.final_grade}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${course.bacon_earned_course.toFixed(2)} bacon
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your first listing to begin earning academic credits!</p>
                  <Button>Browse Course Catalog</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Achievements</CardTitle>
              <CardDescription>Your badges and milestones at University of Bacon</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-3xl">{achievement.badge_icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.achievement_name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.achievement_description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Earned: {new Date(achievement.earned_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                  <p className="text-muted-foreground mb-4">Complete academic milestones to earn your first badges!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Analytics</CardTitle>
              <CardDescription>Performance insights and academic statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Academic Standing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Honor Roll Semesters</span>
                      <span>{progression?.honor_roll_semesters || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dean's List Semesters</span>
                      <span>{progression?.deans_list_semesters || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Connections Made</span>
                      <span>{progression?.total_connections_made || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Grade</span>
                      <span>{gpa > 0 ? gpa.toFixed(2) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span>
                        {progression?.total_connections_made && progression?.total_successful_referrals 
                          ? `${((progression.total_successful_referrals / progression.total_connections_made) * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Bacon per Referral</span>
                      <span>
                        ${progression?.total_successful_referrals && currentBacon > 0
                          ? (currentBacon / progression.total_successful_referrals).toFixed(2)
                          : '0.00'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};