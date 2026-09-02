{{-- Hero V3: Dark full-screen with ambient gradient glow — bold and impactful --}}
<section class="relative min-h-screen flex items-center bg-slate-950 overflow-hidden">

    {{-- Ambient gradient glows --}}
    <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[180px] opacity-15"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[180px] opacity-15"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[240px] opacity-8"></div>

    {{-- Dot grid overlay --}}
    <div class="absolute inset-0" style="background-image: radial-gradient(rgba(148,163,184,0.08) 1px, transparent 1px); background-size: 32px 32px;"></div>

    {{-- Top nav handled by nav-v3 component --}}
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div class="text-center max-w-4xl mx-auto">

            {{-- Chip --}}
            <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-4 py-2 rounded-full text-sm mb-10 backdrop-blur-sm">
                <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Introducing {{ config('app.name') }} — the future of development
                <span class="text-primary">→</span>
            </div>

            {{-- Headline --}}
            <h1 class="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight leading-none mb-8">
                Ship products
                <span class="block">
                    <span class="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        at light speed
                    </span>
                </span>
            </h1>

            {{-- Description --}}
            <p class="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Stop wrestling with boilerplate. Start with a battle-tested foundation and deliver your vision to users — not your infrastructure team.
            </p>

            {{-- CTA --}}
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="group relative flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary/10 transition-all shadow-2xl shadow-primary/20">
                        <span>Start building — free</span>
                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                @endif
                <a href="#features" class="flex items-center gap-2 text-slate-300 hover:text-white px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm">
                    View documentation
                </a>
            </div>

            {{-- Feature tags --}}
            <div class="flex flex-wrap justify-center gap-3">
                @foreach(['Laravel 13', 'Tailwind v4', 'React / Inertia', 'Auth & Roles', 'Billing', 'API Ready', 'Dark Mode', 'Deployable in minutes'] as $tag)
                    <span class="text-xs text-slate-400 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">{{ $tag }}</span>
                @endforeach
            </div>
        </div>

        {{-- Bottom gradient fade --}}
        <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </div>
</section>
