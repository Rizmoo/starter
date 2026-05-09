import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link } from '@inertiajs/react';
import { StatCard } from '@/Components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Building2, Users, MonitorCog, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PlatformDashboard({ stats, recent_companies }) {
  return (
    <PlatformLayout title="Platform Admin">
      <Head title="Platform Dashboard" />
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MonitorCog className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
          </div>
          <p className="text-muted-foreground">Super-admin view — all tenants and platform metrics.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Companies"
            value={stats.total_companies}
            icon={Building2}
            subtitle="All tenants"
            colorScheme="blue"
          />
          <StatCard
            title="Active Companies"
            value={stats.active_companies}
            icon={CheckCircle2}
            subtitle="Currently active"
            colorScheme="green"
          />
          <StatCard
            title="Suspended"
            value={stats.suspended_companies}
            icon={AlertTriangle}
            subtitle="Suspended tenants"
            colorScheme="amber"
          />
          <StatCard
            title="Total Users"
            value={stats.total_users}
            icon={Users}
            subtitle="Across all tenants"
            colorScheme="purple"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recently Joined Companies</CardTitle>
            <CardDescription>Newest tenants on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recent_companies.length === 0 ? (
              <p className="text-muted-foreground text-sm">No companies yet.</p>
            ) : (
              <div className="space-y-3">
                {recent_companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={route('platform.companies.show', company.id)}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {company.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{company.created_at}</p>
                      </div>
                    </div>
                    <StatusBadge status={company.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PlatformLayout>
  );
}

function StatusBadge({ status }) {
  const variants = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${variants[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}
