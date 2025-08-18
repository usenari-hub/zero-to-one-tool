import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSelectorProps {
  amount: number;
  description: string;
  listingId?: string;
  paymentType: "listing_fee" | "premium_service" | "item_purchase";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentSelector = ({
  amount,
  description,
  listingId,
  paymentType,
  onSuccess,
  onCancel
}: PaymentSelectorProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStripePayment = async () => {
    try {
      setLoading("stripe");
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          description,
          listingId,
          paymentType
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Stripe",
          description: "Complete your payment in the new tab that just opened.",
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create Stripe payment",
      });
    } finally {
      setLoading(null);
    }
  };


  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'listing_fee':
        return 'Listing Fee';
      case 'premium_service':
        return 'Premium Service';
      case 'item_purchase':
        return 'Item Purchase';
      default:
        return 'Payment';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <DollarSign className="h-5 w-5" />
          {formatAmount(amount)}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <Badge variant="secondary" className="w-fit mx-auto">
          {getPaymentTypeLabel(paymentType)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Choose your preferred payment method:
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handleStripePayment}
            disabled={loading !== null}
            variant="outline"
            className="h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none hover:from-indigo-600 hover:to-purple-700"
          >
            {loading === "stripe" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            <div className="text-left">
              <div className="font-semibold">Pay with Stripe</div>
              <div className="text-sm opacity-90">Credit card, debit card</div>
            </div>
          </Button>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={loading !== null}
            className="w-full"
          >
            Cancel
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>✅ All transactions are processed securely</p>
        </div>
      </CardContent>
    </Card>
  );
};