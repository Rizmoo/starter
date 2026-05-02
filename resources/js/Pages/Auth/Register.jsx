import { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Register" />
      <div className="min-h-screen flex bg-background">

        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={crosshatchBg} />
          <div className="relative w-full h-full flex flex-col items-center justify-center p-12 z-10">
            <div className="w-full max-w-md space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-full bg-card shadow-lg flex items-center justify-center border border-border">
                  <span className="text-xl font-bold text-primary">{getAppInitials(appName)}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{appName}</h1>
                  <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
                <p className="text-lg text-muted-foreground">
                  Set up your account to access the admin dashboard and manage your content, products, and services.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">Fast</div>
                  <div className="text-sm text-muted-foreground">Onboarding</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">Secure</div>
                  <div className="text-sm text-muted-foreground">Access</div>
                </div>
              </div>

              <div className="pt-4 text-xs text-muted-foreground">
                Powered by <span className="text-primary font-medium">{appName}</span>. Operate with Confidence.
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-2 pt-8 text-center">
              <CardTitle className="text-2xl">Admin Registration</CardTitle>
              <CardDescription>Enter your details to create your account.</CardDescription>
            </CardHeader>

            <CardContent>
              <form id="register-form" onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="John Doe"
                    required
                    autoFocus
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    required
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

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                  />
                  {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                </div>

                <Button type="submit" form="register-form" className="w-full mt-2" disabled={processing}>
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {processing ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-8 items-center">
              <div className="text-xs text-muted-foreground text-center">
                Powered by <span className="text-primary font-medium">{appName}</span>. Operate with Confidence.
              </div>
              <div className="flex items-center justify-between w-full text-sm pt-1">
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">← Back to Home</a>
                <span className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

      </div>
    </>
  );
}
