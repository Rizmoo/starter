<svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-auto w-full">
    <ellipse class="error-illu-glow" cx="180" cy="120" rx="132" ry="92"/>
    <ellipse class="error-illu-shadow" cx="180" cy="230" rx="124" ry="16"/>

    {{-- Cracked gear --}}
    <g transform="translate(68 72)" opacity="0.85">
        <circle cx="40" cy="40" r="36" class="error-illu-stone"/>
        <circle cx="40" cy="40" r="16" class="error-illu-muted"/>
        <rect x="34" y="-4" width="12" height="16" rx="2" class="error-illu-stone"/>
        <rect x="34" y="68" width="12" height="16" rx="2" class="error-illu-stone"/>
        <rect x="-4" y="34" width="16" height="12" rx="2" class="error-illu-stone"/>
        <rect x="68" y="34" width="16" height="12" rx="2" class="error-illu-stone"/>
        <path d="M22 18 L48 58" stroke="hsl(var(--background))" stroke-width="4" stroke-linecap="round"/>
        <path d="M44 16 L28 40" stroke="hsl(var(--background))" stroke-width="3" stroke-linecap="round"/>
    </g>

    {{-- Unplugged cord --}}
    <path d="M40 200 C80 200 90 160 130 160" stroke="hsl(var(--foreground))" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect x="118" y="148" width="36" height="24" rx="6" class="error-illu-ink"/>
    <rect x="148" y="154" width="10" height="6" rx="1" class="error-illu-metal"/>
    <rect x="148" y="164" width="10" height="6" rx="1" class="error-illu-metal"/>

    <path d="M320 200 C280 200 270 160 230 160" stroke="hsl(var(--foreground))" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect x="206" y="148" width="36" height="24" rx="6" class="error-illu-ink"/>
    <rect x="202" y="154" width="10" height="6" rx="1" class="error-illu-metal"/>
    <rect x="202" y="164" width="10" height="6" rx="1" class="error-illu-metal"/>

    {{-- Gap sparks --}}
    <circle cx="180" cy="160" r="5" fill="hsl(var(--primary))"/>
    <circle cx="172" cy="146" r="3" fill="hsl(var(--primary))" opacity="0.7"/>
    <circle cx="190" cy="148" r="2.5" fill="hsl(var(--primary))" opacity="0.55"/>
    <path d="M180 138 L176 150 L184 148 L180 160" fill="hsl(var(--primary))" opacity="0.9"/>

    {{-- Mechanic --}}
    <circle class="error-illu-hair" cx="180" cy="86" r="16"/>
    <circle class="error-illu-skin" cx="180" cy="90" r="13"/>
    <rect class="error-illu-shirt" x="164" y="104" width="32" height="28" rx="10"/>
    <path d="M196 118 C214 112 226 128 236 142" stroke="#f0c090" stroke-width="7" stroke-linecap="round"/>
    {{-- Wrench --}}
    <g transform="translate(236 138) rotate(35)">
        <rect x="0" y="-4" width="36" height="8" rx="3" class="error-illu-metal"/>
        <circle cx="0" cy="0" r="8" class="error-illu-metal"/>
        <circle cx="0" cy="0" r="4" class="error-illu-muted"/>
        <rect x="32" y="-10" width="10" height="20" rx="3" class="error-illu-metal"/>
    </g>
</svg>
