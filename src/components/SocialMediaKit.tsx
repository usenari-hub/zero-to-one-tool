import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useViralSharing } from '@/hooks/useViralSharing';
import { Copy, Download, Facebook, Twitter, Linkedin, MessageCircle, Share2, Sparkles, Image } from 'lucide-react';

// Import the premium graphics
import wittyGraphic from '@/assets/social-graphics/witty-social-base.jpg';
import professionalGraphic from '@/assets/social-graphics/professional-social-base.jpg';
import urgentGraphic from '@/assets/social-graphics/urgent-social-base.jpg';
import educationalGraphic from '@/assets/social-graphics/educational-social-base.jpg';

interface SocialMediaKitProps {
  selectedListing?: any;
  onClose: () => void;
}

const socialPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    template: "🎓 EXCLUSIVE: Found something amazing at University of Bacon!\n\nI just discovered [ITEM] and thought my network might be interested. The best part? If someone buys through my referral, I earn $[AMOUNT] in bacon! 🥓\n\nThis platform actually pays you for good networking. Who knew your connections could be this valuable?\n\n#UniversityOfBacon #EarnYourBacon #SocialCommerce"
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    color: 'bg-black',
    template: "🎓 Found a gem at University of Bacon: [ITEM]\n\n💰 Earn $[AMOUNT] through smart referrals\n🔗 Where your network = net worth\n\nFinally, a platform that pays you for knowing people!\n\n#UniversityOfBacon #EarnYourBacon #Networking"
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    template: "Professional Networking with Real ROI 📈\n\nI'm exploring University of Bacon - a platform that monetizes professional connections. Found this [ITEM] listing, and if I connect it with the right buyer, I earn $[AMOUNT].\n\nIt's fascinating how they've gamified networking with actual financial incentives. The academic theme adds a clever twist to social commerce.\n\nAnyone in my network interested in [ITEM_CATEGORY]? Let's discuss!\n\n#ProfessionalNetworking #SocialCommerce #Innovation"
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-600',
    template: "Hey! 👋\n\nJust found this [ITEM] on University of Bacon and immediately thought of you!\n\nIt's this clever platform where you actually earn money ($[AMOUNT] in this case) by making good connections. No MLM nonsense - just rewarding smart networking.\n\nThought you might be interested! Let me know if you want to check it out.\n\n[SHARE_LINK]"
  }
];

const contentTemplates = [
  {
    id: 'witty',
    name: 'Witty & Fun',
    description: 'Playful, bacon-themed humor',
    mood: '😄',
    graphic: wittyGraphic,
    template: "🎓 BREAKING: Found something AMAZING at University of Bacon!\n\n🥓 Just discovered [ITEM] and thought my network might want in on this. The twist? I actually earn $[AMOUNT] in real bacon if someone buys through my referral!\n\nFinally, a platform that pays you for knowing cool people! Who knew networking could be this tasty? 😂\n\n#UniversityOfBacon #EarnYourBacon #SocialCommerce #NetworkingThatPays"
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Business-focused, LinkedIn-ready',
    mood: '💼',
    graphic: professionalGraphic,
    template: "Professional Networking with Measurable ROI 📈\n\nI'm exploring University of Bacon - an innovative platform that monetizes professional connections. I've identified this opportunity: [ITEM]\n\nThe model is fascinating: earn $[AMOUNT] by successfully connecting quality buyers with relevant listings. It gamifies networking while providing tangible financial incentives.\n\nAnyone in my network interested in [ITEM_CATEGORY]? Let's discuss how we can create mutual value.\n\n#ProfessionalNetworking #SocialCommerce #Innovation #MutualValue"
  },
  {
    id: 'urgent',
    name: 'Limited Time',
    description: 'Creates urgency and FOMO',
    mood: '⏰',
    graphic: urgentGraphic,
    template: "⚡ URGENT OPPORTUNITY: University of Bacon Deal! ⚡\n\n🔥 [ITEM] just hit the marketplace\n💰 $[AMOUNT] referral bonus - FIRST COME BASIS\n⏰ Limited availability - serious inquiries only\n\nThis platform is exploding right now. Early adopters are seeing incredible returns on their network connections.\n\nDM me if interested - moving FAST! 🚀\n\n#LimitedTime #UniversityOfBacon #OpportunityKnocks #ActNow"
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Explains the platform benefits',
    mood: '🎓',
    graphic: educationalGraphic,
    template: "🎓 Educational Moment: The Future of Social Commerce\n\nI want to share something fascinating I discovered - University of Bacon. It's revolutionizing how we think about networking and referrals.\n\nHow it works:\n✓ Quality listings like this [ITEM]\n✓ Smart referral tracking technology\n✓ Real financial rewards ($[AMOUNT] in this case)\n✓ Academic-themed community building\n\nIt's not just about the money - it's about rewarding good connections and building valuable networks.\n\n#Learn #Connect #Earn #FutureOfCommerce"
  }
];

export const SocialMediaKit: React.FC<SocialMediaKitProps> = ({ selectedListing, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('facebook');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('witty');
  const [customMessage, setCustomMessage] = useState<string>('');
  const { toast } = useToast();
  const { createShareLink, getShareContent } = useViralSharing();

  const currentPlatform = socialPlatforms.find(p => p.id === selectedPlatform);
  const currentTemplate = contentTemplates.find(t => t.id === selectedTemplate);

  const generateContent = () => {
    if (!selectedListing) return '';
    
    const baconAmount = Math.round((selectedListing.asking_price || 100) * (selectedListing.reward_percentage || 20) / 100);
    
    // Use template-specific content first, then platform template
    const template = currentTemplate?.template || currentPlatform?.template || '';
    
    let content = template
      .replace(/\[ITEM\]/g, selectedListing.item_title || 'Amazing Course Material')
      .replace(/\[AMOUNT\]/g, String(baconAmount))
      .replace(/\[ITEM_CATEGORY\]/g, selectedListing.department || selectedListing.item_description?.split(' ')[0] || 'academic materials');
    
    // Add custom message if provided
    if (customMessage.trim()) {
      content = `${customMessage.trim()}\n\n${content}`;
    }
    
    return content;
  };

  const handleShare = async (platform: string) => {
    if (!selectedListing) {
      toast({ title: "No Listing Selected", description: "Please select a listing to share." });
      return;
    }

    console.log('SocialMediaKit: Starting share process for platform:', platform);
    console.log('SocialMediaKit: Selected listing:', selectedListing);

    try {
      console.log('SocialMediaKit: Creating share link...');
      const shareLink = await createShareLink(selectedListing.id, platform, customMessage);
      console.log('SocialMediaKit: Share link created successfully:', shareLink);
      
      const content = generateContent();
      
      // Generate platform-specific share URL
      let shareUrl = '';
      const encodedContent = encodeURIComponent(content);
      const encodedUrl = encodeURIComponent(shareLink.share_url);
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedContent}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedContent}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedContent}%20${encodedUrl}`;
          break;
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        toast({ 
          title: "Share Link Created! 🥓", 
          description: `Your ${platform} post is ready with tracking enabled.` 
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({ 
        title: "Sharing Error", 
        description: "Failed to create share link. Please try again." 
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied! 📋", description: "Content copied to clipboard" });
  };

  const downloadTemplate = () => {
    const content = generateContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `university-of-bacon-${selectedPlatform}-template.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded! 📁", description: "Template saved to your device" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Social Media Kit
          </h3>
          <p className="text-sm text-muted-foreground">
            Craft the perfect post with our witty, bacon-themed templates
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      {/* Platform Selection */}
      <div>
        <h4 className="font-medium mb-3">Choose Platform</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.id}
                variant={selectedPlatform === platform.id ? "default" : "outline"}
                className="h-auto p-3 flex flex-col gap-2"
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className={`p-2 rounded-full ${platform.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs">{platform.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Template Style Selection */}
      <div>
        <h4 className="font-medium mb-3">Choose Style</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{template.mood}</div>
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <h4 className="font-medium mb-3">Add Personal Touch (Optional)</h4>
        <Textarea
          placeholder="Add your own message to personalize the post..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      {/* Preview */}
      <div>
        <h4 className="font-medium mb-3">Preview</h4>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {currentPlatform && <currentPlatform.icon className="h-4 w-4" />}
              <span className="font-medium">{currentPlatform?.name} Post</span>
              <Badge variant="secondary">{currentTemplate?.name}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Premium Graphic Preview */}
            {currentTemplate && (
              <div className="mb-4 relative">
                <img 
                  src={currentTemplate.graphic} 
                  alt={`${currentTemplate.name} style graphic`}
                  className="w-full h-48 object-cover rounded-md border"
                />
                <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                  <div className="text-white text-center">
                    <Image className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Premium {currentTemplate.name} Graphic</p>
                    <p className="text-xs opacity-80">Automatically included with post</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
              {generateContent() || 'Select a listing to see preview...'}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(generateContent())}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentTemplate?.graphic || '';
                  link.download = `university-of-bacon-${selectedTemplate}-graphic.jpg`;
                  link.click();
                  toast({ title: "Graphic Downloaded! 🖼️", description: "Premium graphic saved to your device" });
                }}
              >
                <Image className="h-4 w-4 mr-1" />
                Download Graphic
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Share Actions */}
      <div>
        <h4 className="font-medium mb-3">Quick Share</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className="h-auto p-3 flex flex-col gap-2"
                disabled={!selectedListing}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">Share to {platform.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};