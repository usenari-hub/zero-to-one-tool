import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SharedLayout } from "@/components/SharedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";

export default function PurchaseCanceled() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listing");

  useEffect(() => {
    document.title = "Purchase Canceled | University of Bacon";
  }, []);

  return (
    <SharedLayout>
      <main className="container max-w-4xl mx-auto py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 mb-6">
            <XCircle className="w-10 h-10" />
          </div>
          
          <h1 className="font-display text-4xl text-[hsl(var(--brand-academic))] mb-4">
            Purchase Canceled
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No worries! Your payment was not processed. You can try again anytime or 
            explore other amazing listings in our course catalog.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5 text-orange-500" />
                No Charges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your payment method was not charged
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 text-[hsl(var(--primary))]" />
                Try Again
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The listing is still available for purchase
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5 text-[hsl(var(--accent))]" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Contact support if you experienced any issues
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-2xl p-8 text-center mb-8">
          <h2 className="font-display text-2xl text-[hsl(var(--brand-academic))] mb-4">
            Common Reasons for Cancellation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">💳 Payment Issues</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Insufficient funds</li>
                <li>• Expired card information</li>
                <li>• Bank security restrictions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">🤔 Second Thoughts</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Changed your mind</li>
                <li>• Want to explore more options</li>
                <li>• Need more time to decide</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {listingId && (
              <Button variant="hero" size="lg" asChild>
                <Link to={`/listings/${listingId}`}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Purchase Again
                </Link>
              </Button>
            )}
            
            <Button variant="outline" size="lg" asChild>
              <Link to="/listings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse All Listings
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Remember: Every listing you share earns bacon, even if you don't buy it yourself!
          </p>
        </div>
      </main>
    </SharedLayout>
  );
}