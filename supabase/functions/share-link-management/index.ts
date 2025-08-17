import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Utility Functions
const generateTrackingCode = (): string => {
  const prefix = 'UOB';
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomString}`;
};

const getShareableUrl = (listingId: string, trackingCode: string): string => {
  const baseUrl = 'https://earnyourbacon.online';
  return `${baseUrl}/course/${listingId}?ref=${trackingCode}`;
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

    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)
    const method = req.method
    const pathSegments = url.pathname.split('/').filter(Boolean)

    if (method === 'POST' && pathSegments[pathSegments.length - 1] === 'create') {
      // Create Share Link
      const params = await req.json()
      
      const trackingCode = generateTrackingCode();
      const shareUrl = getShareableUrl(params.listingId, trackingCode);

      const { data, error } = await supabaseClient
        .from('share_links')
        .insert({
          listing_id: params.listingId,
          user_id: user.id,
          platform: params.platform,
          custom_message: params.customMessage,
          content_generated: params.contentGenerated,
          tracking_code: trackingCode,
          share_url: shareUrl,
          status: 'active',
          clicks: 0,
          conversions: 0,
          bacon_earned: 0
        })
        .select(`
          *,
          listings (
            item_title,
            asking_price,
            item_description,
            category,
            reward_percentage
          )
        `)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET') {
      // Get User Share Links
      const platform = url.searchParams.get('platform')
      const status = url.searchParams.get('status')
      const limit = parseInt(url.searchParams.get('limit') || '10')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabaseClient
        .from('share_links')
        .select(`
          *,
          listings (
            item_title,
            asking_price,
            item_description,
            category,
            location,
            reward_percentage,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      if (status) {
        query = query.eq('status', status);
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'PUT') {
      // Update Share Link
      const shareLinkId = url.searchParams.get('id')
      if (!shareLinkId) {
        throw new Error('Share link ID is required')
      }

      const updates = await req.json()

      const { data, error } = await supabaseClient
        .from('share_links')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', shareLinkId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'DELETE') {
      // Delete Share Link
      const shareLinkId = url.searchParams.get('id')
      if (!shareLinkId) {
        throw new Error('Share link ID is required')
      }

      const { error } = await supabaseClient
        .from('share_links')
        .delete()
        .eq('id', shareLinkId)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
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