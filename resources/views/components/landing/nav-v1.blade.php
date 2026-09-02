{{-- Nav V1: Sticky glassmorphism with logo, links, and auth CTAs --}}
<nav data-landing-nav class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

            {{-- Logo --}}
            <a href="/" class="flex items-center gap-2.5 shrink-0">
                <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm0 3a3 3 0 100 6 3 3 0 000-6z"/>
                    </svg>
                </div>
                <span class="font-bold text-slate-900 text-lg tracking-tight">{{ config('app.name') }}</span>
            </a>

            {{-- Desktop nav links --}}
            <div class="hidden md:flex items-center gap-1">
                <a href="#features" class="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">Features</a>
                <a href="#services" class="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">Services</a>
                <a href="#pricing" class="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">Pricing</a>
                <a href="#about" class="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">About</a>
            </div>

            {{-- Desktop auth CTAs --}}
            <div class="hidden md:flex items-center gap-3">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}" class="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">Log in</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                                Get started free
                            </a>
                        @endif
                    @endauth
                @endif
            </div>

            {{-- Mobile hamburger --}}
            <button type="button" data-landing-nav-toggle class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" aria-expanded="false" aria-label="Toggle menu">
                <svg data-landing-nav-icon="open" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg data-landing-nav-icon="close" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        {{-- Mobile menu --}}
        <div data-landing-nav-menu class="hidden md:hidden py-4 border-t border-slate-100 space-y-1">
            <a href="#features" class="block text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">Features</a>
            <a href="#services" class="block text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">Services</a>
            <a href="#pricing" class="block text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">Pricing</a>
            <a href="#about" class="block text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">About</a>
            @if (Route::has('login'))
                @auth
                    <a href="{{ url('/dashboard') }}" class="block text-sm text-slate-600 px-3 py-2">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="block text-sm text-slate-600 px-3 py-2">Log in</a>
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl text-center mt-2">Get started free</a>
                    @endif
                @endauth
            @endif
        </div>
    </div>
</nav>
