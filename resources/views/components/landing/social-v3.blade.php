{{-- Social V3: Aggregate rating + compact logo strip --}}
<section id="social" class="py-16 sm:py-20 bg-white border-y border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div class="text-center lg:text-left">
                <div class="flex items-center justify-center lg:justify-start gap-1 mb-3 text-amber-400">
                    @for ($i = 0; $i < 5; $i++)
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    @endfor
                </div>
                <p class="text-2xl font-bold text-slate-900 mb-1">
                    4.9/5 average rating
                </p>
                <p class="text-slate-500 text-sm">
                    Based on 2,000+ developer reviews across G2, Capterra, and Product Hunt.
                </p>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-8 opacity-60">
                @foreach (['Acme', 'Globex', 'Initech', 'Umbrella', 'Stark', 'Wayne'] as $brand)
                    <span class="text-slate-800 font-extrabold tracking-tight text-lg">{{ $brand }}</span>
                @endforeach
            </div>
        </div>
    </div>
</section>
