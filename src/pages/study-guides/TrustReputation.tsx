import { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import guide04Image from '@/assets/curriculum/guide-04-trust-reputation.jpg';
import baconLogo from '@/assets/crest-bacon.svg';

export default function TrustReputation() {
  useEffect(() => {
    document.title = 'Trust & Reputation - Building Your Anonymous Bacon Brand | University of Bacon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Establish credibility through platform systems while maintaining anonymity. Learn verification strategies and anonymous reputation building.');
    }
  }, []);

  return (
    <SharedLayout>
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={guide04Image} 
            alt="Trust & Reputation Guide"
            className="w-full h-64 object-cover rounded-lg shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={baconLogo} alt="Bacon Logo" className="h-8 w-8" />
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Guide 04
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
              Trust & Reputation
            </h1>
            <p className="text-lg text-muted-foreground">
              Building Your Anonymous Bacon Brand Through Platform Systems
            </p>
          </div>
        </div>

        {/* Verification Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Verification Strategies: Building Trust Through Platform Systems
            </CardTitle>
            <CardDescription>
              Establish credibility while maintaining complete anonymity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Required Verifications:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Government ID verification:</strong> Required for payout eligibility and trust score</li>
                  <li>• <strong>Phone verification:</strong> Enables secure communication through platform</li>
                  <li>• <strong>Email verification:</strong> Professional email preferred for platform communications</li>
                  <li>• <strong>Payment verification:</strong> Bank account verification for bacon withdrawals</li>
                  <li>• <strong>Address verification:</strong> For location-based trust without revealing identity</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">Anonymous Trust Building:</h4>
                <div className="space-y-2 text-sm text-purple-700">
                  <p>✓ Platform handles all identity verification</p>
                  <p>✓ Listings show "Verified Seller" status without personal details</p>
                  <p>✓ Trust scores visible without revealing personal information</p>
                  <p>✓ Anonymous messaging system maintains privacy</p>
                  <p>✓ Platform guarantees protect both buyers and sellers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Anonymous Reputation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Building Your Anonymous Reputation Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Reputation Building Tactics:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Transaction excellence:</strong> Perfect delivery of promised items</li>
                    <li>• <strong>Communication quality:</strong> Professional, prompt responses through platform</li>
                    <li>• <strong>Honest descriptions:</strong> Accurate condition reports build long-term trust</li>
                    <li>• <strong>Problem resolution:</strong> Handle issues quickly through platform mediation</li>
                    <li>• <strong>Platform compliance:</strong> Follow all rules and guidelines consistently</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Anonymous Reputation Timeline:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs min-w-fit">Week 1-2</Badge>
                      <p className="text-sm">Complete verifications, first 3 perfect transactions</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs min-w-fit">Month 1</Badge>
                      <p className="text-sm">Establish high rating with 10+ successful anonymous sales</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs min-w-fit">Month 2-3</Badge>
                      <p className="text-sm">Build review volume while maintaining anonymity</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs min-w-fit">Month 4+</Badge>
                      <p className="text-sm">Become trusted anonymous seller with premium status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Handling Disputes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Handling Disputes While Maintaining Anonymity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Dispute Resolution Framework:</h3>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li><strong>Listen actively:</strong> Understand the real concern</li>
                    <li><strong>Acknowledge issue:</strong> Validate their frustration</li>
                    <li><strong>Offer solutions:</strong> Multiple options when possible</li>
                    <li><strong>Follow through:</strong> Do exactly what you promise</li>
                    <li><strong>Follow up:</strong> Ensure satisfaction after resolution</li>
                  </ol>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3">Anonymous Dispute Handling:</h4>
                  <div className="space-y-2 text-sm text-orange-700">
                    <p>• Platform mediation: All dispute resolution goes through University of Bacon</p>
                    <p>• Documentation: Platform maintains records without exposing identity</p>
                    <p>• Professional communication: Anonymous but respectful interaction</p>
                    <p>• Solution focus: Offer remedies through platform systems</p>
                    <p>• Privacy protection: Never reveal personal information during disputes</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Trust Tactics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Anonymous Trust Tactics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Professional Photography</h4>
                  <p className="text-sm text-muted-foreground">High-quality images without personal identifiers build credibility</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Detailed Descriptions</h4>
                  <p className="text-sm text-muted-foreground">Over-communicate about items without revealing personal details</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Platform Compliance</h4>
                  <p className="text-sm text-muted-foreground">Perfect adherence to University of Bacon guidelines</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Consistent Quality</h4>
                  <p className="text-sm text-muted-foreground">Same high standards for every anonymous transaction</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card>
          <CardHeader>
            <CardTitle>Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">• <strong>Platform verification replaces personal reputation</strong> in anonymous system</p>
              <p className="text-sm">• <strong>Trust scores work without revealing identity</strong> - verified but private</p>
              <p className="text-sm">• <strong>Anonymous doesn't mean unaccountable</strong> - platform tracks all interactions</p>
              <p className="text-sm">• <strong>Charity donation system</strong> adds credibility and social responsibility</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link to="/study-guides/chain-building">← Previous: Chain Building</Link>
          </Button>
          <Button asChild>
            <Link to="/study-guides/profit-maximization">Next: Profit Maximization →</Link>
          </Button>
        </div>
      </div>
    </SharedLayout>
  );
}