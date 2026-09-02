/**
 * Landing page customizer: theme colors, section variants, hero slider, mobile nav.
 * Defaults come from #landing-root data attributes; overrides persist in localStorage.
 */

const STORAGE_KEY = 'landing-config';

function parseJsonAttr(el, name, fallback) {
    try {
        const raw = el?.getAttribute(name);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function getDefaults(root) {
    return {
        color: root?.dataset.landingColor || 'purple',
        sections: parseJsonAttr(root, 'data-landing-sections', {
            nav: 'v1',
            hero: 'v1',
            features: 'v1',
            social: 'v1',
            pricing: 'v1',
            cta: 'v2',
            footer: 'v2',
        }),
        enabled: parseJsonAttr(root, 'data-landing-enabled', {
            social: true,
            pricing: true,
            cta: true,
        }),
    };
}

function loadConfig(defaults) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return structuredClone(defaults);
        }
        const parsed = JSON.parse(stored);
        return {
            color: parsed.color || defaults.color,
            sections: { ...defaults.sections, ...(parsed.sections || {}) },
            enabled: { ...defaults.enabled, ...(parsed.enabled || {}) },
        };
    } catch {
        return structuredClone(defaults);
    }
}

function saveConfig(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function applyColor(color) {
    const value = color === 'default' ? 'green' : color;
    document.documentElement.setAttribute('data-color-theme', value);
}

function applySections(config) {
    const sectionKeys = Object.keys(config.sections);

    sectionKeys.forEach((key) => {
        const active = config.sections[key];
        const nodes = document.querySelectorAll(`[data-landing-section="${key}"]`);
        const isOptional = Object.prototype.hasOwnProperty.call(config.enabled, key);
        const isEnabled = !isOptional || config.enabled[key] !== false;

        nodes.forEach((node) => {
            const variant = node.getAttribute('data-landing-variant');
            const show = isEnabled && variant === active;
            node.hidden = !show;
            node.classList.toggle('hidden', !show);
        });
    });
}

function syncPanel(config) {
    document.querySelectorAll('[data-landing-color]').forEach((btn) => {
        const active = btn.getAttribute('data-landing-color') === config.color
            || (config.color === 'default' && btn.getAttribute('data-landing-color') === 'green');
        btn.classList.toggle('ring-2', active);
        btn.classList.toggle('ring-slate-900', active);
        btn.classList.toggle('scale-110', active);
    });

    document.querySelectorAll('[data-landing-variant-pick]').forEach((btn) => {
        const key = btn.getAttribute('data-landing-variant-pick');
        const value = btn.getAttribute('data-landing-variant-value');
        const active = config.sections[key] === value;
        btn.classList.toggle('border-primary', active);
        btn.classList.toggle('bg-primary/10', active);
        btn.classList.toggle('ring-1', active);
        btn.classList.toggle('ring-primary/40', active);
    });

    document.querySelectorAll('[data-landing-enabled]').forEach((input) => {
        const key = input.getAttribute('data-landing-enabled');
        input.checked = config.enabled[key] !== false;
    });
}

function applyConfig(config) {
    applyColor(config.color);
    applySections(config);
    syncPanel(config);
    initHeroSliders();
}

function openSettings() {
    const root = document.querySelector('[data-landing-settings]');
    const panel = document.querySelector('[data-landing-settings-panel]');
    const backdrop = document.querySelector('[data-landing-settings-backdrop]');
    if (!root || !panel || !backdrop) {
        return;
    }
    root.classList.remove('pointer-events-none');
    backdrop.classList.remove('pointer-events-none', 'opacity-0');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    panel.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
}

function closeSettings() {
    const root = document.querySelector('[data-landing-settings]');
    const panel = document.querySelector('[data-landing-settings-panel]');
    const backdrop = document.querySelector('[data-landing-settings-backdrop]');
    if (!root || !panel || !backdrop) {
        return;
    }
    panel.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    root.classList.add('pointer-events-none');
    document.body.classList.remove('overflow-hidden');
}

function wireSettings(config, defaults) {
    document.querySelectorAll('[data-landing-settings-open]').forEach((btn) => {
        btn.addEventListener('click', openSettings);
    });
    document.querySelectorAll('[data-landing-settings-close]').forEach((btn) => {
        btn.addEventListener('click', closeSettings);
    });
    document.querySelector('[data-landing-settings-backdrop]')?.addEventListener('click', closeSettings);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSettings();
        }
    });

    document.querySelectorAll('[data-landing-color]').forEach((btn) => {
        btn.addEventListener('click', () => {
            config.color = btn.getAttribute('data-landing-color');
            saveConfig(config);
            applyConfig(config);
        });
    });

    document.querySelectorAll('[data-landing-variant-pick]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-landing-variant-pick');
            const value = btn.getAttribute('data-landing-variant-value');
            config.sections[key] = value;
            saveConfig(config);
            applyConfig(config);
        });
    });

    document.querySelectorAll('[data-landing-enabled]').forEach((input) => {
        input.addEventListener('change', () => {
            const key = input.getAttribute('data-landing-enabled');
            config.enabled[key] = input.checked;
            saveConfig(config);
            applyConfig(config);
        });
    });

    document.querySelector('[data-landing-reset]')?.addEventListener('click', () => {
        Object.assign(config, structuredClone(defaults));
        saveConfig(config);
        applyConfig(config);
    });
}

function wireMobileNav() {
    document.querySelectorAll('[data-landing-nav]').forEach((nav) => {
        const toggle = nav.querySelector('[data-landing-nav-toggle]');
        const menu = nav.querySelector('[data-landing-nav-menu]');
        const openIcon = nav.querySelector('[data-landing-nav-icon="open"]');
        const closeIcon = nav.querySelector('[data-landing-nav-icon="close"]');
        if (!toggle || !menu) {
            return;
        }

        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('hidden') === false;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            openIcon?.classList.toggle('hidden', open);
            closeIcon?.classList.toggle('hidden', !open);
        });
    });
}

function initHeroSliders() {
    document.querySelectorAll('[data-hero-slider]').forEach((slider) => {
        if (slider.dataset.sliderReady === '1' && slider.offsetParent === null) {
            return;
        }

        const slides = [...slider.querySelectorAll('[data-hero-slide]')];
        if (slides.length === 0) {
            return;
        }

        // Re-init safely if slider becomes visible
        if (slider._heroCleanup) {
            slider._heroCleanup();
        }

        let index = 0;
        let timer = null;
        const dots = [...slider.querySelectorAll('[data-hero-dot]')];

        const show = (next) => {
            index = (next + slides.length) % slides.length;
            slides.forEach((slide, i) => {
                const active = i === index;
                slide.classList.toggle('opacity-100', active);
                slide.classList.toggle('z-10', active);
                slide.classList.toggle('opacity-0', !active);
                slide.classList.toggle('z-0', !active);
                slide.classList.toggle('pointer-events-none', !active);
                slide.setAttribute('aria-hidden', active ? 'false' : 'true');
            });
            dots.forEach((dot, i) => {
                const active = i === index;
                dot.classList.toggle('w-8', active);
                dot.classList.toggle('bg-primary', active);
                dot.classList.toggle('w-2.5', !active);
                dot.classList.toggle('bg-white/40', !active);
            });
        };

        const stop = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };

        const start = () => {
            stop();
            timer = setInterval(() => show(index + 1), 6000);
        };

        const onPrev = () => {
            show(index - 1);
            start();
        };
        const onNext = () => {
            show(index + 1);
            start();
        };

        slider.querySelector('[data-hero-prev]')?.addEventListener('click', onPrev);
        slider.querySelector('[data-hero-next]')?.addEventListener('click', onNext);
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                show(Number(dot.getAttribute('data-hero-dot')));
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);

        slider._heroCleanup = () => {
            stop();
            slider.querySelector('[data-hero-prev]')?.removeEventListener('click', onPrev);
            slider.querySelector('[data-hero-next]')?.removeEventListener('click', onNext);
        };

        slider.dataset.sliderReady = '1';
        show(0);
        // Only autoplay when visible
        if (slider.offsetParent !== null || !slider.closest('[hidden]')) {
            start();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('landing-root');
    const defaults = getDefaults(root);
    const config = loadConfig(defaults);

    applyConfig(config);
    wireMobileNav();

    if (document.querySelector('[data-landing-settings]')) {
        wireSettings(config, defaults);
    }
});
