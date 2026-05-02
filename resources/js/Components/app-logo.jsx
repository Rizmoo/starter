import React from 'react';
import { Link } from '@inertiajs/react';

export function AppLogo({ className, showText = true, href = '/dashboard' }) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className || ''}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(34,197,94,0.4)]">
        BF
      </div>
      {showText && <span className="text-lg font-bold tracking-tight text-white">BizFlow</span>}
    </Link>
  );
}
