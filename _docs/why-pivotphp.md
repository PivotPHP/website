---
layout: docs
title: Why PivotPHP?
permalink: /docs/why-pivotphp/
---

**The Evolutionary PHP Microframework**
*Fast, unopinionated, minimalist web framework for PHP. Built for performance, designed to evolve.*

[![Latest Version](https://img.shields.io/packagist/v/pivotphp/core.svg)](https://packagist.org/packages/pivotphp/core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/pivotphp/pivotphp-core/tests.yml?branch=main)](https://github.com/pivotphp/pivotphp-core/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP Version](https://img.shields.io/badge/php-8.1%2B-777bb4.svg)](https://php.net)
[![Performance](https://img.shields.io/badge/performance-2.57M%2B%20ops%2Fsec-brightgreen.svg)](#performance)

---

After 6 years building high-performance APIs, I kept hitting the same wall with PHP frameworks—they all felt heavy, opinionated, and restrictive. Coming from Node.js, I missed the elegance of Express.js: simple, flexible, and powerful. One afternoon, frustrated by another rigid framework forcing me into its way of thinking, I started building what became PivotPHP.

**What began as ExpressPHP became something bigger.** As the project evolved, I realized this wasn't just about copying Express.js—it was about creating a framework that truly adapts to your needs. Like DNA that shapes itself to different environments, PivotPHP molds to your project without losing its core identity. No forced patterns, no bloated features, just clean PHP that stays out of your way.

PivotPHP doesn't tell you how to build your API. Instead, it gives you the tools to build it **your way**.

```php
<?php
require 'vendor/autoload.php';

use PivotPHP\Core\Core\Application;

$app = new Application();

// Simple route
$app->get('/hello/:name', function($req, $res) {
    $res->json(['message' => "Hello, " . $req->param('name') . "!"]);
});

// Middleware that just works
$app->use('/api/*', function($req, $res, $next) {
    $res->header('Content-Type', 'application/json');
    $next();
});

// RESTful resource
$app->get('/users/:id', function($req, $res) {
    $user = User::find($req->param('id'));
    $res->json($user);
});

$app->run();
```

**2 minutes. That's all you need to build your first API for concept validation and local development.**

---

## Installation

```bash
composer require pivotphp/pivotphp-core
```

**Requirements:**
- PHP 8.1 or higher
- Composer

**Optional Extensions:**
```bash
# For database integration
composer require pivotphp/pivotphp-cycle-orm

# For additional middleware
composer require pivotphp/middleware-collection
```

---

## Key Features

### **Evolutionary Architecture**
PivotPHP adapts to your needs, not the other way around. Start simple, scale complex.

```php
// Start simple
$app->get('/', fn() => 'Hello World');

// Evolve naturally
$app->group('/api/v1', function($group) {
    $group->middleware([AuthMiddleware::class, RateLimitMiddleware::class]);
    $group->resource('/users', UserController::class);
});
```

### **Blazing Performance**
**13,374 requests/second with 0.07ms latency.** Built for speed from the ground up.

```php
// Optimized routing with zero-config caching
$app->get('/fast/:id/data/:type', function($req, $res) {
    // Auto-cached route matching
    // Type-safe parameter extraction
    // Memory-efficient response handling
    $res->json($data);
});
```

### **Express.js-Inspired Syntax**
If you know Express.js, you already know PivotPHP.

```php
// Familiar middleware pattern
$app->use(function($req, $res, $next) {
    $req->startTime = microtime(true);
    $next();

    $duration = microtime(true) - $req->startTime;
    $res->header('X-Response-Time', $duration . 'ms');
});
```

### **Security by Design**
Built-in security features for safe API development without configuration overhead.

```php
// Auto-sanitization and validation
$app->post('/users', function($req, $res) {
    $data = $req->validate([
        'email' => 'required|email',
        'name' => 'required|string|max:100'
    ]);

    // $data is automatically sanitized and validated
    $user = User::create($data);
    $res->json($user, 201);
});
```

### **Zero Configuration**
Works beautifully out of the box, configurable when you need it.

```php
// No config files required
$app = new Application();

// But flexible when you need control
$app = new App([
    'debug' => true,
    'cors' => ['origin' => 'localhost:3000'],
    'cache' => ['driver' => 'redis', 'host' => 'localhost']
]);
```

---

## Performance

PivotPHP delivers exceptional performance without sacrificing developer experience:

| Framework | Requests/sec | Memory Usage | Response Time |
|-----------|-------------|--------------|---------------|
| **PivotPHP Core** | **13,374** | **0-2 MB** | **0.07ms** |
| PivotPHP ORM | 8,893 | 2-5 MB | 0.11ms |
| Slim 4 | 4,562 | 5-8 MB | 0.22ms |
| Lumen | 2,912 | 10-15 MB | 0.34ms |
| Flight | 6,234 | 3-6 MB | 0.16ms |

*Benchmarks run on PHP 8.2, single-threaded, simple JSON response. [View full benchmarks →](https://pivotphp.github.io/benchmarks)*

---

## Documentation

- **[Quick Start Guide](https://pivotphp.github.io/website/docs/getting-started/)** - Get up and running in 5 minutes
- **[API Reference](https://pivotphp.github.io/website/docs/api/)** - Complete method documentation
- **[Examples Gallery](https://pivotphp.github.io/website/docs/examples/)** - Real-world applications
- **[Migration Guide](https://pivotphp.github.io/website/docs/migration/)** - Coming from other frameworks
- **[Performance Guide](https://pivotphp.github.io/website/docs/performance/)** - Optimization best practices

---

## Examples

### REST API with Database
```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\Database\DB;

$app = new Application();

// Auto-connect database
DB::connect('mysql://user:pass@localhost/mydb');

$app->get('/users', function($req, $res) {
    $users = DB::table('users')->get();
    $res->json($users);
});

$app->post('/users', function($req, $res) {
    $user = DB::table('users')->create($req->body);
    $res->json($user, 201);
});

$app->listen(8000);
```

### Microservice with Authentication
```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\Middleware\{Auth, CORS, RateLimit};

$app = new Application();

// Global middleware
$app->use(CORS::allow('*'));
$app->use(RateLimit::perMinute(100));

// Protected routes
$app->group('/api', function($group) {
    $group->middleware(Auth::jwt());

    $group->get('/profile', function($req, $res) {
        $res->json($req->user);
    });

    $group->post('/posts', function($req, $res) {
        $post = Post::create([
            'user_id' => $req->user->id,
            'content' => $req->body->content
        ]);
        $res->json($post, 201);
    });
});

$app->listen(8000);
```

### Real-time API with WebSockets
```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\WebSocket\Server;

$app = new Application();

// HTTP routes
$app->get('/health', fn() => ['status' => 'ok']);

// WebSocket server
$ws = new Server($app);

$ws->on('connection', function($socket) {
    $socket->emit('welcome', ['message' => 'Connected to PivotPHP']);
});

$ws->on('message', function($socket, $data) {
    // Broadcast to all connected clients
    $socket->broadcast('update', $data);
});

$app->listen(8000, $ws);
```

**[More Examples →](https://github.com/pivotphp/examples)**

---

## Ecosystem

### Official Packages
- **[pivotphp/pivotphp-cycle-orm](https://github.com/pivotphp/pivotphp-cycle-orm)** - Database ORM integration
- **[pivotphp/middleware-collection](https://github.com/pivotphp/middleware-collection)** - Common middleware
- **[pivotphp/jwt-auth](https://github.com/pivotphp/jwt-auth)** - JWT authentication
- **[pivotphp/cache](https://github.com/pivotphp/cache)** - Multi-driver caching

### Community Packages
- **[pivotphp/testing](https://packagist.org/packages/pivotphp/testing)** - Testing utilities
- **[pivotphp/swagger](https://packagist.org/packages/pivotphp/swagger)** - OpenAPI documentation
- **[pivotphp/queue](https://packagist.org/packages/pivotphp/queue)** - Background job processing

**[Browse all packages →](https://packagist.org/packages/pivotphp/)**

---

## Community

Join the PivotPHP community and help shape the future of PHP development:

- **[GitHub Discussions](https://github.com/pivotphp/pivotphp-core/discussions)** - Questions, ideas, and announcements
- **[Discord Server](https://discord.gg/DMtxsP7z)** - Real-time community chat
- **[Twitter](https://twitter.com/pivotphp)** - Updates and news
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/pivotphp)** - Technical Q&A

### Contributing

PivotPHP exists because the PHP community deserves better. Whether you're fixing typos, reporting bugs, or proposing new features, you're helping make that vision reality.

```bash
# Fork and clone
git clone https://github.com/pivotphp/pivotphp-core.git
cd pivotphp-core

# Install dependencies
composer install

# Run tests
composer test

# Make your changes and submit a PR!
```

**[Contributing Guidelines →](CONTRIBUTING.md)**

---

## License

PivotPHP is open-sourced software licensed under the [MIT license](LICENSE).

---

## About the Author

**Caio Alberto Fernandes** - 6 years of backend API development experience
*"Building tools that adapt to developers, not the other way around."*

- **GitHub:** [@CAFernandes](https://github.com/CAFernandes)
- **LinkedIn:** [caio-alberto-fernandes](https://www.linkedin.com/in/caio-alberto-fernandes/)
- **PivotPHP Org:** [github.com/pivotphp](https://github.com/pivotphp)

---

## Links

- **[Website](https://pivotphp.github.io/website/)** - Official PivotPHP website
- **[Documentation](https://pivotphp.github.io/website/docs/)** - Complete documentation
- **[Packagist](https://packagist.org/packages/pivotphp/pivotphp-core)** - Composer package
- **[Benchmarks](https://pivotphp.github.io/benchmarks/)** - Performance comparisons

---

## Join the Evolution

PivotPHP isn't just another framework. It's a return to simplicity, performance, and developer happiness. Whether you're building a simple API or a complex microservices architecture, PivotPHP adapts to your needs.

Ready to evolve your PHP development?

[Get Started Now](/docs/installation/) | [View on GitHub](https://github.com/pivotphp)

<div align="center">

**⭐ Star us on GitHub — it helps!**

**Built with love by the PHP community, for the PHP community.**

*PivotPHP: O framework que evolui com seu projeto.*

</div>
