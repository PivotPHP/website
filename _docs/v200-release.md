---
layout: docs
title: v2.0.0 Release - Legacy Cleanup Edition
permalink: /docs/v200-release/
---

# PivotPHP v2.0.0 - Legacy Cleanup Edition

**Release Date:** January 2025
**Theme:** "Simplicity through Elimination"
**Status:** ⚠️ **BREAKING RELEASE**

---

## 🎯 Overview

Version 2.0.0 represents a **major architectural cleanup**, removing 18% of the codebase (11,871 lines) while maintaining 100% test coverage. This release eliminates technical debt accumulated since v1.1.x, providing a cleaner foundation for future development.

### Key Achievements

- ✅ **18% Code Reduction** - Removed 11,871 lines of legacy code
- ✅ **110 Aliases Eliminated** - Cleaner namespace structure
- ✅ **Zero Deprecated Code** - All legacy v1.1.x aliases removed
- ✅ **100% Test Coverage** - All 5,548 tests passing
- ✅ **59% Faster Autoload** - Removed alias mapping overhead
- ✅ **Routing Externalized** - Moved to `pivotphp/core-routing` package

---

## 💥 Breaking Changes

### 1. PSR-15 Middleware Namespaces

**Old (v1.x):**
```php
use PivotPHP\Core\Http\Psr15\Middleware\AuthMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\CorsMiddleware;
use PivotPHP\Core\Http\Psr15\Middleware\SecurityMiddleware;
```

**New (v2.0.0):**
```php
use PivotPHP\Core\Middleware\Security\AuthMiddleware;
use PivotPHP\Core\Middleware\Http\CorsMiddleware;
use PivotPHP\Core\Middleware\Security\SecurityMiddleware;
```

### 2. Simple* Prefix Removal

**Old (v1.x):**
```php
use PivotPHP\Core\Middleware\SimpleRateLimitMiddleware;
use PivotPHP\Core\Security\SimpleCsrfMiddleware;
```

**New (v2.0.0):**
```php
use PivotPHP\Core\Middleware\Performance\RateLimitMiddleware;
use PivotPHP\Core\Middleware\Security\CsrfMiddleware;
```

### 3. OpenAPI System

**Old (v1.x):**
```php
use PivotPHP\Core\OpenApi\OpenApiExporter;

$exporter = new OpenApiExporter($router);
$schema = $exporter->export();
```

**New (v2.0.0):**
```php
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;

$app->use(new ApiDocumentationMiddleware([
    'title' => 'My API',
    'version' => '1.0.0'
]));
```

### 4. Removed Components

- ❌ **DynamicPoolManager** - Use `ObjectPool` instead
- ❌ **SimpleTrafficClassifier** - Removed (over-engineered for POC use cases)
- ❌ **110 Legacy Aliases** - All v1.1.x backward compatibility removed

---

## 🚀 Migration Guide

### Quick Migration (15-30 minutes)

```bash
# 1. Update composer.json
composer require pivotphp/core:^2.0

# 2. Automated namespace updates
find src/ -type f -name "*.php" -exec sed -i \
  's/use PivotPHP\\Core\\Http\\Psr15\\Middleware\\/use PivotPHP\\Core\\Middleware\\/g' {} \;

# 3. Remove Simple* prefixes
find src/ -type f -name "*.php" -exec sed -i \
  's/Simple\(RateLimitMiddleware\|CsrfMiddleware\)/\1/g' {} \;

# 4. Run tests
composer test
```

### Detailed Migration Steps

1. **Update Middleware Imports**
   - Replace `Http\Psr15\Middleware\*` with appropriate namespaces
   - Security middleware → `Middleware\Security\*`
   - HTTP middleware → `Middleware\Http\*`
   - Performance middleware → `Middleware\Performance\*`

2. **Remove Simple* Prefixes**
   - All "Simple" prefixed classes renamed
   - Update imports and class references

3. **Update API Documentation**
   - Replace `OpenApiExporter` with `ApiDocumentationMiddleware`
   - Use PSR-15 middleware approach

4. **Test Thoroughly**
   - Run full test suite after each module update
   - Validate API endpoints

---

## 🔌 Modular Routing Foundation

### Phase 1: Complete (v2.0.0)

Routing system extracted to external package:

```php
// Routing now from pivotphp/core-routing
use PivotPHP\Core\Routing\Router;

$app = new Application();
$app->get('/users', function($req, $res) {
    // Router from external package
});
```

**Backward Compatibility:**
- ✅ All existing code works unchanged
- ✅ Aliases provide seamless transition
- ✅ Zero breaking changes in routing API

### Phase 2: Planned (v2.1.0)

Pluggable router injection coming soon:

```php
// Future: Custom router adapters
$app = new Application([
    'router' => new SymfonyRoutingAdapter()
]);
```

**Planned Features:**
- 🚧 RouterInterface contract
- 🚧 Multiple adapter implementations (Symfony, Attribute-based)
- 🚧 Router injection via Application constructor

---

## 📊 Performance Impact

### Autoload Performance

| Metric | v1.2.0 | v2.0.0 | Improvement |
|--------|--------|--------|-------------|
| **Alias Count** | 110 | 0 | 100% reduction |
| **Bootstrap Time** | ~15ms | ~6ms | 59% faster |
| **Memory Footprint** | 1.61MB | 1.45MB | 10% reduction |
| **PSR-4 Resolution** | Slow | Fast | Optimized |

### HTTP Throughput

- ✅ **No Regression** - Maintained 44,092 ops/sec
- ✅ **Same Performance** - Cleanup didn't impact runtime
- ✅ **Better Autoload** - Faster application bootstrap

---

## 🎓 Design Philosophy

### "Simplicity through Elimination"

This release embodies our commitment to **maintainability over backward compatibility**:

1. **Reduced Cognitive Load** - 110 fewer aliases to understand
2. **Clearer Intent** - Modern namespaces reflect component purposes
3. **Better Navigation** - Simpler directory structure
4. **Clean Foundation** - Ready for v2.x feature development

### Why Breaking Changes?

- **SemVer Compliant** - Major versions permit breaking changes
- **Long-term Health** - Better to break once than accumulate debt
- **Educational Focus** - Simpler codebase easier to learn
- **Future-Ready** - Clean slate for PHP 8.4 features

---

## 🔧 Troubleshooting

### Common Issues

**Issue 1: Class Not Found**
```php
// Error: Class 'PivotPHP\Core\Http\Psr15\Middleware\AuthMiddleware' not found
// Solution: Update namespace
use PivotPHP\Core\Middleware\Security\AuthMiddleware;
```

**Issue 2: Simple* Prefix Missing**
```php
// Error: Class 'SimpleRateLimitMiddleware' not found
// Solution: Remove 'Simple' prefix
use PivotPHP\Core\Middleware\Performance\RateLimitMiddleware;
```

**Issue 3: OpenApiExporter Removed**
```php
// Error: Class 'OpenApiExporter' not found
// Solution: Use ApiDocumentationMiddleware
$app->use(new ApiDocumentationMiddleware([
    'title' => 'My API',
    'version' => '1.0.0'
]));
```

---

## 📚 Documentation

- **Migration Guide:** [Complete migration instructions](https://github.com/HelixPHP/helixphp-core/blob/main/docs/releases/v2.0.0/MIGRATION_GUIDE_v2.0.0.md)
- **Framework Overview:** [Technical deep dive](https://github.com/HelixPHP/helixphp-core/blob/main/docs/releases/v2.0.0/FRAMEWORK_OVERVIEW.md)
- **Release Notes:** [Detailed changelog](https://github.com/HelixPHP/helixphp-core/blob/main/docs/releases/v2.0.0/RELEASE_NOTES.md)
- **Changelog:** [Full version history](https://github.com/HelixPHP/helixphp-core/blob/main/CHANGELOG.md)

---

## 🎉 What's Next?

### v2.1.0 Roadmap (Q2 2025)

- **Pluggable Routing** - Router injection via Application constructor
- **Enhanced Validation** - Built-in request validation
- **Advanced Middleware** - Response caching, compression
- **Route Groups** - Improved group handling
- **Performance** - Further optimizations

### v2.x Vision

- Modern PHP 8.4 features
- Better developer tooling
- Interactive documentation
- Expanded ecosystem
- Community packages

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/HelixPHP/helixphp-core/issues)
- **Discussions:** [Community Forum](https://github.com/HelixPHP/helixphp-core/discussions)
- **Discord:** [Join our server](https://discord.gg/DMtxsP7z)

---

**PivotPHP v2.0.0 - Built with Simplicity in Mind 🚀**

*"Simplicity through Elimination"*
