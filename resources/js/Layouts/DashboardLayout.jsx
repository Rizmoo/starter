import { useCallback, useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppSidebar from '@/Components/app-sidebar';
import Header from '@/Components/header';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { useToast } from '@/Hooks/use-toast';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/Components/ui/sidebar';

export default function DashboardLayout({ children, title }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { props } = usePage();
  const flash = props.flash ?? {};
  const { toast } = useToast();
  const lastFlashKey = useRef('');

  useEffect(() => {
    const entries = [
      { key: 'error', title: 'Action failed', description: flash.error, variant: 'destructive' },
      { key: 'success', title: 'Success', description: flash.success, variant: 'default' },
      { key: 'message', title: 'Notice', description: flash.message, variant: 'default' },
    ].filter((entry) => Boolean(entry.description));

    const first = entries[0];
    if (!first) {
      return;
    }

    const key = `${first.key}:${first.description}`;
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
      <Head title={title} />
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <AppSidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobileMenu={closeMobileMenu}
          />
          <SidebarInset className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <Header onToggleMobileMenu={toggleMobileMenu} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
              {flash.message ? (
                <Alert className="mb-4 border-amber-300/40 bg-amber-500/5">
                  <Info className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Notice</AlertTitle>
                  <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
              ) : null}

              {flash.success ? (
                <Alert className="mb-4 border-emerald-300/40 bg-emerald-500/5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
              ) : null}

              {flash.error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Action failed</AlertTitle>
                  <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
              ) : null}

              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
