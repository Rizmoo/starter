{{-- CTA V3: Split layout — headline/CTA left, benefit list right — high information density --}}
<section class="py-20 sm:py-28 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div class="lg:grid lg:grid-cols-2">

                {{-- Left: Headline + CTAs --}}
                <div class="p-10 lg:p-16 flex flex-col justify-center">
                    <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-6 w-fit">
                        ✦ Limited time offer
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Skip the boilerplate.<br>
                        <span class="text-primary">Ship in a weekend.</span>
                    </h2>
                    <p class="text-slate-500 text-lg leading-relaxed mb-8">
                        Get lifetime access to the full starter kit — including all future updates — at our launch price. This offer won't last forever.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="flex items-center justify-center gap-2 bg-primary text-white px-7 py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                Claim your spot
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        @endif
                        <a href="#" class="flex items-center justify-center border border-slate-200 text-slate-700 px-7 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all">
                            Learn more
                        </a>
                    </div>
                    <p class="text-sm text-slate-400 mt-4">
                        14-day money-back guarantee. No questions asked.
                    </p>
                </div>

                {{-- Right: Benefit list --}}
                <div class="bg-slate-50 border-l border-slate-200 p-10 lg:p-16">
                    <h3 class="text-base font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs text-slate-400">
                        Everything included in the kit
                    </h3>
                    <ul class="space-y-4">
                        @php
                            $benefits = [
                                ['icon' => '🔐', 'text' => 'Complete auth system with 2FA, social login, and role-based permissions'],
                                ['icon' => '💳', 'text' => 'Stripe billing with subscriptions, usage tracking, and customer portal'],
                                ['icon' => '👥', 'text' => 'Multi-tenant architecture with team management and invitations'],
                                ['icon' => '📧', 'text' => 'Transactional email with beautiful templates and queue support'],
                                ['icon' => '📊', 'text' => 'Admin dashboard with user management, analytics, and audit logs'],
                                ['icon' => '🚀', 'text' => 'One-click deploy to Laravel Cloud, Forge, or any VPS'],
                                ['icon' => '🧪', 'text' => 'Comprehensive PHPUnit test suite with CI/CD pipelines'],
                                ['icon' => '♾️', 'text' => 'Lifetime access to the kit + all future updates, forever'],
                            ];
                        @endphp
                        @foreach($benefits as $benefit)
                            <li class="flex items-start gap-4">
                                <span class="text-xl mt-0.5">{{ $benefit['icon'] }}</span>
                                <span class="text-sm text-slate-600 leading-relaxed">{{ $benefit['text'] }}</span>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
