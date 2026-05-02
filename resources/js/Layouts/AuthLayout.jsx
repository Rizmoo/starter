import { Head } from '@inertiajs/react';
import { AppLogo } from '@/Components/app-logo';
import { ThemeToggle } from '@/Components/theme-toggle';

export default function AuthLayout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <AppLogo className="text-foreground" showText={true} href="/" />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
