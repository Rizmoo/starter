{{-- Social V2: Three testimonial cards --}}
<section id="social" class="py-20 sm:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-14">
            <span class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ✦ Social proof
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Loved by builders everywhere
            </h2>
            <p class="text-lg text-slate-500">
                Real teams shipping real products — here's what they say.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @php
                $testimonials = [
                    [
                        'quote' => 'We launched our MVP in a weekend. Auth, roles, and billing were already done — we focused on the product.',
                        'name' => 'Alex Rivera',
                        'role' => 'Founder, Northwind Labs',
                        'initials' => 'AR',
                    ],
                    [
                        'quote' => 'The section variants alone saved us a design sprint. Swap a hero, pick a brand color, ship.',
                        'name' => 'Jordan Lee',
                        'role' => 'Product Lead, Cascade',
                        'initials' => 'JL',
                    ],
                    [
                        'quote' => 'Clean Laravel conventions, solid tests, and a UI our customers actually notice. Highly recommend.',
                        'name' => 'Sam Okonkwo',
                        'role' => 'CTO, BrightPath',
                        'initials' => 'SO',
                    ],
                ];
            @endphp

            @foreach ($testimonials as $item)
                <article class="bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col">
                    <div class="flex gap-1 mb-4 text-amber-400">
                        @for ($i = 0; $i < 5; $i++)
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        @endfor
                    </div>
                    <p class="text-slate-700 leading-relaxed flex-1 mb-6">“{{ $item['quote'] }}”</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                            {{ $item['initials'] }}
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">{{ $item['name'] }}</div>
                            <div class="text-xs text-slate-500">{{ $item['role'] }}</div>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
