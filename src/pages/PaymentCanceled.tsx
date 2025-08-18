import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, Home, ArrowLeft } from "lucide-react";

const PaymentCanceled = () => {
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider") || "unknown";

  useEffect(() => {
    document.title = "Payment Canceled | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Your payment was canceled. You can try again anytime.");
  }, []);

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "stripe":
        return "Stripe";
      default:
        return "Payment Provider";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-to-b from-destructive/5 to-background py-12 md:py-16">
        <div className="container text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-3xl md:text-4xl text-foreground">Payment Canceled</h1>
          <p className="mt-2 text-muted-foreground">Your payment was canceled and no charges were made.</p>
        </div>
      </section>

      <section className="container py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What Happened?</CardTitle>
              <CardDescription>
                Your {getProviderName(provider)} payment was canceled or interrupted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  Payment Canceled
                </Badge>
                <Badge variant="outline">
                  {getProviderName(provider)}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• No charges were made to your account</p>
                <p>• You can try the payment again anytime</p>
                <p>• Your listing or purchase is still pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center text-blue-700 dark:text-blue-300">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm mb-4">
                  If you're experiencing issues with payments, here are some common solutions:
                </p>
                <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
                  <li>• Check that your payment method has sufficient funds</li>
                  <li>• Verify your billing address is correct</li>
                  <li>• Try a different payment method</li>
                  <li>• Ensure your browser allows pop-ups from our site</li>
                  <li>• Contact your bank if the payment is being declined</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <div className="flex gap-4 justify-center">
              <Button asChild className="flex items-center gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Try Again
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              If you continue to have issues, please{" "}
              <Link to="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentCanceled;