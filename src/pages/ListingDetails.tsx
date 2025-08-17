
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ShieldCheck, ShoppingCart } from "lucide-react";
import { ListingCard, type Listing } from "@/components/ListingCard";
import { SharedLayout } from "@/components/SharedLayout";
import { ImageGallery } from "@/components/ImageGallery";
import { CoursePageWithTracking } from "@/components/CoursePageWithTracking";
import { ReferralChainBuilder } from "@/components/ReferralChainBuilder";

function formatMoney(value?: number | null) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

const verificationLabel = (level?: string | null) => {
  switch (level) {
    case "deans_list": return "Dean's List Verified";
    case "professor_verified": return "Professor Verified";
    case "honor_roll": return "Honor Roll";
    default: return "Unverified";
  }
};

export default function ListingDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const referralId = searchParams.get("rid");
  const degreeParam = Number(searchParams.get("d") || "1");

  const load = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("listings")
      .select("id,item_title,item_description,asking_price,reward_percentage,max_degrees,general_location,seller_rating,created_at,ends_at,verification_level,item_images,department")
      .eq("id", id)
      .single();
    if (error) {
      toast({ title: "Failed to load listing", description: error.message });
      return;
    }
    setListing(data as any);

    // Simple similar: recent others
    const { data: others } = await supabase
      .from("listings")
      .select("id,item_title,item_description,asking_price,reward_percentage,max_degrees,general_location,seller_rating,created_at,ends_at,verification_level,item_images,department")
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(6);
    setSimilar((others as any) || []);
  }, [id]);

  const recordEvent = useCallback(async (listingId: string, event_type: "view" | "share" | "buy") => {
    const { error } = await supabase.from("listing_events").insert({
      listing_id: listingId,
      referral_id: referralId,
      event_type,
    } as any);
    if (error) console.warn("Failed to record event", error.message);
  }, [referralId]);

  useEffect(() => {
    document.title = listing ? `${listing.item_title} – University of Bacon` : "Listing – University of Bacon";
  }, [listing]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (id) recordEvent(id, "view");
  }, [id, recordEvent]);

  const poolAmount = useMemo(() => {
    const price = Number(listing?.asking_price ?? 0);
    const pct = Number(listing?.reward_percentage ?? 20);
    return Math.round((pct / 100) * price);
  }, [listing]);

  const handleShare = async () => {
    if (!listing) return;
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) {
      toast({ title: "Sign in required", description: "Create an account or sign in to generate your personalized share link." });
      return;
    }

    const parentDegree = Number(searchParams.get("d") || "0") || 0;
    const nextDegree = Math.min((parentDegree || 0) + 1, listing.max_degrees || 6);

    const { data: ref, error } = await supabase.from("referrals").insert({
      listing_id: listing.id,
      referrer_id: user.id,
      degree: nextDegree,
      note: null,
    }).select("id").single();

    if (error) {
      toast({ title: "Could not create referral", description: error.message });
      return;
    }

    const url = `${window.location.origin}/listings/${listing.id}?rid=${ref.id}&d=${nextDegree}`;
    const price = listing.asking_price ?? 0;
    const text = `Know a buyer for this? ${listing.item_title} – Asking ${formatMoney(Number(price))}. ${formatMoney(poolAmount)} referral pool. I’ll split the bacon with you. ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: listing.item_title, text, url });
      } else {
        await navigator.clipboard.writeText(text);
        toast({ title: "Share text copied", description: "Sharpened and ready to paste anywhere." });
      }
      recordEvent(listing.id, "share");
    } catch {
      await navigator.clipboard.writeText(text);
      toast({ title: "Share text copied", description: "Sharpened and ready to paste anywhere." });
      recordEvent(listing.id, "share");
    }
  };

  const handleBuy = async () => {
    if (!listing) return;
    const price = listing.asking_price;
    if (!price) {
      toast({ title: "Price unavailable", description: "This listing does not have a set price." });
      return;
    }
    const amountCents = Math.max(50, Math.round(Number(price) * 100));

    recordEvent(listing.id, "buy");

    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: {
        amount: amountCents,
        currency: "usd",
        item_name: listing.item_title,
        listing_id: listing.id,
        referral_id: referralId,
        successPath: `/purchase-success?listing=${listing.id}`,
        cancelPath: `/purchase-canceled?listing=${listing.id}`,
      },
    });
    if (error) {
      toast({ title: "Checkout failed", description: error.message });
      return;
    }
    const url = (data as any)?.url as string | undefined;
    if (url) window.location.href = url;
  };

  return (
    <CoursePageWithTracking listing={listing}>
      <SharedLayout>
        <main className="container py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:underline mb-3">&larr; Back to Listings</button>

      {!listing ? (
        <div className="h-40 rounded-md bg-muted animate-pulse" />
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-2xl font-display">{listing.item_title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {verificationLabel((listing as any).verification_level)}
                </Badge>
                {listing.seller_rating != null && (
                  <Badge variant="outline">{Number(listing.seller_rating).toFixed(1)}/5 rating</Badge>
                )}
                {listing.general_location && <Badge variant="outline">{listing.general_location}</Badge>}
                <Badge variant="outline">Anonymous Professor</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{listing.item_description}</p>

              {/* Image Gallery */}
              {listing.item_images && Array.isArray(listing.item_images) && listing.item_images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos</h3>
                  <ImageGallery images={listing.item_images} title={listing.item_title} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground">Asking Price</div>
                  <div className="text-lg font-medium">
                    {formatMoney(Number(listing.asking_price ?? 0))}
                  </div>
                </div>
                <div className="p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground">Referral Pool</div>
                  <div className="text-lg font-medium">
                    {formatMoney(poolAmount)} ({Number(listing.reward_percentage ?? 20)}%)
                  </div>
                </div>
                <div className="p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground">Max Degrees</div>
                  <div className="text-lg font-medium">{listing.max_degrees ?? 6}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleBuy} className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.9)]">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase
                </Button>
              </div>
            </CardContent>
          </Card>

          {similar.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display text-2xl text-accent mb-3">Similar Courses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similar.map((l) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    onShare={() => {
                      // Preserve chain parameters when navigating via card view
                      const params = new URLSearchParams();
                      if (referralId) params.set("rid", referralId);
                      params.set("d", String(degreeParam || 1));
                      navigate(`/listings/${l.id}?${params.toString()}`);
                    }}
                     onBuy={() => {
                       // Lightweight buy handler for similar list
                       const price = l.asking_price;
                       if (!price) {
                         toast({ title: "Price unavailable", description: "This listing does not have a set price." });
                         return;
                       }
                      recordEvent(l.id, "buy");
                      supabase.functions.invoke("create-payment", {
                        body: {
                          amount: Math.max(50, Math.round(Number(price) * 100)),
                          currency: "usd",
                          item_name: l.item_title,
                          listing_id: l.id,
                          referral_id: referralId,
                          successPath: `/purchase-success?listing=${l.id}`,
                          cancelPath: `/purchase-canceled?listing=${l.id}`,
                        },
                      }).then(({ data, error }) => {
                        if (error) {
                          toast({ title: "Checkout failed", description: error.message });
                          return;
                        }
                        const url = (data as any)?.url as string | undefined;
                        if (url) window.location.href = url;
                      });
                    }}
                    onView={() => {
                      recordEvent(l.id, "view");
                      const params = new URLSearchParams();
                      if (referralId) params.set("rid", referralId);
                      params.set("d", String(degreeParam || 1));
                      navigate(`/listings/${l.id}?${params.toString()}`);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Referral Chain Visualization */}
          {listing && (
            <div className="mt-8">
              <ReferralChainBuilder listingId={listing.id} />
            </div>
          )}
        </>
      )}
        </main>
      </SharedLayout>
    </CoursePageWithTracking>
  );
}
