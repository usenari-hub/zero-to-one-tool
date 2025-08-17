import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Save, Eye, X, Calendar, Copy, Smile, Hash, Maximize2 } from 'lucide-react';

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
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [content, setContent] = useState(`🔥 Found an amazing ${shareLink.course.title}!

Perfect for any students or professionals in my network. It's in great condition, and the seller has excellent reviews.

If you know someone who might be interested, I can earn a small referral fee through University of Bacon - it's a cool platform that rewards networking!

Check it out: [LINK WILL BE INSERTED]

#UniversityOfBacon #StudentDeals`);
  
  const [selectedImage, setSelectedImage] = useState('original');
  const [audience, setAudience] = useState('public');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-500' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-pink-500' },
    { id: 'email', name: 'Email', icon: '📧', color: 'bg-gray-500' },
    { id: 'sms', name: 'SMS', icon: '💬', color: 'bg-green-500' }
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Smile className="w-4 h-4 mr-2" />
                        Add Emoji
                      </Button>
                      <Button variant="outline" size="sm">
                        <Hash className="w-4 h-4 mr-2" />
                        Suggest Hashtags
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Optimize Length
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {content.length}/500 characters
                    </div>
                  </div>
                </CardContent>
              </Card>

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

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSchedule}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Post
              </Button>
              <Button variant="outline" onClick={() => onSaveDraft(selectedPlatform, content)}>
                <Save className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                ❌ Cancel
              </Button>
              <Button onClick={handlePostNow}>
                🚀 Post to {platforms.find(p => p.id === selectedPlatform)?.name} Now
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