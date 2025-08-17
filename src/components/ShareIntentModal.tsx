import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface Course {
  id: string;
  item_title: string;
  item_description?: string;
  price_min?: number;
  price_max?: number;
  reward_percentage?: number;
  max_degrees: number;
  status: string;
  user_id: string;
  general_location?: string;
  verification_level: 'none' | 'professor_verified' | 'deans_list' | 'honor_roll';
  created_at: string;
  updated_at: string;
}

interface ShareIntentModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  shareLink?: any;
  onMethodSelect?: (courseId: string, method: string) => Promise<void>;
  onQuickShare?: (courseId: string, platform: string) => Promise<void>;
}

export const ShareIntentModal: React.FC<ShareIntentModalProps> = ({
  course,
  isOpen,
  onClose,
  shareLink,
  onMethodSelect,
  onQuickShare
}) => {
  if (!course) return null;

  const shareText = `Check out this course: ${course.item_title || course.title}`;
  const shareUrl = `https://bacon-university.com/courses/${course.id}`;

  const handleShare = async (platform: string) => {
    if (onQuickShare) {
      await onQuickShare(course.id, platform);
    }
    const urls = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Course
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold">{course.item_title || course.title}</h3>
            <p className="text-sm text-muted-foreground">
              Share this course and earn bacon rewards!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => handleShare('facebook')} className="bg-blue-600 hover:bg-blue-700">
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button onClick={() => handleShare('twitter')} className="bg-sky-500 hover:bg-sky-600">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button onClick={() => handleShare('whatsapp')} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};