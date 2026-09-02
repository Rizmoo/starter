{{-- Pricing V3: Feature comparison table — detailed view for informed buyers --}}
<section id="pricing" class="py-20 sm:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {{-- Section header --}}
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ✦ Compare plans
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Pick your perfect plan
            </h2>
            <p class="text-lg text-slate-500">
                All plans include our core features. Upgrade for more power.
            </p>
        </div>

        {{-- Plan headers --}}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr>
                        <th class="text-left pb-8 pr-8 align-bottom">
                            <div class="text-slate-500 text-sm font-normal max-w-xs">Compare everything that's included in each plan</div>
                        </th>
                        @php
                            $plans = [
                                ['name' => 'Starter', 'price' => '$19', 'cta' => 'Get started', 'highlight' => false],
                                ['name' => 'Pro', 'price' => '$49', 'cta' => 'Start free trial', 'highlight' => true],
                                ['name' => 'Enterprise', 'price' => 'Custom', 'cta' => 'Contact sales', 'highlight' => false],
                            ];
                        @endphp
                        @foreach($plans as $plan)
                            <th class="pb-8 px-6 text-center align-bottom">
                                <div class="{{ $plan['highlight'] ? 'bg-primary text-white rounded-t-2xl pt-4 pb-6 px-4 -mx-4' : '' }}">
                                    <div class="text-base font-bold {{ $plan['highlight'] ? 'text-white' : 'text-slate-900' }} mb-1">{{ $plan['name'] }}</div>
                                    <div class="text-3xl font-black {{ $plan['highlight'] ? 'text-white' : 'text-slate-900' }} mb-1">{{ $plan['price'] }}</div>
                                    @if($plan['price'] !== 'Custom')
                                        <div class="text-xs {{ $plan['highlight'] ? 'text-primary/80' : 'text-slate-400' }} mb-3">per month</div>
                                    @else
                                        <div class="text-xs {{ $plan['highlight'] ? 'text-primary/80' : 'text-slate-400' }} mb-3">bespoke pricing</div>
                                    @endif
                                    <a href="{{ $plan['name'] === 'Enterprise' ? '#' : (Route::has('register') ? route('register') : '#') }}"
                                        class="{{ $plan['highlight'] ? 'bg-white text-primary hover:bg-primary/10' : 'border border-slate-200 text-slate-700 hover:bg-slate-50' }} block text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                        {{ $plan['cta'] }}
                                    </a>
                                </div>
                            </th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @php
                        $rows = [
                            ['category' => true, 'label' => 'Usage limits'],
                            ['label' => 'Projects', 'values' => ['5', 'Unlimited', 'Unlimited']],
                            ['label' => 'Team members', 'values' => ['3', '25', 'Unlimited']],
                            ['label' => 'Storage', 'values' => ['10 GB', '100 GB', 'Unlimited']],
                            ['label' => 'API calls/month', 'values' => ['10,000', '500,000', 'Unlimited']],

                            ['category' => true, 'label' => 'Features'],
                            ['label' => 'Authentication & 2FA', 'values' => [true, true, true]],
                            ['label' => 'Team management', 'values' => [true, true, true]],
                            ['label' => 'Billing & subscriptions', 'values' => [false, true, true]],
                            ['label' => 'Custom domain', 'values' => [false, true, true]],
                            ['label' => 'Audit logs', 'values' => [false, true, true]],
                            ['label' => 'SSO / SAML', 'values' => [false, false, true]],
                            ['label' => 'Advanced permissions', 'values' => [false, false, true]],

                            ['category' => true, 'label' => 'Support'],
                            ['label' => 'Community support', 'values' => [true, true, true]],
                            ['label' => 'Email support', 'values' => [false, true, true]],
                            ['label' => 'Priority support', 'values' => [false, true, true]],
                            ['label' => 'Dedicated account manager', 'values' => [false, false, true]],
                            ['label' => 'SLA guarantee', 'values' => [false, false, true]],
                        ];
                    @endphp
                    @foreach($rows as $row)
                        @if(isset($row['category']) && $row['category'])
                            <tr>
                                <td colspan="4" class="pt-8 pb-3">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">{{ $row['label'] }}</span>
                                </td>
                            </tr>
                        @else
                            <tr class="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td class="py-4 pr-8 text-sm text-slate-700 font-medium">{{ $row['label'] }}</td>
                                @foreach($row['values'] as $i => $value)
                                    <td class="py-4 px-6 text-center {{ $i === 1 ? 'bg-primary/5' : '' }}">
                                        @if(is_bool($value))
                                            @if($value)
                                                <svg class="w-5 h-5 text-primary mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                                </svg>
                                            @else
                                                <svg class="w-4 h-4 text-slate-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                                </svg>
                                            @endif
                                        @else
                                            <span class="text-sm font-semibold {{ $i === 1 ? 'text-primary' : 'text-slate-700' }}">{{ $value }}</span>
                                        @endif
                                    </td>
                                @endforeach
                            </tr>
                        @endif
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</section>
