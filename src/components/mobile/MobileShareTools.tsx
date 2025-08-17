import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Facebook, Twitter, Instagram, MessageSquare, Smile, Hash, Camera, Calendar, Send } from 'lucide-react';

interface MobileShareToolsProps {
  shareLinkId: string;
  isOpen: boolean;
  onClose: () => void;
  onPost: (platform: string, content: string) => void;
  onSchedule: (platform: string, content: string) => void;
}

export const MobileShareTools: React.FC<MobileShareToolsProps> = ({
  shareLinkId,
  isOpen,
  onClose,
  onPost,
  onSchedule
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [content, setContent] = useState('');

  const platforms = [
    { id: 'facebook', icon: <Facebook className="w-4 h-4" />, name: 'Facebook' },
    { id: 'twitter', icon: <Twitter className="w-4 h-4" />, name: 'Twitter' },
    { id: 'instagram', icon: <Instagram className="w-4 h-4" />, name: 'Instagram' },
    { id: 'whatsapp', icon: <MessageSquare className="w-4 h-4" />, name: 'WhatsApp' }
  ];

  const getPlatformIcon = (platform: string) => {
    const p = platforms.find(pl => pl.id === platform);
    return p ? p.icon : <Facebook className="w-4 h-4" />;
  };

  const maxLength = selectedPlatform === 'twitter' ? 280 : 500;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto h-[80vh] flex flex-col">
        <DialogHeader>
          {/* Swipe indicator */}
          <div className="w-8 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Platform tabs */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {platforms.map(platform => (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? "default" : "ghost"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  {platform.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Content editor */}
          <div className="flex-1 flex flex-col">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${selectedPlatform} post...`}
              className="flex-1 min-h-[200px] resize-none"
              maxLength={maxLength}
            />
            
            <div className="flex justify-between items-center mt-2 mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Hash className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                {content.length}/{maxLength}
              </Badge>
            </div>
          </div>

          {/* Quick preview */}
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <div className="text-xs text-muted-foreground mb-2">👀 Preview</div>
            <div className="text-sm">
              {content || "Your post preview will appear here..."}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => onPost(selectedPlatform, content)}
              disabled={!content.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              📤 Post Now
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onSchedule(selectedPlatform, content)}
              disabled={!content.trim()}
            >
              <Calendar className="w-4 h-4 mr-2" />
              📅 Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};