import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  Activity,
  Calendar,
  Globe
} from 'lucide-react';
import { useToast } from '@/Hooks/use-toast';
import { ConfirmDialog } from '@/Components/ui/confirm-dialog';
import UserFormDialog from '@/Components/users/user-form-dialog';
import { Link, router } from '@inertiajs/react';

function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'active') {
    return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
  }

  if (normalized === 'suspended') {
    return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>;
  }

  return <Badge variant="secondary">Inactive</Badge>;
}

export default function UserShowPage({ id }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: 'delete', // delete, suspend, activate
    loading: false,
  });

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await window.axios.get(`/admin/users/${id}`);
      setUser(response.data);
    } catch (requestError) {
      setError('Unable to load user details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [rolesResponse, branchesResponse] = await Promise.all([
          window.axios.get('/admin/roles', { params: { per_page: 100 } }),
          window.axios.get('/admin/branches', { params: { per_page: 200, status: 'active' } }),
        ]);
        setRoles(rolesResponse.data?.data || []);
        setBranches(branchesResponse.data?.data || []);
      } catch {
        // Silently fail for options
      }
    };
    loadOptions();
  }, []);

  const handleAction = (type) => {
    setConfirmState({
      open: true,
      type,
      loading: false,
    });
  };

  const executeAction = async () => {
    const { type } = confirmState;
    setConfirmState(prev => ({ ...prev, loading: true }));
    try {
      if (type === 'delete') {
        await window.axios.delete(`/admin/users/${id}`);
        toast({ title: 'User deleted', description: 'User has been removed from the system.' });
        router.visit(route('users.page'));
      } else if (type === 'suspend') {
        await window.axios.patch(`/admin/users/${id}/suspend`);
        toast({ title: 'User suspended', description: 'Access has been revoked.' });
        loadUser();
      } else if (type === 'activate') {
        await window.axios.patch(`/admin/users/${id}/activate`);
        toast({ title: 'User activated', description: 'Access has been restored.' });
        loadUser();
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: e.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setConfirmState(prev => ({ ...prev, open: false, loading: false }));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Loading User...">
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout title="Error">
        <div className="flex h-[400px] flex-col items-center justify-center gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="text-xl font-semibold">{error || 'User not found'}</p>
          <Button onClick={() => router.visit(route('users.page'))}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout title={`User: ${user.name}`}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Link href={route('users.page')} className="hover:text-primary transition-colors">Users</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            {user.status === 'active' ? (
              <Button variant="outline" size="sm" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50" onClick={() => handleAction('suspend')}>
                <UserX className="h-4 w-4 mr-2" /> Suspend
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleAction('activate')}>
                <UserCheck className="h-4 w-4 mr-2" /> Activate
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={() => handleAction('delete')}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-1 ring-primary/10">
              <AvatarImage src={user.social_avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{user.name}</h1>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground italic font-medium">
                  <div className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user.email}</div>
                  {user.last_login_at && (
                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Last seen {new Date(user.last_login_at).toLocaleString()}</div>
                  )}
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {user.roles && user.roles.map(role => (
                  <Badge key={role.id} variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/20 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-background/50 backdrop-blur-sm border px-6 py-8 rounded-2xl flex flex-col justify-center items-center min-w-[180px] shadow-sm">
               <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Company Access</div>
               <div className="text-2xl font-black text-primary">Active</div>
               <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                 <Shield className="h-3 w-3" /> Secure Connection
               </div>
            </div>
          </div>
          
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-[0.03] rotate-12 pointer-events-none">
             <User size={300} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm ring-1 ring-border">
              <CardHeader className="border-b bg-muted/30 pb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Regional Distribution</CardTitle>
                </div>
                <CardDescription>Managed branches and primary office locations.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.branches && user.branches.map(branch => (
                    <div key={branch.id} className="flex items-center gap-4 p-4 rounded-xl border bg-background/50 hover:bg-background hover:shadow-sm transition-all group">
                      <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">{branch.name}</div>
                        <div className="text-xs text-muted-foreground font-medium">Branch ID: #{branch.id.toString().padStart(4, '0')}</div>
                      </div>
                      {branch.pivot?.is_primary && (
                        <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-tighter bg-amber-500/10 text-amber-600 border-amber-500/20">Primary</Badge>
                      )}
                    </div>
                  ))}
                  {(!user.branches || user.branches.length === 0) && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                       <MapPin className="h-8 w-8 mx-auto mb-2 opacity-20" />
                       <p className="text-sm font-medium">No branches assigned to this user.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm ring-1 ring-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Permissions & Access</CardTitle>
                </div>
                <CardDescription>Direct permissions assigned via security policies.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.permissions && user.permissions.map(perm => (
                    <Badge key={perm.id} variant="secondary" className="px-3 py-1.5 font-medium border-primary/5 text-xs">
                      {perm.name}
                    </Badge>
                  ))}
                  {(!user.permissions || user.permissions.length === 0) && (
                    <div className="w-full text-center py-6 text-muted-foreground/60 italic text-sm">
                       No direct permissions assigned. Accss granted via roles only.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Activity / Stats */}
          <div className="space-y-8">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm ring-1 ring-border overflow-hidden">
               <CardHeader className="bg-primary/5 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>System Information</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                 <div className="space-y-1">
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Authentication</div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium">Social Sign-in</span>
                     <Badge variant={user.social_provider ? "default" : "outline"} className="text-[10px]">
                        {user.social_provider ? user.social_provider.toUpperCase() : 'DISABLED'}
                     </Badge>
                   </div>
                 </div>

                 <Separator />

                 <div className="space-y-1">
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Security Status</div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium">Forced Pass Change</span>
                     <Badge variant={user.force_password_change ? "destructive" : "outline"} className="text-[10px]">
                        {user.force_password_change ? 'REQUIRED' : 'NORMAL'}
                     </Badge>
                   </div>
                 </div>

                 <Separator />

                 <div className="space-y-4">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account Timeline</div>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                        <div className="relative">
                            <div className="absolute -left-[1.375rem] h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                            <div className="text-xs font-bold mb-0.5">Account Created</div>
                            <div className="text-[10px] text-muted-foreground font-medium">{new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                        {user.last_login_at && (
                          <div className="relative">
                              <div className="absolute -left-[1.375rem] h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-background"></div>
                              <div className="text-xs font-bold mb-0.5">Last Successful Login</div>
                              <div className="text-[10px] text-muted-foreground font-medium">{new Date(user.last_login_at).toLocaleString()}</div>
                          </div>
                        )}
                        {user.suspended_at && (
                          <div className="relative">
                              <div className="absolute -left-[1.375rem] h-2.5 w-2.5 rounded-full bg-destructive ring-4 ring-background"></div>
                              <div className="text-xs font-bold mb-0.5">Account Suspended</div>
                              <div className="text-[10px] text-muted-foreground font-medium">{new Date(user.suspended_at).toLocaleString()}</div>
                              <div className="mt-1 p-2 rounded bg-destructive/5 text-[9px] text-destructive italic border border-destructive/10">
                                {user.suspended_reason}
                              </div>
                          </div>
                        )}
                    </div>
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>

        <UserFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode="edit"
          user={user}
          roles={roles}
          branches={branches}
          onSaved={loadUser}
        />

        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}
          onConfirm={executeAction}
          loading={confirmState.loading}
          title={
            confirmState.type === 'delete' ? 'Delete User' :
            confirmState.type === 'suspend' ? 'Suspend Access' : 'Activate User'
          }
          description={
            confirmState.type === 'delete' 
              ? `Are you sure you want to delete ${user.name}? This will remove all their access immediately and cannot be undone.`
              : confirmState.type === 'suspend'
              ? `Revoke system access for ${user.name}? They will be unable to log in until reactivated.`
              : `Restore system access for ${user.name}?`
          }
          variant={confirmState.type === 'activate' ? 'default' : 'destructive'}
          confirmText={
            confirmState.type === 'delete' ? 'Delete User' :
            confirmState.type === 'suspend' ? 'Suspend Access' : 'Activate Access'
          }
        />
      </div>
    </DashboardLayout>
  );
}
