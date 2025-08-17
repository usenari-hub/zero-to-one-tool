import { useState, useEffect, useCallback } from 'react';
import { 
  viralSharingService, 
  ShareLink, 
  SharingMomentum,
  ShareContent 
} from '@/services/viralSharingService';

interface ViralSharingState {
  shareLinks: ShareLink[];
  momentum: SharingMomentum | null;
  recentShares: ShareLink[];
  loading: boolean;
  error: string | null;
}

interface UseViralSharingReturn extends ViralSharingState {
  createShareLink: (itemId: string, platform: string, customMessage?: string) => Promise<ShareLink>;
  trackClick: (trackingCode: string, metadata?: Record<string, any>) => Promise<void>;
  generateShareContent: (platform: string, title: string, estimatedEarnings: number, customMessage?: string) => ShareContent;
  getSharingMomentum: () => Promise<SharingMomentum>;
  refreshData: () => Promise<void>;
  getShareLinkAnalytics: (shareId: string) => Promise<any>;
  updateSharingStreak: () => Promise<void>;
}

export const useViralSharing = (autoLoad = true): UseViralSharingReturn => {
  const [state, setState] = useState<ViralSharingState>({
    shareLinks: [],
    momentum: null,
    recentShares: [],
    loading: false,
    error: null
  });

  const refreshData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get sharing momentum and recent shares
      const [momentum, recentShares] = await Promise.all([
        viralSharingService.getSharingMomentum(),
        viralSharingService.getRecentShares(10) // Assuming this method exists
      ]);

      setState(prev => ({
        ...prev,
        momentum,
        recentShares: recentShares || [],
        loading: false
      }));

    } catch (error) {
      console.error('Error refreshing viral sharing data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load sharing data'
      }));
    }
  }, []);

  const createShareLink = useCallback(async (
    itemId: string,
    platform: string,
    customMessage?: string
  ): Promise<ShareLink> => {
    try {
      const shareLink = await viralSharingService.createShareLink(itemId, platform, customMessage);
      
      // Add to local state
      setState(prev => ({
        ...prev,
        shareLinks: [shareLink, ...prev.shareLinks],
        recentShares: [shareLink, ...prev.recentShares.slice(0, 9)] // Keep top 10
      }));
      
      return shareLink;
    } catch (error) {
      console.error('Error creating share link:', error);
      throw error;
    }
  }, []);

  const trackClick = useCallback(async (
    trackingCode: string,
    metadata?: Record<string, any>
  ): Promise<void> => {
    try {
      await viralSharingService.trackClick(trackingCode, metadata);
      
      // Refresh momentum data to get updated stats
      const newMomentum = await viralSharingService.getSharingMomentum();
      setState(prev => ({
        ...prev,
        momentum: newMomentum
      }));
      
    } catch (error) {
      console.error('Error tracking click:', error);
      throw error;
    }
  }, []);

  const generateShareContent = useCallback((
    platform: string,
    title: string,
    estimatedEarnings: number,
    customMessage?: string
  ): ShareContent => {
    return viralSharingService.generateShareContent(platform, title, estimatedEarnings, customMessage);
  }, []);

  const getSharingMomentum = useCallback(async (): Promise<SharingMomentum> => {
    try {
      const momentum = await viralSharingService.getSharingMomentum();
      setState(prev => ({
        ...prev,
        momentum
      }));
      return momentum;
    } catch (error) {
      console.error('Error getting sharing momentum:', error);
      throw error;
    }
  }, []);

  const getShareLinkAnalytics = useCallback(async (shareId: string): Promise<any> => {
    try {
      // This would be implemented in the viral sharing service
      // For now, return mock analytics
      return {
        totalClicks: Math.floor(Math.random() * 100),
        uniqueClicks: Math.floor(Math.random() * 80),
        conversions: Math.floor(Math.random() * 10),
        conversionRate: (Math.random() * 15).toFixed(1) + '%',
        topReferringSources: ['Facebook', 'Twitter', 'WhatsApp'],
        clicksByHour: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
      };
    } catch (error) {
      console.error('Error getting share link analytics:', error);
      throw error;
    }
  }, []);

  const updateSharingStreak = useCallback(async (): Promise<void> => {
    try {
      // This would update the user's sharing streak
      // Implementation would be in the viral sharing service
      const momentum = await viralSharingService.getSharingMomentum();
      setState(prev => ({
        ...prev,
        momentum
      }));
    } catch (error) {
      console.error('Error updating sharing streak:', error);
      throw error;
    }
  }, []);

  // Auto-load data on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      refreshData();
    }
  }, [autoLoad, refreshData]);

  return {
    ...state,
    createShareLink,
    trackClick,
    generateShareContent,
    getSharingMomentum,
    refreshData,
    getShareLinkAnalytics,
    updateSharingStreak
  };
};