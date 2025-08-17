import React, { useState } from 'react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    priceMin: number;
    priceMax: number;
    rewardPercentage: number;
    images?: string[];
  };
  potentialEarnings: number;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, listing, potentialEarnings }) => {
  const [personalNote, setPersonalNote] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const handleShare = () => {
    console.log('Sharing to:', selectedPlatform, 'Message:', personalNote);
    // Implement sharing logic
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">🎓 Share & Earn Your First Bacon!</h2>
            <p className="text-muted-foreground">
              You'll earn <strong>${potentialEarnings}</strong> if someone purchases through your referral!
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">📱 This is what your friends will see:</h3>
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <div className="text-center">
                <div className="font-bold text-primary">🎓 University of Bacon</div>
                <div className="text-sm text-muted-foreground">Where Your Network Becomes Your Net Worth</div>
              </div>
              
              <div className="flex gap-4">
                {listing.images?.[0] && (
                  <img className="w-24 h-24 object-cover rounded" src={listing.images[0]} alt={listing.title} />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <div className="text-lg font-bold text-primary">${listing.priceMin}-${listing.priceMax}</div>
                  <div className="text-sm text-accent">
                    🥓 <strong>Refer someone & earn up to ${potentialEarnings}!</strong>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div>⏰ Only 18 days left to refer</div>
                <div>👥 15 people already showing interest</div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold">🎯 Join Free & Start Earning From Your Network</div>
                <div className="text-sm text-muted-foreground">Turn your connections into cash • No spam • Real payouts</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">📢 Choose your platform:</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'facebook', icon: '📘', name: 'Facebook', note: 'Great reach' },
                { id: 'twitter', icon: '🐦', name: 'Twitter', note: 'Quick shares' },
                { id: 'linkedin', icon: '💼', name: 'LinkedIn', note: 'Professional' },
                { id: 'instagram', icon: '📸', name: 'Instagram', note: 'Visual impact' },
                { id: 'tiktok', icon: '🎵', name: 'TikTok', note: 'Viral potential' },
                { id: 'email', icon: '📧', name: 'Email', note: 'Personal touch' },
                { id: 'copy', icon: '🔗', name: 'Copy Link', note: 'Share anywhere' }
              ].map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform.id)}
                  className={`p-3 border rounded-lg text-center hover:bg-accent transition-colors ${
                    selectedPlatform === platform.id ? 'bg-accent border-primary' : ''
                  }`}
                >
                  <div>{platform.icon} {platform.name}</div>
                  <div className="text-xs text-muted-foreground">{platform.note}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              ✍️ Add a personal note (optional but recommended):
            </label>
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              placeholder="Hey [friend's name]! I saw this MacBook and thought you might be interested. It's through this cool new platform where we both earn money from successful referrals. Check it out!"
            />
            <div className="text-xs text-muted-foreground mt-1">
              💡 <strong>Pro tip:</strong> Personal messages get 3x higher click rates!
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              disabled={!selectedPlatform}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold disabled:opacity-50"
            >
              🚀 Share Now & Start Earning
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
