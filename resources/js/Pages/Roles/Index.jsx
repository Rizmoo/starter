import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { DataTable } from '@/Components/ui/data-table';
import { DataTableColumnHeader } from '@/Components/ui/data-table-column-header';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { ConfirmDialog } from '@/Components/ui/confirm-dialog';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useToast } from '@/Hooks/use-toast';

export default function RolesIndexPage() {
  const { toast } = useToast();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [roleMeta, setRoleMeta] = useState(null);
  const [permissionMeta, setPermissionMeta] = useState(null);

  const [rolePage, setRolePage] = useState(1);
  const [permissionPage, setPermissionPage] = useState(1);
  const [rolePageLength, setRolePageLength] = useState(15);
  const [permissionPageLength, setPermissionPageLength] = useState(15);
  const [roleSearch, setRoleSearch] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');

  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [permissionName, setPermissionName] = useState('');

  const [confirmState, setConfirmState] = useState({
    open: false,
    entity: null,
    id: null,
    loading: false,
  });

  const allPermissionOptions = useMemo(() => {
    return permissionOptions.map((item) => ({ id: item.id, name: item.name }));
  }, [permissionOptions]);

  const loadRoles = useCallback(async () => {
    try {
      setIsRolesLoading(true);
      setError('');

      const response = await window.axios.get('/admin/roles', {
        params: {
          page: rolePage,
          per_page: rolePageLength,
          search: roleSearch || undefined,
        },
      });

      setRoles(response.data?.data || []);
      setRoleMeta(response.data || null);
    } catch (requestError) {
      const status = requestError?.response?.status;

      if (status === 403) {
        setError('You do not have permission to view roles.');
      } else {
        setError('Unable to load roles right now.');
      }
    } finally {
      setIsRolesLoading(false);
    }
  }, [rolePage, rolePageLength, roleSearch]);

  const loadPermissions = useCallback(async () => {
    try {
      setIsPermissionsLoading(true);
      const response = await window.axios.get('/admin/permissions', {
        params: {
          page: permissionPage,
          per_page: permissionPageLength,
          search: permissionSearch || undefined,
        },
      });

      setPermissions(response.data?.data || []);
      setPermissionMeta(response.data || null);
    } catch {
      setPermissions([]);
      setPermissionMeta(null);
    } finally {
      setIsPermissionsLoading(false);
    }
  }, [permissionPage, permissionPageLength, permissionSearch]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    const loadPermissionOptions = async () => {
      try {
        const response = await window.axios.get('/admin/permissions', {
          params: { per_page: 500 },
        });

        setPermissionOptions(response.data?.data || []);
      } catch {
        setPermissionOptions([]);
      }
    };

    loadPermissionOptions();
  }, []);

  const openEditRoleDialog = async (role) => {
    try {
      const response = await window.axios.get(`/admin/roles/${role.id}`);
      const payload = response.data;

      setEditingRole(payload);
      setRoleName(payload.name || '');
      setSelectedPermissionIds((payload.permissions || []).map((permission) => permission.id));
      setIsRoleDialogOpen(true);
    } catch {
      toast({
        title: 'Unable to load role details',
        description: 'Please try again.',
      });
    }
  };

  const openEditPermissionDialog = (permission) => {
    setEditingPermission(permission);
    setPermissionName(permission.name || '');
    setIsPermissionDialogOpen(true);
  };

  const submitRoleUpdate = async (event) => {
    event.preventDefault();

    if (!editingRole) {
      return;
    }

    try {
      await window.axios.patch(`/admin/roles/${editingRole.id}`, {
        name: roleName,
        permission_ids: selectedPermissionIds,
      });

      toast({
        title: 'Role updated',
        description: 'Role changes were saved successfully.',
      });

      setIsRoleDialogOpen(false);
      await loadRoles();
    } catch (requestError) {
      toast({
        title: 'Unable to update role',
        description: requestError?.response?.data?.message || 'Please check inputs and try again.',
      });
    }
  };

  const submitPermissionUpdate = async (event) => {
    event.preventDefault();

    if (!editingPermission) {
      return;
    }

    try {
      await window.axios.patch(`/admin/permissions/${editingPermission.id}`, {
        name: permissionName,
      });

      toast({
        title: 'Permission updated',
        description: 'Permission changes were saved successfully.',
      });

      setIsPermissionDialogOpen(false);
      await loadPermissions();
      await loadRoles();
    } catch (requestError) {
      toast({
        title: 'Unable to update permission',
        description: requestError?.response?.data?.message || 'Please check inputs and try again.',
      });
    }
  };

  const triggerDelete = (entity, id) => {
    setConfirmState({
      open: true,
      entity,
      id,
      loading: false,
    });
  };

  const confirmDelete = async () => {
    if (!confirmState.entity || !confirmState.id) {
      return;
    }

    setConfirmState((previous) => ({ ...previous, loading: true }));

    try {
      await window.axios.delete(`/admin/${confirmState.entity}/${confirmState.id}`);

      toast({
        title: `${confirmState.entity === 'roles' ? 'Role' : 'Permission'} deleted`,
        description: 'The item was deleted successfully.',
      });

      if (confirmState.entity === 'roles') {
        await loadRoles();
      } else {
        await loadPermissions();
      }
    } catch (requestError) {
      toast({
        title: 'Delete failed',
        description: requestError?.response?.data?.message || 'This item could not be deleted.',
      });
    } finally {
      setConfirmState({
        open: false,
        entity: null,
        id: null,
        loading: false,
      });
    }
  };

  const roleColumns = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      meta: { title: 'Role' },
    },
    {
      accessorKey: 'users_count',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Users" />,
      meta: { title: 'Users' },
    },
    {
      accessorKey: 'permissions_count',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
      meta: { title: 'Permissions' },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open role actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditRoleDialog(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerDelete('roles', row.original.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [permissions]);

  const permissionColumns = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Permission" />,
      meta: { title: 'Permission' },
    },
    {
      accessorKey: 'roles_count',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Roles" />,
      meta: { title: 'Roles' },
    },
    {
      accessorKey: 'users_count',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Users" />,
      meta: { title: 'Users' },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open permission actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditPermissionDialog(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerDelete('permissions', row.original.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const totalRoles = useMemo(() => roles.length, [roles]);
  const totalPermissions = useMemo(() => permissions.length, [permissions]);

  return (
    <DashboardLayout title="Roles & Permissions">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
            <p className="text-muted-foreground">Review roles, attached permissions, and manage lifecycle actions.</p>
          </div>
          <Button asChild>
            <Link href="/users/roles/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="h-11 rounded-lg bg-muted/80 p-1">
            <TabsTrigger
              value="roles"
              className="h-9 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Roles
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="h-9 rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>Total loaded: {totalRoles}</CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}

                {!error ? (
                  <DataTable
                    columns={roleColumns}
                    data={roles}
                    tableName="roles"
                    searchKey="name"
                    searchPlaceholder="Search roles..."
                    searchValue={roleSearch}
                    onSearch={(value) => {
                      setRoleSearch(value || '');
                      setRolePage(1);
                    }}
                    isLoading={isRolesLoading}
                    meta={roleMeta}
                    pageLength={rolePageLength}
                    onPageLengthChange={(value) => {
                      setRolePageLength(value);
                      setRolePage(1);
                    }}
                    onPageChange={(value) => setRolePage(value)}
                    companyDetails={{ name: 'BizLav' }}
                    mobileListConfig={{
                      primaryColumns: ['name'],
                      maxSecondaryFields: 3,
                    }}
                  />
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Total loaded: {totalPermissions}</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={permissionColumns}
                  data={permissions}
                  tableName="permissions"
                  searchKey="name"
                  searchPlaceholder="Search permissions..."
                  searchValue={permissionSearch}
                  onSearch={(value) => {
                    setPermissionSearch(value || '');
                    setPermissionPage(1);
                  }}
                  isLoading={isPermissionsLoading}
                  meta={permissionMeta}
                  pageLength={permissionPageLength}
                  onPageLengthChange={(value) => {
                    setPermissionPageLength(value);
                    setPermissionPage(1);
                  }}
                  onPageChange={(value) => setPermissionPage(value)}
                  companyDetails={{ name: 'BizLav' }}
                  mobileListConfig={{
                    primaryColumns: ['name'],
                    maxSecondaryFields: 3,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>Update role name and permission assignments.</DialogDescription>
            </DialogHeader>
            <form onSubmit={submitRoleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={roleName}
                  onChange={(event) => setRoleName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto border rounded-md p-3">
                  {allPermissionOptions.map((permission) => {
                    const checked = selectedPermissionIds.includes(permission.id);

                    return (
                      <label key={permission.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            setSelectedPermissionIds((previous) => {
                              if (isChecked) {
                                if (previous.includes(permission.id)) {
                                  return previous;
                                }

                                return [...previous, permission.id];
                              }

                              return previous.filter((id) => id !== permission.id);
                            });
                          }}
                        />
                        <span>{permission.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Permission</DialogTitle>
              <DialogDescription>Update permission name.</DialogDescription>
            </DialogHeader>
            <form onSubmit={submitPermissionUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="permission-name">Permission Name</Label>
                <Input
                  id="permission-name"
                  value={permissionName}
                  onChange={(event) => setPermissionName(event.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={(open) => setConfirmState((previous) => ({ ...previous, open }))}
          onConfirm={confirmDelete}
          title={`Delete ${confirmState.entity === 'roles' ? 'Role' : 'Permission'}`}
          description="This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
          loading={confirmState.loading}
        />
      </div>
    </DashboardLayout>
  );
}
