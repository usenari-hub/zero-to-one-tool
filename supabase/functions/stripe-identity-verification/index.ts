import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-IDENTITY] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { action, verification_session_id } = await req.json();

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    if (action === "create_session") {
      // Create a new Stripe Identity verification session
      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: {
          user_id: user.id,
          email: user.email
        },
        return_url: `${req.headers.get("origin")}/account?verification=complete`,
      });

      logStep("Verification session created", { sessionId: verificationSession.id });

      // Update user verification record to track the session
      await supabaseClient
        .from('user_verifications')
        .update({
          stripe_verification_session_id: verificationSession.id,
          verification_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      return new Response(JSON.stringify({ 
        url: verificationSession.url,
        session_id: verificationSession.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "check_status" && verification_session_id) {
      // Check the status of an existing verification session
      const verificationSession = await stripe.identity.verificationSessions.retrieve(verification_session_id);
      
      logStep("Verification session retrieved", { 
        sessionId: verification_session_id, 
        status: verificationSession.status 
      });

      let identity_verified = false;
      let verification_status = 'pending';

      if (verificationSession.status === 'verified') {
        identity_verified = true;
        verification_status = 'verified';
      } else if (verificationSession.status === 'requires_input') {
        verification_status = 'requires_input';
      } else if (verificationSession.status === 'canceled') {
        verification_status = 'canceled';
      }

      // Update user verification record
      await supabaseClient
        .from('user_verifications')
        .update({
          identity_verified,
          verification_status,
          verification_data: {
            stripe_session: verificationSession,
            verified_at: identity_verified ? new Date().toISOString() : null
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      logStep("User verification updated", { identity_verified, verification_status });

      return new Response(JSON.stringify({
        status: verificationSession.status,
        identity_verified,
        verification_status
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-identity-verification", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});