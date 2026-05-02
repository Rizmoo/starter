import { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function getAppInitials(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'LA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
}

const crosshatchBg = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C%2Fg%3E%3C/svg%3E")`,
};

export default function Login({ status }) {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen flex bg-background">

        {/* Left hero panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={crosshatchBg} />
          <div className="relative w-full h-full flex flex-col items-center justify-center p-12 z-10">
            <div className="w-full max-w-md space-y-8">

              {/* Logo + app name */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-full bg-card shadow-lg flex items-center justify-center border border-border">
                  <span className="text-xl font-bold text-primary">{getAppInitials(appName)}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{appName}</h1>
                  <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
                <p className="text-lg text-muted-foreground">
                  Sign in to access the admin dashboard and manage your content, products, and services.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Secure</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Access</div>
                </div>
              </div>

              {/* Footer text */}
              <div className="pt-4 text-xs text-muted-foreground">
                Powered by <span className="text-primary font-medium">{appName}</span>. Operate with Confidence.
              </div>

            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-2 pt-8 text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>

            <CardContent>
              {status && (
                <div className="mb-4 text-sm text-primary bg-primary/10 border border-primary/20 p-3 rounded-lg">
                  {status}
                </div>
              )}

              <form id="login-form" onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={data.remember}
                      onCheckedChange={(checked) => setData('remember', checked)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" form="login-form" className="w-full mt-2" disabled={processing}>
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {processing ? 'Logging in...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-card px-3 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <a
                href="/auth/google"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </a>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-8 items-center">
              <div className="text-xs text-muted-foreground text-center">
                Powered by <span className="text-primary font-medium">{appName}</span>. Operate with Confidence.
              </div>
              <div className="flex items-center justify-between w-full text-sm pt-1">
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">← Back to Home</a>
                <span className="text-muted-foreground">
                  No account?{' '}
                  <Link href="/register" className="font-medium text-primary hover:underline">Sign Up</Link>
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

      </div>
    </>
  );
}

