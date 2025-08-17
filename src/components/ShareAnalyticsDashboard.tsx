import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  DollarSign, 
  BarChart3,
  Download,
  Clock,
  Smartphone,
  MapPin,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AnalyticsData {
  shareLinkId: string;
  overview: {
    totalClicks: number;
    uniqueClicks: number;
    conversions: number;
    conversionRate: number;
    baconEarned: number;
    performanceTrend: 'up' | 'down' | 'stable';
  };
  trafficSources: Array<{
    platform: string;
    clicks: number;
    percentage: number;
    conversionRate: number;
  }>;
  geographicData: {
    countries: Record<string, number>;
    cities: Record<string, number>;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  contentPerformance: Array<{
    platform: string;
    content: string;
    clicks: number;
    conversionRate: number;
    performanceRating: 'excellent' | 'good' | 'needs_improvement';
  }>;
  chainStatus: {
    chainId: string;
    currentDegree: number;
    potentialEarning: number;
    conversionProbability: number;
  };
  clickDetails: Array<{
    id: string;
    timestamp: string;
    source: string;
    location: string;
    device: string;
    browser: string;
    referrer: string;
    converted: boolean;
    conversionTime?: string;
    chainPosition?: number;
  }>;
}

interface ShareAnalyticsDashboardProps {
  analyticsData: AnalyticsData;
  onExport: (format: string, dataType: string) => void;
  onOptimizeChain: () => void;
  onViewChainDetails: () => void;
}

export const ShareAnalyticsDashboard: React.FC<ShareAnalyticsDashboardProps> = ({
  analyticsData,
  onExport,
  onOptimizeChain,
  onViewChainDetails
}) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedTab, setSelectedTab] = useState('clicks');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableFilter, setTableFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { overview, trafficSources, geographicData, deviceBreakdown, contentPerformance, chainStatus, clickDetails } = analyticsData;

  const overviewCards = [
    {
      title: 'Total Clicks',
      value: overview.totalClicks.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      change: '+23% vs last period',
      trending: 'up' as const
    },
    {
      title: 'Conversions',
      value: overview.conversions.toString(),
      icon: <Target className="w-5 h-5" />,
      change: '+15% vs last period',
      trending: 'up' as const
    },
    {
      title: 'Bacon Earned',
      value: `$${overview.baconEarned.toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5" />,
      change: '+45% vs last period',
      trending: 'up' as const
    },
    {
      title: 'Conversion Rate',
      value: `${overview.conversionRate.toFixed(1)}%`,
      icon: <BarChart3 className="w-5 h-5" />,
      change: '-5% vs last period',
      trending: 'down' as const
    }
  ];

  const filteredClicks = clickDetails.filter(click => {
    const matchesSearch = click.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         click.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = tableFilter === 'all' || 
                         (tableFilter === 'converted' && click.converted) ||
                         (tableFilter === 'recent' && new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
    return matchesSearch && matchesFilter;
  });

  const topCities = Object.entries(geographicData.cities)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>🔗 My Share Links</span>
          <span>&gt;</span>
          <span>📊 Analytics</span>
        </div>
        
        <div className="flex gap-2 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => onExport('csv', 'analytics')}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, index) => (
          <Card key={index} className="hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-sm text-muted-foreground">{card.title}</div>
                  <div className={`text-xs flex items-center gap-1 mt-1 ${
                    card.trending === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.trending === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {card.change}
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>📱 Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {source.platform === 'facebook' ? '📘' :
                       source.platform === 'twitter' ? '🐦' :
                       source.platform === 'linkedin' ? '💼' :
                       source.platform === 'email' ? '📧' : '🔗'}
                    </span>
                    <span className="font-medium capitalize">{source.platform}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{source.clicks} clicks</div>
                    <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                  </div>
                </div>
                <Progress value={source.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>🌍 Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Interactive Map</span>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏙️ Top Locations:</h4>
                <div className="space-y-2">
                  {topCities.map(([city, clicks]) => (
                    <div key={city} className="flex justify-between">
                      <span>{city}</span>
                      <span className="font-medium">{clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>📱 Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile</span>
                </div>
                <span className="font-semibold">{deviceBreakdown.mobile}%</span>
              </div>
              <Progress value={deviceBreakdown.mobile} className="h-2" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💻</span>
                  <span>Desktop</span>
                </div>
                <span className="font-semibold">{deviceBreakdown.desktop}%</span>
              </div>
              <Progress value={deviceBreakdown.desktop} className="h-2" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📟</span>
                  <span>Tablet</span>
                </div>
                <span className="font-semibold">{deviceBreakdown.tablet}%</span>
              </div>
              <Progress value={deviceBreakdown.tablet} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Referral Chain Status */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 Referral Chain Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{chainStatus.chainId}</div>
                  <div className="text-sm text-muted-foreground">
                    {chainStatus.currentDegree} degrees deep
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${chainStatus.potentialEarning.toFixed(2)}</div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={chainStatus.conversionProbability} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {chainStatus.conversionProbability}% to conversion
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onViewChainDetails}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button size="sm" onClick={onOptimizeChain}>
                <Settings className="w-4 h-4 mr-2" />
                Optimize Chain
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentPerformance.map((content, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {content.platform === 'facebook' ? '📘' :
                         content.platform === 'twitter' ? '🐦' :
                         content.platform === 'linkedin' ? '💼' : '📱'}
                      </span>
                      <span className="font-medium capitalize">{content.platform}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      "{content.content.substring(0, 60)}..."
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>{content.clicks} clicks</span>
                      <span>{content.conversionRate.toFixed(1)}% CTR</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={content.performanceRating === 'excellent' ? 'default' : 
                            content.performanceRating === 'good' ? 'secondary' : 'destructive'}
                  >
                    {content.performanceRating === 'excellent' && '🏆 Best Performer'}
                    {content.performanceRating === 'good' && '✅ Good'}
                    {content.performanceRating === 'needs_improvement' && '⚠️ Needs Improvement'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="clicks">📊 Click Details</TabsTrigger>
              <TabsTrigger value="conversions">🎯 Conversion Tracking</TabsTrigger>
              <TabsTrigger value="referrers">🔗 Referrer Analysis</TabsTrigger>
              <TabsTrigger value="devices">📱 Device Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="clicks" className="space-y-4">
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="🔍 Search clicks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                
                <Select value={tableFilter} onValueChange={setTableFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clicks</SelectItem>
                    <SelectItem value="converted">Converted Only</SelectItem>
                    <SelectItem value="recent">Last 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Converted</TableHead>
                    <TableHead>Chain Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClicks.slice((currentPage - 1) * 10, currentPage * 10).map((click) => (
                    <TableRow key={click.id}>
                      <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">
                            {click.source === 'facebook' ? '📘' :
                             click.source === 'twitter' ? '🐦' :
                             click.source === 'linkedin' ? '💼' : '📱'}
                          </span>
                          {click.source}
                        </div>
                      </TableCell>
                      <TableCell>{click.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {click.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : 
                           click.device.includes('Desktop') ? '💻' : '📟'}
                          {click.device}
                        </div>
                      </TableCell>
                      <TableCell>{click.referrer}</TableCell>
                      <TableCell>
                        <Badge variant={click.converted ? 'default' : 'secondary'}>
                          {click.converted ? '✅ Yes' : '⏳ Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{click.chainPosition ? `${click.chainPosition}st Degree` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(filteredClicks.length / 10)}
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage >= Math.ceil(filteredClicks.length / 10)}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Optimization Opportunity</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your Twitter posts could perform 23% better with more hashtags and shorter text.
                  </p>
                  <Button size="sm" className="mt-2">Apply Suggestion</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Best Posting Times</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your audience is most active on Tuesday-Thursday, 2-4 PM CST.
                  </p>
                  <Button size="sm" className="mt-2">Schedule Next Post</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};