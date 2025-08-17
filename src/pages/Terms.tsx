import { useEffect } from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms of Service | University of Bacon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Complete Terms of Service for EarnYourBacon.online - Social commerce platform rules and policies.");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-[hsl(var(--brand-academic))] text-background py-12 md:py-16">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl text-accent">Terms of Service</h1>
          <p className="mt-2 opacity-90 italic">University of Bacon Platform Agreement</p>
        </div>
      </section>
      
      <section className="container py-10 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground mb-6">
            <strong>Last Updated:</strong> [Current Date]<br/>
            <strong>Effective Date:</strong> [Current Date]
          </p>

          <h2 className="font-display text-2xl mb-4">1. ACCEPTANCE OF TERMS</h2>
          <p>By accessing or using EarnYourBacon.online (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.</p>

          <h2 className="font-display text-2xl mb-4 mt-8">2. DESCRIPTION OF SERVICE</h2>
          <p>University of Bacon operates a social commerce platform that enables users to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>List items for sale</li>
            <li>Share listings through referral networks</li>
            <li>Earn commissions ("Bacon") through successful referrals</li>
            <li>Build referral chains up to six degrees of separation</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">3. USER ACCOUNTS AND VERIFICATION</h2>
          <h3 className="font-display text-xl mb-3">3.1 Account Creation</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users must provide accurate, current, and complete information</li>
            <li>Users must be at least 18 years old or the age of majority in their jurisdiction</li>
            <li>One account per person; multiple accounts are prohibited</li>
            <li>We reserve the right to refuse service to anyone</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">3.2 Account Verification</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Identity verification may be required for certain features</li>
            <li>We may request additional documentation at our discretion</li>
            <li>Unverified accounts may have limited functionality or restricted payouts</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">3.3 Account Security</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users are responsible for maintaining account security</li>
            <li>Users must notify us immediately of any unauthorized access</li>
            <li>We are not liable for losses due to compromised accounts</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">4. PROHIBITED ACTIVITIES AND FRAUD PREVENTION</h2>
          <h3 className="font-display text-xl mb-3">4.1 Strictly Prohibited Activities</h3>
          <p>Users may NOT:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Create fake accounts or use bots to manipulate the system</li>
            <li>Click on their own referral links or arrange for others to do so</li>
            <li>Create fraudulent listings for items they do not own or possess</li>
            <li>List stolen, counterfeit, or illegal items</li>
            <li>Manipulate referral chains through deceptive means</li>
            <li>Use the platform for money laundering or other illegal financial activities</li>
            <li>Engage in wash trading or artificial transaction creation</li>
            <li>Misrepresent item condition, ownership, or availability</li>
            <li>Create multiple accounts to circumvent limitations</li>
            <li>Use VPNs or proxy services to hide geographic location for fraudulent purposes</li>
            <li>Engage in any form of spam, harassment, or abusive behavior</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">4.2 Listing Requirements</h3>
          <p>All listings must:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Be for items the user legally owns and possesses</li>
            <li>Include accurate descriptions and genuine photographs</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Be priced reasonably and in good faith</li>
            <li>Include proof of ownership when requested</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">5. BACON EARNINGS AND FORFEITURE</h2>
          <h3 className="font-display text-xl mb-3">5.1 Earning Bacon</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bacon is earned through legitimate referral activities only</li>
            <li>Commission rates are subject to change with notice</li>
            <li>Earnings are calculated based on successful, completed transactions</li>
            <li>We reserve the right to verify all transactions before releasing payments</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">5.2 BACON FORFEITURE AND INVESTIGATION</h3>
          <p><strong>WE RESERVE THE ABSOLUTE RIGHT TO:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>IMMEDIATELY FREEZE</strong> any user's Bacon balance upon suspicion of fraudulent activity</li>
            <li><strong>PERMANENTLY FORFEIT</strong> all Bacon earnings if we determine, in our sole discretion, that a user has violated these Terms</li>
            <li><strong>CONDUCT INVESTIGATIONS</strong> into any suspicious activity, during which all funds remain frozen</li>
            <li><strong>WITHHOLD PAYMENTS</strong> indefinitely pending investigation completion</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">5.3 Triggers for Investigation</h3>
          <p>Your Bacon may be frozen and subject to forfeiture if:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>User reports</strong> indicate suspicious or fraudulent behavior</li>
            <li>Unusual click patterns or referral activities are detected</li>
            <li>Multiple accounts are linked to the same person or household</li>
            <li>Listings appear fraudulent or for items not legally owned</li>
            <li>Transaction patterns suggest manipulation or abuse</li>
            <li>We receive complaints about misrepresented items</li>
            <li>Law enforcement requests information about your activities</li>
            <li>Any activity violates these Terms or applicable laws</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">5.4 Investigation Process</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Investigations may take up to 90 days or longer</li>
            <li>Users may be required to provide additional documentation</li>
            <li>Failure to cooperate with investigations may result in permanent account termination</li>
            <li>We are not required to provide detailed explanations of our investigative findings</li>
            <li>All decisions regarding Bacon forfeiture are final and binding</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">6. CONTENT AND INTELLECTUAL PROPERTY</h2>
          <h3 className="font-display text-xl mb-3">6.1 User-Generated Content</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users retain ownership of their original content</li>
            <li>Users grant us a worldwide, royalty-free license to use, display, and distribute their content</li>
            <li>Users represent that they own or have permission to use all content they upload</li>
            <li>We may remove content that violates these Terms without notice</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">6.2 Platform Content</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>All platform features, design, and functionality are our property</li>
            <li>Users may not copy, modify, or distribute our proprietary content</li>
            <li>Our trademarks and branding may not be used without permission</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">7. PRIVACY AND DATA PROTECTION</h2>
          <h3 className="font-display text-xl mb-3">7.1 Data Collection</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>We collect information necessary to operate the platform</li>
            <li>Personal information is handled according to our Privacy Policy</li>
            <li>We may monitor activities to prevent fraud and ensure compliance</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">7.2 Information Sharing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>We may share information with law enforcement when required by law</li>
            <li>We may share information to investigate fraud or protect our interests</li>
            <li>We may share aggregated, non-personal data for business purposes</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">8. PAYMENTS AND FINANCIAL TERMS</h2>
          <h3 className="font-display text-xl mb-3">8.1 Payment Processing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>All payments are processed through third-party providers</li>
            <li>We are not responsible for payment processor errors or delays</li>
            <li>Transaction fees may apply and are subject to change</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">8.2 Minimum Payout Thresholds</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Minimum payout amounts may be established and changed at our discretion</li>
            <li>Accounts below minimum thresholds may not receive payments</li>
            <li>Inactive accounts may have different payout requirements</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">8.3 Tax Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users are responsible for all applicable taxes on their earnings</li>
            <li>We may issue tax documents as required by law</li>
            <li>International users must comply with their local tax obligations</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">9. DISPUTE RESOLUTION</h2>
          <h3 className="font-display text-xl mb-3">9.1 Internal Disputes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Transaction disputes should first be resolved between users</li>
            <li>We may mediate disputes at our discretion but are not obligated to do so</li>
            <li>Our decisions in disputes are final and binding</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">9.2 Platform Disputes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users must attempt to resolve disputes with us through customer service first</li>
            <li>Unresolved disputes may be subject to binding arbitration</li>
            <li>Class action lawsuits are waived by using this platform</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">10. LIMITATION OF LIABILITY</h2>
          <h3 className="font-display text-xl mb-3">10.1 Service Disclaimer</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>The platform is provided "as is" without warranties of any kind</li>
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>We are not responsible for user interactions or transactions</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">10.2 Damages Limitation</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Our total liability is limited to the amount of Bacon in your account</li>
            <li>We are not liable for indirect, incidental, or consequential damages</li>
            <li>Some jurisdictions may not allow these limitations</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">11. LEGAL COMPLIANCE AND COOPERATION</h2>
          <h3 className="font-display text-xl mb-3">11.1 Law Enforcement Cooperation</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>We will cooperate fully with law enforcement investigations</li>
            <li>We may provide user information when legally required</li>
            <li>We may suspend accounts pending legal proceedings</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">11.2 Regulatory Compliance</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users must comply with all applicable laws and regulations</li>
            <li>We reserve the right to modify the platform to ensure legal compliance</li>
            <li>Users in restricted jurisdictions may be prohibited from using certain features</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">12. TERMINATION</h2>
          <h3 className="font-display text-xl mb-3">12.1 Termination by Users</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users may delete their accounts at any time</li>
            <li>Earned Bacon may be forfeited upon voluntary termination</li>
            <li>Some data may be retained for legal and business purposes</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">12.2 Termination by Platform</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>We may terminate accounts immediately for Terms violations</li>
            <li>Termination may result in forfeiture of all Bacon earnings</li>
            <li>We may terminate service for any reason with or without notice</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">13. MODIFICATIONS TO TERMS</h2>
          <h3 className="font-display text-xl mb-3">13.1 Updates and Changes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>These Terms may be updated at any time without prior notice</li>
            <li>Continued use of the platform constitutes acceptance of new Terms</li>
            <li>Material changes may be communicated through the platform or email</li>
          </ul>

          <h3 className="font-display text-xl mb-3 mt-6">13.2 Retroactive Application</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>New Terms may apply retroactively to existing accounts and earnings</li>
            <li>We reserve the right to modify commission structures and policies</li>
            <li>Users who disagree with changes must stop using the platform</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">14. INDEMNIFICATION</h2>
          <p>Users agree to indemnify and hold harmless University of Bacon, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use of the platform</li>
            <li>Violation of these Terms</li>
            <li>Violation of any laws or third-party rights</li>
            <li>User-generated content or listings</li>
            <li>Fraudulent or illegal activities</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">15. GOVERNING LAW AND JURISDICTION</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>These Terms are governed by the laws of Oklahoma</li>
            <li>Any legal proceedings must be conducted in Tulsa County, Oklahoma</li>
            <li>Users consent to the jurisdiction of courts in Tulsa County, Oklahoma</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">16. SEVERABILITY</h2>
          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>

          <h2 className="font-display text-2xl mb-4 mt-8">17. ENTIRE AGREEMENT</h2>
          <p>These Terms, along with our Privacy Policy, constitute the entire agreement between users and University of Bacon.</p>

          <h2 className="font-display text-2xl mb-4 mt-8">18. CONTACT INFORMATION</h2>
          <p>For questions about these Terms, contact us at:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Email:</strong> support@earnyourbacon.online</li>
          </ul>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h2 className="font-display text-xl mb-4">IMPORTANT NOTICES</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-destructive">⚠️ FRAUD WARNING</h3>
                <p className="text-sm">Any attempt to defraud the system will result in immediate account termination and forfeiture of all earnings. We employ sophisticated fraud detection systems and work closely with law enforcement.</p>
              </div>

              <div>
                <h3 className="font-semibold text-primary">🔍 INVESTIGATION NOTICE</h3>
                <p className="text-sm">User reports of suspicious activity trigger immediate investigations. During investigations, all account funds are frozen. Investigations may take 90+ days. Non-cooperation results in permanent account termination.</p>
              </div>

              <div>
                <h3 className="font-semibold text-accent">💰 EARNINGS DISCLAIMER</h3>
                <p className="text-sm">Bacon earnings are not guaranteed and depend on legitimate referral activity. Past performance does not indicate future results. All earnings are subject to our fraud prevention policies.</p>
              </div>

              <div>
                <h3 className="font-semibold text-secondary">📱 PLATFORM CHANGES</h3>
                <p className="text-sm">We reserve the right to modify, suspend, or discontinue any aspect of the platform at any time. Features, commission rates, and policies may change without notice.</p>
              </div>
            </div>
          </div>

          <div className="bg-[hsl(var(--brand-academic))] text-background p-6 rounded-lg mt-8 text-center">
            <p className="font-semibold">By using University of Bacon, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Return to Campus
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Terms;
