import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - University of Bacon";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for University of Bacon - Learn how we protect your data and privacy on our revolutionary social commerce platform.');
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-[hsl(var(--brand-academic))] to-[hsl(var(--primary))] bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How University of Bacon protects your data and privacy
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-lg p-8 shadow-elegant mb-8">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Last Updated:</strong> 8/21/2025<br />
                <strong>Effective Date:</strong> 8/21/2025
              </p>

              <h2 className="font-display text-2xl mb-4 mt-8">1. INTRODUCTION</h2>
              <p>
                University of Bacon ("we," "our," or "us") operates EarnYourBacon.online (the "Platform"), a revolutionary social commerce platform that enables users to earn money through their social networks. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our Platform.
              </p>
              <p>
                By using University of Bacon, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this Privacy Policy, please do not use our Platform.
              </p>

              <h2 className="font-display text-2xl mb-4 mt-8">2. INFORMATION WE COLLECT</h2>
              
              <h3 className="font-display text-xl mb-3">2.1 Information You Provide Directly</h3>
              <ul>
                <li><strong>Account Information:</strong> Email address, password, display name, profile information</li>
                <li><strong>Identity Verification:</strong> Government-issued ID, address verification, phone number</li>
                <li><strong>Payment Information:</strong> Bank account details, payment processor information, tax identification numbers</li>
                <li><strong>Listing Information:</strong> Item descriptions, photos, pricing, location data</li>
                <li><strong>Communication Data:</strong> Messages between users, customer support interactions, feedback and reviews</li>
              </ul>

              <h3 className="font-display text-xl mb-3">2.2 Information We Collect Automatically</h3>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on platform, click patterns, referral sources</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                <li><strong>Cookies and Tracking:</strong> Session data, preferences, authentication tokens</li>
                <li><strong>Share Link Analytics:</strong> Click tracking, conversion data, platform performance metrics</li>
              </ul>

              <h3 className="font-display text-xl mb-3">2.3 Information from Third Parties</h3>
              <ul>
                <li><strong>Social Media Integration:</strong> Profile information from connected social accounts</li>
                <li><strong>Payment Processors:</strong> Transaction confirmations, fraud prevention data</li>
                <li><strong>Identity Verification Services:</strong> Background checks, identity confirmation</li>
                <li><strong>Public Records:</strong> Business registration information for commercial sellers</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">3. HOW WE USE YOUR INFORMATION</h2>
              
              <h3 className="font-display text-xl mb-3">3.1 Platform Operation</h3>
              <ul>
                <li>Create and manage user accounts</li>
                <li>Process transactions and calculate bacon earnings</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>Provide customer support and resolve disputes</li>
                <li>Maintain platform security and prevent fraud</li>
              </ul>

              <h3 className="font-display text-xl mb-3">3.2 Bacon Earning System</h3>
              <ul>
                <li>Track referral chains and attribution</li>
                <li>Calculate commission payments across degrees of separation</li>
                <li>Generate share links with unique tracking codes</li>
                <li>Monitor conversion rates and platform performance</li>
                <li>Process bacon withdrawals and tax reporting</li>
              </ul>

              <h3 className="font-display text-xl mb-3">3.3 Fraud Prevention and Security</h3>
              <ul>
                <li>Verify user identities and detect fraudulent accounts</li>
                <li>Monitor suspicious activity patterns</li>
                <li>Investigate reports of misconduct or policy violations</li>
                <li>Protect against money laundering and financial crimes</li>
                <li>Maintain audit trails for compliance purposes</li>
              </ul>

              <h3 className="font-display text-xl mb-3">3.4 Platform Improvement</h3>
              <ul>
                <li>Analyze user behavior to improve features</li>
                <li>Optimize share link performance and content generation</li>
                <li>Develop new earning mechanisms and platform capabilities</li>
                <li>Conduct A/B testing for feature enhancements</li>
                <li>Generate anonymized analytics and insights</li>
              </ul>

              <h3 className="font-display text-xl mb-3">3.5 Communication</h3>
              <ul>
                <li>Send transactional emails (purchase confirmations, bacon earnings notifications)</li>
                <li>Provide important platform updates and policy changes</li>
                <li>Share promotional content about new features (with opt-out available)</li>
                <li>Send fraud alerts and security notifications</li>
                <li>Facilitate dispute resolution communication</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">4. INFORMATION SHARING AND DISCLOSURE</h2>
              
              <h3 className="font-display text-xl mb-3">4.1 When We Share Information</h3>
              
              <p><strong>With Other Users:</strong></p>
              <ul>
                <li>Public profile information in listings and transactions</li>
                <li>Aggregated reputation and trust scores</li>
                <li>Transaction history relevant to current dealings</li>
                <li>Contact information after verified payment completion</li>
              </ul>

              <p><strong>With Service Providers:</strong></p>
              <ul>
                <li>Payment processors for transaction handling</li>
                <li>Identity verification services for account security</li>
                <li>Cloud hosting providers for data storage</li>
                <li>Email services for platform communications</li>
                <li>Analytics providers for platform optimization</li>
              </ul>

              <p><strong>For Legal Compliance:</strong></p>
              <ul>
                <li>Law enforcement agencies when required by law</li>
                <li>Regulatory authorities for financial compliance</li>
                <li>Court orders and legal proceedings</li>
                <li>Tax authorities for reporting obligations</li>
              </ul>

              <p><strong>Business Transfers:</strong></p>
              <ul>
                <li>Potential buyers in case of business sale</li>
                <li>Investors for due diligence purposes</li>
                <li>Legal advisors for business operations</li>
                <li>Auditors for financial compliance</li>
              </ul>

              <h3 className="font-display text-xl mb-3">4.2 What We Don't Share</h3>
              <ul>
                <li>We never sell personal data to third parties for marketing purposes</li>
                <li>Payment information is handled securely by certified processors</li>
                <li>Private messages remain confidential unless legally required</li>
                <li>Exact location data is never shared with other users</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">5. DATA SECURITY AND PROTECTION</h2>
              
              <h3 className="font-display text-xl mb-3">5.1 Security Measures</h3>
              <ul>
                <li>Industry-standard encryption for data transmission and storage</li>
                <li>Multi-factor authentication for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure cloud infrastructure with redundant backups</li>
                <li>Employee access controls and security training</li>
              </ul>

              <h3 className="font-display text-xl mb-3">5.2 Payment Security</h3>
              <ul>
                <li>PCI DSS compliant payment processing</li>
                <li>Tokenization of sensitive financial data</li>
                <li>Fraud detection and prevention systems</li>
                <li>Secure API integrations with financial institutions</li>
                <li>Regular security assessments of payment partners</li>
              </ul>

              <h3 className="font-display text-xl mb-3">5.3 Data Breach Response</h3>
              <ul>
                <li>Immediate investigation and containment procedures</li>
                <li>User notification within 72 hours of discovery</li>
                <li>Coordination with law enforcement when appropriate</li>
                <li>Free credit monitoring for affected users when applicable</li>
                <li>Transparent reporting of breach details and remediation steps</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">6. YOUR RIGHTS AND CHOICES</h2>
              
              <h3 className="font-display text-xl mb-3">6.1 Account Management</h3>
              <ul>
                <li>Access and update your personal information</li>
                <li>Download your data in portable formats</li>
                <li>Deactivate or delete your account</li>
                <li>Manage communication preferences</li>
                <li>Control privacy settings and data sharing</li>
              </ul>

              <h3 className="font-display text-xl mb-3">6.2 Marketing Communications</h3>
              <ul>
                <li>Opt out of promotional emails</li>
                <li>Unsubscribe from marketing newsletters</li>
                <li>Control push notification settings</li>
                <li>Manage social media integration preferences</li>
              </ul>

              <h3 className="font-display text-xl mb-3">6.3 Data Subject Rights (GDPR/CCPA)</h3>
              <ul>
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to Portability:</strong> Receive data in machine-readable format</li>
                <li><strong>Right to Restriction:</strong> Limit processing of your data</li>
                <li><strong>Right to Object:</strong> Opt out of certain data processing activities</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">7. DATA RETENTION</h2>
              
              <h3 className="font-display text-xl mb-3">7.1 Account Data</h3>
              <ul>
                <li>Active accounts: Data retained while account is active</li>
                <li>Inactive accounts: Data retained for 3 years after last activity</li>
                <li>Deleted accounts: Most data deleted within 30 days</li>
                <li>Legal holds: Data retained as required for legal proceedings</li>
              </ul>

              <h3 className="font-display text-xl mb-3">7.2 Transaction Data</h3>
              <ul>
                <li>Financial records: Retained for 7 years for tax and audit purposes</li>
                <li>Bacon earning records: Retained permanently for payment history</li>
                <li>Fraud investigation data: Retained for 10 years</li>
                <li>Analytics data: Anonymized and retained indefinitely</li>
              </ul>

              <h3 className="font-display text-xl mb-3">7.3 Communication Data</h3>
              <ul>
                <li>Customer support: Retained for 3 years</li>
                <li>User messages: Retained for 1 year after conversation ends</li>
                <li>Legal communications: Retained for 7 years</li>
                <li>Marketing communications: Retained until opt-out plus 1 year</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">8. INTERNATIONAL DATA TRANSFERS</h2>
              
              <h3 className="font-display text-xl mb-3">8.1 Cross-Border Processing</h3>
              <ul>
                <li>Data may be processed in countries outside your residence</li>
                <li>We ensure adequate protection through appropriate safeguards</li>
                <li>Standard contractual clauses govern international transfers</li>
                <li>Regular assessments of international partner security</li>
              </ul>

              <h3 className="font-display text-xl mb-3">8.2 Specific Protections</h3>
              <ul>
                <li>EU-US Privacy Shield compliance (where applicable)</li>
                <li>Binding corporate rules for intra-company transfers</li>
                <li>Adequacy decisions for transfers to approved countries</li>
                <li>User consent for transfers to non-adequate countries</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">9. CHILDREN'S PRIVACY</h2>
              
              <h3 className="font-display text-xl mb-3">9.1 Age Restrictions</h3>
              <ul>
                <li>Platform is not intended for users under 18 years old</li>
                <li>We do not knowingly collect information from minors</li>
                <li>Parental consent required for users under 18 in some jurisdictions</li>
                <li>Age verification processes to prevent underage registration</li>
              </ul>

              <h3 className="font-display text-xl mb-3">9.2 Protecting Minors</h3>
              <ul>
                <li>Immediate deletion of data if minor status is discovered</li>
                <li>Notification to parents when legally required</li>
                <li>Enhanced security measures for verified minor accounts</li>
                <li>Regular training for staff on child safety protocols</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">10. COOKIES AND TRACKING TECHNOLOGIES</h2>
              
              <h3 className="font-display text-xl mb-3">10.1 Types of Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Performance Cookies:</strong> Analytics and platform optimization</li>
                <li><strong>Functionality Cookies:</strong> User preferences and settings</li>
                <li><strong>Targeting Cookies:</strong> Personalized content and advertising</li>
              </ul>

              <h3 className="font-display text-xl mb-3">10.2 Cookie Management</h3>
              <ul>
                <li>Cookie consent banner for new users</li>
                <li>Granular cookie preferences in account settings</li>
                <li>Browser-based cookie controls and deletion</li>
                <li>Regular cookie audit and cleanup processes</li>
              </ul>

              <h3 className="font-display text-xl mb-3">10.3 Third-Party Tracking</h3>
              <ul>
                <li>Google Analytics for usage analytics</li>
                <li>Payment processor tracking for fraud prevention</li>
                <li>Social media pixels for share link optimization</li>
                <li>Advertising networks for platform promotion</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">11. CALIFORNIA PRIVACY RIGHTS (CCPA)</h2>
              
              <h3 className="font-display text-xl mb-3">11.1 Information Categories</h3>
              <ul>
                <li>Personal identifiers (email, phone, address)</li>
                <li>Financial information (payment methods, earnings)</li>
                <li>Commercial information (transaction history, preferences)</li>
                <li>Internet activity (browsing history, platform usage)</li>
                <li>Geolocation data (general location from IP address)</li>
              </ul>

              <h3 className="font-display text-xl mb-3">11.2 Your CCPA Rights</h3>
              <ul>
                <li><strong>Right to Know:</strong> Categories and specific pieces of information collected</li>
                <li><strong>Right to Delete:</strong> Deletion of personal information</li>
                <li><strong>Right to Opt-Out:</strong> Sale of personal information (we don't sell data)</li>
                <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
              </ul>

              <h3 className="font-display text-xl mb-3">11.3 Exercising CCPA Rights</h3>
              <ul>
                <li>Submit requests through privacy@earnyourbacon.online</li>
                <li>Verify identity through account authentication</li>
                <li>Receive response within 45 days (extendable to 90 days)</li>
                <li>Designate authorized agents for requests</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">12. UPDATES TO THIS PRIVACY POLICY</h2>
              
              <h3 className="font-display text-xl mb-3">12.1 Policy Changes</h3>
              <ul>
                <li>We may update this Privacy Policy periodically</li>
                <li>Material changes will be communicated via email</li>
                <li>Continued use constitutes acceptance of changes</li>
                <li>Previous versions available in our policy archive</li>
              </ul>

              <h3 className="font-display text-xl mb-3">12.2 Notification Methods</h3>
              <ul>
                <li>Email notification to registered users</li>
                <li>Prominent banner on platform homepage</li>
                <li>In-app notifications for active users</li>
                <li>Updated effective date at top of policy</li>
              </ul>

              <h2 className="font-display text-2xl mb-4 mt-8">13. CONTACT INFORMATION</h2>
              
              <h3 className="font-display text-xl mb-3">13.1 Privacy Questions</h3>
              <ul>
                <li>Email: privacy@earnyourbacon.online</li>
                <li>Address: [Company Address]</li>
                <li>Phone: [Company Phone]</li>
                <li>Response Time: Within 5 business days</li>
              </ul>

              <h3 className="font-display text-xl mb-3">13.2 Data Protection Officer</h3>
              <ul>
                <li>Email: dpo@earnyourbacon.online</li>
                <li>Responsibilities: GDPR compliance, privacy impact assessments</li>
                <li>Contact for: Data protection concerns, privacy complaints</li>
              </ul>

              <h3 className="font-display text-xl mb-3">13.3 Regulatory Complaints</h3>
              <ul>
                <li>Users may file complaints with applicable data protection authorities</li>
                <li>EU residents: Contact your local Data Protection Authority</li>
                <li>California residents: California Attorney General's Office</li>
                <li>Other jurisdictions: Contact applicable privacy regulators</li>
              </ul>

              {/* Important Notices Section */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">DATA SECURITY</h4>
                      <p className="text-sm text-muted-foreground">
                        Your personal and financial information is protected using bank-level encryption and security measures. We never store complete payment information on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💰</div>
                    <div>
                      <h4 className="font-semibold text-secondary mb-2">FINANCIAL PRIVACY</h4>
                      <p className="text-sm text-muted-foreground">
                        Your bacon earnings and transaction history are kept confidential. We only share aggregated, anonymized financial data for platform analytics.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🌐</div>
                    <div>
                      <h4 className="font-semibold text-accent mb-2">INTERNATIONAL USERS</h4>
                      <p className="text-sm text-muted-foreground">
                        By using University of Bacon, international users consent to data processing in the United States under appropriate safeguards and protections.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/5 border border-muted/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">COMMUNICATION PREFERENCES</h4>
                      <p className="text-sm text-muted-foreground">
                        You can opt out of marketing communications but will continue to receive transactional emails necessary for platform operation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  This Privacy Policy is effective as of December 18, 2024 and applies to all users of the University of Bacon platform. 
                  For questions about this policy, contact us at support@earnyourbacon.online.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <a
                href="/"
                className="inline-flex items-center text-primary hover:text-primary-foreground transition-colors duration-200"
              >
                ← Return to Campus
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Privacy;