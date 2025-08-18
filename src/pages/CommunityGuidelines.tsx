import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, DollarSign, Heart, AlertTriangle, CheckCircle, XCircle, Star, Phone, Mail } from "lucide-react";
import { SharedLayout } from "@/components/SharedLayout";

const CommunityGuidelines = () => {
  useEffect(() => {
    document.title = "Community Guidelines - University of Bacon";
  }, []);

  const Section = ({ 
    icon: Icon, 
    title, 
    children, 
    variant = "default" 
  }: { 
    icon: any; 
    title: string; 
    children: React.ReactNode; 
    variant?: "default" | "success" | "warning" | "destructive" 
  }) => (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`h-6 w-6 ${
          variant === "success" ? "text-green-600" : 
          variant === "warning" ? "text-yellow-600" : 
          variant === "destructive" ? "text-red-600" : 
          "text-primary"
        }`} />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </Card>
  );

  const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3 text-primary">{title}</h3>
      {children}
    </div>
  );

  const GuidelineList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );

  const ProhibitedList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );

  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              Community Standards
            </Badge>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Community Guidelines
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Building a Safe, Trustworthy, and Profitable Community for Everyone
            </p>
          </div>

          {/* Mission */}
          <Section icon={Shield} title="Our Mission">
            <p className="text-lg leading-relaxed">
              University of Bacon exists to revolutionize social commerce by creating a platform where trusted recommendations replace random ads, and everyone gets paid for making good connections. These guidelines ensure our community remains safe, authentic, and profitable for all members.
            </p>
          </Section>

          {/* Core Principles */}
          <Section icon={Star} title="Core Principles">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Authenticity First</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• All listings must be for items you actually own</li>
                  <li>• Share only genuine recommendations</li>
                  <li>• Build real relationships, not artificial chains</li>
                  <li>• Honest descriptions and accurate photos always</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Mutual Benefit</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Everyone in the referral chain earns fairly</li>
                  <li>• Support other community members' success</li>
                  <li>• Share knowledge and best practices openly</li>
                  <li>• Create value for buyers, sellers, and referrers</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Social Responsibility</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Unfilled referral degrees support charities</li>
                  <li>• Promote sustainable consumption and reuse</li>
                  <li>• Build community connections beyond transactions</li>
                  <li>• Contribute to positive social impact</li>
                </ul>
              </Card>
            </div>
          </Section>

          {/* What We Encourage */}
          <Section icon={CheckCircle} title="What We Encourage" variant="success">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <SubSection title="🛍️ Quality Listings">
                  <GuidelineList items={[
                    "<strong>Accurate descriptions</strong> with honest condition assessments",
                    "<strong>High-quality photos</strong> showing items from multiple angles",
                    "<strong>Fair pricing</strong> based on market research and item condition",
                    "<strong>Complete information</strong> including specifications, accessories, and defects",
                    "<strong>Timely responses</strong> to buyer inquiries and questions"
                  ]} />
                </SubSection>

                <SubSection title="💼 Professional Conduct">
                  <GuidelineList items={[
                    "<strong>Respectful communication</strong> in all interactions",
                    "<strong>Prompt responses</strong> to messages and inquiries",
                    "<strong>Reliable follow-through</strong> on commitments and promises",
                    "<strong>Constructive feedback</strong> when reviewing transactions",
                    "<strong>Helpful guidance</strong> for new community members"
                  ]} />
                </SubSection>
              </div>

              <div>
                <SubSection title="🤝 Authentic Sharing">
                  <GuidelineList items={[
                    "<strong>Genuine recommendations</strong> to people who would actually want the item",
                    "<strong>Personal connections</strong> rather than mass spam campaigns",
                    "<strong>Honest testimonials</strong> about items you've used or believe in",
                    "<strong>Platform education</strong> helping others understand how bacon earning works",
                    "<strong>Community support</strong> answering questions and sharing tips"
                  ]} />
                </SubSection>

                <SubSection title="🌱 Community Building">
                  <GuidelineList items={[
                    "<strong>Mentoring newcomers</strong> and sharing successful strategies",
                    "<strong>Celebrating others' success</strong> and achievements",
                    "<strong>Participating in discussions</strong> about platform improvements",
                    "<strong>Promoting charitable impact</strong> of unfilled referral degrees",
                    "<strong>Building long-term relationships</strong> beyond individual transactions"
                  ]} />
                </SubSection>
              </div>
            </div>
          </Section>

          {/* Strictly Prohibited */}
          <Section icon={XCircle} title="Strictly Prohibited" variant="destructive">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <SubSection title="🚫 Fraudulent Activities">
                  <ProhibitedList items={[
                    "<strong>Fake listings</strong> for items you don't own or possess",
                    "<strong>Stolen merchandise</strong> or items of questionable ownership",
                    "<strong>Counterfeit products</strong> or unauthorized replicas",
                    "<strong>False condition claims</strong> or misleading descriptions",
                    "<strong>Bait and switch</strong> tactics or misrepresented items"
                  ]} />
                </SubSection>

                <SubSection title="🚫 Gaming the System">
                  <ProhibitedList items={[
                    "<strong>Creating fake accounts</strong> or multiple accounts",
                    "<strong>Artificial referral chains</strong> with non-existent people",
                    "<strong>Self-clicking</strong> on your own referral links",
                    "<strong>Coordinated manipulation</strong> with friends or family",
                    "<strong>VPN usage</strong> to hide location or create false referrals"
                  ]} />
                </SubSection>

                <SubSection title="🚫 Spam and Harassment">
                  <ProhibitedList items={[
                    "<strong>Mass messaging</strong> uninterested parties",
                    "<strong>Aggressive sales tactics</strong> or pushy behavior",
                    "<strong>Harassment</strong> of buyers, sellers, or community members",
                    "<strong>Spam posting</strong> in social media groups or forums",
                    "<strong>Unwanted contact</strong> after someone declines interest"
                  ]} />
                </SubSection>
              </div>

              <div>
                <SubSection title="🚫 Illegal or Harmful Content">
                  <ProhibitedList items={[
                    "<strong>Illegal items</strong> or services prohibited by law",
                    "<strong>Dangerous products</strong> that could cause harm",
                    "<strong>Adult content</strong> or sexually explicit material",
                    "<strong>Weapons or ammunition</strong> of any kind",
                    "<strong>Regulated substances</strong> including drugs, alcohol, or tobacco"
                  ]} />
                </SubSection>

                <SubSection title="🚫 Platform Abuse">
                  <ProhibitedList items={[
                    "<strong>False reporting</strong> of legitimate users or listings",
                    "<strong>Review manipulation</strong> or fake testimonials",
                    "<strong>Payment circumvention</strong> avoiding platform fees or protections",
                    "<strong>Information harvesting</strong> of user data for external use",
                    "<strong>Competing platform promotion</strong> advertising other marketplaces"
                  ]} />
                </SubSection>
              </div>
            </div>
          </Section>

          {/* Bacon Earning Ethics */}
          <Section icon={DollarSign} title="Bacon Earning Ethics">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Honest Referrals</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Only share items you genuinely recommend</li>
                  <li>• Disclose your earning potential when sharing</li>
                  <li>• Focus on value to the buyer, not just earnings</li>
                  <li>• Build genuine relationships not transactional ones</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Degree System Integrity</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Understand your position in each referral chain</li>
                  <li>• Don't manipulate chain positions</li>
                  <li>• Accept your degree earnings gracefully</li>
                  <li>• Support the charity system</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Fair Competition</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Compete on quality not manipulation</li>
                  <li>• Respect other sellers' listings</li>
                  <li>• Don't undercut unfairly to steal referrals</li>
                  <li>• Share knowledge about successful strategies</li>
                </ul>
              </Card>
            </div>
          </Section>

          {/* Enforcement */}
          <Section icon={AlertTriangle} title="Enforcement and Consequences" variant="warning">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Warning System</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>First violation:</span>
                    <Badge variant="secondary">Educational warning</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Second violation:</span>
                    <Badge variant="outline">Feature restriction</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Third violation:</span>
                    <Badge variant="secondary">Temporary suspension</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Serious violations:</span>
                    <Badge variant="destructive">Permanent ban</Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Consequences</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Feature restrictions: Limited sharing or listing</li>
                  <li>• Bacon forfeiture: Loss of earned but unpaid bacon</li>
                  <li>• Account suspension: Temporary platform access loss</li>
                  <li>• Permanent ban: Complete platform removal</li>
                  <li>• Legal action: For serious fraud or illegal activities</li>
                </ul>
              </Card>
            </div>
          </Section>

          {/* Getting Help */}
          <Section icon={Heart} title="Getting Help">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Community Support</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• FAQ section for common questions</li>
                  <li>• Community forums for peer-to-peer help</li>
                  <li>• Video tutorials for platform features</li>
                  <li>• Live chat support during business hours</li>
                  <li>• Email support for complex issues</li>
                </ul>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>support@earnyourbacon.online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>community@earnyourbacon.online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>safety@earnyourbacon.online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>feedback@earnyourbacon.online</span>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          {/* Welcome Message */}
          <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4 text-primary">Welcome to the Community</h2>
            <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
              University of Bacon succeeds when every member contributes to a trustworthy, profitable, and socially responsible marketplace. Together, we're building the future of social commerce - where everyone wins, and no one is left behind.
            </p>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              🥓 Ready to start earning bacon while building a better marketplace?
            </Badge>
          </Card>

          <Separator className="my-8" />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>These guidelines are effective as of {new Date().toLocaleDateString()} and apply to all University of Bacon community members.</p>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default CommunityGuidelines;