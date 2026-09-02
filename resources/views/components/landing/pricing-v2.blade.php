{{-- Pricing V2: Three tiers with feature comparison — Starter / Pro / Enterprise --}}
<section id="pricing" class="py-20 sm:py-28 bg-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {{-- Section header (dark theme) --}}
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="inline-flex items-center gap-2 bg-white/10 text-primary/70 border border-white/10 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ✦ Transparent pricing
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                The right plan for your team
            </h2>
            <p class="text-lg text-slate-400">
                All plans include a 14-day free trial. No credit card required.
            </p>
        </div>

        {{-- Three pricing cards --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            @php
                $plans = [
                    [
                        'name' => 'Starter',
                        'price' => '$19',
                        'period' => '/month',
                        'desc' => 'For individuals and small teams just getting started.',
                        'cta' => 'Start free trial',
                        'highlight' => false,
                        'features' => [
                            ['text' => '5 projects', 'included' => true],
                            ['text' => '3 team members', 'included' => true],
                            ['text' => '10 GB storage', 'included' => true],
                            ['text' => 'Email support', 'included' => true],
                            ['text' => 'API access', 'included' => true],
                            ['text' => 'Custom domain', 'included' => false],
                            ['text' => 'Priority support', 'included' => false],
                            ['text' => 'Audit logs', 'included' => false],
                            ['text' => 'SSO / SAML', 'included' => false],
                        ],
                    ],
                    [
                        'name' => 'Pro',
                        'price' => '$49',
                        'period' => '/month',
                        'desc' => 'For growing teams that need more power and flexibility.',
                        'cta' => 'Start free trial',
                        'highlight' => true,
                        'features' => [
                            ['text' => 'Unlimited projects', 'included' => true],
                            ['text' => '25 team members', 'included' => true],
                            ['text' => '100 GB storage', 'included' => true],
                            ['text' => 'Priority email support', 'included' => true],
                            ['text' => 'Full API access', 'included' => true],
                            ['text' => 'Custom domain', 'included' => true],
                            ['text' => 'Priority support', 'included' => true],
                            ['text' => 'Audit logs', 'included' => true],
                            ['text' => 'SSO / SAML', 'included' => false],
                        ],
                    ],
                    [
                        'name' => 'Enterprise',
                        'price' => 'Custom',
                        'period' => '',
                        'desc' => 'For large organizations with advanced security and compliance needs.',
                        'cta' => 'Contact sales',
                        'highlight' => false,
                        'features' => [
                            ['text' => 'Unlimited projects', 'included' => true],
                            ['text' => 'Unlimited members', 'included' => true],
                            ['text' => 'Unlimited storage', 'included' => true],
                            ['text' => 'Dedicated support', 'included' => true],
                            ['text' => 'Full API access', 'included' => true],
                            ['text' => 'Custom domain', 'included' => true],
                            ['text' => 'Priority support', 'included' => true],
                            ['text' => 'Audit logs', 'included' => true],
                            ['text' => 'SSO / SAML', 'included' => true],
                        ],
                    ],
                ];
            @endphp

            @foreach($plans as $plan)
                <div class="relative {{ $plan['highlight'] ? 'bg-white rounded-3xl shadow-2xl shadow-primary/20 scale-[1.02]' : 'bg-white/5 border border-white/10 rounded-3xl' }} p-8">
                    @if($plan['highlight'])
                        <div class="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span class="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Most popular</span>
                        </div>
                    @endif

                    <div class="mb-8">
                        <h3 class="text-lg font-bold {{ $plan['highlight'] ? 'text-slate-900' : 'text-white' }} mb-1">{{ $plan['name'] }}</h3>
                        <p class="{{ $plan['highlight'] ? 'text-slate-500' : 'text-slate-400' }} text-sm">{{ $plan['desc'] }}</p>
                    </div>

                    <div class="flex items-end gap-1 mb-8">
                        <span class="text-4xl font-black {{ $plan['highlight'] ? 'text-slate-900' : 'text-white' }}">{{ $plan['price'] }}</span>
                        @if($plan['period'])
                            <span class="{{ $plan['highlight'] ? 'text-slate-500' : 'text-slate-400' }} mb-1.5 text-sm">{{ $plan['period'] }}</span>
                        @endif
                    </div>

                    @if($plan['highlight'])
                        <a href="{{ Route::has('register') ? route('register') : '#' }}" class="block w-full text-center bg-primary text-white px-6 py-3.5 rounded-2xl font-semibold hover:bg-primary/90 transition-colors mb-8 shadow-sm">
                            {{ $plan['cta'] }}
                        </a>
                    @elseif($plan['name'] === 'Enterprise')
                        <a href="#" class="block w-full text-center bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-semibold hover:bg-white/20 transition-colors mb-8">
                            {{ $plan['cta'] }}
                        </a>
                    @else
                        <a href="{{ Route::has('register') ? route('register') : '#' }}" class="block w-full text-center bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-semibold hover:bg-white/20 transition-colors mb-8">
                            {{ $plan['cta'] }}
                        </a>
                    @endif

                    <ul class="space-y-3">
                        @foreach($plan['features'] as $feature)
                            <li class="flex items-center gap-3 text-sm {{ $plan['highlight'] ? ($feature['included'] ? 'text-slate-700' : 'text-slate-300') : ($feature['included'] ? 'text-slate-300' : 'text-slate-600') }}">
                                @if($feature['included'])
                                    <svg class="{{ $plan['highlight'] ? 'text-primary' : 'text-primary' }} w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                @else
                                    <svg class="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                @endif
                                {{ $feature['text'] }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>

        {{-- Trust footer --}}
        <div class="mt-16 text-center">
            <p class="text-slate-400 text-sm flex flex-wrap justify-center items-center gap-6">
                <span class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Cancel anytime</span>
                <span class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> No credit card required</span>
                <span class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> 14-day free trial</span>
                <span class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> SOC 2 compliant</span>
            </p>
        </div>
    </div>
</section>
