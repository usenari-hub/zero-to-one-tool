import { useState, useEffect, useCallback } from 'react';
import { anonymousSellerService, AnonymousProfile } from '@/services/anonymousSellerService';

interface AnonymousSellerState {
  profile: AnonymousProfile | null;
  loading: boolean;
  error: string | null;
}

interface UseAnonymousSellerReturn extends AnonymousSellerState {
  createProfile: (listingId: string, sellerId: string) => Promise<string>;
  getProfile: (listingId: string) => Promise<AnonymousProfile | null>;
  refreshProfile: (listingId: string) => Promise<void>;
  isContactRevealed: (listingId: string, buyerId: string) => Promise<boolean>;
}

export const useAnonymousSeller = (): UseAnonymousSellerReturn => {
  const [state, setState] = useState<AnonymousSellerState>({
    profile: null,
    loading: false,
    error: null
  });

  const createProfile = useCallback(async (listingId: string, sellerId: string): Promise<string> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const profileId = await anonymousSellerService.createAnonymousProfile(listingId, sellerId);
      setState(prev => ({ ...prev, loading: false }));
      return profileId;
    } catch (error: any) {
      console.error('Error creating anonymous profile:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create anonymous profile'
      }));
      throw error;
    }
  }, []);

  const getProfile = useCallback(async (listingId: string): Promise<AnonymousProfile | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const profile = await anonymousSellerService.getAnonymousProfile(listingId);
      setState(prev => ({ ...prev, profile, loading: false }));
      return profile;
    } catch (error: any) {
      console.error('Error fetching anonymous profile:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch anonymous profile'
      }));
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async (listingId: string): Promise<void> => {
    await getProfile(listingId);
  }, [getProfile]);

  const isContactRevealed = useCallback(async (listingId: string, buyerId: string): Promise<boolean> => {
    try {
      return await anonymousSellerService.isContactRevealed(listingId, buyerId);
    } catch (error) {
      console.error('Error checking contact revelation:', error);
      return false;
    }
  }, []);

  return {
    ...state,
    createProfile,
    getProfile,
    refreshProfile,
    isContactRevealed
  };
};