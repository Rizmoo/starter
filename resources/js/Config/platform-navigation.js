import {
  MonitorCog, Building2, Users, Settings2, LayoutDashboard,
} from 'lucide-react';

export const PLATFORM_NAV_ITEMS = [
  {
    id: 'platform-dashboard',
    label: 'Platform',
    icon: 'MonitorCog',
    groups: [
      {
        label: 'Management',
        links: [
          { href: '/platform', label: 'Overview', icon: 'LayoutDashboard' },
          { href: '/platform/companies', label: 'Companies', icon: 'Building2' },
          { href: '/platform/users', label: 'All Users', icon: 'Users' },
        ]
      },
      {
        label: 'Configuration',
        links: [
          { href: '/platform/settings', label: 'Platform Settings', icon: 'Settings2' },
        ]
      },
    ]
  },
];
