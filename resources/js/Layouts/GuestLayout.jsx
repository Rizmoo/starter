import { Head, Link } from '@inertiajs/react';
import { AppLogo } from '@/Components/app-logo';
import { ThemeToggle } from '@/Components/theme-toggle';
import { Button } from '@/Components/ui/button';

export default function GuestLayout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4 mx-auto">
            <AppLogo className="text-foreground" showText={true} href="/" />
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t py-6">
          <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BizFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
