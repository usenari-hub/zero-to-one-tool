import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SharedLayout } from "@/components/SharedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Share2, Trophy } from "lucide-react";

export default function PurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listing");
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    document.title = "Purchase Successful! | University of Bacon";
    
    // Hide confetti after animation
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SharedLayout>
      <main className="container max-w-4xl mx-auto py-16">
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0 animate-pulse">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                >
                  🥓
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--success))] text-white mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 className="font-display text-4xl text-[hsl(var(--brand-academic))] mb-4">
            Purchase Successful! 🎉
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Congratulations! Your payment has been processed and the seller will be in touch soon. 
            You've just earned your way through the University of Bacon network!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
                Payment Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your secure payment has been processed successfully
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5 text-[hsl(var(--primary))]" />
                Referral Chain Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bacon rewards are being distributed to the referral network
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-[hsl(var(--accent))]" />
                Seller Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The seller will contact you within 24 hours to arrange delivery
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="font-display text-2xl mb-4 text-white">What Happens Next?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white text-[hsl(var(--brand-academic))] font-bold flex items-center justify-center">1</div>
                <h3 className="font-semibold text-white">Seller Contact</h3>
              </div>
              <p className="text-sm opacity-90 text-white">
                The seller will receive your contact details and reach out to arrange the transaction
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white text-[hsl(var(--brand-academic))] font-bold flex items-center justify-center">2</div>
                <h3 className="font-semibold text-white">Secure Exchange</h3>
              </div>
              <p className="text-sm opacity-90 text-white">
                Complete the transaction safely using our recommended guidelines
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white text-[hsl(var(--brand-academic))] font-bold flex items-center justify-center">3</div>
                <h3 className="font-semibold text-white">Bacon Distribution</h3>
              </div>
              <p className="text-sm opacity-90 text-white">
                Referral rewards are automatically distributed to the network chain
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/listings">
                <ArrowRight className="mr-2 h-4 w-4" />
                Browse More Listings
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link to="/account">
                View My Account
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Questions? Contact our support team or check your account for transaction details.
          </p>
        </div>
      </main>
    </SharedLayout>
  );
}