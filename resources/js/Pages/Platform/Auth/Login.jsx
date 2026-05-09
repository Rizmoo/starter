import { useForm, Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { ShieldAlert, MonitorCog, ArrowRight } from 'lucide-react';
import { React } from 'react';

export default function PlatformLogin({ status, error }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('platform.login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] p-4 relative overflow-hidden">
      <Head title="Platform Login" />
      
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/10 transition-transform hover:scale-105 duration-300">
            <MonitorCog className="h-8 w-8 text-primary" />
          </div>
        </div>

        <Card className="bg-[#11141B]/80 border-[#1E222B] backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center tracking-tight text-white flex items-center justify-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Platform Administration
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Isolated access for super-administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status && <div className="mb-4 text-sm font-medium text-emerald-500 text-center">{status}</div>}
            {error && <div className="mb-4 text-sm font-medium text-destructive text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-400">Super-Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  className="bg-[#181C23] border-[#2A2F3A] text-white focus:ring-primary focus:border-primary transition-all duration-200"
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="admin@platform.com"
                  autoComplete="username"
                  required
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" title="Password" className="text-gray-400">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  className="bg-[#181C23] border-[#2A2F3A] text-white focus:ring-primary focus:border-primary transition-all duration-200"
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-[#2A2F3A] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  checked={data.remember}
                  onCheckedChange={(checked) => setData('remember', checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember this session
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 group relative overflow-hidden transition-all duration-300" 
                disabled={processing}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? 'Authenticating...' : 'Enter System Control'}
                  {!processing && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-white/10 to-primary opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-gray-600 tracking-widest uppercase font-medium">
          Secure Terminal &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
