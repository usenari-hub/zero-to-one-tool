import React, { useEffect, useState, ReactNode } from 'react';
import { useShareLinkHandler } from '@/hooks/useShareLinkTracking';

interface CoursePageWithTrackingProps {
  listing?: any;
  children: ReactNode;
}

export const CoursePageWithTracking: React.FC<CoursePageWithTrackingProps> = ({ 
  listing, 
  children 
}) => {
  const { isTracking } = useShareLinkHandler();
  const [showReferralBanner, setShowReferralBanner] = useState(false);

  useEffect(() => {
    const trackingCode = sessionStorage.getItem('referral_tracking_code');
    if (trackingCode) {
      setShowReferralBanner(true);
    }
  }, []);

  return (
    <div>
      {showReferralBanner && (
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 text-center">
          <div className="container mx-auto">
            <p className="font-medium">
              🎓 You arrived via a friend's recommendation! They'll earn bacon if you make a purchase.
            </p>
          </div>
        </div>
      )}
      
      {isTracking && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50">
          Tracking your visit...
        </div>
      )}
      
      {children}
    </div>
  );
};