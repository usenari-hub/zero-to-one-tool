import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, CheckCircle } from "lucide-react";

const PremiumPositioning = () => {
  const premiumFeatures = [
    "Priority listing placement",
    "Advanced analytics dashboard",
    "Custom sharing templates",
    "Dedicated account manager",
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            ✨ Premium Elite Status
            <Badge variant="secondary" className="bg-white/20 text-white">
              VIP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-2xl font-bold">5x</span>
                </div>
                <p className="text-sm opacity-90">Earnings Multiplier</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Premium Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumPositioning;