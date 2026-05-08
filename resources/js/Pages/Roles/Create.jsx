import { useEffect, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Loader2, ChevronDown } from 'lucide-react';

import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/Hooks/use-toast';

const MODULE_LABELS = {
  users: 'User Management',
  roles: 'Role Management',
  permissions: 'Permission Management',
  audit_logs: 'Audit & Compliance',
};

const ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  update: 'Edit',
  delete: 'Delete',
  manage: 'Manage',
  assign_roles: 'Assign Roles',
  assign_permissions: 'Assign Permissions',
};

const ACTION_ORDER = ['view', 'create', 'update', 'delete', 'manage', 'assign_roles', 'assign_permissions'];

function toTitleCase(value) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPermissionParts(permissionName) {
  const [resource, action = 'manage'] = permissionName.split('.');
  return {
    resource,
    action,
    module: resource,
  };
}

export default function CreateRolePage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setIsLoadingPermissions(true);
        const response = await window.axios.get('/admin/permissions', {
          params: { per_page: 500 },
        });

        setPermissions(response.data?.data || []);
      } catch {
        setPermissions([]);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    loadPermissions();
  }, []);

  const selectedCount = useMemo(() => selectedPermissionIds.length, [selectedPermissionIds]);

  const groupedPermissions = useMemo(() => {
    const grouped = {};

    permissions.forEach((permission) => {
      const { module, resource, action } = getPermissionParts(permission.name);

      if (!grouped[module]) {
        grouped[module] = {
          key: module,
          label: MODULE_LABELS[module] || toTitleCase(module),
          resources: {},
        };
      }

      if (!grouped[module].resources[resource]) {
        grouped[module].resources[resource] = {
          key: resource,
          label: toTitleCase(resource),
          actions: [],
        };
      }

      grouped[module].resources[resource].actions.push({
        id: permission.id,
        action,
        label: ACTION_LABELS[action] || toTitleCase(action),
      });
    });

    return Object.values(grouped)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((module) => ({
        ...module,
        resources: Object.values(module.resources)
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((resource) => ({
            ...resource,
            actions: resource.actions.sort((a, b) => {
              const aIndex = ACTION_ORDER.indexOf(a.action);
              const bIndex = ACTION_ORDER.indexOf(b.action);
              const ai = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
              const bi = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

              return ai - bi;
            }),
          })),
      }));
  }, [permissions]);

  const allPermissionIds = useMemo(() => permissions.map((permission) => permission.id), [permissions]);

  const isAllSelected = allPermissionIds.length > 0 && selectedPermissionIds.length === allPermissionIds.length;

  const hasSomeSelected = selectedPermissionIds.length > 0 && !isAllSelected;

  const togglePermission = (permissionId, checked) => {
    setSelectedPermissionIds((previous) => {
      if (checked) {
        if (previous.includes(permissionId)) {
          return previous;
        }

        return [...previous, permissionId];
      }

      return previous.filter((id) => id !== permissionId);
    });
  };

  const toggleAllPermissions = (checked) => {
    setSelectedPermissionIds(checked ? allPermissionIds : []);
  };

  const getModuleSelectionState = (module) => {
    const modulePermissionIds = module.resources.flatMap((resource) => resource.actions.map((action) => action.id));
    const selectedInModule = modulePermissionIds.filter((id) => selectedPermissionIds.includes(id)).length;

    if (selectedInModule === 0) {
      return false;
    }

    if (selectedInModule === modulePermissionIds.length) {
      return true;
    }

    return 'indeterminate';
  };

  const toggleModulePermissions = (module, checked) => {
    const modulePermissionIds = module.resources.flatMap((resource) => resource.actions.map((action) => action.id));

    setSelectedPermissionIds((previous) => {
      if (checked) {
        return Array.from(new Set([...previous, ...modulePermissionIds]));
      }

      return previous.filter((id) => !modulePermissionIds.includes(id));
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await window.axios.post('/admin/roles', {
        name,
        permission_ids: selectedPermissionIds,
      });

      toast({
        title: 'Role created',
        description: 'The new role was created successfully.',
      });

      router.visit('/users/roles');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to create role right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create Role">
      <div className="space-y-7">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/users/roles">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to roles</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
            <p className="text-muted-foreground">Define role identity and choose assigned permissions.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
            <CardDescription>Selected permissions: {selectedCount}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="Example: Supervisor"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Input
                  id="role-description"
                  placeholder="Optional description for this role"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="rounded-xl border bg-muted/10 p-4 md:p-5">
                  {isLoadingPermissions ? (
                    <p className="text-sm text-muted-foreground">Loading permissions...</p>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-lg border border-dashed bg-background px-4 py-3.5">
                        <label className="flex items-start gap-2 text-sm">
                          <Checkbox
                            checked={isAllSelected ? true : (hasSomeSelected ? 'indeterminate' : false)}
                            onCheckedChange={(isChecked) => toggleAllPermissions(Boolean(isChecked))}
                          />
                          <span className="space-y-0.5">
                            <span className="block font-semibold">Grant All Permissions (Administrator Access)</span>
                            <span className="block text-xs text-muted-foreground">Equivalent to selecting every available permission.</span>
                          </span>
                        </label>
                      </div>

                      {groupedPermissions.map((module) => (
                        <details key={module.key} className="overflow-hidden rounded-lg border border-border/80 bg-background" open>
                          <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={getModuleSelectionState(module)}
                                onCheckedChange={(isChecked) => toggleModulePermissions(module, Boolean(isChecked))}
                                onClick={(event) => event.stopPropagation()}
                              />
                              <span className="font-medium text-sm">{module.label}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </summary>

                          <div className="border-t bg-muted/20 px-4 pb-4 pt-3 space-y-3">
                            {module.resources.map((resource) => (
                              <div key={resource.key} className="rounded-md border bg-background px-3.5 py-2.5">
                                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                                  <span className="text-sm font-medium">{resource.label}</span>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    {resource.actions.map((action) => {
                                      const checked = selectedPermissionIds.includes(action.id);

                                      return (
                                        <label key={action.id} className="flex items-center gap-1.5 text-xs">
                                          <Checkbox
                                            checked={checked}
                                            onCheckedChange={(isChecked) => togglePermission(action.id, Boolean(isChecked))}
                                          />
                                          <span>{action.label}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/users/roles">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoadingPermissions}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {isSubmitting ? 'Creating...' : 'Create Role'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
