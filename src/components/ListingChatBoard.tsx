import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, AlertTriangle, Flag, Clock, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReportModal } from './ReportModal';

interface ChatMessage {
  id: string;
  listing_id: string;
  sender_id: string;
  message_type: 'question' | 'answer';
  content: string;
  filtered_content: string;
  status: 'pending' | 'approved' | 'flagged';
  created_at: string;
  sender_profile: {
    display_name: string;
    avatar_url?: string;
    verification_level?: string;
    is_seller?: boolean;
  };
}

interface ListingChatBoardProps {
  listingId: string;
  isOwner: boolean;
  hasPurchased: boolean;
}

const BANNED_PATTERNS = [
  // Contact information patterns
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses
  /\b(?:instagram|ig|insta|snap|snapchat|facebook|fb|twitter|tiktok|whatsapp|telegram|discord)\s*[:@]?\s*[a-zA-Z0-9._-]+\b/gi, // Social media
  /\b(?:call|text|email|message|contact|reach)\s+me\b/gi, // Contact requests
  /\b(?:my|dm|direct)\s+(?:number|phone|email|insta|snap)\b/gi, // Direct contact hints
  /\b\d{1,5}\s+[a-zA-Z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd)\b/gi, // Addresses
  // Bypass attempts
  /\b(?:meet|meetup|outside|off.?platform|direct|private|personal)\b/gi,
  /\b(?:venmo|paypal|cashapp|zelle|bitcoin|crypto)\b/gi, // Payment methods
];

const filterContent = (content: string): { filtered: string; hasViolations: boolean } => {
  let filtered = content;
  let hasViolations = false;

  BANNED_PATTERNS.forEach(pattern => {
    if (pattern.test(filtered)) {
      hasViolations = true;
      filtered = filtered.replace(pattern, '[FILTERED]');
    }
  });

  return { filtered, hasViolations };
};

const verificationLabel = (level?: string) => {
  switch (level) {
    case "deans_list": return "Dean's List";
    case "professor_verified": return "Professor";
    case "honor_roll": return "Honor Roll";
    default: return null;
  }
};

export const ListingChatBoard = ({ listingId, isOwner, hasPurchased }: ListingChatBoardProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportModal, setReportModal] = useState<{ open: boolean; messageId?: string; userId?: string }>({ open: false });

  useEffect(() => {
    fetchMessages();
  }, [listingId]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages for listing:', listingId);
      const { data, error } = await (supabase as any)
        .from('listing_chat_messages')
        .select(`
          id,
          listing_id,
          sender_id,
          message_type,
          content,
          filtered_content,
          status,
          created_at,
          sender_profile:profiles!sender_id (
            display_name,
            avatar_url,
            verification_level
          )
        `)
        .eq('listing_id', listingId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      // Add is_seller flag to sender profiles
      const { data: listing } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();

      const messagesWithSellerFlag = data?.map((msg: any) => ({
        ...msg,
        sender_profile: {
          ...msg.sender_profile,
          is_seller: msg.sender_id === listing?.user_id
        }
      })) || [];

      setMessages(messagesWithSellerFlag);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to participate in the discussion.",
        variant: "destructive"
      });
      return;
    }

    const { filtered, hasViolations } = filterContent(newMessage);

    if (hasViolations) {
      toast({
        title: "Message Filtered",
        description: "Your message contains prohibited content. Please remove any contact information or attempts to bypass the platform.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const messageType = isOwner ? 'answer' : 'question';
      
      const { error } = await (supabase as any)
        .from('listing_chat_messages')
        .insert({
          listing_id: listingId,
          sender_id: session.session.user.id,
          message_type: messageType,
          content: newMessage,
          filtered_content: filtered,
          status: hasViolations ? 'flagged' : 'pending'
        });

      if (error) throw error;

      if (hasViolations) {
        toast({
          title: "Message Flagged",
          description: "Your message has been flagged for review and will not be visible until approved.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Message Sent",
          description: "Your message is pending approval and will appear shortly.",
        });
      }

      setNewMessage('');
      // Refresh messages after a short delay to show pending message
      setTimeout(fetchMessages, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (messageId: string, userId: string) => {
    setReportModal({ open: true, messageId, userId });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Q&A Discussion
        </CardTitle>
        <Alert className="border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Public Discussion:</strong> All messages are visible to everyone viewing this listing. 
            Do not share personal contact information. Direct messaging is only available after purchase.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No questions yet. Be the first to ask about this item!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.sender_profile.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {message.sender_profile.display_name || 'Anonymous User'}
                    </span>
                    {message.sender_profile.is_seller && (
                      <Badge variant="secondary" className="text-xs">
                        Seller
                      </Badge>
                    )}
                    {verificationLabel(message.sender_profile.verification_level) && (
                      <Badge variant="outline" className="text-xs">
                        {verificationLabel(message.sender_profile.verification_level)}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.filtered_content}</p>
                  <div className="flex items-center gap-2">
                    {message.message_type === 'question' && (
                      <Badge variant="outline" className="text-xs">
                        Question
                      </Badge>
                    )}
                    {message.message_type === 'answer' && (
                      <Badge variant="default" className="text-xs">
                        Answer
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => handleReport(message.id, message.sender_id)}
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isOwner ? "Answer a question about your item..." : "Ask a question about this item..."}
              className="flex-1"
              rows={3}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Messages are public and filtered for safety. No contact information allowed.
            </p>
            <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>

        {/* Purchase Note */}
        {!hasPurchased && !isOwner && (
          <Alert className="border-primary/20 bg-primary/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Want to contact the seller directly?</strong> Complete your purchase to unlock private messaging.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <ReportModal
        open={reportModal.open}
        onOpenChange={(open) => setReportModal({ ...reportModal, open })}
        messageId={reportModal.messageId}
        reportedUserId={reportModal.userId}
      />
    </Card>
  );
};