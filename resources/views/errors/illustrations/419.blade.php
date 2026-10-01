<svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-auto w-full">
    <ellipse class="error-illu-glow" cx="180" cy="118" rx="128" ry="90"/>
    <ellipse class="error-illu-shadow" cx="180" cy="232" rx="120" ry="16"/>

    {{-- Clock face --}}
    <circle cx="292" cy="72" r="28" class="error-illu-muted"/>
    <circle cx="292" cy="72" r="22" fill="hsl(var(--background))"/>
    <line x1="292" y1="72" x2="292" y2="58" stroke="hsl(var(--foreground))" stroke-width="3" stroke-linecap="round"/>
    <line x1="292" y1="72" x2="304" y2="78" stroke="hsl(var(--primary))" stroke-width="3" stroke-linecap="round"/>
    <circle cx="292" cy="72" r="3" fill="hsl(var(--primary))"/>

    {{-- Hourglass --}}
    <rect x="132" y="42" width="96" height="14" rx="4" class="error-illu-wood"/>
    <rect x="132" y="186" width="96" height="14" rx="4" class="error-illu-wood"/>
    <path d="M148 56 L180 118 L148 180 H212 L180 118 L212 56 Z" fill="#e2e8f0"/>
    <path d="M156 64 L180 108 L204 64 Z" class="error-illu-sand"/>
    <ellipse cx="180" cy="172" rx="22" ry="6" class="error-illu-sand"/>
    <path d="M180 108 L180 164" stroke="#d97706" stroke-width="2" stroke-dasharray="3 4"/>

    {{-- Expired ticket --}}
    <g transform="translate(248 150) rotate(12)">
        <rect x="0" y="0" width="72" height="44" rx="6" fill="#fff"/>
        <rect x="0" y="0" width="72" height="44" rx="6" stroke="hsl(var(--border))" />
        <path d="M8 8 H40 M8 16 H52 M8 24 H28" stroke="hsl(var(--muted-foreground))" stroke-width="2"/>
        <circle cx="58" cy="22" r="10" fill="#fecaca"/>
        <path d="M54 18 L62 26 M62 18 L54 26" stroke="#b91c1c" stroke-width="2" stroke-linecap="round"/>
    </g>

    {{-- Person checking a watch --}}
    <circle class="error-illu-hair" cx="72" cy="156" r="15"/>
    <circle class="error-illu-skin" cx="72" cy="160" r="12"/>
    <rect class="error-illu-shirt" x="56" y="174" width="32" height="28" rx="10"/>
    <rect class="error-illu-pants" x="62" y="200" width="20" height="20" rx="5"/>
    <path d="M88 186 C104 180 108 170 104 160" stroke="#f0c090" stroke-width="7" stroke-linecap="round"/>
    <circle cx="104" cy="156" r="7" class="error-illu-metal"/>
</svg>
