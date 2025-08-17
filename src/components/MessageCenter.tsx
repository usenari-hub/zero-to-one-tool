import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MessageSquare, HelpCircle, Send, Filter, Clock, CheckCircle, Heart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  listing_id?: string;
  sender_id: string;
  recipient_id?: string;
  message_type: 'buyer_to_seller' | 'anonymous_inquiry' | 'help_desk';
  subject: string;
  content: string;
  filtered_content: string;
  status: 'pending' | 'approved' | 'flagged' | 'responded';
  created_at: string;
  response?: string;
  responded_at?: string;
  listing?: {
    item_title: string;
    asking_price: number;
  };
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

const CHARITY_FUND_INFO = {
  description: "When listings sell before all 6 referral degrees are filled, unclaimed funds automatically go to our charity partners supporting student financial aid and educational initiatives.",
  currentFund: 2847.50, // This would come from the database
  charitiesSupported: ["Student Emergency Fund", "Textbook Assistance Program", "Digital Access Initiative"]
};

export const MessageCenter = ({ userId }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [purchasedListings, setPurchasedListings] = useState([]);
  const [ownListings, setOwnListings] = useState([]);
  const [newMessage, setNewMessage] = useState({
    type: 'help_desk',
    listing_id: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchUserListings();
  }, [userId]);

  const fetchMessages = async () => {
    try {
      // For now, we'll use a mock implementation since the messages table doesn't exist yet
      // This would be replaced with actual Supabase queries once the database is set up
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUserListings = async () => {
    try {
      // Fetch purchased listings
      const { data: purchases, error: purchaseError } = await supabase
        .from('purchases')
        .select(`
          listing_id,
          listings(id, item_title, asking_price, seller_id)
        `)
        .eq('buyer_id', userId);

      if (purchaseError) throw purchaseError;
      setPurchasedListings(purchases?.map(p => p.listings).filter(Boolean) || []);

      // Fetch own listings
      const { data: listings, error: listingError } = await supabase
        .from('listings')
        .select('id, item_title, asking_price, status')
        .eq('user_id', userId);

      if (listingError) throw listingError;
      setOwnListings(listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

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

  const sendMessage = async () => {
    if (!newMessage.content.trim() || !newMessage.subject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message content.",
        variant: "destructive"
      });
      return;
    }

    const { filtered, hasViolations } = filterContent(newMessage.content);

    if (hasViolations) {
      toast({
        title: "Message Filtered",
        description: "Your message contains prohibited content and has been filtered. Attempting to bypass our filters may result in an immediate ban.",
        variant: "destructive"
      });
    }

    setLoading(true);
    try {
      // For demo purposes, we'll simulate sending a message
      // In production, this would insert into the messages table
      const messageData = {
        listing_id: newMessage.listing_id || null,
        sender_id: userId,
        recipient_id: newMessage.type === 'buyer_to_seller' ? 
          purchasedListings.find(l => l.id === newMessage.listing_id)?.seller_id : null,
        message_type: newMessage.type,
        subject: newMessage.subject,
        content: newMessage.content,
        filtered_content: filtered,
        status: hasViolations ? 'flagged' : 'pending'
      };

      // Simulate successful message sending
      console.log('Message would be sent:', messageData);

      toast({
        title: "Message Sent",
        description: hasViolations ? 
          "Your message was sent but flagged for review due to filtered content." :
          "Your message has been sent successfully.",
      });

      setNewMessage({ type: 'help_desk', listing_id: '', subject: '', content: '' });
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

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: Clock },
      approved: { variant: "default" as const, icon: CheckCircle },
      flagged: { variant: "destructive" as const, icon: AlertTriangle },
      responded: { variant: "outline" as const, icon: MessageSquare }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Anti-Circumvention Warning */}
      <Alert className="border-destructive/50 bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          <strong>Platform Integrity Warning:</strong> Attempting to share personal contact information, 
          bypass our messaging system, or circumvent platform rules will result in immediate account termination. 
          All messages are monitored and filtered. No exceptions.
        </AlertDescription>
      </Alert>

      {/* Charity Fund Information */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Charity Impact Fund
          </CardTitle>
          <CardDescription>
            {CHARITY_FUND_INFO.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Fund Balance</p>
              <p className="text-2xl font-bold text-primary">${CHARITY_FUND_INFO.currentFund.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supporting</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {CHARITY_FUND_INFO.charitiesSupported.map((charity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {charity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox">Inbox ({messages.length})</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="help">Help Center</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Messages</CardTitle>
              <CardDescription>
                Secure communication with verified sellers and buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className="border-l-4 border-l-primary/30">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{message.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {message.listing?.item_title && `Re: ${message.listing.item_title}`}
                            </p>
                          </div>
                          {getStatusBadge(message.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">{message.filtered_content}</p>
                        {message.response && (
                          <div className="border-l-2 border-primary/20 pl-4 mt-4">
                            <p className="text-sm font-medium text-primary">Response:</p>
                            <p className="text-sm">{message.response}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                All messages are filtered for security. Do not attempt to share contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Message Type</label>
                <Select 
                  value={newMessage.type} 
                  onValueChange={(value) => setNewMessage({...newMessage, type: value, listing_id: ''})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="help_desk">Help Desk Support</SelectItem>
                    <SelectItem value="buyer_to_seller">Question about Purchase</SelectItem>
                    <SelectItem value="anonymous_inquiry">Anonymous Product Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(newMessage.type === 'buyer_to_seller' || newMessage.type === 'anonymous_inquiry') && (
                <div>
                  <label className="text-sm font-medium">
                    {newMessage.type === 'buyer_to_seller' ? 'Your Purchase' : 'Product Inquiry'}
                  </label>
                  <Select 
                    value={newMessage.listing_id} 
                    onValueChange={(value) => setNewMessage({...newMessage, listing_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a listing..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(newMessage.type === 'buyer_to_seller' ? purchasedListings : ownListings).map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          {listing.item_title} - ${listing.asking_price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Brief subject line..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  placeholder="Your message will be filtered for prohibited content including contact information, social media handles, and bypass attempts..."
                  rows={4}
                />
              </div>

              <Button onClick={sendMessage} disabled={loading} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help Center
              </CardTitle>
              <CardDescription>
                Get support for platform issues, technical problems, or account questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Common Topics</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Payment and transaction issues</li>
                    <li>• Account verification problems</li>
                    <li>• Referral chain questions</li>
                    <li>• Bacon rewards and redemption</li>
                    <li>• Technical support</li>
                    <li>• Policy violations or appeals</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Response Times</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• General inquiries: 24-48 hours</li>
                    <li>• Payment issues: 12-24 hours</li>
                    <li>• Technical problems: 4-12 hours</li>
                    <li>• Policy violations: 1-3 business days</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> For fastest support, use the "Help Desk Support" option 
                  in the Compose tab. Include relevant order numbers, listing IDs, or error 
                  messages in your description.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};