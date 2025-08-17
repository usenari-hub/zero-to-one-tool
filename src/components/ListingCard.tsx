import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Share2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareIntentModal } from "@/components/ShareIntentModal";
import { useState } from "react";

export interface Listing {
  id: string;
  item_title: string;
  item_description: string | null;
  asking_price: number | null;
  reward_percentage: number | null; // percent of sale price allocated to referral pool
  max_degrees: number; // Always 6
  general_location: string | null;
  seller_rating: number | null;
  created_at?: string;
  ends_at?: string | null;
  verification_level?: string | null;
  item_images?: any[] | null;
  department?: string | null;
}


export type OnShare = (listing: Listing) => void;
export type OnBuy = (listing: Listing) => void;
export type OnView = (listing: Listing) => void;

function formatMoney(value?: number | null) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function ListingCard({ listing, onShare, onBuy, onView, className }: { listing: Listing; onShare: OnShare; onBuy: OnBuy; onView: OnView; className?: string; }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const price = listing.asking_price ?? null;
  const rewardPct = listing.reward_percentage ?? 20;

  const pool = price ? Math.round((Number(rewardPct) / 100) * price) : null;

  // Convert listing to course format for ShareIntentModal
  const courseData = {
    id: listing.id,
    item_title: listing.item_title,
    title: listing.item_title,
    image: '/placeholder-course.jpg',
    category: listing.general_location || 'General',
    baconPotential: pool || 0,
    max_degrees: listing.max_degrees,
    status: 'active',
    user_id: 'anonymous',
    created_at: listing.created_at || new Date().toISOString(),
    updated_at: listing.created_at || new Date().toISOString()
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleMethodSelect = async (courseId: string, method: string) => {
    try {
      // Import SharingAPI for real functionality
      const { SharingAPI } = await import('@/lib/SharingAPI');
      await SharingAPI.createShareIntent({
        listingId: listing.id,
        sharingMethod: method,
        platform: method
      });
      setShowShareModal(false);
      onShare(listing);
    } catch (error) {
      console.error('Error creating share intent:', error);
      setShowShareModal(false);
      onShare(listing);
    }
  };

  const handleQuickShare = async (courseId: string, platform: string) => {
    try {
      const { SharingAPI } = await import('@/lib/SharingAPI');
      await SharingAPI.createShareIntent({
        listingId: listing.id,
        sharingMethod: 'quick_share',
        platform: platform
      });
      setShowShareModal(false);
      onShare(listing);
    } catch (error) {
      console.error('Error creating quick share:', error);
      setShowShareModal(false);
      onShare(listing);
    }
  };

  return (
    <Card className={cn("group hover:shadow-elegant transition-shadow", className)}>
      <CardContent className="mobile-card">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Anonymous • {listing.general_location ?? "Worldwide"}</div>
            <h3 className="mt-1 font-display text-sm sm:text-base text-[hsl(var(--brand-academic))] line-clamp-2">{listing.item_title}</h3>
          </div>
          {listing.seller_rating != null && (
            <div className="text-xs bg-accent/30 text-[hsl(var(--brand-academic))] rounded px-2 py-1 flex-shrink-0">{listing.seller_rating.toFixed(1)}★</div>
          )}
        </div>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3">{listing.item_description ?? "No description provided."}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Asking</div>
            <div className="font-semibold text-sm sm:text-base">{formatMoney(price)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Referral Pool</div>
            <div className="font-semibold text-sm sm:text-base">{pool ? formatMoney(pool) : "—"} <span className="text-xs">({rewardPct}%)</span></div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex gap-2 flex-1">
            <Button variant="secondary" size="sm" onClick={() => onView(listing)} className="touch-target flex-1 sm:flex-initial">
              <Eye className="mr-1 sm:mr-2 h-4 w-4" /> 
              <span className="text-xs sm:text-sm">View</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareClick} className="touch-target flex-1 sm:flex-initial">
              <Share2 className="mr-1 sm:mr-2 h-4 w-4" /> 
              <span className="text-xs sm:text-sm">Share</span>
            </Button>
          </div>
          <Button variant="hero" size="sm" className="touch-target w-full sm:w-auto" onClick={() => onBuy(listing)}>
            <ShoppingCart className="mr-1 sm:mr-2 h-4 w-4" /> 
            <span className="text-xs sm:text-sm">Buy</span>
          </Button>
        </div>
      </CardContent>
      
      <ShareIntentModal
        course={courseData}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onMethodSelect={handleMethodSelect}
        onQuickShare={handleQuickShare}
      />
    </Card>
  );
}
