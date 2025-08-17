
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ListingCard, type Listing } from "@/components/ListingCard";
import { SharedLayout } from "@/components/SharedLayout";
import { CreateListingModal } from "@/components/CreateListingModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";

function formatMoney(value?: number | null) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function ListingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const referralId = searchParams.get("rid");
  const degreeParam = Number(searchParams.get("d") || "1");

  const fetchListings = useCallback(async () => {
    setLoading(true);
  const { data, error } = await supabase
    .from("listings")
    .select("id,item_title,item_description,asking_price,reward_percentage,max_degrees,general_location,seller_rating,created_at,ends_at,verification_level,item_images,department")
    .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load listings", description: error.message });
    }
    setListings((data as any) || []);
    setLoading(false);
  }, []);

  // Simple telemetry helper
  const recordEvent = useCallback(async (listingId: string, event_type: "view" | "share" | "buy") => {
    console.log("recordEvent", listingId, event_type, { referralId });
    const { error } = await supabase.from("listing_events").insert({
      listing_id: listingId,
      referral_id: referralId,
      event_type,
    } as any);
    if (error) console.warn("Failed to record event", error.message);
  }, [referralId]);

  // Fetch hot metrics (scores) for highlighting
  const [hotIds, setHotIds] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Record<string, { views: number; shares: number; buys: number; score: number }>>({});

  const fetchHot = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("listing-metrics", {
      body: { mode: "hot", timeframeDays: 7, limit: 12 },
    });
    if (error) {
      console.warn("listing-metrics error", error.message);
      return;
    }
    const d = (data || {}) as any;
    setHotIds(d.hot || []);
    setMetrics(d.metrics || {});
  }, []);

  useEffect(() => {
    document.title = "Listings – University of Bacon";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Browse anonymous course listings by department. View details, share with your network, or buy securely.");
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Browse anonymous course listings by department. View details, share with your network, or buy securely.";
      document.head.appendChild(m);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    fetchHot();
  }, [fetchHot]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) =>
      [l.item_title, l.item_description, l.general_location].some((v) => (v ?? "").toLowerCase().includes(q))
    );
  }, [listings, query]);

  // naive ‘department’ bucketing using keywords, until a column exists
  const buckets = useMemo(() => {
    const groups: Record<string, Listing[]> = {};
    filtered.forEach((l) => {
      const dept = l.department || "General";
      groups[dept] = groups[dept] || [];
      groups[dept].push(l);
    });
    return groups;
  }, [filtered]);

  // Derived featured sections
  const hotListings = useMemo(() => {
    const byId = new Map(listings.map((l) => [l.id, l]));
    return hotIds.map((id) => byId.get(id)).filter(Boolean) as Listing[];
  }, [hotIds, listings]);

  const newThisWeek = useMemo(() => {
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return filtered.filter((l) => new Date(l.created_at).getTime() >= since).slice(0, 6);
  }, [filtered]);

  const highRewards = useMemo(() => {
    return filtered
      .filter((l) => Number(l.reward_percentage ?? 0) >= 25)
      .sort((a, b) => Number(b.reward_percentage ?? 0) - Number(a.reward_percentage ?? 0))
      .slice(0, 6);
  }, [filtered]);

  const endingSoon = useMemo(() => {
    const now = Date.now();
    const in7 = now + 7 * 24 * 60 * 60 * 1000;
    return filtered
      .filter((l) => !!l.ends_at && new Date(l.ends_at as any).getTime() > now && new Date(l.ends_at as any).getTime() <= in7)
      .sort((a, b) => new Date(a.ends_at as any).getTime() - new Date(b.ends_at as any).getTime())
      .slice(0, 6);
  }, [filtered]);

  const handleView = (listing: Listing) => {
    // Record a view and navigate to dedicated details page
    recordEvent(listing.id, "view");
    const params = new URLSearchParams();
    if (referralId) params.set("rid", referralId);
    params.set("d", String((degreeParam || 1)));
    navigate(`/listings/${listing.id}?${params.toString()}`);
  };

  const buildShareText = (listing: Listing, url: string) => {
    const price = listing.asking_price ?? 0;
    const pool = Math.round(((listing.reward_percentage ?? 20) / 100) * Number(price));
    return `Know a buyer for this? ${listing.item_title} – Asking ${formatMoney(Number(price))}. ${formatMoney(pool)} referral pool. I\u2019ll split the bacon with you. ${url}`;
  };

  const handleShare = async (listing: Listing) => {
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
    const text = buildShareText(listing, url);

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

  const handleBuy = async (listing: Listing) => {
    const price = listing.asking_price;
    if (!price) {
      toast({ title: "Price unavailable", description: "This listing does not have a set price." });
      return;
    }
    const amountCents = Math.max(50, Math.round(Number(price) * 100));

    // Record buy intent for telemetry (does not reveal seller)
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
    <SharedLayout>
      <main className="container py-4 sm:py-6 lg:py-8">
      <header className="mb-4 sm:mb-6">
        <h1 className="font-display mobile-h2 text-[hsl(var(--brand-academic))]">Course Listings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Browse by department. Click a listing for details, share anonymously, or buy securely.</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Search listings" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="mobile-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Create Listing Card */}
          <div className="mb-6 sm:mb-8">
            <CreateListingModal onListingCreated={fetchListings} variant="card" />
          </div>

          {hotListings.length > 0 && (
            <section className="mb-6 sm:mb-8">
              <h2 className="font-display mobile-h3 text-foreground font-semibold">Hot Courses</h2>
              <div className="mt-3 mobile-grid">
                {hotListings.map((l) => (
                  <ListingCard key={l.id} listing={l} onShare={handleShare} onBuy={handleBuy} onView={handleView} className="listing-card" />
                ))}
              </div>
            </section>
          )}

          {newThisWeek.length > 0 && (
            <section className="mb-6 sm:mb-8">
              <h2 className="font-display mobile-h3 text-foreground font-semibold">New This Week</h2>
              <div className="mt-3 mobile-grid">
                {newThisWeek.map((l) => (
                  <ListingCard key={l.id} listing={l} onShare={handleShare} onBuy={handleBuy} onView={handleView} className="listing-card" />
                ))}
              </div>
            </section>
          )}

          {highRewards.length > 0 && (
            <section className="mb-6 sm:mb-8">
              <h2 className="font-display mobile-h3 text-foreground font-semibold">High Bacon Rewards</h2>
              <div className="mt-3 mobile-grid">
                {highRewards.map((l) => (
                  <ListingCard key={l.id} listing={l} onShare={handleShare} onBuy={handleBuy} onView={handleView} className="listing-card" />
                ))}
              </div>
            </section>
          )}

          {endingSoon.length > 0 && (
            <section className="mb-6 sm:mb-8">
              <h2 className="font-display mobile-h3 text-foreground font-semibold">Ending Soon</h2>
              <div className="mt-3 mobile-grid">
                {endingSoon.map((l) => (
                  <ListingCard key={l.id} listing={l} onShare={handleShare} onBuy={handleBuy} onView={handleView} className="listing-card" />
                ))}
              </div>
            </section>
          )}

          {Object.entries(buckets).map(([dept, items]) => (
            <section key={dept} className="mb-6 sm:mb-8">
              <h2 className="font-display mobile-h3 text-foreground font-semibold">{dept}</h2>
              <div className="mt-3 mobile-grid">
                {items.map((l) => (
                  <ListingCard key={l.id} listing={l} onShare={handleShare} onBuy={handleBuy} onView={handleView} className="listing-card" />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

        <footer className="mt-12 text-xs text-muted-foreground flex items-center gap-2">
          <Share2 className="h-3 w-3" /> Pro tip: Use the Share button to generate a personalized referral link. We track your chain anonymously.
        </footer>
      </main>
    </SharedLayout>
  );
}
