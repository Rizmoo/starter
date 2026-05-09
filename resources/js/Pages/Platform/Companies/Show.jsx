import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Building2, Users, ArrowLeft, ShieldCheck, ShieldOff, Ban } from 'lucide-react';

const statusStyles = {
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function PlatformCompanyShow({ company }) {
  const handleAction = (action) => {
    router.patch(route(`platform.companies.${action}`, company.id), {}, { preserveScroll: true });
  };

  return (
    <PlatformLayout title={`Platform — ${company.name}`}>
      <Head title={`Platform: ${company.name}`} />
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href={route('platform.companies.index')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              {company.logo_url ? (
                <img src={company.logo_url} alt="" className="h-full w-full object-contain p-1 rounded-xl" />
              ) : (
                company.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[company.status] ?? 'bg-muted text-muted-foreground'}`}
                >
                  {company.status}
                </span>
                <span className="text-xs text-muted-foreground">Joined {company.created_at}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {company.status !== 'active' && (
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleAction('activate')}
            >
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Activate
            </Button>
          )}
          {company.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              onClick={() => handleAction('suspend')}
            >
              <ShieldOff className="h-4 w-4 mr-1.5" /> Suspend
            </Button>
          )}
          {company.status !== 'blocked' && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/30 text-destructive hover:bg-red-500/10"
              onClick={() => handleAction('block')}
            >
              <Ban className="h-4 w-4 mr-1.5" /> Block
            </Button>
          )}
          {company.status === 'blocked' && (
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleAction('unblock')}
            >
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Unblock
            </Button>
          )}
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Name', value: company.name },
                { label: 'Email', value: company.email ?? '—' },
                { label: 'Phone', value: company.phone ?? '—' },
                { label: 'Address', value: company.address ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4 text-sm border-b pb-2 last:border-b-0 last:pb-0">
                  <span className="text-muted-foreground shrink-0">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Users
              </CardTitle>
              <CardDescription>{company.users_count} registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This tenant has <span className="font-semibold text-foreground">{company.users_count}</span> registered user{company.users_count !== 1 ? 's' : ''}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlatformLayout>
  );
}
