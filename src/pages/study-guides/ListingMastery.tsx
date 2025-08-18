import { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import guide02Image from '@/assets/curriculum/guide-02-listing-mastery.jpg';
import baconLogo from '@/assets/crest-bacon.svg';

export default function ListingMastery() {
  useEffect(() => {
    document.title = 'Listing Mastery - Creating Irresistible Course Offerings | University of Bacon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Advanced techniques for creating anonymous listings that attract quality referrers. Master title optimization, description frameworks, and pricing psychology.');
    }
  }, []);

  return (
    <SharedLayout>
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={guide02Image} 
            alt="Listing Mastery Guide"
            className="w-full h-64 object-cover rounded-lg shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={baconLogo} alt="Bacon Logo" className="h-8 w-8" />
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Guide 02
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
              Listing Mastery
            </h1>
            <p className="text-lg text-muted-foreground">
              Creating Irresistible Course Offerings That Attract Quality Referrers
            </p>
          </div>
        </div>

        {/* Title Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Title Optimization: Using Buyer Psychology and SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Power Words That Convert:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Mint", "Rare", "Limited", "Authentic", "Professional", "Moving Sale", "Quick Sale", "This Weekend Only"].map((word) => (
                  <Badge key={word} variant="outline">{word}</Badge>
                ))}
              </div>
              
              <div className="bg-background p-4 rounded border">
                <h4 className="font-semibold text-brand-academic mb-2">Formula:</h4>
                <p className="text-sm mb-2">[BRAND] [MODEL] [CONDITION] - [KEY BENEFIT] - [LOCATION]</p>
                <p className="text-sm font-medium text-primary">Example: "Apple MacBook Pro 2019 Mint Condition - Perfect for Students - Dallas"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Description Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Anonymous Description Frameworks That Convert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-3">Essential Elements:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Hook:</strong> Start with most compelling benefit</li>
                    <li>• <strong>Honest story:</strong> Why you're selling (builds trust)</li>
                    <li>• <strong>Detailed specs:</strong> Every feature, accessories</li>
                    <li>• <strong>Platform trust:</strong> Verified seller status</li>
                    <li>• <strong>Scarcity/urgency:</strong> Limited time offers</li>
                    <li>• <strong>Clear earning opportunity:</strong> Referrer benefits</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Anonymous Listing Template:</h4>
                  <div className="text-xs space-y-2 font-mono">
                    <p>🔥 [COMPELLING HOOK ABOUT MAIN BENEFIT]</p>
                    <p>Selling my [ITEM] because [AUTHENTIC REASON]...</p>
                    <p>WHAT'S INCLUDED:</p>
                    <p>• [List everything in detail]</p>
                    <p>CONDITION: [Honest assessment]</p>
                    <p>💰 EARN BACON: Share this listing and the person closest to the buyer earns 50% of the $[X] bacon pool!</p>
                    <p>Platform-verified seller ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Psychology */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pricing Psychology: Creating Optimal Bacon Pools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Key Strategies:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Bacon pool optimization:</strong> Higher reward percentages (25-30%) drive more shares</li>
                  <li>• <strong>Psychological pricing:</strong> $199 feels much less than $200</li>
                  <li>• <strong>Value demonstration:</strong> "Worth $X separately, selling for $Y"</li>
                  <li>• <strong>Payment security:</strong> "Platform handles all payments securely"</li>
                  <li>• <strong>Degree 1 focus:</strong> Emphasize 50% earning potential</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Optimal Bacon Pool Example:</h4>
                <div className="text-sm text-green-700">
                  <p>$1,000 item with 30% bacon pool = $300 total rewards</p>
                  <p>Degree 1 referrer earns: $150 (50%)</p>
                  <p>Creates strong motivation for direct sharing!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Anonymous Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Advanced Anonymous Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Trust Building Through Transparency</h4>
                  <p className="text-sm text-muted-foreground">Honest condition reports and detailed photos build credibility without revealing identity</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Platform Credibility</h4>
                  <p className="text-sm text-muted-foreground">Leverage University of Bacon's verification systems for trust</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Referrer Motivation</h4>
                  <p className="text-sm text-muted-foreground">Clear explanation of earning structure and charitable impact</p>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-academic mb-2">Local Market Optimization</h4>
                  <p className="text-sm text-muted-foreground">Anonymous but location-aware for pickup convenience</p>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm">• <strong>Anonymous listings build trust through platform verification</strong> rather than personal reputation</p>
                <p className="text-sm">• <strong>Emphasize degree 1 earning potential</strong> (50%) to motivate direct sharing</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">• <strong>Higher bacon pool percentages</strong> attract more referrers and drive viral sharing</p>
                <p className="text-sm">• <strong>Charity donation feature</strong> adds social good angle to sharing motivation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link to="/study-guides/getting-started">← Previous: Getting Started</Link>
          </Button>
          <Button asChild>
            <Link to="/study-guides/chain-building">Next: Chain Building →</Link>
          </Button>
        </div>
      </div>
    </SharedLayout>
  );
}