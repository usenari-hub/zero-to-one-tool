import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SharedLayout } from "@/components/SharedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Shield, Users, DollarSign, Target, ArrowRight, Star, Clock, Award } from "lucide-react";

const StudyGuides = () => {
  useEffect(() => {
    document.title = "Study Guides | University of Bacon - Master the Art of Profitable Referrals";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Complete study guides for maximizing profits through strategic referrals. Learn listing optimization, chain building, trust systems, and advanced profit strategies.");
  }, []);

  const guides = [
    {
      id: "getting-started",
      title: "Getting Started: Your First $1,000 in Bacon",
      description: "Essential foundations for new users to start earning immediately",
      icon: <Target className="h-6 w-6" />,
      difficulty: "Beginner",
      duration: "30 min read",
      category: "Foundation",
      sections: [
        "Setting up your profile for maximum trust",
        "Creating your first listing: title, description, and pricing strategies",
        "Understanding the 6-degree referral system",
        "Finding your first referral opportunities",
        "Setting optimal reward percentages (20-35% sweet spot)",
        "Quick wins: leveraging existing networks"
      ],
      keyTakeaways: [
        "Start with 25% reward percentage for faster traction",
        "Use specific, searchable titles with location keywords",
        "Verify your identity early to build credibility",
        "Focus on items you actually know buyers for"
      ]
    },
    {
      id: "listing-optimization",
      title: "Listing Mastery: Creating Irresistible Course Offerings",
      description: "Advanced techniques for creating listings that attract quality referrers",
      icon: <BookOpen className="h-6 w-6" />,
      difficulty: "Intermediate",
      duration: "45 min read",
      category: "Strategy",
      sections: [
        "Title optimization: Using buyer psychology and SEO principles",
        "Description frameworks that convert browsers to referrers",
        "Pricing psychology: min/max ranges that drive action",
        "Timing your listings for maximum visibility",
        "Category selection and keyword targeting",
        "Creating urgency without appearing desperate"
      ],
      keyTakeaways: [
        "Include specific brands, models, or unique identifiers",
        "Use emotional triggers in descriptions",
        "Set realistic but attractive reward percentages",
        "Update listings regularly to maintain visibility"
      ]
    },
    {
      id: "chain-building",
      title: "Chain Building 301: Scaling Your Referral Network",
      description: "How to build and manage profitable 6-degree referral chains",
      icon: <Users className="h-6 w-6" />,
      difficulty: "Advanced",
      duration: "60 min read",
      category: "Growth",
      sections: [
        "Identifying high-value referral partners",
        "Creating compelling share messages that get forwarded",
        "Managing multiple chains without conflicts",
        "Analyzing chain performance and optimization",
        "Building relationships that generate repeat referrals",
        "Cross-pollination strategies between different chains"
      ],
      keyTakeaways: [
        "Quality of referrers matters more than quantity",
        "Personalize share messages for each degree",
        "Track performance metrics for continuous improvement",
        "Maintain relationships beyond single transactions"
      ]
    },
    {
      id: "trust-reputation",
      title: "Trust & Reputation: Building Your Bacon Brand",
      description: "Establishing credibility and maintaining high ratings for sustained success",
      icon: <Shield className="h-6 w-6" />,
      difficulty: "Intermediate",
      duration: "40 min read",
      category: "Foundation",
      sections: [
        "Verification strategies: ID, phone, email, social proof",
        "Building your reputation score systematically",
        "Handling disputes and negative feedback professionally",
        "Creating consistent communication patterns",
        "Transparency best practices for listings",
        "Building long-term referrer relationships"
      ],
      keyTakeaways: [
        "Complete all verification steps immediately",
        "Respond to all inquiries within 24 hours",
        "Under-promise and over-deliver consistently",
        "Document all agreements clearly"
      ]
    },
    {
      id: "profit-maximization",
      title: "Profit Maximization: Advanced Bacon Strategies",
      description: "Elite techniques for maximizing earnings per transaction",
      icon: <TrendingUp className="h-6 w-6" />,
      difficulty: "Expert",
      duration: "75 min read",
      category: "Advanced",
      sections: [
        "Dynamic pricing strategies based on market conditions",
        "Portfolio diversification across categories",
        "Seasonal opportunity identification",
        "High-value item specialization techniques",
        "Negotiation frameworks for premium listings",
        "Exit strategies and wealth preservation"
      ],
      keyTakeaways: [
        "Focus on items over $10,000 for maximum bacon potential",
        "Develop expertise in 2-3 specific categories",
        "Use market timing to your advantage",
        "Reinvest earnings into higher-value opportunities"
      ]
    },
    {
      id: "analytics-optimization",
      title: "Data-Driven Success: Analytics & Continuous Improvement",
      description: "Using metrics and data to optimize your earning potential",
      icon: <DollarSign className="h-6 w-6" />,
      difficulty: "Advanced",
      duration: "50 min read",
      category: "Analytics",
      sections: [
        "Key metrics that predict listing success",
        "A/B testing listing elements for maximum performance",
        "Conversion funnel optimization",
        "Referrer quality scoring and selection",
        "ROI analysis for time investment",
        "Predictive modeling for future opportunities"
      ],
      keyTakeaways: [
        "Track view-to-share and share-to-purchase ratios",
        "Optimize for quality referrers, not just quantity",
        "Use data to identify your most profitable niches",
        "Continuously test and iterate on successful patterns"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Foundation": return "bg-blue-100 text-blue-800";
      case "Strategy": return "bg-purple-100 text-purple-800";
      case "Growth": return "bg-green-100 text-green-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Analytics": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SharedLayout>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[hsl(var(--brand-academic))] to-[hsl(var(--brand-academic))]/80 text-background py-16 md:py-24">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="h-8 w-8 text-accent" />
              <Badge variant="secondary" className="text-sm font-semibold">
                Complete Learning Path
              </Badge>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-accent mb-4">
              University of Bacon Study Guides
            </h1>
            <p className="text-xl md:text-2xl opacity-90 italic mb-6 max-w-3xl mx-auto">
              Master the art of profitable referrals. From your first listing to scaling a six-figure bacon empire.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" />
                <span>6 Comprehensive Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>5+ Hours of Content</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span>Proven Strategies</span>
              </div>
            </div>
          </div>
        </section>

        {/* Study Guides Overview */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Your Path to Bacon Mastery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow our structured study guides to maximize your earnings through strategic referral networking. 
              Each guide builds upon the previous, creating a comprehensive foundation for success.
            </p>
          </div>

          {/* Study Guides Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => {
              const getRouteFromId = (id: string) => {
                switch (id) {
                  case "getting-started": return "/study-guides/getting-started";
                  case "listing-optimization": return "/study-guides/listing-mastery";
                  case "chain-building": return "/study-guides/chain-building";
                  case "trust-reputation": return "/study-guides/trust-reputation";
                  case "profit-maximization": return "/study-guides/profit-maximization";
                  case "analytics-optimization": return "/study-guides/data-driven-success";
                  default: return "/study-guides";
                }
              };

              return (
                <Link key={guide.id} to={getRouteFromId(guide.id)}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 h-full cursor-pointer">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {guide.icon}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {guide.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {guide.description}
                        </CardDescription>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                        <Badge className={getCategoryColor(guide.category)}>
                          {guide.category}
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {guide.duration}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">What You'll Learn:</h4>
                        <ul className="space-y-1">
                          {guide.sections.slice(0, 3).map((section, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <ArrowRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                              <span>{section}</span>
                            </li>
                          ))}
                          {guide.sections.length > 3 && (
                            <li className="text-sm text-muted-foreground font-medium">
                              + {guide.sections.length - 3} more topics
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">Key Takeaways:</h4>
                        <ul className="space-y-1">
                          {guide.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Star className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">Start Guide</span>
                        <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Learning Path */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  🎯 Recommended Learning Path
                </CardTitle>
                <CardDescription className="text-base">
                  For maximum success, follow this order and complete each guide before moving to the next
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Foundation (Start Here)</h4>
                    <p className="text-sm text-muted-foreground">Build your basics and get your first earnings</p>
                    <ul className="text-sm space-y-1">
                      <li>• Getting Started Guide</li>
                      <li>• Trust & Reputation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Growth Phase</h4>
                    <p className="text-sm text-muted-foreground">Scale your operations and optimize performance</p>
                    <ul className="text-sm space-y-1">
                      <li>• Listing Mastery</li>
                      <li>• Chain Building</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Mastery Level</h4>
                    <p className="text-sm text-muted-foreground">Advanced strategies for serious earners</p>
                    <ul className="text-sm space-y-1">
                      <li>• Profit Maximization</li>
                      <li>• Analytics & Optimization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-display text-foreground">Ready to Start Earning?</h3>
              <p className="text-muted-foreground">
                Apply what you learn immediately by creating your first listing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/listings" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  View Course Listings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  to="/account" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
                >
                  Create Your First Listing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SharedLayout>
  );
};

export default StudyGuides;