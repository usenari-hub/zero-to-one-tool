import { supabase } from '@/integrations/supabase/client';

export interface ShareLink {
  id: string;
  user_id: string;
  listing_id: string;
  tracking_code: string;
  share_url: string;
  sharing_method: string;
  custom_message?: string;
  selected_platform?: string;
  total_clicks: number;
  conversions: number;
  bacon_earned: number;
  created_at: string;
}

export interface ShareEvent {
  id: string;
  chain_link_id: string;
  platform: string;
  final_content?: string;
  platform_clicks: number;
  conversions_from_this_share: number;
  shared_at: string;
  status: string;
}

export class SharingAPI {
  // Create share intent using existing tables
  static async createShareIntent(data: {
    listingId: string;
    sharingMethod: string;
    platform?: string;
    customMessage?: string;
  }) {
    // First, we need to create or find a referral chain for this listing
    const { data: existingChain, error: chainError } = await supabase
      .from('referral_chains')
      .select('*')
      .eq('listing_id', data.listingId)
      .eq('status', 'active')
      .maybeSingle();

    if (chainError && chainError.code !== 'PGRST116') {
      throw chainError;
    }

    let chainId = existingChain?.id;

    // If no chain exists, we'll create a referral entry for now
    if (!chainId) {
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert({
          listing_id: data.listingId,
          referrer_id: (await supabase.auth.getUser()).data.user?.id || '',
          degree: 1,
          note: `Share via ${data.platform || data.sharingMethod}`
        })
        .select()
        .single();

      if (referralError) throw referralError;
      
      // For this demo, we'll use the referral ID as a pseudo chain link
      chainId = referral.id;
    }

    // Create a share event
    const trackingCode = this.generateTrackingCode();
    const shareUrl = this.generateShareUrl(data.listingId, trackingCode);

    const { data: shareEvent, error: eventError } = await supabase
      .from('share_events')
      .insert({
        chain_link_id: chainId,
        platform: data.platform || data.sharingMethod,
        custom_message: data.customMessage,
        share_url: shareUrl
      })
      .select()
      .single();

    if (eventError) throw eventError;

    return {
      id: shareEvent.id,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      listing_id: data.listingId,
      tracking_code: trackingCode,
      share_url: shareUrl,
      sharing_method: data.sharingMethod,
      custom_message: data.customMessage,
      selected_platform: data.platform,
      total_clicks: 0,
      conversions: 0,
      bacon_earned: 0,
      created_at: shareEvent.shared_at || new Date().toISOString()
    };
  }

  // Get user's share links (using share_events as proxy)
  static async getMyShareLinks(params: {
    page?: number;
    limit?: number;
    filter?: string;
    sort?: string;
    search?: string;
  } = {}) {
    // Get user's referrals first
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        id,
        listing_id,
        created_at,
        listings!inner (
          item_title,
          price_min,
          price_max,
          general_location,
          reward_percentage
        )
      `);

    if (referralsError) throw referralsError;

    // Get share events for these referrals
    const referralIds = referrals.map(r => r.id);
    
    if (referralIds.length === 0) {
      return [];
    }

    const { data: shareEvents, error: eventsError } = await supabase
      .from('share_events')
      .select('*')
      .in('chain_link_id', referralIds)
      .order('shared_at', { ascending: false });

    if (eventsError) throw eventsError;

    // Transform to ShareLink format
    return shareEvents.map(event => {
      const referral = referrals.find(r => r.id === event.chain_link_id);
      const listing = referral?.listings;
      
      return {
        id: event.id,
        user_id: (supabase.auth.getUser() as any).data?.user?.id || '',
        listing_id: referral?.listing_id || '',
        tracking_code: this.extractTrackingCode(event.share_url || ''),
        share_url: event.share_url || '',
        sharing_method: event.platform,
        custom_message: event.custom_message,
        selected_platform: event.platform,
        total_clicks: event.click_count || 0,
        conversions: event.purchase_conversions || 0,
        bacon_earned: 0,
        created_at: event.shared_at || '',
        courseName: listing?.item_title || 'Unknown Course',
        courseImage: '/placeholder-course.jpg',
        baconPotential: Math.floor((listing?.reward_percentage || 20) * (listing?.price_max || 1000) / 100),
        status: 'active',
        performanceRating: this.getPerformanceRating(event.click_count || 0, event.purchase_conversions || 0)
      };
    });
  }

  // Get share tools data
  static async getShareToolsData(shareEventId: string) {
    const { data: shareEvent, error: eventError } = await supabase
      .from('share_events')
      .select(`
        *,
        referrals!chain_link_id (
          listing_id,
          listings (
            item_title,
            item_description,
            price_min,
            price_max,
            general_location,
            reward_percentage
          )
        )
      `)
      .eq('id', shareEventId)
      .single();

    if (eventError) throw eventError;

    const referral = Array.isArray(shareEvent.referrals) ? shareEvent.referrals[0] : shareEvent.referrals;
    const listing = referral?.listings;

    return {
      shareLink: {
        id: shareEvent.id,
        trackingCode: this.extractTrackingCode(shareEvent.share_url || ''),
        shareUrl: shareEvent.share_url || '',
        course: {
          id: referral?.listing_id || '',
          title: listing?.item_title || '',
          image: '/placeholder-course.jpg',
          department: 'General',
          priceRange: `$${listing?.price_min || 0} - $${listing?.price_max || 0}`,
          baconPotential: Math.floor((listing?.reward_percentage || 20) * (listing?.price_max || 1000) / 100)
        }
      },
      templates: [] // Would be populated from a templates system
    };
  }

  // Post to social media platform
  static async postToPlatform(data: {
    shareEventId: string;
    platform: string;
    content: string;
    imageUrl?: string;
    audience?: string;
  }) {
    // Update the existing share event
    const { data: updatedEvent, error } = await supabase
      .from('share_events')
      .update({
        platform: data.platform,
        custom_message: data.content,
        shared_at: new Date().toISOString()
      })
      .eq('id', data.shareEventId)
      .select()
      .single();

    if (error) throw error;

    return updatedEvent;
  }

  // Get analytics for share event
  static async getAnalytics(shareEventId: string, timeRange: string = '7d') {
    const { data: shareEvent, error: eventError } = await supabase
      .from('share_events')
      .select('*')
      .eq('id', shareEventId)
      .single();

    if (eventError) throw eventError;

    // Get related click events
    const { data: clickEvents, error: clickError } = await supabase
      .from('click_events')
      .select('*')
      .eq('share_event_id', shareEventId);

    if (clickError) throw clickError;

    return {
      overview: {
        totalClicks: shareEvent.click_count || 0,
        uniqueClicks: shareEvent.click_count || 0,
        conversions: shareEvent.purchase_conversions || 0,
        conversionRate: shareEvent.click_count > 0 ? (shareEvent.purchase_conversions / shareEvent.click_count) * 100 : 0,
        baconEarned: 0,
        performanceTrend: 'up' as const
      },
      trafficSources: [{
        platform: shareEvent.platform,
        clicks: shareEvent.click_count || 0,
        percentage: 100,
        conversionRate: shareEvent.click_count > 0 ? (shareEvent.purchase_conversions / shareEvent.click_count) * 100 : 0
      }],
      geographicData: {
        countries: { 'US': shareEvent.click_count || 0 },
        cities: { 'Dallas, TX': shareEvent.click_count || 0 }
      },
      deviceBreakdown: {
        mobile: 67,
        desktop: 28,
        tablet: 5
      },
      contentPerformance: [{
        platform: shareEvent.platform,
        content: shareEvent.custom_message || '',
        clicks: shareEvent.click_count || 0,
        conversionRate: shareEvent.click_count > 0 ? (shareEvent.purchase_conversions / shareEvent.click_count) * 100 : 0,
        performanceRating: this.getPerformanceRating(shareEvent.click_count || 0, shareEvent.purchase_conversions || 0)
      }],
      chainStatus: {
        chainId: shareEvent.chain_link_id,
        currentDegree: 1,
        potentialEarning: 100,
        conversionProbability: 60
      },
      clickDetails: clickEvents.map(click => ({
        id: click.id,
        timestamp: click.clicked_at || '',
        source: shareEvent.platform,
        location: `${click.city || 'Unknown'}, ${click.country || 'Unknown'}`,
        device: click.device_type || 'Unknown',
        browser: click.browser || 'Unknown',
        referrer: 'Direct',
        converted: click.converted_to_purchase || false,
        conversionTime: click.clicked_at,
        chainPosition: 1
      }))
    };
  }

  // Helper methods
  private static generateTrackingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static generateShareUrl(listingId: string, trackingCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/listings/${listingId}?ref=${trackingCode}`;
  }

  private static extractTrackingCode(shareUrl: string): string {
    const url = new URL(shareUrl);
    return url.searchParams.get('ref') || 'UNKNOWN';
  }

  private static getPerformanceRating(clicks: number, conversions: number): 'excellent' | 'good' | 'needs_improvement' {
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    if (conversionRate > 5) return 'excellent';
    if (conversionRate > 2) return 'good';
    return 'needs_improvement';
  }
}