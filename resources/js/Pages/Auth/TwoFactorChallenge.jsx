import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Loader2, ShieldCheck } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/Components/ui/input-otp';

export default function TwoFactorChallenge() {
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    code: '',
    recovery_code: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/two-factor-challenge');
  };

  return (
    <AuthLayout title="Two-Factor Authentication">
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription>
              {useRecoveryCode
                ? 'Enter one of your recovery codes to access your account.'
                : 'Enter the 6-digit code from your authenticator app.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {!useRecoveryCode ? (
              <div className="grid gap-2">
                <Label htmlFor="code" className="text-center">Authentication Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={data.code}
                    onChange={(value) => setData('code', value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.code && (
                  <p className="text-sm text-destructive text-center">{errors.code}</p>
                )}
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="recovery_code">Recovery Code</Label>
                <Input
                  id="recovery_code"
                  type="text"
                  value={data.recovery_code}
                  onChange={(e) => setData('recovery_code', e.target.value)}
                  placeholder="XXXXX-XXXXX"
                  required
                  autoFocus
                />
                {errors.recovery_code && (
                  <p className="text-sm text-destructive">{errors.recovery_code}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setUseRecoveryCode(!useRecoveryCode);
                setData(useRecoveryCode ? 'recovery_code' : 'code', '');
              }}
            >
              {useRecoveryCode ? 'Use authenticator code' : 'Use recovery code'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
