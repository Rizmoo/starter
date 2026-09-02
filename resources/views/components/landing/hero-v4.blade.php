{{-- Hero V4: Full-width image/gradient carousel with 3 slides --}}
<section data-hero-slider class="relative overflow-hidden bg-slate-950 min-h-[90vh] flex items-center" aria-roledescription="carousel">
    <div class="absolute inset-0">
        @php
            $slides = [
                [
                    'badge' => 'Launch faster',
                    'title' => 'Build products people love',
                    'subtitle' => 'A production-ready starter kit with auth, billing, teams, and a polished UI — so you ship features, not boilerplate.',
                    'cta' => 'Start free',
                    'cta_secondary' => 'See features',
                    'gradient' => 'from-primary/80 via-slate-950/90 to-slate-950',
                ],
                [
                    'badge' => 'Trusted teams',
                    'title' => 'Scale without the rewrite',
                    'subtitle' => 'Roles, API, and multi-tenant patterns are already wired. Grow from MVP to production with confidence.',
                    'cta' => 'Get started',
                    'cta_secondary' => 'View pricing',
                    'gradient' => 'from-slate-900 via-primary/50 to-slate-950',
                ],
                [
                    'badge' => 'Designer ready',
                    'title' => 'Swap layouts. Keep your brand.',
                    'subtitle' => 'Pick heroes, pricing, and CTAs that fit a SaaS, agency, or campaign site — then tune the primary color in seconds.',
                    'cta' => 'Explore layouts',
                    'cta_secondary' => 'Contact sales',
                    'gradient' => 'from-primary/60 via-slate-950 to-slate-900',
                ],
            ];
        @endphp

        @foreach ($slides as $index => $slide)
            <div
                data-hero-slide
                data-slide-index="{{ $index }}"
                class="absolute inset-0 transition-opacity duration-700 {{ $index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none' }}"
                aria-hidden="{{ $index === 0 ? 'false' : 'true' }}"
            >
                <div class="absolute inset-0 bg-gradient-to-br {{ $slide['gradient'] }}"></div>
                <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px;"></div>

                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[90vh] flex items-center py-28">
                    <div class="max-w-3xl">
                        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                            <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            {{ $slide['badge'] }}
                        </div>
                        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                            {{ $slide['title'] }}
                        </h1>
                        <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
                            {{ $slide['subtitle'] }}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            @if (Route::has('register'))
                                <a href="{{ route('register') }}" class="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                                    {{ $slide['cta'] }}
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </a>
                            @else
                                <a href="#features" class="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                                    {{ $slide['cta'] }}
                                </a>
                            @endif
                            <a href="#features" class="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all">
                                {{ $slide['cta_secondary'] }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    {{-- Controls --}}
    <div class="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-6">
        <button type="button" data-hero-prev class="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center" aria-label="Previous slide">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex items-center gap-2" data-hero-dots>
            @foreach ($slides as $index => $slide)
                <button
                    type="button"
                    data-hero-dot="{{ $index }}"
                    class="h-2.5 rounded-full transition-all {{ $index === 0 ? 'w-8 bg-primary' : 'w-2.5 bg-white/40 hover:bg-white/70' }}"
                    aria-label="Go to slide {{ $index + 1 }}"
                ></button>
            @endforeach
        </div>
        <button type="button" data-hero-next class="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center" aria-label="Next slide">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
    </div>
</section>
