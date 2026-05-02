import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Settings, BarChart, PanelLeft,
  FileText, Tags, TrendingUp, Wallet, Receipt,
  Building, CalendarCheck2, Shield, Bell
} from 'lucide-react';
import { cn } from '@/Lib/utils';
import { Button } from '@/Components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { AppLogo } from './app-logo';

function resolveActiveModule(url) {
  const found = navItems.find((item) =>
    item.groups?.some((group) => group.links.some((link) => url.startsWith(link.href)))
  );

  return found?.id ?? navItems[0].id;
}

// ─── Navigation Config ──────────────────────────────────────────────
// Customize this array to define your sidebar navigation
export const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
          { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart },
        ]
      },
    ]
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    groups: [
      {
        label: 'Management',
        links: [
          { href: '/users', label: 'All Users', icon: Users },
          { href: '/users/roles', label: 'Roles & Permissions', icon: Shield },
        ]
      },
    ]
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    groups: [
      {
        label: 'Catalog',
        links: [
          { href: '/products', label: 'All Products', icon: Package },
          { href: '/products/categories', label: 'Categories', icon: Tags },
        ]
      },
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    groups: [
      {
        label: 'Management',
        links: [
          { href: '/orders', label: 'All Orders', icon: ShoppingCart },
          { href: '/orders/invoices', label: 'Invoices', icon: Receipt },
          { href: '/orders/quotes', label: 'Quotes', icon: FileText },
        ]
      },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/finance', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/finance/transactions', label: 'Transactions', icon: TrendingUp },
          { href: '/finance/reports', label: 'Reports', icon: BarChart },
        ]
      },
    ]
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarCheck2,
    groups: [
      {
        label: 'Schedule',
        links: [
          { href: '/calendar', label: 'Calendar', icon: CalendarCheck2 },
        ]
      },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    groups: [
      {
        label: 'Configuration',
        links: [
          { href: '/settings', label: 'General', icon: Settings },
          { href: '/settings/api-keys', label: 'API Keys', icon: Shield },
          { href: '/settings/company', label: 'Company', icon: Building },
          { href: '/settings/notifications', label: 'Notifications', icon: Bell },
        ]
      },
    ]
  },
];

function SidebarNav({ activeModule, setActiveModule }) {
  const { url } = usePage();
  return (
    <ul className="flex w-full min-w-0 flex-col gap-2">
      {navItems.map((item) => {
        const isActive = activeModule
          ? activeModule === item.id
          : item.groups?.some((g) => g.links.some((l) => url.startsWith(l.href)));

        return (
          <li key={item.id} className="group/menu-item relative">
            <button
              type="button"
              title={item.label}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-[#152133] text-[#2fdc8f] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14),0_6px_18px_rgba(21,33,51,0.55)]"
                  : "text-[#7f8ba1] hover:text-[#d3d9e4] hover:bg-[#141d2c]"
              )}
            >
              <item.icon className="!h-4 !w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Main Sidebar Component ─────────────────────────────────────────
export default function AppSidebar({ isMobileOpen = false, onCloseMobileMenu = () => {} }) {
  const { url, props } = usePage();
  const [activeModule, setActiveModule] = useState(() => resolveActiveModule(url));
  const [isSecondaryCollapsed, setIsSecondaryCollapsed] = useState(false);
  const currentUser = props?.auth?.user || null;
  const currentUserName = currentUser?.name || 'User';
  const currentUserRole = currentUser?.roles?.[0] || currentUser?.role || 'Admin';

  const handleModuleClick = (id) => {
    setActiveModule(id);
    setIsSecondaryCollapsed(false);
  };

  // Keep sidebar module selection in sync with route changes.
  React.useEffect(() => {
    const moduleId = resolveActiveModule(url);
    setActiveModule(moduleId);
    setIsSecondaryCollapsed(false);

    onCloseMobileMenu();
  }, [url, onCloseMobileMenu]);

  // Find the active nav item
  const activeNavItem = navItems.find((item) => item.id === activeModule);

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onCloseMobileMenu}
      />

      <div
        className={cn(
          'h-svh shrink-0 z-50 transition-transform duration-300 ease-out md:sticky md:top-0 md:flex',
          'fixed top-0 left-0 flex',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Icon rail */}
        <aside className="w-[4.5rem] h-full border-r border-[#1E222B] bg-[#0B0E14] flex flex-col flex-shrink-0">
          <div className="h-14 flex items-center justify-center border-b border-[#1E222B]">
            <AppLogo showText={false} />
          </div>
          <div className="flex-1 py-4 overflow-y-auto">
            <SidebarNav activeModule={activeModule} setActiveModule={handleModuleClick} />
          </div>
          <div className="h-14 flex items-center justify-center border-t border-[#1E222B]">
            <div className="h-8 w-8 rounded-full bg-[#181C23] flex items-center justify-center text-xs font-bold text-gray-400">
              N
            </div>
          </div>
        </aside>

        {/* Secondary panel */}
        {activeNavItem && (
          <aside
            className={cn(
              'bg-[#0B0E14] border-r border-[#1E222B] flex flex-col shadow-xl transition-all duration-300 ease-in-out origin-left overflow-hidden',
              isSecondaryCollapsed ? 'w-0 border-r-0' : 'w-64'
            )}
          >
            {/* Panel Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#1E222B] min-w-[16rem]">
              <span className="text-sm font-bold text-white tracking-tight">
                {activeNavItem.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={() => setIsSecondaryCollapsed(true)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Panel Content (Accordions) */}
            <div className="flex-1 overflow-y-auto px-2 py-4 min-w-[16rem]">
              <Accordion
                type="multiple"
                defaultValue={activeNavItem.groups?.map((_, i) => `item-${i}`)}
                className="w-full space-y-2"
              >
                {activeNavItem.groups?.map((group, gi) => (
                  <AccordionItem key={gi} value={`item-${gi}`} className="border-none">
                    <AccordionTrigger className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:no-underline hover:text-gray-300">
                      {group.label}
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2 space-y-1">
                      {group.links.map((link) => {
                        const LinkIcon = link.icon;
                        const isLinkActive = url === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onCloseMobileMenu}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 group',
                              isLinkActive
                                ? 'text-green-500 bg-[#181C23] shadow-sm'
                                : 'text-gray-400 hover:text-green-500 hover:bg-[#181C23]/50'
                            )}
                          >
                            <LinkIcon
                              className={cn(
                                'h-4.5 w-4.5 shrink-0 transition-colors',
                                isLinkActive ? 'text-green-500' : 'text-gray-500 group-hover:text-green-500'
                              )}
                            />
                            <span className="truncate">{link.label}</span>
                            {isLinkActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            )}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Panel Footer */}
            <div className="p-4 border-t border-[#1E222B] bg-[#0D1017]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                  <Building className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white truncate">{currentUserName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{currentUserRole}</p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
