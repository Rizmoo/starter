import { Head, Link, useForm } from '@inertiajs/react';
import { Building, Loader2 } from 'lucide-react';

import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

export default function CompanySettingsPage({ company }) {
  const form = useForm({
    name: company?.name || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
  });

  const submit = (event) => {
    event.preventDefault();

    form.put('/settings/company', {
      preserveScroll: true,
    });
  };

  return (
    <DashboardLayout title="Company Settings">
      <Head title="Company Settings" />

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
            <p className="text-muted-foreground">Manage your company profile information.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/settings">Back to Settings</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>Company Profile</CardTitle>
            </div>
            <CardDescription>
              These details are used across your workspace and generated documents.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  required
                />
                {form.errors.name ? <p className="text-sm text-destructive">{form.errors.name}</p> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={form.data.email}
                    onChange={(event) => form.setData('email', event.target.value)}
                  />
                  {form.errors.email ? <p className="text-sm text-destructive">{form.errors.email}</p> : null}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input
                    id="company-phone"
                    value={form.data.phone}
                    onChange={(event) => form.setData('phone', event.target.value)}
                  />
                  {form.errors.phone ? <p className="text-sm text-destructive">{form.errors.phone}</p> : null}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company-address">Address</Label>
                <Textarea
                  id="company-address"
                  rows={4}
                  value={form.data.address}
                  onChange={(event) => form.setData('address', event.target.value)}
                />
                {form.errors.address ? <p className="text-sm text-destructive">{form.errors.address}</p> : null}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={form.processing}>
                  {form.processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {form.processing ? 'Saving...' : 'Save Company Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
