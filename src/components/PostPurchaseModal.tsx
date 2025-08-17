import React from 'react';

export interface PostPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    name: string;
    email: string;
    phone: string;
    address: string;
    photo: string;
    preferredContact: string;
    availability: string;
    deliveryOptions: string;
  };
  escrow: {
    id: string;
    amount: number;
    autoReleaseDate: string;
  };
  baconDistribution: Array<{
    degree: string;
    amount: number;
  }>;
}

const PostPurchaseModal: React.FC<PostPurchaseModalProps> = ({ 
  isOpen, 
  onClose, 
  seller, 
  escrow, 
  baconDistribution 
}) => {
  if (!isOpen) return null;

  const contactSeller = (method: string) => {
    if (method === 'phone') {
      window.open(`tel:${seller.phone}`);
    } else if (method === 'email') {
      window.open(`mailto:${seller.email}`);
    }
  };

  const openDispute = () => {
    console.log('Opening dispute process');
    // Implement dispute flow
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">🎉 Payment Confirmed - Seller Contact Revealed!</h2>
            <p className="text-muted-foreground">Your ${escrow.amount} is secure in escrow. Here's your seller's information:</p>
          </div>
          
          <div className="flex gap-4 p-4 border rounded-lg">
            <img className="w-20 h-20 object-cover rounded-full" src={seller.photo} alt={seller.name} />
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold">{seller.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <strong>Email:</strong>
                  <span>{seller.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <strong>Phone:</strong>
                  <span>{seller.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <strong>Address:</strong>
                  <span>{seller.address}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div><strong>⏰ Best contact time:</strong> {seller.availability}</div>
                <div><strong>💬 Preferred contact:</strong> {seller.preferredContact}</div>
                <div><strong>🚚 Delivery options:</strong> {seller.deliveryOptions}</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">📋 What to do next:</h4>
            <ol className="space-y-2 text-sm">
              <li><strong>1. Contact {seller.name.split(' ')[0]}</strong> using their preferred method above</li>
              <li><strong>2. Arrange viewing/pickup</strong> at a mutually convenient time</li>
              <li><strong>3. Inspect the item</strong> to ensure it matches the description</li>
              <li><strong>4. Confirm receipt</strong> in your University of Bacon account</li>
              <li><strong>5. Payment releases</strong> to {seller.name.split(' ')[0]}, bacon distributes to referral chain! 🥓</li>
            </ol>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">💳 Escrow Status:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount Held:</span>
                <span className="font-bold">${escrow.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow ID:</span>
                <span className="font-mono">{escrow.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-release Date:</span>
                <span>{escrow.autoReleaseDate}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🥓 Bacon Distribution When You Confirm Receipt:</h4>
            <div className="space-y-2">
              {baconDistribution.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.degree}:</span>
                  <span className="font-bold">${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => contactSeller('phone')}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold"
            >
              📱 Call {seller.name.split(' ')[0]} Now
            </button>
            <button
              onClick={() => contactSeller('email')}
              className="flex-1 border py-2 px-4 rounded-lg"
            >
              📧 Email {seller.name.split(' ')[0]}
            </button>
            <button
              onClick={openDispute}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg"
            >
              ⚠️ Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPurchaseModal;