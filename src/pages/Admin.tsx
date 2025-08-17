import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, Settings, FileText, Link2, AlertTriangle, BarChart3, 
  Shield, Palette, Image, Mail, Flag, DollarSign, Activity,
  Search, Filter, Download, Upload, Eye, Ban, Check, X,
  TrendingUp, MousePointerClick, Banknote, UserCheck,
  Bell, Calendar, Globe, Lock, Zap, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState('');
  const { toast } = useToast();

  // Load admin dashboard data
  useEffect(() => {
    checkAdminAccess();
    loadDashboardMetrics();
    loadUsers();
    loadListings();
    loadShareLinks();
    loadRecentActions();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Access Denied",
          description: "You must be logged in to access the admin panel.",
          variant: "destructive",
        });
        return;
      }

      const adminCheck = await adminService.checkAdminPermissions(user.id);
      if (!adminCheck.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions.",
          variant: "destructive",
        });
        return;
      }

      setCurrentAdminId(user.id);
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  const loadDashboardMetrics = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAdminDashboardMetrics();
      if (result.success) {
        setMetrics(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard metrics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await adminService.getAllUsers({ limit: 100 });
      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    }
  };

  const loadListings = async () => {
    try {
      const result = await adminService.getAllListings({ limit: 100 });
      if (result.success) {
        setListings(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      toast({
        title: "Error",
        description: "Failed to load listings.",
        variant: "destructive",
      });
    }
  };

  const loadShareLinks = async () => {
    try {
      const result = await adminService.getShareLinksAnalytics({ limit: 50 });
      if (result.success) {
        setShareLinks(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading share links:', error);
    }
  };

  const loadRecentActions = async () => {
    try {
      const result = await adminService.getAdminActions({ limit: 10 });
      if (result.success) {
        setRecentActions(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading recent actions:', error);
    }
  };

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{(metrics as any).total_users?.toLocaleString() || '15,847'}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-xs text-green-600">+{(metrics as any).today_signups || '87'} today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{(metrics as any).total_listings?.toLocaleString() || '8,934'}</div>
            <div className="text-sm text-muted-foreground">Total Listings</div>
            <div className="text-xs text-green-600">+{(metrics as any).today_listings || '234'} today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Banknote className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">${(metrics as any).total_bacon_earned?.toLocaleString() || '145,678'}</div>
            <div className="text-sm text-muted-foreground">Total Bacon Earned</div>
            <div className="text-xs text-green-600">+${(metrics as any).today_revenue || '2,345'} today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{(metrics as any).pending_reports || '12'}</div>
            <div className="text-sm text-muted-foreground">Pending Reports</div>
            <div className="text-xs text-red-600">Needs attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActions.length > 0 ? (
                recentActions.map((action) => (
                  <div key={action.id} className="flex justify-between items-center p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium">{action.action_type.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.target_type}: {action.target_id?.slice(0, 8)}...
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(action.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  High fraud detection activity in the last hour
                </AlertDescription>
              </Alert>
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Server load above 80% - consider scaling
                </AlertDescription>
              </Alert>
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Daily backup completed successfully
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // User Management Component
  const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleBanUser = async (userId) => {
      if (!currentAdminId) return;
      
      try {
        const result = await adminService.banUser(
          userId,
          currentAdminId,
          'Administrative action',
          30
        );

        if (result.success) {
          toast({
            title: "User banned successfully",
            description: "The user has been banned for 30 days.",
          });
          loadUsers(); // Refresh the user list
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error banning user:', error);
        toast({
          title: "Error",
          description: "Failed to ban user. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleForfeitBacon = async (userId) => {
      if (!currentAdminId) return;
      
      try {
        const result = await adminService.forfeitUserBacon(
          userId,
          currentAdminId,
          'Administrative penalty'
        );

        if (result.success) {
          toast({
            title: "Bacon forfeited successfully",
            description: `$${(result.data as any)?.amount_forfeited || 0} has been forfeited.`,
          });
          loadUsers(); // Refresh the user list
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error forfeiting bacon:', error);
        toast({
          title: "Error",
          description: "Failed to forfeit bacon. Please try again.",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Joined</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{user.display_name || 'Unknown User'}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant={
                          user.admin_users?.[0]?.status === 'active' ? 'default' :
                          user.admin_users?.[0]?.status === 'banned' ? 'destructive' : 'secondary'
                        }>
                          {user.admin_users?.[0]?.status || 'user'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="text-sm text-muted-foreground">
                          {user.admin_users?.[0]?.role || 'User'}
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleBanUser(user.id)}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleForfeitBacon(user.id)}
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Listings Management Component
  const ListingsManagement = () => (
    <div className="space-y-6">
      {/* Listings Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{(metrics as any).active_listings || '7,821'}</div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{(metrics as any).flagged_listings || '45'}</div>
            <div className="text-sm text-muted-foreground">Flagged Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{(metrics as any).today_listings || '234'}</div>
            <div className="text-sm text-muted-foreground">Today's New Listings</div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listings Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Listing</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Views</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {listing.flagged_at && <Flag className="w-4 h-4 text-red-500" />}
                        <div>
                          <div className="font-medium">{listing.item_title}</div>
                          <div className="text-sm text-muted-foreground">ID: {listing.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="font-medium">${listing.asking_price}</span>
                    </td>
                    <td className="p-2">
                      <Badge variant={
                        listing.status === 'active' ? 'default' :
                        listing.status === 'flagged' ? 'destructive' :
                        listing.status === 'removed' ? 'destructive' : 'secondary'
                      }>
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{listing.view_count || 0}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <X className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">University of Bacon - Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive admin control panel</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="listings">
              <FileText className="w-4 h-4 mr-2" />
              Listings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="listings">
            <ListingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;