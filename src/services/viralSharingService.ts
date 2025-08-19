import { supabase } from '@/integrations/supabase/client'

export interface ShareLink {
  id: string
  user_id: string
  listing_id: string
  tracking_code: string
  share_url: string
  short_url?: string
  platform: string
  custom_message?: string
  clicks: number
  unique_clicks: number
  conversions: number
  bacon_earned: number
  created_at: string
  expires_at: string
  is_active: boolean
}

export interface ShareAnalytics {
  share_link_id: string
  event_type: 'click' | 'view' | 'conversion' | 'signup'
  event_timestamp: string
  ip_address?: string
  user_agent?: string
  device_type?: string
  country?: string
  conversion_value?: number
}

export const viralSharingService = {
  /**
   * Generate a unique tracking code
   */
  generateTrackingCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  },

  /**
   * Create a new share link
   */
  async createShareLink(
    listingId: string,
    platform: string,
    customMessage?: string,
    targetAudience?: string
  ): Promise<ShareLink> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const trackingCode = this.generateTrackingCode()
      const shareUrl = `${window.location.origin}/listings/${listingId}?ref=${trackingCode}`
      
      const { data, error } = await supabase
        .from('share_links_enhanced')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          tracking_code: trackingCode,
          share_url: shareUrl,
          platform: platform,
          custom_message: customMessage,
          target_audience: targetAudience,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          is_active: true,
          clicks: 0,
          unique_clicks: 0,
          conversions: 0,
          bacon_earned: 0
        })
        .select()
        .single()

      if (error) {
        console.error('Database error creating share link:', error)
        throw new Error(`Failed to create share link: ${error.message}`)
      }
      
      if (!data) {
        throw new Error('No data returned from share link creation')
      }
      
      return data
    } catch (error) {
      console.error('Error creating share link:', error)
      throw new Error('Failed to create share link')
    }
  },

  /**
   * Track a click on a share link
   */
  async trackClick(
    trackingCode: string,
    additionalData?: {
      userAgent?: string
      referrer?: string
      userId?: string
    }
  ): Promise<void> {
    try {
      // Get the share link
      const { data: shareLink } = await supabase
        .from('share_links_enhanced')
        .select('id, user_id')
        .eq('tracking_code', trackingCode)
        .single()

      if (!shareLink) {
        console.warn('Share link not found for tracking code:', trackingCode)
        return
      }

      // Record analytics
      const { error: analyticsError } = await supabase
        .from('share_link_analytics')
        .insert({
          share_link_id: shareLink.id,
          event_type: 'click',
          user_agent: additionalData?.userAgent || navigator.userAgent,
          referrer_url: additionalData?.referrer,
          user_id: additionalData?.userId,
          device_type: this.getDeviceType(),
          event_timestamp: new Date().toISOString()
        })

      if (analyticsError) {
        console.warn('Failed to record analytics:', analyticsError)
        // Continue execution even if analytics fails
      }

      // Update click count
      await supabase
        .from('share_links_enhanced')
        .update({ 
          last_clicked_at: new Date().toISOString()
        })
        .eq('tracking_code', trackingCode)

      // For now, we'll manually increment clicks using a select/update pattern
      const { data: currentData } = await supabase
        .from('share_links_enhanced')
        .select('clicks')
        .eq('tracking_code', trackingCode)
        .single()

      if (currentData) {
        await supabase
          .from('share_links_enhanced')
          .update({ clicks: (currentData.clicks || 0) + 1 })
          .eq('tracking_code', trackingCode)
      }

    } catch (error) {
      console.error('Error tracking click:', error)
      // Don't throw error for tracking - it shouldn't break user experience
    }
  },

  /**
   * Get user's share links
   */
  async getMyShareLinks(limit = 50): Promise<ShareLink[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('share_links_enhanced')
        .select(`
          *,
          listings(item_title, price_min, price_max, reward_percentage)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching share links:', error)
      throw new Error('Failed to fetch share links')
    }
  },

  /**
   * Helper function to detect device type
   */
  getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
      return 'mobile'
    } else if (/tablet|ipad/.test(userAgent)) {
      return 'tablet'
    }
    return 'desktop'
  },

  /**
   * Generate platform-specific share content
   */
  generateShareContent(
    platform: string,
    listingTitle: string,
    baconPotential: number,
    customMessage?: string
  ): { title: string; content: string; hashtags: string[] } {
    const baseMessage = customMessage || `Check out this amazing deal: ${listingTitle}`
    
    switch (platform) {
      case 'facebook':
        return {
          title: `🎓 University of Bacon Course: ${listingTitle}`,
          content: `${baseMessage}\n\n💰 I could earn $${baconPotential} in bacon if someone buys through my referral!\n\n🔗 Join the academic network where your connections turn into cash!`,
          hashtags: ['#UniversityOfBacon', '#SocialCommerce', '#Referrals', '#EarnMoney']
        }
      
      case 'twitter':
        return {
          title: '',
          content: `🎓 Just shared a course at University of Bacon! ${baseMessage}\n\n💰 Could earn $${baconPotential} bacon if someone buys!\n\n🔗 Join the network:`,
          hashtags: ['#UofBacon', '#SocialCommerce', '#ReferralRewards', '#EarnBacon']
        }
      
      case 'linkedin':
        return {
          title: `Professional Opportunity: ${listingTitle}`,
          content: `I wanted to share this professional opportunity with my network: ${baseMessage}\n\nI'm part of University of Bacon, an innovative social commerce platform where professional networking generates real value. If this interests someone in my network, I could earn $${baconPotential} in referral rewards.\n\nIt's a fascinating model that turns authentic networking into mutual benefit.`,
          hashtags: ['#ProfessionalNetworking', '#SocialCommerce', '#Innovation', '#Referrals']
        }
      
      case 'whatsapp':
        return {
          title: '',
          content: `Hey! 👋 Thought you might be interested in this: ${listingTitle}\n\n${baseMessage}\n\nI'm using this cool platform called University of Bacon where I can earn money ($${baconPotential} in this case) just by sharing things with friends!\n\nCheck it out:`,
          hashtags: []
        }
      
      default:
        return {
          title: listingTitle,
          content: `${baseMessage}\n\nPotential earning: $${baconPotential}`,
          hashtags: ['#UniversityOfBacon', '#SocialCommerce']
        }
    }
  }
}