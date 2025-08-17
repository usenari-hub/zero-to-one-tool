import { useState, useEffect, useCallback } from 'react';
import { 
  anonymousSellerService, 
  AnonymousProfile 
} from '@/services/anonymousSellerService';

interface AnonymousSellerState {
  profiles: Map<string, AnonymousProfile>; // Map of listing_id to profile
  loading: boolean;
  error: string | null;
}

interface UseAnonymousSellerReturn extends AnonymousSellerState {
  getProfile: (listingId: string) => AnonymousProfile | null;
  createProfile: (listingId: string, actualUserId: string) => Promise<AnonymousProfile>;
  revealSellerContact: (listingId: string, buyerId: string, paymentConfirmation: string) => Promise<any>;
  refreshProfile: (listingId: string) => Promise<AnonymousProfile | null>;
  clearProfiles: () => void;
}

export const useAnonymousSeller = (): UseAnonymousSellerReturn => {
  const [state, setState] = useState<AnonymousSellerState>({
    profiles: new Map(),
    loading: false,
    error: null
  });

  const getProfile = useCallback((listingId: string): AnonymousProfile | null => {
    return state.profiles.get(listingId) || null;
  }, [state.profiles]);

  const createProfile = useCallback(async (
    listingId: string,
    actualUserId: string
  ): Promise<AnonymousProfile> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const profile = await anonymousSellerService.createAnonymousProfile(listingId, actualUserId);
      
      setState(prev => ({
        ...prev,
        profiles: new Map(prev.profiles.set(listingId, profile)),
        loading: false
      }));
      
      return profile;
    } catch (error) {
      console.error('Error creating anonymous profile:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create anonymous profile'
      }));
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async (listingId: string): Promise<AnonymousProfile | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let profile = await anonymousSellerService.getAnonymousProfile(listingId);
      
      if (profile) {
        setState(prev => ({
          ...prev,
          profiles: new Map(prev.profiles.set(listingId, profile)),
          loading: false
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
      
      return profile;
    } catch (error) {
      console.error('Error refreshing anonymous profile:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to refresh profile'
      }));
      return null;
    }
  }, []);

  const revealSellerContact = useCallback(async (
    listingId: string,
    buyerId: string,
    paymentConfirmation: string
  ): Promise<any> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const contactInfo = await anonymousSellerService.revealSellerContact(
        listingId,
        buyerId,
        paymentConfirmation
      );
      
      setState(prev => ({ ...prev, loading: false }));
      
      return contactInfo;
    } catch (error) {
      console.error('Error revealing seller contact:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to reveal seller contact'
      }));
      throw error;
    }
  }, []);

  const clearProfiles = useCallback(() => {
    setState(prev => ({
      ...prev,
      profiles: new Map(),
      error: null
    }));
  }, []);

  return {
    ...state,
    getProfile,
    createProfile,
    revealSellerContact,
    refreshProfile,
    clearProfiles
  };
};