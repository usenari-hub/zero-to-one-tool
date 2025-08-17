import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Plus, Search, TrendingUp, Users, DollarSign, Link as LinkIcon } from 'lucide-react';
import { ShareLinkCard } from './ShareLinkCard';

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

interface ShareLinksDashboardProps {
  shareLinks: ShareLink[];
  onCreateNew: () => void;
  onOpenTools: (shareLinkId: string) => void;
  onViewAnalytics: (shareLinkId: string) => void;
}

export const ShareLinksDashboard: React.FC<ShareLinksDashboardProps> = ({
  shareLinks,
  onCreateNew,
  onOpenTools,
  onViewAnalytics
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Calculate stats
  const stats = {
    activeLinks: shareLinks.filter(link => link.is_active).length,
    totalClicks: shareLinks.reduce((sum, link) => sum + link.clicks, 0),
    pendingBacon: shareLinks.reduce((sum, link) => sum + link.bacon_earned, 0),
    conversionRate: shareLinks.length > 0 ? 
      (shareLinks.reduce((sum, link) => sum + link.conversions, 0) / shareLinks.reduce((sum, link) => sum + link.clicks, 1) * 100) : 0
  };

  const filteredLinks = shareLinks.filter(link => {
    const matchesSearch = link.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && link.is_active) ||
                         (filter === 'high-potential' && link.bacon_earned > 100) ||
                         (filter === 'recent' && new Date(link.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🔗 My Share Links</h1>
        <div className="flex gap-2 items-center">
          <Button onClick={onCreateNew} className="hover-scale">
            <Plus className="w-4 h-4 mr-2" />
            Share New Course
          </Button>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LinkIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeLinks}</div>
                <div className="text-sm text-muted-foreground">Active Share Links</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Clicks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">${stats.pendingBacon.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Pending Bacon</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="🔍 Search your share links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter links" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Links</SelectItem>
            <SelectItem value="active">Active Links</SelectItem>
            <SelectItem value="high-potential">High Potential</SelectItem>
            <SelectItem value="recent">Recently Created</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="most-clicks">Most Clicks</SelectItem>
            <SelectItem value="highest-potential">Highest Potential</SelectItem>
            <SelectItem value="best-performance">Best Performance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Share Links Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredLinks.map((shareLink) => (
          <ShareLinkCard
            key={shareLink.id}
            shareLink={shareLink}
            viewMode={viewMode}
            onOpenTools={onOpenTools}
            onViewAnalytics={onViewAnalytics}
          />
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No share links found. Try adjusting your filters or create a new one!</p>
        </div>
      )}
    </div>
  );
};