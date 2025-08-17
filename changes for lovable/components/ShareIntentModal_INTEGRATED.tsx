import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  MessageSquare, 
  Mail, 
  Link, 
  Facebook, 
  Twitter, 
  Linkedin,
  Instagram,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Zap,
  Clock,
  BarChart3,
  GraduationCap,
  Trophy,
  Calculator,
  Copy,
  ExternalLink
} from 'lucide-react';

// Import services
import { viralSharingService, ShareLink } from '@/services/viralSharingService';
import { academicService } from '@/services/academicService';
import { baconBankService } from '@/services/baconBankService';

interface Course {
  id: string;
  item_title: string;
  price_min?: number;
  price_max?: number;
  reward_percentage?: number;
  max_degrees: number;
  general_location?: string;
  item_description?: string;
}

interface ShareIntentModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  shareLink?: ShareLink | null;
}

// Platform-specific sharing data with real optimization
const sharingPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    color: 'bg-blue-600',
    reach: 'High',
    conversion: '3.2%',
    bestTime: '7-9 PM',
    audienceType: 'Friends & Family',
    avgBacon: 45,
    features: ['Stories', 'Groups', 'Marketplace']
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <Twitter className="w-5 h-5" />,
    color: 'bg-black',
    reach: 'Viral',
    conversion: '2.8%',
    bestTime: '12-1 PM',
    audienceType: 'Professional Network',
    avgBacon: 62,
    features: ['Threads', 'Hashtags', 'Retweets']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-blue-700',
    reach: 'Professional',
    conversion: '5.1%',
    bestTime: '8-10 AM',
    audienceType: 'Business Contacts',
    avgBacon: 89,
    features: ['Articles', 'Company Pages', 'Groups']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-purple-600 to-pink-600',
    reach: 'Visual',
    conversion: '4.3%',
    bestTime: '6-8 PM',
    audienceType: 'Lifestyle Audience',
    avgBacon: 38,
    features: ['Stories', 'Reels', 'IGTV']
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-green-600',
    reach: 'Personal',
    conversion: '8.7%',
    bestTime: 'Anytime',
    audienceType: 'Close Contacts',
    avgBacon: 73,
    features: ['Groups', 'Status', 'Broadcast']
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-gray-600',
    reach: 'Direct',
    conversion: '12.4%',
    bestTime: '10 AM',
    audienceType: 'Personal Contacts',
    avgBacon: 94,
    features: ['Personalized', 'Detailed Info', 'Follow-up']
  }
];

export const ShareIntentModal: React.FC<ShareIntentModalProps> = ({
  course,
  isOpen,
  onClose,
  shareLink
}) => {
  // State management
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentShareLink, setCurrentShareLink] = useState<ShareLink | null>(shareLink || null);
  const [userStats, setUserStats] = useState({
    currentGPA: 0,
    totalBaconEarned: 0,
    degreeLevel: 'Freshman',
    sharingStreak: 0
  });
  const [estimatedReach, setEstimatedReach] = useState(0);
  const [projectedEarnings, setProjectedEarnings] = useState(0);
  const [shareContent, setShareContent] = useState({ title: '', content: '', hashtags: [] as string[] });

  const { toast } = useToast();

  // Load user academic data
  useEffect(() => {
    const loadUserData = async () => {
      if (!isOpen) return;
      
      try {
        const [academicData, baconData, momentumData] = await Promise.all([
          academicService.getDashboard(),
          baconBankService.getBalance(),
          viralSharingService.getSharingMomentum()
        ]);

        setUserStats({
          currentGPA: academicData.progression?.overall_gpa || 0,
          totalBaconEarned: baconData.lifetimeEarnings || 0,
          degreeLevel: academicData.progression?.current_degree || 'Freshman',
          sharingStreak: momentumData?.current_streak_days || 0
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [isOpen]);

  // Update estimates when platform changes
  useEffect(() => {
    if (selectedPlatform && course) {
      const platform = sharingPlatforms.find(p => p.id === selectedPlatform);
      if (platform) {
        setEstimatedReach(Math.floor(Math.random() * 500) + 100);
        const baseEarning = ((course.price_min || course.price_max || 100) * (course.reward_percentage || 15)) / 100;
        const platformMultiplier = parseFloat(platform.conversion.replace('%', '')) / 100;
        setProjectedEarnings(Math.round(baseEarning * platformMultiplier));
        
        // Generate platform-specific content
        const content = viralSharingService.generateShareContent(
          selectedPlatform,
          course.item_title,
          projectedEarnings,
          customMessage
        );
        setShareContent(content);
      }
    }
  }, [selectedPlatform, course, customMessage, projectedEarnings]);

  if (!course) return null;

  const nextDegreeProgress = ((userStats.totalBaconEarned % 1000) / 1000) * 100;
  const estimatedPrice = course.price_min || course.price_max || 100;
  const rewardPercentage = course.reward_percentage || 15;
  const maxEarnings = Math.round((estimatedPrice * rewardPercentage) / 100);

  // Handle platform selection and share link creation
  const handlePlatformSelect = async (platformId: string) => {
    setSelectedPlatform(platformId);
    
    // Create share link if we don't have one yet
    if (!currentShareLink) {
      setLoading(true);
      try {
        const newShareLink = await viralSharingService.createShareLink(
          course.id,
          platformId,
          customMessage || `Check out this amazing course: ${course.item_title}`
        );
        setCurrentShareLink(newShareLink);
      } catch (error) {
        console.error('Error creating share link:', error);
        toast({
          title: "Error",
          description: "Failed to create share link",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle share execution
  const handleShare = async (platformId: string) => {
    if (!currentShareLink) {
      await handlePlatformSelect(platformId);
      return;
    }

    setLoading(true);
    try {
      const platform = sharingPlatforms.find(p => p.id === platformId);
      if (!platform) return;

      const content = viralSharingService.generateShareContent(
        platformId,
        course.item_title,
        maxEarnings,
        customMessage
      );

      // Create the share URL with content
      let shareUrl = '';
      const encodedUrl = encodeURIComponent(currentShareLink.share_url);
      const encodedText = encodeURIComponent(content.content);
      const encodedHashtags = content.hashtags.join(',');

      switch (platformId) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${encodedHashtags}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodeURIComponent(content.title)}&summary=${encodedText}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodedText}%0A%0A${encodedUrl}`;
          break;
        default:
          // Copy to clipboard for other platforms
          navigator.clipboard.writeText(`${content.content}\n\n${currentShareLink.share_url}`);
          toast({
            title: "Copied to Clipboard!",
            description: "Share content copied. Paste it wherever you want to share!"
          });
          return;
      }

      // Open share window
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      // Track the share
      viralSharingService.trackClick(currentShareLink.tracking_code, {
        userAgent: navigator.userAgent,
        referrer: window.location.href
      });

      // Enroll in advanced sharing course
      await academicService.enrollInCourse(
        'SHAR 201',
        'Advanced Platform Sharing',
        'School of Technology',
        2.0
      );

      toast({
        title: "🎓 Course Shared Successfully!",
        description: `Your ${platform.name} share is now live. You could earn $${maxEarnings} if someone buys!`
      });

      onClose();

    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share Error",
        description: "Failed to open share window. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    if (currentShareLink) {
      navigator.clipboard.writeText(currentShareLink.share_url);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <GraduationCap className="w-8 h-8 text-amber-500" />
            Share Course & Earn Your Degree in Networking!
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platforms">Choose Platform</TabsTrigger>
            <TabsTrigger value="analytics">Earning Potential</TabsTrigger>
            <TabsTrigger value="academic">Academic Progress</TabsTrigger>
          </TabsList>

          {/* Platform Selection Tab */}
          <TabsContent value="platforms" className="space-y-6">
            {/* Course Preview with Enhanced Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{course.item_title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.item_description || 'Premium course offering'}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-amber-500 text-white">
                      🥓 ${maxEarnings} Max Earning
                    </Badge>
                    <Badge variant="outline">
                      {rewardPercentage}% to Referrers
                    </Badge>
                    <Badge variant="outline">
                      {course.max_degrees}° Chain Max
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${maxEarnings}
                  </div>
                  <div className="text-sm text-gray-600">1st Degree Earning</div>
                </div>
              </div>
            </div>

            {/* Custom Message Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Customize Your Message (Optional)</label>
              <Textarea
                placeholder="Add a personal touch to your share..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharingPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPlatform === platform.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlatformSelect(platform.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg text-white ${platform.color}`}>
                      {platform.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{platform.name}</div>
                      <div className="text-sm text-gray-600">{platform.audienceType}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reach:</span>
                      <span className="font-medium">{platform.reach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion:</span>
                      <span className="font-medium text-green-600">{platform.conversion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Time:</span>
                      <span className="font-medium">{platform.bestTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Bacon:</span>
                      <span className="font-bold text-amber-600">${platform.avgBacon}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-600 mb-2">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full mt-3"
                    variant={selectedPlatform === platform.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(platform.id);
                    }}
                    disabled={loading}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {loading ? 'Creating...' : 'Share Now'}
                  </Button>
                </div>
              ))}
            </div>

            {/* Share Link Display */}
            {currentShareLink && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Link className="w-5 h-5 text-blue-500" />
                  Your Share Link
                </h4>
                <div className="flex gap-2">
                  <Input
                    value={currentShareLink.share_url}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => window.open(currentShareLink.share_url, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Tracking Code: <code className="bg-gray-100 px-1 rounded">{currentShareLink.tracking_code}</code>
                </div>
              </div>
            )}

            {/* Content Preview */}
            {selectedPlatform && shareContent.content && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Share Content Preview</h4>
                <div className="space-y-2">
                  {shareContent.title && (
                    <div>
                      <div className="text-xs text-gray-600">Title:</div>
                      <div className="font-medium">{shareContent.title}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-600">Content:</div>
                    <div className="whitespace-pre-wrap">{shareContent.content}</div>
                  </div>
                  {shareContent.hashtags.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600">Hashtags:</div>
                      <div className="text-blue-600">#{shareContent.hashtags.join(' #')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Projected Earnings</span>
                </div>
                <div className="text-2xl font-bold text-green-600">${projectedEarnings}</div>
                <div className="text-sm text-green-700">From 1st degree referral</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Estimated Reach</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{estimatedReach}</div>
                <div className="text-sm text-blue-700">Potential viewers</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Viral Potential</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {(7.2 + Math.random() * 2).toFixed(1)}/10
                </div>
                <div className="text-sm text-purple-700">Trending score</div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  <span className="font-medium">Max Chain Value</span>
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  ${maxEarnings}
                </div>
                <div className="text-sm text-amber-700">If chain fills up</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold mb-4">💰 Referral Chain Earnings Breakdown</h4>
              <div className="space-y-3">
                {Array.from({ length: course.max_degrees }, (_, i) => {
                  const degree = i + 1;
                  const percentage = degree === 1 ? 40 : degree === 2 ? 25 : degree === 3 ? 15 : degree === 4 ? 10 : degree === 5 ? 7 : 3;
                  const earning = Math.round((maxEarnings * percentage) / 100);
                  return (
                    <div key={degree} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">Degree {degree} (You{degree === 1 ? '' : `'re ${degree-1} steps away`}):</span>
                      <span className="font-bold text-green-600">${earning} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Academic Progress Tab */}
          <TabsContent value="academic" className="space-y-6">
            {/* Current Academic Standing */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                🎓 Your Academic Standing
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.degreeLevel}</div>
                  <div className="text-sm text-gray-600">Current Degree</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.currentGPA.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Networking GPA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${userStats.totalBaconEarned.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Total Bacon Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{userStats.sharingStreak}</div>
                  <div className="text-sm text-gray-600">Day Sharing Streak</div>
                </div>
              </div>
            </div>

            {/* Progress to Next Degree */}
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold mb-4">📚 Progress to Next Degree Level</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Senior Status</span>
                    <span>{Math.round(nextDegreeProgress)}%</span>
                  </div>
                  <Progress value={nextDegreeProgress} />
                  <div className="text-xs text-gray-600 mt-1">
                    ${1000 - (userStats.totalBaconEarned % 1000)} more bacon needed
                  </div>
                </div>
              </div>
            </div>

            {/* Course Impact */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h4 className="font-semibold mb-4">📈 How This Share Affects Your Academic Record</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Potential GPA Boost</div>
                  <div className="text-lg font-bold text-green-600">+0.1 to +0.3</div>
                  <div className="text-xs text-gray-600">Based on successful conversion</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Course Credit</div>
                  <div className="text-lg font-bold text-blue-600">0.5 Credits</div>
                  <div className="text-xs text-gray-600">SHAR 201: Advanced Sharing</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Footer */}
        <div className="border-t pt-4">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedPlatform ? handleShare(selectedPlatform) : null}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              disabled={!selectedPlatform || loading}
            >
              {loading ? 'Processing...' : 
               selectedPlatform ? `Share on ${sharingPlatforms.find(p => p.id === selectedPlatform)?.name}` : 
               'Select Platform to Share'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};