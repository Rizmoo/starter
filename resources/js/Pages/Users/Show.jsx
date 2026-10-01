import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { DataTable } from '@/Components/ui/data-table';
import { DataTableColumnHeader } from '@/Components/ui/data-table-column-header';
import {
  Mail,
  Shield,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Activity,
  Calendar,
  Info,
  History,
  Search,
  Phone,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  KeyRound,
} from 'lucide-react';
import { Label } from '@/Components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useToast } from '@/Hooks/use-toast';
import { ConfirmDialog } from '@/Components/ui/confirm-dialog';
import UserFormDialog from '@/Components/users/user-form-dialog';
import { Link, router } from '@inertiajs/react';

function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) {
    return 'Never';
  }

  return new Date(value).toLocaleString();
}

function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'active') {
    return <Badge className="w-fit shrink-0">Active</Badge>;
  }

  if (normalized === 'suspended') {
    return <Badge variant="destructive" className="w-fit shrink-0">Suspended</Badge>;
  }

  return <Badge variant="secondary" className="w-fit shrink-0">Inactive</Badge>;
}

function DetailItem({ label, children }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-medium break-words">{children}</div>
    </div>
  );
}

function permissionGroups(permissions) {
  const keys = (permissions || []).map((permission) => (
    typeof permission === 'string' ? permission : permission.name
  )).filter(Boolean);

  if (keys.includes('*')) {
    return [{ label: 'Full access', items: ['*'] }];
  }

  const groups = new Map();

  keys.forEach((key) => {
    const [module] = key.split('.');
    const label = module || 'other';

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label).push(key);
  });

  return Array.from(groups, ([label, items]) => ({ label, items }));
}

export default function UserShowPage({ id }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [logs, setLogs] = useState([]);
  const [logMeta, setLogMeta] = useState(null);
  const [logPage, setLogPage] = useState(1);
  const [logPageLength, setLogPageLength] = useState(15);
  const [logSearch, setLogSearch] = useState('');
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: 'delete',
    loading: false,
  });

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await window.axios.get(`/admin/users/${id}`);
      setUser(response.data);
    } catch (requestError) {
      setError('Unable to load user details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadLogs = useCallback(async () => {
    try {
      setIsLogsLoading(true);
      const response = await window.axios.get(`/admin/users/${id}/logs`, {
        params: {
          page: logPage,
          per_page: logPageLength,
          search: logSearch || undefined,
        },
      });
      setLogs(response.data?.data || []);
      setLogMeta(response.data || null);
    } catch (loadError) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load activity logs.' });
    } finally {
      setIsLogsLoading(false);
    }
  }, [id, logPage, logPageLength, logSearch, toast]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const rolesResponse = await window.axios.get('/admin/roles', { params: { per_page: 100 } });
        setRoles(rolesResponse.data?.data || []);
      } catch {
        // Silently fail for options
      }
    };
    loadOptions();
  }, []);

  const handleAction = (type) => {
    setConfirmState({
      open: true,
      type,
      loading: false,
    });
  };

  const executeAction = async () => {
    const { type } = confirmState;
    setConfirmState((prev) => ({ ...prev, loading: true }));
    try {
      if (type === 'delete') {
        await window.axios.delete(`/admin/users/${id}`);
        toast({ title: 'User deleted', description: 'User has been removed from the system.' });
        router.visit(route('users.page'));
      } else if (type === 'suspend') {
        await window.axios.patch(`/admin/users/${id}/suspend`);
        toast({ title: 'User suspended', description: 'Access has been revoked.' });
        loadUser();
      } else if (type === 'activate') {
        await window.axios.patch(`/admin/users/${id}/activate`);
        toast({ title: 'User activated', description: 'Access has been restored.' });
        loadUser();
      }
    } catch (actionError) {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: actionError.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setConfirmState((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  const logColumns = useMemo(() => [
    {
      accessorKey: 'created_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs font-medium">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'action',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => {
        const parts = row.original.action.split('.');
        const label = parts.pop().replace(/_/g, ' ');
        return (
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold capitalize">{label}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {parts.join('.')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'actor',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Actor" />,
      cell: ({ row }) => {
        const actor = row.original.actor;
        const isSelf = actor?.id === user?.id;
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 shrink-0 rounded-full ${isSelf ? 'bg-primary' : 'bg-amber-500'}`}></div>
            <span className="text-xs font-semibold">{isSelf ? 'Self' : (actor?.name || 'System')}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setSelectedLog(row.original);
            setIsLogDialogOpen(true);
          }}
        >
          <Info className="h-4 w-4" />
        </Button>
      ),
    },
  ], [user]);

  if (isLoading) {
    return (
      <DashboardLayout title="Loading User...">
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout title="Error">
        <div className="flex h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="text-xl font-semibold">{error || 'User not found'}</p>
          <Button onClick={() => router.visit(route('users.page'))}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleName = user.roles?.[0]?.name || user.role?.name || 'No role';
  const groupedPermissions = permissionGroups(user.all_permissions);
  const isActive = user.status === 'active';

  return (
    <DashboardLayout title={`User: ${user.name}`}>
      <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href={route('users.page')} className="hover:text-primary">Users</Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="truncate text-foreground">Profile</span>
            </div>
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{user.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => setDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>

            <div className="hidden items-center gap-2 sm:flex">
              {isActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40"
                  onClick={() => handleAction('suspend')}
                >
                  <UserX className="mr-2 h-4 w-4" /> Suspend
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                  onClick={() => handleAction('activate')}
                >
                  <UserCheck className="mr-2 h-4 w-4" /> Activate
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => handleAction('delete')}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 sm:hidden">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isActive ? (
                  <DropdownMenuItem onClick={() => handleAction('suspend')}>
                    <UserX className="mr-2 h-4 w-4" /> Suspend
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleAction('activate')}>
                    <UserCheck className="mr-2 h-4 w-4" /> Activate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => handleAction('delete')}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className="h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                <AvatarImage src={user.profile_picture_url || user.social_avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary sm:text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={user.status} />
                  <Badge variant="outline" className="w-fit shrink-0">
                    {roleName}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone_number ? (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{user.phone_number}</span>
                      {user.phone_verified_at ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      )}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>Last seen {formatDateTime(user.last_login_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 sm:inline-flex sm:w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Info className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <History className="h-4 w-4" /> Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Profile, role, and contact details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem label="Email">{user.email}</DetailItem>
                    <DetailItem label="Phone">{user.phone_number || '—'}</DetailItem>
                    <DetailItem label="Role">{roleName}</DetailItem>
                    <DetailItem label="Status">
                      <span className="capitalize">{user.status || '—'}</span>
                    </DetailItem>
                    <DetailItem label="Joined">{formatDate(user.created_at)}</DetailItem>
                    <DetailItem label="Last login">{formatDateTime(user.last_login_at)}</DetailItem>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Authentication and account controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">Social sign-in</span>
                    <Badge variant={user.social_provider ? 'default' : 'outline'} className="shrink-0 uppercase">
                      {user.social_provider || 'Off'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm">
                      <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                      Password change
                    </span>
                    <Badge variant={user.force_password_change ? 'destructive' : 'outline'} className="shrink-0">
                      {user.force_password_change ? 'Required' : 'Normal'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      Two-factor
                    </span>
                    <Badge variant={user.two_factor_confirmed_at ? 'default' : 'outline'} className="shrink-0">
                      {user.two_factor_confirmed_at ? 'On' : 'Off'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Merged role and extra user-level grants.</CardDescription>
                </CardHeader>
                <CardContent>
                  {groupedPermissions.length === 0 ? (
                    <p className="py-4 text-center text-sm italic text-muted-foreground">
                      No permissions assigned.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {groupedPermissions.map((group) => (
                        <div key={group.label} className="min-w-0 space-y-2">
                          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {group.label}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {group.items.map((name) => (
                              <Badge key={name} variant="secondary" className="max-w-full truncate font-normal">
                                {name === '*' ? 'Full system access' : name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Activity log</CardTitle>
                <CardDescription>Administrative and security events for this user.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <DataTable
                  columns={logColumns}
                  data={logs}
                  tableName="user_logs"
                  searchKey="action"
                  searchPlaceholder="Search events..."
                  searchValue={logSearch}
                  onSearch={(value) => {
                    setLogSearch(value || '');
                    setLogPage(1);
                  }}
                  isLoading={isLogsLoading}
                  meta={logMeta}
                  pageLength={logPageLength}
                  onPageLengthChange={(value) => {
                    setLogPageLength(value);
                    setLogPage(1);
                  }}
                  onPageChange={(value) => setLogPage(value)}
                  onExportCsv={() => { window.location.href = route('admin.users.logs.export', user.id); }}
                  companyDetails={{ name: 'BizLav' }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Event details
              </DialogTitle>
              <DialogDescription>
                Payload and context for this audit record.
              </DialogDescription>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-6 py-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Event</div>
                    <div className="text-base font-semibold capitalize">
                      {selectedLog.action.split('.').pop().replace(/_/g, ' ')}
                    </div>
                    <div className="mt-1 break-all text-xs text-muted-foreground">{selectedLog.action}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Timestamp</div>
                    <div className="text-base font-semibold">
                      {formatDateTime(selectedLog.created_at)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-muted-foreground">Actor</Label>
                    <div className="text-sm font-medium">{selectedLog.actor?.name || 'System'}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-muted-foreground">IP address</Label>
                    <div className="font-mono text-sm tracking-tight">{selectedLog.ip_address || '—'}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Search className="h-3 w-3" /> State change
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="inline-block rounded bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">Before</div>
                      <div className="min-h-[100px] overflow-x-auto rounded-lg border bg-card p-3 font-mono text-[11px]">
                        {selectedLog.before ? (
                          <pre>{JSON.stringify(selectedLog.before, null, 2)}</pre>
                        ) : (
                          <span className="italic text-muted-foreground">No prior record</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="inline-block rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">After</div>
                      <div className="min-h-[100px] overflow-x-auto rounded-lg border bg-card p-3 font-mono text-[11px]">
                        {selectedLog.after ? (
                          <pre>{JSON.stringify(selectedLog.after, null, 2)}</pre>
                        ) : (
                          <span className="italic text-muted-foreground">No changes</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">User agent</Label>
                  <div className="break-words rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed">
                    {selectedLog.user_agent || '—'}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <UserFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode="edit"
          user={user}
          roles={roles}
          onSaved={loadUser}
        />

        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
          onConfirm={executeAction}
          loading={confirmState.loading}
          title={
            confirmState.type === 'delete' ? 'Delete User'
              : confirmState.type === 'suspend' ? 'Suspend Access' : 'Activate User'
          }
          description={
            confirmState.type === 'delete'
              ? `Are you sure you want to delete ${user.name}? This will remove all their access immediately and cannot be undone.`
              : confirmState.type === 'suspend'
                ? `Revoke system access for ${user.name}? They will be unable to log in until reactivated.`
                : `Restore system access for ${user.name}?`
          }
          variant={confirmState.type === 'activate' ? 'default' : 'destructive'}
          confirmText={
            confirmState.type === 'delete' ? 'Delete User'
              : confirmState.type === 'suspend' ? 'Suspend Access' : 'Activate Access'
          }
        />
      </div>
    </DashboardLayout>
  );
}
