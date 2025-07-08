---
layout: docs
title: Extensions
permalink: /docs/extensions/
---

PivotPHP supports various extensions to enhance its functionality. These extensions are optional packages that integrate seamlessly with the core framework.

## Available Extensions

### Official Extensions

- **[Cycle ORM](/docs/extensions/cycle-orm/)** - Full-featured ORM with schema generation, migrations, and relations
- More extensions coming soon...

### Community Extensions

The PivotPHP community is actively developing extensions. Check our [GitHub organization]({{ site.github_url }}) for the latest packages.

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