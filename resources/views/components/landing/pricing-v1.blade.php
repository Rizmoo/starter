{{-- Pricing V1: Two tiers (Free + Pro) with monthly/annual toggle — simple and clean --}}
<section id="pricing" class="py-20 sm:py-28 bg-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {{-- Section header --}}
        <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ✦ Simple pricing
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Start free, scale when ready
            </h2>
            <p class="text-lg text-slate-500">
                No hidden fees. No credit card required to get started.
            </p>
        </div>

        {{-- Toggle (visual only — JS needed for functional toggle) --}}
        <div class="flex items-center justify-center gap-4 mb-12">
            <span class="text-sm font-medium text-slate-700">Monthly</span>
            <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                <span class="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
            </button>
            <span class="text-sm font-medium text-slate-700">
                Annual
                <span class="ml-1.5 inline-flex items-center bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">Save 20%</span>
            </span>
        </div>

        {{-- Pricing cards --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            {{-- Free tier --}}
            <div class="border border-slate-200 rounded-3xl p-8 bg-white">
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-slate-900 mb-1">Free</h3>
                    <p class="text-slate-500 text-sm">Perfect for personal projects and exploration.</p>
                </div>
                <div class="flex items-end gap-2 mb-8">
                    <span class="text-5xl font-black text-slate-900">$0</span>
                    <span class="text-slate-500 mb-1.5">/month</span>
                </div>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="block w-full text-center border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-semibold hover:bg-slate-50 transition-colors mb-8">
                        Get started free
                    </a>
                @endif
                <ul class="space-y-3">
                    @foreach(['Up to 3 projects', '1 team member', '5 GB storage', 'Community support', 'Core features', 'Public API access'] as $feature)
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            {{ $feature }}
                        </li>
                    @endforeach
                </ul>
            </div>

            {{-- Pro tier --}}
            <div class="border-2 border-primary rounded-3xl p-8 bg-primary/5 relative shadow-lg shadow-primary/10">
                <div class="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span class="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-md">Most popular</span>
                </div>
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-slate-900 mb-1">Pro</h3>
                    <p class="text-slate-500 text-sm">For teams building serious products.</p>
                </div>
                <div class="flex items-end gap-2 mb-8">
                    <span class="text-5xl font-black text-slate-900">$29</span>
                    <span class="text-slate-500 mb-1.5">/month</span>
                </div>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="block w-full text-center bg-primary text-white px-6 py-3.5 rounded-2xl font-semibold hover:bg-primary/90 transition-colors mb-8 shadow-sm">
                        Start Pro — 14-day trial
                    </a>
                @endif
                <ul class="space-y-3">
                    @foreach(['Unlimited projects', 'Up to 25 team members', '100 GB storage', 'Priority email support', 'All features + addons', 'Advanced API access', 'Custom domain', 'Audit logs'] as $feature)
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            {{ $feature }}
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>

        {{-- Enterprise note --}}
        <div class="mt-10 text-center">
            <p class="text-slate-500 text-sm">
                Need more?
                <a href="#" class="text-primary font-medium hover:underline ml-1">Talk to us about Enterprise →</a>
            </p>
        </div>
    </div>
</section>
