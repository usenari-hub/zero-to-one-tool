import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { BaconBank } from "@/components/BaconBank";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ReferralDashboard } from "@/components/ReferralDashboard";
import { AccountSidebar } from "@/components/AccountSidebar";
import { VerificationSection } from "@/components/account/VerificationSection";
import { ListingsSection } from "@/components/account/ListingsSection";
import { PaymentHistorySection } from "@/components/account/PaymentHistorySection";
import { MessageCenter } from "@/components/MessageCenter";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, Share2, Eye, Sparkles, Zap, DollarSign, Users, TrendingUp, BarChart3, Link2, ExternalLink, MousePointerClick, Banknote } from 'lucide-react';

// Enhanced types for the complete sharing system
interface Listing {
  id: string;
  user_id: string;
  item_title: string;
  item_description: string | null;
  asking_price: number | null;
  reward_percentage: number | null;
  max_degrees: number;
  status: string;
  created_at: string;
  updated_at: string;
  item_images?: any;
  category?: string;
  location?: string;
}

interface ShareLink {
  id: string;
  listing_id: string;
  user_id: string;
  tracking_code: string;
  share_url: string;
  platform: string;
  custom_message?: string;
  content_generated: string;
  created_at: string;
  clicks: number;
  conversions: number;
  bacon_earned: number;
  status: string;
  last_clicked_at?: string;
  listings?: {
    item_title: string;
    asking_price: number;
    item_description: string;
    category: string;
    reward_percentage: number;
  };
}

interface ShareClick {
  id: string;
  share_link_id: string;
  clicked_at: string;
  ip_address: string;
  user_agent: string;
  referrer_url?: string;
  location?: string;
  converted: boolean;
  conversion_amount?: number;
}

interface ShareAnalytics {
  total_clicks: number;
  total_conversions: number;
  total_bacon_earned: number;
  conversion_rate: number;
  top_platforms: Array<{platform: string, clicks: number, conversions: number}>;
  recent_activity: Array<{timestamp: string, event: string, platform: string, amount?: number}>;
  daily_stats: Array<{date: string, clicks: number, conversions: number, earnings: number}>;
}

interface Referral { 
  listing_id: string; 
  degree: number; 
}

// Master Share Tools Component
const ShareToolsWorkspace = ({ listing, onClose, shareLinks, setShareLinks, userId }) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [customMessage, setCustomMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  // Platform definitions with enhanced metadata
  const platforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '📘', 
      color: 'bg-blue-600',
      reach: 'High reach, great for personal networks',
      optimal: 'Visual posts with detailed explanations'
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: '🐦', 
      color: 'bg-sky-500',
      reach: 'Viral potential, good for trends',
      optimal: 'Concise threads with powerful hooks'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼', 
      color: 'bg-blue-700',
      reach: 'Professional network, higher trust',
      optimal: 'Business value and networking angle'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸', 
      color: 'bg-pink-500',
      reach: 'Visual appeal, younger audience',
      optimal: 'Story-driven content with hashtags'
    },
    { 
      id: 'email', 
      name: 'Email', 
      icon: '📧', 
      color: 'bg-gray-600',
      reach: 'Personal touch, high conversion',
      optimal: 'Detailed explanations with context'
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: '💬', 
      color: 'bg-green-500',
      reach: 'Direct messaging, instant response',
      optimal: 'Conversational and friendly tone'
    }
  ];

  // Master content generation function
  const generateContent = (platform, listing) => {
    const baconReward = Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100);
    const userEarning = Math.floor(baconReward * 0.5); // 50% for first degree
    const secondDegreeEarning = Math.floor(baconReward * 0.25); // 25% for second degree

    const contentTemplates = {
      facebook: {
        content: `🔥 Found an Amazing ${listing.item_title}!

Just discovered this on University of Bacon - the platform where your network literally pays you! 🎓

Here's how it works:
✅ I share items with my network
✅ When someone buys → I earn real money ("bacon")
✅ They can share too → they earn money
✅ Everyone wins!

This ${listing.item_title}: ${listing.item_description}
💰 Price: $${listing.asking_price}
🥓 I could earn $${userEarning} just for sharing this!
📍 Location: ${listing.location || 'Local area'}

University of Bacon is revolutionizing social commerce. Instead of random ads, you get recommendations from trusted connections - and everyone gets paid for good networking!

The genius part: If you share this and someone from YOUR network buys it, you'd earn $${secondDegreeEarning}! It creates these amazing "bacon chains" where everyone benefits.

Anyone in my network interested? Even if you're not buying, you could share and earn bacon too! 

Think about it: How many times have you recommended something to a friend and they bought it? With University of Bacon, you'd actually get paid for being a good connector!

#UniversityOfBacon #SocialCommerce #EarnFromYourNetwork #${listing.category || 'Deal'}`,
        
        hashtags: ['#UniversityOfBacon', '#SocialCommerce', '#EarnFromYourNetwork', `#${listing.category || 'Deal'}`],
        cta: "Check it out and start earning from your network!"
      },
      
      twitter: {
        content: `🚨 Network Gold Alert! 

Found: ${listing.item_title} - $${listing.asking_price}

🎓 University of Bacon lets me earn $${userEarning} for connecting this with the right person!

How it works:
✅ Share with network
✅ Someone buys → get paid  
✅ They share → they get paid
✅ Everyone wins!

This is the future of social commerce 🔥

The platform pays you for what you already do - make good recommendations! 

Instead of influencers getting all the money, YOUR network becomes your income source.

Thread below on why this changes everything 👇

#UniversityOfBacon #SocialCommerce #NetworkingPays`,
        
        hashtags: ['#UniversityOfBacon', '#SocialCommerce', '#NetworkingPays', `#${listing.category || 'Deal'}`],
        thread: [
          `1/ Think about every time you've recommended a restaurant, product, or service to friends...`,
          `2/ How many of those recommendations led to purchases? Probably dozens or hundreds over the years.`,
          `3/ University of Bacon pays you for those recommendations. Finally.`,
          `4/ This ${listing.item_title} example: ${listing.item_description}`,
          `5/ If someone in my network wants it → I earn $${userEarning}`,
          `6/ If they share it to THEIR network and someone buys → they earn $${secondDegreeEarning}`,
          `7/ It creates "bacon chains" where everyone gets paid for good networking`,
          `8/ This could revolutionize how commerce works. Your network = your income. 🥓`
        ]
      },

      linkedin: {
        content: `Exploring University of Bacon - a fascinating platform monetizing professional networking.

The concept: Every transaction happens through referral chains. When you connect a buyer with a seller, you earn "bacon" (real money).

Case study: This ${listing.item_title} has a $${baconReward} reward pool. If I refer it to someone who purchases, I earn $${userEarning}.

What makes this brilliant:
→ Sellers get quality leads from trusted sources  
→ Buyers get recommendations from their network
→ Referrers earn real money for making connections
→ No spam or cold outreach needed

The network effect is powerful: If my connection refers it further, they earn $${secondDegreeEarning}. It incentivizes quality sharing over mass broadcasting.

Traditional e-commerce relies on paid advertising and influencer marketing. This model turns every user into a stakeholder, creating organic growth through aligned incentives.

Item details:
• ${listing.item_description}  
• Price: $${listing.asking_price}
• Location: ${listing.location || 'Multiple locations'}
• Category: ${listing.category || 'Various'}

This could fundamentally change professional networking. Instead of "coffee chats" with vague future value, every introduction has measurable, immediate potential.

Thoughts on this approach to social commerce?

#Innovation #SocialCommerce #Networking #FutureOfWork #EconomicInnovation`,
        
        hashtags: ['#Innovation', '#SocialCommerce', '#Networking', '#FutureOfWork'],
        cta: "What do you think of this networking model?"
      },

      instagram: {
        content: `🔥 Network Money Alert! 

Just found this gem on @UniversityOfBacon! 

${listing.item_title} - $${listing.asking_price} 💻

Here's the crazy part: I can earn $${userEarning} just for sharing this with someone who wants it! 🤯

University of Bacon is this new platform where your network literally pays you. Every time you connect someone with something they want to buy, you get bacon (real money!) 🥓💰

How it works:
📱 Someone lists what they're selling
🔗 You share with your network
💰 If someone buys → you earn money
🚀 If they share it too → they earn money

It's like turning your Instagram into a money-making machine, but way cooler because you're actually helping people find stuff they want!

Story highlight has all the details! 

The platform is brilliant - instead of random ads, you get recommendations from people you trust. And everyone gets paid for good networking!

Who in my network needs this? Even if you don't want it, you could share and earn bacon too! 

Swipe for screenshots of how much people are earning! 💸

Tag someone who would love this! ⬇️

#UniversityOfBacon #MacBook #SideHustle #NetworkingPays #TechDeals #BaconEarner #SocialCommerce #MoneyMaking #StudentLife #TechLife`,
        
        hashtags: ['#UniversityOfBacon', '#SideHustle', '#NetworkingPays', '#SocialCommerce', '#MoneyMaking'],
        cta: "Swipe up to start earning! 👆"
      },

      email: {
        subject: `Thought you'd love this ${listing.item_title} (+ how I'm earning money from networking)`,
        content: `Hey [Name],

Hope you're doing well! I came across this ${listing.item_title} and immediately thought of you.

But here's the really cool part - I found it on this new platform called University of Bacon that actually pays you for making good connections in your network.

Here's how it works:
🎓 People list items they want to sell
🔗 You share with people who might want them  
💰 When someone buys through your "referral chain," you earn real money (they call it "bacon")
🚀 The person you shared with can share it too and earn money themselves

This creates these amazing "bacon chains" where everyone benefits from good networking.

This ${listing.item_title} details:
• ${listing.item_description}
• Price: $${listing.asking_price}  
• Location: ${listing.location || 'Local area'}
• Total reward pool: $${baconReward}

If you're interested and purchase through my link, I'd earn $${userEarning}. But even if you're not buying, you could share it with someone else and potentially earning $${userEarning} yourself, and I would earn $${secondDegreeEarning} for sharing it with you, and so on up to 6 degrees, remember the 6 degrees of Kevin Bacon? That's exactly it!

The platform concept is brilliant because it solves a real problem: How many times have you recommended something to a friend and they bought it, but you got nothing for making that connection? University of Bacon fixes that.

Instead of companies spending millions on ads, they reward the people who actually drive sales - real humans making real recommendations to their networks.

Even if this specific item isn't for you, you should check out the platform. I think you'd love the concept of earning money just by making good connections in your network.

No pressure at all - I just thought the platform was revolutionary and this item reminded me of you!

Let me know what you think!

Best,
[Your name]

P.S. - I've already made $127 this month just by sharing a few items with friends. It's like having a part-time job that involves helping people find stuff they want!`
      },

      whatsapp: {
        content: `🔥 Hey! Found something perfect for you: ${listing.item_title}

💻 Details: ${listing.item_description}
💰 Price: $${listing.asking_price}
📍 ${listing.location || 'Local pickup available'}

But here's the crazy part - I found this on University of Bacon, a platform that pays you for networking! 🥓

How it works:
✅ I share this with you
✅ If you buy → I earn $${userEarning}
✅ If you share with someone else who buys → you earn $${secondDegreeEarning}!

It's like getting paid for being a good friend who makes helpful recommendations!

The platform is brilliant - instead of random ads everywhere, you get recommendations from people you trust. And everyone gets rewarded for making good connections.

Interested in the item or want to check out the platform? Either way, no pressure! 

Just thought you'd love the concept of earning money from your network 💸`
      }
    };

    return contentTemplates[platform] || contentTemplates.facebook;
  };

  // Visual preview components
  const FacebookPreview = () => (
    <div className="border rounded-lg bg-white p-4 max-w-md mx-auto shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          You
        </div>
        <div className="ml-3">
          <div className="font-semibold">Your Name</div>
          <div className="text-sm text-gray-500">Just now • 🌍</div>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="whitespace-pre-line text-sm">{customMessage || generateContent(selectedPlatform, listing).content}</p>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full h-32 bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold">{listing.item_title}</div>
            <div className="text-sm text-gray-600">${listing.asking_price}</div>
          </div>
        </div>
        <div className="p-3 bg-gray-50">
          <div className="font-semibold text-sm">{listing.item_title} - University of Bacon</div>
          <div className="text-xs text-gray-600 mt-1">Earn $${Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100 * 0.5)} by sharing this {listing.category || 'item'} with your network</div>
          <div className="text-xs text-blue-600">earnyourbacon.online</div>
        </div>
      </div>
      
      <div className="flex justify-between mt-3 text-sm text-gray-600">
        <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">👍 Like</button>
        <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">💬 Comment</button>
        <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">📤 Share</button>
      </div>
    </div>
  );

  const TwitterPreview = () => (
    <div className="border rounded-lg bg-white p-4 max-w-md mx-auto shadow-sm">
      <div className="flex space-x-3">
        <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
          You
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold">Your Name</span>
            <span className="text-gray-500">@yourhandle</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">now</span>
          </div>
          <div className="mt-2">
            <p className="whitespace-pre-line">{customMessage || generateContent(selectedPlatform, listing).content}</p>
          </div>
          <div className="mt-3 border rounded-lg overflow-hidden">
            <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-semibold">{listing.item_title}</div>
                <div className="text-sm text-gray-600">${listing.asking_price}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="text-sm font-semibold">{listing.item_title}</div>
              <div className="text-xs text-gray-600">University of Bacon - Where networking pays</div>
            </div>
          </div>
          <div className="flex justify-between mt-3 max-w-md text-gray-500">
            <button>💬</button>
            <button>🔄</button>
            <button>❤️</button>
            <button>📤</button>
          </div>
        </div>
      </div>
    </div>
  );

  const LinkedInPreview = () => (
    <div className="border rounded-lg bg-white p-4 max-w-lg mx-auto shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">
          You
        </div>
        <div className="ml-3">
          <div className="font-semibold">Your Professional Name</div>
          <div className="text-sm text-gray-600">Your Title at Company</div>
          <div className="text-xs text-gray-500">Just now</div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="whitespace-pre-line text-sm leading-relaxed">{customMessage || generateContent(selectedPlatform, listing).content}</p>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full h-32 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold">{listing.item_title}</div>
            <div className="text-sm text-gray-600">${listing.asking_price}</div>
          </div>
        </div>
        <div className="p-4">
          <div className="font-semibold">{listing.item_title} - University of Bacon</div>
          <div className="text-sm text-gray-600 mt-1">Revolutionary social commerce platform where networking generates real income</div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>📤 Share</button>
      </div>
    </div>
  );

  const EmailPreview = () => (
    <div className="border rounded-lg bg-white p-6 max-w-2xl mx-auto shadow-sm">
      <div className="border-b pb-4 mb-4">
        <div className="text-sm text-gray-600 mb-2">
          <strong>From:</strong> your.email@gmail.com<br/>
          <strong>To:</strong> friend@email.com<br/>
          <strong>Subject:</strong> {generateContent(selectedPlatform, listing).subject}
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-line">{customMessage || generateContent(selectedPlatform, listing).content}</div>
      </div>
      
      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-200 to-yellow-200 rounded flex items-center justify-center">
            <span className="text-2xl">🎓</span>
          </div>
          <div>
            <h4 className="font-semibold text-orange-900">{listing.item_title}</h4>
            <p className="text-sm text-orange-700">Price: ${listing.asking_price}</p>
            <p className="text-sm text-orange-700">Your potential earnings: ${Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100 * 0.5)}</p>
            <button className="mt-2 bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
              View on University of Bacon
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (selectedPlatform) {
      case 'facebook': return <FacebookPreview />;
      case 'twitter': return <TwitterPreview />;
      case 'linkedin': return <LinkedInPreview />;
      case 'email': return <EmailPreview />;
      default: return <FacebookPreview />;
    }
  };

  // Create share link with backend API
  const createShareLink = async () => {
    setIsCreatingLink(true);
    try {
      const trackingCode = generateTrackingCode();
      const contentGenerated = customMessage || generateContent(selectedPlatform, listing).content;
      const newShareUrl = `${window.location.origin}/course/${listing.id}?ref=${trackingCode}`;

      const { data, error } = await supabase
        .from('share_links')
        .insert({
          listing_id: listing.id,
          user_id: userId,
          platform: selectedPlatform,
          custom_message: customMessage,
          content_generated: contentGenerated,
          tracking_code: trackingCode,
          share_url: newShareUrl,
          status: 'active',
          clicks: 0,
          conversions: 0,
          bacon_earned: 0
        })
        .select()
        .single();

      if (error) throw error;

      setShareUrl(newShareUrl);
      setShareLinks(prev => [...prev, data]);
      
      toast({
        title: "Share Link Created! 🚀",
        description: `Your ${selectedPlatform} share link is ready. Start earning bacon!`
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsCreatingLink(false);
    }
  };

  const generateTrackingCode = () => {
    return `UOB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ 
      title: "Copied! 📋", 
      description: "Content copied to clipboard - ready to share!" 
    });
  };

  const platformContent = generateContent(selectedPlatform, listing);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span>Share Tools & Content Creator</span>
          </h2>
          <p className="text-gray-600">Create masterpiece content for {listing.item_title}</p>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{listing.item_title}</h3>
              <p className="text-sm text-gray-600">{listing.item_description}</p>
              <div className="flex space-x-2 mt-2">
                <Badge>${listing.asking_price}</Badge>
                <Badge variant="secondary">🥓 ${Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100)} reward</Badge>
                <Badge variant="outline">You earn: ${Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100 * 0.5)}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{platform.icon}</div>
                    <div className="text-xs font-medium">{platform.name}</div>
                    <div className="text-xs text-gray-500">{platform.reach}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded text-sm max-h-64 overflow-y-auto">
                <div className="whitespace-pre-line">{platformContent.content}</div>
              </div>
              
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add your personal touch..."
                className="min-h-[80px]"
              />

              <div className="flex space-x-2">
                <Button 
                  onClick={() => copyToClipboard(customMessage || platformContent.content)}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Content
                </Button>
                <Button 
                  onClick={createShareLink}
                  disabled={isCreatingLink}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  {isCreatingLink ? 'Creating...' : 'Create Share Link'}
                </Button>
              </div>

              {shareUrl && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="text-sm font-medium mb-1 text-green-800">Your Tracking URL:</div>
                  <div className="text-xs break-all bg-white p-2 rounded border font-mono">{shareUrl}</div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => copyToClipboard(shareUrl)}
                    className="mt-2"
                  >
                    Copy Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">150-300</div>
                  <div className="text-xs text-blue-700">Expected Reach</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-green-600">8-15</div>
                  <div className="text-xs text-green-700">Predicted Clicks</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">12%</div>
                  <div className="text-xs text-orange-700">Conversion Rate</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">${Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100 * 0.5 * 0.12)}</div>
                  <div className="text-xs text-purple-700">Expected Earnings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Live Preview - {platforms.find(p => p.id === selectedPlatform)?.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                {renderPreview()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Share Links Dashboard Component
const ShareLinksSection = ({ userId }) => {
  const { toast } = useToast();
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [analytics, setAnalytics] = useState<ShareAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadShareLinks();
    loadAnalytics();
  }, [userId]);

  const loadShareLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('share_links')
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShareLinks(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Calculate analytics from share_links and share_clicks
      const { data: links, error: linksError } = await supabase
        .from('share_links')
        .select('*')
        .eq('user_id', userId);

      if (linksError) throw linksError;

      const totalClicks = links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
      const totalConversions = links?.reduce((sum, link) => sum + (link.conversions || 0), 0) || 0;
      const totalBaconEarned = links?.reduce((sum, link) => sum + (link.bacon_earned || 0), 0) || 0;
      const conversionRate = totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 100) : 0;

      // Platform breakdown
      const platformStats = links?.reduce((acc: Record<string, {platform: string, clicks: number, conversions: number}>, link) => {
        const platform = link.platform;
        if (!acc[platform]) acc[platform] = { platform, clicks: 0, conversions: 0 };
        acc[platform].clicks += link.clicks || 0;
        acc[platform].conversions += link.conversions || 0;
        return acc;
      }, {});

      const topPlatforms = Object.values(platformStats || {}).sort((a, b) => b.clicks - a.clicks);

      setAnalytics({
        total_clicks: totalClicks,
        total_conversions: totalConversions,
        total_bacon_earned: totalBaconEarned,
        conversion_rate: conversionRate,
        top_platforms: topPlatforms,
        recent_activity: [], // You'd implement this with a recent activity query
        daily_stats: [] // You'd implement this with daily aggregation
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const trackClick = async (shareLink) => {
    try {
      // Insert click record
      await supabase
        .from('share_clicks')
        .insert({
          share_link_id: shareLink.id,
          clicked_at: new Date().toISOString(),
          ip_address: '127.0.0.1', // You'd get real IP from request headers
          user_agent: navigator.userAgent,
          referrer_url: window.location.href,
          converted: false
        });

      // Update click count
      await supabase
        .from('share_links')
        .update({ 
          clicks: shareLink.clicks + 1,
          last_clicked_at: new Date().toISOString()
        })
        .eq('id', shareLink.id);

      // Refresh data
      loadShareLinks();
      loadAnalytics();

      toast({
        title: "Click Tracked! 📊",
        description: "Opening your share link..."
      });
    } catch (error) {
      console.error('Click tracking error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading share links...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 mr-2" />
                {analytics.total_clicks}
              </div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                {analytics.total_conversions}
              </div>
              <div className="text-sm text-gray-600">Conversions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                <Banknote className="w-6 h-6 mr-2" />
                ${analytics.total_bacon_earned}
              </div>
              <div className="text-sm text-gray-600">Bacon Earned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                {analytics.conversion_rate}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Platforms */}
      {analytics?.top_platforms && analytics.top_platforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.top_platforms.slice(0, 5).map((platform, index) => (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{platform.platform}</div>
                      <div className="text-sm text-gray-500">
                        {platform.clicks} clicks, {platform.conversions} conversions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{platform.clicks > 0 ? Math.round((platform.conversions / platform.clicks) * 100) : 0}%</div>
                    <div className="text-sm text-gray-500">conversion rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Links List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link2 className="w-5 h-5" />
            <span>My Share Links</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shareLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Link2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">No share links yet</p>
              <p className="text-sm">Create share links from your listings to start earning bacon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shareLinks.map((shareLink) => (
                <div key={shareLink.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{shareLink.listings?.item_title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{shareLink.listings?.item_description}</p>
                      <div className="flex space-x-2 mb-3">
                        <Badge variant="outline" className="capitalize">{shareLink.platform}</Badge>
                        <Badge variant="outline">{shareLink.clicks} clicks</Badge>
                        <Badge variant="outline">{shareLink.conversions} conversions</Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">${shareLink.bacon_earned} earned</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink.share_url);
                          toast({ title: "Link copied! 📋" });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          window.open(shareLink.share_url, '_blank');
                          trackClick(shareLink);
                        }}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-gray-50 p-2 rounded text-xs break-all font-mono">
                    {shareLink.share_url}
                  </div>

                  {shareLink.last_clicked_at && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last clicked: {new Date(shareLink.last_clicked_at).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Listings Section with Share Tools Integration
const EnhancedListingsSection = ({ userId, listings, setListings, statsByListing, loading }) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [shareLinks, setShareLinks] = useState([]);

  const openShareTools = (listing) => {
    setSelectedListing(listing);
  };

  if (selectedListing) {
    return (
      <ShareToolsWorkspace 
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        shareLinks={shareLinks}
        setShareLinks={setShareLinks}
        userId={userId}
      />
    );
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No listings yet</p>
          <Button>Create Your First Listing</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{listing.item_title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{listing.item_description}</p>
                    <div className="flex space-x-2">
                      <Badge>${listing.asking_price}</Badge>
                      <Badge variant="secondary" className={
                        listing.status === 'active' ? 'bg-green-100 text-green-800' : 
                        listing.status === 'sold' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }>
                        {listing.status}
                      </Badge>
                      <Badge variant="outline">
                        {statsByListing[listing.id]?.count || 0} referrals
                      </Badge>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        🥓 ${Math.floor((listing.asking_price || 0) * (listing.reward_percentage || 20) / 100)} reward
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      onClick={() => openShareTools(listing)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share & Earn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Account Component (Enhanced)
const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Redirect to auth page if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  const [listings, setListings] = useState<Listing[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    document.title = "Account Dashboard | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Manage listings, track shares, and earn bacon through your network.");
  }, []);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserId(session?.user?.id ?? null);
    }).data.subscription;
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    return () => { sub?.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      const { data: userListings, error: lErr } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (lErr) { 
        setLoading(false); 
        toast({ title: "Error", description: lErr.message, variant: "destructive" }); 
        return; 
      }
      setListings(userListings || []);

      const ids = (userListings || []).map(l => l.id);
      if (ids.length) {
        const { data: refData, error: rErr } = await supabase
          .from("referrals")
          .select("listing_id, degree")
          .in("listing_id", ids);
        if (!rErr) setReferrals(refData || []);
      }
      setLoading(false);
    };
    load();
  }, [userId, toast]);

  const statsByListing = useMemo(() => {
    const map: Record<string, { count: number; avgDegree: number }> = {};
    for (const r of referrals) {
      const cur = map[r.listing_id] || { count: 0, sum: 0, avgDegree: 0 } as any;
      cur.count += 1; 
      cur.sum = (cur.sum || 0) + (r.degree || 0);
      cur.avgDegree = cur.sum / cur.count;
      map[r.listing_id] = cur;
    }
    return map;
  }, [referrals]);

  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeChains: 0,
    conversionRate: 0,
    avgDegree: 0,
    shareLinksCount: 0,
    potentialEarnings: 0
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        // Fetch real bacon balance from bacon_transactions
        const { data: transactionData } = await supabase
          .from('bacon_transactions')
          .select('running_balance')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (transactionData && transactionData.length > 0) {
          setBalance(transactionData[0].running_balance || 0);
        } else {
          setBalance(0); // No transactions = $0 balance
        }

        // Fetch real referral stats and share links
        const { data: referralData } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id);

        // Fetch share links count
        const { data: shareLinksData } = await supabase
          .from('share_links')
          .select('id')
          .eq('user_id', user.id);

        // Calculate potential earnings from active referrals
        let potentialEarnings = 0;
        if (referralData) {
          // Get listings with reward percentages for referrals
          const listingIds = [...new Set(referralData.map(r => r.listing_id))];
          const { data: listingsWithRewards } = await supabase
            .from('listings')
            .select('id, asking_price, reward_percentage')
            .in('id', listingIds);

          if (listingsWithRewards) {
            // Calculate earnings based on degree percentages from share-tracking function
            const degreePercentages: { [key: number]: number } = {
              1: 50,  // 50% for 1st degree
              2: 25,  // 25% for 2nd degree  
              3: 10,  // 10% for 3rd degree
              4: 7.5, // 7.5% for 4th degree
              5: 5,   // 5% for 5th degree
              6: 2.5  // 2.5% for 6th degree
            };

            referralData.forEach(referral => {
              const listing = listingsWithRewards.find(l => l.id === referral.listing_id);
              if (listing && listing.asking_price && listing.reward_percentage) {
                const totalReward = listing.asking_price * (listing.reward_percentage / 100);
                const degreePercentage = degreePercentages[referral.degree] || 0;
                const userEarning = totalReward * (degreePercentage / 100);
                potentialEarnings += userEarning;
              }
            });
          }
        }

        if (referralData) {
          const avgDegree = referralData.length > 0 ? referralData.reduce((sum, r) => sum + (r.degree || 0), 0) / referralData.length : 0;

          setStats({
            totalReferrals: referralData.length,
            activeChains: 0, // Will be used in header now
            conversionRate: 0, // Can be calculated when we have conversion data
            avgDegree: Math.round(avgDegree * 10) / 10, // Round to 1 decimal
            shareLinksCount: shareLinksData?.length || 0,
            potentialEarnings: Math.round(potentialEarnings * 100) / 100 // Round to 2 decimals
          });
        }
      }
    };
    
    fetchUserAndData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardHeader 
              userName={user?.email?.split('@')[0] || "Student"}
              userLevel="Freshman"
              stats={{
                totalEarnings: balance,
                activeListings: listings.length,
                referralChains: stats.activeChains, // Active chains for header
                recentActivity: stats.totalReferrals // Recent activity
              }}
            />
            
            {/* Comprehensive Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>Your earnings, listings, and referral performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
                  <div className="text-center p-3 sm:p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl mb-2">🥓</div>
                    <div className="text-lg sm:text-2xl font-bold">${balance.toFixed(2)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Bacon Balance</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl mb-2">📝</div>
                    <div className="text-lg sm:text-2xl font-bold">{listings.length}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Active Listings</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl mb-2">🔗</div>
                    <div className="text-lg sm:text-2xl font-bold">{stats.totalReferrals}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Referrals</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl mb-2">🔗</div>
                    <div className="text-lg sm:text-2xl font-bold">{stats.shareLinksCount}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Share Links</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl mb-2">📈</div>
                    <div className="text-lg sm:text-2xl font-bold">{stats.conversionRate}%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Conversion Rate</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 border rounded-lg">
                    <div className="text-xl sm:text-2xl mb-2">🎯</div>
                    <div className="text-lg sm:text-2xl font-bold">{stats.avgDegree.toFixed(1)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Avg Degree</div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* My Listings Section */}
            <ListingsSection
              userId={user?.id || null}
              listings={listings}
              setListings={setListings}
              statsByListing={statsByListing}
              loading={loading}
            />

            {/* Referral Dashboard Section */}
            <ReferralDashboard />
          </div>
        );
      case "bacon-bank":
        return <BaconBank />;
      case "payment-methods":
        return <PaymentMethods />;
      case "payment-history":
        return <PaymentHistorySection />;
      case "security":
        return <SecurityDashboard />;
      case "messages":
        return <MessageCenter userId={user?.id} />;
      case "verification":
        return <VerificationSection />;
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen w-full">
          <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b bg-background px-2 sm:px-4">
              <SidebarTrigger />
              <div className="flex flex-1 items-center justify-between ml-2 sm:ml-4">
                <h1 className="font-display text-base sm:text-lg text-[hsl(var(--brand-academic))] truncate">
                  Account Dashboard
                </h1>
                <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
                  <a href="/listings" className="text-muted-foreground hover:text-foreground">Browse</a>
                  <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
                </nav>
              </div>
            </header>

            <main className="flex-1">
              <section className="bg-[hsl(var(--brand-academic))] text-background py-4 sm:py-8 md:py-12">
                <div className="container px-4 sm:px-6">
                  <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-accent">
                    {getTabTitle(activeTab)}
                  </h1>
                  <p className="mt-2 opacity-90 italic text-sm sm:text-base">
                    {getTabDescription(activeTab)}
                  </p>
                </div>
              </section>

              <section className="container px-4 sm:px-6 py-4 sm:py-8">
                {renderContent()}
              </section>
            </main>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden min-h-screen w-full">
          <header className="bg-background border-b p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-lg text-[hsl(var(--brand-academic))]">
                Account Dashboard
              </h1>
              <nav className="flex items-center space-x-4 text-sm">
                <a href="/listings" className="text-muted-foreground hover:text-foreground">Browse</a>
                <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
              </nav>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex space-x-2 min-w-max pb-2">
                {[
                  { id: "dashboard", label: "Dashboard", icon: "📊" },
                  { id: "bacon-bank", label: "Bacon Bank", icon: "🏦" },
                  { id: "payment-methods", label: "Payment", icon: "💳" },
                  { id: "payment-history", label: "History", icon: "📋" },
                  { id: "verification", label: "Verify", icon: "✅" },
                  { id: "messages", label: "Messages", icon: "💬" },
                  { id: "security", label: "Security", icon: "🔒" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
                      activeTab === tab.id
                        ? 'bg-[hsl(var(--brand-academic))] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1">
            <section className="bg-[hsl(var(--brand-academic))] text-background py-6">
              <div className="px-4">
                <h1 className="font-display text-xl text-accent">
                  {getTabTitle(activeTab)}
                </h1>
                <p className="mt-2 opacity-90 italic text-sm">
                  {getTabDescription(activeTab)}
                </p>
              </div>
            </section>

            <section className="px-4 py-4">
              {renderContent()}
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const getTabTitle = (tab: string) => {
  const titles: Record<string, string> = {
    dashboard: "Dashboard Overview",
    "bacon-bank": "Bacon Bank",
    "referral-dashboard": "Referral Dashboard", 
    "share-links": "Share Links & Analytics",
    "payment-methods": "Payment Methods",
    "payment-history": "Payment History",
    security: "Security & Privacy",
    verification: "Account Verification",
    listings: "My Listings",
    messages: "Message Center"
  };
  return titles[tab] || "Account Dashboard";
};

const getTabDescription = (tab: string) => {
  const descriptions: Record<string, string> = {
    dashboard: "Your academic ledger of sizzling sales.",
    "bacon-bank": "Manage your bacon earnings and withdrawals.",
    "referral-dashboard": "Track chains and share links for maximum bacon.",
    "share-links": "Create masterpiece shareable content and track performance.",
    "payment-methods": "Configure your payout preferences.",
    "payment-history": "View your bacon earning history.",
    security: "Secure your account and manage privacy.",
    verification: "Increase trust levels for better opportunities.",
    listings: "Manage your active and past listings.",
    messages: "Secure communication with verified users and platform support."
  };
  return descriptions[tab] || "Manage your University of Bacon account.";
};

export default Account;