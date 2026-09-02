{{-- Nav V2: Centered logo with horizontal nav below — great for content/agency sites --}}
<nav class="bg-white border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {{-- Top bar: logo center, auth right --}}
        <div class="flex items-center justify-between py-4 border-b border-slate-50">
            <div class="w-24"></div>
            <a href="/" class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm0 3a3 3 0 100 6 3 3 0 000-6z"/>
                    </svg>
                </div>
                <span class="font-bold text-slate-900 text-xl tracking-tight">{{ config('app.name') }}</span>
            </a>
            <div class="w-24 flex justify-end">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}" class="text-sm text-slate-600 hover:text-slate-900">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="text-sm text-primary font-medium hover:text-primary">Sign in</a>
                    @endauth
                @endif
            </div>
        </div>

        {{-- Bottom bar: centered nav links --}}
        <div class="flex items-center justify-center gap-1 py-2">
            <a href="#features" class="text-sm text-slate-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">Features</a>
            <a href="#services" class="text-sm text-slate-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">Services</a>
            <a href="#pricing" class="text-sm text-slate-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">Pricing</a>
            <a href="#about" class="text-sm text-slate-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">About</a>
            <a href="#blog" class="text-sm text-slate-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">Blog</a>
            @if (Route::has('register'))
                @guest
                    <a href="{{ route('register') }}" class="ml-4 text-sm font-semibold bg-primary text-white px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors">Start for free →</a>
                @endguest
            @endif
        </div>
    </div>
</nav>
