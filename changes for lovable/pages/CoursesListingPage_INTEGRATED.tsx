import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  MapPin,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  GraduationCap,
  Zap,
  Target,
  Star,
  Shield,
  AlertCircle,
  Plus,
  RefreshCw,
  Eye,
  Share2
} from 'lucide-react';

// Import integrated components
import { EnhancedCourseCard } from '@/components/EnhancedCourseCard_INTEGRATED';
import { ShareIntentModal } from '@/components/ShareIntentModal_INTEGRATED';

// Import services
import { anonymousSellerService } from '@/services/anonymousSellerService';
import { viralSharingService, ShareLink } from '@/services/viralSharingService';
import { academicService } from '@/services/academicService';

// Course interface matching the database schema
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

interface ListingFilters {
  search: string;
  priceRange: string;
  location: string;
  department: string;
  verificationLevel: string;
  rewardRange: string;
  degreeChain: string;
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export const CoursesListingPage: React.FC = () => {
  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentShareLink, setCurrentShareLink] = useState<ShareLink | null>(null);
  
  // Filter and sort state
  const [filters, setFilters] = useState<ListingFilters>({
    search: '',
    priceRange: '',
    location: '',
    department: '',
    verificationLevel: '',
    rewardRange: '',
    degreeChain: ''
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'created_at',
    direction: 'desc'
  });
  
  // Stats state
  const [listingStats, setListingStats] = useState({
    totalListings: 0,
    averageReward: 0,
    topCategory: '',
    totalValue: 0
  });

  const { toast } = useToast();

  // Load courses and calculate stats
  useEffect(() => {
    loadCoursesData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    applyFiltersAndSort();
  }, [courses, filters, sortOptions]);

  const loadCoursesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, this would fetch from Supabase
      // For now, we'll create mock data that matches the database schema
      const mockCourses: Course[] = [
        {
          id: '1',
          item_title: 'Advanced Viral Marketing Strategies',
          item_description: 'Learn how to create content that spreads like wildfire and builds massive referral networks.',
          price_min: 299,
          price_max: 599,
          reward_percentage: 25,
          max_degrees: 6,
          status: 'active',
          user_id: 'user1',
          general_location: 'Business District',
          verification_level: 'professor_verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          item_title: 'Social Commerce Psychology',
          item_description: 'Master the psychological principles that drive purchasing decisions in social commerce.',
          price_min: 199,
          price_max: 399,
          reward_percentage: 20,
          max_degrees: 5,
          status: 'active',
          user_id: 'user2',
          general_location: 'Academic District',
          verification_level: 'deans_list',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          item_title: 'Network Economics & Referral Chains',
          item_description: 'Deep dive into the mathematics and economics of multi-level referral systems.',
          price_min: 149,
          price_max: 299,
          reward_percentage: 18,
          max_degrees: 4,
          status: 'active',
          user_id: 'user3',
          general_location: 'Tech Campus',
          verification_level: 'honor_roll',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '4',
          item_title: 'Content Creation for Conversion',
          item_description: 'Create compelling content that converts viewers into customers and referrers.',
          price_min: 99,
          price_max: 199,
          reward_percentage: 15,
          max_degrees: 3,
          status: 'active',
          user_id: 'user4',
          general_location: 'Creative Quarter',
          verification_level: 'professor_verified',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: '5',
          item_title: 'Digital Trust & Anonymous Selling',
          item_description: 'Build trust and credibility while maintaining seller anonymity in digital marketplaces.',
          price_min: 249,
          price_max: 449,
          reward_percentage: 22,
          max_degrees: 5,
          status: 'active',
          user_id: 'user5',
          general_location: 'Financial District',
          verification_level: 'deans_list',
          created_at: new Date(Date.now() - 345600000).toISOString(),
          updated_at: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: '6',
          item_title: 'Mobile Commerce Optimization',
          item_description: 'Optimize your selling strategies for mobile-first commerce experiences.',
          price_min: 179,
          price_max: 329,
          reward_percentage: 19,
          max_degrees: 4,
          status: 'active',
          user_id: 'user6',
          general_location: 'Innovation Hub',
          verification_level: 'honor_roll',
          created_at: new Date(Date.now() - 432000000).toISOString(),
          updated_at: new Date(Date.now() - 432000000).toISOString()
        }
      ];

      setCourses(mockCourses);

      // Calculate stats
      const totalListings = mockCourses.length;
      const averageReward = mockCourses.reduce((sum, course) => sum + (course.reward_percentage || 0), 0) / totalListings;
      const totalValue = mockCourses.reduce((sum, course) => sum + (course.price_max || course.price_min || 0), 0);
      
      setListingStats({
        totalListings,
        averageReward,
        topCategory: 'Social Commerce',
        totalValue
      });

    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses');
      toast({
        title: "Error Loading Courses",
        description: "Unable to load course listings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...courses];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(course =>
        course.item_title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.item_description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(course => {
        const coursePrice = course.price_max || course.price_min || 0;
        return coursePrice >= min && (max ? coursePrice <= max : true);
      });
    }

    if (filters.location) {
      filtered = filtered.filter(course =>
        course.general_location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.verificationLevel) {
      filtered = filtered.filter(course =>
        course.verification_level === filters.verificationLevel
      );
    }

    if (filters.rewardRange) {
      const [min, max] = filters.rewardRange.split('-').map(Number);
      filtered = filtered.filter(course => {
        const reward = course.reward_percentage || 0;
        return reward >= min && (max ? reward <= max : true);
      });
    }

    if (filters.degreeChain) {
      const targetDegrees = parseInt(filters.degreeChain);
      filtered = filtered.filter(course => course.max_degrees === targetDegrees);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOptions.field) {
        case 'price':
          aValue = a.price_max || a.price_min || 0;
          bValue = b.price_max || b.price_min || 0;
          break;
        case 'reward':
          aValue = a.reward_percentage || 0;
          bValue = b.reward_percentage || 0;
          break;
        case 'title':
          aValue = a.item_title;
          bValue = b.item_title;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(filtered);
  };

  const handleShareClick = (courseId: string, shareLink?: ShareLink) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCurrentShareLink(shareLink || null);
      setShareModalOpen(true);
    }
  };

  const handleViewDetails = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      toast({
        title: "Course Details",
        description: `Viewing details for: ${course.item_title}`,
      });
      // In a real app, this would navigate to a detailed course page
    }
  };

  const handleExpressInterest = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      toast({
        title: "Interest Expressed",
        description: `You've expressed interest in: ${course.item_title}`,
      });
    }
  };

  const handleFilterChange = (key: keyof ListingFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: '',
      location: '',
      department: '',
      verificationLevel: '',
      rewardRange: '',
      degreeChain: ''
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 p-6">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Loading Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadCoursesData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-amber-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎓 University of Bacon Course Marketplace</h1>
              <p className="text-blue-200">Discover courses, earn bacon, build your academic network</p>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-amber-900">
              <Plus className="w-4 h-4 mr-2" />
              List a Course
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{listingStats.totalListings}</div>
              <div className="text-sm text-green-700">Active listings</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Avg Reward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{listingStats.averageReward.toFixed(1)}%</div>
              <div className="text-sm text-amber-700">Bacon rewards</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{listingStats.topCategory}</div>
              <div className="text-sm text-purple-700">Most popular</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${listingStats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Market value</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Find Your Perfect Course
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any price</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-300">$100 - $300</SelectItem>
                    <SelectItem value="300-500">$300 - $500</SelectItem>
                    <SelectItem value="500-">$500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Verification Level</label>
                <Select value={filters.verificationLevel} onValueChange={(value) => handleFilterChange('verificationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any level</SelectItem>
                    <SelectItem value="deans_list">Dean's List</SelectItem>
                    <SelectItem value="honor_roll">Honor Roll</SelectItem>
                    <SelectItem value="professor_verified">Professor Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select 
                  value={`${sortOptions.field}-${sortOptions.direction}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split('-');
                    setSortOptions({ field, direction: direction as 'asc' | 'desc' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="reward-desc">Highest Reward</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Reward Range</label>
                <Select value={filters.rewardRange} onValueChange={(value) => handleFilterChange('rewardRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any reward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any reward</SelectItem>
                    <SelectItem value="0-15">0% - 15%</SelectItem>
                    <SelectItem value="15-20">15% - 20%</SelectItem>
                    <SelectItem value="20-25">20% - 25%</SelectItem>
                    <SelectItem value="25-">25%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Degree Chain</label>
                <Select value={filters.degreeChain} onValueChange={(value) => handleFilterChange('degreeChain', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any length</SelectItem>
                    <SelectItem value="3">3 degrees</SelectItem>
                    <SelectItem value="4">4 degrees</SelectItem>
                    <SelectItem value="5">5 degrees</SelectItem>
                    <SelectItem value="6">6 degrees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} total courses
          </div>
        </div>

        {/* Course Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredCourses.map((course) => (
            <EnhancedCourseCard
              key={course.id}
              course={course}
              onShareClick={handleShareClick}
              onViewDetails={handleViewDetails}
              onExpressInterest={handleExpressInterest}
              showAnalytics={true}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms to find more courses.
            </p>
            <Button onClick={clearFilters}>
              Clear All Filters
            </Button>
          </Card>
        )}

        {/* Share Modal */}
        <ShareIntentModal
          course={selectedCourse}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          shareLink={currentShareLink}
        />
      </div>
    </div>
  );
};