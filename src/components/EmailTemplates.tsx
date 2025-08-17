import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useViralSharing } from '@/hooks/useViralSharing';
import { Copy, Mail, Send, Download, Users, Heart, Zap, GraduationCap } from 'lucide-react';

interface EmailTemplatesProps {
  selectedListing?: any;
  onClose: () => void;
}

const emailTemplates = [
  {
    id: 'friend',
    name: 'Friend Referral',
    icon: Heart,
    subject: "🎓 Thought you'd love this find at University of Bacon!",
    template: `Hey [FRIEND_NAME]!

Hope you're doing awesome! I just discovered something on this platform called University of Bacon that made me immediately think of you.

They have this [ITEM] listed, and honestly, it looks perfect for what you were mentioning the other day. The cool part? This platform actually pays you for making good connections - if someone buys through your referral, you earn real bacon (aka money! 🥓).

Here's the listing: [SHARE_LINK]

Even if you're not interested, I thought you'd find the whole concept pretty clever - it's like LinkedIn meets social commerce with a hilarious academic twist.

Let me know what you think!

[YOUR_NAME]

P.S. If you do end up checking it out and like what you see, I'll earn a little bacon too - but no pressure at all! 😊`,
    tone: 'Casual & Friendly'
  },
  {
    id: 'professional',
    name: 'Professional Network',
    icon: Users,
    subject: "Valuable Resource Discovery: [ITEM] via University of Bacon",
    template: `Hi [CONTACT_NAME],

I hope this message finds you well. I recently came across an interesting platform called University of Bacon that's revolutionizing how we monetize professional networking.

I found this listing for [ITEM] and thought it might align with your current projects or interests: [SHARE_LINK]

What makes this platform unique is its approach to social commerce - they provide financial incentives for quality referrals, essentially creating a reward system for effective networking. The academic branding adds an engaging gamification element to the experience.

The specific opportunity:
• Item: [ITEM]
• Value Proposition: [DESCRIPTION]
• Referral Reward: $[AMOUNT]

If this resonates with your needs or if you know someone in your network who might benefit, I'd be happy to discuss further.

Best regards,
[YOUR_NAME]

Professional Development through Strategic Networking`,
    tone: 'Professional & Strategic'
  },
  {
    id: 'urgent',
    name: 'Limited Time Alert',
    icon: Zap,
    subject: "⚡ URGENT: Limited Time Opportunity - [ITEM]",
    template: `[FRIEND_NAME] - This won't last long! ⏰

I just spotted something incredible on University of Bacon and had to share it with you immediately:

🎯 [ITEM]
💰 Earn $[AMOUNT] through referral
⏰ Limited availability

Here's why this is perfect timing:
1. The listing just went live
2. High-demand item with limited supply
3. Early referrers get the best positioning in the chain
4. Platform rewards fast action

Link: [SHARE_LINK]

University of Bacon is this brilliant platform that actually pays you for smart networking. Think of it as getting rewarded for being a good connector - which you already are!

Don't sleep on this one - the good opportunities get snapped up fast on this platform.

Quick question: Even if this specific item isn't for you, do you know anyone who might be interested? I could loop them in too.

Talk soon!
[YOUR_NAME]

🥓 Earning bacon through smart connections since joining University of Bacon`,
    tone: 'Urgent & Exciting'
  },
  {
    id: 'educational',
    name: 'Platform Explainer',
    icon: GraduationCap,
    subject: "Discovered something cool: University of Bacon explained",
    template: `Hey [FRIEND_NAME]!

I stumbled upon this fascinating platform called University of Bacon and thought you'd appreciate the clever concept behind it.

**What it is:**
University of Bacon is a social commerce platform with an academic twist. Instead of just buying and selling, they've gamified networking by paying people for making good connections.

**How it works:**
1. Someone lists an item (like this [ITEM]: [SHARE_LINK])
2. You share it with your network
3. If someone purchases through your referral, you earn "bacon" (real money!)
4. The more degrees of separation, the more people can earn

**Why it's brilliant:**
- Rewards quality networking instead of spam
- Creates win-win situations for everyone
- The academic theme makes it fun and engaging
- Actually pays you for something you probably do anyway

**This specific opportunity:**
I found this [ITEM] that pays $[AMOUNT] for successful referrals. Even if it's not your thing, maybe someone in your network would be interested?

The platform is still growing, so early adopters are seeing really good returns on their networking efforts.

Worth checking out if you're curious about innovative social commerce models!

Best,
[YOUR_NAME]

P.S. Yes, they really did theme everything around bacon and universities. It's wonderfully ridiculous and surprisingly effective! 🥓🎓`,
    tone: 'Educational & Informative'
  }
];

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({ selectedListing, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('friend');
  const [recipientName, setRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const { toast } = useToast();
  const { createShareLink } = useViralSharing();

  const currentTemplate = emailTemplates.find(t => t.id === selectedTemplate);

  const generateEmailContent = () => {
    if (!currentTemplate || !selectedListing) return { subject: '', body: '' };

    const shareUrl = selectedListing ? `[Your personalized share link will be generated here]` : '[SHARE_LINK]';
    
    const subject = customSubject || currentTemplate.subject
      .replace(/\[ITEM\]/g, selectedListing.item_title || 'Amazing Course Material');

    const body = (customMessage || currentTemplate.template)
      .replace(/\[FRIEND_NAME\]/g, recipientName || '[FRIEND_NAME]')
      .replace(/\[CONTACT_NAME\]/g, recipientName || '[CONTACT_NAME]')
      .replace(/\[YOUR_NAME\]/g, senderName || '[YOUR_NAME]')
      .replace(/\[ITEM\]/g, selectedListing.item_title || 'Amazing Course Material')
      .replace(/\[DESCRIPTION\]/g, selectedListing.item_description || 'High-quality academic resource')
      .replace(/\[AMOUNT\]/g, String(selectedListing.reward_percentage || 20))
      .replace(/\[SHARE_LINK\]/g, shareUrl);

    return { subject, body };
  };

  const handleCreateEmailLink = async () => {
    if (!selectedListing) {
      toast({ title: "No Listing Selected", description: "Please select a listing to create an email template." });
      return;
    }

    try {
      const shareLink = await createShareLink(selectedListing.id, 'email', customMessage);
      const { subject, body } = generateEmailContent();
      
      // Replace placeholder with actual share link
      const finalBody = body.replace(/\[Your personalized share link will be generated here\]/g, shareLink.share_url);
      
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(finalBody)}`;
      window.location.href = mailtoLink;
      
      toast({ 
        title: "Email Template Ready! 📧", 
        description: "Your email client should open with the template." 
      });
    } catch (error) {
      console.error('Error creating email template:', error);
      toast({ 
        title: "Template Error", 
        description: "Failed to create email template. Please try again." 
      });
    }
  };

  const copyEmailContent = () => {
    const { subject, body } = generateEmailContent();
    const fullContent = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullContent);
    toast({ title: "Copied! 📋", description: "Email content copied to clipboard" });
  };

  const downloadTemplate = () => {
    const { subject, body } = generateEmailContent();
    const content = `Subject: ${subject}\n\n${body}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `university-of-bacon-email-template.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded! 📁", description: "Email template saved to your device" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" />
            Email Templates
          </h3>
          <p className="text-sm text-muted-foreground">
            Professional email templates for effective referral outreach
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      {/* Template Selection */}
      <div>
        <h4 className="font-medium mb-3">Choose Template Style</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emailTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.tone}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Personalization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Recipient Name</label>
          <Input
            placeholder="Friend's name..."
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Your Name</label>
          <Input
            placeholder="Your name..."
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        </div>
      </div>

      {/* Custom Subject */}
      <div>
        <label className="text-sm font-medium mb-2 block">Email Subject (Optional)</label>
        <Input
          placeholder="Leave blank to use template subject..."
          value={customSubject}
          onChange={(e) => setCustomSubject(e.target.value)}
        />
      </div>

      {/* Custom Message */}
      <div>
        <label className="text-sm font-medium mb-2 block">Custom Message (Optional)</label>
        <Textarea
          placeholder="Add your own message or leave blank to use template..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Preview */}
      <div>
        <h4 className="font-medium mb-3">Email Preview</h4>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email Content</span>
              <Badge variant="secondary">{currentTemplate?.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Subject:</div>
              <div className="bg-muted p-2 rounded text-sm">
                {generateEmailContent().subject}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Message:</div>
              <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {generateEmailContent().body}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button 
                onClick={handleCreateEmailLink}
                disabled={!selectedListing}
                className="flex-1 md:flex-none"
              >
                <Send className="h-4 w-4 mr-1" />
                Open in Email Client
              </Button>
              <Button 
                variant="outline"
                onClick={copyEmailContent}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button 
                variant="outline"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};