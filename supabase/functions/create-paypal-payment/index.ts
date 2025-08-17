import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYPAL-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { amount, currency = "USD", description, listingId, paymentType } = await req.json();
    if (!amount || amount <= 0) throw new Error("Valid amount is required");
    logStep("Payment details", { amount, currency, description, listingId, paymentType });

    // Get PayPal credentials
    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    // PayPal API base URL (use sandbox for testing, live for production)
    const PAYPAL_BASE_URL = "https://api-m.paypal.com"; // Use https://api-m.sandbox.paypal.com for testing

    // Get PayPal access token
    logStep("Getting PayPal access token");
    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: "grant_type=client_credentials"
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      logStep("PayPal auth failed", { status: authResponse.status, error: errorText });
      throw new Error(`PayPal authentication failed: ${errorText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    logStep("PayPal access token obtained");

    // Create PayPal order
    const origin = req.headers.get("origin") || "https://asxtdnlznhltawomnguo.supabase.co";
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          description: description || "Payment"
        }
      ],
      application_context: {
        return_url: `${origin}/payment-success?provider=paypal&type=${paymentType}${listingId ? `&listingId=${listingId}` : ''}`,
        cancel_url: `${origin}/payment-canceled?provider=paypal`,
        brand_name: "University of Bacon",
        landing_page: "BILLING",
        user_action: "PAY_NOW"
      }
    };

    logStep("Creating PayPal order", orderData);
    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      logStep("PayPal order creation failed", { status: orderResponse.status, error: errorText });
      throw new Error(`PayPal order creation failed: ${errorText}`);
    }

    const order = await orderResponse.json();
    logStep("PayPal order created", { orderId: order.id });

    // Find the approval URL
    const approvalUrl = order.links?.find((link: any) => link.rel === "approve")?.href;
    if (!approvalUrl) {
      throw new Error("No approval URL found in PayPal response");
    }

    // Store payment info in database for tracking
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert payment record
    const { error: insertError } = await supabaseService.from("escrow_transactions").insert({
      listing_id: listingId || null,
      buyer_id: user.id,
      seller_id: null, // Will be set later when we know the seller
      amount: parseFloat(amount),
      status: "pending",
      paypal_order_id: order.id,
      metadata: {
        payment_type: paymentType,
        currency: currency,
        description: description
      }
    });

    if (insertError) {
      logStep("Database insert error", insertError);
      // Continue anyway, don't fail the payment
    }

    logStep("Payment process completed successfully", { approvalUrl });
    return new Response(JSON.stringify({ 
      url: approvalUrl, 
      orderId: order.id,
      provider: "paypal"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-paypal-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});