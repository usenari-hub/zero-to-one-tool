import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Content Generation Helpers
const getPlatformOptimalTimes = (platform: string): string[] => {
  const times: { [key: string]: string[] } = {
    facebook: ['9:00 AM', '1:00 PM', '3:00 PM'],
    twitter: ['12:00 PM', '3:00 PM', '5:00 PM'],
    linkedin: ['7:00 AM', '12:00 PM', '5:00 PM'],
    instagram: ['11:00 AM', '1:00 PM', '5:00 PM'],
    email: ['10:00 AM', '2:00 PM', '8:00 PM'],
    whatsapp: ['10:00 AM', '2:00 PM', '7:00 PM']
  };
  
  return times[platform] || ['12:00 PM', '3:00 PM', '6:00 PM'];
};

const generatePlatformContent = (platform: string, listing: any): any => {
  const baconReward = Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100);
  const userEarning = Math.floor(baconReward * 0.5);

  const templates: { [key: string]: any } = {
    facebook: {
      content: `🔥 Found an Amazing ${listing.item_title}!\n\nJust discovered this on University of Bacon - the platform where your network literally pays you! 🎓\n\nThis ${listing.item_title}: ${listing.item_description}\n💰 Price: $${listing.asking_price}\n🥓 I could earn $${userEarning} just for sharing this!\n\nUniversity of Bacon is revolutionizing social commerce. Instead of random ads, you get recommendations from trusted connections - and everyone gets paid for good networking!\n\n#UniversityOfBacon #SocialCommerce #EarnFromYourNetwork`,
      hashtags: ['#UniversityOfBacon', '#SocialCommerce', '#EarnFromYourNetwork'],
      optimal_times: getPlatformOptimalTimes('facebook')
    },
    
    twitter: {
      content: `🚨 Network Gold Alert!\n\nFound: ${listing.item_title} - $${listing.asking_price}\n\n🎓 University of Bacon lets me earn $${userEarning} for connecting this with the right person!\n\nHow it works:\n✅ Share with network\n✅ Someone buys → get paid\n✅ They share → they get paid\n✅ Everyone wins!\n\nThis is the future of social commerce 🔥\n\n#UniversityOfBacon #SocialCommerce`,
      hashtags: ['#UniversityOfBacon', '#SocialCommerce', '#NetworkingPays'],
      optimal_times: getPlatformOptimalTimes('twitter')
    },
    
    linkedin: {
      content: `Exploring University of Bacon - a fascinating platform monetizing professional networking.\n\nThe concept: Every transaction happens through referral chains. When you connect a buyer with a seller, you earn "bacon" (real money).\n\nCase study: This ${listing.item_title} has a $${baconReward} reward pool. If I refer it to someone who purchases, I earn $${userEarning}.\n\nWhat makes this brilliant:\n→ Sellers get quality leads from trusted sources\n→ Buyers get recommendations from their network\n→ Referrers earn real money for making connections\n→ No spam or cold outreach needed\n\nThis could revolutionize professional networking. Thoughts?\n\n#Innovation #SocialCommerce #Networking`,
      hashtags: ['#Innovation', '#SocialCommerce', '#Networking'],
      optimal_times: getPlatformOptimalTimes('linkedin')
    },
    
    email: {
      subject: `Thought you'd love this ${listing.item_title} (+ how I'm earning money from networking)`,
      content: `Hey [Name],\n\nHope you're doing well! I came across this ${listing.item_title} and immediately thought of you.\n\nBut here's the really cool part - I found it on this new platform called University of Bacon that actually pays you for making good connections in your network.\n\nItem details:\n• ${listing.item_description}\n• Price: $${listing.asking_price}\n• Location: ${listing.location || 'Local area'}\n\nIf you're interested and purchase through my link, I'd earn $${userEarning}. But even if you're not buying, you could share it with someone else and potentially earn bacon yourself!\n\nLet me know what you think!\n\nBest,\n[Your name]`,
      optimal_times: getPlatformOptimalTimes('email')
    }
  };

  return templates[platform] || templates.facebook;
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

    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'user-analytics') {
      // Get Share Analytics for User
      const { data, error } = await supabaseClient.rpc('get_share_analytics', {
        user_id_param: user.id
      });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'share-link-performance') {
      // Get Share Link Performance
      const shareLinkId = url.searchParams.get('id')
      if (!shareLinkId) {
        throw new Error('Share link ID is required')
      }

      const { data, error } = await supabaseClient.rpc('get_share_link_performance', {
        share_link_id_param: shareLinkId
      });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'recent-activity') {
      // Get Recent Share Activity
      const limit = parseInt(url.searchParams.get('limit') || '10')

      const { data, error } = await supabaseClient
        .from('share_clicks')
        .select(`
          *,
          share_links!inner (
            platform,
            tracking_code,
            user_id,
            listings (
              item_title,
              asking_price
            )
          )
        `)
        .eq('share_links.user_id', user.id)
        .order('clicked_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'top-performing') {
      // Get Top Performing Links
      const metric = url.searchParams.get('metric') || 'clicks'
      const limit = parseInt(url.searchParams.get('limit') || '5')
      
      const orderColumn = metric === 'earnings' ? 'bacon_earned' : metric;
      
      const { data, error } = await supabaseClient
        .from('share_links')
        .select(`
          *,
          listings (
            item_title,
            asking_price,
            category
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order(orderColumn, { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'POST' && pathSegments[pathSegments.length - 1] === 'generate-content') {
      // Generate Platform Content
      const params = await req.json()
      
      if (!params.platform || !params.listing) {
        throw new Error('Platform and listing data are required')
      }

      const content = generatePlatformContent(params.platform, params.listing);

      return new Response(
        JSON.stringify({ success: true, data: content }),
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