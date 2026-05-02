import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm({});

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/email/verification-notification');
  };

  return (
    <AuthLayout title="Verify Email">
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              Thanks for signing up! Before getting started, please verify your email address by clicking the link we sent to you.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'verification-link-sent' && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
              <CheckCircle className="h-4 w-4" />
              A new verification link has been sent to your email address.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="submit" className="w-full" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Verification Email
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/logout"
              method="post"
              as="button"
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Log Out
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
