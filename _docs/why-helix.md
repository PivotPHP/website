---
layout: docs
title: Why HelixPHP?
permalink: /docs/why-helix/
---
# HelixPHP 🧬

**The Evolutionary PHP Microframework**
*Fast, unopinionated, minimalist web framework for PHP. Built for performance, designed to evolve.*

[![Latest Version](https://img.shields.io/packagist/v/helixphp/helixphp-core.svg)](https://packagist.org/packages/helixphp/helixphp-core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/helixphp/helixphp-core/tests.yml?branch=main)](https://github.com/helixphp/helixphp-core/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP Version](https://img.shields.io/badge/php-8.1%2B-777bb4.svg)](https://php.net)
[![Performance](https://img.shields.io/badge/performance-52M%2B%20ops%2Fsec-brightgreen.svg)](#performance)

---

## 🎯 Why HelixPHP?

After 6 years building high-performance APIs, I kept hitting the same wall with PHP frameworks—they all felt heavy, opinionated, and restrictive. Coming from Node.js, I missed the elegance of Express.js: simple, flexible, and powerful. One afternoon, frustrated by another rigid framework forcing me into its way of thinking, I started building what became HelixPHP.

**What began as ExpressPHP became something bigger.** As the project evolved, I realized this wasn't just about copying Express.js—it was about creating a framework that truly adapts to your needs. Like DNA that shapes itself to different environments, HelixPHP molds to your project without losing its core identity. No forced patterns, no bloated features, just clean PHP that stays out of your way.

HelixPHP doesn't tell you how to build your API. Instead, it gives you the tools to build it **your way**.

```php
<?php
require 'vendor/autoload.php';

use Helix\App;

$app = new App();

// Simple route
$app->get('/hello/:name', function($req, $res) {
    $res->json(['message' => "Hello, {$req->params->name}!"]);
});

// Middleware that just works
$app->use('/api/*', function($req, $res, $next) {
    $res->header('Content-Type', 'application/json');
    $next();
});

// RESTful resource
$app->get('/users/:id', function($req, $res) {
    $user = User::find($req->params->id);
    $res->json($user);
});

$app->listen(8000);
```

**⚡ 2 minutes. That's all you need to build your first production-ready API.**

---

## 🚀 Installation

```bash
composer require helixphp/helixphp-core
```

**Requirements:**
- PHP 8.1 or higher
- Composer

**Optional Extensions:**
```bash
# For database integration
composer require helixphp/helixphp-cycle-orm

# For additional middleware
composer require helixphp/middleware-collection
```

---

## ✨ Key Features

### 🧬 **Evolutionary Architecture**
HelixPHP adapts to your needs, not the other way around. Start simple, scale complex.

```php
// Start simple
$app->get('/', fn() => 'Hello World');

// Evolve naturally
$app->group('/api/v1', function($group) {
    $group->middleware([AuthMiddleware::class, RateLimitMiddleware::class]);
    $group->resource('/users', UserController::class);
});
```

### ⚡ **Blazing Performance**
**52M+ operations/second.** Built for speed from the ground up.

```php
// Optimized routing with zero-config caching
$app->get('/fast/:id/data/:type', function($req, $res) {
    // Auto-cached route matching
    // Type-safe parameter extraction
    // Memory-efficient response handling
    $res->json($data);
});
```

### 🎛️ **Express.js-Inspired Syntax**
If you know Express.js, you already know HelixPHP.

```php
// Familiar middleware pattern
$app->use(function($req, $res, $next) {
    $req->startTime = microtime(true);
    $next();

    $duration = microtime(true) - $req->startTime;
    $res->header('X-Response-Time', $duration . 'ms');
});
```

### 🛡️ **Security by Design**
Production-ready security without configuration overhead.

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

### 🔧 **Zero Configuration**
Works beautifully out of the box, configurable when you need it.

```php
// No config files required
$app = new App();

// But flexible when you need control
$app = new App([
    'debug' => true,
    'cors' => ['origin' => 'localhost:3000'],
    'cache' => ['driver' => 'redis', 'host' => 'localhost']
]);
```

---

## 📊 Performance

HelixPHP delivers exceptional performance without sacrificing developer experience:

| Framework | Requests/sec | Memory Usage | Response Time |
|-----------|-------------|--------------|---------------|
| **HelixPHP** | **52,000+** | **8.2 MB** | **0.05ms** |
| Framework A | 12,000 | 12.5 MB | 0.12ms |
| Framework B | 15,000 | 10.1 MB | 0.08ms |
| Framework C | 3,500 | 25.7 MB | 0.35ms |

*Benchmarks run on PHP 8.2, single-threaded, simple JSON response. [View full benchmarks →](https://helixphp.github.io/benchmarks)*

---

## 📚 Documentation

- **[Quick Start Guide](https://helixphp.github.io/website/docs/getting-started/)** - Get up and running in 5 minutes
- **[API Reference](https://helixphp.github.io/website/docs/api/)** - Complete method documentation
- **[Examples Gallery](https://helixphp.github.io/website/docs/examples/)** - Real-world applications
- **[Migration Guide](https://helixphp.github.io/website/docs/migration/)** - Coming from other frameworks
- **[Performance Guide](https://helixphp.github.io/website/docs/performance/)** - Optimization best practices

---

## 🛠️ Examples

### REST API with Database
```php
<?php
use Helix\App;
use Helix\Database\DB;

$app = new App();

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
use Helix\App;
use Helix\Middleware\{Auth, CORS, RateLimit};

$app = new App();

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
use Helix\App;
use Helix\WebSocket\Server;

$app = new App();

// HTTP routes
$app->get('/health', fn() => ['status' => 'ok']);

// WebSocket server
$ws = new Server($app);

$ws->on('connection', function($socket) {
    $socket->emit('welcome', ['message' => 'Connected to HelixPHP']);
});

$ws->on('message', function($socket, $data) {
    // Broadcast to all connected clients
    $socket->broadcast('update', $data);
});

$app->listen(8000, $ws);
```

**[More Examples →](https://github.com/helixphp/examples)**

---

## 🌟 Ecosystem

### Official Packages
- **[helixphp/helixphp-cycle-orm](https://github.com/helixphp/helixphp-cycle-orm)** - Database ORM integration
- **[helixphp/middleware-collection](https://github.com/helixphp/middleware-collection)** - Common middleware
- **[helixphp/jwt-auth](https://github.com/helixphp/jwt-auth)** - JWT authentication
- **[helixphp/cache](https://github.com/helixphp/cache)** - Multi-driver caching

### Community Packages
- **[helixphp/testing](https://packagist.org/packages/helixphp/testing)** - Testing utilities
- **[helixphp/swagger](https://packagist.org/packages/helixphp/swagger)** - OpenAPI documentation
- **[helixphp/queue](https://packagist.org/packages/helixphp/queue)** - Background job processing

**[Browse all packages →](https://packagist.org/packages/helixphp/)**

---

## 🤝 Community

Join the HelixPHP community and help shape the future of PHP development:

- **[GitHub Discussions](https://github.com/helixphp/helixphp-core/discussions)** - Questions, ideas, and announcements
- **[Discord Server](https://discord.gg/helixphp)** - Real-time community chat
- **[Twitter](https://twitter.com/helixphp)** - Updates and news
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/helixphp)** - Technical Q&A

### Contributing

HelixPHP exists because the PHP community deserves better. Whether you're fixing typos, reporting bugs, or proposing new features, you're helping make that vision reality.

```bash
# Fork and clone
git clone https://github.com/helixphp/helixphp-core.git
cd helixphp-core

# Install dependencies
composer install

# Run tests
composer test

# Make your changes and submit a PR!
```

**[Contributing Guidelines →](CONTRIBUTING.md)**

---

## 📄 License

HelixPHP is open-sourced software licensed under the [MIT license](LICENSE).

---

## 👨‍💻 About the Author

**Caio Alberto Fernandes** - 6 years of backend API development experience
*"Building tools that adapt to developers, not the other way around."*

- **GitHub:** [@CAFernandes](https://github.com/CAFernandes)
- **LinkedIn:** [caio-alberto-fernandes](https://www.linkedin.com/in/caio-alberto-fernandes/)
- **HelixPHP Org:** [github.com/helixphp](https://github.com/helixphp)

---

## 🔗 Links

- **[Website](https://helixphp.github.io/website/)** - Official HelixPHP website
- **[Documentation](https://helixphp.github.io/website/docs/)** - Complete documentation
- **[Packagist](https://packagist.org/packages/helixphp/helixphp-core)** - Composer package
- **[Benchmarks](https://helixphp.github.io/benchmarks/)** - Performance comparisons

---

## Join the Evolution

HelixPHP isn't just another framework. It's a return to simplicity, performance, and developer happiness. Whether you're building a simple API or a complex microservices architecture, HelixPHP adapts to your needs.

Ready to evolve your PHP development?

[Get Started Now](/docs/installation/) | [View on GitHub](https://github.com/helixphp)

<div align="center">

**⭐ Dê uma estrela no GitHub — isso ajuda!**

**Feito com ❤️ pela comunidade PHP, para a comunidade PHP.**

*HelixPHP: O framework que evolui com seu projeto.*

</div>
