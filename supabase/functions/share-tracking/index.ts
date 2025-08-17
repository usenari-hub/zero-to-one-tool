import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Utility Functions
const validateTrackingCode = (code: string): boolean => {
  return /^UOB-[A-Z0-9]{6}$/.test(code);
};

const calculateCommission = (
  purchaseAmount: number, 
  rewardPercentage: number, 
  degree: number
): number => {
  const totalReward = purchaseAmount * (rewardPercentage / 100);
  
  const degreePercentages: { [key: number]: number } = {
    1: 50,  // 50% for 1st degree
    2: 25,  // 25% for 2nd degree  
    3: 10,  // 10% for 3rd degree
    4: 7.5, // 7.5% for 4th degree
    5: 5,   // 5% for 5th degree
    6: 2.5  // 2.5% for 6th degree
  };
  
  const degreePercentage = degreePercentages[degree] || 0;
  return totalReward * (degreePercentage / 100);
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const method = req.method
    const pathSegments = url.pathname.split('/').filter(Boolean)

    if (method === 'POST' && pathSegments[pathSegments.length - 1] === 'track-click') {
      // Track Click
      const params = await req.json()
      
      if (!validateTrackingCode(params.trackingCode)) {
        throw new Error('Invalid tracking code format')
      }

      const { data, error } = await supabaseClient.rpc('track_share_click', {
        tracking_code_param: params.trackingCode,
        ip_address_param: params.ipAddress || null,
        user_agent_param: params.userAgent || null,
        referrer_url_param: params.referrerUrl || null,
        session_id_param: params.sessionId || null
      });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'POST' && pathSegments[pathSegments.length - 1] === 'record-conversion') {
      // Record Conversion
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      if (!user) {
        throw new Error('Unauthorized')
      }

      const params = await req.json()

      const { data, error } = await supabaseClient.rpc('record_share_conversion', {
        click_id_param: params.clickId,
        buyer_id_param: user.id,
        purchase_amount_param: params.purchaseAmount,
        degree_param: params.degree || 1
      });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'validate') {
      // Validate Tracking Code
      const trackingCode = url.searchParams.get('code')
      
      if (!trackingCode) {
        throw new Error('Tracking code is required')
      }

      const isValid = validateTrackingCode(trackingCode)
      
      if (!isValid) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid tracking code format' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if tracking code exists and is active
      const { data, error } = await supabaseClient
        .from('share_links')
        .select(`
          id,
          tracking_code,
          status,
          listings (
            id,
            item_title,
            asking_price,
            reward_percentage
          )
        `)
        .eq('tracking_code', trackingCode)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Tracking code not found or inactive' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Method not allowed')

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})