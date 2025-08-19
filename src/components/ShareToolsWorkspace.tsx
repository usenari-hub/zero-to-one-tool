import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Save, Eye, X, Calendar, Copy, Smile, Hash, Maximize2, QrCode, Settings, Zap, Target, Share2, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareLink {
  id: string;
  trackingCode: string;
  shareUrl: string;
  course: {
    id: string;
    title: string;
    image: string;
    department: string;
    priceRange: string;
    baconPotential: number;
  };
}

interface ShareToolsWorkspaceProps {
  shareLink: ShareLink;
  onClose: () => void;
  onSaveDraft: (platform: string, content: string) => void;
  onPostNow: (platform: string, content: string, options: any) => void;
  onSchedule: (platform: string, content: string, scheduledFor: Date) => void;
}

export const ShareToolsWorkspace: React.FC<ShareToolsWorkspaceProps> = ({
  shareLink,
  onClose,
  onSaveDraft,
  onPostNow,
  onSchedule
}) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [content, setContent] = useState(`🔥 Found an amazing ${shareLink.course.title}!

Perfect for any students or professionals in my network. It's in great condition, and the seller has excellent reviews.

If you know someone who might be interested, I can earn a small referral fee through University of Bacon - it's a cool platform that rewards networking!

Check it out: ${shareLink.shareUrl}

#UniversityOfBacon #StudentDeals`);
  
  const [selectedImage, setSelectedImage] = useState('original');
  const [audience, setAudience] = useState('public');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [utmEnabled, setUtmEnabled] = useState(false);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [abTestEnabled, setAbTestEnabled] = useState(false);
  const [variantContent, setVariantContent] = useState('');

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-500', limit: 2000 },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500', limit: 280 },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', limit: 1300 },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-pink-500', limit: 2200 },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black', limit: 300 },
    { id: 'reddit', name: 'Reddit', icon: '🔴', color: 'bg-orange-500', limit: 10000 },
    { id: 'email', name: 'Email', icon: '📧', color: 'bg-gray-500', limit: 5000 },
    { id: 'sms', name: 'SMS', icon: '💬', color: 'bg-green-500', limit: 160 }
  ];

  const templates = {
    casual: "👋 Hey friends! Found something cool that might interest someone in my network...",
    professional: "Sharing an opportunity in my network that might be valuable to someone looking for...",
    exciting: "🚀 Amazing find! Someone in my network might really benefit from this...",
    custom: ""
  };

  const imageOptions = [
    { id: 'original', name: 'Original Course Image', url: shareLink.course.image },
    { id: 'template1', name: 'University of Bacon Template 1', url: '/placeholder-template-1.jpg' },
    { id: 'template2', name: 'University of Bacon Template 2', url: '/placeholder-template-2.jpg' }
  ];

  const handleCopyTrackingLink = () => {
    navigator.clipboard.writeText(shareLink.shareUrl);
  };

  const handlePostNow = () => {
    onPostNow(selectedPlatform, content, {
      image: selectedImage,
      audience: audience
    });
  };

  const handleSchedule = () => {
    // In a real app, this would open a date/time picker
    const scheduledDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    onSchedule(selectedPlatform, content, scheduledDate);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>🔗 My Share Links</span>
          <span>&gt;</span>
          <span>🛠️ Share Tools</span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onSaveDraft(selectedPlatform, content)}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Course Information */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex gap-4">
                <img 
                  src={shareLink.course.image} 
                  alt={shareLink.course.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{shareLink.course.title}</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>🏫 {shareLink.course.department}</span>
                    <span>{shareLink.course.priceRange}</span>
                    <span>🥓 ${shareLink.course.baconPotential} potential</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>🔗 Your Tracking Link:</Label>
                <div className="flex gap-2">
                  <Input value={shareLink.shareUrl} readOnly className="flex-1" />
                  <Button size="sm" onClick={handleCopyTrackingLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Tabs */}
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="grid grid-cols-6 w-full mb-6">
              {platforms.map((platform) => (
                <TabsTrigger key={platform.id} value={platform.id} className="text-xs">
                  {platform.icon} {platform.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedPlatform} className="space-y-6">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>📝 Choose Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(templates).map(([key, template]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className="h-auto p-3 text-left"
                        onClick={() => setContent(template + '\n\n' + shareLink.shareUrl)}
                      >
                        <div>
                          <div className="font-medium capitalize">{key === 'custom' ? '✏️ Custom' : 
                            key === 'casual' ? '👋 Casual & Friendly' :
                            key === 'professional' ? '💼 Professional' : '🚀 Exciting & Urgent'}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.substring(0, 40)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Message Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>✏️ Customize Your Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Write your ${selectedPlatform} post here...`}
                    className="min-h-[200px]"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => {
                        setContent(content + ' 😊');
                        toast({ title: "Emoji Added", description: "Added a friendly emoji to your post!" });
                      }}>
                        <Smile className="w-4 h-4 mr-2" />
                        Add Emoji
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const hashtags = '#UniversityOfBacon #StudentDeals #NetworkingPays #EarnBacon';
                        setContent(content + '\n\n' + hashtags);
                        toast({ title: "Hashtags Added", description: "Suggested hashtags added to your post!" });
                      }}>
                        <Hash className="w-4 h-4 mr-2" />
                        Suggest Hashtags
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const currentPlatform = platforms.find(p => p.id === selectedPlatform);
                        const maxLength = currentPlatform?.limit || 500;
                        if (content.length > maxLength) {
                          const trimmed = content.substring(0, maxLength - 50) + '...';
                          setContent(trimmed);
                          toast({ title: "Content Optimized", description: `Trimmed to fit ${selectedPlatform} character limit!` });
                        } else {
                          toast({ title: "Already Optimized", description: "Your content fits the platform limits!" });
                        }
                      }}>
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Optimize Length
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <span className={content.length > (platforms.find(p => p.id === selectedPlatform)?.limit || 500) ? 'text-red-500' : ''}>
                        {content.length}/{platforms.find(p => p.id === selectedPlatform)?.limit || 500}
                      </span>
                    </div>
                  </div>
                  
                  {/* A/B Testing */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label htmlFor="ab-test">🧪 A/B Test This Message</Label>
                      <Switch
                        id="ab-test"
                        checked={abTestEnabled}
                        onCheckedChange={setAbTestEnabled}
                      />
                    </div>
                    {abTestEnabled && (
                      <div className="space-y-3">
                        <Textarea
                          value={variantContent}
                          onChange={(e) => setVariantContent(e.target.value)}
                          placeholder="Enter variant B message here..."
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          💡 Variant B will be tested against your main message to see which performs better!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code & Link Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle>🔗 Link Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink.shareUrl);
                          toast({ title: "Link Copied!", description: "Share link copied to clipboard" });
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Full Link
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          const shortUrl = `uob.edu/s/${shareLink.trackingCode}`;
                          navigator.clipboard.writeText(shortUrl);
                          toast({ title: "Short Link Created!", description: "Shortened link copied to clipboard" });
                        }}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Generate Short Link
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          toast({ title: "QR Code Generated!", description: "QR code ready for download" });
                        }}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Generate QR Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* UTM Parameters */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>📊 UTM Tracking</CardTitle>
                      <Switch
                        checked={utmEnabled}
                        onCheckedChange={setUtmEnabled}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {utmEnabled && (
                      <>
                        <div>
                          <Label htmlFor="utm-source" className="text-xs">Source</Label>
                          <Input
                            id="utm-source"
                            placeholder="facebook, twitter, etc."
                            value={utmSource}
                            onChange={(e) => setUtmSource(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="utm-medium" className="text-xs">Medium</Label>
                          <Input
                            id="utm-medium"
                            placeholder="social, email, etc."
                            value={utmMedium}
                            onChange={(e) => setUtmMedium(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="utm-campaign" className="text-xs">Campaign</Label>
                          <Input
                            id="utm-campaign"
                            placeholder="spring2025, promo, etc."
                            value={utmCampaign}
                            onChange={(e) => setUtmCampaign(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </>
                    )}
                    {!utmEnabled && (
                      <p className="text-xs text-muted-foreground">Enable UTM tracking for detailed analytics</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Media Options */}
              <Card>
                <CardHeader>
                  <CardTitle>🖼️ Visual Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {imageOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedImage === option.id ? "default" : "outline"}
                        className="h-auto p-3"
                        onClick={() => setSelectedImage(option.id)}
                      >
                        <div className="text-center">
                          <img 
                            src={option.url} 
                            alt={option.name}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                          <div className="text-xs">{option.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Targeting Options */}
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Who Should See This</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={audience} onValueChange={setAudience}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">🌍 Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friends" id="friends" />
                      <Label htmlFor="friends">👥 Friends Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="groups" id="groups" />
                      <Label htmlFor="groups">👫 Specific Groups</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Performance Insights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>⚡ Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-muted-foreground">Optimal Length</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold text-blue-600">4.2x</div>
                  <div className="text-sm text-muted-foreground">Predicted Engagement</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold text-purple-600">15%</div>
                  <div className="text-sm text-muted-foreground">Est. Conversion Rate</div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Great use of emojis for {selectedPlatform}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Optimal posting time: 2-4 PM on weekdays</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Consider adding a call-to-action</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleSchedule}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Post
              </Button>
              <Button variant="outline" onClick={() => {
                onSaveDraft(selectedPlatform, content);
                toast({ title: "Template Saved", description: "Content saved as reusable template" });
              }}>
                <Save className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
              <Button variant="outline" onClick={() => {
                const analytics = {
                  platform: selectedPlatform,
                  contentLength: content.length,
                  hashtags: (content.match(/#\w+/g) || []).length,
                  mentions: (content.match(/@\w+/g) || []).length
                };
                toast({ 
                  title: "Analytics Preview", 
                  description: `${analytics.hashtags} hashtags, ${analytics.mentions} mentions detected` 
                });
              }}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Preview Analytics
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => {
                handlePostNow();
                toast({ 
                  title: "Posted Successfully! 🎉", 
                  description: `Your ${selectedPlatform} post is now live and earning bacon!` 
                });
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                Post to {platforms.find(p => p.id === selectedPlatform)?.name} Now
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {isPreviewMode && (
          <div className="w-80 border-l p-4 bg-muted/30">
            <h3 className="font-semibold mb-4">👀 Live Preview</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                      SJ
                    </div>
                    <div>
                      <div className="font-medium text-sm">Sarah Johnson</div>
                      <div className="text-xs text-muted-foreground">Just now</div>
                    </div>
                  </div>
                  
                  <div className="text-sm whitespace-pre-wrap">{content}</div>
                  
                  {selectedImage && (
                    <img 
                      src={imageOptions.find(opt => opt.id === selectedImage)?.url} 
                      alt="Post preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  
                  <div className="flex justify-between pt-2 border-t">
                    <Button variant="ghost" size="sm">👍 Like</Button>
                    <Button variant="ghost" size="sm">💬 Comment</Button>
                    <Button variant="ghost" size="sm">📤 Share</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">📊 Predicted Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Expected Reach:</span>
                  <span>150-300 people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Predicted Clicks:</span>
                  <span>8-15 clicks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion Probability:</span>
                  <span>12-18%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};