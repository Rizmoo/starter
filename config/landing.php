<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Landing Page Customizer
    |--------------------------------------------------------------------------
    |
    | When true, a slide-over settings panel is shown so you can preview
    | section variants and brand colors. Enabled automatically in local.
    |
    */

    'customizer' => env('APP_ENV') === 'local',

    /*
    |--------------------------------------------------------------------------
    | Brand Color
    |--------------------------------------------------------------------------
    |
    | Maps to data-color-theme on <html>. Options: default (green), green,
    | red, orange, blue, purple, indigo.
    |
    */

    'color' => 'purple',

    /*
    |--------------------------------------------------------------------------
    | Active Section Variants
    |--------------------------------------------------------------------------
    |
    | Choose which Blade variant to show for each section.
    | hero: v1–v4 | nav: v1–v3 | features: v1–v3 | social: v1–v3
    | pricing: v1–v3 | cta: v1–v3 | footer: v1–v2
    |
    */

    'sections' => [
        'nav' => 'v1',
        'hero' => 'v1',
        'features' => 'v1',
        'social' => 'v1',
        'pricing' => 'v1',
        'cta' => 'v2',
        'footer' => 'v2',
    ],

    /*
    |--------------------------------------------------------------------------
    | Optional Sections
    |--------------------------------------------------------------------------
    |
    | Toggle whether optional blocks appear on the page.
    |
    */

    'enabled' => [
        'social' => true,
        'pricing' => true,
        'cta' => true,
    ],

];
