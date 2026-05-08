import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { DataTableColumnHeader } from '@/Components/ui/data-table-column-header';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { MoreHorizontal, Plus, ShieldAlert, UserCheck, UserX, Trash2, KeyRound, Lock, UserMinus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import UserFormDialog from '@/Components/users/user-form-dialog';
import { Checkbox } from '@/Components/ui/checkbox';
import { ConfirmDialog } from '@/Components/ui/confirm-dialog';
import { useToast } from '@/Hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';

function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'active') {
    return <Badge>Active</Badge>;
  }

  if (normalized === 'suspended') {
    return <Badge variant="destructive">Suspended</Badge>;
  }

  return <Badge variant="secondary">Inactive</Badge>;
}

export default function UsersIndexPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(1);
  const [pageLength, setPageLength] = useState(15);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  const [bulkConfirmState, setBulkConfirmState] = useState({
    open: false,
    users: [],
    loading: false,
    clearSelection: null,
  });

  const [confirmState, setConfirmState] = useState({
    open: false,
    user: null,
    type: 'delete', // delete, suspend, activate
    loading: false,
  });

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await window.axios.get('/admin/users', {
        params: {
          page,
          per_page: pageLength,
          search: search || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      });

      setUsers(response.data?.data || []);
      setMeta(response.data || null);
    } catch (requestError) {
      const status = requestError?.response?.status;

      if (status === 403) {
        setError('You do not have permission to view users.');
      } else {
        setError('Unable to load users right now.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, pageLength, search, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [rolesResponse, branchesResponse] = await Promise.all([
          window.axios.get('/admin/roles', { params: { per_page: 100 } }),
          window.axios.get('/admin/branches', { params: { per_page: 200, status: 'active' } }),
        ]);

        setRoles(rolesResponse.data?.data || []);
        setBranches(branchesResponse.data?.data || []);
      } catch {
        setRoles([]);
        setBranches([]);
      }
    };

    loadOptions();
  }, []);

  const handleUserAction = async (user, type) => {
    setConfirmState({
      open: true,
      user,
      type,
      loading: false,
    });
  };

  const executeUserAction = async () => {
    const { user, type } = confirmState;
    if (!user) return;

    setConfirmState(prev => ({ ...prev, loading: true }));
    try {
      if (type === 'delete') {
        await window.axios.delete(`/admin/users/${user.id}`);
        toast({ title: 'User deleted', description: `${user.name} has been removed.` });
      } else if (type === 'suspend') {
        await window.axios.patch(`/admin/users/${user.id}/suspend`);
        toast({ title: 'User suspended', description: `${user.name} access has been revoked.` });
      } else if (type === 'activate') {
        await window.axios.patch(`/admin/users/${user.id}/activate`);
        toast({ title: 'User activated', description: `${user.name} can now access the system.` });
      }
      loadUsers();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: e.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setConfirmState(prev => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleBulkPasswordReset = async (selectedUsers, clearSelection) => {
    setBulkConfirmState({
      open: true,
      users: selectedUsers,
      loading: false,
      clearSelection,
    });
  };

  const executeBulkPasswordReset = async () => {
    const { users, clearSelection } = bulkConfirmState;
    setBulkConfirmState(prev => ({ ...prev, loading: true }));
    setIsBulkSubmitting(true);
    
    try {
      await window.axios.post('/admin/users/bulk/force-password-change', {
        user_ids: users.map(u => u.id),
      });
      toast({
        title: 'Security policy updated',
        description: `Forced password reset for ${users.length} team members.`,
      });
      clearSelection?.();
      setBulkConfirmState(prev => ({ ...prev, open: false }));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Batch update failed',
        description: e.response?.data?.message || 'Unable to update security policies.',
      });
    } finally {
      setBulkConfirmState(prev => ({ ...prev, loading: false }));
      setIsBulkSubmitting(false);
    }
  };

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const name = row.original.name;
        const initials = name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none mb-1">{name}</span>
              <span className="text-xs text-muted-foreground">{row.original.email}</span>
            </div>
          </div>
        );
      },
      meta: { title: 'User' },
    },
    {
      accessorKey: 'roles',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        if (roles.length === 0) return <span className="text-muted-foreground italic text-xs">No roles assigned</span>;
        
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map(role => (
              <Badge key={role.id} variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider">
                {role.name}
              </Badge>
            ))}
          </div>
        );
      },
      meta: { title: 'Roles' },
    },
    {
      accessorKey: 'branches',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Branches" />,
      cell: ({ row }) => {
        const branches = row.original.branches || [];
        if (branches.length === 0) return <span className="text-muted-foreground italic text-xs">None</span>;
        
        return (
          <div className="flex flex-wrap gap-1">
            {branches.map(branch => (
              <span key={branch.id} className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted border">
                {branch.name}
              </span>
            ))}
          </div>
        );
      },
      meta: { title: 'Branches' },
    },
    {
      accessorKey: 'last_login_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
      cell: ({ row }) => {
        if (!row.original.last_login_at) return <span className="text-muted-foreground italic text-xs">Never</span>;
        return <span className="text-xs">{new Date(row.original.last_login_at).toLocaleString()}</span>;
      },
      meta: { title: 'Last Seen' },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      meta: { title: 'Status' },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === 'active';

        return (
          <div className="flex items-center justify-end gap-1">
            <TooltipProvider delayDuration={0}>
              <div className="flex items-center gap-0.5">
                {isActive ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserAction(user, 'suspend');
                        }}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Suspend Access</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserAction(user, 'activate');
                        }}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Activate Account</TooltipContent>
                  </Tooltip>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserAction(user, 'delete');
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete User</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setDialogMode('edit');
                    setSelectedUser(row.original);
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Edit User Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => handleUserAction(user, 'delete')}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], []);

  const totalUsers = useMemo(() => users.length, [users]);

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user access, status, and assignments.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage who has access to your organization.</CardDescription>
              </div>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setDialogMode('create');
                  setSelectedUser(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              className="mb-4"
            >
              <TabsList className="h-11 rounded-lg bg-muted/80 p-1">
                <TabsTrigger
                  value="all"
                  className="h-9 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  All Users
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="h-9 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="inactive"
                  className="h-9 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  Inactive
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            {!error ? (
              <DataTable
                columns={columns}
                data={users}
                tableName="users"
                searchKey="name"
                searchPlaceholder="Search users..."
                searchValue={search}
                onSearch={(value) => {
                  setSearch(value || '');
                  setPage(1);
                }}
                isLoading={isLoading}
                meta={meta}
                pageLength={pageLength}
                onPageLengthChange={(value) => {
                  setPageLength(value);
                  setPage(1);
                }}
                onPageChange={(value) => setPage(value)}
                companyDetails={{ name: 'BizLav' }}
                mobileListConfig={{
                  primaryColumns: ['name'],
                  maxSecondaryFields: 4,
                }}
                renderBulkActions={(selectedUsers, clearSelection) => (
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 bg-background hover:bg-primary hover:text-primary-foreground border-primary/20"
                      onClick={() => handleBulkPasswordReset(selectedUsers, clearSelection)}
                      disabled={isBulkSubmitting}
                    >
                      {isBulkSubmitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      ) : (
                        <KeyRound className="h-3.5 w-3.5 mr-2" />
                      )}
                      Force Password Reset
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 bg-background border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => {
                        // For simplicity, we could handle bulk delete here too if needed
                        console.log('Bulk delete:', selectedUsers);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Bulk Remove
                    </Button>
                  </div>
                )}
              />
            ) : null}

            {!isLoading && !error && totalUsers === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No users found for this filter.</p>
            ) : null}
          </CardContent>
        </Card>

        <UserFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          user={selectedUser}
          roles={roles}
          branches={branches}
          onSaved={loadUsers}
        />

        <ConfirmDialog
          open={bulkConfirmState.open}
          onOpenChange={(open) => setBulkConfirmState(prev => ({ ...prev, open }))}
          onConfirm={executeBulkPasswordReset}
          loading={bulkConfirmState.loading}
          title="Force Password Reset"
          description={`Are you sure you want to force a password reset for ${bulkConfirmState.users.length} team members? They will be prompted to change their password upon next login.`}
          confirmText="Yes, Force Reset"
          variant="default"
        />

        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}
          onConfirm={executeUserAction}
          loading={confirmState.loading}
          title={
            confirmState.type === 'delete' ? 'Delete User' :
            confirmState.type === 'suspend' ? 'Suspend Access' : 'Activate User'
          }
          description={
            confirmState.type === 'delete' 
              ? `Are you sure you want to delete ${confirmState.user?.name}? This will remove all their access immediately and cannot be undone.`
              : confirmState.type === 'suspend'
              ? `Revoke system access for ${confirmState.user?.name}? They will be unable to log in until reactivated.`
              : `Restore system access for ${confirmState.user?.name}?`
          }
          variant={confirmState.type === 'activate' ? 'default' : 'destructive'}
          confirmText={
            confirmState.type === 'delete' ? 'Delete User' :
            confirmState.type === 'suspend' ? 'Suspend Access' : 'Activate Access'
          }
        />
      </div>
    </DashboardLayout>
  );
}
