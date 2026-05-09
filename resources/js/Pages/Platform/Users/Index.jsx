import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '@/Components/ui/data-table';
import { Users } from 'lucide-react';
import { useCallback } from 'react';

const statusStyles = {
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  inactive: 'bg-muted text-muted-foreground border-border',
};

const columns = [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) =>
      row.original.company ? (
        <Link
          href={route('platform.companies.show', row.original.company.id)}
          className="text-sm hover:text-primary transition-colors"
        >
          {row.original.company.name}
        </Link>
      ) : (
        <span className="text-xs text-muted-foreground italic">No company</span>
      ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[row.original.status] ?? 'bg-muted text-muted-foreground'}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.created_at}</span>
    ),
  },
];

export default function PlatformUsersIndex({ users, filters }) {
  const handleSearch = useCallback(
    (value) => {
      router.get(
        route('platform.users.index'),
        { search: value, status: filters.status },
        { preserveState: true, replace: true },
      );
    },
    [filters.status],
  );

  const handlePageChange = (page) => {
    router.get(route('platform.users.index'), { ...filters, page }, { preserveState: true });
  };

  return (
    <PlatformLayout title="Platform — Users">
      <Head title="Platform Users" />
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
            <p className="text-muted-foreground">Every user across all tenant companies.</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users.data}
          meta={users.meta}
          searchKey="name"
          searchPlaceholder="Search users..."
          tableName="Platform Users"
          onSearch={handleSearch}
          searchValue={filters.search ?? ''}
          onPageChange={handlePageChange}
          pageLength={users.meta?.per_page ?? 20}
        />
      </div>
    </PlatformLayout>
  );
}
