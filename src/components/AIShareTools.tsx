import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Copy, 
  Share2, 
  TrendingUp,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Zap,
  Target,
  Sparkles,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareContent {
  id: string;
  platform: string;
  content: string;
  tone: string;
  hashtags?: string[];
  estimatedReach: number;
  conversionRate: number;
  potentialEarnings: string;
}

const AIShareTools = ({ listingData = null }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState("witty");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [generatedContent, setGeneratedContent] = useState<ShareContent[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");

  // Mock listing data if none provided
  const listing = listingData || {
    title: "2023 MacBook Pro M2 - Perfect for Students & Creators",
    price: "$1,899",
    description: "Barely used MacBook Pro with all original accessories",
    category: "Electronics",
    seller: "Anonymous Verified Student",
    potentialEarnings: "$95-$380"
  };

  const tones = [
    { id: "witty", name: "🎭 Witty & Fun", description: "Humor that gets shares" },
    { id: "urgent", name: "⚡ Urgent & Scarce", description: "FOMO-driven content" },
    { id: "professional", name: "💼 Professional", description: "LinkedIn-ready posts" },
    { id: "casual", name: "😊 Casual Friend", description: "Personal recommendations" },
    { id: "educational", name: "📚 Educational", description: "Value-first approach" },
    { id: "emotional", name: "❤️ Emotional Story", description: "Heart-tugging narratives" }
  ];

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
    { id: "twitter", name: "Twitter/X", icon: Twitter, color: "bg-black" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "bg-green-500" },
    { id: "general", name: "Universal", icon: Share2, color: "bg-purple-600" }
  ];

  // AI Content Templates (simulating AI generation)
  const contentTemplates = {
    facebook: {
      witty: [
        `🚨 BREAKING: Someone's about to get a STEAL on this ${listing.title}! 💻✨\n\nMy friend is selling their ${listing.title} for just ${listing.price} (and honestly, I'm a little jealous I don't need one right now 😅).\n\n✅ Perfect condition\n✅ All accessories included  \n✅ Priced to sell FAST\n\nTag someone who needs this before it's gone! Or better yet, share this post and earn some cash yourself 😉\n\n#MacBookDeal #TechSteals #StudentLife`,
        `POV: You just found the laptop deal of the century 🎯\n\nSeriously though, this ${listing.title} for ${listing.price}? In this economy? 📈💰\n\nMy network is full of smart people, so I KNOW someone needs this. Share it around and let's make some money while helping each other out! 🤝\n\nWho says you can't do good AND get paid? 💸\n\n#TechDeals #SmartShopping #CommunityFirst`
      ],
      urgent: [
        `🚨 URGENT: ${listing.title} - PRICED TO SELL TODAY! 🚨\n\n⏰ SERIOUS INQUIRIES ONLY\n💰 ${listing.price} - NO NEGOTIATIONS\n🔥 FIRST COME, FIRST SERVED\n\nThis won't last 24 hours at this price. I'm posting this once, and it's gone when it's gone.\n\nShare NOW or watch someone else get the deal of a lifetime.\n\n#UrgentSale #LastChance #NoRegrets`,
        `⚠️ FINAL 48 HOURS ⚠️\n\n${listing.title} must sell by weekend!\n\nOwner is moving cross-country and can't take it. Their loss = YOUR GAIN.\n\n${listing.price} FIRM\n\nDon't be the person scrolling through this next week wishing you acted. Share this post RIGHT NOW.\n\n#MovingSale #FinalHours #ActFast`
      ],
      professional: [
        `Professional Network Opportunity 📧\n\nI'm sharing a high-quality ${listing.title} available through our verified marketplace.\n\nKey Details:\n• Item: ${listing.title}\n• Price: ${listing.price}\n• Condition: Excellent\n• Seller: Verified & Anonymous\n• Referral Rewards: Active\n\nThis represents an excellent value proposition for anyone in need of premium technology. Please share with your network if relevant.\n\n#ProfessionalNetwork #QualityDeals #VerifiedSellers`
      ],
      casual: [
        `Hey friends! 👋\n\nRemember how I'm always talking about that cool marketplace where you can earn money for sharing stuff? Well, here's a perfect example!\n\nMy friend's selling their ${listing.title} for ${listing.price}, and if I help them find a buyer, I actually get rewarded for it. It's like being a good friend... but profitable! 😄\n\nAnyone interested or know someone who might be? Let's make some money together! 💪\n\n#FriendlyDeals #EarnTogether #GoodVibes`
      ]
    }
    // Similar templates for other platforms...
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedTemplates = contentTemplates[selectedPlatform]?.[selectedTone] || contentTemplates.facebook.witty;
    const template = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
    
    const newContent: ShareContent = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      content: customPrompt ? `${template}\n\n${customPrompt}` : template,
      tone: selectedTone,
      hashtags: generateHashtags(selectedPlatform, selectedTone),
      estimatedReach: Math.floor(Math.random() * 500) + 100,
      conversionRate: Math.random() * 5 + 1,
      potentialEarnings: `$${Math.floor(Math.random() * 200) + 50}-$${Math.floor(Math.random() * 500) + 200}`
    };
    
    setGeneratedContent(prev => [newContent, ...prev]);
    setIsGenerating(false);
    
    toast({
      title: "🎯 AI Content Generated!",
      description: "Your viral-ready content is optimized for maximum engagement!"
    });
  };

  const generateHashtags = (platform: string, tone: string) => {
    const baseHashtags = ["#UniversityOfBacon", "#EarnMoney", "#ShareToEarn"];
    const toneHashtags = {
      witty: ["#Funny", "#Relatable", "#Mood"],
      urgent: ["#LimitedTime", "#ActNow", "#LastChance"],
      professional: ["#Business", "#Quality", "#Professional"],
      casual: ["#Friends", "#Community", "#Helpful"]
    };
    
    return [...baseHashtags, ...(toneHashtags[tone] || [])];
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "📋 Copied!",
      description: "Content copied to clipboard. Ready to share!"
    });
  };

  const shareContent = (content: ShareContent) => {
    // Simulate sharing
    toast({
      title: "🚀 Shared Successfully!",
      description: `Posted to ${content.platform}. Tracking engagement now!`
    });
  };

  return (
    <div className="space-y-6">
      {/* AI GENERATOR HEADER */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-purple-800">🤖 AI VIRAL CONTENT GENERATOR</span>
              <Badge className="ml-2 bg-purple-600">Beta</Badge>
            </div>
          </CardTitle>
          <p className="text-purple-700 text-sm">
            Generate platform-specific content optimized for maximum engagement and earning potential!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROL PANEL */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* PLATFORM SELECTOR */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  🎯 Target Platform
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <platform.icon className="h-4 w-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* TONE SELECTOR */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  🎭 Content Tone
                </label>
                <div className="space-y-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedTone === tone.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{tone.name}</div>
                      <div className="text-xs text-gray-600">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM PROMPT */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  ✨ Custom Instructions (Optional)
                </label>
                <Textarea
                  placeholder="Add specific instructions for the AI..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              {/* GENERATE BUTTON */}
              <Button
                onClick={generateAIContent}
                disabled={isGenerating}
                className="w-full"
                size="lg"
                variant="hero"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Viral Content!
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* LISTING PREVIEW */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">📦 Current Listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Title:</strong> {listing.title}
              </div>
              <div className="text-sm">
                <strong>Price:</strong> {listing.price}
              </div>
              <div className="text-sm">
                <strong>Your Potential:</strong> <span className="text-green-600 font-semibold">{listing.potentialEarnings}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GENERATED CONTENT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Generated Content</h3>
            {generatedContent.length > 0 && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {generatedContent.length} Generated
              </Badge>
            )}
          </div>

          {generatedContent.length === 0 ? (
            <Card className="border-dashed border-gray-300">
              <CardContent className="text-center py-12">
                <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No content generated yet</p>
                <p className="text-sm text-gray-500">
                  Select your platform and tone, then click "Generate Viral Content!"
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {generatedContent.map((content) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {platforms.find(p => p.id === content.platform)?.icon && (
                              <div className={`p-2 rounded-lg ${platforms.find(p => p.id === content.platform)?.color}`}>
                                {/* Platform icon would go here */}
                                <Share2 className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-800 capitalize">
                                {content.platform} • {content.tone}
                              </div>
                              <div className="text-xs text-gray-600">
                                Est. Reach: {content.estimatedReach} • Potential: {content.potentialEarnings}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-600">
                            {(content.conversionRate).toFixed(1)}% CVR
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white rounded-lg p-4 mb-4 border">
                          <p className="whitespace-pre-wrap text-sm">
                            {content.content}
                          </p>
                          {content.hashtags && content.hashtags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {content.hashtags.map((hashtag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {hashtag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyContent(content.content)}
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="money"
                            size="sm"
                            onClick={() => shareContent(content)}
                            className="flex-1"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share & Earn!
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* PERFORMANCE ANALYTICS */}
      {generatedContent.length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              🎯 AI Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(generatedContent.reduce((acc, c) => acc + c.estimatedReach, 0) / generatedContent.length)}
                </div>
                <div className="text-sm text-gray-600">Avg. Estimated Reach</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {(generatedContent.reduce((acc, c) => acc + c.conversionRate, 0) / generatedContent.length).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Conversion Rate</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {generatedContent.length}
                </div>
                <div className="text-sm text-gray-600">Content Variants</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  ${Math.floor(Math.random() * 500) + 200}
                </div>
                <div className="text-sm text-gray-600">Total Earning Potential</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIShareTools;