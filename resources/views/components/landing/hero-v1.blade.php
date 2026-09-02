{{-- Hero V1: Centered gradient headline with stats — works for any SaaS or product --}}
<section class="relative overflow-hidden bg-white pt-32 pb-20 sm:pt-40 sm:pb-28">
    {{-- Subtle grid background --}}
    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239333ea%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-80"></div>

    {{-- Gradient blobs --}}
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 -translate-y-1/2"></div>
    <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl opacity-20 translate-y-1/2"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {{-- Announcement badge --}}
        <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span class="w-1.5 h-1.5 bg-primary/100 rounded-full animate-pulse"></span>
            New: Announcing our v2.0 release
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
        </div>

        {{-- Main headline --}}
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Build your next big thing
            <span class="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mt-1">
                faster than ever
            </span>
        </h1>

        {{-- Subheadline --}}
        <p class="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A production-ready Laravel starter kit with authentication, roles, teams, billing, and a beautiful UI — everything you need to launch your product today.
        </p>

        {{-- CTA buttons --}}
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5">
                    Start building free
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            @endif
            <a href="#features" class="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-base hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                See how it works
            </a>
        </div>

        {{-- Social proof avatars + stars --}}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <div class="flex -space-x-2">
                @foreach(['7C3AED','6366F1','0EA5E9','10B981','F59E0B'] as $color)
                    <div class="w-9 h-9 rounded-full border-2 border-white bg-{{ $color }} flex items-center justify-center text-white text-xs font-bold shadow-sm" style="background-color: #{{ $color }}">
                        {{ chr(rand(65, 90)) }}
                    </div>
                @endforeach
            </div>
            <div class="text-left">
                <div class="flex items-center gap-1">
                    @for ($i = 0; $i < 5; $i++)
                        <svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    @endfor
                </div>
                <p class="text-sm text-slate-500"><span class="font-semibold text-slate-700">4.9/5</span> from 2,000+ developers</p>
            </div>
        </div>

        {{-- Stats row --}}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-slate-100">
            <div class="text-center">
                <div class="text-3xl font-bold text-slate-900">10k+</div>
                <div class="text-sm text-slate-500 mt-1">Projects launched</div>
            </div>
            <div class="text-center">
                <div class="text-3xl font-bold text-slate-900">99.9%</div>
                <div class="text-sm text-slate-500 mt-1">Uptime SLA</div>
            </div>
            <div class="text-center">
                <div class="text-3xl font-bold text-slate-900">< 1 day</div>
                <div class="text-sm text-slate-500 mt-1">Average setup time</div>
            </div>
        </div>
    </div>
</section>
