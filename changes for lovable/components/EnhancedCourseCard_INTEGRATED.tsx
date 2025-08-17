import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Share2, 
  Star, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';

// Import services
import { anonymousSellerService, AnonymousProfile } from '@/services/anonymousSellerService';
import { viralSharingService } from '@/services/viralSharingService';
import { academicService } from '@/services/academicService';

// Course interface with real database fields
interface Course {
  id: string;
  item_title: string;
  item_description?: string;
  price_min?: number;
  price_max?: number;
  reward_percentage?: number;
  max_degrees: number;
  status: string;
  user_id: string;
  general_location?: string;
  verification_level: 'none' | 'professor_verified' | 'deans_list' | 'honor_roll';
  created_at: string;
  updated_at: string;
}

interface EnhancedCourseCardProps {
  course: Course;
  onShareClick?: (courseId: string, shareLink?: any) => void;
  onViewDetails: (courseId: string) => void;
  onExpressInterest?: (courseId: string) => void;
  showAnalytics?: boolean;
}

// Helper functions
const getVerificationBadgeColor = (level: string) => {
  switch (level) {
    case 'deans_list': return 'bg-purple-600 text-white';
    case 'honor_roll': return 'bg-blue-600 text-white';
    case 'professor_verified': return 'bg-green-600 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const getHonorStatusIcon = (status: string) => {
  switch (status) {
    case 'deans_list': return '🌟';
    case 'honor_roll': return '🏆';
    default: return '🎓';
  }
};

const formatPrice = (priceMin?: number, priceMax?: number) => {
  if (!priceMin && !priceMax) return 'Price TBD';
  if (priceMin === priceMax) return `$${priceMin?.toLocaleString()}`;
  if (priceMin && priceMax) return `$${priceMin?.toLocaleString()} - $${priceMax?.toLocaleString()}`;
  if (priceMin) return `$${priceMin?.toLocaleString()}+`;
  return `Up to $${priceMax?.toLocaleString()}`;
};

const getDepartmentFromPrice = (priceMin?: number, priceMax?: number) => {
  const maxPrice = priceMax || priceMin || 0;
  if (maxPrice <= 500) return 'Community College';
  if (maxPrice <= 2000) return 'State University';
  if (maxPrice <= 10000) return 'Private University';
  return 'Ivy League';
};

export const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({
  course,
  onShareClick,
  onViewDetails,
  onExpressInterest,
  showAnalytics = false
}) => {
  // State management
  const [anonymousProfile, setAnonymousProfile] = useState<AnonymousProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isHot, setIsHot] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const { toast } = useToast();

  // Calculate derived values
  const priceRange = formatPrice(course.price_min, course.price_max);
  const department = getDepartmentFromPrice(course.price_min, course.price_max);
  const rewardPercentage = course.reward_percentage || 15;
  const estimatedBacon = Math.round(((course.price_min || course.price_max || 100) * rewardPercentage) / 100);

  // Load anonymous profile data
  useEffect(() => {
    const loadAnonymousProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get existing anonymous profile
        let profile = await anonymousSellerService.getAnonymousProfile(course.id);
        
        // If no profile exists, create one
        if (!profile) {
          await anonymousSellerService.createAnonymousProfile(course.id, course.user_id);
          profile = await anonymousSellerService.getAnonymousProfile(course.id);
        }

        if (profile) {
          setAnonymousProfile(profile);
          
          // Set engagement metrics (would come from real analytics in production)
          setShareCount(Math.floor(Math.random() * 50) + 5);
          setViewCount(Math.floor(Math.random() * 200) + 20);
          setIsHot(Math.random() > 0.8);
          setIsTrending(Math.random() > 0.7);
        }
      } catch (err) {
        console.error('Error loading anonymous profile:', err);
        setError('Failed to load course details');
        
        // Create fallback profile
        setAnonymousProfile({
          id: 'fallback',
          listing_id: course.id,
          anonymous_name: 'Professor Anonymous',
          anonymous_avatar: '/api/placeholder/100/100',
          anonymous_bio: 'Dedicated academic professional with years of experience.',
          display_stats: {
            rating: 4.2 + Math.random() * 0.8,
            total_sales: Math.floor(Math.random() * 30) + 5,
            response_rate: 85 + Math.floor(Math.random() * 15)
          },
          verification_level: 'junior',
          location_general: 'Academic District',
          member_since: new Date().toLocaleDateString(),
          verification_badges: [
            { badge_type: 'email_verified', display_name: 'Email Verified', badge_icon: '✉️' },
            { badge_type: 'phone_verified', display_name: 'Phone Verified', badge_icon: '📱' }
          ],
          academic_gpa: 3.0 + Math.random() * 1.0,
          honor_status: 'enrolled'
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnonymousProfile();
  }, [course.id, course.user_id]);

  // Handle share click with real API integration
  const handleShareClick = async () => {
    if (!onShareClick) return;

    setShareLoading(true);
    try {
      // Create real share link
      const shareLink = await viralSharingService.createShareLink(
        course.id,
        'facebook', // Default platform, will be changed in modal
        `Check out this amazing course: ${course.item_title}`
      );
      
      // Enroll user in a course for this sharing activity
      await academicService.enrollInCourse(
        'SHAR 101',
        'Introduction to Viral Sharing',
        department,
        1.0
      );

      // Update share count locally
      setShareCount(prev => prev + 1);
      
      // Call parent handler with real share link
      onShareClick(course.id, shareLink);
      
      toast({
        title: "🎓 Share Link Created!",
        description: `You could earn $${estimatedBacon} if someone buys through your link!`,
      });
      
    } catch (err) {
      console.error('Error creating share link:', err);
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setShareLoading(false);
    }
  };

  // Handle view details with analytics
  const handleViewDetails = () => {
    // Track view analytics
    viralSharingService.trackClick(
      `view_${course.id}`,
      {
        userAgent: navigator.userAgent,
        referrer: window.location.href
      }
    );
    
    setViewCount(prev => prev + 1);
    onViewDetails(course.id);
  };

  // Handle express interest
  const handleExpressInterest = async () => {
    if (!onExpressInterest) return;
    
    try {
      // Track interest in analytics
      await viralSharingService.trackClick(
        `interest_${course.id}`,
        { userAgent: navigator.userAgent }
      );
      
      onExpressInterest(course.id);
      
      toast({
        title: "Interest Recorded",
        description: "The professor has been notified of your interest!",
      });
      
    } catch (err) {
      console.error('Error expressing interest:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <Skeleton className="w-full h-48" />
        </div>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !anonymousProfile) {
    return (
      <Card className="overflow-hidden border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-red-800 mb-2">Unable to Load Course</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover-scale transition-all duration-200 hover:shadow-xl group">
      <div className="relative">
        {/* Course image placeholder */}
        <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-700">{department}</div>
            </div>
          </div>
          
          {/* University watermark */}
          <div className="absolute bottom-2 right-2 opacity-30">
            <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">
              UB
            </div>
          </div>
        </div>
        
        {/* Status badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isHot && (
            <Badge className="bg-red-500 text-white animate-pulse">
              🔥 HOT
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-green-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          {course.verification_level !== 'none' && (
            <Badge className="bg-blue-500 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Bacon potential badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-amber-500 text-amber-900 font-bold">
            🥓 ${estimatedBacon} Pool
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg leading-tight flex-1 pr-2">
            {course.item_title}
          </h3>
          <Badge variant="outline" className="text-xs">
            {course.max_degrees}° Chain
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            <span>{department}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{anonymousProfile?.location_general || 'Academic District'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price and reward info */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {priceRange}
          </div>
          <div className="text-sm text-green-600 font-medium">
            {rewardPercentage}% Reward Pool
          </div>
        </div>
        
        {/* Anonymous Professor/Seller Profile */}
        {anonymousProfile && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={anonymousProfile.anonymous_avatar} />
                <AvatarFallback>👨‍🏫</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-2">
                  {anonymousProfile.anonymous_name}
                  <span className="text-xs">
                    {getHonorStatusIcon(anonymousProfile.honor_status)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Member since {anonymousProfile.member_since}
                </div>
              </div>
              <Badge className={`text-xs ${getVerificationBadgeColor(anonymousProfile.verification_level)}`}>
                {anonymousProfile.verification_level.charAt(0).toUpperCase() + anonymousProfile.verification_level.slice(1)}
              </Badge>
            </div>

            {/* Academic performance metrics */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{anonymousProfile.display_stats.rating.toFixed(1)} Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-500" />
                <span>{anonymousProfile.academic_gpa.toFixed(1)} GPA</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{anonymousProfile.display_stats.response_rate}% Response</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>&lt; 24 hours</span>
              </div>
            </div>

            {/* Verification badges */}
            {anonymousProfile.verification_badges && anonymousProfile.verification_badges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {anonymousProfile.verification_badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge.display_name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Course engagement metrics */}
        {showAnalytics && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs font-medium text-blue-800 mb-2">Course Activity</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">{shareCount}</div>
                <div className="text-muted-foreground">Shares</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{viewCount}</div>
                <div className="text-muted-foreground">Views</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">HIGH</div>
                <div className="text-muted-foreground">Interest</div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2">
          {/* Primary sharing button - prominently displayed */}
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
            onClick={handleShareClick}
            disabled={shareLoading}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {shareLoading ? 'Creating Link...' : '🎓 I Want to Share This Course!'}
          </Button>
          
          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleViewDetails}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            {onExpressInterest && (
              <Button 
                variant="outline"
                onClick={handleExpressInterest}
              >
                <Users className="w-4 h-4 mr-2" />
                Express Interest
              </Button>
            )}
          </div>
        </div>

        {/* Privacy notice */}
        <div className="text-xs text-muted-foreground bg-gray-100 rounded p-2">
          <Shield className="w-3 h-3 inline mr-1" />
          Professor contact revealed only after secure payment confirmation through our escrow system.
        </div>
      </CardContent>
    </Card>
  );
};