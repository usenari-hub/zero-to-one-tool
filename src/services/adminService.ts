// Complete Admin API Functions for University of Bacon
// Adapted for current database schema

import { supabase } from '@/integrations/supabase/client';

// 1. Admin Authentication and Authorization
export const checkAdminPermissions = async (userId: string, requiredPermission?: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role, permissions, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return { isAdmin: false, permissions: null };
    }

    if (requiredPermission && data.permissions) {
      const hasPermission = data.permissions[requiredPermission] === true;
      return { 
        isAdmin: true, 
        role: data.role, 
        permissions: data.permissions,
        hasPermission 
      };
    }

    return { 
      isAdmin: true, 
      role: data.role, 
      permissions: data.permissions 
    };
  } catch (error) {
    return { isAdmin: false, error: error.message };
  }
};

// 2. Dashboard Metrics API
export const getAdminDashboardMetrics = async () => {
  try {
    const { data, error } = await supabase.rpc('get_admin_dashboard_metrics');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 3. User Management APIs (adapted for profiles table)
export const getAllUsers = async (filters?: {
  status?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        id, display_name, avatar_url, bio, created_at,
        admin_users(role, status)
      `)
      .order('created_at', { ascending: false });

    if (filters?.searchTerm) {
      query = query.ilike('display_name', `%${filters.searchTerm}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const banUser = async (
  userId: string, 
  adminId: string, 
  reason: string, 
  durationDays?: number
) => {
  try {
    const { data, error } = await supabase.rpc('admin_ban_user', {
      user_id_param: userId,
      admin_id_param: adminId,
      ban_reason_param: reason,
      ban_duration_days: durationDays
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const forfeitUserBacon = async (
  userId: string,
  adminId: string,
  reason: string,
  amount?: number
) => {
  try {
    const { data, error } = await supabase.rpc('admin_forfeit_bacon', {
      user_id_param: userId,
      admin_id_param: adminId,
      reason_param: reason,
      amount_param: amount
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserDetailedProfile = async (userId: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const { data: activity } = await supabase
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: earnings } = await supabase
      .from('share_conversions')
      .select(`
        *,
        share_links(platform, listings(item_title))
      `)
      .eq('share_links.user_id', userId)
      .order('converted_at', { ascending: false })
      .limit(50);

    return {
      success: true,
      data: {
        user,
        recent_activity: activity || [],
        earnings_history: earnings || []
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 4. Listings Management APIs
export const getAllListings = async (filters?: {
  status?: string;
  flagged?: boolean;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        profiles(display_name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.flagged !== undefined) {
      if (filters.flagged) {
        query = query.not('flagged_at', 'is', null);
      } else {
        query = query.is('flagged_at', null);
      }
    }

    if (filters?.searchTerm) {
      query = query.or(`item_title.ilike.%${filters.searchTerm}%,item_description.ilike.%${filters.searchTerm}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const flagListing = async (
  listingId: string,
  adminId: string,
  reason: string
) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update({
        flagged_at: new Date().toISOString(),
        flagged_by: adminId,
        flag_reason: reason
      })
      .eq('id', listingId)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('admin_actions').insert({
      admin_user_id: adminId,
      action_type: 'listing_flag',
      target_type: 'listing',
      target_id: listingId,
      reason
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeListing = async (
  listingId: string,
  adminId: string,
  reason: string
) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update({
        status: 'removed'
      })
      .eq('id', listingId)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('admin_actions').insert({
      admin_user_id: adminId,
      action_type: 'listing_remove',
      target_type: 'listing',
      target_id: listingId,
      reason
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 5. Site Configuration APIs (simplified)
export const getSiteConfig = async (configType?: string) => {
  try {
    let query = supabase
      .from('site_config')
      .select('*')
      .order('config_key');

    if (configType) {
      query = query.eq('config_type', configType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSiteConfig = async (
  configKey: string,
  configValue: any,
  configType: string,
  adminId: string
) => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .upsert({
        config_key: configKey,
        config_type: configType,
        config_value: configValue,
        updated_by: adminId,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('admin_actions').insert({
      admin_user_id: adminId,
      action_type: 'config_update',
      target_type: 'site_config',
      target_id: data.id,
      action_data: { config_key: configKey, new_value: configValue }
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 6. Share Links Analytics APIs (simplified)
export const getShareLinksAnalytics = async (filters?: {
  platform?: string;
  dateRange?: { start: string; end: string };
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('share_links')
      .select(`
        *,
        listings(item_title, asking_price),
        profiles(display_name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.platform) {
      query = query.eq('platform', filters.platform);
    }

    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    const metrics = {
      totalLinks: data?.length || 0,
      totalClicks: data?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0,
      totalConversions: data?.reduce((sum, link) => sum + (link.conversions || 0), 0) || 0,
      totalEarnings: data?.reduce((sum, link) => sum + (link.bacon_earned || 0), 0) || 0,
      platformBreakdown: {}
    };

    data?.forEach(link => {
      if (!metrics.platformBreakdown[link.platform]) {
        metrics.platformBreakdown[link.platform] = {
          links: 0,
          clicks: 0,
          conversions: 0,
          earnings: 0
        };
      }
      metrics.platformBreakdown[link.platform].links += 1;
      metrics.platformBreakdown[link.platform].clicks += link.clicks || 0;
      metrics.platformBreakdown[link.platform].conversions += link.conversions || 0;
      metrics.platformBreakdown[link.platform].earnings += link.bacon_earned || 0;
    });

    return { success: true, data, metrics };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 7. System Health Check API
export const getSystemHealth = async () => {
  try {
    const healthChecks = await Promise.allSettled([
      supabase.from('listings').select('count', { count: 'exact', head: true }),
      supabase.auth.getSession(),
    ]);

    const health = {
      database: healthChecks[0].status === 'fulfilled' ? 'healthy' : 'error',
      auth: healthChecks[1].status === 'fulfilled' ? 'healthy' : 'error',
      timestamp: new Date().toISOString()
    };

    return { success: true, data: health };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 8. Data Export
export const exportData = async (
  dataType: 'users' | 'listings' | 'share_links',
  filters?: any,
  format: 'csv' | 'json' = 'csv'
) => {
  try {
    let data;
    
    switch (dataType) {
      case 'users':
        const usersResult = await getAllUsers(filters);
        data = usersResult.data;
        break;
      case 'listings':
        const listingsResult = await getAllListings(filters);
        data = listingsResult.data;
        break;
      case 'share_links':
        const shareLinksResult = await getShareLinksAnalytics(filters);
        data = shareLinksResult.data;
        break;
      default:
        throw new Error('Invalid data type');
    }

    if (format === 'csv') {
      const csvData = convertToCSV(data || []);
      return { success: true, data: csvData, contentType: 'text/csv' };
    }

    return { success: true, data, contentType: 'application/json' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 9. Admin Activity Logs API
export const getAdminActions = async (filters?: {
  adminId?: string;
  actionType?: string;
  targetType?: string;
  dateRange?: { start: string; end: string };
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('admin_actions')
      .select(`
        *,
        admin_users(role)
      `)
      .order('created_at', { ascending: false });

    if (filters?.adminId) {
      query = query.eq('admin_user_id', filters.adminId);
    }

    if (filters?.actionType) {
      query = query.eq('action_type', filters.actionType);
    }

    if (filters?.targetType) {
      query = query.eq('target_type', filters.targetType);
    }

    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return `"${String(value || '').replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Export Object
export const AdminAPI = {
  // Authentication
  checkAdminPermissions,
  
  // Dashboard
  getAdminDashboardMetrics,
  
  // User Management
  getAllUsers,
  banUser,
  forfeitUserBacon,
  getUserDetailedProfile,
  
  // Listings Management
  getAllListings,
  flagListing,
  removeListing,
  
  // Share Links
  getShareLinksAnalytics,
  
  // Site Configuration
  getSiteConfig,
  updateSiteConfig,
  
  // Data Export
  exportData,
  
  // System Health
  getSystemHealth,
  
  // Admin Activity
  getAdminActions
};

export default AdminAPI;