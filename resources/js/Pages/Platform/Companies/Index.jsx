import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '@/Components/ui/data-table';
import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Building2, MoreHorizontal, Eye, ShieldOff, ShieldCheck, Ban } from 'lucide-react';
import { useCallback, useState } from 'react';

const statusStyles = {
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const columns = [
  {
    accessorKey: 'name',
    header: 'Company',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.logo_url ? (
          <img src={row.original.logo_url} alt="" className="h-7 w-7 rounded object-contain" />
        ) : (
          <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
            {row.original.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'users_count',
    header: 'Users',
    cell: ({ row }) => <span className="text-sm">{row.original.users_count}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[row.original.status] ?? 'bg-muted text-muted-foreground'}`}>
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.created_at}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <CompanyActions company={row.original} />,
  },
];

function CompanyActions({ company }) {
  const handleAction = (action) => {
    router.patch(route(`platform.companies.${action}`, company.id), {}, {
      preserveScroll: true,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={route('platform.companies.show', company.id)} className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> View Details
          </Link>
        </DropdownMenuItem>
        {company.status !== 'active' && (
          <DropdownMenuItem onClick={() => handleAction('activate')} className="gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Activate
          </DropdownMenuItem>
        )}
        {company.status === 'active' && (
          <DropdownMenuItem onClick={() => handleAction('suspend')} className="gap-2">
            <ShieldOff className="h-4 w-4 text-amber-500" /> Suspend
          </DropdownMenuItem>
        )}
        {company.status !== 'blocked' && (
          <DropdownMenuItem onClick={() => handleAction('block')} className="gap-2 text-destructive">
            <Ban className="h-4 w-4" /> Block
          </DropdownMenuItem>
        )}
        {company.status === 'blocked' && (
          <DropdownMenuItem onClick={() => handleAction('unblock')} className="gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Unblock
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PlatformCompaniesIndex({ companies, filters }) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = useCallback((value) => {
    router.get(route('platform.companies.index'), { search: value, status: filters.status }, {
      preserveState: true, replace: true,
    });
  }, [filters.status]);

  const handlePageChange = (page) => {
    router.get(route('platform.companies.index'), { ...filters, page }, { preserveState: true });
  };

  return (
    <PlatformLayout title="Platform — Companies">
      <Head title="Platform Companies" />
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground">All tenant companies on the platform.</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={companies.data}
          meta={companies.meta}
          searchKey="name"
          searchPlaceholder="Search companies..."
          tableName="Platform Companies"
          onSearch={handleSearch}
          searchValue={search}
          onPageChange={handlePageChange}
          pageLength={companies.meta?.per_page ?? 20}
        />
      </div>
    </PlatformLayout>
  );
}
