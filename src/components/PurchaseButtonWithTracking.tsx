import React, { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handlePurchaseConversion } from '@/hooks/useShareLinkTracking';

interface PurchaseButtonWithTrackingProps {
  listing: any;
  onPurchase: (purchaseData: any) => Promise<any>;
  children: ReactNode;
  userId: string;
}

export const PurchaseButtonWithTracking: React.FC<PurchaseButtonWithTrackingProps> = ({ 
  listing, 
  onPurchase, 
  children,
  userId 
}) => {
  const { toast } = useToast();

  const handlePurchase = async () => {
    try {
      // Execute the purchase
      const purchaseData = await onPurchase({
        listingId: listing.id,
        amount: listing.asking_price,
        buyerId: userId
      });

      if (purchaseData.success) {
        // Track the conversion
        await handlePurchaseConversion({
          purchaseAmount: listing.asking_price,
          buyerId: userId,
          listingId: listing.id
        });

        toast({
          title: "Purchase Successful! 🎉",
          description: "Your purchase has been completed and referral rewards have been distributed.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Purchase Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div onClick={handlePurchase}>
      {children}
    </div>
  );
};