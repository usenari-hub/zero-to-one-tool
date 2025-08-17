import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DirectMessage {
  id: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  sender_profile: {
    display_name: string;
    avatar_url?: string;
  };
}

interface DirectMessagingProps {
  listingId: string;
  sellerId: string;
  hasPurchased: boolean;
}

export const DirectMessaging = ({ listingId, sellerId, hasPurchased }: DirectMessagingProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (hasPurchased && currentUserId) {
      fetchMessages();
    }
  }, [hasPurchased, currentUserId, listingId]);

  const getCurrentUser = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session.session?.user) {
      setCurrentUserId(session.session.user.id);
    }
  };

  const fetchMessages = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await (supabase as any)
        .from('direct_messages')
        .select(`
          id,
          listing_id,
          sender_id,
          recipient_id,
          content,
          created_at,
          sender_profile:profiles!sender_id (
            display_name,
            avatar_url
          )
        `)
        .eq('listing_id', listingId)
        .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching direct messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !hasPurchased) return;

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('direct_messages')
        .insert({
          listing_id: listingId,
          sender_id: currentUserId,
          recipient_id: sellerId,
          content: newMessage
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been delivered to the seller.",
      });

      setNewMessage('');
      fetchMessages();
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

  if (!hasPurchased) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Direct Messaging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Purchase Required:</strong> Direct messaging with the seller is only available after completing your purchase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Direct Messages
          <Badge variant="secondary" className="ml-auto">
            Purchase Verified
          </Badge>
        </CardTitle>
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Private Conversation:</strong> You can now communicate directly with the seller.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start a conversation with the seller!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex gap-3 p-3 rounded-lg ${
                  message.sender_id === currentUserId 
                    ? 'bg-primary/10 ml-8' 
                    : 'bg-muted/30 mr-8'
                }`}
              >
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
                    {message.sender_id === currentUserId && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
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
              placeholder="Send a message to the seller..."
              className="flex-1"
              rows={3}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Private conversation - only you and the seller can see these messages.
            </p>
            <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};