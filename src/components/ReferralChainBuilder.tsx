import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface ReferralChainBuilderProps {
  listingId: string;
  currentUserId?: string;
}

interface ReferralLink {
  id: string;
  degree: number;
  referrer_id: string;
  created_at: string;
}

export const ReferralChainBuilder: React.FC<ReferralChainBuilderProps> = ({ 
  listingId, 
  currentUserId 
}) => {
  const [chain, setChain] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralChain();
  }, [listingId]);

  const loadReferralChain = async () => {
    try {
      // Get the referral chain for this listing
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('listing_id', listingId)
        .order('degree', { ascending: true });

      if (error) throw error;
      setChain(data || []);
    } catch (error) {
      console.error('Chain loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePotentialEarnings = (degree: number, listingPrice: number = 1000, rewardPercentage: number = 20) => {
    const totalReward = listingPrice * (rewardPercentage / 100);
    const degreePercentages: Record<number, number> = { 1: 40, 2: 30, 3: 20, 4: 7, 5: 2, 6: 1 };
    const percentage = degreePercentages[degree] || 0;
    return Math.floor(totalReward * (percentage / 100));
  };

  if (loading) return <div className="p-4">Loading referral chain...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Chain Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {chain.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-6xl mb-4">🔗</div>
            <p>No referral chain yet</p>
            <p className="text-sm">Be the first to share and start the chain!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chain.map((link, index) => (
              <div key={link.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {link.degree}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {link.referrer_id === currentUserId ? 'You' : `User ${index + 1}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Degree {link.degree} referrer
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    ${calculatePotentialEarnings(link.degree)}
                  </div>
                  <div className="text-xs text-muted-foreground">Potential earnings</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};