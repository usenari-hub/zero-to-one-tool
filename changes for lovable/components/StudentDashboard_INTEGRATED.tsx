import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  GraduationCap,
  Award,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Trophy,
  Star,
  BookOpen,
  Target,
  Zap,
  Download,
  Bell,
  Settings,
  BarChart3,
  ChevronRight,
  Clock,
  MapPin,
  Shield,
  AlertCircle
} from 'lucide-react';

// Import services
import { academicService, DegreeProgression, AcademicTranscript, Achievement } from '@/services/academicService';
import { baconBankService, BaconBalance } from '@/services/baconBankService';
import { viralSharingService, SharingMomentum } from '@/services/viralSharingService';

interface StudentDashboardProps {
  userId?: string;
}

// Helper functions
const getDegreeIcon = (degree: string) => {
  switch (degree.toLowerCase()) {
    case 'freshman': return '🌟';
    case 'sophomore': return '📚';
    case 'junior': return '🎯';
    case 'senior': return '🏆';
    case 'graduate': return '🎓';
    case 'professor': return '👨‍🏫';
    case 'dean': return '👑';
    default: return '🎓';
  }
};

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600';
  if (grade.startsWith('B')) return 'text-blue-600';
  if (grade.startsWith('C')) return 'text-yellow-600';
  if (grade.startsWith('D')) return 'text-orange-600';
  return 'text-red-600';
};

const getAcademicStandingColor = (standing: string) => {
  switch (standing.toLowerCase()) {
    case 'dean_list': return 'bg-purple-100 text-purple-800';
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-blue-100 text-blue-800';
    case 'probation': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [degreeProgress, setDegreeProgress] = useState<DegreeProgression | null>(null);
  const [academicRecord, setAcademicRecord] = useState<AcademicTranscript[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [baconBalance, setBaconBalance] = useState<BaconBalance | null>(null);
  const [sharingMomentum, setSharingMomentum] = useState<SharingMomentum | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { toast } = useToast();

  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [academicData, baconData, momentumData, transcripts, userAchievements] = await Promise.all([
          academicService.getDashboard(),
          baconBankService.getBalance(),
          viralSharingService.getSharingMomentum(),
          academicService.getFullTranscript(),
          academicService.getAchievements()
        ]);

        setDegreeProgress(academicData.progression);
        setAcademicRecord(transcripts.slice(0, 5)); // Recent 5
        setAchievements(userAchievements.slice(0, 10)); // Recent 10
        setBaconBalance(baconData);
        setSharingMomentum(momentumData);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        toast({
          title: "Error Loading Dashboard",
          description: "Some data may not be up to date. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId, toast]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate derived values
  const progressToNextDegree = degreeProgress ? 
    ((degreeProgress.total_credit_hours / 120) * 100) : 0;
  
  const semesterGPA = academicRecord
    .filter(record => record.semester.includes('2024'))
    .reduce((sum, record, _, arr) => 
      arr.length > 0 ? sum + (record.grade_points * record.credit_hours) / arr.reduce((total, r) => total + r.credit_hours, 0) : 0, 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-amber-900 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-16 w-64" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-12 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error && !degreeProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Dashboard Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
      {/* University Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-amber-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">University of Bacon</h1>
                <p className="text-blue-200">Student Information System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-lg font-medium">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/api/placeholder/150/150" />
              <AvatarFallback className="text-2xl">
                {getDegreeIcon(degreeProgress?.current_degree || 'freshman')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Student #UB{userId?.slice(-6) || '123456'}</h2>
                <Badge className={getAcademicStandingColor(degreeProgress?.academic_standing || 'good')}>
                  {degreeProgress?.academic_standing?.replace('_', ' ') || 'Good Standing'}
                </Badge>
                <Badge variant="outline">
                  {degreeProgress?.current_degree || 'Freshman'} Status
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Degree:</span>
                  <div className="font-medium">{degreeProgress?.degree_title || 'Bachelor of Social Commerce'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Major:</span>
                  <div className="font-medium">{degreeProgress?.major || 'Network Science'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Overall GPA:</span>
                  <div className="font-medium text-lg">{degreeProgress?.overall_gpa?.toFixed(2) || '0.00'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Expected Graduation:</span>
                  <div className="font-medium">{degreeProgress?.expected_graduation_date || 'TBD'}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="bacon-bank">Bacon Bank</TabsTrigger>
            <TabsTrigger value="chains">My Chains</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Total Bacon Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${baconBalance?.lifetimeEarnings?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Available: ${baconBalance?.availableBalance?.toFixed(2) || '0.00'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Network Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {degreeProgress?.total_connections || 0}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    +{Math.floor(Math.random() * 15) + 5} new this week
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    Current GPA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {degreeProgress?.overall_gpa?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">
                    Semester: {semesterGPA.toFixed(2) || '0.00'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    Sharing Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">
                    {sharingMomentum?.current_streak_days || 0}
                  </div>
                  <div className="text-sm text-amber-700 mt-1">
                    Days in a row
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Degree Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Degree Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Progress to Graduation</span>
                    <span className="text-sm text-gray-600">
                      {degreeProgress?.total_credit_hours || 0}/120 Credits
                    </span>
                  </div>
                  <Progress value={progressToNextDegree} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {120 - (degreeProgress?.total_credit_hours || 0)} credits remaining • 
                    Projected graduation: {degreeProgress?.expected_graduation_date || 'TBD'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Recent Academic Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {academicRecord.slice(0, 3).map((transcript, index) => (
                      <div key={transcript.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{transcript.course_code}: {transcript.course_title}</div>
                          <div className="text-sm text-gray-600">
                            Grade: <span className={getGradeColor(transcript.final_grade)}>{transcript.final_grade}</span> • 
                            Bacon: ${transcript.bacon_earned_course.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{transcript.semester}</div>
                      </div>
                    ))}
                    
                    {achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl">{achievement.badge_icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.achievement_name}</div>
                          <div className="text-sm text-gray-600">{achievement.achievement_description}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(achievement.earned_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Current Semester Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Maintain 3.5+ GPA</span>
                        <span className="text-green-600">
                          {(degreeProgress?.overall_gpa || 0) >= 3.5 ? '✓ Achieved' : `${((degreeProgress?.overall_gpa || 0) / 3.5 * 100).toFixed(0)}%`}
                        </span>
                      </div>
                      <Progress value={Math.min(((degreeProgress?.overall_gpa || 0) / 3.5) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Earn $500 in Bacon</span>
                        <span>{Math.min(((baconBalance?.lifetimeEarnings || 0) / 500) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(((baconBalance?.lifetimeEarnings || 0) / 500) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Complete 15 Credit Hours</span>
                        <span>{Math.min(((degreeProgress?.total_credit_hours || 0) / 15) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(((degreeProgress?.total_credit_hours || 0) / 15) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Build 50 New Connections</span>
                        <span>{Math.min(((degreeProgress?.total_connections || 0) / 50) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(((degreeProgress?.total_connections || 0) / 50) * 100, 100)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transcripts Tab */}
          <TabsContent value="transcripts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Official Academic Transcripts</h3>
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF Transcript
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Academic Record Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{degreeProgress?.overall_gpa?.toFixed(2) || '0.00'}</div>
                    <div className="text-sm text-gray-600">Cumulative GPA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{degreeProgress?.total_credit_hours || 0}</div>
                    <div className="text-sm text-gray-600">Credit Hours Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{academicRecord.length}</div>
                    <div className="text-sm text-gray-600">Courses Completed</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {academicRecord.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-2">
                          <div className="font-semibold">{record.course_code}</div>
                          <div className="text-sm text-gray-600">{record.course_title}</div>
                          <div className="text-xs text-gray-500">{record.department}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Semester</div>
                          <div className="font-medium">{record.semester}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Credits</div>
                          <div className="font-medium">{record.credit_hours}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Grade</div>
                          <div className={`font-bold text-lg ${getGradeColor(record.final_grade)}`}>
                            {record.final_grade}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Bacon Earned</div>
                          <div className="font-medium text-green-600">${record.bacon_earned_course.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-4xl opacity-20">
                    {achievement.badge_icon}
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.badge_icon}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.achievement_name}</CardTitle>
                        <div className="text-sm text-gray-600">
                          {new Date(achievement.earned_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{achievement.achievement_description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant={achievement.is_public ? "default" : "secondary"}>
                        {achievement.is_public ? "Public" : "Private"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would show integrated components */}
          <TabsContent value="bacon-bank">
            <Card>
              <CardHeader>
                <CardTitle>Bacon Bank - Integrated Component</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The integrated BaconBank component would appear here with real balance and transaction data.</p>
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    Available Balance: ${baconBalance?.availableBalance?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-green-700">
                    Pending: ${baconBalance?.pendingEarnings?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chains">
            <Card>
              <CardHeader>
                <CardTitle>My Referral Chains - Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visual chain builder and management tools with real chain data.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics - Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Detailed analytics and performance insights with real user data.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};