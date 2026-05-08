import { useEffect, useMemo, useState } from 'react';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/Hooks/use-toast';

import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Switch } from '@/Components/ui/switch';
import { Textarea } from '@/Components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';

const INITIAL_FORM = {
  name: '',
  email: '',
  roleId: '',
  branchIds: [],
  password: '',
  passwordConfirmation: '',
  bio: '',
  isActive: true,
};

function getInitials(name) {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  branches,
  onSaved,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { toast } = useToast();
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode && user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        roleId: (user.roles && user.roles[0] ? String(user.roles[0].id) : ''),
        branchIds: (user.branches || []).map((branch) => Number(branch.id)),
        password: '',
        passwordConfirmation: '',
        bio: '',
        isActive: (user.status || '').toLowerCase() === 'active',
      });
      setAvatarPreview('');
      setErrorMessage('');
      setFieldErrors({});
      return;
    }

    setForm(INITIAL_FORM);
    setAvatarPreview('');
    setErrorMessage('');
    setFieldErrors({});
  }, [open, isEditMode, user]);

  const selectedRole = useMemo(() => {
    return roles.find((role) => String(role.id) === String(form.roleId));
  }, [roles, form.roleId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');
    setFieldErrors({});

    try {
      const payload = {
        name: form.name,
        email: form.email,
        status: form.isActive ? 'active' : 'inactive',
        role_ids: form.roleId ? [Number(form.roleId)] : [],
        branch_ids: form.branchIds,
      };

      if (!isEditMode && form.password.trim() !== '') {
        payload.password = form.password;
        payload.password_confirmation = form.passwordConfirmation;
      }

      if (isEditMode && user) {
        await window.axios.patch(`/admin/users/${user.id}`, payload);
      } else {
        await window.axios.post('/admin/users', payload);
      }

      toast({
        title: isEditMode ? 'User updated' : 'User created',
        description: isEditMode 
          ? `Changes to ${form.name} have been saved.` 
          : `${form.name} has been added to the team.`,
      });

      onSaved?.();
      onOpenChange(false);
    } catch (requestError) {
      const response = requestError?.response;
      const validationErrors = response?.data?.errors;

      if (validationErrors && typeof validationErrors === 'object') {
        setFieldErrors(validationErrors);
      }

      if (response?.status === 403) {
        setErrorMessage('You do not have permission to perform this action.');
      } else {
        setErrorMessage(response?.data?.message || 'Unable to save user right now.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isEditMode ? 'Edit User' : 'Add New User';
  const description = isEditMode
    ? 'Update team member details and access.'
    : 'Create a new team member. Fill in all required details below.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/40">
                <AvatarImage src={avatarPreview} alt="Selected profile" />
                <AvatarFallback>{getInitials(form.name)}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-upload" className="sr-only">Upload profile image</Label>
                <Input
                  id="profile-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setAvatarPreview(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('profile-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              {fieldErrors.name ? <p className="text-xs text-destructive">{fieldErrors.name[0]}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
              {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email[0]}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={form.roleId} onValueChange={(value) => setForm((prev) => ({ ...prev, roleId: value }))}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRole ? <p className="text-xs text-muted-foreground">Selected role: {selectedRole.name}</p> : null}
            </div>

            <div className="space-y-2">
              <Label>Branches</Label>
              <div className="max-h-36 overflow-y-auto rounded-md border p-3 space-y-2">
                {branches.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No active branches available.</p>
                ) : (
                  branches.map((branch) => {
                    const checked = form.branchIds.includes(Number(branch.id));

                    return (
                      <label key={branch.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            setForm((previous) => {
                              if (isChecked) {
                                if (previous.branchIds.includes(Number(branch.id))) {
                                  return previous;
                                }

                                return {
                                  ...previous,
                                  branchIds: [...previous.branchIds, Number(branch.id)],
                                };
                              }

                              return {
                                ...previous,
                                branchIds: previous.branchIds.filter((id) => id !== Number(branch.id)),
                              };
                            });
                          }}
                        />
                        <span>{branch.name}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <p className="text-xs text-muted-foreground">Select at least one branch.</p>
              {fieldErrors.branch_ids ? <p className="text-xs text-destructive">{fieldErrors.branch_ids[0]}</p> : null}
            </div>
          </div>

          {!isEditMode ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-generate a temporary password and send it in onboarding email.
                </p>
                {fieldErrors.password ? <p className="text-xs text-destructive">{fieldErrors.password[0]}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-confirmation">Confirm Password</Label>
                <Input
                  id="password-confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={form.passwordConfirmation}
                  onChange={(event) => setForm((prev) => ({ ...prev, passwordConfirmation: event.target.value }))}
                  required={form.password.trim() !== ''}
                />
                {fieldErrors.password_confirmation ? <p className="text-xs text-destructive">{fieldErrors.password_confirmation[0]}</p> : null}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between rounded-lg border p-3 mt-7">
            <div>
              <p className="text-sm font-medium">Active Account</p>
              <p className="text-xs text-muted-foreground">Enable or disable this user's access.</p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Notes</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Tell us a little about this user..."
              value={form.bio}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
            />
          </div>

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create User')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
