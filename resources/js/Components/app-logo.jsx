import React from 'react';
import { Link } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function getAppInitials(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return 'LA';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() || '').join('');
}

export function AppLogo({ className, showText = true, href = '/dashboard', logoUrl }) {
  const initials = getAppInitials(appName);

  return (
    <Link href={href} className={`flex items-center gap-2 ${className || ''}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/20 overflow-hidden">
        {logoUrl ? (
          <img src={logoUrl} alt={appName} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {showText && <span className="text-lg font-bold tracking-tight">{appName}</span>}
    </Link>
  );
}
