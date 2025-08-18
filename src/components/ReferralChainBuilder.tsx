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
      // Get the referral chain for this listing - only one user per degree
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('listing_id', listingId)
        .order('degree', { ascending: true })
        .limit(6); // Maximum 6 degrees

      if (error) throw error;
      
      // Ensure only one user per degree (take the first one for each degree)
      const chainMap = new Map();
      data?.forEach(link => {
        if (!chainMap.has(link.degree) && link.degree <= 6) {
          chainMap.set(link.degree, link);
        }
      });
      
      // Convert back to array and sort by degree
      const uniqueChain = Array.from(chainMap.values()).sort((a, b) => a.degree - b.degree);
      setChain(uniqueChain);
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
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-4">
              Referral Chain (Max 6 degrees) • Higher degrees earn less
            </div>
            {chain.map((link, index) => (
              <div key={link.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg border-l-4 border-primary">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {link.degree}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {link.referrer_id === currentUserId ? '🎯 You' : `Student ${index + 1}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Degree {link.degree} • {link.degree === 1 ? 'Direct referrer' : `${link.degree} degrees away`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    ${calculatePotentialEarnings(link.degree)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {link.degree === 1 ? '40%' : link.degree === 2 ? '30%' : link.degree === 3 ? '20%' : link.degree === 4 ? '7%' : link.degree === 5 ? '2%' : '1%'} of pool
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show remaining spots */}
            {chain.length < 6 && (
              <div className="mt-4 p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <div className="text-sm">🔗 {6 - chain.length} spots remaining in chain</div>
                  <div className="text-xs mt-1">Share to build the referral chain</div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};