import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient_email, amount, currency, note, transaction_id } = await req.json();

    // PayPal API credentials from environment
    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    const baseURL = Deno.env.get("PAYPAL_BASE_URL") || "https://api-m.sandbox.paypal.com"; // Use sandbox for testing

    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    // Get PayPal access token
    const authResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate with PayPal");
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Create payout batch
    const payoutData = {
      sender_batch_header: {
        sender_batch_id: `UOB_${transaction_id}_${Date.now()}`,
        email_subject: "You have received a payment from University of Bacon",
        email_message: "Thank you for your participation in the University of Bacon ecosystem!"
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount.toFixed(2),
            currency: currency || "USD"
          },
          note: note || "University of Bacon earnings payout",
          sender_item_id: transaction_id,
          receiver: recipient_email
        }
      ]
    };

    // Send payout request
    const payoutResponse = await fetch(`${baseURL}/v1/payments/payouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payoutData),
    });

    if (!payoutResponse.ok) {
      const errorData = await payoutResponse.json();
      console.error("PayPal payout error:", errorData);
      throw new Error(`PayPal payout failed: ${errorData.message || 'Unknown error'}`);
    }

    const payoutResult = await payoutResponse.json();

    return new Response(JSON.stringify({
      success: true,
      payout_batch_id: payoutResult.batch_header.payout_batch_id,
      batch_status: payoutResult.batch_header.batch_status,
      transaction_id: transaction_id,
      amount: amount,
      recipient: recipient_email
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("PayPal payout error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});