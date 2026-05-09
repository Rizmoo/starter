import { useCallback, useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppSidebar from '@/Components/app-sidebar';
import Header from '@/Components/header';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { useToast } from '@/Hooks/use-toast';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/Components/ui/sidebar';

/**
 * Dedicated layout for Platform Administration.
 * Strictly isolated from tenant/base dashboard features.
 */
export default function PlatformLayout({ children, title }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { props } = usePage();
  const flash = props.flash ?? {};
  const { toast } = useToast();
  const lastFlashKey = useRef('');

  useEffect(() => {
    const entries = [
      { key: 'error', title: 'Critical Error', description: flash.error, variant: 'destructive' },
      { key: 'success', title: 'System Updated', description: flash.success, variant: 'default' },
      { key: 'message', title: 'Platform Notice', description: flash.message, variant: 'default' },
    ].filter((entry) => Boolean(entry.description));

    const first = entries[0];
    if (!first) {
      return;
    }

    const key = `platform:${first.key}:${first.description}`;
    if (lastFlashKey.current === key) {
      return;
    }

    lastFlashKey.current = key;
    toast({
      title: first.title,
      description: first.description,
      variant: first.variant,
    });
  }, [flash.error, flash.message, flash.success, toast]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);
  const toggleMobileMenu = useCallback(() => {
    setIsMobileSidebarOpen((open) => !open);
  }, []);

  return (
    <>
      <Head title={`${title} | Platform Admin`} />
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          <AppSidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobileMenu={closeMobileMenu}
          />
          <SidebarInset className="flex flex-col min-w-0 flex-1 overflow-hidden bg-background/50">
            <Header onToggleMobileMenu={toggleMobileMenu} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
              {flash.message && (
                <Alert className="mb-6 border-primary/20 bg-primary/5 text-primary">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Platform Message</AlertTitle>
                  <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
              )}

              {flash.success && (
                <Alert className="mb-6 border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
              )}

              {flash.error && (
                <Alert variant="destructive" className="mb-6 border-red-500/20 bg-red-500/5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
              )}

              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
