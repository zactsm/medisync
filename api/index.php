<?php

// Vercel Serverless Entrypoint for Laravel & Inertia.js

// Ensure /tmp directory structure exists for Vercel's read-only filesystem
$tmpStorage = '/tmp/storage';
$neededDirs = [
    $tmpStorage . '/framework/views',
    $tmpStorage . '/framework/cache/data',
    $tmpStorage . '/framework/sessions',
    $tmpStorage . '/logs',
    '/tmp/bootstrap/cache',
];

foreach ($neededDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Forward storage and config paths to writable /tmp
putenv("VIEW_COMPILED_PATH={$tmpStorage}/framework/views");
putenv("APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php");
putenv("APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php");
putenv("APP_CONFIG_CACHE=/tmp/bootstrap/cache/config.php");
putenv("APP_ROUTES_CACHE=/tmp/bootstrap/cache/routes.php");
putenv("APP_EVENTS_CACHE=/tmp/bootstrap/cache/events.php");

require __DIR__ . '/../public/index.php';
