@props([
    'code',
    'title',
    'heading',
    'message',
    'actionLabel' => 'Go home',
    'actionUrl' => null,
    'secondaryLabel' => null,
    'secondaryUrl' => null,
    'reload' => false,
])

@php
    $actionUrl ??= url('/');
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $title }} — {{ config('app.name') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />

        @php
            try {
                echo app(\Illuminate\Foundation\Vite::class)(['resources/css/app.css']);
            } catch (Throwable) {
                // Asset pipeline unavailable; fallback styles still apply.
            }
        @endphp

        <style>
            :root {
                --background: 0 0% 100%;
                --foreground: 224 71.4% 4.1%;
                --primary: 142.1 76.2% 36.3%;
                --primary-foreground: 355.7 100% 97.3%;
                --muted: 220 14.3% 95.9%;
                --muted-foreground: 220 8.9% 46.1%;
                --border: 220 13% 91%;
                --radius: 0.6rem;
            }
            .dark {
                --background: 222 47% 4%;
                --foreground: 210 20% 98%;
                --muted: 215 27.9% 12%;
                --muted-foreground: 217.9 10.6% 60%;
                --border: 217 33% 15%;
            }
            body {
                margin: 0;
                min-height: 100vh;
                font-family: Inter, ui-sans-serif, system-ui, sans-serif;
                background: hsl(var(--background));
                color: hsl(var(--foreground));
            }
            .error-shell {
                position: relative;
                display: flex;
                min-height: 100vh;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                padding: 2.5rem 1.5rem;
                background: linear-gradient(to bottom right, hsl(var(--primary) / 0.1), hsl(var(--background)), hsl(var(--background)));
            }
            .error-content {
                position: relative;
                z-index: 1;
                display: flex;
                width: 100%;
                max-width: 28rem;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .error-code {
                margin: 0;
                font-size: 3.5rem;
                font-weight: 700;
                letter-spacing: -0.04em;
                line-height: 1;
                color: hsl(var(--foreground));
            }
            .error-heading {
                margin: 1rem 0 0;
                font-size: 1.5rem;
                font-weight: 600;
                letter-spacing: -0.02em;
            }
            .error-message {
                margin: 0.75rem 0 0;
                max-width: 24rem;
                font-size: 1rem;
                line-height: 1.6;
                color: hsl(var(--muted-foreground));
            }
            .error-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                margin-top: 1.75rem;
            }
            .error-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius);
                background: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                font-size: 0.875rem;
                font-weight: 600;
                text-decoration: none;
                padding: 0.65rem 1.25rem;
                box-shadow: 0 10px 20px hsl(var(--primary) / 0.2);
            }
            .error-btn-secondary {
                background: transparent;
                color: hsl(var(--foreground));
                box-shadow: none;
                border: 1px solid hsl(var(--border));
            }
            .error-illustration {
                width: 100%;
                max-width: 22rem;
                margin: 0 0 0.5rem;
            }
            .error-illustration svg {
                width: 100%;
                height: auto;
                animation: error-float 5s ease-in-out infinite;
            }
            @keyframes error-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            .error-illu-glow { fill: hsl(var(--primary) / 0.14); }
            .error-illu-shadow { fill: hsl(var(--foreground) / 0.08); }
            .error-illu-skin { fill: #f0c090; }
            .error-illu-hair { fill: #1e293b; }
            .error-illu-shirt { fill: hsl(var(--primary)); }
            .error-illu-pants { fill: #334155; }
            .error-illu-water { fill: #7dd3fc; }
            .error-illu-deep { fill: #38bdf8; }
            .error-illu-wood { fill: #b45309; }
            .error-illu-sand { fill: #fde68a; }
            .error-illu-stone { fill: #94a3b8; }
            .error-illu-metal { fill: #64748b; }
            .error-illu-muted { fill: hsl(var(--muted)); }
            .error-illu-ink { fill: hsl(var(--foreground)); }
            .error-illu-soft { fill: hsl(var(--muted-foreground) / 0.35); }
            .dark .error-illu-water { fill: #0e7490; }
            .dark .error-illu-deep { fill: #155e75; }
            .dark .error-illu-sand { fill: #a16207; }
            .dark .error-illu-stone { fill: #475569; }
            .dark .error-illu-hair { fill: #e2e8f0; }
            .dark .error-illu-pants { fill: #94a3b8; }
        </style>

        <script>
            (function () {
                try {
                    var theme = localStorage.getItem('theme');
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (theme === 'dark' || ((theme === 'system' || !theme) && prefersDark)) {
                        document.documentElement.classList.add('dark');
                    }
                    var color = localStorage.getItem('color-theme');
                    if (color && color !== 'default') {
                        document.documentElement.setAttribute('data-color-theme', color);
                    }
                } catch (e) {}
            })();
        </script>
    </head>
    <body class="min-h-screen bg-background text-foreground antialiased">
        <main class="error-shell min-h-screen bg-gradient-to-br from-primary/10 via-background to-background" role="main">
            <div class="pointer-events-none absolute inset-0 opacity-[0.04]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>

            <div class="error-content">
                <x-errors.illustration :code="$code" />

                <p class="error-code text-5xl font-bold tracking-tight text-foreground">{{ $code }}</p>
                <h1 class="error-heading text-2xl font-semibold tracking-tight text-foreground">{{ $heading }}</h1>
                <p class="error-message text-muted-foreground">{{ $message }}</p>

                <div class="error-actions">
                    @if ($reload)
                        <button type="button" class="error-btn bg-primary text-primary-foreground" onclick="window.location.reload()">
                            {{ $actionLabel }}
                        </button>
                    @else
                        <a href="{{ $actionUrl }}" class="error-btn bg-primary text-primary-foreground">{{ $actionLabel }}</a>
                    @endif

                    @if ($secondaryLabel)
                        <a href="{{ $secondaryUrl ?? url('/') }}" class="error-btn error-btn-secondary">{{ $secondaryLabel }}</a>
                    @endif
                </div>
            </div>
        </main>
    </body>
</html>
