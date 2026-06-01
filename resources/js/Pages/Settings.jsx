import { useState } from 'react';
import axios from 'axios';
import { useForm, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { useToast } from '@/Hooks/use-toast';
import { Loader2, Shield, User, Lock, QrCode, KeyRound, MonitorCheck } from 'lucide-react';
import SessionManagement from '@/Components/Settings/SessionManagement';

export default function Settings({ twoFactorEnabled, qrCode, recoveryCodes }) {
  const { auth } = usePage().props;
  const { toast } = useToast();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(Boolean(twoFactorEnabled));
  const [qrCodeSvg, setQrCodeSvg] = useState(qrCode || null);
  const [recoveryCodeList, setRecoveryCodeList] = useState(recoveryCodes || []);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2faBusy, setIs2faBusy] = useState(false);

  const profileForm = useForm({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
  });

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleTwoFactorError = (error, title = 'Two-factor request failed') => {
    if (error?.response?.status === 423) {
      toast({
        title: 'Confirm your password',
        description: 'Please confirm your password to continue with security changes.',
        variant: 'destructive',
      });
      router.visit('/user/confirm-password');
      return;
    }

    toast({
      title,
      description: 'Please try again.',
      variant: 'destructive',
    });
  };

  const loadTwoFactorData = async () => {
    const [qrResponse, recoveryResponse] = await Promise.all([
      axios.get('/user/two-factor-qr-code'),
      axios.get('/user/two-factor-recovery-codes'),
    ]);

    setQrCodeSvg(qrResponse.data.svg || null);
    setRecoveryCodeList(Array.isArray(recoveryResponse.data) ? recoveryResponse.data : []);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    profileForm.put('/user/profile-information', {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Profile updated successfully.',
        });
      },
    });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    passwordForm.put('/user/password', {
      preserveScroll: true,
      onSuccess: () => {
        passwordForm.reset();
        toast({
          title: 'Success',
          description: 'Password updated successfully.',
        });
      },
    });
  };

  const enableTwoFactor = async () => {
    setIs2faBusy(true);
    try {
      await axios.post('/user/two-factor-authentication');
      setIsTwoFactorEnabled(true);
      await loadTwoFactorData();
      toast({
        title: 'Two-factor enabled',
        description: 'Scan the QR code and confirm with your authenticator code.',
      });
    } catch (error) {
      handleTwoFactorError(error, 'Unable to enable two-factor');
    } finally {
      setIs2faBusy(false);
    }
  };

  const confirmTwoFactor = async (e) => {
    e.preventDefault();
    if (!twoFactorCode) {
      toast({
        title: 'Code required',
        description: 'Enter the code from your authenticator app.',
        variant: 'destructive',
      });
      return;
    }

    setIs2faBusy(true);
    try {
      await axios.post('/user/confirmed-two-factor-authentication', { code: twoFactorCode });
      setTwoFactorCode('');
      toast({
        title: 'Two-factor confirmed',
        description: 'Your authenticator app is now linked successfully.',
      });
    } catch (error) {
      toast({
        title: 'Invalid code',
        description: 'Please check your authenticator code and try again.',
        variant: 'destructive',
      });
    } finally {
      setIs2faBusy(false);
    }
  };

  const disableTwoFactor = async () => {
    setIs2faBusy(true);
    try {
      await axios.delete('/user/two-factor-authentication');
      setIsTwoFactorEnabled(false);
      setQrCodeSvg(null);
      setRecoveryCodeList([]);
      setTwoFactorCode('');
      toast({
        title: 'Two-factor disabled',
        description: 'Your account now uses password-only sign in.',
      });
    } catch (error) {
      handleTwoFactorError(error, 'Unable to disable two-factor');
    } finally {
      setIs2faBusy(false);
    }
  };

  const showRecoveryCodesAction = async () => {
    setIs2faBusy(true);
    try {
      const recoveryResponse = await axios.get('/user/two-factor-recovery-codes');
      setRecoveryCodeList(Array.isArray(recoveryResponse.data) ? recoveryResponse.data : []);
    } catch (error) {
      handleTwoFactorError(error, 'Unable to load recovery codes');
    } finally {
      setIs2faBusy(false);
    }
  };

  const regenerateRecoveryCodes = async () => {
    setIs2faBusy(true);
    try {
      await axios.post('/user/two-factor-recovery-codes');
      const recoveryResponse = await axios.get('/user/two-factor-recovery-codes');
      setRecoveryCodeList(Array.isArray(recoveryResponse.data) ? recoveryResponse.data : []);
      toast({
        title: 'Recovery codes regenerated',
        description: 'Store these new codes in a safe place.',
      });
    } catch (error) {
      handleTwoFactorError(error, 'Unable to regenerate recovery codes');
    } finally {
      setIs2faBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <Head title="Settings" />
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and security preferences.
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="2fa" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Two-Factor Auth
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <MonitorCheck className="h-4 w-4" />
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>
                  Update your account&apos;s profile information and email address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileForm.data.name}
                      onChange={(e) => profileForm.setData('name', e.target.value)}
                      required
                    />
                    {profileForm.errors.name && (
                      <p className="text-sm text-destructive">{profileForm.errors.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.data.email}
                      onChange={(e) => profileForm.setData('email', e.target.value)}
                      required
                    />
                    {profileForm.errors.email && (
                      <p className="text-sm text-destructive">{profileForm.errors.email}</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      disabled={profileForm.processing}
                      className="h-10 min-w-[160px] rounded-md bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)]"
                    >
                      {profileForm.processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <CardTitle>Update Password</CardTitle>
                </div>
                <CardDescription>
                  Ensure your account is using a long, random password to stay secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordForm.data.current_password}
                      onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                      required
                    />
                    {passwordForm.errors.current_password && (
                      <p className="text-sm text-destructive">{passwordForm.errors.current_password}</p>
                    )}
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password_confirmation">Confirm Password</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {passwordForm.errors.password && (
                    <p className="text-sm text-destructive">{passwordForm.errors.password}</p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      disabled={passwordForm.processing}
                      className="h-10 min-w-[170px] rounded-md bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)]"
                    >
                      {passwordForm.processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2fa" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </div>
                <CardDescription>
                  Protect your account with an authenticator app and one-time codes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isTwoFactorEnabled ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA to require a time-based code at login.
                    </p>
                    <Button
                      onClick={enableTwoFactor}
                      variant="default"
                      disabled={is2faBusy}
                      className="h-10 w-full rounded-md bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)]"
                    >
                      {is2faBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enable Two-Factor
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                      <Shield className="h-4 w-4" />
                      Two-factor authentication is enabled.
                    </div>

                    {qrCodeSvg && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <QrCode className="h-4 w-4" /> Scan QR Code
                        </p>
                        <div className="inline-block rounded-lg bg-white p-4" dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                      </div>
                    )}

                    <form onSubmit={confirmTwoFactor} className="space-y-2">
                      <Label htmlFor="two_factor_code">Authenticator Code</Label>
                      <Input
                        id="two_factor_code"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="123456"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                      <Button
                        type="submit"
                        variant="default"
                        disabled={is2faBusy}
                        className="h-10 w-full rounded-md bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)]"
                      >
                        {is2faBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Authenticator
                      </Button>
                    </form>

                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <KeyRound className="h-4 w-4" /> Recovery Codes
                      </p>
                      {recoveryCodeList.length > 0 ? (
                        <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs space-y-1">
                          {recoveryCodeList.map((code, index) => (
                            <div key={index}>{code}</div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No codes loaded yet.</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Button
                        onClick={showRecoveryCodesAction}
                        variant="default"
                        disabled={is2faBusy}
                        className="h-10 rounded-md bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)]"
                      >
                        Show Recovery Codes
                      </Button>
                      <Button
                        onClick={regenerateRecoveryCodes}
                        variant="default"
                        disabled={is2faBusy}
                        className="h-10 rounded-md bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)]"
                      >
                        Regenerate Recovery Codes
                      </Button>
                      <Button variant="destructive" onClick={disableTwoFactor} disabled={is2faBusy}>
                        Disable Two-Factor
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
