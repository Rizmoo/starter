import {
  LayoutDashboard, Users, Settings, Shield, Bell,
} from 'lucide-react';

export const NAV_ITEMS = [
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
          { href: '/notifications', label: 'Notifications', icon: 'Bell' },
        ]
      },
    ]
  },
];
