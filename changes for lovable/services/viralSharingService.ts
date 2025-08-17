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

export interface SharingMomentum {
  user_id: string
  current_streak_days: number
  shares_this_week: number
  conversions_this_week: number
  momentum_score: number
  bonus_multiplier: number
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
        .from('share_links')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          tracking_code: trackingCode,
          share_url: shareUrl,
          platform: platform,
          custom_message: customMessage,
          target_audience: targetAudience,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single()

      if (error) throw error

      // Update user momentum
      await this.updateSharingMomentum(user.id)
      
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
        .from('share_links')
        .select('id, user_id')
        .eq('tracking_code', trackingCode)
        .single()

      if (!shareLink) {
        console.warn('Share link not found for tracking code:', trackingCode)
        return
      }

      // Record analytics
      await supabase
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

      // Update click count
      await supabase
        .from('share_links')
        .update({ 
          clicks: supabase.sql`clicks + 1`,
          last_clicked_at: new Date().toISOString()
        })
        .eq('tracking_code', trackingCode)

    } catch (error) {
      console.error('Error tracking click:', error)
      // Don't throw error for tracking - it shouldn't break user experience
    }
  },

  /**
   * Track a conversion (signup or purchase)
   */
  async trackConversion(
    trackingCode: string,
    conversionType: 'signup' | 'purchase',
    conversionValue?: number
  ): Promise<void> {
    try {
      const { data: shareLink } = await supabase
        .from('share_links')
        .select('id, user_id')
        .eq('tracking_code', trackingCode)
        .single()

      if (!shareLink) return

      // Record conversion analytics
      await supabase
        .from('share_link_analytics')
        .insert({
          share_link_id: shareLink.id,
          event_type: conversionType,
          conversion_value: conversionValue,
          event_timestamp: new Date().toISOString()
        })

      // Update conversion count
      const updateField = conversionType === 'signup' ? 'signup_conversions' : 'conversions'
      await supabase
        .from('share_links')
        .update({ 
          [updateField]: supabase.sql`${updateField} + 1`
        })
        .eq('tracking_code', trackingCode)

      // If it's a purchase, calculate and award bacon
      if (conversionType === 'purchase' && conversionValue) {
        await this.awardBacon(shareLink.user_id, shareLink.id, conversionValue)
      }

    } catch (error) {
      console.error('Error tracking conversion:', error)
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
        .from('share_links')
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
   * Get analytics for a specific share link
   */
  async getShareLinkAnalytics(shareLinkId: string): Promise<ShareAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('share_link_analytics')
        .select('*')
        .eq('share_link_id', shareLinkId)
        .order('event_timestamp', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching share analytics:', error)
      return []
    }
  },

  /**
   * Update user's sharing momentum
   */
  async updateSharingMomentum(userId: string): Promise<void> {
    try {
      await supabase
        .rpc('update_sharing_momentum', {
          user_uuid: userId
        })
    } catch (error) {
      console.error('Error updating sharing momentum:', error)
    }
  },

  /**
   * Get user's sharing momentum
   */
  async getSharingMomentum(userId?: string): Promise<SharingMomentum | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const targetUserId = userId || user?.id
      
      if (!targetUserId) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('sharing_momentum')
        .select('*')
        .eq('user_id', targetUserId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No momentum record yet
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching sharing momentum:', error)
      return null
    }
  },

  /**
   * Award bacon for successful referral
   */
  async awardBacon(userId: string, shareLinkId: string, conversionValue: number): Promise<void> {
    try {
      // Get the share link to calculate bacon amount
      const { data: shareLink } = await supabase
        .from('share_links')
        .select(`
          *,
          listings(reward_percentage)
        `)
        .eq('id', shareLinkId)
        .single()

      if (!shareLink) return

      const rewardPercentage = shareLink.listings?.reward_percentage || 15
      const baconAmount = (conversionValue * rewardPercentage) / 100

      // Create bacon transaction
      await supabase
        .from('bacon_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'earned',
          amount: baconAmount,
          source_id: shareLinkId,
          source_type: 'share_link',
          description: `Referral commission from share link`,
          metadata: {
            conversion_value: conversionValue,
            reward_percentage: rewardPercentage
          }
        })

      // Update share link with bacon earned
      await supabase
        .from('share_links')
        .update({
          bacon_earned: supabase.sql`bacon_earned + ${baconAmount}`
        })
        .eq('id', shareLinkId)

    } catch (error) {
      console.error('Error awarding bacon:', error)
    }
  },

  /**
   * Get optimal sharing templates for a platform
   */
  async getShareTemplates(platform: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('share_templates')
        .select('*')
        .eq('platform', platform)
        .eq('is_active', true)
        .order('success_rate', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching share templates:', error)
      return []
    }
  },

  /**
   * Get platform optimization data
   */
  async getPlatformOptimization(platform: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('platform_optimization')
        .select('*')
        .eq('platform', platform)
        .order('confidence_score', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No optimization data yet
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching platform optimization:', error)
      return null
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