import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { MoreVertical, Settings, Copy, BarChart3, Archive } from 'lucide-react';

interface ShareLink {
  id: string;
  listing_id?: string;
  tracking_code: string;
  share_url: string;
  platform: string;
  custom_message?: string;
  clicks: number;
  conversions: number;
  bacon_earned: number;
  created_at: string;
  is_active: boolean;
}

interface ShareLinkCardProps {
  shareLink: ShareLink;
  viewMode: 'grid' | 'list';
  onOpenTools: (shareLinkId: string) => void;
  onViewAnalytics: (shareLinkId: string) => void;
}

export const ShareLinkCard: React.FC<ShareLinkCardProps> = ({
  shareLink,
  viewMode,
  onOpenTools,
  onViewAnalytics
}) => {
  const ctr = shareLink.clicks > 0 ? (shareLink.conversions / shareLink.clicks * 100) : 0;
  const performanceScore = ctr > 5 ? 85 : ctr > 2 ? 60 : 35;
  const performanceRating = ctr > 5 ? 'excellent' : ctr > 2 ? 'good' : 'needs_improvement';

  const performanceColor = performanceRating === 'excellent' ? 'text-green-600' :
                          performanceRating === 'good' ? 'text-blue-600' : 'text-orange-600';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink.share_url);
    // You could add a toast notification here
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover-scale">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                🥓 ${shareLink.bacon_earned.toFixed(0)}
              </Badge>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-lg">{shareLink.platform} Share Link</h3>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>{shareLink.tracking_code}</span>
                <span>Created {new Date(shareLink.created_at).toLocaleDateString()}</span>
                <span>📱 {shareLink.platform}</span>
              </div>
            </div>

            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{shareLink.clicks}</div>
                <div className="text-sm text-muted-foreground">Clicks</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{shareLink.conversions}</div>
                <div className="text-sm text-muted-foreground">Conversions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{ctr.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">CTR</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => onOpenTools(shareLink.id)}>
                🛠️ Tools
              </Button>
              <Button size="sm" variant="outline" onClick={() => onViewAnalytics(shareLink.id)}>
                📊 Analytics
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onOpenTools(shareLink.id)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Open Share Tools
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewAnalytics(shareLink.id)}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-scale">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                🥓 ${shareLink.bacon_earned.toFixed(0)}
              </Badge>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{shareLink.platform} Share Link</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>{shareLink.tracking_code}</div>
                <div>Created {new Date(shareLink.created_at).toLocaleDateString()}</div>
                <div>📱 {shareLink.platform}</div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onOpenTools(shareLink.id)}>
                <Settings className="w-4 h-4 mr-2" />
                Open Share Tools
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewAnalytics(shareLink.id)}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xl font-bold">{shareLink.clicks}</div>
            <div className="text-xs text-muted-foreground">Clicks</div>
          </div>
          <div>
            <div className="text-xl font-bold">1</div>
            <div className="text-xs text-muted-foreground">Shares</div>
          </div>
          <div>
            <div className="text-xl font-bold">{shareLink.conversions}</div>
            <div className="text-xs text-muted-foreground">Conversions</div>
          </div>
          <div>
            <div className="text-xl font-bold">{ctr.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">CTR</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={() => onOpenTools(shareLink.id)}
          >
            🛠️ Open Tools
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewAnalytics(shareLink.id)}
          >
            📊 Analytics
          </Button>
        </div>

        {/* Performance Indicator */}
        <div className="space-y-2">
          <Progress value={performanceScore} className="h-2" />
          <div className={`text-sm font-medium ${performanceColor}`}>
            {performanceRating === 'excellent' && '🏆 Excellent Performance'}
            {performanceRating === 'good' && '✅ Good Performance'}
            {performanceRating === 'needs_improvement' && '⚠️ Needs Improvement'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};