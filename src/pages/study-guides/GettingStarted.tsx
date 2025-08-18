import { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, DollarSign, Users, Target, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import guide01Image from '@/assets/curriculum/guide-01-getting-started.jpg';
import baconLogo from '@/assets/crest-bacon.svg';

export default function GettingStarted() {
  useEffect(() => {
    document.title = 'Getting Started - Your First $1,000 in Bacon | University of Bacon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Essential foundations for new users to start earning bacon immediately. Learn account setup, verification, anonymous listings, and the 6-degree referral system.');
    }
  }, []);

  const keyTakeaways = [
    "Anonymous listings protect privacy while platform verification builds trust",
    "Higher reward percentages (25-30%) create larger bacon pools and more sharing", 
    "Closer to buyer = higher earnings - focus on direct referrals when possible",
    "Charity donation system prevents gaming and creates positive social impact"
  ];

  const actionSteps = [
    "Complete account verification for maximum trust score",
    "Create 3-5 high-quality anonymous listings in different categories", 
    "Share your first listing on 2-3 social platforms",
    "Focus on direct referrals (degree 1) for maximum earnings",
    "Set up tracking system to monitor your referral chains"
  ];

  return (
    <SharedLayout>
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={guide01Image} 
            alt="Getting Started Guide"
            className="w-full h-64 object-cover rounded-lg shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={baconLogo} alt="Bacon Logo" className="h-8 w-8" />
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Guide 01
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
              Getting Started
            </h1>
            <p className="text-lg text-muted-foreground">
              Your First $1,000 in Bacon - Essential foundations for new users
            </p>
          </div>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              What You'll Learn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-brand-academic">Account Setup</h3>
                <p className="text-sm text-muted-foreground">Complete verification, payment setup, and privacy settings for maximum earning potential</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-brand-academic">Anonymous Listings</h3>
                <p className="text-sm text-muted-foreground">Create compelling listings with optimal pricing and bacon pool strategies</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-brand-academic">6-Degree System</h3>
                <p className="text-sm text-muted-foreground">Understand the true referral structure where proximity to buyer matters most</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The True 6-Degree System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Understanding the TRUE 6-Degree Referral System
            </CardTitle>
            <CardDescription>
              The person closest to the buyer earns the most! Here's how it really works:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">Example Chain</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span>You</span> → <span>Tom</span> → <span>Susan</span> → <span>Will</span> → <span>Frank</span> → <span className="font-semibold text-primary">George (buyer)</span>
                </div>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-background rounded border">
                  <span className="font-semibold">Frank (Degree 1)</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">50% - $100</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border">
                  <span className="font-semibold">Will (Degree 2)</span>
                  <Badge variant="secondary">25% - $50</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border">
                  <span>Susan (Degree 3)</span>
                  <Badge variant="outline">10% - $20</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border">
                  <span>Tom (Degree 4)</span>
                  <Badge variant="outline">7.5% - $15</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border">
                  <span>You (Degree 5)</span>
                  <Badge variant="outline">5% - $10</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded border border-dashed">
                  <span className="text-muted-foreground">Charity Donation</span>
                  <Badge variant="outline" className="text-muted-foreground">2.5% - $5</Badge>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>$1,000 MacBook with 20% reward = $200 bacon pool</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Listing Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Anonymous Listing Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">The SCARCITY Method for Descriptions:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>S</strong>pecifications (exact model, condition, features)</p>
                  <p><strong>C</strong>ondition details (photos of any wear)</p>
                  <p><strong>A</strong>ccessories included (original box, cables, etc.)</p>
                  <p><strong>R</strong>eason for selling (upgrading, moving, etc.)</p>
                </div>
                <div>
                  <p><strong>C</strong>all to action (ask questions, serious buyers only)</p>
                  <p><strong>I</strong>mmediate benefits (why they need this now)</p>
                  <p><strong>T</strong>rust signals (receipts, warranty info)</p>
                  <p><strong>Y</strong>our story (personal connection to item)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keyTakeaways.map((takeaway, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{takeaway}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Action Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link to="/study-guides">← Back to Study Guides</Link>
          </Button>
          <Button asChild>
            <Link to="/study-guides/listing-mastery">Next: Listing Mastery →</Link>
          </Button>
        </div>
      </div>
    </SharedLayout>
  );
}