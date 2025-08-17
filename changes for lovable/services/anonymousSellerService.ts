import { supabase } from '@/integrations/supabase/client'

export interface AnonymousProfile {
  id: string
  listing_id: string
  anonymous_name: string
  anonymous_avatar: string
  anonymous_bio: string
  display_stats: {
    rating: number
    total_sales: number
    response_rate: number
  }
  verification_level: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | 'professor'
  location_general: string
  member_since: string
  verification_badges: Array<{
    badge_type: string
    display_name: string
    badge_icon: string
  }>
  academic_gpa: number
  honor_status: 'enrolled' | 'honor_roll' | 'deans_list'
}

export const anonymousSellerService = {
  /**
   * Create anonymous profile for a listing
   */
  async createAnonymousProfile(listingId: string, sellerId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .rpc('generate_anonymous_profile', {
          listing_id: listingId,
          seller_id: sellerId
        })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating anonymous profile:', error)
      throw new Error('Failed to create anonymous profile')
    }
  },

  /**
   * Get anonymous profile for a listing
   */
  async getAnonymousProfile(listingId: string): Promise<AnonymousProfile | null> {
    try {
      const { data, error } = await supabase
        .from('anonymous_profiles')
        .select(`
          *,
          verification_badges(*),
          anonymous_seller_stats(*)
        `)
        .eq('listing_id', listingId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No anonymous profile found - this is expected for new listings
          return null
        }
        throw error
      }

      // Transform the data to match our interface
      const profile: AnonymousProfile = {
        id: data.id,
        listing_id: data.listing_id,
        anonymous_name: data.anonymous_name,
        anonymous_avatar: data.anonymous_avatar,
        anonymous_bio: data.anonymous_bio,
        display_stats: data.display_stats || {
          rating: 4.0 + Math.random() * 1.0,
          total_sales: Math.floor(Math.random() * 50),
          response_rate: 85 + Math.floor(Math.random() * 15)
        },
        verification_level: data.verification_level,
        location_general: data.location_general,
        member_since: data.member_since,
        verification_badges: data.verification_badges || [],
        academic_gpa: data.academic_gpa || 3.0 + Math.random() * 1.0,
        honor_status: data.honor_status || 'enrolled'
      }

      return profile
    } catch (error) {
      console.error('Error fetching anonymous profile:', error)
      throw new Error('Failed to fetch anonymous profile')
    }
  },

  /**
   * Reveal seller contact after payment confirmation
   */
  async revealSellerContact(paymentIntentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('reveal_seller_contact', {
          payment_intent_id: paymentIntentId
        })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error revealing seller contact:', error)
      throw new Error('Failed to reveal seller contact')
    }
  },

  /**
   * Create contact lockdown for a purchase
   */
  async createContactLockdown(
    listingId: string, 
    buyerId: string, 
    sellerId: string, 
    escrowPaymentId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_lockdown')
        .insert({
          listing_id: listingId,
          buyer_id: buyerId,
          seller_id: sellerId,
          escrow_payment_id: escrowPaymentId
        })
      
      if (error) throw error
    } catch (error) {
      console.error('Error creating contact lockdown:', error)
      throw new Error('Failed to create contact lockdown')
    }
  },

  /**
   * Check if seller contact is revealed for a purchase
   */
  async isContactRevealed(listingId: string, buyerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('contact_lockdown')
        .select('contact_revealed')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return false // No lockdown record found
        }
        throw error
      }
      
      return data.contact_revealed || false
    } catch (error) {
      console.error('Error checking contact revelation:', error)
      return false
    }
  },

  /**
   * Get seller verification badges
   */
  async getVerificationBadges(anonymousProfileId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('verification_badges')
        .select('*')
        .eq('anonymous_profile_id', anonymousProfileId)
        .eq('is_active', true)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching verification badges:', error)
      return []
    }
  }
}