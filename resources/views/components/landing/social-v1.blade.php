{{-- Social V1: Trusted-by logos + key metrics --}}
<section id="social" class="py-16 sm:py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Trusted by Leading Brands
        </h2>
        <p class="text-slate-500 max-w-2xl mx-auto mb-12">
            We've partnered with top companies to deliver exceptional products and results.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 mb-14 opacity-70">
            @foreach (['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Shopify', 'GitHub', 'Slack', 'Notion'] as $brand)
                <span class="text-slate-700 font-bold text-base tracking-tight">{{ $brand }}</span>
            @endforeach
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-sm font-semibold text-slate-800">5,000+ Projects Completed</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span class="text-sm font-semibold text-slate-800">10+ Years Experience</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-primary/70"></span>
                <span class="text-sm font-semibold text-slate-800">99% Client Satisfaction</span>
            </div>
        </div>
    </div>
</section>
