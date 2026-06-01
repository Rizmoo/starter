import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/Hooks/use-toast';
import { Loader2, Monitor, Smartphone, Tablet, MapPin, Clock, Trash2, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';

export default function SessionManagement() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminateAllPassword, setTerminateAllPassword] = useState('');
  const [showTerminateAllDialog, setShowTerminateAllDialog] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/settings/sessions');
      setSessions(response.data.data || []);
      setCurrentSessionId(response.data.current_session_id);
    } catch (error) {
      toast({
        title: 'Failed to load sessions',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    setIsTerminating(true);
    try {
      await axios.delete(`/settings/sessions/${sessionId}`);
      toast({
        title: 'Session terminated',
        description: 'The session has been successfully terminated.',
      });
      await loadSessions();
    } catch (error) {
      toast({
        title: 'Failed to terminate session',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTerminating(false);
    }
  };

  const terminateAllOthers = async () => {
    if (!terminateAllPassword) {
      toast({
        title: 'Password required',
        description: 'Please enter your password to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsTerminating(true);
    try {
      await axios.delete('/settings/sessions', {
        data: { password: terminateAllPassword },
      });
      toast({
        title: 'All other sessions terminated',
        description: 'All other sessions have been successfully terminated.',
      });
      setTerminateAllPassword('');
      setShowTerminateAllDialog(false);
      await loadSessions();
    } catch (error) {
      toast({
        title: 'Failed to terminate sessions',
        description: error.response?.data?.message || 'Please check your password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTerminating(false);
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'Tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const formatLastActivity = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage and monitor all devices where you&apos;re currently logged in. You can terminate any session except your current one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No active sessions found.</p>
          ) : (
            <>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 ${
                      session.is_current ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {getDeviceIcon(session.user_agent.device)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {session.user_agent.browser} on {session.user_agent.platform}
                        </p>
                        {session.is_current && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.ip_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatLastActivity(session.last_activity)}
                        </span>
                      </div>
                    </div>
                    {!session.is_current && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isTerminating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Terminate this session?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will log out this device. You can log back in at any time.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => terminateSession(session.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Terminate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>

              {sessions.length > 1 && (
                <div className="pt-4 border-t">
                  <AlertDialog open={showTerminateAllDialog} onOpenChange={setShowTerminateAllDialog}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={isTerminating}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Terminate All Other Sessions
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Terminate all other sessions?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log out all devices except this one. Please enter your password to confirm.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-2 py-4">
                        <Label htmlFor="terminate-password">Password</Label>
                        <Input
                          id="terminate-password"
                          type="password"
                          value={terminateAllPassword}
                          onChange={(e) => setTerminateAllPassword(e.target.value)}
                          placeholder="Enter your password"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              terminateAllOthers();
                            }
                          }}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTerminateAllPassword('')}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={terminateAllOthers}
                          disabled={!terminateAllPassword || isTerminating}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isTerminating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Terminate All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
