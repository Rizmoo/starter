import { Head, Link } from '@inertiajs/react';
import { AppLogo } from '@/Components/app-logo';
import { ThemeToggle } from '@/Components/theme-toggle';
import { Button } from '@/Components/ui/button';
import { Shield, Zap, TrendingUp } from 'lucide-react';

export default function GuestLayout({ children, title }) {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary transition-colors duration-300">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between px-4 mx-auto">
            <div className="flex items-center gap-8">
              <AppLogo className="text-foreground" showText={true} href="/" />
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex hover:bg-muted font-medium">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="shadow-lg shadow-primary/20 select-none font-medium h-10 px-6">Get Started</Button>
              </Link>
              <div className="ml-2 pl-2 border-l border-border h-6 flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t bg-muted/40 pb-12 pt-16">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8">
              <div className="col-span-2 space-y-6">
                <AppLogo showText={true} />
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Streamline your business operations with a modern application starter. Built for performance, security, and scale.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><Shield className="h-4 w-4" /></a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><Zap className="h-4 w-4" /></a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><TrendingUp className="h-4 w-4" /></a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider text-foreground">Product</h4>
                <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider text-foreground">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                  <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider text-foreground">Support</h4>
                <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                  <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground font-medium">
              <p>&copy; {new Date().getFullYear()} BizFlow. All rights reserved.</p>
              <div className="flex items-center gap-8">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
