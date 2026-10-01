<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Laravel') }}</title>

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
                --muted-foreground: 220 8.9% 46.1%;
                --radius: 0.6rem;
            }
            .dark {
                --background: 222 47% 4%;
                --foreground: 210 20% 98%;
                --muted-foreground: 217.9 10.6% 60%;
            }
            body {
                margin: 0;
                min-height: 100vh;
                font-family: Inter, ui-sans-serif, system-ui, sans-serif;
                background: hsl(var(--background));
                color: hsl(var(--foreground));
            }
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
        <main class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background px-6">
            <div class="absolute inset-0 opacity-[0.04]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>

            <div class="relative z-10 flex flex-col items-center gap-6 text-center">
                <p class="text-sm font-medium tracking-wide text-muted-foreground">{{ config('app.name') }}</p>
                <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">It's a starter app.</h1>

                @auth
                    <a href="{{ route('dashboard') }}" class="inline-flex items-center rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90">
                        Dashboard
                    </a>
                @else
                    @if (Route::has('login'))
                        <a href="{{ route('login') }}" class="inline-flex items-center rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90">
                            Sign in
                        </a>
                    @endif
                @endauth
            </div>
        </main>
    </body>
</html>
