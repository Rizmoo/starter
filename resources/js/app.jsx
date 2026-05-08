import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/Components/theme-provider';
import { ColorThemeProvider } from '@/Components/color-theme-provider';
import { AppProvider } from '@/Components/app-provider';
import { Toaster } from '@/Components/ui/toaster';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <ColorThemeProvider>
                    <AppProvider initialAuth={props.initialPage.props.auth}>
                        <App {...props} />
                        <Toaster />
                    </AppProvider>
                </ColorThemeProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

