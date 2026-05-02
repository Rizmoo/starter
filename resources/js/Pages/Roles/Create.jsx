import { useEffect, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/Hooks/use-toast';

export default function CreateRolePage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
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
      <div className="space-y-6">
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
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <Label>Permissions</Label>
                <div className="border rounded-md p-3 max-h-80 overflow-y-auto">
                  {isLoadingPermissions ? (
                    <p className="text-sm text-muted-foreground">Loading permissions...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map((permission) => {
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
