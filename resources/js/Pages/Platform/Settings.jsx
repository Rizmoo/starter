import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Settings2, Package } from 'lucide-react';

export default function PlatformSettings({ settings }) {
  const { data, setData, put, processing, errors } = useForm({
    app_name: settings.app_name,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('platform.settings.update'));
  };

  const enabledModules = settings.enabled_modules
    ? settings.enabled_modules.split(',').map((m) => m.trim()).filter(Boolean)
    : [];

  return (
    <PlatformLayout title="Platform Settings">
      <Head title="Platform Settings" />
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
            <p className="text-muted-foreground">Global configuration for the platform.</p>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
              <CardDescription>Core application settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="app_name">Application Name</Label>
                  <Input
                    id="app_name"
                    value={data.app_name}
                    onChange={(e) => setData('app_name', e.target.value)}
                    placeholder="My SaaS"
                  />
                  {errors.app_name && (
                    <p className="text-xs text-destructive">{errors.app_name}</p>
                  )}
                </div>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> Enabled Modules
              </CardTitle>
              <CardDescription>Modules currently active on this instance.</CardDescription>
            </CardHeader>
            <CardContent>
              {enabledModules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No optional modules enabled.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {enabledModules.map((mod) => (
                    <span
                      key={mod}
                      className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Install modules via <code className="bg-muted rounded px-1 py-0.5">php artisan module:install {'{'}name{'}'}</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlatformLayout>
  );
}
