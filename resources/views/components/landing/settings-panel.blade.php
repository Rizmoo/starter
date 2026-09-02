{{-- Landing customizer: local-only slide-over settings panel --}}
@php
    $colors = [
        ['name' => 'Green', 'value' => 'green', 'swatch' => '#22c55e'],
        ['name' => 'Red', 'value' => 'red', 'swatch' => '#ef4444'],
        ['name' => 'Orange', 'value' => 'orange', 'swatch' => '#f97316'],
        ['name' => 'Blue', 'value' => 'blue', 'swatch' => '#3b82f6'],
        ['name' => 'Purple', 'value' => 'purple', 'swatch' => '#a855f7'],
    ];

    $layouts = [
        'nav' => [
            'label' => 'Navigation',
            'options' => [
                ['value' => 'v1', 'label' => 'Sticky glass'],
                ['value' => 'v2', 'label' => 'Centered'],
                ['value' => 'v3', 'label' => 'Dark transparent'],
            ],
        ],
        'hero' => [
            'label' => 'Hero',
            'options' => [
                ['value' => 'v1', 'label' => 'Centered'],
                ['value' => 'v2', 'label' => 'Split + mockup'],
                ['value' => 'v3', 'label' => 'Dark full-screen'],
                ['value' => 'v4', 'label' => 'Slider'],
            ],
        ],
        'features' => [
            'label' => 'Features',
            'options' => [
                ['value' => 'v1', 'label' => 'Icon grid'],
                ['value' => 'v2', 'label' => 'How it works'],
                ['value' => 'v3', 'label' => 'Feature list'],
            ],
        ],
        'social' => [
            'label' => 'Social proof',
            'toggleable' => true,
            'options' => [
                ['value' => 'v1', 'label' => 'Logos + stats'],
                ['value' => 'v2', 'label' => 'Testimonials'],
                ['value' => 'v3', 'label' => 'Rating strip'],
            ],
        ],
        'pricing' => [
            'label' => 'Pricing',
            'toggleable' => true,
            'options' => [
                ['value' => 'v1', 'label' => 'Two tiers'],
                ['value' => 'v2', 'label' => 'Three dark'],
                ['value' => 'v3', 'label' => 'Comparison'],
            ],
        ],
        'cta' => [
            'label' => 'CTA',
            'toggleable' => true,
            'options' => [
                ['value' => 'v1', 'label' => 'Simple'],
                ['value' => 'v2', 'label' => 'Email capture'],
                ['value' => 'v3', 'label' => 'Split benefits'],
            ],
        ],
        'footer' => [
            'label' => 'Footer',
            'options' => [
                ['value' => 'v1', 'label' => 'Minimal'],
                ['value' => 'v2', 'label' => 'Multi-column'],
            ],
        ],
    ];
@endphp

<div id="landing-settings" class="fixed inset-0 z-[100] pointer-events-none" data-landing-settings>
    {{-- Backdrop --}}
    <div
        data-landing-settings-backdrop
        class="absolute inset-0 bg-slate-950/40 opacity-0 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
    ></div>

    {{-- Panel --}}
    <aside
        data-landing-settings-panel
        class="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 translate-x-full transition-transform duration-300 ease-out flex flex-col pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-settings-title"
    >
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div>
                <h2 id="landing-settings-title" class="text-base font-bold text-slate-900">Page settings</h2>
                <p class="text-xs text-slate-500 mt-0.5">Local preview only · saved in this browser</p>
            </div>
            <button type="button" data-landing-settings-close class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Close settings">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-5 space-y-8">
            {{-- Brand color --}}
            <section>
                <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Brand color</h3>
                <div class="flex flex-wrap gap-3" data-landing-color-group>
                    @foreach ($colors as $color)
                        <button
                            type="button"
                            data-landing-color="{{ $color['value'] }}"
                            title="{{ $color['name'] }}"
                            class="h-9 w-9 rounded-full ring-offset-2 ring-offset-white transition-all hover:scale-110"
                            style="background-color: {{ $color['swatch'] }}"
                            aria-label="{{ $color['name'] }} theme"
                        ></button>
                    @endforeach
                </div>
            </section>

            {{-- Layout pickers --}}
            @foreach ($layouts as $key => $group)
                <section data-landing-layout-group="{{ $key }}">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-400">{{ $group['label'] }}</h3>
                        @if (! empty($group['toggleable']))
                            <label class="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                <span>Show</span>
                                <input type="checkbox" data-landing-enabled="{{ $key }}" class="sr-only peer" checked>
                                <span class="relative w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4"></span>
                            </label>
                        @endif
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        @foreach ($group['options'] as $option)
                            <button
                                type="button"
                                data-landing-variant-pick="{{ $key }}"
                                data-landing-variant-value="{{ $option['value'] }}"
                                class="text-left px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                            >
                                <span class="block font-semibold text-slate-900">{{ strtoupper($option['value']) }}</span>
                                <span class="block text-xs text-slate-500 mt-0.5">{{ $option['label'] }}</span>
                            </button>
                        @endforeach
                    </div>
                </section>
            @endforeach
        </div>

        <div class="shrink-0 border-t border-slate-100 px-5 py-4">
            <button type="button" data-landing-reset class="w-full text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition-colors">
                Reset to defaults
            </button>
        </div>
    </aside>
</div>

{{-- Floating trigger --}}
<button
    type="button"
    data-landing-settings-open
    class="fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/30 flex items-center justify-center hover:bg-slate-800 transition-colors"
    aria-label="Open page settings"
>
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
</button>
