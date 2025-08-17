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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    // Load initial data
    setMetrics({
      totalUsers: 15847,
      activeUsers: 12456,
      bannedUsers: 23,
      totalListings: 8934,
      activeListings: 7821,
      flaggedListings: 45,
      totalShareLinks: 23456,
      totalBaconEarned: 145678.89,
      pendingReports: 12,
      todaySignups: 87,
      todayListings: 234,
      todayRevenue: 2345.67,
      systemAlerts: 3
    });

    setUsers([
      { id: '1', email: 'user1@example.com', status: 'active', trustScore: 4.8, baconEarned: 234.56, joinedAt: '2024-01-15' },
      { id: '2', email: 'user2@example.com', status: 'flagged', trustScore: 2.1, baconEarned: 45.67, joinedAt: '2024-02-20' },
      { id: '3', email: 'user3@example.com', status: 'banned', trustScore: 1.0, baconEarned: 0.00, joinedAt: '2024-03-10' }
    ]);

    setListings([
      { id: '1', title: '2019 MacBook Pro', user: 'user1@example.com', price: 1200, status: 'active', flagged: false, views: 456 },
      { id: '2', title: 'Suspicious iPhone', user: 'user2@example.com', price: 50, status: 'flagged', flagged: true, views: 23 },
      { id: '3', title: 'Gaming Chair', user: 'user3@example.com', price: 300, status: 'removed', flagged: false, views: 234 }
    ]);

    setReports([
      { id: '1', type: 'fraud_activity', reporter: 'user4@example.com', reported: 'user2@example.com', reason: 'Fake listing', status: 'pending', priority: 'high' },
      { id: '2', type: 'inappropriate_content', reporter: 'user5@example.com', reported: 'user6@example.com', reason: 'Spam content', status: 'investigating', priority: 'medium' }
    ]);
  }, []);

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
            <div className="text-2xl font-bold">{metrics.totalUsers?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-green-600">+{metrics.todaySignups} today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.totalListings?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Listings</div>
            <div className="text-xs text-green-600">+{metrics.todayListings} today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Banknote className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">${metrics.totalBaconEarned?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Bacon Earned</div>
            <div className="text-xs text-green-600">+${metrics.todayRevenue} today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.pendingReports}</div>
            <div className="text-sm text-gray-600">Pending Reports</div>
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
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">New user registration</div>
                  <div className="text-sm text-gray-600">user123@example.com</div>
                </div>
                <div className="text-xs text-gray-500">2 min ago</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <div className="font-medium">Fraud report submitted</div>
                  <div className="text-sm text-gray-600">Suspicious listing activity</div>
                </div>
                <div className="text-xs text-gray-500">15 min ago</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="font-medium">Large bacon payout</div>
                  <div className="text-sm text-gray-600">$450.00 to user456@example.com</div>
                </div>
                <div className="text-xs text-gray-500">1 hour ago</div>
              </div>
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

    const handleBanUser = (userId) => {
      // Implementation for banning user
      console.log('Banning user:', userId);
    };

    const handleForfeitBacon = (userId) => {
      // Implementation for forfeiting bacon
      console.log('Forfeiting bacon for user:', userId);
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
              <SelectItem value="active">Active
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
                    <th className="text-left p-2">Trust Score</th>
                    <th className="text-left p-2">Bacon Earned</th>
                    <th className="text-left p-2">Joined</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant={
                          user.status === 'active' ? 'default' :
                          user.status === 'flagged' ? 'destructive' :
                          user.status === 'banned' ? 'destructive' : 'secondary'
                        }>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-1">
                          <span className={`font-medium ${
                            user.trustScore >= 4 ? 'text-green-600' :
                            user.trustScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {user.trustScore}
                          </span>
                          <span className="text-gray-500">/5.0</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="font-medium">${user.baconEarned}</span>
                      </td>
                      <td className="p-2">
                        <span className="text-sm">{user.joinedAt}</span>
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
            <div className="text-2xl font-bold text-green-600">{metrics.activeListings}</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.flaggedListings}</div>
            <div className="text-sm text-gray-600">Flagged Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.todayListings}</div>
            <div className="text-sm text-gray-600">Today's New Listings</div>
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
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Views</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {listing.flagged && <Flag className="w-4 h-4 text-red-500" />}
                        <div>
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-sm text-gray-500">ID: {listing.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{listing.user}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium">${listing.price}</span>
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
                      <span className="text-sm">{listing.views}</span>
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

  // Share Links Analytics Component
  const ShareLinksAnalytics = () => (
    <div className="space-y-6">
      {/* Share Links Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Link2 className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{metrics.totalShareLinks?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Share Links</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MousePointerClick className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold">47,892</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">12.3%</div>
            <div className="text-sm text-gray-600">Avg Conversion Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Banknote className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">${metrics.totalBaconEarned?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Bacon Distributed</div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">📘</div>
                <div>
                  <div className="font-medium">Facebook</div>
                  <div className="text-sm text-gray-600">18,234 shares</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">15.2%</div>
                <div className="text-sm text-gray-600">conversion rate</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">💼</div>
                <div>
                  <div className="font-medium">LinkedIn</div>
                  <div className="text-sm text-gray-600">8,456 shares</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">22.8%</div>
                <div className="text-sm text-gray-600">conversion rate</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sky-100 rounded flex items-center justify-center">🐦</div>
                <div>
                  <div className="font-medium">Twitter</div>
                  <div className="text-sm text-gray-600">12,678 shares</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">8.9%</div>
                <div className="text-sm text-gray-600">conversion rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Fraud Reports Component
  const FraudReports = () => (
    <div className="space-y-6">
      {/* Reports Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.pendingReports}</div>
            <div className="text-sm text-gray-600">Pending Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <div className="text-sm text-gray-600">Investigating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">145</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">23</div>
            <div className="text-sm text-gray-600">Dismissed</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fraud Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Reporter</th>
                  <th className="text-left p-2">Reported User</th>
                  <th className="text-left p-2">Reason</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Badge variant="outline">{report.type.replace('_', ' ')}</Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{report.reporter}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{report.reported}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{report.reason}</span>
                    </td>
                    <td className="p-2">
                      <Badge variant={
                        report.status === 'pending' ? 'destructive' :
                        report.status === 'investigating' ? 'default' : 'secondary'
                      }>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={
                        report.priority === 'high' ? 'destructive' :
                        report.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {report.priority}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="default">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <X className="w-4 h-4" />
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

  // Site Settings Component
  const SiteSettings = () => {
    const [colors, setColors] = useState({
      primary: '#f97316',
      secondary: '#eab308',
      accent: '#fbbf24',
      academic: '#1e40af'
    });

    const [features, setFeatures] = useState({
      shareLinksEnabled: true,
      referralChainsEnabled: true,
      userVerificationRequired: false,
      autoBaconPayouts: true,
      fraudDetectionEnabled: true
    });

    return (
      <div className="space-y-6">
        <Tabs defaultValue="branding">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="branding">
            <div className="space-y-6">
              {/* Color Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Brand Colors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex space-x-2">
                        <Input 
                          type="color" 
                          value={colors.primary}
                          onChange={(e) => setColors({...colors, primary: e.target.value})}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={colors.primary}
                          onChange={(e) => setColors({...colors, primary: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Color</label>
                      <div className="flex space-x-2">
                        <Input 
                          type="color" 
                          value={colors.secondary}
                          onChange={(e) => setColors({...colors, secondary: e.target.value})}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={colors.secondary}
                          onChange={(e) => setColors({...colors, secondary: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Accent Color</label>
                      <div className="flex space-x-2">
                        <Input 
                          type="color" 
                          value={colors.accent}
                          onChange={(e) => setColors({...colors, accent: e.target.value})}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={colors.accent}
                          onChange={(e) => setColors({...colors, accent: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Academic Color</label>
                      <div className="flex space-x-2">
                        <Input 
                          type="color" 
                          value={colors.academic}
                          onChange={(e) => setColors({...colors, academic: e.target.value})}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={colors.academic}
                          onChange={(e) => setColors({...colors, academic: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4">Save Color Changes</Button>
                </CardContent>
              </Card>

              {/* Logo Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Logo & Graphics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Main Logo</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-16 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">Current Logo</span>
                        </div>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Logo
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Favicon</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-100 rounded border"></div>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Favicon
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Title</label>
                      <Input placeholder="University of Bacon" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Feature Toggles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Share Links</div>
                      <div className="text-sm text-gray-600">Enable share link creation and tracking</div>
                    </div>
                    <Switch 
                      checked={features.shareLinksEnabled}
                      onCheckedChange={(checked) => setFeatures({...features, shareLinksEnabled: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Referral Chains</div>
                      <div className="text-sm text-gray-600">Enable multi-degree referral chains</div>
                    </div>
                    <Switch 
                      checked={features.referralChainsEnabled}
                      onCheckedChange={(checked) => setFeatures({...features, referralChainsEnabled: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">User Verification Required</div>
                      <div className="text-sm text-gray-600">Require identity verification for new users</div>
                    </div>
                    <Switch 
                      checked={features.userVerificationRequired}
                      onCheckedChange={(checked) => setFeatures({...features, userVerificationRequired: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto Bacon Payouts</div>
                      <div className="text-sm text-gray-600">Automatically process bacon payouts</div>
                    </div>
                    <Switch 
                      checked={features.autoBaconPayouts}
                      onCheckedChange={(checked) => setFeatures({...features, autoBaconPayouts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Fraud Detection</div>
                      <div className="text-sm text-gray-600">Enable automatic fraud detection systems</div>
                    </div>
                    <Switch 
                      checked={features.fraudDetectionEnabled}
                      onCheckedChange={(checked) => setFeatures({...features, fraudDetectionEnabled: checked})}
                    />
                  </div>
                </div>
                <Button className="mt-6">Save Feature Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Payment Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Reward Percentage</label>
                    <Input type="number" placeholder="20" min="0" max="100" />
                    <div className="text-xs text-gray-500 mt-1">Percentage of sale price allocated to bacon rewards</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Payout Amount</label>
                    <Input type="number" placeholder="10.00" min="0" step="0.01" />
                    <div className="text-xs text-gray-500 mt-1">Minimum bacon amount before payout is allowed</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Commission Rates by Degree</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs">1st Degree</label>
                        <Input type="number" placeholder="40" />
                      </div>
                      <div>
                        <label className="text-xs">2nd Degree</label>
                        <Input type="number" placeholder="30" />
                      </div>
                      <div>
                        <label className="text-xs">3rd Degree</label>
                        <Input type="number" placeholder="20" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="mt-6">Save Payment Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                    <Input type="number" placeholder="5" min="1" max="20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Timeout (hours)</label>
                    <Input type="number" placeholder="24" min="1" max="168" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fraud Investigation Period (days)</label>
                    <Input type="number" placeholder="90" min="1" max="365" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Require 2FA for Payouts</div>
                      <div className="text-sm text-gray-600">Require two-factor authentication for bacon payouts</div>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button className="mt-6">Save Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email Templates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select email template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="verification">Email Verification</SelectItem>
                      <SelectItem value="fraud_alert">Fraud Alert</SelectItem>
                      <SelectItem value="ban_notice">Ban Notice</SelectItem>
                      <SelectItem value="payout_notification">Payout Notification</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="Email subject..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">HTML Content</label>
                    <Textarea 
                      placeholder="Email content..." 
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
                <Button className="mt-6">Save Email Template</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Advertisement Management Component
  const AdManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Management</CardTitle>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Create New Ad
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Placement</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Impressions</th>
                  <th className="text-left p-2">Clicks</th>
                  <th className="text-left p-2">CTR</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">Premium Listings Promo</div>
                    <div className="text-sm text-gray-500">Promote premium listing features</div>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">Banner</Badge>
                  </td>
                  <td className="p-2">Header</td>
                  <td className="p-2">
                    <Badge variant="default">Active</Badge>
                  </td>
                  <td className="p-2">45,678</td>
                  <td className="p-2">1,234</td>
                  <td className="p-2">2.7%</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">Share Tools Feature</div>
                    <div className="text-sm text-gray-500">Highlight new share tools</div>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">Sidebar</Badge>
                  </td>
                  <td className="p-2">Dashboard</td>
                  <td className="p-2">
                    <Badge variant="secondary">Paused</Badge>
                  </td>
                  <td className="p-2">12,345</td>
                  <td className="p-2">567</td>
                  <td className="p-2">4.6%</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // System Health & Logs Component
  const SystemHealth = () => (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium">Database</div>
            <div className="text-xs text-gray-600">Healthy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium">API</div>
            <div className="text-xs text-gray-600">Operational</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium">CDN</div>
            <div className="text-xs text-gray-600">Degraded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium">Email</div>
            <div className="text-xs text-gray-600">Operational</div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>System Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="flex items-center space-x-3 p-2 bg-green-50 rounded text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500">2024-08-14 10:30:45</span>
              <span>User registration successful: user@example.com</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500">2024-08-14 10:28:12</span>
              <span>Share link created: UOB-ABC123</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-red-50 rounded text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-500">2024-08-14 10:25:33</span>
              <span>Fraud alert: Suspicious activity detected for user ID 12345</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-500">2024-08-14 10:22:18</span>
              <span>Payment processing delayed: High transaction volume</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-green-50 rounded text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500">2024-08-14 10:20:45</span>
              <span>Bacon payout completed: $125.50 to user@test.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Main render function
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">University of Bacon Administration</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="font-medium">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="flex">
        <nav className="w-64 bg-white border-r min-h-screen p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'listings' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Listings</span>
            </button>
            <button
              onClick={() => setActiveTab('sharelinks')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'sharelinks' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Link2 className="w-5 h-5" />
              <span>Share Links</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'reports' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Flag className="w-5 h-5" />
              <span>Fraud Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'ads' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>Advertisements</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Site Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'system' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>System Health</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'listings' && <ListingsManagement />}
          {activeTab === 'sharelinks' && <ShareLinksAnalytics />}
          {activeTab === 'reports' && <FraudReports />}
          {activeTab === 'ads' && <AdManagement />}
          {activeTab === 'settings' && <SiteSettings />}
          {activeTab === 'system' && <SystemHealth />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;import React, { useState, useEffect } from 'react';
