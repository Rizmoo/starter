<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Enabled Modules
    |--------------------------------------------------------------------------
    |
    | Comma-separated list of module identifiers that are currently active.
    | Managed automatically by `php artisan module:install {name}`.
    |
    | Example: 'platform,billing'
    |
    */
    'enabled' => env('ENABLED_MODULES', ''),

    /*
    |--------------------------------------------------------------------------
    | Available Modules
    |--------------------------------------------------------------------------
    |
    | The registry of all optional SaaS feature modules available in this
    | starter pack. Each module is self-contained and only loaded when enabled.
    |
    */
    'available' => [

        'platform' => [
            'name' => 'Platform Admin',
            'description' => 'Super-admin panel to manage tenants, companies, and platform-wide settings.',
            'version' => '1.0.0',
            'has_migrations' => true,
            'nav' => [],
        ],

        'billing' => [
            'name' => 'Subscription Billing',
            'description' => 'Stripe-powered plan management and per-tenant subscription billing.',
            'version' => '1.0.0',
            'has_migrations' => true,
            'nav' => [
                [
                    'id' => 'billing',
                    'label' => 'Billing',
                    'icon' => 'CreditCard',
                    'groups' => [
                        [
                            'label' => 'Subscriptions',
                            'links' => [
                                ['href' => '/platform/plans', 'label' => 'Plans', 'icon' => 'LayoutList'],
                                ['href' => '/platform/subscriptions', 'label' => 'Subscriptions', 'icon' => 'CreditCard'],
                            ],
                        ],
                    ],
                ],
            ],
        ],

    ],

];
