<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Manages the opt-in SaaS feature module system.
 *
 * Modules are registered in config/modules.php and activated by adding their
 * key to the ENABLED_MODULES environment variable (comma-separated).
 */
class ModuleManager
{
    /**
     * @var array<string, mixed>
     */
    protected array $available;

    /**
     * @var array<string>
     */
    protected array $enabled;

    public function __construct()
    {
        $this->available = config('modules.available', []);
        $this->enabled = $this->parseEnabled(config('modules.enabled', ''));
    }

    /**
     * Check if a given module is currently enabled.
     */
    public function isEnabled(string $module): bool
    {
        return in_array($module, $this->enabled, true);
    }

    /**
     * Return the list of all enabled module keys.
     *
     * @return array<string>
     */
    public function enabled(): array
    {
        return $this->enabled;
    }

    /**
     * Return all available module definitions.
     *
     * @return array<string, mixed>
     */
    public function available(): array
    {
        return $this->available;
    }

    /**
     * Check if a module key exists in the registry.
     */
    public function exists(string $module): bool
    {
        return array_key_exists($module, $this->available);
    }

    /**
     * Retrieve the nav items for all currently enabled modules, to be shared
     * as an Inertia prop so the sidebar can dynamically render module links.
     *
     * @return array<array<string, mixed>>
     */
    public function enabledNavItems(): array
    {
        $navItems = [];

        foreach ($this->enabled as $key) {
            $nav = Arr::get($this->available, "{$key}.nav", []);
            foreach ($nav as $item) {
                $navItems[] = $item;
            }
        }

        return $navItems;
    }

    /**
     * Parse a comma-separated ENABLED_MODULES string into a clean array.
     *
     * @return array<string>
     */
    protected function parseEnabled(string $value): array
    {
        if (blank($value)) {
            return [];
        }

        return collect(explode(',', $value))
            ->map(fn (string $m) => Str::lower(trim($m)))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
