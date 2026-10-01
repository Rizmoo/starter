<svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-auto w-full">
    <ellipse class="error-illu-glow" cx="180" cy="118" rx="130" ry="88"/>
    <ellipse class="error-illu-shadow" cx="180" cy="228" rx="140" ry="16"/>

    {{-- Road --}}
    <path d="M20 210 H340" class="error-illu-metal" stroke="#64748b" stroke-width="18" stroke-linecap="round"/>
    <path d="M40 210 H320" stroke="#f8fafc" stroke-width="3" stroke-dasharray="14 10"/>

    {{-- Overflowing meter --}}
    <rect x="236" y="48" width="72" height="96" rx="10" class="error-illu-muted"/>
    <rect x="248" y="62" width="48" height="68" rx="6" fill="hsl(var(--background))"/>
    <rect x="254" y="88" width="36" height="36" rx="4" fill="hsl(var(--primary))"/>
    <path d="M272 88 V72" stroke="hsl(var(--primary))" stroke-width="4" stroke-linecap="round"/>
    {{-- Overflow blobs --}}
    <circle cx="258" cy="54" r="8" fill="hsl(var(--primary))" opacity="0.85"/>
    <circle cx="286" cy="48" r="10" fill="hsl(var(--primary))" opacity="0.7"/>
    <circle cx="310" cy="64" r="7" fill="hsl(var(--primary))" opacity="0.55"/>

    {{-- Signal --}}
    <rect x="48" y="70" width="22" height="70" rx="6" class="error-illu-ink"/>
    <circle cx="59" cy="86" r="7" fill="#ef4444"/>
    <circle cx="59" cy="106" r="7" fill="#facc15" opacity="0.35"/>
    <circle cx="59" cy="126" r="7" fill="#22c55e" opacity="0.25"/>
    <rect x="56" y="140" width="6" height="70" class="error-illu-metal"/>

    {{-- Cars in a jam --}}
    <g transform="translate(92 176)">
        <rect width="52" height="24" rx="8" fill="hsl(var(--primary))"/>
        <rect x="8" y="-10" width="28" height="14" rx="4" fill="hsl(var(--primary) / 0.7)"/>
        <circle cx="12" cy="24" r="6" class="error-illu-ink"/>
        <circle cx="40" cy="24" r="6" class="error-illu-ink"/>
    </g>
    <g transform="translate(156 176)">
        <rect width="52" height="24" rx="8" class="error-illu-wood"/>
        <rect x="8" y="-10" width="28" height="14" rx="4" fill="#92400e"/>
        <circle cx="12" cy="24" r="6" class="error-illu-ink"/>
        <circle cx="40" cy="24" r="6" class="error-illu-ink"/>
    </g>
    <g transform="translate(220 176)">
        <rect width="52" height="24" rx="8" class="error-illu-stone"/>
        <rect x="8" y="-10" width="28" height="14" rx="4" class="error-illu-metal"/>
        <circle cx="12" cy="24" r="6" class="error-illu-ink"/>
        <circle cx="40" cy="24" r="6" class="error-illu-ink"/>
    </g>

    {{-- Driver --}}
    <circle class="error-illu-hair" cx="118" cy="168" r="8"/>
    <circle class="error-illu-skin" cx="118" cy="170" r="6"/>
</svg>
