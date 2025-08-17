import { supabase } from '@/integrations/supabase/client';

export class RealTimeAnalytics {
  // Track real-time share link performance
  static async trackShareLinkClick(trackingCode: string, additionalData?: {
    userAgent?: string;
    referrer?: string;
    userId?: string;
    location?: string;
  }) {
    try {
      // Find the share event by tracking code
      const { data: shareEvents, error: findError } = await supabase
        .from('share_events')
        .select('id, chain_link_id, click_count')
        .ilike('share_url', `%${trackingCode}%`)
        .limit(1);

      if (findError) throw findError;

      if (shareEvents && shareEvents.length > 0) {
        const shareEvent = shareEvents[0];
        
        // Update click count
        const { error: updateError } = await supabase
          .from('share_events')
          .update({ 
            click_count: (shareEvent.click_count || 0) + 1 
          })
          .eq('id', shareEvent.id);

        if (updateError) throw updateError;

        // Create detailed click event
        const { error: clickError } = await supabase
          .from('click_events')
          .insert({
            share_event_id: shareEvent.id,
            ip_address: '0.0.0.0', // Would be actual IP in production
            user_agent: additionalData?.userAgent || navigator.userAgent,
            device_type: this.getDeviceType(),
            browser: this.getBrowserType(),
            country: 'US', // Would use geolocation service
            city: additionalData?.location || 'Dallas',
            clicked_at: new Date().toISOString()
          });

        if (clickError) throw clickError;

        return { success: true, shareEventId: shareEvent.id };
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      return { success: false, error };
    }
  }

  // Real-time stats for dashboard
  static async getRealTimeStats(userId: string) {
    try {
      // Get user's referrals
      const { data: referrals, error: refError } = await supabase
        .from('referrals')
        .select('id, created_at')
        .eq('referrer_id', userId);

      if (refError) throw refError;

      // Get share events for user's referrals
      const referralIds = referrals?.map(r => r.id) || [];
      
      let shareEvents = [];
      let totalClicks = 0;
      let totalConversions = 0;

      if (referralIds.length > 0) {
        const { data: events, error: eventsError } = await supabase
          .from('share_events')
          .select('*')
          .in('chain_link_id', referralIds);

        if (!eventsError && events) {
          shareEvents = events;
          totalClicks = events.reduce((sum, event) => sum + (event.click_count || 0), 0);
          totalConversions = events.reduce((sum, event) => sum + (event.purchase_conversions || 0), 0);
        }
      }

      // Get active chains
      const { data: chains, error: chainError } = await supabase
        .from('referral_chains')
        .select('*')
        .eq('status', 'active');

      const activeChains = chains?.length || 0;

      return {
        totalReferrals: referrals?.length || 0,
        activeChains,
        totalClicks,
        totalConversions,
        conversionRate: totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 100) : 0,
        avgDegree: referrals?.length > 0 ? 
          referrals.reduce((sum, r, index) => sum + (index + 1), 0) / referrals.length : 0,
        recentActivity: shareEvents.slice(-5).map(event => ({
          type: 'share',
          platform: event.platform,
          timestamp: event.shared_at,
          clicks: event.click_count || 0
        }))
      };
    } catch (error) {
      console.error('Error getting real-time stats:', error);
      return {
        totalReferrals: 0,
        activeChains: 0,
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        avgDegree: 0,
        recentActivity: []
      };
    }
  }

  // Get trending listings based on share activity
  static async getTrendingListings(limit: number = 10) {
    try {
      const { data: shareEvents, error } = await supabase
        .from('share_events')
        .select(`
          chain_link_id,
          click_count,
          platform,
          shared_at,
          referrals!chain_link_id (
            listing_id,
            listings (
              item_title,
              asking_price,
              reward_percentage,
              general_location
            )
          )
        `)
        .order('click_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return shareEvents?.map(event => {
        const referral = Array.isArray(event.referrals) ? event.referrals[0] : event.referrals;
        const listing = referral?.listings;
        
        return {
          listingId: referral?.listing_id,
          title: listing?.item_title || 'Unknown Item',
          price: listing?.asking_price || 0,
          location: listing?.general_location || 'Unknown',
          clicks: event.click_count || 0,
          platform: event.platform,
          baconPotential: Math.round((listing?.asking_price || 0) * (listing?.reward_percentage || 20) / 100),
          trendScore: (event.click_count || 0) * 1.5 + (event.platform === 'facebook' ? 10 : 5)
        };
      }).filter(item => item.listingId) || [];
    } catch (error) {
      console.error('Error getting trending listings:', error);
      return [];
    }
  }

  // Performance insights for specific share link
  static async getShareLinkInsights(shareEventId: string) {
    try {
      const { data: clickEvents, error } = await supabase
        .from('click_events')
        .select('*')
        .eq('share_event_id', shareEventId)
        .order('clicked_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentClicks = clickEvents?.filter(click => 
        new Date(click.clicked_at || '') > last24Hours
      ) || [];

      const deviceBreakdown = this.analyzeDeviceBreakdown(clickEvents || []);
      const hourlyPattern = this.analyzeHourlyPattern(clickEvents || []);
      const geographicData = this.analyzeGeographicData(clickEvents || []);

      return {
        totalClicks: clickEvents?.length || 0,
        recentClicks: recentClicks.length,
        clickTrend: recentClicks.length > 0 ? 'up' : 'stable',
        deviceBreakdown,
        hourlyPattern,
        geographicData,
        conversionRate: this.calculateConversionRate(clickEvents || []),
        recommendations: this.generateRecommendations(clickEvents || [])
      };
    } catch (error) {
      console.error('Error getting share link insights:', error);
      return null;
    }
  }

  // Helper methods
  private static getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|ios|iphone|ipad/.test(userAgent)) return 'mobile';
    if (/tablet/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private static getBrowserType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'Chrome';
    if (userAgent.includes('firefox')) return 'Firefox';
    if (userAgent.includes('safari')) return 'Safari';
    if (userAgent.includes('edge')) return 'Edge';
    return 'Other';
  }

  private static analyzeDeviceBreakdown(clicks: any[]) {
    const total = clicks.length;
    if (total === 0) return { mobile: 60, desktop: 30, tablet: 10 };

    const mobile = clicks.filter(c => c.device_type === 'mobile').length;
    const desktop = clicks.filter(c => c.device_type === 'desktop').length;
    const tablet = clicks.filter(c => c.device_type === 'tablet').length;

    return {
      mobile: Math.round((mobile / total) * 100),
      desktop: Math.round((desktop / total) * 100),
      tablet: Math.round((tablet / total) * 100)
    };
  }

  private static analyzeHourlyPattern(clicks: any[]) {
    const hourCounts = new Array(24).fill(0);
    
    clicks.forEach(click => {
      if (click.clicked_at) {
        const hour = new Date(click.clicked_at).getHours();
        hourCounts[hour]++;
      }
    });

    return hourCounts.map((count, hour) => ({
      hour,
      clicks: count
    }));
  }

  private static analyzeGeographicData(clicks: any[]) {
    const countries: { [key: string]: number } = {};
    const cities: { [key: string]: number } = {};

    clicks.forEach(click => {
      if (click.country) {
        countries[click.country] = (countries[click.country] || 0) + 1;
      }
      if (click.city) {
        cities[click.city] = (cities[click.city] || 0) + 1;
      }
    });

    return { countries, cities };
  }

  private static calculateConversionRate(clicks: any[]): number {
    if (clicks.length === 0) return 0;
    const conversions = clicks.filter(c => c.converted_to_purchase).length;
    return Math.round((conversions / clicks.length) * 100);
  }

  private static generateRecommendations(clicks: any[]): string[] {
    const recommendations = [];
    
    if (clicks.length === 0) {
      recommendations.push("Share your link on social media to start getting clicks");
      return recommendations;
    }

    const deviceBreakdown = this.analyzeDeviceBreakdown(clicks);
    if (deviceBreakdown.mobile > 70) {
      recommendations.push("Most clicks are from mobile - consider mobile-optimized content");
    }

    const conversionRate = this.calculateConversionRate(clicks);
    if (conversionRate < 2) {
      recommendations.push("Low conversion rate - try personalizing your message");
    } else if (conversionRate > 5) {
      recommendations.push("Great conversion rate - share more to increase earnings");
    }

    const hourlyData = this.analyzeHourlyPattern(clicks);
    const peakHour = hourlyData.reduce((max, curr) => 
      curr.clicks > max.clicks ? curr : max
    );
    
    if (peakHour.clicks > 0) {
      recommendations.push(`Peak activity at ${peakHour.hour}:00 - schedule posts around this time`);
    }

    return recommendations;
  }
}