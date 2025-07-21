---
layout: docs
title: Installation
permalink: /docs/installation/
---

## Requirements

Before installing PivotPHP v1.1.4, make sure your system meets the following requirements:

- **PHP 8.1** or higher (8.4+ recommended for array callable syntax)
- **Composer** (latest version recommended)
- **ext-json** PHP extension
- **ext-mbstring** PHP extension
- **Optional**: Docker for containerized deployment

## Performance Highlights

- **🚀 Peak Performance**: 84,998 ops/sec (application creation)
- **⚡ ReactPHP Extension**: 19,707 req/sec (continuous runtime)
- **🎯 Core Performance**: 6,227 req/sec (Docker validated)
- **💫 Memory Efficiency**: Ultra-efficient 1.61MB footprint
- **🏆 Market Position**: #1 with ReactPHP extension

## Install via Composer

The recommended way to install PivotPHP v1.1.4 is through [Composer](https://getcomposer.org/):

```bash
# Core framework (6,227 req/sec)
composer require pivotphp/core

# Optional: ReactPHP extension (19,707 req/sec)
composer require pivotphp/reactphp

# Optional: Cycle ORM extension (457,870 ops/sec)
composer require pivotphp/cycle-orm
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
        'message' => 'PivotPHP v1.1.4 is running!',
        'version' => Application::VERSION,
        'edition' => 'Architectural Excellence & Performance Optimization',
        'performance' => [
            'peak_ops_sec' => 84998,
            'core_req_sec' => 6227,
            'reactphp_req_sec' => 19707
        ],
        'features' => [
            'array_callable' => 'PHP 8.4+ compatible',
            'object_pooling' => '100% Request reuse',
            'json_optimization' => 'Automatic buffer pooling',
            'psr_compliance' => 'PSR-7, PSR-15, PSR-12'
        ]
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

Now that you have PivotPHP v1.1.4 installed, you're ready to build high-performance applications!

### Getting Started
- **[Quick Start Guide]({{ site.baseurl }}/docs/quickstart/)** - Build your first REST API
- **[Routing]({{ site.baseurl }}/docs/routing/)** - Advanced routing with array callable support
- **[Middleware]({{ site.baseurl }}/docs/middleware/)** - PSR-15 compliant request processing

### High-Performance Extensions
- **[ReactPHP Extension]({{ site.baseurl }}/docs/extensions/reactphp/)** - Achieve 19,707 req/sec
- **[Cycle ORM Extension]({{ site.baseurl }}/docs/extensions/cycle-orm/)** - Zero-config database
- **[Performance Benchmarks]({{ site.baseurl }}/docs/benchmarks/)** - Detailed performance analysis

### Production Deployment
- **[Docker Deployment]({{ site.baseurl }}/docs/deployment/)** - Containerized production setup
- **[Configuration]({{ site.baseurl }}/docs/configuration/)** - Environment-specific settings
- **[Monitoring]({{ site.baseurl }}/docs/monitoring/)** - Performance tracking and optimization
