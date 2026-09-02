{{-- Features V2: Alternating left-right feature blocks — great for "how it works" stories --}}
<section id="services" class="py-20 sm:py-28 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {{-- Section header --}}
        <div class="text-center max-w-2xl mx-auto mb-20">
            <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ✦ How it works
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                From zero to production in three steps
            </h2>
            <p class="text-lg text-slate-500">
                We've eliminated the friction from every stage of your build cycle.
            </p>
        </div>

        @php
            $steps = [
                [
                    'step' => '01',
                    'color' => 'violet',
                    'title' => 'Clone and configure',
                    'desc' => 'Get started in minutes with a single command. The starter kit ships with sensible defaults and a beautifully organized codebase that\'s ready to customize.',
                    'bullets' => ['Pre-configured environment files', 'One-command database seeding', 'Docker Compose for local dev', 'Auto-generated API documentation'],
                    'icon' => '📦',
                ],
                [
                    'step' => '02',
                    'color' => 'indigo',
                    'title' => 'Build your features',
                    'desc' => 'Focus on what makes your product unique. Authentication, roles, teams, billing, and notifications are already handled — just wire up your business logic.',
                    'bullets' => ['Modular service architecture', 'Reusable Blade components', 'Form validation with Livewire', 'Queue-based background jobs'],
                    'icon' => '⚙️',
                ],
                [
                    'step' => '03',
                    'color' => 'emerald',
                    'title' => 'Deploy with confidence',
                    'desc' => 'Ship with zero anxiety. Built-in CI/CD pipelines, automated tests, and one-click deployment to Laravel Cloud or any provider you choose.',
                    'bullets' => ['GitHub Actions workflows', 'Zero-downtime deployments', 'Automated health checks', 'Performance monitoring'],
                    'icon' => '🚀',
                ],
            ];
            $colorMap = [
                'violet' => ['badge' => 'bg-primary/15 text-primary', 'dot' => 'bg-primary', 'check' => 'text-primary', 'illustration' => 'from-primary/15 to-primary/5', 'border' => 'border-primary/20'],
                'indigo' => ['badge' => 'bg-primary/15 text-primary', 'dot' => 'bg-primary', 'check' => 'text-primary', 'illustration' => 'from-primary/20 to-primary/5', 'border' => 'border-primary/20'],
                'emerald' => ['badge' => 'bg-primary/15 text-primary', 'dot' => 'bg-primary', 'check' => 'text-primary', 'illustration' => 'from-primary/10 to-primary/5', 'border' => 'border-primary/20'],
            ];
        @endphp

        {{-- Alternating rows --}}
        <div class="space-y-24">
            @foreach($steps as $index => $step)
                @php $c = $colorMap[$step['color']]; @endphp
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center {{ $index % 2 === 1 ? 'lg:[&>*:first-child]:order-last' : '' }}">

                    {{-- Content side --}}
                    <div class="space-y-6">
                        <div class="flex items-center gap-4">
                            <span class="text-5xl">{{ $step['icon'] }}</span>
                            <span class="inline-flex items-center {{ $c['badge'] }} px-3 py-1 rounded-full text-sm font-bold font-mono">
                                Step {{ $step['step'] }}
                            </span>
                        </div>
                        <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            {{ $step['title'] }}
                        </h3>
                        <p class="text-slate-500 text-lg leading-relaxed">
                            {{ $step['desc'] }}
                        </p>
                        <ul class="space-y-3">
                            @foreach($step['bullets'] as $bullet)
                                <li class="flex items-start gap-3">
                                    <svg class="w-5 h-5 {{ $c['check'] }} mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    <span class="text-slate-600">{{ $bullet }}</span>
                                </li>
                            @endforeach
                        </ul>
                        <a href="#" class="inline-flex items-center gap-2 {{ str_replace('bg-', 'text-', $c['dot']) }} font-semibold text-sm hover:gap-3 transition-all">
                            Learn more about this step
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                    </div>

                    {{-- Illustration side --}}
                    <div class="relative">
                        <div class="bg-gradient-to-br {{ $c['illustration'] }} rounded-3xl border {{ $c['border'] }} aspect-[4/3] flex items-center justify-center overflow-hidden shadow-sm">
                            <div class="text-center px-8">
                                <div class="text-7xl mb-4">{{ $step['icon'] }}</div>
                                <div class="w-32 h-2 bg-white/80 rounded-full mx-auto mb-2"></div>
                                <div class="w-24 h-2 bg-white/60 rounded-full mx-auto mb-2"></div>
                                <div class="w-20 h-2 bg-white/40 rounded-full mx-auto"></div>
                            </div>
                        </div>
                        {{-- Step badge on illustration --}}
                        <div class="absolute -top-4 -right-4 w-16 h-16 {{ $c['dot'] }} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                            {{ $step['step'] }}
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>
