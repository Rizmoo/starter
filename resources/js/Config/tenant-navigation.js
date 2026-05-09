import {
  LayoutDashboard, Users, Settings, Building, Shield, Bell,
} from 'lucide-react';

export const TENANT_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/dashboard', label: 'Main Dashboard', icon: 'LayoutDashboard' },
        ]
      },
    ]
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'Users',
    groups: [
      {
        label: 'Management',
        links: [
          { href: '/users', label: 'All Users', icon: 'Users' },
          { href: '/users/roles', label: 'Roles & Permissions', icon: 'Shield' },
        ]
      },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    groups: [
      {
        label: 'Configuration',
        links: [
          { href: '/settings', label: 'General', icon: 'Settings' },
          { href: '/settings/api-keys', label: 'API Keys', icon: 'Shield' },
          { href: '/settings/company', label: 'Company', icon: 'Building' },
          { href: '/settings/branches', label: 'Branches', icon: 'Building' },
          { href: '/notifications', label: 'Notifications', icon: 'Bell' },
        ]
      },
    ]
  },
];
