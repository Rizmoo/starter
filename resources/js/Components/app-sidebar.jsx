import React, { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Users,
  Settings, BarChart, PanelLeft,
  Shield, Bell, Building, MonitorCog,
  Building2, CreditCard, LayoutList, Settings2, Package,
} from 'lucide-react';
import { cn } from '@/Lib/utils';
import { Button } from '@/Components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { AppLogo } from './app-logo';

import { TENANT_NAV_ITEMS } from '@/Config/tenant-navigation';
import { PLATFORM_NAV_ITEMS } from '@/Config/platform-navigation';

/** Map icon name strings (from config/modules.php) to Lucide components. */
const ICON_MAP = {
  LayoutDashboard, Users, Settings, BarChart, Shield, Bell, Building,
  MonitorCog, Building2, CreditCard, LayoutList, Settings2, Package,
};

function resolveIcon(icon) {
  if (!icon) { return LayoutDashboard; }
  return ICON_MAP[icon] ?? LayoutDashboard;
}

function resolveActiveModule(url, items) {
  const found = items.find((item) =>
    item.groups?.some((group) => group.links.some((link) => url.startsWith(link.href)))
  );

  return found?.id ?? items[0]?.id;
}

/**
 * Hydrate a raw nav item from the modules config (icons are serialized as strings)
 * into a fully resolved item with Lucide icon components.
 */
function hydrateModuleNavItem(item) {
  return {
    ...item,
    icon: resolveIcon(item.icon),
    groups: (item.groups ?? []).map((group) => ({
      ...group,
      links: (group.links ?? []).map((link) => ({
        ...link,
        icon: resolveIcon(link.icon),
      })),
    })),
  };
}

function SidebarNav({ activeModule, setActiveModule, navItems }) {
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
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.1),0_6px_18px_rgba(0,0,0,0.4)]"
                  : "text-[#7f8ba1] hover:text-[#d3d9e4] hover:bg-[#141d2c]"
              )}
            >
              <item.icon className="!h-4 !w-4" />
            </button>
            {isActive && (
              <div className="absolute right-0 top-2 bottom-2 w-0.5 bg-primary rounded-l-full shadow-[0_0_8px_hsl(var(--primary)/0.4)]" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function AppSidebar({ isMobileOpen = false, onCloseMobileMenu = () => {} }) {
  const { url, props } = usePage();
  const company = props.company;
  const isPlatformAdmin = props.auth?.is_platform_admin;

  // Merge base nav items with any enabled module nav items.
  const navItems = useMemo(() => {
    const baseNav = isPlatformAdmin ? PLATFORM_NAV_ITEMS : TENANT_NAV_ITEMS;
    const hydratedBaseNav = baseNav.map(hydrateModuleNavItem);
    
    // Only merge non-platform modules if we are NOT a platform admin, 
    // or if the module is specifically for the platform.
    const moduleNavItems = (props.modules?.nav ?? [])
      .map(hydrateModuleNavItem);
      
    // If we are platform admin, we only show platform-specific nav items.
    // The PLATFORM_NAV_ITEMS already contains the core platform stuff.
    return [...hydratedBaseNav, ...moduleNavItems.filter(m => isPlatformAdmin ? m.id.startsWith('platform') : !m.id.startsWith('platform'))];
  }, [props.modules?.nav, isPlatformAdmin]);

  const [activeModule, setActiveModule] = useState(() => resolveActiveModule(url, navItems));
  const [isSecondaryCollapsed, setIsSecondaryCollapsed] = useState(false);

  const appName = company?.name || import.meta.env.VITE_APP_NAME || 'Laravel';
  const appWords = appName.trim().split(/\s+/).filter(Boolean);
  const appInitials = appWords.length > 1
    ? appWords.slice(0, 2).map((word) => word[0]?.toUpperCase() || '').join('')
    : (appWords[0]?.slice(0, 2).toUpperCase() || 'LA');

  const handleModuleClick = (id) => {
    setActiveModule(id);
    setIsSecondaryCollapsed(false);
  };

  React.useEffect(() => {
    const moduleId = resolveActiveModule(url, navItems);
    setActiveModule(moduleId);
    setIsSecondaryCollapsed(false);

    onCloseMobileMenu();
  }, [url, onCloseMobileMenu, navItems]);

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
        <aside className="w-[4.5rem] h-full border-r border-[#1E222B] bg-[#0B0E14] flex flex-col flex-shrink-0">
          <div className="h-14 flex items-center justify-center border-b border-[#1E222B]">
            <AppLogo showText={false} logoUrl={company?.logo_url} name={company?.name} />
          </div>
          <div className="flex-1 py-4 overflow-y-auto pb-20">
            <SidebarNav activeModule={activeModule} setActiveModule={handleModuleClick} navItems={navItems} />
          </div>
          <div className="h-14 flex items-center justify-center border-t border-[#1E222B]">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-extrabold border border-primary/20 overflow-hidden">
              {company?.logo_url ? (
                <img src={company.logo_url} className="h-full w-full object-contain p-1" alt="Logo" />
              ) : (
                appInitials
              )}
            </div>
          </div>
        </aside>

        {activeNavItem && (
          <aside
            className={cn(
              'bg-[#0B0E14] border-r border-[#1E222B] flex flex-col shadow-xl transition-all duration-300 ease-in-out origin-left overflow-hidden',
              isSecondaryCollapsed ? 'w-0 border-r-0' : 'w-64'
            )}
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#1E222B] min-w-[16rem]">
              <span className="text-sm font-bold text-white tracking-tight uppercase tracking-widest text-[11px] opacity-70">
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

            <div className="flex-1 overflow-y-auto px-2 py-4 min-w-[16rem]">
              <Accordion
                type="multiple"
                defaultValue={activeNavItem.groups?.map((_, i) => `item-${i}`)}
                className="w-full space-y-2"
              >
                {activeNavItem.groups?.map((group, gi) => (
                  <AccordionItem key={gi} value={`item-${gi}`} className="border-none">
                    <AccordionTrigger className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest hover:no-underline hover:text-gray-300">
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
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group relative overflow-hidden',
                              isLinkActive
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-400 hover:text-white hover:bg-[#181C23]'
                            )}
                          >
                            <LinkIcon
                              className={cn(
                                'h-4 w-4 shrink-0 transition-colors',
                                isLinkActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'
                              )}
                            />
                            <span className="truncate">{link.label}</span>
                            {isLinkActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                            )}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="p-4 border-t border-[#1E222B] bg-[#0D1017]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-[10px] font-black shadow-lg shadow-primary/20 overflow-hidden">
                  {company?.logo_url ? (
                    <img src={company.logo_url} className="h-full w-full object-contain p-1" alt="Logo" />
                  ) : (
                    appInitials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white truncate">{appName}</p>
                  <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest font-medium">
                    {isPlatformAdmin ? 'Platform Admin' : 'Worksuite'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
