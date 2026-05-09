<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ModuleInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'module:install {module : The module key to install (e.g. platform)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install an optional SaaS feature module';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $module = Str::lower(trim($this->argument('module')));
        $available = config('modules.available', []);

        if (! array_key_exists($module, $available)) {
            $this->error("Module [{$module}] is not registered. Run `php artisan module:list` to see available modules.");

            return self::FAILURE;
        }

        $current = $this->parseEnabled(config('modules.enabled', ''));

        if (in_array($module, $current, true)) {
            $this->warn("Module [{$module}] is already installed.");

            return self::SUCCESS;
        }

        $this->info("Installing module: <comment>{$available[$module]['name']}</comment>");

        // Enable the module in .env
        $this->enableInEnv($module, $current);
        $this->info('  ✓ Added to ENABLED_MODULES in .env');

        // Run migrations if the module ships any
        if ($available[$module]['has_migrations'] ?? false) {
            $migrationPath = database_path("migrations/modules/{$module}");

            if (is_dir($migrationPath)) {
                $this->call('migrate', ['--path' => "database/migrations/modules/{$module}", '--force' => true]);
                $this->info('  ✓ Module migrations applied');
            }
        }

        $this->call('config:clear');

        $this->newLine();
        $this->info("✅ Module <comment>{$available[$module]['name']}</comment> installed successfully.");
        $this->line('   Restart your dev server for route changes to take effect.');

        return self::SUCCESS;
    }

    /**
     * @param  array<string>  $current
     */
    protected function enableInEnv(string $module, array $current): void
    {
        $current[] = $module;
        $newValue = implode(',', array_unique($current));

        $envPath = base_path('.env');
        $content = file_get_contents($envPath);

        if (str_contains($content, 'ENABLED_MODULES=')) {
            $content = preg_replace('/^ENABLED_MODULES=.*/m', "ENABLED_MODULES={$newValue}", $content);
        } else {
            $content .= "\nENABLED_MODULES={$newValue}\n";
        }

        file_put_contents($envPath, $content);
    }

    /**
     * @return array<string>
     */
    protected function parseEnabled(string $value): array
    {
        if (blank($value)) {
            return [];
        }

        return array_values(array_unique(array_filter(
            array_map('trim', explode(',', $value))
        )));
    }
}
