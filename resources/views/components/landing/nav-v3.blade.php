{{-- Nav V3: Dark transparent nav — perfect for dark/full-bleed hero sections --}}
<nav class="absolute top-0 inset-x-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">

            {{-- Logo (white) --}}
            <a href="/" class="flex items-center gap-2.5 shrink-0">
                <div class="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm0 3a3 3 0 100 6 3 3 0 000-6z"/>
                    </svg>
                </div>
                <span class="font-bold text-white text-lg tracking-tight">{{ config('app.name') }}</span>
            </a>

            {{-- Desktop nav links (white) --}}
            <div class="hidden md:flex items-center gap-1">
                <a href="#features" class="text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">Features</a>
                <a href="#services" class="text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">Services</a>
                <a href="#pricing" class="text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">Pricing</a>
                <a href="#about" class="text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">About</a>
            </div>

            {{-- Auth CTAs --}}
            <div class="hidden md:flex items-center gap-3">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}" class="text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">Log in</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="text-sm font-medium bg-white text-primary px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors shadow-sm">
                                Get started
                            </a>
                        @endif
                    @endauth
                @endif
            </div>
        </div>
    </div>
</nav>
