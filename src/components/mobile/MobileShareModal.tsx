import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, MessageSquare, Facebook, Twitter, Instagram, Copy, Settings } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  image: string;
  baconPotential: number;
}

interface MobileShareModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickShare: (platform: string) => void;
  onCopyLink: () => void;
  onOpenAdvanced: () => void;
}

export const MobileShareModal: React.FC<MobileShareModalProps> = ({
  course,
  isOpen,
  onClose,
  onQuickShare,
  onCopyLink,
  onOpenAdvanced
}) => {
  if (!course) return null;

  const quickSharePlatforms = [
    { id: 'facebook', icon: <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />, name: 'Facebook', color: 'bg-blue-500' },
    { id: 'twitter', icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />, name: 'Twitter', color: 'bg-sky-500' },
    { id: 'instagram', icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />, name: 'Instagram', color: 'bg-pink-500' },
    { id: 'whatsapp', icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />, name: 'WhatsApp', color: 'bg-green-500' },
    { id: 'sms', icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />, name: 'Text', color: 'bg-purple-500' },
    { id: 'copy', icon: <Copy className="w-4 h-4 sm:w-5 sm:h-5" />, name: 'Copy Link', color: 'bg-gray-500' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-4 sm:p-6">
        <DialogHeader>
          {/* Swipe indicator */}
          <div className="w-8 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
        </DialogHeader>

        {/* Course preview */}
        <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg mb-4">
          <img 
            src={course.image} 
            alt={course.title}
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">{course.title}</h3>
            <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary text-xs">
              🥓 Earn ${course.baconPotential}
            </Badge>
          </div>
        </div>

        {/* Quick share grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
          {quickSharePlatforms.map((platform) => (
            <Button
              key={platform.id}
              variant="outline"
              className="h-auto p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 hover-scale touch-target"
              onClick={() => platform.id === 'copy' ? onCopyLink() : onQuickShare(platform.id)}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg text-white ${platform.color}`}>
                {platform.icon}
              </div>
              <span className="text-xs">{platform.name}</span>
            </Button>
          ))}
        </div>

        {/* Advanced options */}
        <Button 
          variant="outline" 
          className="w-full touch-target" 
          onClick={onOpenAdvanced}
        >
          <Settings className="w-4 h-4 mr-2" />
          🛠️ Advanced Sharing Tools
        </Button>
      </DialogContent>
    </Dialog>
  );
};