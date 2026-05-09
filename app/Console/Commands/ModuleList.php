<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ModuleList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'module:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all available optional SaaS modules and their install status';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $available = config('modules.available', []);
        $enabledRaw = config('modules.enabled', '');
        $enabled = array_values(array_unique(array_filter(
            array_map('trim', explode(',', $enabledRaw))
        )));

        $this->newLine();
        $this->line('  <fg=white;options=bold>Optional SaaS Modules</>');
        $this->newLine();

        $rows = [];

        foreach ($available as $key => $module) {
            $isEnabled = in_array($key, $enabled, true);
            $status = $isEnabled
                ? '<fg=green>● installed</>'
                : '<fg=yellow>○ not installed</>';

            $rows[] = [
                $key,
                $module['name'],
                $module['version'] ?? '—',
                $status,
                $module['description'],
            ];
        }

        $this->table(
            ['Key', 'Name', 'Version', 'Status', 'Description'],
            $rows
        );

        $this->newLine();

        if (empty($enabled)) {
            $this->line('  No modules installed. Run <comment>php artisan module:install {key}</comment> to install one.');
        } else {
            $this->line('  Installed: <comment>'.implode(', ', $enabled).'</comment>');
        }

        $this->newLine();

        return self::SUCCESS;
    }
}
