import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CAPTURE-PAYPAL-PAYMENT] ${step}${detailsStr}`);
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
    const { orderId } = await req.json();
    if (!orderId) throw new Error("PayPal order ID is required");
    logStep("Capturing PayPal order", { orderId });

    // Get PayPal credentials
    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    const PAYPAL_BASE_URL = "https://api-m.paypal.com";

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

    // Capture the order
    logStep("Capturing PayPal order");
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      logStep("PayPal capture failed", { status: captureResponse.status, error: errorText });
      throw new Error(`PayPal capture failed: ${errorText}`);
    }

    const captureData = await captureResponse.json();
    logStep("PayPal payment captured successfully", { captureId: captureData.id, status: captureData.status });

    // Update payment record in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: updateError } = await supabaseService
      .from("escrow_transactions")
      .update({
        status: captureData.status === "COMPLETED" ? "funded" : "failed",
        funded_at: captureData.status === "COMPLETED" ? new Date().toISOString() : null,
        metadata: {
          ...captureData,
          capture_id: captureData.id
        }
      })
      .eq("paypal_order_id", orderId);

    if (updateError) {
      logStep("Database update error", updateError);
      // Continue anyway, payment was successful
    }

    return new Response(JSON.stringify({ 
      success: true,
      status: captureData.status,
      captureId: captureData.id,
      provider: "paypal"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in capture-paypal-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});