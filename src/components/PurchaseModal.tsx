import React, { useState } from 'react';
import { paymentService } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

export interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    priceMin: number;
    priceMax: number;
    images?: string[];
    seller_id?: string;
  };
  baconDistribution: number;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, listing, baconDistribution }) => {
  const [intendedOffer, setIntendedOffer] = useState(listing.priceMax);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleProceedToEscrow = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Create escrow transaction
      const escrowTransaction = await paymentService.createEscrowTransaction({
        listingId: listing.id,
        sellerId: listing.seller_id || 'placeholder-seller-id',
        offerAmount: intendedOffer,
        referralChainData: [] // Would be populated from actual referral chain
      });

      // Redirect to Stripe payment for escrow funding
      const paymentSession = await paymentService.fundEscrow(escrowTransaction.id);
      
      // Open Stripe checkout in new tab
      window.open(paymentSession.url, '_blank');
      
      toast({
        title: "Escrow Created",
        description: "Complete payment in the new tab to fund the escrow account.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Escrow Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">🎯 Ready to Purchase This Course?</h2>
            <p className="text-muted-foreground">Here's how our secure anonymous purchase process works:</p>
          </div>
          
          <div className="flex gap-4 p-4 border rounded-lg">
            {listing.images?.[0] && (
              <img className="w-24 h-24 object-cover rounded" src={listing.images[0]} alt={listing.title} />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{listing.title}</h3>
              <div className="text-lg font-bold text-primary">Your intended offer: ${intendedOffer}</div>
              <div className="text-sm text-accent">
                🥓 Your purchase will distribute <strong>${baconDistribution} bacon</strong> to the referral chain!
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Process Timeline:</h4>
            {[
              { step: 1, title: 'Express Interest', desc: 'Confirm you\'re ready to purchase at your intended price', active: true },
              { step: 2, title: 'Secure Escrow Payment', desc: 'Fund our secure escrow account to protect both parties' },
              { step: 3, title: 'Seller Contact Revealed', desc: 'After payment confirmed, get seller\'s contact information' },
              { step: 4, title: 'Complete Transaction', desc: 'Coordinate with seller, confirm receipt, release payment' }
            ].map((item, index) => (
              <div key={index} className={`flex gap-3 p-3 rounded-lg ${item.active ? 'bg-accent' : 'bg-muted'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  item.active ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-background'
                }`}>
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🛡️ Your Protection:</h4>
            <ul className="space-y-1 text-sm">
              <li>✅ Seller only gets paid after you confirm receipt</li>
              <li>✅ Full refund protection for 7 days</li>
              <li>✅ Dispute resolution service included</li>
              <li>✅ Your payment info never shared with seller</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">💰 Your intended offer:</label>
            <input
              type="number"
              value={intendedOffer}
              onChange={(e) => setIntendedOffer(Number(e.target.value))}
              min={listing.priceMin}
              max={listing.priceMax}
              className="w-full p-3 border rounded-lg"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Price range: ${listing.priceMin} - ${listing.priceMax}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleProceedToEscrow}
              disabled={isProcessing}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold disabled:opacity-50"
            >
              {isProcessing ? '⏳ Creating Escrow...' : '🔒 Proceed to Secure Payment'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              ❌ Not Ready Yet
            </button>
          </div>
          
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">🤔 Why can't I contact the seller directly?</summary>
            <p className="mt-2 text-muted-foreground">
              University of Bacon protects seller privacy until payment is confirmed. This prevents circumvention of our referral chain system and ensures everyone who helped connect you to this item gets their fair bacon reward!
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;