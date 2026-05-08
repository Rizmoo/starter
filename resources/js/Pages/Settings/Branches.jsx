import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { DataTable } from '@/Components/ui/data-table';
import { DataTableColumnHeader } from '@/Components/ui/data-table-column-header';
import { Button } from '@/Components/ui/button';
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
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { ConfirmDialog } from '@/Components/ui/confirm-dialog';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useToast } from '@/Hooks/use-toast';

function BranchStatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'active') {
    return <Badge>Active</Badge>;
  }

  return <Badge variant="secondary">Inactive</Badge>;
}

const INITIAL_FORM = {
  name: '',
  slug: '',
  code: '',
};

export default function BranchesSettingsPage() {
  const { toast } = useToast();

  const [branches, setBranches] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [pageLength, setPageLength] = useState(15);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false,
    id: null,
    loading: false,
  });

  const resetDialogState = () => {
    setDialogOpen(false);
    setEditingBranch(null);
    setForm(INITIAL_FORM);
    setIsSubmitting(false);
  };

  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await window.axios.get('/admin/branches', {
        params: {
          page,
          per_page: pageLength,
          search: search || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      });

      setBranches(response.data?.data || []);
      setMeta(response.data || null);
    } catch (requestError) {
      const status = requestError?.response?.status;

      if (status === 403) {
        setError('You do not have permission to manage branches.');
      } else {
        setError('Unable to load branches right now.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, pageLength, search, statusFilter]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const openCreateDialog = () => {
    setEditingBranch(null);
    setForm(INITIAL_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (branch) => {
    setEditingBranch(branch);
    setForm({
      name: branch.name || '',
      slug: branch.slug || '',
      code: branch.code || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug || null,
        code: form.code || null,
      };

      if (editingBranch) {
        await window.axios.patch(`/admin/branches/${editingBranch.id}`, payload);
        toast({
          title: 'Branch updated',
          description: 'The branch was updated successfully.',
        });
      } else {
        await window.axios.post('/admin/branches', payload);
        toast({
          title: 'Branch created',
          description: 'The branch was created successfully.',
        });
      }

      resetDialogState();
      await loadBranches();
    } catch (requestError) {
      toast({
        title: 'Unable to save branch',
        description: requestError?.response?.data?.message || 'Please check your inputs and try again.',
      });
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (branch) => {
    const endpoint = branch.status === 'active'
      ? `/admin/branches/${branch.id}/archive`
      : `/admin/branches/${branch.id}/activate`;

    try {
      await window.axios.patch(endpoint);
      await loadBranches();
      toast({
        title: branch.status === 'active' ? 'Branch archived' : 'Branch activated',
        description: 'Branch status was updated successfully.',
      });
    } catch (requestError) {
      toast({
        title: 'Unable to update branch status',
        description: requestError?.response?.data?.message || 'Please try again.',
      });
    }
  };

  const triggerDelete = (branchId) => {
    setConfirmState({
      open: true,
      id: branchId,
      loading: false,
    });
  };

  const handleDelete = async () => {
    if (!confirmState.id) {
      return;
    }

    setConfirmState((previous) => ({ ...previous, loading: true }));

    try {
      await window.axios.delete(`/admin/branches/${confirmState.id}`);
      await loadBranches();
      toast({
        title: 'Branch deleted',
        description: 'The branch was deleted successfully.',
      });
    } catch (requestError) {
      toast({
        title: 'Unable to delete branch',
        description: requestError?.response?.data?.message || 'This branch cannot be deleted right now.',
      });
    } finally {
      setConfirmState({
        open: false,
        id: null,
        loading: false,
      });
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
      meta: { title: 'Branch' },
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => row.original.code || '-',
      meta: { title: 'Code' },
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
      meta: { title: 'Slug' },
    },
    {
      accessorKey: 'users_count',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Users" />,
      meta: { title: 'Users' },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <BranchStatusBadge status={row.original.status} />,
      meta: { title: 'Status' },
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
            <DropdownMenuItem onClick={() => openEditDialog(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(row.original)}>
              {row.original.status === 'active' ? 'Archive' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => triggerDelete(row.original.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const totalBranches = useMemo(() => branches.length, [branches]);

  return (
    <DashboardLayout title="Branches">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">
            Create and manage branches your users can access.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Branch Management</CardTitle>
                <CardDescription>Total loaded: {totalBranches}</CardDescription>
              </div>
              <Button className="w-full sm:w-auto" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
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
                  All
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

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            {!error ? (
              <DataTable
                columns={columns}
                data={branches}
                tableName="branches"
                searchKey="name"
                searchPlaceholder="Search branches..."
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
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Branch' : 'Create Branch'}</DialogTitle>
              <DialogDescription>
                {editingBranch
                  ? 'Update branch details and naming.'
                  : 'Create a new branch your users can access.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input
                  id="branch-name"
                  value={form.name}
                  onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branch-slug">Slug (optional)</Label>
                  <Input
                    id="branch-slug"
                    value={form.slug}
                    onChange={(event) => setForm((previous) => ({ ...previous, slug: event.target.value }))}
                    placeholder="auto-from-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch-code">Code (optional)</Label>
                  <Input
                    id="branch-code"
                    value={form.code}
                    onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))}
                    placeholder="HQ"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetDialogState}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {editingBranch ? 'Save Changes' : 'Create Branch'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmState({ open: false, id: null, loading: false });
            }
          }}
          title="Delete Branch"
          description="This action cannot be undone. Branches with assigned users cannot be deleted."
          confirmText="Delete"
          cancelText="Cancel"
          loading={confirmState.loading}
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
    </DashboardLayout>
  );
}
