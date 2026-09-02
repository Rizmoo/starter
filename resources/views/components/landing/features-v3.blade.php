{{-- Features V3: Two-column icon list with a large visual — compact and comprehensive --}}
<section class="py-20 sm:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-start">

            {{-- Left: Sticky headline + visual --}}
            <div class="lg:sticky lg:top-24 mb-12 lg:mb-0">
                <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    ✦ Full feature set
                </span>
                <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                    Everything included,<br>nothing to add
                </h2>
                <p class="text-lg text-slate-500 mb-8 leading-relaxed">
                    We've made hundreds of decisions so you don't have to. Every feature is production-ready and fully customizable.
                </p>

                {{-- Visual card --}}
                <div class="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white shadow-2xl shadow-primary/20">
                    <div class="text-4xl mb-4">⚡</div>
                    <div class="text-2xl font-bold mb-2">Launch in days,<br>not months</div>
                    <p class="text-primary/80 text-sm leading-relaxed mb-6">
                        The average team saves 200+ hours of setup time with our starter kit. That's 5 developer weeks you can spend on your actual product.
                    </p>
                    <div class="flex items-center justify-between pt-6 border-t border-white/20">
                        <div class="text-center">
                            <div class="text-2xl font-black">200h</div>
                            <div class="text-xs text-primary/70">Time saved</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-black">50+</div>
                            <div class="text-xs text-primary/70">Components</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-black">∞</div>
                            <div class="text-xs text-primary/70">Customization</div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right: Feature list grid --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                @php
                    $items = [
                        ['icon' => '🔐', 'title' => 'Multi-factor auth', 'desc' => 'TOTP, SMS, and backup codes'],
                        ['icon' => '👥', 'title' => 'Team management', 'desc' => 'Roles, permissions, invitations'],
                        ['icon' => '💳', 'title' => 'Stripe billing', 'desc' => 'Subscriptions and one-time payments'],
                        ['icon' => '📧', 'title' => 'Email system', 'desc' => 'Templates, queuing, tracking'],
                        ['icon' => '🔔', 'title' => 'Notifications', 'desc' => 'Real-time, email, and push'],
                        ['icon' => '📊', 'title' => 'Admin dashboard', 'desc' => 'Users, logs, and settings'],
                        ['icon' => '🌐', 'title' => 'API & webhooks', 'desc' => 'RESTful with Sanctum auth'],
                        ['icon' => '🔍', 'title' => 'Full-text search', 'desc' => 'Scout with Meilisearch/Algolia'],
                        ['icon' => '📁', 'title' => 'File uploads', 'desc' => 'S3-compatible with CDN support'],
                        ['icon' => '🌍', 'title' => 'Localization', 'desc' => 'i18n with language switching'],
                        ['icon' => '📱', 'title' => 'Responsive UI', 'desc' => 'Mobile-first Tailwind design'],
                        ['icon' => '🧪', 'title' => 'Testing suite', 'desc' => 'PHPUnit + browser tests'],
                    ];
                @endphp
                @foreach($items as $item)
                    <div class="bg-white p-6 hover:bg-primary/10/50 transition-colors group">
                        <div class="flex items-start gap-4">
                            <div class="text-2xl mt-0.5">{{ $item['icon'] }}</div>
                            <div>
                                <h4 class="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors">{{ $item['title'] }}</h4>
                                <p class="text-xs text-slate-500 mt-0.5">{{ $item['desc'] }}</p>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
