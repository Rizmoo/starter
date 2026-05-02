import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppSidebar from '@/Components/app-sidebar';
import Header from '@/Components/header';
import { SidebarProvider, SidebarInset } from '@/Components/ui/sidebar';

export default function DashboardLayout({ children, title }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
