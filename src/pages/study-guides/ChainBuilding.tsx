import { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Network, MessageSquare, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import guide03Image from '@/assets/curriculum/guide-03-chain-building.jpg';
import baconLogo from '@/assets/crest-bacon.svg';

export default function ChainBuilding() {
  useEffect(() => {
    document.title = 'Chain Building 301 - Scaling Your Referral Network | University of Bacon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how to build and manage profitable 6-degree referral chains with corrected earning structure. Master partner identification and chain management.');
    }
  }, []);

  return (
    <SharedLayout>
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={guide03Image} 
            alt="Chain Building Guide"
            className="w-full h-64 object-cover rounded-lg shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={baconLogo} alt="Bacon Logo" className="h-8 w-8" />
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Guide 03
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
              Chain Building 301
            </h1>
            <p className="text-lg text-muted-foreground">
              Scaling Your Referral Network with Strategic Partner Management
            </p>
          </div>
        </div>

        {/* High-Value Referral Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Identifying High-Value Referral Partners for Degree 1 Positions
            </CardTitle>
            <CardDescription>
              Focus on partners who can drive immediate sales for maximum 50% bacon earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Partner Types to Target:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Direct influencers:</strong> People with engaged audiences who can drive immediate sales</li>
                  <li>• <strong>Industry experts:</strong> Connections in relevant fields who can make credible recommendations</li>
                  <li>• <strong>Local connectors:</strong> People with strong community ties for location-based items</li>
                  <li>• <strong>Platform specialists:</strong> Users dominant on specific social media platforms</li>
                  <li>• <strong>Trust network:</strong> People whose recommendations carry weight with their circles</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Partner Evaluation for Degree 1 Focus:</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>✓ Conversion potential: Can they directly drive a sale?</p>
                  <p>✓ Network quality: Do their connections have buying power?</p>
                  <p>✓ Trust factor: How much do people trust their recommendations?</p>
                  <p>✓ Activity level: Regular social media/networking presence</p>
                  <p>✓ Alignment: Their audience matches your item categories</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Degree-Specific Share Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Creating Degree-Specific Share Messages
            </CardTitle>
            <CardDescription>
              Since earnings decrease by degree, tailor messages to maximize degree 1 conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Degree 1 Focus Message:</h4>
                <div className="bg-white p-3 rounded text-sm font-mono">
                  <p>🎯 DIRECT EARNING OPPORTUNITY - 50% Bacon Pool!</p>
                  <br />
                  <p>Found: [ITEM] - exactly what [TARGET] needs.</p>
                  <br />
                  <p>Here's the game-changer: If someone in your network buys this through your share, you earn 50% of the $[X] bacon pool = $[Y]!</p>
                  <br />
                  <p>University of Bacon's anonymous marketplace means:</p>
                  <p>✅ Safe, verified transactions</p>
                  <p>✅ Highest earnings for direct referrals</p>
                  <p>✅ Charitable donations for unfilled degrees</p>
                  <p>✅ No risk - earnings only on actual sales</p>
                  <br />
                  <p>[Your tracking link]</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Chain Extension Message (Degrees 2-6):</h4>
                <div className="bg-white p-3 rounded text-sm font-mono">
                  <p>💰 Still Earning Opportunity!</p>
                  <br />
                  <p>Someone in my network shared this [ITEM] with me. Even though I'm not the direct referrer, I can still earn by sharing!</p>
                  <br />
                  <p>Degree 2: 25% of bacon pool</p>
                  <p>Degree 3: 10% of bacon pool</p>
                  <p>Degree 4: 7.5% of bacon pool</p>
                  <p>Degree 5: 5% of bacon pool</p>
                  <p>Degree 6: 2.5% of bacon pool</p>
                  <br />
                  <p>Plus: Any unclaimed degrees go to student and environmental charities!</p>
                  <br />
                  <p>[Your tracking link]</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Multiple Chains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Managing Multiple Chains Without Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Management Strategies:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Degree tracking:</strong> Know your position in each chain</li>
                  <li>• <strong>Partner communication:</strong> Keep degree 1 referrers informed of performance</li>
                  <li>• <strong>Conflict prevention:</strong> Clear understanding that closer = higher earnings</li>
                  <li>• <strong>Performance optimization:</strong> Focus effort on degree 1 opportunities</li>
                  <li>• <strong>Charitable impact:</strong> Promote the social good aspect of unfilled degrees</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Chain Management System:</h4>
                <div className="space-y-2 text-sm">
                  <p>1. <strong>Primary referrers:</strong> Your direct connections (Degree 1)</p>
                  <p>2. <strong>Secondary network:</strong> Their connections (Degree 2)</p>
                  <p>3. <strong>Extended reach:</strong> Degrees 3-6 tracking</p>
                  <p>4. <strong>Performance metrics:</strong> Clicks, conversions, earnings per chain</p>
                  <p>5. <strong>Optimization opportunities:</strong> Where to focus effort</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Chain Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Advanced Chain Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Degree 1 Cultivation</h4>
                  <p className="text-sm text-muted-foreground">Build relationships with potential direct referrers for maximum 50% earnings</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Platform Education</h4>
                  <p className="text-sm text-muted-foreground">Teach referrers how the corrected system works and why proximity matters</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Performance Tracking</h4>
                  <p className="text-sm text-muted-foreground">Monitor which chains reach sales vs. which stall at certain degrees</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Charitable Promotion</h4>
                  <p className="text-sm text-muted-foreground">Use social good angle to motivate sharing even at lower degrees</p>
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
              <p className="text-sm">• <strong>Prioritize degree 1 referrals</strong> - 50% earnings vs. 5% at degree 5</p>
              <p className="text-sm">• <strong>Charity angle prevents gaming</strong> - no incentive to create fake degrees</p>
              <p className="text-sm">• <strong>Clear earning structure</strong> motivates honest referral behavior</p>
              <p className="text-sm">• <strong>Anonymous system</strong> protects privacy while building trust through platform</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link to="/study-guides/listing-mastery">← Previous: Listing Mastery</Link>
          </Button>
          <Button asChild>
            <Link to="/study-guides/trust-reputation">Next: Trust & Reputation →</Link>
          </Button>
        </div>
      </div>
    </SharedLayout>
  );
}