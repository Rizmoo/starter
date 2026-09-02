{{-- Features V1: 6-card icon grid — best for showcasing product features at a glance --}}
<section id="features" class="py-20 sm:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {{-- Section header --}}
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ✦ Everything you need
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Built for speed, designed for scale
            </h2>
            <p class="text-lg text-slate-500 leading-relaxed">
                Every feature has been carefully crafted to help you move fast without sacrificing quality or flexibility.
            </p>
        </div>

        {{-- Feature card grid --}}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            @php
                $features = [
                    ['icon' => '🔐', 'color' => 'violet', 'title' => 'Authentication & Roles', 'desc' => 'Complete auth system with registration, email verification, 2FA, and fine-grained role-based permissions out of the box.'],
                    ['icon' => '💳', 'color' => 'emerald', 'title' => 'Billing & Subscriptions', 'desc' => 'Stripe integration with subscription plans, usage-based billing, invoicing, and a self-service customer portal.'],
                    ['icon' => '👥', 'color' => 'blue', 'title' => 'Teams & Organizations', 'desc' => 'Multi-tenancy support with team management, member invitations, and per-team settings and billing.'],
                    ['icon' => '⚡', 'color' => 'amber', 'title' => 'API-First Architecture', 'desc' => 'RESTful API with versioning, Sanctum authentication, rate limiting, and comprehensive API documentation.'],
                    ['icon' => '📊', 'color' => 'rose', 'title' => 'Analytics & Insights', 'desc' => 'Built-in activity logging, audit trails, event tracking, and a beautiful dashboard with charts and metrics.'],
                    ['icon' => '🚀', 'color' => 'indigo', 'title' => 'One-Click Deploy', 'desc' => 'Deploy to Laravel Cloud, Forge, or any VPS with CI/CD pipelines, zero-downtime deployments, and auto-scaling.'],
                ];
                $colorMap = [
                    'violet' => ['bg' => 'bg-primary/10', 'text' => 'text-primary', 'border' => 'border-primary/20'],
                    'emerald' => ['bg' => 'bg-emerald-50', 'text' => 'text-emerald-600', 'border' => 'border-emerald-100'],
                    'blue' => ['bg' => 'bg-blue-50', 'text' => 'text-blue-600', 'border' => 'border-blue-100'],
                    'amber' => ['bg' => 'bg-amber-50', 'text' => 'text-amber-600', 'border' => 'border-amber-100'],
                    'rose' => ['bg' => 'bg-rose-50', 'text' => 'text-rose-600', 'border' => 'border-rose-100'],
                    'indigo' => ['bg' => 'bg-primary/10', 'text' => 'text-primary', 'border' => 'border-primary/20'],
                ];
            @endphp

            @foreach($features as $feature)
                @php $c = $colorMap[$feature['color']]; @endphp
                <div class="group relative bg-white border border-slate-200 rounded-2xl p-7 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <div class="w-12 h-12 {{ $c['bg'] }} border {{ $c['border'] }} rounded-xl flex items-center justify-center text-2xl mb-5">
                        {{ $feature['icon'] }}
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ $feature['title'] }}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">{{ $feature['desc'] }}</p>
                    <div class="mt-5 flex items-center gap-1 {{ $c['text'] }} text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Bottom CTA --}}
        <div class="text-center mt-12">
            <a href="#" class="inline-flex items-center gap-2 text-primary font-medium hover:text-primary text-sm">
                View all features
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </div>
    </div>
</section>
