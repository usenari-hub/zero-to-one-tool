import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, Shield, User, TrendingUp, DollarSign, Users, Award } from "lucide-react";

interface DashboardStats {
  totalEarnings: number;
  activeListings: number;
  referralChains: number;
  recentActivity: number;
}

interface DashboardHeaderProps {
  userName?: string;
  userLevel?: string;
  stats?: DashboardStats;
  className?: string;
}

export const DashboardHeader = ({ 
  userName = "Student", 
  userLevel = "Freshman",
  stats = {
    totalEarnings: 1250,
    activeListings: 3,
    referralChains: 8,
    recentActivity: 2
  },
  className = ""
}: DashboardHeaderProps) => {
  const [notifications] = useState(3);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'freshman': return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
      case 'sophomore': return 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]';
      case 'junior': return 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]';
      case 'senior': return 'bg-[hsl(var(--brand-academic))] text-white';
      case 'graduate': return 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white';
      case 'professor': return 'bg-gradient-to-r from-[hsl(var(--brand-academic))] to-[hsl(var(--primary))] text-white';
      case 'dean': return 'bg-gradient-elegant text-white';
      default: return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'freshman': return '👨‍🎓';
      case 'sophomore': return '📚';
      case 'junior': return '🎯';
      case 'senior': return '🏆';
      case 'graduate': return '👨‍💼';
      case 'professor': return '👨‍🏫';
      case 'dean': return '👑';
      default: return '👨‍🎓';
    }
  };

  return (
    <div className={`dashboard-header ${className}`}>
      {/* Main Header */}
      <Card className="border-none shadow-elegant bg-gradient-subtle">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-2xl text-white shadow-lg">
                  <User className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 text-2xl">
                  {getLevelIcon(userLevel)}
                </div>
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-[hsl(var(--brand-academic))]">
                  Welcome back, {userName}!
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getLevelColor(userLevel)} font-semibold`}>
                    {userLevel} Status
                  </Badge>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    University of Bacon
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Earnings</p>
                  <p className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Active Listings</p>
                  <p className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                    {stats.activeListings}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent))]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--accent))]" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Active Chains</p>
                  <p className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                    {stats.referralChains}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--secondary))]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[hsl(var(--secondary))]" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Recent Activity</p>
                  <p className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                    {stats.recentActivity}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};