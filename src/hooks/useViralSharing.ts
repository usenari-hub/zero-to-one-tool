import { useState, useEffect, useCallback } from 'react';
import { viralSharingService, ShareLink, ShareAnalytics } from '@/services/viralSharingService';

interface ViralSharingState {
  shareLinks: ShareLink[];
  analytics: ShareAnalytics[];
  loading: boolean;
  error: string | null;
}

interface UseViralSharingReturn extends ViralSharingState {
  createShareLink: (listingId: string, platform: string, customMessage?: string) => Promise<ShareLink>;
  trackClick: (trackingCode: string, additionalData?: any) => Promise<void>;
  refreshShareLinks: () => Promise<void>;
  getShareContent: (platform: string, listingTitle: string, baconPotential: number, customMessage?: string) => any;
}

export const useViralSharing = (autoLoad = true): UseViralSharingReturn => {
  const [state, setState] = useState<ViralSharingState>({
    shareLinks: [],
    analytics: [],
    loading: false,
    error: null
  });

  const refreshShareLinks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const shareLinks = await viralSharingService.getMyShareLinks();
      setState(prev => ({ ...prev, shareLinks, loading: false }));
    } catch (error: any) {
      console.error('Error refreshing share links:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load share links'
      }));
    }
  }, []);

  const createShareLink = useCallback(async (
    listingId: string,
    platform: string,
    customMessage?: string
  ): Promise<ShareLink> => {
    try {
      const shareLink = await viralSharingService.createShareLink(listingId, platform, customMessage);
      // Refresh share links after creation
      await refreshShareLinks();
      return shareLink;
    } catch (error) {
      console.error('Error creating share link:', error);
      throw error;
    }
  }, [refreshShareLinks]);

  const trackClick = useCallback(async (
    trackingCode: string,
    additionalData?: any
  ): Promise<void> => {
    try {
      await viralSharingService.trackClick(trackingCode, additionalData);
    } catch (error) {
      console.error('Error tracking click:', error);
      // Don't throw error for tracking - it shouldn't break user experience
    }
  }, []);

  const getShareContent = useCallback((
    platform: string,
    listingTitle: string,
    baconPotential: number,
    customMessage?: string
  ) => {
    return viralSharingService.generateShareContent(platform, listingTitle, baconPotential, customMessage);
  }, []);

  // Auto-load data on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      refreshShareLinks();
    }
  }, [autoLoad, refreshShareLinks]);

  return {
    ...state,
    createShareLink,
    trackClick,
    refreshShareLinks,
    getShareContent
  };
};