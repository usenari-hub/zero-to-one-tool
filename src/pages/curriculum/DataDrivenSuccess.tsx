import { useEffect } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, TestTube, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import guide06Image from '@/assets/curriculum/guide-06-data-driven-success.jpg';
import baconLogo from '@/assets/crest-bacon.svg';

export default function DataDrivenSuccess() {
  useEffect(() => {
    document.title = 'Data-Driven Success - Analytics & Continuous Improvement | University of Bacon';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Use metrics and data to optimize your anonymous earning potential. Master analytics, A/B testing, and conversion optimization.');
    }
  }, []);

  return (
    <SharedLayout>
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <img 
            src={guide06Image} 
            alt="Data-Driven Success Guide"
            className="w-full h-64 object-cover rounded-lg shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={baconLogo} alt="Bacon Logo" className="h-8 w-8" />
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Guide 06
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
              Data-Driven Success
            </h1>
            <p className="text-lg text-muted-foreground">
              Analytics & Continuous Improvement for Anonymous Sellers
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Key Metrics for Anonymous Sellers
            </CardTitle>
            <CardDescription>
              Focus on metrics that matter most for anonymous marketplace success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Critical Anonymous Metrics:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Degree 1 conversion rate:</strong> Percentage of shares that result in direct sales (50% earnings)</li>
                  <li>• <strong>Bacon pool optimization:</strong> Which reward percentages drive most sharing</li>
                  <li>• <strong>Anonymous trust score:</strong> Platform credibility metrics without identity exposure</li>
                  <li>• <strong>Chain completion rate:</strong> How often referral chains reach actual sales</li>
                  <li>• <strong>Charity impact tracking:</strong> How much your listings contribute to social causes</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Success Prediction Formula:</h4>
                <div className="bg-white p-3 rounded text-xs font-mono text-blue-700 mb-3">
                  Views × Share Rate × Conversion Rate × Average Price = Expected Revenue
                </div>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>1. Listing Performance: Views, shares, inquiries, sales</p>
                  <p>2. Degree Distribution: Which degrees your sales come from</p>
                  <p>3. Bacon Pool Performance: Optimal percentages by category</p>
                  <p>4. Platform Trust Metrics: Anonymous reputation scores</p>
                  <p>5. Social Impact: Charitable contributions from unfilled degrees</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* A/B Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              A/B Testing Anonymous Listing Elements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Testing Elements:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Bacon percentage testing:</strong> 20% vs. 25% vs. 30% reward pools</li>
                    <li>• <strong>Anonymous messaging:</strong> Different ways to build trust without personal info</li>
                    <li>• <strong>Degree 1 emphasis:</strong> Test focusing on 50% earning vs. explaining full chain</li>
                    <li>• <strong>Charity messaging:</strong> Test different ways to explain social impact</li>
                    <li>• <strong>Platform credibility:</strong> Test different trust signals and verification displays</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Anonymous A/B Testing Protocol:</h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li><strong>Hypothesis:</strong> What anonymous trust factor will improve performance?</li>
                    <li><strong>Single variable:</strong> Change only bacon percentage OR messaging OR photos</li>
                    <li><strong>Platform tracking:</strong> Use University of Bacon analytics for anonymous data</li>
                    <li><strong>Statistical significance:</strong> 95% confidence in results with platform data</li>
                    <li><strong>Implementation:</strong> Apply winning variations while maintaining anonymity</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Chain Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Referral Chain Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Optimization Focus Areas:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Degree 1 focus:</strong> Track which contacts consistently drive direct sales</li>
                  <li>• <strong>Chain analysis:</strong> Understand why some chains complete while others stall</li>
                  <li>• <strong>Charitable impact:</strong> Monitor and promote social good contributions</li>
                  <li>• <strong>Platform performance:</strong> Which University of Bacon features drive best results</li>
                  <li>• <strong>Anonymous networking:</strong> Build referral relationships without revealing identity</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Advanced Anonymous Analytics:</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>• <strong>Degree performance modeling:</strong> Predict which referrals will reach sales</p>
                  <p>• <strong>Bacon pool optimization:</strong> Mathematical modeling of optimal reward percentages</p>
                  <p>• <strong>Charitable impact reporting:</strong> Track social good created by your listings</p>
                  <p>• <strong>Anonymous network analysis:</strong> Map relationships without exposing identity</p>
                  <p>• <strong>Platform ROI:</strong> Time invested vs. bacon earned through University of Bacon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Implementation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Week 1: Anonymous Foundation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Complete platform verification (maintain anonymity)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Create first anonymous listing with 25% bacon pool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Identify 3-5 potential degree 1 referrers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Set up anonymous tracking system</span>
                  </div>
                </div>

                <h3 className="font-semibold mb-3 mt-6">Week 2-4: Degree 1 Focus</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Apply listing mastery for anonymous trust building</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Focus on direct referral cultivation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Test different bacon pool percentages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Track degree 1 conversion rates</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Month 2-3: Chain Optimization</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Implement advanced anonymous strategies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Build systematic analytics for anonymous performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Optimize for degree 1 earnings (50% focus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Promote charity impact angle</span>
                  </div>
                </div>

                <h3 className="font-semibold mb-3 mt-6">Month 4+: Anonymous Mastery</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Become trusted anonymous seller in specific categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Develop network of reliable degree 1 referrers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Track and promote charitable impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Scale anonymous operations across multiple categories</span>
                  </div>
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
              <p className="text-sm">• <strong>Degree 1 metrics are most important</strong> - 50% earnings justify focused tracking</p>
              <p className="text-sm">• <strong>Charity impact creates additional value</strong> beyond personal earnings</p>
              <p className="text-sm">• <strong>Anonymous trust building</strong> requires different metrics than personal branding</p>
              <p className="text-sm">• <strong>Platform analytics</strong> provide insights while maintaining privacy</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link to="/curriculum/profit-maximization">← Previous: Profit Maximization</Link>
          </Button>
          <Button asChild>
            <Link to="/curriculum">Back to Curriculum Overview →</Link>
          </Button>
        </div>
      </div>
    </SharedLayout>
  );
}