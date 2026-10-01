<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Permission Catalog
    |--------------------------------------------------------------------------
    |
    | Every module and model registers its permissions here. Keys are stable
    | identifiers stored on roles as JSON. Labels are shown in the UI.
    |
    | Wildcard "*" grants full system access. A "*.manage" key grants every
    | permission under that prefix (for example "users.manage" covers
    | "users.view", "users.create", and "users.update").
    |
    */

    '*' => 'Full system access',

    'users.view' => 'View users',
    'users.create' => 'Create users',
    'users.update' => 'Update users',
    'users.delete' => 'Delete users',
    'users.manage' => 'Manage users (full access)',

    'roles.view' => 'View roles',
    'roles.create' => 'Create roles',
    'roles.update' => 'Update roles',
    'roles.delete' => 'Delete roles',
    'roles.manage' => 'Manage roles (full access)',

    'audit_logs.view' => 'View audit logs',

    'notifications.view' => 'View notifications',
    'notifications.delete' => 'Delete notifications',
];
