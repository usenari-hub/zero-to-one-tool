import { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Heart, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import guide05Image from '@/assets/curriculum/guide-05-profit-maximization.jpg';
import baconLogo from '@/assets/crest-bacon.svg';

export default function ProfitMaximization() {
  useEffect(() => {
    document.title = 'Profit Maximization - Advanced Anonymous Bacon Strategies | University of Bacon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Elite techniques for maximizing earnings within the corrected referral system. Focus on degree 1 earnings and portfolio optimization.');
    }
  }, []);

  return (
    <SharedLayout>
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={guide05Image} 
            alt="Profit Maximization Guide"
            className="w-full h-64 object-cover rounded-lg shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={baconLogo} alt="Bacon Logo" className="h-8 w-8" />
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Guide 05
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
              Profit Maximization
            </h1>
            <p className="text-lg text-muted-foreground">
              Elite Anonymous Bacon Strategies for Maximum Earnings
            </p>
          </div>
        </div>

        {/* Optimizing for Degree 1 Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Optimizing for Degree 1 Earnings (50% Focus)
            </CardTitle>
            <CardDescription>
              Better to earn 50% once than 5% ten times - focus on direct referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Degree 1 Strategy Framework:</h3>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li><strong>Identify power connectors:</strong> Who in your network can drive immediate sales?</li>
                  <li><strong>Match items to contacts:</strong> Right product to right person at right time</li>
                  <li><strong>Direct outreach:</strong> Personal messages to degree 1 prospects</li>
                  <li><strong>Conversion focus:</strong> Help them close the sale rather than just share</li>
                  <li><strong>Relationship building:</strong> Cultivate repeat degree 1 referrers</li>
                </ol>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Direct Referral Benefits:</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>• <strong>50% earnings</strong> vs. 5% at degree 5</p>
                  <p>• <strong>Direct control</strong> over conversion process</p>
                  <p>• <strong>Stronger relationships</strong> with immediate contacts</p>
                  <p>• <strong>Faster transactions</strong> with less chain complexity</p>
                  <p>• <strong>Higher success rates</strong> due to personal connection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Portfolio Strategy for Maximum Bacon Pool Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Portfolio Optimization Strategy:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>High-value focus:</strong> Items $500+ create larger bacon pools</li>
                    <li>• <strong>Optimal bacon percentages:</strong> 25-30% creates best balance</li>
                    <li>• <strong>Category expertise:</strong> Become known for specific quality items</li>
                    <li>• <strong>Anonymous branding:</strong> Build reputation within item categories</li>
                    <li>• <strong>Seasonal positioning:</strong> Time listings for maximum degree 1 potential</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Optimal Portfolio Mix:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High-value items ($500+)</span>
                      <Badge variant="default">60%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium-value quick-sell</span>
                      <Badge variant="secondary">25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Test items/new categories</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charity Angle Marketing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Leveraging the Charity Angle for Marketing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Social Good Messaging:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Transparent impact:</strong> "Unfilled degrees support student and environmental causes"</li>
                  <li>• <strong>Authentic motivation:</strong> Share because it helps causes you care about</li>
                  <li>• <strong>Clear explanation:</strong> Exactly how the charity system works</li>
                  <li>• <strong>Community building:</strong> Connect with others who value social impact</li>
                  <li>• <strong>Marketing angle:</strong> "Shopping that gives back automatically"</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
                <h4 className="font-semibold text-pink-800 mb-3">Charity System Benefits:</h4>
                <div className="space-y-2 text-sm text-pink-700">
                  <p>✓ Prevents gaming of the referral system</p>
                  <p>✓ Creates authentic social good messaging</p>
                  <p>✓ Motivates sharing even at lower degrees</p>
                  <p>✓ Builds community around positive impact</p>
                  <p>✓ Differentiates from pure profit-focused platforms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elite Anonymous Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Elite Anonymous Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Category Domination</h4>
                  <p className="text-sm text-muted-foreground">Become the go-to anonymous seller for specific items like electronics or luxury goods</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Degree 1 Relationship Building</h4>
                  <p className="text-sm text-muted-foreground">Cultivate a network of direct referrers who consistently drive sales</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Platform Optimization</h4>
                  <p className="text-sm text-muted-foreground">Use University of Bacon tools for maximum visibility and trust</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Social Impact Marketing</h4>
                  <p className="text-sm text-muted-foreground">Leverage charity angle for authentic promotion and community building</p>
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
              <p className="text-sm">• <strong>Focus heavily on degree 1 conversions</strong> - 50% vs. diminishing returns on longer chains</p>
              <p className="text-sm">• <strong>Higher bacon percentages</strong> (25-30%) create win-win scenarios for all participants</p>
              <p className="text-sm">• <strong>Charity system</strong> provides authentic marketing angle and prevents gaming</p>
              <p className="text-sm">• <strong>Anonymous quality branding</strong> builds trust without personal exposure</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link to="/curriculum/trust-reputation">← Previous: Trust & Reputation</Link>
          </Button>
          <Button asChild>
            <Link to="/curriculum/data-driven-success">Next: Data-Driven Success →</Link>
          </Button>
        </div>
      </div>
    </SharedLayout>
  );
}