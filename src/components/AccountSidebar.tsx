import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { BarChart3, CreditCard, FileText, History, Link2, Settings, Shield, UserCheck, Wallet, Share2, TrendingUp } from 'lucide-react';

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({ activeTab, onTabChange }) => {
  const sidebarItems = [
    {
      title: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: BarChart3
        }
      ]
    },
    {
      title: "Finances",
      items: [
        {
          id: "bacon-bank",
          label: "Bacon Bank",
          icon: Wallet
        },
        {
          id: "payment-methods",
          label: "Payment Methods",
          icon: CreditCard
        },
        {
          id: "payment-history",
          label: "Transaction History",
          icon: History
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          id: "verification",
          label: "Verification",
          icon: UserCheck
        },
        {
          id: "security",
          label: "Security",
          icon: Shield
        }
      ]
    }
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarContent className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--brand-academic))]">Account</h2>
          <p className="text-sm text-muted-foreground">Manage your University of Bacon account</p>
        </div>

        {sidebarItems.map((group) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={`w-full justify-start p-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-[hsl(var(--brand-academic))] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <div className="flex-1 text-left">
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};