import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Smartphone, Monitor, Globe } from "lucide-react";

interface SecurityItem {
  id: string;
  title: string;
  description: string;
  status: 'secure' | 'warning' | 'danger';
  action: string;
  icon: React.ReactNode;
}

interface ActivityItem {
  id: string;
  time: string;
  action: string;
  device: string;
  location?: string;
  status: 'success' | 'warning' | 'info';
}

export const SecurityDashboard = () => {
  const [securityItems] = useState<SecurityItem[]>([
    {
      id: '2fa',
      title: 'Two-Factor Authentication',
      description: 'Enabled via SMS',
      status: 'secure',
      action: 'Manage',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      id: 'password',
      title: 'Password Security',
      description: 'Strong password, last changed 30 days ago',
      status: 'secure',
      action: 'Change',
      icon: <Key className="w-5 h-5" />
    },
    {
      id: 'login-alerts',
      title: 'Login Alerts',
      description: 'New device login detected',
      status: 'warning',
      action: 'Review',
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ]);

  const [recentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      time: '2 hours ago',
      action: 'Login from Dallas, TX',
      device: 'iPhone 15',
      location: 'Dallas, TX',
      status: 'success'
    },
    {
      id: '2',
      time: '1 day ago',
      action: 'Password change',
      device: 'MacBook Pro',
      status: 'info'
    },
    {
      id: '3',
      time: '3 days ago',
      action: 'New device registered',
      device: 'Chrome Browser',
      location: 'Austin, TX',
      status: 'warning'
    }
  ]);

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'network',
    showEarnings: true,
    activitySharing: true
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
        return <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))]" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-[hsl(var(--destructive))]" />;
      default:
        return <Shield className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'secure':
        return <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20">Secure</Badge>;
      case 'warning':
        return <Badge className="bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20">Warning</Badge>;
      case 'danger':
        return <Badge className="bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/20">Action Required</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getActivityIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (device.toLowerCase().includes('mac') || device.toLowerCase().includes('windows') || device.toLowerCase().includes('laptop')) {
      return <Monitor className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[hsl(var(--brand-academic))]" />
            <CardTitle className="font-display text-xl text-[hsl(var(--brand-academic))]">
              Account Security
            </CardTitle>
          </div>
          <CardDescription>
            Protect your University of Bacon account and earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityItems.map((item) => (
            <div key={item.id} className="security-item flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--muted))]/50 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[hsl(var(--brand-academic))]">{item.title}</h4>
                    {getStatusIcon(item.status)}
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(item.status)}
                <Button variant="outline" size="sm">
                  {item.action}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-[hsl(var(--brand-academic))]" />
            <CardTitle className="font-display text-xl text-[hsl(var(--brand-academic))]">
              Privacy Settings
            </CardTitle>
          </div>
          <CardDescription>
            Control how your information is shared within the University
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="privacy-item">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-[hsl(var(--foreground))]">Profile Visibility</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Control who can see your profile information
                </p>
              </div>
              <Select 
                value={privacySettings.profileVisibility} 
                onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="network">Network Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="privacy-item">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-[hsl(var(--foreground))]">Earnings Display</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Show earnings information on your profile
                </p>
              </div>
              <Switch 
                checked={privacySettings.showEarnings}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showEarnings: checked }))}
              />
            </div>
          </div>

          <div className="privacy-item">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-[hsl(var(--foreground))]">Activity Sharing</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Allow others to see your referral activity
                </p>
              </div>
              <Switch 
                checked={privacySettings.activitySharing}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, activitySharing: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="font-display text-xl text-[hsl(var(--brand-academic))] flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Recent Security Activity
          </CardTitle>
          <CardDescription>
            Monitor recent logins and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item flex items-center gap-4 p-3 rounded-lg bg-[hsl(var(--muted))]/30 hover:bg-[hsl(var(--muted))]/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                  {getActivityIcon(activity.device)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {activity.action}
                    </span>
                    {activity.location && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.location}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.device}</span>
                  </div>
                </div>
                <Badge variant={activity.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                  {activity.status === 'success' ? 'Verified' : activity.status === 'warning' ? 'Review' : 'Info'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};