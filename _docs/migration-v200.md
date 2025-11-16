---
layout: docs
title: Migration to v2.0.0
permalink: /docs/migration-v200/
---

# Migrating to PivotPHP v2.0.0

This guide helps you migrate from PivotPHP v1.x to v2.0.0.

<div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid rgba(239, 68, 68, 0.8); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
  <strong>⚠️ Breaking Release</strong><br>
  Version 2.0.0 includes breaking changes. All applications must update imports and namespaces. Estimated migration time: 15-30 minutes for typical applications.
</div>

---

## Overview

**What's Changed:**
- ❌ Removed 110 legacy namespace aliases
- ❌ Removed 30 deprecated files
- ✅ Cleaner, modern namespace structure
- ✅ 18% code reduction (11,871 lines)
- ✅ 59% faster autoload performance

---

## Quick Migration Checklist

- [ ] Update `composer.json` to require `pivotphp/core:^2.0`
- [ ] Update PSR-15 middleware imports
- [ ] Remove `Simple*` prefix from class names
- [ ] Update OpenAPI/Swagger usage
- [ ] Run automated migration script
- [ ] Test your application thoroughly

---

## Breaking Changes

### 1. Middleware Namespaces

#### Security Middleware

```php
// ❌ OLD (v1.x)
use PivotPHP\Core\Http\Psr15\Middleware\AuthMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\CsrfMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\XssMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\SecurityHeadersMiddleware;

// ✅ NEW (v2.0.0)
use PivotPHP\Core\Middleware\Security\AuthMiddleware;
use PivotPHP\Core\Middleware\Security\CsrfMiddleware;
use PivotPHP\Core\Middleware\Security\XssMiddleware;
use PivotPHP\Core\Middleware\Security\SecurityHeadersMiddleware;
```

#### HTTP Middleware

```php
// ❌ OLD (v1.x)
use PivotPHP\Core\Http\Psr15\Middleware\CorsMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\ErrorMiddleware;

// ✅ NEW (v2.0.0)
use PivotPHP\Core\Middleware\Http\CorsMiddleware;
use PivotPHP\Core\Middleware\Http\ErrorMiddleware;
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;
```

#### Performance Middleware

```php
// ❌ OLD (v1.x)
use PivotPHP\Core\Http\Psr15\Middleware\RateLimitMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\CacheMiddleware;

// ✅ NEW (v2.0.0)
use PivotPHP\Core\Middleware\Performance\RateLimitMiddleware;
use PivotPHP\Core\Middleware\Performance\CacheMiddleware;
```

### 2. Simple* Prefix Removal

```php
// ❌ OLD (v1.x)
use PivotPHP\Core\Middleware\SimpleRateLimitMiddleware;
use PivotPHP\Core\Security\SimpleCsrfMiddleware;

// ✅ NEW (v2.0.0)
use PivotPHP\Core\Middleware\Performance\RateLimitMiddleware;
use PivotPHP\Core\Middleware\Security\CsrfMiddleware;
```

### 3. OpenAPI System

```php
// ❌ OLD (v1.x) - Deprecated approach
use PivotPHP\Core\OpenApi\OpenApiExporter;

$exporter = new OpenApiExporter($router);
$schema = $exporter->export();
file_put_contents('openapi.json', json_encode($schema));

// ✅ NEW (v2.0.0) - Middleware approach
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;

$app->use(new ApiDocumentationMiddleware([
    'title' => 'My API',
    'version' => '1.0.0',
    'docs_path' => '/docs',        // OpenAPI JSON
    'swagger_path' => '/swagger'   // Swagger UI
]));
```

### 4. Removed Components

#### DynamicPoolManager

```php
// ❌ OLD (v1.x) - Removed
use PivotPHP\Core\Performance\Pool\DynamicPoolManager;

$poolManager = new DynamicPoolManager();

// ✅ NEW (v2.0.0) - Use simple ObjectPool
use PivotPHP\Core\Performance\Pool\ObjectPool;

$pool = new ObjectPool(MyClass::class);
```

#### SimpleTrafficClassifier

```php
// ❌ OLD (v1.x) - Removed (over-engineered)
use PivotPHP\Core\Performance\Classification\SimpleTrafficClassifier;

// ✅ NEW (v2.0.0) - Use framework defaults
// No replacement needed for POC/prototype use cases
```

---

## Automated Migration

### Step 1: Update Composer

```bash
# Update composer.json
composer require pivotphp/core:^2.0

# Or manually edit composer.json:
{
    "require": {
        "pivotphp/core": "^2.0"
    }
}

composer update
```

### Step 2: Run Automated Script

```bash
# PSR-15 Middleware namespace updates
find src/ -type f -name "*.php" -exec sed -i \
  's/use PivotPHP\\Core\\Http\\Psr15\\Middleware\\/use PivotPHP\\Core\\Middleware\\/g' {} \;

# Update specific middleware to correct categories
find src/ -type f -name "*.php" -exec sed -i \
  's/use PivotPHP\\Core\\Middleware\\AuthMiddleware/use PivotPHP\\Core\\Middleware\\Security\\AuthMiddleware/g' {} \;

find src/ -type f -name "*.php" -exec sed -i \
  's/use PivotPHP\\Core\\Middleware\\CsrfMiddleware/use PivotPHP\\Core\\Middleware\\Security\\CsrfMiddleware/g' {} \;

find src/ -type f -name "*.php" -exec sed -i \
  's/use PivotPHP\\Core\\Middleware\\CorsMiddleware/use PivotPHP\\Core\\Middleware\\Http\\CorsMiddleware/g' {} \;

find src/ -type f -name "*.php" -exec sed -i \
  's/use PivotPHP\\Core\\Middleware\\RateLimitMiddleware/use PivotPHP\\Core\\Middleware\\Performance\\RateLimitMiddleware/g' {} \;

# Remove Simple* prefixes
find src/ -type f -name "*.php" -exec sed -i \
  's/SimpleRateLimitMiddleware/RateLimitMiddleware/g' {} \;

find src/ -type f -name "*.php" -exec sed -i \
  's/SimpleCsrfMiddleware/CsrfMiddleware/g' {} \;
```

### Step 3: Manual Updates

1. **Search for OpenApiExporter usage:**
   ```bash
   grep -r "OpenApiExporter" src/
   ```

2. **Replace with ApiDocumentationMiddleware:**
   ```php
   $app->use(new ApiDocumentationMiddleware([
       'title' => 'My API',
       'version' => '1.0.0'
   ]));
   ```

3. **Search for DynamicPoolManager:**
   ```bash
   grep -r "DynamicPoolManager" src/
   ```

4. **Replace with ObjectPool or remove if not needed**

### Step 4: Test Everything

```bash
# Run your test suite
composer test

# Or manually test
./vendor/bin/phpunit

# Start dev server and test manually
php -S localhost:8000 -t public
```

---

## Example: Complete Migration

### Before (v1.x)

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Http\Psr15\Middleware\CorsMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\AuthMiddleware;
use PivotPHP\Core\Middleware\SimpleRateLimitMiddleware;
use PivotPHP\Core\OpenApi\OpenApiExporter;

$app = new Application();

// Middleware
$app->use(new CorsMiddleware());
$app->use(new AuthMiddleware(['secret' => 'key']));
$app->use(new SimpleRateLimitMiddleware());

// Routes
$app->get('/api/users', [UserController::class, 'index']);

// OpenAPI export
$exporter = new OpenApiExporter($app->getRouter());
$schema = $exporter->export();

$app->run();
```

### After (v2.0.0)

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Middleware\Http\CorsMiddleware;
use PivotPHP\Core\Middleware\Security\AuthMiddleware;
use PivotPHP\Core\Middleware\Performance\RateLimitMiddleware;
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;

$app = new Application();

// Middleware
$app->use(new CorsMiddleware());
$app->use(new AuthMiddleware(['secret' => 'key']));
$app->use(new RateLimitMiddleware());

// API Documentation
$app->use(new ApiDocumentationMiddleware([
    'title' => 'My API',
    'version' => '1.0.0'
]));

// Routes
$app->get('/api/users', [UserController::class, 'index']);

$app->run();
```

---

## Common Issues

### Issue 1: Class Not Found

**Error:**
```
Fatal error: Class 'PivotPHP\Core\Http\Psr15\Middleware\AuthMiddleware' not found
```

**Solution:**
```php
// Update the namespace
use PivotPHP\Core\Middleware\Security\AuthMiddleware;
```

### Issue 2: Simple* Prefix Not Found

**Error:**
```
Fatal error: Class 'SimpleRateLimitMiddleware' not found
```

**Solution:**
```php
// Remove the Simple prefix
use PivotPHP\Core\Middleware\Performance\RateLimitMiddleware;
```

### Issue 3: OpenApiExporter Missing

**Error:**
```
Fatal error: Class 'PivotPHP\Core\OpenApi\OpenApiExporter' not found
```

**Solution:**
```php
// Use ApiDocumentationMiddleware instead
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;

$app->use(new ApiDocumentationMiddleware([
    'title' => 'My API',
    'version' => '1.0.0'
]));

// Access documentation at:
// http://localhost:8080/swagger (Swagger UI)
// http://localhost:8080/docs (OpenAPI JSON)
```

---

## Testing Your Migration

### 1. Automated Tests

```bash
# Run full test suite
composer test

# Run specific tests
./vendor/bin/phpunit tests/Unit
./vendor/bin/phpunit tests/Integration
```

### 2. Manual Testing

```bash
# Start development server
php -S localhost:8000 -t public

# Test endpoints
curl http://localhost:8000/api/users
curl http://localhost:8000/swagger
curl http://localhost:8000/docs
```

### 3. Checklist

- [ ] All routes respond correctly
- [ ] Middleware executes as expected
- [ ] API documentation accessible
- [ ] Error handling works
- [ ] Authentication functions
- [ ] CORS headers present
- [ ] Rate limiting active

---

## Benefits After Migration

### Performance Improvements

- ✅ **59% faster autoload** - Zero alias overhead
- ✅ **10% less memory** - Cleaner architecture
- ✅ **Faster bootstrap** - ~6ms vs ~15ms

### Code Quality

- ✅ **Cleaner namespaces** - More intuitive structure
- ✅ **Better IDE support** - Accurate autocomplete
- ✅ **Easier maintenance** - Less cognitive load
- ✅ **Modern codebase** - Zero deprecated code

### Developer Experience

- ✅ **Clearer documentation** - Consistent examples
- ✅ **Simpler learning** - Fewer concepts to grasp
- ✅ **Future-proof** - Ready for PHP 8.4 features

---

## Need Help?

- **Full Migration Guide:** [GitHub Documentation](https://github.com/HelixPHP/helixphp-core/blob/main/docs/releases/v2.0.0/MIGRATION_GUIDE_v2.0.0.md)
- **Issues:** [Report problems](https://github.com/HelixPHP/helixphp-core/issues)
- **Discord:** [Get help from community](https://discord.gg/DMtxsP7z)
- **Discussions:** [Ask questions](https://github.com/HelixPHP/helixphp-core/discussions)

---

**Estimated Migration Time:**
- Small apps (< 10 routes): 15 minutes
- Medium apps (10-50 routes): 30 minutes
- Large apps (50+ routes): 1-2 hours

**Difficulty:** Low to Medium
**Worth It:** Absolutely! 🚀
