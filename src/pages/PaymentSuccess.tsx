import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Home, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const provider = searchParams.get("provider") || "stripe";
  const paymentType = searchParams.get("type") || "payment";
  const listingId = searchParams.get("listingId");
  const sessionId = searchParams.get("session_id"); // Stripe
  const paymentId = searchParams.get("paymentId"); // PayPal
  const payerId = searchParams.get("PayerID"); // PayPal

  useEffect(() => {
    document.title = "Payment Successful | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Your payment has been processed successfully.");
  }, []);

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (provider === "paypal" && paymentId) {
          // Capture PayPal payment
          const { data, error } = await supabase.functions.invoke('capture-paypal-payment', {
            body: { orderId: paymentId }
          });

          if (error) throw error;
          setPaymentDetails(data);
        } else if (provider === "stripe" && sessionId) {
          // Stripe payments are automatically captured
          setPaymentDetails({ provider: "stripe", sessionId });
        }

        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
        });
      } catch (error) {
        console.error("Payment processing error:", error);
        toast({
          variant: "destructive",
          title: "Payment Processing Error",
          description: "There was an issue processing your payment. Please contact support.",
        });
      } finally {
        setProcessing(false);
      }
    };

    if (sessionId || paymentId) {
      processPayment();
    } else {
      setProcessing(false);
    }
  }, [provider, sessionId, paymentId, toast]);

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'listing_fee':
        return 'Listing Fee Payment';
      case 'premium_service':
        return 'Premium Service Payment';
      case 'item_purchase':
        return 'Item Purchase';
      default:
        return 'Payment';
    }
  };

  const getProviderName = (provider: string) => {
    return provider === "paypal" ? "PayPal" : "Stripe";
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleViewAccount = () => {
    navigate("/account");
  };

  if (processing) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <CardTitle>Processing Payment</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
        <div className="container text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-3xl md:text-4xl text-foreground">Payment Successful!</h1>
          <p className="mt-2 text-muted-foreground">Your transaction has been completed successfully.</p>
        </div>
      </section>

      <section className="container py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      {getProviderName(provider)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Type</label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {getPaymentTypeLabel(paymentType)}
                    </Badge>
                  </div>
                </div>
              </div>

              {sessionId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <div className="mt-1 font-mono text-sm bg-muted p-2 rounded">
                    {sessionId}
                  </div>
                </div>
              )}

              {paymentId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">PayPal Order ID</label>
                  <div className="mt-1 font-mono text-sm bg-muted p-2 rounded">
                    {paymentId}
                  </div>
                </div>
              )}

              {listingId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Related Listing</label>
                  <div className="mt-1">
                    <Link 
                      to={`/listing/${listingId}`}
                      className="text-primary hover:underline font-mono text-sm"
                    >
                      View Listing
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              A confirmation email will be sent to your registered email address.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={handleNavigateHome} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              <Button variant="outline" onClick={handleViewAccount} className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                View Account
              </Button>
            </div>
          </div>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="text-center text-green-700 dark:text-green-300">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="text-sm space-y-1">
                  {paymentType === 'listing_fee' && (
                    <li>✅ Your listing has been activated and is now visible to buyers</li>
                  )}
                  {paymentType === 'premium_service' && (
                    <li>✅ Your premium features have been enabled</li>
                  )}
                  {paymentType === 'item_purchase' && (
                    <li>✅ The seller has been notified of your purchase</li>
                  )}
                  <li>📧 You'll receive email confirmation shortly</li>
                  <li>💰 Any referral Bacon earnings will be credited to your account</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccess;