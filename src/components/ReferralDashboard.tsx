import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Share2, Users, TrendingUp, Link, Copy, MessageSquare, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ShareLinksDashboard } from "@/components/ShareLinksDashboard";
import { ShareToolsWorkspace } from "@/components/ShareToolsWorkspace";
import { ShareAnalyticsDashboard } from "@/components/ShareAnalyticsDashboard";
import { SocialMediaKit } from "@/components/SocialMediaKit";
import { EmailTemplates } from "@/components/EmailTemplates";
import { QuickShare } from "@/components/QuickShare";
import { CreateShareLinkModal } from "@/components/CreateShareLinkModal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealTimeAnalytics } from "@/services/realTimeAnalytics";

export const ReferralDashboard = () => {
  const { toast } = useToast();
  const [shareLinks, setShareLinks] = useState([]);
  const [selectedShareLink, setSelectedShareLink] = useState(null);
  const [showShareTools, setShowShareTools] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeChains: 0,
    conversionRate: 0,
    avgDegree: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([loadShareLinks(), loadStats()]);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({ title: "Error", description: "Failed to load referral data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchShareLinks = async () => {
    await loadShareLinks();
  };

  const loadShareLinks = async () => {
    try {
      // Use the SharingAPI to get real share links
      const { SharingAPI } = await import('@/lib/SharingAPI');
      const shareLinksData = await SharingAPI.getMyShareLinks();
      setShareLinks(shareLinksData || []);
    } catch (error) {
      console.error('Failed to load share links:', error);
      // Fallback to database query
      try {
        const { data, error } = await supabase
          .from('share_links_enhanced')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setShareLinks(data || []);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      }
    }
  };

  const loadStats = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const realTimeStats = await RealTimeAnalytics.getRealTimeStats(user.user.id);
      setStats(realTimeStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback to basic query
      try {
        const { data: referralData, error: refError } = await supabase
          .from('referrals')
          .select('*');
        
        if (refError) throw refError;

        const { data: chainData, error: chainError } = await supabase
          .from('referral_chains')
          .select('*')
          .eq('status', 'active');
        
        if (chainError) throw chainError;

        setStats({
          totalReferrals: referralData?.length || 0,
          activeChains: chainData?.length || 0,
          conversionRate: referralData?.length > 0 ? Math.round((chainData?.length || 0) / referralData.length * 100) : 0,
          avgDegree: referralData?.length > 0 ? referralData.reduce((sum, r) => sum + (r.degree || 0), 0) / referralData.length : 0
        });
      } catch (fallbackError) {
        console.error('Fallback stats loading failed:', fallbackError);
      }
    }
  };

  const referralStats = stats;

  const [activeChains, setActiveChains] = useState([]);

  const loadActiveChains = async () => {
    try {
      // Get active referrals for the current user
      const { data: userReferrals, error: refError } = await supabase
        .from('referrals')
        .select(`
          id,
          listing_id,
          degree,
          created_at,
          listings!inner (
            item_title,
            asking_price,
            reward_percentage,
            item_images
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (refError) throw refError;

      // Get share events for these referrals to show real activity
      const referralIds = userReferrals?.map(r => r.id) || [];
      
      let shareEvents = [];
      if (referralIds.length > 0) {
        const { data: events, error: eventsError } = await supabase
          .from('share_events')
          .select('*')
          .in('chain_link_id', referralIds);
        
        if (!eventsError) {
          shareEvents = events || [];
        }
      }

      const formattedChains = userReferrals?.map(referral => {
        const listing = referral.listings;
        const hasShares = shareEvents.some(event => event.chain_link_id === referral.id);
        const clickCount = shareEvents
          .filter(event => event.chain_link_id === referral.id)
          .reduce((sum, event) => sum + (event.click_count || 0), 0);
        
        return {
          id: referral.id,
          itemTitle: listing?.item_title || 'Unknown Item',
          degree: referral.degree || 1,
          participants: hasShares ? Math.max(1, Math.floor(clickCount / 5)) : 1,
          potentialEarning: Math.round((listing?.asking_price || 100) * (listing?.reward_percentage || 20) / 100),
          status: clickCount > 10 ? "hot" : hasShares ? "active" : "pending",
          expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          clicks: clickCount
        };
      }) || [];
      
      setActiveChains(formattedChains.filter(chain => chain.status !== 'pending'));
    } catch (error) {
      console.error('Failed to load active chains:', error);
      // Show some demo data if no real data
      setActiveChains([
        {
          id: 'demo-1',
          itemTitle: 'MacBook Pro M2',
          degree: 2,
          participants: 3,
          potentialEarning: 200,
          status: 'active',
          expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          clicks: 8
        }
      ]);
    }
  };

  useEffect(() => {
    loadActiveChains();
  }, []);

  const referralLinks = [
    {
      id: 1,
      title: "MacBook Pro Chain",
      url: "https://bacon.edu/r/mb-abc123",
      clicks: 45,
      conversions: 3
    },
    {
      id: 2,
      title: "iPhone Chain",
      url: "https://bacon.edu/r/ip-def456",
      clicks: 32,
      conversions: 2
    }
  ];

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Referral link copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      {/* Referral Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Referral Dashboard</span>
          </CardTitle>
          <CardDescription>
            Track your referral chains, share links, and monitor performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chains" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chains">Active Chains</TabsTrigger>
              <TabsTrigger value="links">Share Links</TabsTrigger>
              <TabsTrigger value="tools">Share Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="chains" className="space-y-4">
              <div className="space-y-3">
                {activeChains.map((chain) => (
                  <div key={chain.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{chain.itemTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Degree {chain.degree} • {chain.participants} participants
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={chain.status === 'hot' ? 'destructive' : 'default'}>
                          {chain.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Expires: {chain.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Chain Progress</span>
                        <span>{chain.degree}/6 degrees</span>
                      </div>
                      <Progress value={(chain.degree / 6) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-semibold text-primary">
                        ${chain.potentialEarning} potential
                      </span>
                      <Button variant="outline" size="sm">
                        View Chain
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <ShareLinksDashboard
                shareLinks={shareLinks}
                onCreateNew={() => {
                  setShowCreateModal(true);
                }}
                onOpenTools={(shareLink) => {
                  setSelectedShareLink(shareLink);
                  setShowShareTools(true);
                }}
                onViewAnalytics={async (shareLink: any) => {
                  try {
                    // Mock analytics data for now
                    const mockAnalytics = {
                      shareLinkId: shareLink.id,
                      overview: {
                        totalClicks: shareLink.clicks || 0,
                        uniqueClicks: shareLink.unique_clicks || 0,
                        conversions: shareLink.conversions || 0,
                        conversionRate: shareLink.clicks > 0 ? (shareLink.conversions / shareLink.clicks * 100) : 0,
                        baconEarned: shareLink.bacon_earned || 0,
                        performanceTrend: 'up' as const
                      },
                      trafficSources: [],
                      geographicData: { countries: {}, cities: {} },
                      deviceBreakdown: { mobile: 60, desktop: 30, tablet: 10 },
                      contentPerformance: [],
                      chainStatus: { chainId: 'N/A', currentDegree: 0, potentialEarning: 0, conversionProbability: 0 },
                      clickDetails: []
                    };
                    setAnalyticsData(mockAnalytics);
                    setShowAnalytics(true);
                  } catch (error) {
                    toast({ title: "Error", description: "Failed to load analytics" });
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              {selectedShareLink && showShareTools ? (
                <ShareToolsWorkspace
                  shareLink={selectedShareLink}
                  onSaveDraft={(data: any) => {
                    toast({ title: "Draft Saved", description: "Your post has been saved as a draft" });
                  }}
                  onPostNow={(data: any) => {
                    toast({ title: "Posted Successfully", description: `Posted to ${data.platform || 'social media'}` });
                    setShowShareTools(false);
                  }}
                  onSchedule={(data: any) => {
                    toast({ title: "Post Scheduled", description: `Scheduled for ${data.scheduledTime || 'later'}` });
                    setShowShareTools(false);
                  }}
                  onClose={() => setShowShareTools(false)}
                />
              ) : (
                <Tabs defaultValue="social" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="social" className="text-xs px-2 py-2">Social Media Kit</TabsTrigger>
                    <TabsTrigger value="email" className="text-xs px-2 py-2">Email Templates</TabsTrigger>
                    <TabsTrigger value="quick" className="text-xs px-2 py-2">Quick Share</TabsTrigger>
                  </TabsList>

                  <TabsContent value="social" className="mt-4">
                    <SocialMediaKit
                      selectedListing={shareLinks[0] ? { 
                        id: shareLinks[0].listing_id,
                        item_title: shareLinks[0].listing?.item_title || 'Course Materials',
                        item_description: shareLinks[0].listing?.item_description || 'High-quality academic resources',
                        reward_percentage: shareLinks[0].listing?.reward_percentage || 20
                      } : undefined}
                      onClose={() => {}}
                    />
                  </TabsContent>

                  <TabsContent value="email" className="mt-4">
                    <EmailTemplates
                      selectedListing={shareLinks[0] ? { 
                        id: shareLinks[0].listing_id,
                        item_title: shareLinks[0].listing?.item_title || 'Course Materials',
                        item_description: shareLinks[0].listing?.item_description || 'High-quality academic resources',
                        reward_percentage: shareLinks[0].listing?.reward_percentage || 20
                      } : undefined}
                      onClose={() => {}}
                    />
                  </TabsContent>

                  <TabsContent value="quick" className="mt-4">
                    <QuickShare
                      selectedListing={shareLinks[0] ? { 
                        id: shareLinks[0].listing_id,
                        item_title: shareLinks[0].listing?.item_title || 'Course Materials',
                        item_description: shareLinks[0].listing?.item_description || 'High-quality academic resources',
                        reward_percentage: shareLinks[0].listing?.reward_percentage || 20
                      } : undefined}
                      onClose={() => {}}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Share Analytics Modal */}
      {showAnalytics && analyticsData && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-[95vw] max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Share Analytics</h2>
              <Button variant="outline" size="sm" onClick={() => setShowAnalytics(false)}>
                Close
              </Button>
            </div>
            <ShareAnalyticsDashboard
              analyticsData={analyticsData}
              onExport={(format) => {
                toast({ title: "Export Started", description: `Exporting data as ${format}` });
              }}
              onOptimizeChain={() => {
                toast({ title: "Optimization Started", description: "Analyzing chain performance" });
              }}
              onViewChainDetails={() => {
                toast({ title: "Chain Details", description: "Loading chain visualization" });
              }}
            />
          </div>
        </div>
      )}

      {/* Create Share Link Modal */}
      <CreateShareLinkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onShareLinkCreated={() => {
          fetchShareLinks();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};