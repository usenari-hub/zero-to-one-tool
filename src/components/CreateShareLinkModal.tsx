import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useViralSharing } from '@/hooks/useViralSharing';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Share2, Facebook, Twitter, Linkedin, MessageCircle, Search } from 'lucide-react';

interface Listing {
  id: string;
  item_title: string;
  item_description: string;
  asking_price: number;
  reward_percentage: number;
  category: string;
  department: string;
  created_at: string;
}

interface CreateShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareLinkCreated: () => void;
}

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
];

export const CreateShareLinkModal: React.FC<CreateShareLinkModalProps> = ({
  isOpen,
  onClose,
  onShareLinkCreated
}) => {
  const [step, setStep] = useState<'selectListing' | 'configurePlatform'>('selectListing');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const { createShareLink } = useViralSharing();

  useEffect(() => {
    if (isOpen) {
      fetchUserListings();
    }
  }, [isOpen]);

  const fetchUserListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('id, item_title, item_description, asking_price, reward_percentage, category, department, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load available listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.item_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateShareLink = async () => {
    if (!selectedListing || !selectedPlatform) {
      toast({
        title: "Missing Information",
        description: "Please select a listing and platform",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await createShareLink(selectedListing.id, selectedPlatform, customMessage);
      
      toast({
        title: "Share Link Created! 🎉",
        description: `Your ${platforms.find(p => p.id === selectedPlatform)?.name} share link is ready!`
      });
      
      onShareLinkCreated();
      handleClose();
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: "Error Creating Share Link",
        description: error instanceof Error ? error.message : "Failed to create share link",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep('selectListing');
    setSelectedListing(null);
    setSelectedPlatform('');
    setCustomMessage('');
    setSearchTerm('');
    onClose();
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Create New Share Link
          </DialogTitle>
        </DialogHeader>

        {step === 'selectListing' && (
          <div className="space-y-4">
            <div>
              <Label>Search Available Listings</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search all available listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading your listings...</div>
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ? 'No listings match your search' : 'No active listings available'}
                  </div>
                  {!searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back later for new listings to share
                    </p>
                  )}
                </div>
              ) : (
                filteredListings.map((listing) => (
                  <Card 
                    key={listing.id} 
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      selectedListing?.id === listing.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedListing(listing)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{listing.item_title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {listing.item_description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{listing.category}</Badge>
                            <Badge variant="outline">{listing.department}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">${listing.asking_price}</div>
                          <div className="text-sm text-primary font-medium">
                            {listing.reward_percentage}% reward
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep('configurePlatform')}
                disabled={!selectedListing}
              >
                Next: Choose Platform
              </Button>
            </div>
          </div>
        )}

        {step === 'configurePlatform' && (
          <div className="space-y-4">
            {selectedListing && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected Listing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h4 className="font-medium">{selectedListing.item_title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${selectedListing.asking_price} • {selectedListing.reward_percentage}% reward
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setStep('selectListing')}
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label>Choose Platform</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Button
                      key={platform.id}
                      variant={selectedPlatform === platform.id ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col gap-2 ${
                        selectedPlatform === platform.id ? platform.color : ''
                      }`}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{platform.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                placeholder="Add a personal touch to your share..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="mt-1"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be added to the default template for your chosen platform
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('selectListing')}>
                Back
              </Button>
              <Button 
                onClick={handleCreateShareLink}
                disabled={!selectedPlatform || isCreating}
                className={selectedPlatformData?.color}
              >
                {isCreating ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Create Share Link
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};