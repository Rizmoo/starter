{{-- Hero V2: Split layout — text left, app mockup right — great for SaaS dashboards --}}
<section class="relative bg-slate-50 pt-32 pb-0 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

            {{-- Left: Content --}}
            <div class="pb-16 lg:pb-24">

                {{-- Badge --}}
                <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-6">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    Trusted by 10,000+ teams
                </div>

                {{-- Headline --}}
                <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    The smartest way to
                    <span class="text-primary">manage your workflow</span>
                </h1>

                {{-- Description --}}
                <p class="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                    From idea to launch in days, not months. Our platform handles the tedious parts so you can focus on what actually matters — building your product.
                </p>

                {{-- Mini stats --}}
                <div class="flex gap-8 mb-10">
                    <div>
                        <div class="text-2xl font-bold text-slate-900">3x</div>
                        <div class="text-sm text-slate-500">Faster delivery</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-slate-900">60%</div>
                        <div class="text-sm text-slate-500">Less boilerplate</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-slate-900">∞</div>
                        <div class="text-sm text-slate-500">Possibilities</div>
                    </div>
                </div>

                {{-- CTAs --}}
                <div class="flex flex-col sm:flex-row gap-3">
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="flex items-center justify-center gap-2 bg-primary text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                            Get started — it's free
                        </a>
                    @endif
                    <a href="#demo" class="flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                        <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                        </svg>
                        Watch demo
                    </a>
                </div>

                {{-- Social logos --}}
                <p class="mt-10 text-xs text-slate-400 uppercase tracking-widest font-medium mb-4">Used by teams at</p>
                <div class="flex flex-wrap gap-6 items-center opacity-40">
                    @foreach(['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma'] as $brand)
                        <span class="text-slate-700 font-bold text-base tracking-tight">{{ $brand }}</span>
                    @endforeach
                </div>
            </div>

            {{-- Right: App mockup --}}
            <div class="relative lg:pb-0 hidden lg:block">
                <div class="relative">
                    {{-- Browser chrome --}}
                    <div class="bg-white rounded-t-2xl border border-slate-200 shadow-2xl overflow-hidden">
                        {{-- Browser toolbar --}}
                        <div class="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                            <div class="flex gap-1.5">
                                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                                <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div class="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div class="flex-1 mx-4 bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 text-center">
                                app.example.com/dashboard
                            </div>
                        </div>
                        {{-- App screenshot placeholder --}}
                        <div class="bg-gradient-to-br from-slate-100 to-primary/10 h-96 flex items-center justify-center">
                            <div class="w-full px-6 space-y-3">
                                {{-- Fake dashboard UI --}}
                                <div class="grid grid-cols-3 gap-3">
                                    @foreach(['Revenue', 'Users', 'Conversions'] as $metric)
                                        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                            <div class="text-xs text-slate-400 mb-1">{{ $metric }}</div>
                                            <div class="text-lg font-bold text-slate-800">{{ rand(100, 999) }}</div>
                                            <div class="text-xs text-emerald-600 mt-1">↑ {{ rand(5, 25) }}%</div>
                                        </div>
                                    @endforeach
                                </div>
                                <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                    <div class="text-xs text-slate-400 mb-3">Recent activity</div>
                                    @foreach(['User signed up', 'Payment received', 'Report generated'] as $item)
                                        <div class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                            <div class="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                                                <div class="w-2 h-2 rounded-full bg-primary/100"></div>
                                            </div>
                                            <div class="text-sm text-slate-600">{{ $item }}</div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                    {{-- Floating cards --}}
                    <div class="absolute -left-8 top-1/3 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3">
                        <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-800">Deploy successful</div>
                            <div class="text-xs text-slate-400">Just now</div>
                        </div>
                    </div>
                    <div class="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
                        <div class="text-xs text-slate-400 mb-1">Monthly revenue</div>
                        <div class="text-xl font-bold text-slate-900">$24,891</div>
                        <div class="text-xs text-emerald-600">↑ 18% this month</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
