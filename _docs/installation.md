---
layout: docs
title: Installation
permalink: /docs/installation/
---

# Installation

## Requirements

Before installing HelixPHP, make sure your system meets the following requirements:

- **PHP 8.1** or higher
- **Composer** (latest version recommended)
- **ext-json** PHP extension
- **ext-mbstring** PHP extension

## Install via Composer

The recommended way to install HelixPHP is through [Composer](https://getcomposer.org/):

```bash
composer require helixphp/framework
```

## Create a New Project

To create a new HelixPHP project with a basic structure:

```bash
composer create-project helixphp/helixphp my-app
cd my-app
```

This will create a new directory called `my-app` with a basic project structure:

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
├── .env.example
├── .gitignore
├── composer.json
└── README.md
```

## Manual Installation

If you prefer to set up your project manually:

1. Create a new directory for your project
2. Initialize Composer:
   ```bash
   composer init
   ```
3. Require HelixPHP:
   ```bash
   composer require helixphp/framework
   ```
4. Create your entry point:
   ```bash
   mkdir public
   touch public/index.php
   ```

## Verify Installation

To verify that HelixPHP is installed correctly, create a simple `index.php` file:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use Helix\Core\Application;

$app = new Application();

$app->get('/', function($request, $response) {
    return $response->json([
        'message' => 'HelixPHP is running!',
        'version' => Application::VERSION
    ]);
});

$app->run();
```

Then start the built-in PHP server:

```bash
php -S localhost:8000 -t public
```

Visit `http://localhost:8000` in your browser. You should see a JSON response confirming HelixPHP is running.

## Next Steps

Now that you have HelixPHP installed, you're ready to build your first application! Check out our [Quick Start guide]({{ site.baseurl }}/docs/quickstart/) to learn the basics.