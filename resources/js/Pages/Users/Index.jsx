import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { DataTableColumnHeader } from '@/Components/ui/data-table-column-header';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { MoreHorizontal, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import UserFormDialog from '@/Components/users/user-form-dialog';

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

  const columns = useMemo(() => [
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
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: 'roles',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const roleNames = (row.original.roles || []).map((role) => role.name).join(', ');
        return roleNames || 'None';
      },
    },
    {
      accessorKey: 'branches',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Branches" />,
      cell: ({ row }) => {
        const branchNames = (row.original.branches || []).map((branch) => branch.name).join(', ');
        return branchNames || 'None';
      },
    },
    {
      accessorKey: 'last_login_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
      cell: ({ row }) => {
        if (!row.original.last_login_at) {
          return 'Never';
        }

        return new Date(row.original.last_login_at).toLocaleString();
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setDialogMode('edit');
                setSelectedUser(row.original);
                setDialogOpen(true);
              }}
            >
              Edit User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
      </div>
    </DashboardLayout>
  );
}
