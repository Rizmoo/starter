<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-color-theme="{{ config('landing.color') }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'StarterKit') }} — Laravel Starter Kit</title>
    <meta name="description" content="A production-ready Laravel starter kit with auth, billing, teams, and a beautiful UI. Ship your next product in days, not months.">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800,900" rel="stylesheet"/>

    @vite(['resources/css/app.css', 'resources/js/landing.js'])

    <style>
        body { font-family: 'Inter', system-ui, sans-serif; }
        [hidden] { display: none !important; }
    </style>
</head>
<body class="bg-white antialiased">

@php
    $landingColor = config('landing.color', 'purple');
    $landingSections = config('landing.sections', []);
    $landingEnabled = config('landing.enabled', []);
    $customizer = config('landing.customizer', false);

    $catalog = [
        'nav' => ['v1', 'v2', 'v3'],
        'hero' => ['v1', 'v2', 'v3', 'v4'],
        'features' => ['v1', 'v2', 'v3'],
        'social' => ['v1', 'v2', 'v3'],
        'pricing' => ['v1', 'v2', 'v3'],
        'cta' => ['v1', 'v2', 'v3'],
        'footer' => ['v1', 'v2'],
    ];

    $componentMap = [
        'nav' => 'landing.nav',
        'hero' => 'landing.hero',
        'features' => 'landing.features',
        'social' => 'landing.social',
        'pricing' => 'landing.pricing',
        'cta' => 'landing.cta',
        'footer' => 'landing.footer',
    ];

    $order = ['nav', 'hero', 'features', 'social', 'pricing', 'cta', 'footer'];
@endphp

<div
    id="landing-root"
    data-landing-color="{{ $landingColor }}"
    data-landing-sections='@json($landingSections)'
    data-landing-enabled='@json($landingEnabled)'
>
    {{--
        Section composer: all variants are rendered; landing.js shows one per section.
        Optional sections (social, pricing, cta) respect the enabled flags.
        Customize defaults in config/landing.php. Customizer is local-only.
    --}}

    @foreach ($order as $section)
        @php
            $variants = $catalog[$section];
            $active = $landingSections[$section] ?? $variants[0];
            $isOptional = array_key_exists($section, $landingEnabled);
            $sectionEnabled = ! $isOptional || ($landingEnabled[$section] ?? true);
        @endphp

        @foreach ($variants as $variant)
            @php
                $isActive = $sectionEnabled && $variant === $active;
                $component = $componentMap[$section].'-'.$variant;
            @endphp
            <div
                data-landing-section="{{ $section }}"
                data-landing-variant="{{ $variant }}"
                @if (! $isActive) hidden @endif
            >
                <x-dynamic-component :component="$component" />
            </div>
        @endforeach
    @endforeach
</div>

@if ($customizer)
    <x-landing.settings-panel />
@endif

</body>
</html>
