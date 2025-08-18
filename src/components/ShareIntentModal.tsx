import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Facebook, Twitter, MessageCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [canShare, setCanShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkSharingEligibility();
    }
  }, [isOpen]);

  const checkSharingEligibility = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('user_can_share');
      if (error) throw error;
      setCanShare(data);
    } catch (error) {
      console.error('Error checking sharing eligibility:', error);
      setCanShare(false);
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  const shareText = `Check out this course: ${course.item_title || course.title}`;
  const shareUrl = `https://bacon-university.com/courses/${course.id}`;

  const handleShare = async (platform: string) => {
    if (!canShare) {
      toast({
        title: "Verification Required",
        description: "Please verify your email and phone/identity in Account settings to share listings.",
        variant: "destructive"
      });
      return;
    }

    if (onQuickShare) {
      await onQuickShare(course.id, platform);
    }
    const urls = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    if (!canShare) {
      toast({
        title: "Verification Required",
        description: "Please verify your email and phone/identity in Account settings to share listings.",
        variant: "destructive"
      });
      return;
    }
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard!"
    });
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-6">
            Loading verification status...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share & Earn Bacon
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!canShare && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Verification Required</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Verify your email and phone/identity in Account settings to start sharing and earning.
              </p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            Share this listing and earn {course.reward_percentage || 20}% commission on successful referrals!
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2"
              disabled={!canShare}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2"
              disabled={!canShare}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2"
              disabled={!canShare}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
              disabled={!canShare}
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {canShare ? 
              "You'll earn rewards when someone makes a purchase through your referral link." :
              "Complete verification to start earning referral rewards."
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};