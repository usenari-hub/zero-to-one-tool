import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useViralSharing } from '@/hooks/useViralSharing';
import { Facebook, Twitter, Linkedin, MessageCircle, Share2, TrendingUp, Users, Target } from 'lucide-react';

interface QuickShareProps {
  selectedListing?: any;
  onClose: () => void;
}

const quickSharePlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Reach your friends and family',
    audience: 'Personal Network',
    quickTemplate: "🎓 Found something amazing at University of Bacon! Check out this [ITEM] - if someone buys through my referral, I earn $[AMOUNT] in bacon! Who knew networking could be this delicious? 🥓",
    avgReach: '150-300',
    conversionRate: '2-4%'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    color: 'bg-black hover:bg-gray-800',
    description: 'Share with your followers',
    audience: 'Public Network',
    quickTemplate: "🎓 Discovered: [ITEM] at University of Bacon\n\n💰 Earn $[AMOUNT] through smart referrals\n🔗 Where networking = net worth\n\n#UniversityOfBacon #EarnYourBacon",
    avgReach: '50-500',
    conversionRate: '1-3%'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    description: 'Professional network outreach',
    audience: 'Professional Network',
    quickTemplate: "Exploring innovative social commerce with University of Bacon. Found this [ITEM] listing - fascinating how they monetize professional connections with $[AMOUNT] referral rewards. Anyone interested in [CATEGORY]?",
    avgReach: '100-400',
    conversionRate: '3-6%'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-600 hover:bg-green-700',
    description: 'Direct messaging',
    audience: 'Close Contacts',
    quickTemplate: "Hey! 👋 Found this [ITEM] on University of Bacon and thought of you. It's a platform that pays you for good connections - $[AMOUNT] for this one! Interested?",
    avgReach: '5-20',
    conversionRate: '8-15%'
  }
];

export const QuickShare: React.FC<QuickShareProps> = ({ selectedListing, onClose }) => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const { toast } = useToast();
  const { createShareLink, trackClick } = useViralSharing();

  const handleQuickShare = async (platform: string) => {
    if (!selectedListing) {
      toast({ title: "No Listing Selected", description: "Please select a listing to share." });
      return;
    }

    console.log('QuickShare: Starting share process for platform:', platform);
    console.log('QuickShare: Selected listing:', selectedListing);

    setIsSharing(platform);

    try {
      // Create share link with tracking
      console.log('QuickShare: Creating share link...');
      const shareLink = await createShareLink(selectedListing.id, platform);
      console.log('QuickShare: Share link created successfully:', shareLink);
      
      
      const platformData = quickSharePlatforms.find(p => p.id === platform);
      const content = platformData?.quickTemplate
        ?.replace(/\[ITEM\]/g, selectedListing.item_title || 'Amazing Course Material')
        ?.replace(/\[AMOUNT\]/g, String(selectedListing.reward_percentage || 20))
        ?.replace(/\[CATEGORY\]/g, selectedListing.item_description?.split(' ')[0] || 'academic materials') || '';

      // Generate platform-specific share URL
      let shareUrl = '';
      const encodedContent = encodeURIComponent(content);
      const encodedUrl = encodeURIComponent(shareLink.share_url);

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedContent}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedContent}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedContent}%20${encodedUrl}`;
          break;
      }

      if (shareUrl) {
        // Open share window
        const shareWindow = window.open(
          shareUrl, 
          '_blank', 
          'width=600,height=400,scrollbars=yes,resizable=yes'
        );

        // Track the share attempt
        await trackClick(shareLink.tracking_code, {
          platform,
          action: 'quick_share',
          listing_id: selectedListing.id
        });

        toast({ 
          title: "Share Window Opened! 🚀", 
          description: `Your ${platformData?.name} share is ready with tracking enabled.`,
        });

        // Optional: Track if window was closed (share completed)
        if (shareWindow) {
          const checkClosed = setInterval(() => {
            if (shareWindow.closed) {
              clearInterval(checkClosed);
              toast({ 
                title: "Share Tracked! 📊", 
                description: "We'll monitor the performance of your share.",
              });
            }
          }, 1000);

          // Stop checking after 5 minutes
          setTimeout(() => clearInterval(checkClosed), 300000);
        }
      }
    } catch (error) {
      console.error('QuickShare: Detailed error creating share:', error);
      console.error('QuickShare: Error type:', typeof error);
      console.error('QuickShare: Error message:', error instanceof Error ? error.message : String(error));
      
      toast({ 
        title: "Share Error", 
        description: `Failed to create share link: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSharing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Quick Share
          </h3>
          <p className="text-sm text-muted-foreground">
            One-click sharing with pre-optimized content and tracking
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      {!selectedListing && (
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium mb-2">No Listing Selected</h4>
            <p className="text-sm text-muted-foreground">
              Please select a listing from your Share Links to start quick sharing.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {quickSharePlatforms.map((platform) => {
          const Icon = platform.icon;
          const isCurrentlySharing = isSharing === platform.id;
          
          return (
            <Card key={platform.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${platform.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{platform.name}</h4>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleQuickShare(platform.id)}
                    disabled={!selectedListing || isCurrentlySharing}
                    className={platform.color}
                  >
                    {isCurrentlySharing ? (
                      <>Creating Link...</>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-1" />
                        Quick Share
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-sm font-medium">{platform.audience}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">Avg Reach</div>
                    <div className="text-sm font-medium">{platform.avgReach}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">Conversion</div>
                    <div className="text-sm font-medium">{platform.conversionRate}</div>
                  </div>
                </div>

                {selectedListing && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                    <div className="text-sm">
                      {platform.quickTemplate
                        ?.replace(/\[ITEM\]/g, selectedListing.item_title || 'Amazing Course Material')
                        ?.replace(/\[AMOUNT\]/g, String(selectedListing.reward_percentage || 20))
                        ?.replace(/\[CATEGORY\]/g, selectedListing.item_description?.split(' ')[0] || 'academic materials')
                        .substring(0, 120) + '...'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedListing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">📊 Performance Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>WhatsApp</strong> has the highest conversion rate but smallest reach - perfect for close contacts</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>LinkedIn</strong> works best for professional/educational content</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Facebook</strong> great for personal recommendations to friends</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Twitter</strong> ideal for broader awareness and viral potential</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};