import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
  Info, CheckCircle, AlertTriangle, XCircle,
  CheckCheck, Trash2, Bell, Loader2,
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Hooks/use-toast';

const typeConfig = {
  info:    { icon: Info,          color: 'text-blue-500',  bg: 'bg-blue-50 dark:bg-blue-900/20',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  success: { icon: CheckCircle,   color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  error:   { icon: XCircle,       color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-900/20',     badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

function NotificationItem({ notification, onMarkRead, onDelete, loadingId, deletingId }) {
  const config = typeConfig[notification.data?.type] ?? typeConfig.info;
  const Icon = config.icon;
  const isUnread = !notification.read_at;
  const isMarkingRead = loadingId === notification.id;
  const isDeleting = deletingId === notification.id;

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${
        isDeleting ? 'opacity-40 scale-95 pointer-events-none' : 'opacity-100'
      } ${isUnread ? 'bg-muted/40' : 'bg-background'}`}
    >
      <div className={`mt-0.5 p-2 rounded-full shrink-0 ${config.bg}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
            {notification.data?.title}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {isUnread && <span className="h-2 w-2 rounded-full bg-blue-500" />}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${config.badge}`}>
              {notification.data?.type ?? 'info'}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{notification.data?.message}</p>
        {notification.data?.action_url && (
          <Link href={notification.data.action_url} className="mt-1.5 inline-block text-xs text-primary hover:underline">
            {notification.data.action_label ?? 'View'}
          </Link>
        )}
        <p className="text-xs text-muted-foreground/60 mt-1.5">{notification.created_at}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isUnread && (
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => onMarkRead(notification.id)}
            disabled={isMarkingRead}
            title="Mark as read"
          >
            {isMarkingRead
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <CheckCheck className="h-3.5 w-3.5" />}
          </Button>
        )}
        <Button
          variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => onDelete(notification.id)}
          disabled={isDeleting}
          title="Delete"
        >
          {isDeleting
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Trash2 className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}

export default function Notifications({ notifications }) {
  const { data: serverItems = [], links } = notifications ?? {};
  const [items, setItems] = useState(serverItems);
  const [loadingId, setLoadingId] = useState(null);     // mark-read spinner
  const [deletingId, setDeletingId] = useState(null);   // delete fade-out
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const confirmDeleteIdRef = React.useRef(null);
  const { toast } = useToast();

  const unreadCount = items.filter(n => !n.read_at).length;

  const handleMarkRead = (id) => {
    setLoadingId(id);
    axios.patch(`/notifications/${id}/read`)
      .then(() => {
        setItems(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        toast({ title: 'Marked as read', description: 'Notification marked as read.' });
      })
      .catch(() => toast({ title: 'Error', description: 'Could not mark as read.', variant: 'destructive' }))
      .finally(() => setLoadingId(null));
  };

  const handleMarkAllRead = () => {
    setMarkingAllRead(true);
    axios.patch('/notifications/read-all')
      .then(() => {
        setItems(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
        toast({ title: 'All caught up!', description: 'All notifications marked as read.' });
      })
      .catch(() => toast({ title: 'Error', description: 'Could not mark all as read.', variant: 'destructive' }))
      .finally(() => setMarkingAllRead(false));
  };

  const handleDeleteConfirmed = () => {
    const id = confirmDeleteIdRef.current;

    if (!id) {
      toast({ title: 'Error', description: 'No notification selected for deletion.', variant: 'destructive' });
      return;
    }

    setConfirmDeleteId(null);
    confirmDeleteIdRef.current = null;
    setDeletingId(id);
    axios.delete(`/notifications/${id}`)
      .then(() => {
        // Remove from list after fade-out animation completes
        setTimeout(() => setItems(prev => prev.filter(n => n.id !== id)), 300);
        toast({ title: 'Deleted', description: 'Notification removed.' });
      })
      .catch(() => {
        setDeletingId(null);
        toast({ title: 'Error', description: 'Could not delete notification.', variant: 'destructive' });
      });
  };

  const handleClearAll = () => {
    setClearingAll(true);
    axios.delete('/notifications/clear-all')
      .then(() => {
        setItems([]);
        toast({ title: 'Cleared', description: 'All notifications removed.' });
      })
      .catch(() => {
        toast({ title: 'Error', description: 'Could not clear notifications.', variant: 'destructive' });
      })
      .finally(() => {
        setClearingAll(false);
        setConfirmClearAll(false);
      });
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={markingAllRead || clearingAll} className="gap-2">
                {markingAllRead
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <CheckCheck className="h-4 w-4" />}
                Mark all as read
              </Button>
            )}
            {items.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmClearAll(true)}
                disabled={clearingAll || deletingId !== null}
                className="gap-2"
              >
                {clearingAll
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Trash2 className="h-4 w-4" />}
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <Card>
          <CardContent className="p-4 space-y-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm text-muted-foreground mt-1">You're all caught up! Check back later.</p>
              </div>
            ) : (
              items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={(id) => {
                    setConfirmDeleteId(id);
                    confirmDeleteIdRef.current = id;
                  }}
                  loadingId={loadingId}
                  deletingId={deletingId}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {links && links.length > 3 && (
          <div className="flex items-center justify-center gap-1">
            {links.map((link, i) => (
              <Button
                key={i}
                variant={link.active ? 'default' : 'outline'}
                size="sm"
                disabled={!link.url}
                onClick={() => link.url && router.visit(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDeleteId(null);
            confirmDeleteIdRef.current = null;
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete notification?</AlertDialogTitle>
            <AlertDialogDescription>
              This notification will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all confirmation dialog */}
      <AlertDialog open={confirmClearAll} onOpenChange={setConfirmClearAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove all notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearingAll}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={clearingAll}
            >
              {clearingAll ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Clearing...
                </span>
              ) : (
                'Clear all'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

