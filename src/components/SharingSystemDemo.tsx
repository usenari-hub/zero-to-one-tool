import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCourseCard } from './EnhancedCourseCard';
import { ShareIntentModal } from './ShareIntentModal';
import { ShareLinksDashboard } from './ShareLinksDashboard';
import { ShareToolsWorkspace } from './ShareToolsWorkspace';
import { ShareAnalyticsDashboard } from './ShareAnalyticsDashboard';
import { MobileShareModal } from './mobile/MobileShareModal';
import { MobileShareTools } from './mobile/MobileShareTools';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { useToast } from '@/hooks/use-toast';
import { useViralSharing } from '@/hooks/useViralSharing';
import { supabase } from '@/integrations/supabase/client';

// Real data loaded from database

export const SharingSystemDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('discovery');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [mobileShareOpen, setMobileShareOpen] = useState(false);
  const [shareToolsOpen, setShareToolsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedShareLink, setSelectedShareLink] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const mobileFeatures = useMobileFeatures();
  const { shareLinks, loading: sharingLoading, createShareLink, getShareContent } = useViralSharing();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .limit(20);
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleShareClick = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setSelectedCourse(course);
    
    if (window.innerWidth < 768) {
      setMobileShareOpen(true);
    } else {
      setShareModalOpen(true);
    }
  };

  const handleCreateNew = () => {
    setSelectedTab('discovery');
  };

  const handleMethodSelect = async (courseId: string, method: string) => {
    try {
      toast({
        title: "Creating share link...",
        description: "Setting up your tracking link and sharing tools.",
      });

      await createShareLink(courseId, method);
      setShareModalOpen(false);
      setSelectedTab('dashboard');
      toast({
        title: "Share link created!",
        description: "Your sharing tools are ready. Start earning bacon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuickShare = async (courseId: string, platform: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    try {
      // Create share link first
      const shareLink = await createShareLink(courseId, platform);
      
      // Try native sharing first on mobile
      if (mobileFeatures.canUseNativeShare) {
        const content = getShareContent(platform, course.item_title, course.reward_percentage || 20);
        const shared = await mobileFeatures.nativeShare({
          title: content.title,
          text: content.content,
          url: shareLink.share_url
        });

        if (shared) {
          setShareModalOpen(false);
          setMobileShareOpen(false);
          return;
        }
      }

      // Fallback to platform-specific sharing
      toast({
        title: `Sharing to ${platform}`,
        description: `Opening ${platform} share dialog...`,
      });
      
      setShareModalOpen(false);
      setMobileShareOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `https://earnyourbacon.online/c/${selectedCourse?.id}?ref=COPY-${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
    
    setShareModalOpen(false);
    setMobileShareOpen(false);
  };

  const handleOpenTools = (shareLinkId: string) => {
    const shareLink = shareLinks.find(sl => sl.id === shareLinkId);
    setSelectedShareLink(shareLink);
    setShareToolsOpen(true);
  };

  const handleViewAnalytics = (shareLinkId: string) => {
    setSelectedShareLink({ id: shareLinkId });
    setAnalyticsOpen(true);
  };

  const handlePost = (platform: string, content: string) => {
    toast({
      title: "Posted successfully!",
      description: `Your content has been posted to ${platform}.`,
    });
    setShareToolsOpen(false);
  };

  const handleSchedule = (platform: string, content: string) => {
    toast({
      title: "Post scheduled",
      description: `Your ${platform} post has been scheduled.`,
    });
    setShareToolsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🥓 University of Bacon Sharing System</h1>
        <p className="text-muted-foreground">
          Discover, share, and earn bacon through our comprehensive referral network
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discovery">🔍 Discovery</TabsTrigger>
          <TabsTrigger value="dashboard">🔗 My Links</TabsTrigger>
          <TabsTrigger value="tools">🛠️ Share Tools</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading listings...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <EnhancedCourseCard
                      key={course.id}
                      course={course}
                      onShareClick={handleShareClick}
                      onViewDetails={(id) => toast({ title: "Listing Details", description: `Viewing details for listing ${id}` })}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <ShareLinksDashboard
            shareLinks={shareLinks}
            onCreateNew={handleCreateNew}
            onOpenTools={handleOpenTools}
            onViewAnalytics={handleViewAnalytics}
          />
        </TabsContent>

        <TabsContent value="tools">
          {selectedShareLink ? (
            <ShareToolsWorkspace
              shareLink={{
                id: selectedShareLink.id,
                trackingCode: selectedShareLink.trackingCode || 'DEMO-CODE',
                shareUrl: selectedShareLink.shareUrl || 'https://demo.url',
                course: {
                  id: selectedShareLink.courseId || '1',
                  title: selectedShareLink.courseName || 'Demo Course',
                  image: selectedShareLink.courseImage || '/placeholder.jpg',
                  department: 'Demo Department',
                  priceRange: '$100 - $200',
                  baconPotential: selectedShareLink.baconPotential || 100
                }
              }}
              onClose={() => setShareToolsOpen(false)}
              onSaveDraft={() => toast({ title: "Draft saved" })}
              onPostNow={handlePost}
              onSchedule={handleSchedule}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">No Share Link Selected</h3>
                  <p className="text-muted-foreground">Select a share link from the dashboard to access tools</p>
                  <Button onClick={() => setSelectedTab('dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {selectedShareLink ? (
            <ShareAnalyticsDashboard
              analyticsData={{
                shareLinkId: selectedShareLink.id,
                overview: {
                  totalClicks: selectedShareLink.clicks || 0,
                  uniqueClicks: selectedShareLink.unique_clicks || 0,
                  conversions: selectedShareLink.conversions || 0,
                  conversionRate: selectedShareLink.clicks > 0 ? (selectedShareLink.conversions / selectedShareLink.clicks * 100) : 0,
                  baconEarned: selectedShareLink.bacon_earned || 0,
                  performanceTrend: 'stable' as const
                },
                trafficSources: [],
                geographicData: { countries: {}, cities: {} },
                deviceBreakdown: { mobile: 50, desktop: 40, tablet: 10 },
                contentPerformance: [],
                chainStatus: {
                  chainId: selectedShareLink.tracking_code || '',
                  currentDegree: 1,
                  potentialEarning: selectedShareLink.bacon_earned || 0,
                  conversionProbability: 50
                },
                clickDetails: []
              }}
              onExport={(format, dataType) => toast({ title: "Export", description: `Exporting ${dataType} as ${format}` })}
              onOptimizeChain={() => toast({ title: "Optimization", description: "Chain optimization started" })}
              onViewChainDetails={() => toast({ title: "Chain Details", description: "Viewing detailed chain information" })}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">No Analytics Selected</h3>
                  <p className="text-muted-foreground">Select a share link from the dashboard to view analytics</p>
                  <Button onClick={() => setSelectedTab('dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ShareIntentModal
        course={selectedCourse}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onMethodSelect={handleMethodSelect}
        onQuickShare={handleQuickShare}
      />

      <MobileShareModal
        course={selectedCourse}
        isOpen={mobileShareOpen}
        onClose={() => setMobileShareOpen(false)}
        onQuickShare={(platform) => handleQuickShare(selectedCourse?.id, platform)}
        onCopyLink={handleCopyLink}
        onOpenAdvanced={() => {
          setMobileShareOpen(false);
          setShareToolsOpen(true);
        }}
      />

      <MobileShareTools
        shareLinkId={selectedShareLink?.id || ''}
        isOpen={shareToolsOpen && window.innerWidth < 768}
        onClose={() => setShareToolsOpen(false)}
        onPost={handlePost}
        onSchedule={handleSchedule}
      />
    </div>
  );
};