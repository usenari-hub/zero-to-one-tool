import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[hsl(var(--brand-academic))] to-[hsl(var(--brand-academic-dark))] text-background">
      <div className="container mx-auto px-4 py-8">
        {/* Charity Impact Fund Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur border-white/20">
          <div className="p-6 text-center">
            <h3 className="text-xl font-display text-accent mb-2 flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Charity Impact Fund
            </h3>
            <p className="text-background/90 text-sm mb-4 max-w-2xl mx-auto">
              Every time an item sells before all 6 referral degrees are filled, unclaimed funds automatically support student financial aid and educational initiatives.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">$12,847</div>
                <div className="text-xs text-background/80">Total Donated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">3</div>
                <div className="text-xs text-background/80">Charity Partners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">156</div>
                <div className="text-xs text-background/80">Students Helped</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-2 py-1 bg-white/20 rounded">Student Emergency Fund</span>
              <span className="px-2 py-1 bg-white/20 rounded">Textbook Assistance Program</span>
              <span className="px-2 py-1 bg-white/20 rounded">Digital Access Initiative</span>
            </div>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-accent mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/listings" className="hover:text-accent transition-colors">Browse Listings</Link></li>
              <li><Link to="/admissions" className="hover:text-accent transition-colors">Get Started</Link></li>
              <li><Link to="/curriculum" className="hover:text-accent transition-colors">How It Works</Link></li>
              <li><Link to="/departments" className="hover:text-accent transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent mb-4">Academic</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/curriculum" className="hover:text-accent transition-colors">Course Catalog</Link></li>
              <li><Link to="/alumni" className="hover:text-accent transition-colors">Alumni Network</Link></li>
              <li><Link to="/departments" className="hover:text-accent transition-colors">Departments</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="hover:text-accent transition-colors">My Dashboard</Link></li>
              <li><Link to="/auth" className="hover:text-accent transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="font-display text-lg text-accent">University of Bacon</div>
            <div className="text-sm text-background/80">© {currentYear} All rights reserved</div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-background/80">Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span className="text-background/80">for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};