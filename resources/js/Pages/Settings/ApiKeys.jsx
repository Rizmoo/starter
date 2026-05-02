import { useEffect } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/Hooks/use-toast';
import { AlertTriangle, Copy, KeyRound, Loader2, Plus, ShieldAlert, Trash2 } from 'lucide-react';

function formatDateTime(value) {
  if (!value) {
    return 'Never';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function ApiKeysSettingsPage({ tokens = [], plainTextToken = null }) {
  const { toast } = useToast();
  const { flash } = usePage().props;

  const createKeyForm = useForm({
    name: '',
  });

  useEffect(() => {
    if (flash?.success) {
      toast({
        title: 'Success',
        description: flash.success,
      });
    }

    if (flash?.error) {
      toast({
        title: 'Action failed',
        description: flash.error,
        variant: 'destructive',
      });
    }
  }, [flash, toast]);

  const handleCreateApiKey = (event) => {
    event.preventDefault();

    createKeyForm.post('/settings/api-keys', {
      preserveScroll: true,
      onSuccess: () => {
        createKeyForm.reset();
      },
    });
  };

  const handleRevokeApiKey = (token) => {
    const shouldRevoke = window.confirm(`Revoke API key "${token.name}"? This action cannot be undone.`);

    if (!shouldRevoke) {
      return;
    }

    router.delete(`/settings/api-keys/${token.id}`, {
      preserveScroll: true,
    });
  };

  const copyPlainTextToken = async () => {
    if (!plainTextToken) {
      return;
    }

    try {
      await navigator.clipboard.writeText(plainTextToken);
      toast({
        title: 'Copied',
        description: 'API key copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy API key. Please copy it manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout title="API Keys">
      <Head title="API Keys" />

      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
            <p className="text-muted-foreground">Manage API keys for third-party integrations.</p>
          </div>
          <form onSubmit={handleCreateApiKey} className="flex w-full max-w-lg flex-col gap-2 sm:flex-row sm:items-end">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="api_key_name">Key Name</Label>
              <Input
                id="api_key_name"
                placeholder="Accounting Connector"
                value={createKeyForm.data.name}
                onChange={(event) => createKeyForm.setData('name', event.target.value)}
                required
              />
              {createKeyForm.errors.name && (
                <p className="text-sm text-destructive">{createKeyForm.errors.name}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={createKeyForm.processing}
              className="h-10 min-w-[160px] bg-green-600 font-semibold text-white hover:bg-green-500"
            >
              {createKeyForm.processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </form>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              API keys grant access to your data. Keep them secure and never share them publicly. The full key is only shown once during creation.
            </p>
          </CardContent>
        </Card>

        {plainTextToken && (
          <Card className="border-green-500/40 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-green-400">New API Key Created</CardTitle>
              <CardDescription>
                Copy this key now. You will not be able to view it again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-x-auto rounded-md border bg-background p-3 font-mono text-xs">
                {plainTextToken}
              </div>
              <Button type="button" onClick={copyPlainTextToken} className="h-10 min-w-[150px]">
                <Copy className="mr-2 h-4 w-4" />
                Copy API Key
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Active API Keys</CardTitle>
            <CardDescription>Manage and monitor your API keys for external integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
                <KeyRound className="h-12 w-12 text-muted-foreground/60" />
                <div className="text-center">
                  <p className="text-xl font-semibold">No API keys yet</p>
                  <p className="text-sm text-muted-foreground">Create your first API key to enable third-party integrations.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {tokens.map((token) => (
                  <div key={token.id} className="rounded-lg border bg-card/50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold">{token.name}</p>
                        <p className="text-xs text-muted-foreground">Created: {formatDateTime(token.created_at)}</p>
                        <p className="text-xs text-muted-foreground">Last used: {formatDateTime(token.last_used_at)}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeApiKey(token)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4" />
            Revoke keys immediately if compromised, and rotate keys used in long-running integrations regularly.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
