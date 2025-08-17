import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import heroIvy from "@/assets/hero-bacon-ivy.jpg";
import diplomaHero from "@/assets/diploma-hero.png";
const crest = "/lovable-uploads/4c9e5e09-0cd6-4c8b-9085-5ffc8177d095.png";
import type { Listing } from "./ListingCard";

function formatMoney(value?: number | null) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function ListingModal({ open, onOpenChange, listing }: { open: boolean; onOpenChange: (v: boolean) => void; listing: Listing | null; }) {
  const price = useMemo(() => listing ? (listing.asking_price ?? null) : null, [listing]);
  const pool = useMemo(() => listing && price ? Math.round(((listing.reward_percentage ?? 20) / 100) * price) : null, [listing, price]);

  const payoutPercents = [50, 25, 10, 7.5, 5, 2.5];
  const payouts = useMemo(() => {
    if (!pool) return [] as string[];
    return payoutPercents.slice(0, listing?.max_degrees ?? 6).map((p, i) => `Degree ${i + 1}: ${p}% = ${formatMoney(Math.round((p/100) * pool))}`);
  }, [pool, listing]);

  useEffect(() => {
    if (open) {
      document.title = `${listing?.item_title ?? "Listing"} – University of Bacon`;
    }
    return () => {
      document.title = "University of Bacon";
    };
  }, [open, listing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-[hsl(var(--brand-academic))]">{listing?.item_title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-md overflow-hidden">
            <Carousel>
              <CarouselContent>
                {listing?.item_images && Array.isArray(listing.item_images) && listing.item_images.length > 0 ? (
                  listing.item_images.map((src, i) => (
                    <CarouselItem key={i}>
                      <img src={src} alt={`Listing image ${i+1} for ${listing?.item_title ?? "listing"}`} className="w-full h-60 object-cover" loading="lazy" />
                    </CarouselItem>
                  ))
                ) : (
                  [heroIvy, diplomaHero, crest].map((src, i) => (
                    <CarouselItem key={i}>
                      <img src={src} alt={`Default image ${i+1} for ${listing?.item_title ?? "listing"}`} className="w-full h-60 object-cover" loading="lazy" />
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{listing?.item_description ?? "No description provided."}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Asking</div>
                <div className="font-semibold">{formatMoney(price)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Referral Pool</div>
                <div className="font-semibold">{pool ? formatMoney(pool) : "—"} <span className="text-xs">({listing?.reward_percentage ?? 20}%)</span></div>
              </div>
              <div>
                <div className="text-muted-foreground">Max Degrees</div>
                <div className="font-semibold">{listing?.max_degrees ?? 6}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Location</div>
                <div className="font-semibold">{listing?.general_location ?? "Worldwide"}</div>
              </div>
            </div>
            {pool && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Payout Breakdown</div>
                <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
                  {payouts.map((p, i) => (<li key={i}>{p}</li>))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
