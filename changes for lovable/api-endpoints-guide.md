# API Endpoints Implementation Guide

## 🎯 Overview

This guide shows you how to implement the API endpoints needed for the University of Bacon billion-dollar platform. We'll cover three approaches: Supabase Edge Functions, Next.js API routes, and client-side Supabase functions.

## 📋 Required API Endpoints

### 🛡️ Anonymous Seller System
- `POST /api/anonymous/create-profile` - Generate anonymous profile
- `GET /api/anonymous/profile/:listingId` - Get anonymous seller info
- `POST /api/anonymous/reveal-contact` - Reveal seller after payment

### 📈 Viral Sharing System  
- `POST /api/sharing/create-link` - Generate tracked referral link
- `GET /api/sharing/my-links` - User's share links dashboard
- `POST /api/sharing/track-click` - Record click events
- `GET /api/sharing/analytics/:linkId` - Performance data

### 🎓 Academic System
- `GET /api/academic/dashboard` - Student portal overview
- `GET /api/academic/transcripts` - Academic records
- `POST /api/academic/calculate-gpa` - Update GPA
- `POST /api/academic/award-achievement` - Give achievement

### 💰 Bacon Banking
- `GET /api/bacon/balance` - Current balance
- `POST /api/bacon/withdraw` - Process withdrawal
- `GET /api/bacon/transactions` - Transaction history

---

## 🚀 Option 1: Supabase Edge Functions (Recommended)

### Step 1: Create Edge Functions

In your Supabase project dashboard:

1. Go to **Edge Functions**
2. Create new functions for each endpoint
3. Deploy them to your Supabase project

### Anonymous Seller Endpoints

#### `supabase/functions/anonymous-profile/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { method } = req
    const url = new URL(req.url)

    if (method === 'POST' && url.pathname === '/anonymous-profile') {
      const { listingId, sellerId } = await req.json()

      // Call the database function to generate anonymous profile
      const { data, error } = await supabase
        .rpc('generate_anonymous_profile', {
          listing_id: listingId,
          seller_id: sellerId
        })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, profileId: data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'GET' && url.pathname.startsWith('/anonymous-profile/')) {
      const listingId = url.pathname.split('/').pop()

      const { data, error } = await supabase
        .from('anonymous_profiles')
        .select(`
          *,
          verification_badges(*),
          anonymous_seller_stats(*)
        `)
        .eq('listing_id', listingId)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

#### `supabase/functions/viral-sharing/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const authHeader = req.headers.get('Authorization')!
    
    // Set the auth header for RLS
    supabase.auth.setAuth(authHeader.replace('Bearer ', ''))

    if (method === 'POST' && url.pathname === '/create-share-link') {
      const { listingId, platform, customMessage } = await req.json()
      
      // Get user from auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Generate unique tracking code
      const { data: trackingCode } = await supabase.rpc('generate_tracking_code')
      
      // Create share link
      const shareUrl = `${Deno.env.get('SITE_URL')}/listings/${listingId}?ref=${trackingCode}`
      
      const { data, error } = await supabase
        .from('share_links')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          tracking_code: trackingCode,
          share_url: shareUrl,
          platform: platform,
          custom_message: customMessage
        })
        .select()
        .single()

      if (error) throw error

      // Update user momentum
      await supabase.rpc('update_sharing_momentum', { user_uuid: user.id })

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'POST' && url.pathname === '/track-click') {
      const { trackingCode, userAgent, ipAddress } = await req.json()

      // Record click event
      const { data, error } = await supabase
        .from('share_link_analytics')
        .insert({
          share_link_id: (
            await supabase
              .from('share_links')
              .select('id')
              .eq('tracking_code', trackingCode)
              .single()
          ).data.id,
          event_type: 'click',
          user_agent: userAgent,
          ip_address: ipAddress
        })

      if (error) throw error

      // Update click count
      await supabase
        .from('share_links')
        .update({ clicks: supabase.sql`clicks + 1` })
        .eq('tracking_code', trackingCode)

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'GET' && url.pathname === '/my-share-links') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('share_links')
        .select(`
          *,
          listings(item_title, price_min, price_max)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

#### `supabase/functions/academic-system/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const authHeader = req.headers.get('Authorization')!
    
    supabase.auth.setAuth(authHeader.replace('Bearer ', ''))

    if (method === 'GET' && url.pathname === '/dashboard') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Get degree progression
      const { data: progression } = await supabase
        .from('degree_progression')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Get recent transcripts
      const { data: transcripts } = await supabase
        .from('academic_transcripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Get achievements
      const { data: achievements } = await supabase
        .from('academic_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_date', { ascending: false })
        .limit(3)

      return new Response(
        JSON.stringify({
          progression,
          recentTranscripts: transcripts,
          recentAchievements: achievements
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'POST' && url.pathname === '/calculate-gpa') {
      const { semester, academicYear } = await req.json()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data: gpa } = await supabase
        .rpc('calculate_semester_gpa', {
          user_uuid: user.id,
          semester_name: semester,
          year: academicYear
        })

      return new Response(
        JSON.stringify({ gpa }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'POST' && url.pathname === '/award-achievement') {
      const { achievementType, achievementName, semester } = await req.json()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data } = await supabase
        .rpc('award_achievement', {
          user_uuid: user.id,
          achievement_type_val: achievementType,
          achievement_name_val: achievementName,
          semester_val: semester
        })

      return new Response(
        JSON.stringify({ success: data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

#### `supabase/functions/bacon-bank/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const authHeader = req.headers.get('Authorization')!
    
    supabase.auth.setAuth(authHeader.replace('Bearer ', ''))

    if (method === 'GET' && url.pathname === '/balance') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Get total bacon balance
      const { data: balance } = await supabase
        .from('bacon_transactions')
        .select('running_balance')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Get pending earnings
      const { data: pending } = await supabase
        .from('bacon_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earned')
        .eq('payout_status', 'pending')

      const pendingTotal = pending?.reduce((sum, t) => sum + t.amount, 0) || 0

      return new Response(
        JSON.stringify({
          availableBalance: balance?.running_balance || 0,
          pendingEarnings: pendingTotal
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'POST' && url.pathname === '/withdraw') {
      const { amount, paymentMethodId } = await req.json()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Validate minimum withdrawal
      if (amount < 5) {
        throw new Error('Minimum withdrawal amount is $5.00')
      }

      // Create withdrawal transaction
      const { data, error } = await supabase
        .from('bacon_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'withdrawal',
          amount: -amount,
          description: `Withdrawal to payment method ${paymentMethodId}`,
          payout_method: paymentMethodId,
          payout_status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          transactionId: data.id,
          message: 'Withdrawal request submitted. Processing time: 1-3 business days.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (method === 'GET' && url.pathname === '/transactions') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('bacon_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

---

## 🎯 Option 2: Client-Side Supabase Functions

Create a service layer for simpler operations:

#### `src/services/anonymousSellerService.ts`
```typescript
import { supabase } from '@/integrations/supabase/client'

export const anonymousSellerService = {
  async createAnonymousProfile(listingId: string, sellerId: string) {
    const { data, error } = await supabase
      .rpc('generate_anonymous_profile', {
        listing_id: listingId,
        seller_id: sellerId
      })
    
    if (error) throw error
    return data
  },

  async getAnonymousProfile(listingId: string) {
    const { data, error } = await supabase
      .from('anonymous_profiles')
      .select(`
        *,
        verification_badges(*),
        anonymous_seller_stats(*)
      `)
      .eq('listing_id', listingId)
      .single()
    
    if (error) throw error
    return data
  },

  async revealSellerContact(paymentIntentId: string) {
    const { data, error } = await supabase
      .rpc('reveal_seller_contact', {
        payment_intent_id: paymentIntentId
      })
    
    if (error) throw error
    return data
  }
}
```

#### `src/services/viralSharingService.ts`
```typescript
import { supabase } from '@/integrations/supabase/client'

export const viralSharingService = {
  async createShareLink(listingId: string, platform: string, customMessage?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Generate tracking code
    const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    const shareUrl = `${window.location.origin}/listings/${listingId}?ref=${trackingCode}`
    
    const { data, error } = await supabase
      .from('share_links')
      .insert({
        user_id: user.id,
        listing_id: listingId,
        tracking_code: trackingCode,
        share_url: shareUrl,
        platform: platform,
        custom_message: customMessage
      })
      .select()
      .single()

    if (error) throw error

    // Update momentum
    await this.updateSharingMomentum(user.id)
    
    return data
  },

  async trackClick(trackingCode: string) {
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('id')
      .eq('tracking_code', trackingCode)
      .single()

    if (shareLink) {
      // Record analytics
      await supabase
        .from('share_link_analytics')
        .insert({
          share_link_id: shareLink.id,
          event_type: 'click',
          user_agent: navigator.userAgent,
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
    }
  },

  async getMyShareLinks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('share_links')
      .select(`
        *,
        listings(item_title, price_min, price_max)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateSharingMomentum(userId: string) {
    const { error } = await supabase
      .rpc('update_sharing_momentum', {
        user_uuid: userId
      })
    
    if (error) console.error('Error updating momentum:', error)
  }
}
```

#### `src/services/academicService.ts`
```typescript
import { supabase } from '@/integrations/supabase/client'

export const academicService = {
  async getDashboard() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const [progression, transcripts, achievements] = await Promise.all([
      supabase
        .from('degree_progression')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      
      supabase
        .from('academic_transcripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      
      supabase
        .from('academic_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_date', { ascending: false })
    ])

    return {
      progression: progression.data,
      recentTranscripts: transcripts.data,
      achievements: achievements.data
    }
  },

  async calculateGPA(semester: string, academicYear: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .rpc('calculate_semester_gpa', {
        user_uuid: user.id,
        semester_name: semester,
        year: academicYear
      })

    if (error) throw error
    return data
  },

  async awardAchievement(
    achievementType: string, 
    achievementName: string, 
    semester?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .rpc('award_achievement', {
        user_uuid: user.id,
        achievement_type_val: achievementType,
        achievement_name_val: achievementName,
        semester_val: semester
      })

    if (error) throw error
    return data
  },

  async getTranscripts() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('academic_transcripts')
      .select('*')
      .eq('user_id', user.id)
      .order('semester', { ascending: false })

    if (error) throw error
    return data
  }
}
```

#### `src/services/baconBankService.ts`
```typescript
import { supabase } from '@/integrations/supabase/client'

export const baconBankService = {
  async getBalance() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Get latest balance
    const { data: balance } = await supabase
      .from('bacon_transactions')
      .select('running_balance')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Get pending earnings
    const { data: pending } = await supabase
      .from('bacon_transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('transaction_type', 'earned')
      .eq('payout_status', 'pending')

    const pendingTotal = pending?.reduce((sum, t) => sum + t.amount, 0) || 0

    return {
      availableBalance: balance?.running_balance || 0,
      pendingEarnings: pendingTotal
    }
  },

  async withdraw(amount: number, paymentMethodId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    if (amount < 5) {
      throw new Error('Minimum withdrawal amount is $5.00')
    }

    const { data, error } = await supabase
      .from('bacon_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal to payment method ${paymentMethodId}`,
        payout_method: paymentMethodId,
        payout_status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getTransactions(limit = 50) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('bacon_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}
```

---

## 🔧 Integration in Components

Here's how to use these services in your React components:

#### Example: Using in EnhancedCourseCard
```typescript
import { anonymousSellerService } from '@/services/anonymousSellerService'
import { viralSharingService } from '@/services/viralSharingService'

export const EnhancedCourseCard = ({ course, onShareClick }) => {
  const handleShareClick = async () => {
    try {
      const shareLink = await viralSharingService.createShareLink(
        course.id,
        'facebook',
        'Check out this amazing course!'
      )
      
      // Open sharing modal with the generated link
      onShareClick(course.id, shareLink)
    } catch (error) {
      console.error('Error creating share link:', error)
    }
  }

  // Component JSX...
}
```

#### Example: Using in StudentDashboard
```typescript
import { academicService } from '@/services/academicService'

export const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await academicService.getDashboard()
        setDashboardData(data)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
    }

    loadDashboard()
  }, [])

  // Component JSX...
}
```

---

## 🚀 Deployment Steps

### For Supabase Edge Functions:
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Deploy functions: `supabase functions deploy`

### For Client-Side Services:
1. Create the service files in `src/services/`
2. Import and use them in your components
3. Make sure your Supabase RLS policies are set up correctly

---

## 🔐 Security Considerations

1. **RLS Policies**: Ensure all tables have proper Row Level Security
2. **Authentication**: Always verify user authentication in sensitive operations
3. **Input Validation**: Validate all inputs on both client and server side
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **CORS**: Configure CORS properly for your domain

This setup gives you a complete API layer for your billion-dollar University of Bacon platform! 🎓🥓💰