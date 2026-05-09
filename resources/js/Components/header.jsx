import { Link, usePage, router } from '@inertiajs/react';
import { ThemeToggle } from '@/Components/theme-toggle';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Bell, LogOut, Settings, User, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle, PanelLeft, Building2 } from 'lucide-react';
import axios from 'axios';

function getBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
    href: '/' + parts.slice(0, index + 1).join('/'),
    isLast: index === parts.length - 1,
  }));
}

const typeIcon = {
  info:    <Info className="h-4 w-4 text-blue-500" />,
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  error:   <XCircle className="h-4 w-4 text-red-500" />,
};

export default function Header({ onToggleMobileMenu }) {
  const { url, props } = usePage();
  const user = props.auth?.user ?? null;
  const branches = props.branch_context?.branches ?? [];
  const currentBranch = props.branch_context?.current_branch ?? null;
  const branchScopeMode = props.branch_context?.mode ?? 'single';
  const breadcrumbs = getBreadcrumbs(url);

  const { items: notifications = [], unread_count: unreadCount = 0 } =
    props.notifications ?? {};

  const isPlatformAdmin = props.auth?.is_platform_admin;

  const handleLogout = () => {
    router.post(isPlatformAdmin ? route('platform.logout') : '/logout');
  };

  const handleMarkRead = (id) => {
    axios.patch(`/notifications/${id}/read`).then(() => router.reload({ only: ['notifications'] }));
  };

  const handleMarkAllRead = () => {
    axios.patch('/notifications/read-all').then(() => router.reload({ only: ['notifications'] }));
  };

  const handleBranchSwitch = (mode, branchId = null) => {
    router.post('/branches/switch', {
      mode,
      branch_id: branchId,
    }, {
      preserveScroll: true,
      preserveState: true,
      only: ['branch_context', 'flash'],
    });
  };

  const activeBranchLabel = branchScopeMode === 'all'
    ? 'All My Branches'
    : (currentBranch?.name || 'Select Branch');

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onToggleMobileMenu}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Show menu</span>
      </Button>

      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/50">/</span>}
            <span className={crumb.isLast ? 'text-foreground font-medium' : ''}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {/* Branch switcher - Hidden for Platform Admins */}
        {!isPlatformAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="max-w-36 truncate">{activeBranchLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 z-[200]">
              <DropdownMenuLabel>Branch Context</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={branchScopeMode === 'all'}
                onCheckedChange={() => handleBranchSwitch('all')}
              >
                All My Branches
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {branches.map((branch) => (
                <DropdownMenuCheckboxItem
                  key={branch.id}
                  checked={branchScopeMode === 'single' && currentBranch?.id === branch.id}
                  onCheckedChange={() => handleBranchSwitch('single', branch.id)}
                >
                  {branch.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications dropdown - Hide for Platform Admins if not implemented yet */}
        {!isPlatformAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 z-[200]">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.read_at && handleMarkRead(n.id)}
                    className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read_at ? 'bg-muted/30' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {typeIcon[n.data?.type] ?? typeIcon.info}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{n.data?.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.data?.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{n.created_at}</p>
                    </div>
                    {!n.read_at && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                ))
              )}

              <DropdownMenuSeparator />
              <div className="p-1">
                <Link
                  href="/notifications"
                  className="flex w-full items-center justify-center rounded-sm py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile_picture_url || user?.social_avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-[200]" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Guest'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'guest@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isPlatformAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><User className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
