{{-- CTA V1: Simple centered — clean, focused, no distractions --}}
<section class="py-20 sm:py-28 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Ready to build something great?
        </h2>
        <p class="text-xl text-slate-500 mb-10 leading-relaxed">
            Join thousands of developers who've already shipped their products with our starter kit. Start for free — no credit card needed.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5">
                    Get started for free
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            @endif
            <a href="#" class="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-base hover:bg-slate-50 transition-all">
                Read the docs
            </a>
        </div>
        <p class="text-sm text-slate-400 mt-6">
            Free forever on the basic plan · No credit card required · Cancel anytime
        </p>
    </div>
</section>
