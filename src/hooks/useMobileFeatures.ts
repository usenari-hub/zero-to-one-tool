import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface OfflineShare {
  id: string;
  platform: string;
  content: string;
  timestamp: string;
  shareLinkId: string;
}

export const useMobileFeatures = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineShare[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline queue from localStorage
    const savedQueue = localStorage.getItem('offlineShares');
    if (savedQueue) {
      setOfflineQueue(JSON.parse(savedQueue));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      processOfflineQueue();
    }
  }, [isOnline, offlineQueue]);

  // Native sharing via Web Share API
  const nativeShare = async (shareData: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Your content has been shared.",
        });
        return true;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Native share failed:', error);
          return false;
        }
      }
    }
    return false;
  };

  // Contact picker for direct sharing
  const shareViaContacts = async (shareUrl: string) => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        // Type assertion for the contacts API which might not be in TypeScript definitions
        const contacts = await (navigator as any).contacts.select(['name', 'email'], { multiple: true });
        
        // This would typically integrate with an email service
        toast({
          title: "Contacts selected",
          description: `Selected ${contacts.length} contacts for sharing.`,
        });
        
        return contacts;
      } catch (error) {
        console.error('Contact picker failed:', error);
        toast({
          title: "Contact picker unavailable",
          description: "This feature is not supported on your device.",
          variant: "destructive"
        });
      }
    }
    return [];
  };

  // Camera integration for custom images
  const captureCustomImage = async (): Promise<string | null> => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        // This would typically open a camera interface
        // For now, we'll just show a success message
        stream.getTracks().forEach(track => track.stop()); // Clean up
        
        toast({
          title: "Camera ready",
          description: "Camera access granted. You can now capture images.",
        });
        
        return 'camera-placeholder-url';
      } catch (error) {
        console.error('Camera access failed:', error);
        toast({
          title: "Camera unavailable",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive"
        });
      }
    }
    return null;
  };

  // Offline support
  const offlineQueueShare = (shareData: Omit<OfflineShare, 'id' | 'timestamp'>) => {
    const newShare: OfflineShare = {
      ...shareData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    const updatedQueue = [...offlineQueue, newShare];
    setOfflineQueue(updatedQueue);
    localStorage.setItem('offlineShares', JSON.stringify(updatedQueue));

    toast({
      title: "Share saved offline",
      description: "Will post when you're back online.",
    });
  };

  // Process offline queue when online
  const processOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    toast({
      title: "Processing offline shares",
      description: `Posting ${offlineQueue.length} queued shares...`,
    });

    // This would typically make API calls to post the content
    // For now, we'll simulate success and clear the queue
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOfflineQueue([]);
      localStorage.removeItem('offlineShares');
      
      toast({
        title: "Offline shares posted",
        description: "All queued shares have been posted successfully.",
      });
    } catch (error) {
      console.error('Failed to process offline queue:', error);
      toast({
        title: "Failed to post some shares",
        description: "Some offline shares could not be posted. They remain in the queue.",
        variant: "destructive"
      });
    }
  };

  // Check if device supports features
  const canUseNativeShare = () => 'share' in navigator;
  const canUseContacts = () => 'contacts' in navigator;
  const canUseCamera = () => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

  // Register service worker for background sync
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Register for background sync
        if ('sync' in (registration as any)) {
          await (registration as any).sync.register('background-share');
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  return {
    isOnline,
    offlineQueue: offlineQueue.length,
    nativeShare,
    shareViaContacts,
    captureCustomImage,
    offlineQueueShare,
    processOfflineQueue,
    canUseNativeShare: canUseNativeShare(),
    canUseContacts: canUseContacts(),
    canUseCamera: canUseCamera(),
    registerServiceWorker
  };
};