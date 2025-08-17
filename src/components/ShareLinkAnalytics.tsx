import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ShareLinkAnalyticsProps {
  shareLinkId: string;
}

interface AnalyticsData {
  share_link_id: string;
  tracking_code: string;
  platform: string;
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  conversion_rate: number;
  recent_clicks: Array<{
    clicked_at: string;
    converted: boolean;
    conversion_amount: number;
    ip_address: string;
  }>;
  hourly_stats: Array<{
    hour: string;
    clicks: number;
    conversions: number;
  }>;
}

export const ShareLinkAnalytics: React.FC<ShareLinkAnalyticsProps> = ({ shareLinkId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [shareLinkId]);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_share_link_performance', {
        share_link_id_param: shareLinkId
      });

      if (error) throw error;
      setAnalytics(data as unknown as AnalyticsData);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (!analytics) return <div className="p-4">No analytics available</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MousePointerClick className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{analytics.total_clicks}</div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{analytics.total_conversions}</div>
            <div className="text-sm text-muted-foreground">Conversions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">${analytics.total_earnings}</div>
            <div className="text-sm text-muted-foreground">Earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{analytics.conversion_rate}%</div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </CardContent>
        </Card>
      </div>

      {analytics.recent_clicks && analytics.recent_clicks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.recent_clicks.slice(0, 5).map((click, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <div className="text-sm font-medium">
                      {new Date(click.clicked_at).toLocaleDateString()} at {new Date(click.clicked_at).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      IP: {click.ip_address}
                    </div>
                  </div>
                  <div>
                    {click.converted ? (
                      <Badge className="bg-green-100 text-green-800">
                        Converted: ${click.conversion_amount}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Click Only</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};