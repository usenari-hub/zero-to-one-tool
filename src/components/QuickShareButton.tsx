import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useViralSharing } from '@/hooks/useViralSharing';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface QuickShareButtonProps {
  listingId: string;
  listingTitle: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const shareOptions = [
  { id: 'facebook', name: 'Share to Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'twitter', name: 'Share to Twitter/X', icon: Twitter, color: 'text-black' },
  { id: 'linkedin', name: 'Share to LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'whatsapp', name: 'Share to WhatsApp', icon: MessageCircle, color: 'text-green-600' },
];

export const QuickShareButton: React.FC<QuickShareButtonProps> = ({
  listingId,
  listingTitle,
  size = 'default',
  variant = 'outline',
  className = ''
}) => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const { toast } = useToast();
  const { createShareLink } = useViralSharing();

  const handleQuickShare = async (platform: string) => {
    setIsSharing(platform);
    
    try {
      const shareLink = await createShareLink(listingId, platform);
      
      // Generate platform-specific share URL
      const content = `🎓 Found something amazing: ${listingTitle}! Earn bacon by sharing on University of Bacon 🥓`;
      const encodedContent = encodeURIComponent(content);
      const encodedUrl = encodeURIComponent(shareLink.share_url);
      
      let shareUrl = '';
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
          title: "Share Link Created! 🎉",
          description: `Sharing ${listingTitle} on ${shareOptions.find(opt => opt.id === platform)?.name.split(' ')[2]}`,
        });
      }
    } catch (error) {
      console.error('Error creating quick share:', error);
      toast({
        title: "Share Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`${className}`}
          disabled={!!isSharing}
        >
          <Share2 className="h-4 w-4 mr-1" />
          {isSharing ? 'Sharing...' : 'Share & Earn'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
        {shareOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleQuickShare(option.id)}
              disabled={isSharing === option.id}
              className="cursor-pointer hover:bg-muted"
            >
              <Icon className={`h-4 w-4 mr-2 ${option.color}`} />
              {option.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};