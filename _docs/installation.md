---
layout: docs
title: Installation
permalink: /docs/installation/
---

## Requirements

Before installing PivotPHP, make sure your system meets the following requirements:

- **PHP 8.1** or higher
- **Composer** (latest version recommended)
- **ext-json** PHP extension
- **ext-mbstring** PHP extension

## Install via Composer

The recommended way to install PivotPHP is through [Composer](https://getcomposer.org/):

```bash
composer require pivotphp/core
```

## Create a New Project

To create a new PivotPHP project, you'll need to set it up manually:

> **Note**: A project template is in development and will be available soon via `composer create-project`.

```bash
# Create a new directory for your project
mkdir my-app
cd my-app

# Initialize composer
composer init

# Install PivotPHP
composer require pivotphp/core

# Create the basic structure
mkdir -p public src/{Controllers,Middleware,Providers} config tests
touch public/index.php
```

This will create a basic project structure:

```
my-app/
├── public/
│   └── index.php
├── src/
│   ├── Controllers/
│   ├── Middleware/
│   └── Providers/
├── config/
├── tests/
├── vendor/
├── composer.json
└── composer.lock
```

## Manual Installation

For more control over your project setup:

1. Create a new directory for your project
2. Initialize Composer:
   ```bash
   composer init
   ```
3. Require PivotPHP:
   ```bash
   composer require pivotphp/core
   ```
4. Create your entry point:
   ```bash
   mkdir public
   touch public/index.php
   ```

## Verify Installation

To verify that PivotPHP is installed correctly, create a simple `index.php` file:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;

$app = new Application();

$app->get('/', function($request, $response) {
    return $response->json([
        'message' => 'PivotPHP is running!',
        'version' => Application::VERSION
    ]);
});

$app->run();
```

Then start the built-in PHP server:

```bash
php -S localhost:8000 -t public
```

Visit `http://localhost:8000` in your browser. You should see a JSON response confirming PivotPHP is running.

## Next Steps

Now that you have PivotPHP installed, you're ready to build your first application! Check out our [Quick Start guide]({{ site.baseurl }}/docs/quickstart/) to learn the basics.
