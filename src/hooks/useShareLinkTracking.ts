import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Hook for handling share link clicks
export const useShareLinkHandler = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const handleShareLinkClick = async () => {
      const ref = searchParams.get('ref');
      
      if (ref && typeof ref === 'string' && ref.startsWith('UOB-')) {
        setIsTracking(true);
        
        try {
          // Track the click
          const clickData = await trackShareClick({
            trackingCode: ref,
            ipAddress: await getUserIP(),
            userAgent: navigator.userAgent,
            referrerUrl: document.referrer,
            sessionId: getSessionId()
          });

          if (clickData && typeof clickData === 'object' && 'success' in clickData && clickData.success) {
            // Store click ID in session for potential conversion tracking
            sessionStorage.setItem('share_click_id', (clickData as any).click_id);
            sessionStorage.setItem('referral_tracking_code', ref);
            
            // Show a subtle notification about the referral
            toast({
              title: "🎓 University of Bacon",
              description: "You arrived via a friend's recommendation. They'll earn bacon if you make a purchase!",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error('Share tracking error:', error);
        } finally {
          setIsTracking(false);
        }
      }
    };

    handleShareLinkClick();
  }, [location.search, searchParams, toast]);

  return { isTracking };
};

// Track Share Click Function
export const trackShareClick = async (params: {
  trackingCode: string;
  ipAddress?: string;
  userAgent?: string;
  referrerUrl?: string;
  sessionId?: string;
}) => {
  try {
    const { data, error } = await supabase.rpc('track_share_click', {
      tracking_code_param: params.trackingCode,
      ip_address_param: params.ipAddress,
      user_agent_param: params.userAgent,
      referrer_url_param: params.referrerUrl,
      session_id_param: params.sessionId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Click tracking error:', error);
    return { success: false, error: error.message };
  }
};

// Purchase Conversion Handler
export const handlePurchaseConversion = async (params: {
  purchaseAmount: number;
  buyerId: string;
  listingId: string;
}) => {
  try {
    const clickId = sessionStorage.getItem('share_click_id');
    const trackingCode = sessionStorage.getItem('referral_tracking_code');
    
    if (!clickId || !trackingCode) {
      return { success: false, message: 'No referral tracking found' };
    }

    // Record the conversion
    const { data, error } = await supabase.rpc('record_share_conversion', {
      click_id_param: clickId,
      buyer_id_param: params.buyerId,
      purchase_amount_param: params.purchaseAmount,
      degree_param: 1 // First degree for direct clicks
    });

    if (error) throw error;

    // Clear tracking data
    sessionStorage.removeItem('share_click_id');
    sessionStorage.removeItem('referral_tracking_code');

    return { success: true, data };
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return { success: false, error: error.message };
  }
};

// Utility Functions
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return '127.0.0.1';
  }
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('uob_session_id');
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('uob_session_id', sessionId);
  }
  return sessionId;
};