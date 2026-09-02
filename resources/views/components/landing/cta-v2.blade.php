{{-- CTA V2: Full-width gradient with email capture — high-conversion newsletter or signup --}}
<section class="relative overflow-hidden py-20 sm:py-28">
    {{-- Gradient background --}}
    <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>

    {{-- Decorative blobs --}}
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/30 rounded-full blur-3xl"></div>

    {{-- Dot grid --}}
    <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 24px 24px;"></div>

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {{-- Badge --}}
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-primary/90 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            Start building today — free forever
        </div>

        {{-- Headline --}}
        <h2 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Your next big product<br>starts with one command
        </h2>

        <p class="text-xl text-primary/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get the starter kit in your inbox. We'll also send product updates, tutorials, and tips — no spam, ever.
        </p>

        {{-- Email capture form --}}
        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6" onsubmit="return false;">
            <input
                type="email"
                placeholder="you@company.com"
                class="flex-1 px-5 py-4 rounded-2xl text-slate-900 bg-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
            />
            <button type="submit" class="bg-slate-900 text-white px-7 py-4 rounded-2xl font-semibold text-sm hover:bg-slate-800 transition-colors shadow-lg whitespace-nowrap">
                Get free access →
            </button>
        </form>

        <p class="text-primary/70 text-sm">
            Join 12,000+ developers already building with us. Unsubscribe at any time.
        </p>

        {{-- Alternative CTA --}}
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 border-t border-white/20">
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="text-sm text-primary/80 hover:text-white font-medium underline underline-offset-4">
                    Or create a free account →
                </a>
            @endif
            @if (Route::has('login'))
                <a href="{{ route('login') }}" class="text-sm text-primary/80 hover:text-white font-medium underline underline-offset-4">
                    Already have an account? Sign in
                </a>
            @endif
        </div>
    </div>
</section>
