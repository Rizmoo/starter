<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Roles and Permissions Configuration
    |--------------------------------------------------------------------------
    |
    | This file defines all available roles and their associated permissions.
    | This is a file-based permission system for better performance without
    | database queries.
    |
    */

    'roles' => [
        'Admin' => [
            'label' => 'Administrator',
            'description' => 'Full access to all features',
            'permissions' => ['*'],
        ],

        'Manager' => [
            'label' => 'Manager',
            'description' => 'Can manage users and view reports',
            'permissions' => [
                // User Management
                'view users',
                'create users',
                'edit users',

                // Audit Logs
                'view audit logs',

                // Notifications
                'view notifications',
                'delete notifications',
            ],
        ],

        'Staff' => [
            'label' => 'Staff',
            'description' => 'Standard staff access',
            'permissions' => [
                'view users',
                'view notifications',
            ],
        ],

        'Viewer' => [
            'label' => 'Viewer',
            'description' => 'Read-only access',
            'permissions' => [
                'view users',
                'view notifications',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Role
    |--------------------------------------------------------------------------
    |
    | This role will be assigned to users when they register (if they are
    | the first user in the application, they get Admin role instead).
    |
    */

    'default_role' => 'Viewer',

    /*
    |--------------------------------------------------------------------------
    | Protected Roles
    |--------------------------------------------------------------------------
    |
    | These roles cannot be deleted or modified through the application.
    |
    */

    'protected_roles' => ['Admin'],
];
