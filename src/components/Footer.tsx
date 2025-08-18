import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[hsl(var(--brand-academic))] to-[hsl(var(--primary))] text-white">
      <div className="container mx-auto px-4 py-8">

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li><Link to="/listings" className="hover:text-white/60 transition-colors">Browse Listings</Link></li>
              <li><Link to="/admissions" className="hover:text-white/60 transition-colors">Get Started</Link></li>
              <li><Link to="/curriculum" className="hover:text-white/60 transition-colors">How It Works</Link></li>
              <li><Link to="/departments" className="hover:text-white/60 transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Academic</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li><Link to="/curriculum" className="hover:text-white/60 transition-colors">Course Catalog</Link></li>
              <li><Link to="/alumni" className="hover:text-white/60 transition-colors">Alumni Network</Link></li>
              <li><Link to="/departments" className="hover:text-white/60 transition-colors">Departments</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li><Link to="/account" className="hover:text-white/60 transition-colors">My Dashboard</Link></li>
              <li><Link to="/auth" className="hover:text-white/60 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li><Link to="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-white/60 transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="font-display text-lg text-white">University of Bacon</div>
            <div className="text-sm text-white/80">© {currentYear} All rights reserved</div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-white/80">Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span className="text-white/80">for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};