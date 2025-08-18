import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopCourse {
  id: string;
  department: string;
  title: string;
  description: string;
  tuition: string;
  rewards: string;
  classSize: string;
  asking_price: number;
  reward_percentage: number;
  max_degrees: number;
  location: string;
}

export const useTopCourses = () => {
  const [courses, setCourses] = useState<TopCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .eq('admin_status', 'approved')
          .order('created_at', { ascending: false })
          .limit(12); // Fetch 12 to have enough for carousel

        if (fetchError) throw fetchError;

        const formattedCourses: TopCourse[] = (data || []).map(listing => ({
          id: listing.id,
          department: listing.department || 'General Studies',
          title: listing.item_title,
          description: listing.item_description || 'Course details available',
          tuition: listing.asking_price 
            ? `$${listing.asking_price.toLocaleString()}` 
            : listing.price_min && listing.price_max 
              ? `$${listing.price_min.toLocaleString()} - $${listing.price_max.toLocaleString()}`
              : 'Contact for pricing',
          rewards: `${listing.reward_percentage || 20}% referral pool`,
          classSize: `1-${listing.max_degrees || 6} degrees`,
          asking_price: listing.asking_price || 0,
          reward_percentage: listing.reward_percentage || 20,
          max_degrees: listing.max_degrees || 6,
          location: listing.general_location || listing.location || 'Campus'
        }));

        setCourses(formattedCourses);
      } catch (err) {
        console.error('Error fetching top courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchTopCourses();
  }, []);

  return { courses, loading, error };
};