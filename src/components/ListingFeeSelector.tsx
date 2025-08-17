import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentSelector } from "./PaymentSelector";
import { Star, Zap, Crown, Rocket } from "lucide-react";

interface ListingFeeSelectorProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ListingFeeSelector = ({ onSuccess, onCancel }: ListingFeeSelectorProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: "basic",
      name: "Basic Listing",
      price: 5,
      icon: Star,
      description: "Standard listing visibility",
      features: [
        "7-day listing duration",
        "Standard search placement",
        "Basic photo uploads (up to 3)",
        "Standard support"
      ]
    },
    {
      id: "enhanced",
      name: "Enhanced Listing",
      price: 25,
      icon: Zap,
      description: "Better visibility and features",
      features: [
        "14-day listing duration",
        "Enhanced search placement",
        "Photo uploads (up to 8)",
        "Featured badge",
        "Priority support"
      ],
      popular: true
    },
    {
      id: "premium",
      name: "Premium Listing",
      price: 35,
      icon: Crown,
      description: "Maximum visibility and reach",
      features: [
        "21-day listing duration",
        "Premium search placement",
        "Unlimited photo uploads",
        "Featured & premium badges",
        "Homepage featured spot",
        "Dedicated support"
      ]
    },
    {
      id: "ultimate",
      name: "Ultimate Listing",
      price: 75,
      icon: Rocket,
      description: "Complete marketing package",
      features: [
        "30-day listing duration",
        "Top search placement",
        "Unlimited photo & video uploads",
        "All premium badges",
        "Homepage hero placement",
        "Social media promotion",
        "Dedicated account manager",
        "Viral sharing boost"
      ]
    }
  ];

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleGoBack = () => {
    setSelectedPackage(null);
  };

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  if (selectedPackage && selectedPkg) {
    return (
      <PaymentSelector
        amount={selectedPkg.price}
        description={`${selectedPkg.name} - ${selectedPkg.description}`}
        paymentType="listing_fee"
        onSuccess={() => {
          setSelectedPackage(null);
          onSuccess?.();
        }}
        onCancel={handleGoBack}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold">Choose Your Listing Package</h2>
        <p className="text-muted-foreground mt-2">
          Select the perfect package to maximize your listing's visibility
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const IconComponent = pkg.icon;
          return (
            <Card 
              key={pkg.id} 
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                pkg.popular ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectPackage(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 p-2 bg-primary/10 rounded-full w-fit">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  ${pkg.price}
                </div>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-4"
                  variant={pkg.popular ? "default" : "outline"}
                >
                  Select {pkg.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {onCancel && (
        <div className="text-center">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};