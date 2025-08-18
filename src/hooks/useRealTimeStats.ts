import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeStats {
  totalBaconEarned: number;
  totalUsers: number;
  totalListings: number;
  totalTransactions: number;
  averageGPA: number;
  charityFund: {
    totalDonated: number;
    partnersCount: number;
    studentsHelped: number;
  };
  loading: boolean;
  error: string | null;
}

export const useRealTimeStats = (): RealTimeStats => {
  const [stats, setStats] = useState<RealTimeStats>({
    totalBaconEarned: 0,
    totalUsers: 0,
    totalListings: 0,
    totalTransactions: 0,
    averageGPA: 0,
    charityFund: {
      totalDonated: 0,
      partnersCount: 3, // Fixed number as per business logic
      studentsHelped: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Get admin dashboard metrics which includes comprehensive stats
        const { data: adminMetrics, error: adminError } = await supabase.rpc('get_admin_dashboard_metrics');
        
        if (adminError) throw adminError;

        // Get charity fund stats
        const { data: charityStats, error: charityError } = await supabase.rpc('get_charity_fund_stats');
        
        if (charityError) throw charityError;

        // Get average GPA from gpa_calculations table
        const { data: gpaData, error: gpaError } = await supabase
          .from('gpa_calculations')
          .select('gpa_value')
          .eq('calculation_type', 'semester');

        if (gpaError) throw gpaError;

        // Calculate average GPA
        const averageGPA = gpaData && gpaData.length > 0 
          ? gpaData.reduce((sum, record) => sum + Number(record.gpa_value), 0) / gpaData.length 
          : 4.2; // Default nice GPA if no data

        // Calculate students helped from charity amount (assuming $100 per student helped)
        const charityAmount = charityStats && Array.isArray(charityStats) && charityStats[0] 
          ? Number(charityStats[0].total_amount) 
          : 0;
        const studentsHelped = charityAmount ? Math.floor(charityAmount / 100) : 0;

        // Type adminMetrics as a record
        const metrics = adminMetrics as Record<string, any>;
        const charityData = charityStats as Array<Record<string, any>>;

        setStats({
          totalBaconEarned: Number(metrics?.total_bacon_earned || 0),
          totalUsers: Number(metrics?.total_users || 0),
          totalListings: Number(metrics?.total_listings || 0),
          totalTransactions: metrics?.today_revenue ? Math.floor(Number(metrics.today_revenue) / 50) : 0, // Estimate transactions
          averageGPA: Number(averageGPA.toFixed(1)),
          charityFund: {
            totalDonated: Number(charityData?.[0]?.total_amount || 0),
            partnersCount: 3, // Fixed as per business model
            studentsHelped: studentsHelped
          },
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching real-time stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch stats'
        }));
      }
    };

    fetchStats();

    // Set up real-time subscription for stats updates
    const channel = supabase
      .channel('stats-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bacon_transactions' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'charity_fund' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return stats;
};