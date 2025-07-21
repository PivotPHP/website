---
layout: docs
title: Documentation
permalink: /docs/
---

<p class="lead">Welcome to PivotPHP - The evolutionary PHP microframework designed for building modern, high-performance applications with minimal overhead.</p>

<div style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid rgba(251, 191, 36, 0.8); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
  <strong>🚧 Development Status</strong><br>
  PivotPHP is currently in active development. New features and extensions are being added regularly. It's perfect for concept validation and local API development, but not yet recommended for production use.
</div>

## Why PivotPHP?

PivotPHP brings the simplicity and elegance of Express.js to the PHP ecosystem while maintaining the performance and reliability PHP developers expect. With impressive API throughput (up to 70.9 million requests/hour), zero configuration requirements, and PSR-15 compliance, PivotPHP is perfect for:

- Local API development and testing
- Concept validation and prototyping
- Learning modern PHP patterns
- Building proof-of-concept applications

## Key Features

### 🚀 High-Performance APIs
With exceptional API performance, PivotPHP delivers outstanding speed for real-world applications. Our latest v1.2.0 benchmarks show:

- **OpenAPI Generation**: 3.5M operations/sec (Docker validated flagship feature)
- **Swagger UI Rendering**: 3.6M operations/sec (Interactive interface)
- **Application Creation**: 78,500 operations/sec (Maintained from v1.1.4)
- **Documentation Middleware**: 1.7M operations/sec (ApiDocumentationMiddleware)
- **ReactPHP Runtime**: 1.97M operations/sec specialized for async
- **Educational Focus**: Maintained performance with simplified architecture

*Benchmarks validated in real Docker containers with v1.2.0 "Simplicidade sobre Otimização Prematura" edition.*

### 🛡️ Security First
Built-in security features including CSRF protection, XSS prevention, rate limiting, and secure authentication make your applications safe by default.

### 🔧 Zero Configuration
Start building immediately with sensible defaults. No complex configuration files or setup required - just install and code.

### 📦 PSR Compliant
Full compliance with PSR-7 (HTTP messages), PSR-15 (middleware), and PSR-12 (coding standards) ensures compatibility with the PHP ecosystem.

### 📝 Automatic OpenAPI/Swagger Documentation (NEW in v1.2.0)
Zero-configuration API documentation with interactive testing interface:

```php
// Enable automatic documentation in 3 lines
$app->use(new ApiDocumentationMiddleware());
// ✅ Access: http://localhost:8080/swagger (Swagger UI)
// ✅ Access: http://localhost:8080/docs (OpenAPI JSON)
```

### 🎓 Educational Architecture (NEW in v1.2.0)
- **Simplicidade sobre Otimização Prematura**: Simple over complex implementations
- **15+ Automatic Aliases**: Zero breaking changes guaranteed
- **Educational Focus**: Perfect for learning microframework concepts
- **Legacy Namespace**: Advanced features still available

### 💫 Array Callable Support
PHP 8.4+ compatible array callable syntax maintained from v1.1.4:

```php
// Array callable syntax 
$app->get('/users', [UserController::class, 'index']);
$app->post('/users', [UserController::class, 'store']);
```

## Getting Started

Ready to build your first PivotPHP application? Head over to our [Quick Start guide]({{ site.baseurl }}/docs/quickstart/) to create your first app in minutes.

## Community & Support

- **GitHub**: [github.com/pivotphp](https://github.com/pivotphp)
- **Issues**: Report bugs or request features on our [issue tracker](https://github.com/pivotphp/framework/issues)
- **Discussions**: Join our [community discussions](https://github.com/pivotphp/framework/discussions)

## License

PivotPHP is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
