---
layout: docs
title: Extensions
permalink: /docs/extensions/
---

PivotPHP has a rich ecosystem of extensions that add powerful features to the core framework. These modular packages allow you to pick exactly what you need for your project.

## Official Extensions

### Database & ORM

#### [Cycle ORM](/docs/extensions/cycle-orm/)
A powerful DataMapper ORM that provides a complete database solution.

```bash
composer require pivotphp/cycle-orm
```

**Features:**
- Automatic schema generation and migrations
- Entity repositories with query builder
- Relationships (HasOne, HasMany, BelongsTo, ManyToMany)
- Transaction support
- Multiple database connections

### Async Runtime

#### [ReactPHP Extension](/docs/extensions/reactphp/)
High-performance continuous runtime using ReactPHP's event-driven architecture.

```bash
composer require pivotphp/reactphp
```

**Features:**
- Continuous HTTP server without restarts
- Event-driven, non-blocking I/O
- WebSocket support (coming soon)
- Async operations and promises
- Timer and periodic tasks

## Community Extensions

The PivotPHP ecosystem is designed to be extended! We're excited about the extensions that the community will create.

### Official Extensions Available

- **[pivotphp/core](https://packagist.org/packages/pivotphp/core)** - Core framework ([GitHub](https://github.com/PivotPHP/pivotphp-core))
- **[pivotphp/cycle-orm](https://packagist.org/packages/pivotphp/cycle-orm)** - Cycle ORM integration ([GitHub](https://github.com/PivotPHP/pivotphp-cycle-orm))
- **[pivotphp/reactphp](https://packagist.org/packages/pivotphp/reactphp)** - ReactPHP async runtime ([GitHub](https://github.com/PivotPHP/pivotphp-reactphp))

### Planned Extensions

We're planning to develop or support community development of:

- **OpenAPI/Swagger** - Automatic API documentation generation
- **Queue System** - Background job processing with multiple drivers
- **Advanced Caching** - Multi-driver caching (Redis, Memcached, File)
- **Mail Service** - Email abstraction with provider support
- **WebSocket Server** - Real-time bidirectional communication
- **GraphQL** - Modern API query language support
- **Admin Panel** - Auto-generated admin interfaces
- **Testing Utilities** - Enhanced testing helpers and assertions

Check our [GitHub organization]({{ site.github_url }}) and [Packagist](https://packagist.org/packages/pivotphp/) for updates on new extensions.

## Creating Extensions

Extensions in PivotPHP follow a simple pattern using Service Providers:

```php
namespace YourVendor\YourExtension;

use PivotPHP\Core\Providers\ServiceProvider;

class YourExtensionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register services
        $this->container->singleton('your-service', function($container) {
            return new YourService($container);
        });
    }
    
    public function boot(): void
    {
        // Bootstrap extension
        // Register routes, middleware, etc.
    }
}
```

### Extension Structure

A typical PivotPHP extension structure:

```
your-extension/
├── src/
│   ├── Providers/
│   │   └── YourExtensionServiceProvider.php
│   ├── Services/
│   ├── Middleware/
│   └── Commands/
├── config/
│   └── your-extension.php
├── tests/
├── composer.json
└── README.md
```

### Publishing an Extension

1. Create your extension following the structure above
2. Register on Packagist with naming convention: `vendor/pivotphp-{extension-name}`
3. Tag your releases following semantic versioning
4. Submit to the official extensions list via PR

## Extension Guidelines

- Follow PSR standards (PSR-4, PSR-12)
- Include comprehensive tests
- Provide clear documentation
- Use semantic versioning
- Be compatible with the latest PivotPHP version