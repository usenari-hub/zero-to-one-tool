import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";

  const origin = req.headers.get("origin") || "https://edca37e7-8ba2-4fa9-a2c7-9ed875536515.lovableproject.com";

  try {
    if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let userEmail: string | undefined = undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userEmail = data.user?.email ?? undefined;
    }

    // Fallback to guest checkout email if no authenticated user
    const emailForCheckout = userEmail || "guest@example.com";

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Try to reuse an existing customer
    let customerId: string | undefined = undefined;
    try {
      const customers = await stripe.customers.list({ email: emailForCheckout, limit: 1 });
      if (customers.data.length > 0) customerId = customers.data[0].id;
    } catch (_) {
      // ignore; we can proceed without an existing customer
    }

    // Dynamic payload support
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const amount = Math.max(50, Number(body.amount) || 0); // cents
    const currency = (body.currency as string) || "usd";
    const itemName = (body.item_name as string) || "Listing Purchase";
    const listingId = (body.listing_id as string) || undefined;
    const referralId = (body.referral_id as string) || undefined;
    const successPath = (body.successPath as string) || "/payment-success";
    const cancelPath = (body.cancelPath as string) || "/payment-canceled";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : emailForCheckout,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: itemName },
            unit_amount: amount || 499,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
      metadata: {
        listing_id: listingId || "",
        referral_id: referralId || "",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
