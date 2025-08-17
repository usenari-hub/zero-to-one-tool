
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type MetricsResponse = {
  metrics: Record<string, { views: number; shares: number; buys: number; score: number }>;
  hot?: string[];
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !serviceRole) {
      return new Response(JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRole);

    const body = (await req.json().catch(() => ({}))) as {
      mode?: "hot" | "metricsByListingIds";
      listingIds?: string[];
      timeframeDays?: number;
      limit?: number;
    };

    const mode = body.mode || "hot";
    const timeframeDays = Math.max(1, Math.min(30, Number(body.timeframeDays || 7)));
    const sinceIso = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000).toISOString();
    const limit = Math.max(1, Math.min(50, Number(body.limit || 12)));

    const computeMetrics = (rows: Array<{ listing_id: string; event_type: string }>) => {
      const metrics: Record<string, { views: number; shares: number; buys: number; score: number }> = {};
      for (const r of rows) {
        const id = r.listing_id;
        if (!metrics[id]) metrics[id] = { views: 0, shares: 0, buys: 0, score: 0 };
        if (r.event_type === "view") metrics[id].views += 1;
        if (r.event_type === "share") metrics[id].shares += 1;
        if (r.event_type === "buy") metrics[id].buys += 1;
      }
      for (const id of Object.keys(metrics)) {
        const m = metrics[id];
        // simple scoring: views=1, shares=5, buys=30 with mild decay by timeframe
        const decay = 1 - Math.min(0.6, (timeframeDays - 1) * 0.05);
        m.score = Math.round((m.views * 1 + m.shares * 5 + m.buys * 30) * decay);
      }
      return metrics;
    };

    if (mode === "metricsByListingIds") {
      const ids = Array.isArray(body.listingIds) ? body.listingIds.filter(Boolean) : [];
      if (ids.length === 0) {
        return new Response(JSON.stringify({ metrics: {} } satisfies MetricsResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const { data, error } = await supabase
        .from("listing_events")
        .select("listing_id,event_type")
        .in("listing_id", ids)
        .gte("created_at", sinceIso);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      const metrics = computeMetrics(data || []);
      return new Response(JSON.stringify({ metrics } satisfies MetricsResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // mode === "hot"
    // 1) fetch active listings
    const { data: listings, error: listingsErr } = await supabase
      .from("listings")
      .select("id, status, ends_at, created_at")
      .or("status.eq.active,status.is.null");

    if (listingsErr) {
      return new Response(JSON.stringify({ error: listingsErr.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const nowIso = new Date().toISOString();
    const activeIds = (listings || [])
      .filter((l) => !l.ends_at || l.ends_at > nowIso)
      .map((l) => l.id);

    if (activeIds.length === 0) {
      return new Response(JSON.stringify({ metrics: {}, hot: [] } satisfies MetricsResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 2) fetch recent events for those listings
    const { data: events, error: eventsErr } = await supabase
      .from("listing_events")
      .select("listing_id,event_type")
      .in("listing_id", activeIds)
      .gte("created_at", sinceIso);

    if (eventsErr) {
      return new Response(JSON.stringify({ error: eventsErr.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // 3) compute metrics and return top
    const metrics = computeMetrics(events || []);
    const hot = Object.entries(metrics)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit)
      .map(([id]) => id);

    return new Response(JSON.stringify({ metrics, hot } satisfies MetricsResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
