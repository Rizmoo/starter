{{-- Footer V2: Full multi-column footer with newsletter, social links, and site map --}}
<footer class="bg-slate-950 text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {{-- Main footer content --}}
        <div class="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

            {{-- Brand col (takes 2 cols) --}}
            <div class="lg:col-span-2 space-y-6">
                <a href="/" class="flex items-center gap-2.5">
                    <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm0 3a3 3 0 100 6 3 3 0 000-6z"/>
                        </svg>
                    </div>
                    <span class="font-bold text-white text-lg">{{ config('app.name') }}</span>
                </a>
                <p class="text-sm leading-relaxed max-w-xs">
                    The production-ready Laravel starter kit that gives you a head start on your next SaaS, website, or web application.
                </p>
                {{-- Social links --}}
                <div class="flex items-center gap-3">
                    @php
                        $socials = [
                            ['name' => 'GitHub', 'href' => '#', 'icon' => '<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>'],
                            ['name' => 'Twitter', 'href' => '#', 'icon' => '<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>'],
                            ['name' => 'LinkedIn', 'href' => '#', 'icon' => '<path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"/>'],
                        ];
                    @endphp
                    @foreach($socials as $social)
                        <a href="{{ $social['href'] }}" class="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors" aria-label="{{ $social['name'] }}">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">{!! $social['icon'] !!}</svg>
                        </a>
                    @endforeach
                </div>
            </div>

            {{-- Link columns --}}
            @php
                $columns = [
                    ['title' => 'Product', 'links' => ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status']],
                    ['title' => 'Developers', 'links' => ['Documentation', 'API Reference', 'GitHub', 'Examples', 'Packages']],
                    ['title' => 'Company', 'links' => ['About', 'Blog', 'Careers', 'Press', 'Contact']],
                    ['title' => 'Legal', 'links' => ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'GDPR']],
                ];
            @endphp
            @foreach($columns as $column)
                <div class="space-y-4">
                    <h4 class="text-xs font-semibold text-white uppercase tracking-widest">{{ $column['title'] }}</h4>
                    <ul class="space-y-3">
                        @foreach($column['links'] as $link)
                            <li>
                                <a href="#" class="text-sm hover:text-white transition-colors">{{ $link }}</a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>

        {{-- Bottom bar --}}
        <div class="border-t border-white/10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm">
                © {{ date('Y') }} {{ config('app.name') }}, Inc. All rights reserved.
            </p>
            <div class="flex items-center gap-4">
                <span class="text-sm flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    All systems operational
                </span>
                <span class="text-slate-600">·</span>
                <span class="text-sm">Built with ❤️ using Laravel & Tailwind CSS</span>
            </div>
        </div>
    </div>
</footer>
