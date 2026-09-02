{{-- Footer V1: Minimal — logo, links, copyright in a single clean bar --}}
<footer class="border-t border-slate-200 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">

            {{-- Logo --}}
            <a href="/" class="flex items-center gap-2 shrink-0">
                <div class="w-7 h-7 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm0 3a3 3 0 100 6 3 3 0 000-6z"/>
                    </svg>
                </div>
                <span class="font-bold text-slate-900 text-base">{{ config('app.name') }}</span>
            </a>

            {{-- Links --}}
            <nav class="flex flex-wrap items-center justify-center gap-6">
                <a href="#" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</a>
                <a href="#" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
                <a href="#" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Blog</a>
                <a href="#" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Docs</a>
                <a href="#" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</a>
            </nav>

            {{-- Copyright --}}
            <p class="text-sm text-slate-400 shrink-0">
                © {{ date('Y') }} {{ config('app.name') }}
            </p>
        </div>
    </div>
</footer>
