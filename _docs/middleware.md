---
layout: docs
title: Middleware
permalink: /docs/middleware/
---

Middleware provides a convenient mechanism for filtering HTTP requests entering your application. PivotPHP v2.0.0 implements the PSR-15 middleware standard with clean, modern architecture and zero deprecated code.

## Architecture Highlights

- **🧹 Clean Namespaces**: Modern, intuitive structure
- **⚡ Zero Overhead**: Minimal performance impact
- **🎯 Organized by Purpose**: Security, Performance, HTTP categories
- **📦 PSR-15 Compliant**: Full standard compliance

## v2.0.0 Middleware Architecture

Middleware is organized by responsibility with modern namespaces:

```
src/Middleware/
├── Security/              # Security-focused middlewares
│   ├── AuthMiddleware.php
│   ├── CsrfMiddleware.php
│   ├── SecurityHeadersMiddleware.php
│   └── XssMiddleware.php
├── Performance/           # Performance-focused middlewares
│   ├── CacheMiddleware.php
│   └── RateLimitMiddleware.php
├── Http/                 # HTTP protocol middlewares
│   ├── CorsMiddleware.php
│   ├── ErrorMiddleware.php
│   └── ApiDocumentationMiddleware.php
└── Core/                 # Base middleware infrastructure
    ├── BaseMiddleware.php
    └── MiddlewareInterface.php
```

### ⚠️ Breaking Changes from v1.x

```php
// ❌ OLD (v1.x) - Legacy PSR-15 namespace
use PivotPHP\Core\Http\Psr15\Middleware\AuthMiddleware;

// ✅ NEW (v2.0.0) - Modern namespace
use PivotPHP\Core\Middleware\Security\AuthMiddleware;
```

## Understanding Middleware

Think of middleware as layers of an onion. Each request passes through these layers on its way in, and the response passes through them in reverse order on its way out.

```
Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler
                                                              ↓
Response ← Middleware 1 ← Middleware 2 ← Middleware 3 ← Response
```

## Creating Middleware

### Closure Middleware

The simplest way to create middleware is using a closure:

```php
$app->middleware(function($request, $handler) {
    // Before request handling
    echo "Request incoming!\n";

    // Pass to next middleware/handler
    $response = $handler->handle($request);

    // After request handling
    echo "Response outgoing!\n";

    return $response;
});
```

### Class-Based Middleware

For more complex middleware, create a class implementing `MiddlewareInterface`:

```php
namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
// v1.1.4 organized structure
use PivotPHP\Core\Middleware\Security\AuthMiddleware as BaseAuthMiddleware;

class AuthMiddleware extends BaseAuthMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Check if user is authenticated
        $token = $request->getHeaderLine('Authorization');

        if (!$this->isValidToken($token)) {
            // Return early with error response
            return new JsonResponse([
                'error' => 'Unauthorized'
            ], 401);
        }

        // Add user to request
        $request = $request->withAttribute('user', $this->getUserFromToken($token));

        // Continue to next middleware
        return $handler->handle($request);
    }

    private function isValidToken(string $token): bool
    {
        // Token validation logic
        return !empty($token);
    }

    private function getUserFromToken(string $token)
    {
        // Decode token and return user
        return ['id' => 1, 'name' => 'John Doe'];
    }
}
```

## Registering Middleware

### Global Middleware

Register middleware that runs on every request:

```php
// Using a closure
$app->middleware(function($req, $handler) {
    // Runs on every request
    return $handler->handle($req);
});

// Using a class
$app->middleware(new CorsMiddleware());
$app->middleware(new LoggingMiddleware());

// Using class name (will be resolved from container)
$app->middleware(RateLimitMiddleware::class);
```

### Route Middleware

Apply middleware to specific routes:

```php
// Single route
$app->get('/admin', function($req, $res) {
    return $res->json(['admin' => true]);
})->middleware('auth');

// Multiple middleware
$app->post('/api/users', function($req, $res) {
    // Create user
})->middleware(['auth', 'throttle:5,1']);

// Middleware with parameters
$app->get('/api/data', function($req, $res) {
    // Get data
})->middleware('cache:300'); // Cache for 300 seconds
```

### Group Middleware

Apply middleware to route groups:

```php
$app->group('/api', function($group) {
    $group->get('/users', [UserController::class, 'index']);
    $group->post('/users', [UserController::class, 'store']);
})->middleware(['auth', 'throttle:60,1']);

// Or within the group
$app->group('/admin', function($group) {
    $group->middleware(['auth', 'admin']);

    $group->get('/dashboard', function($req, $res) {
        // Admin dashboard
    });
});
```

## Built-in Middleware

PivotPHP includes several built-in middleware classes:

### CORS Middleware

```php
use PivotPHP\Middleware\CorsMiddleware;

$app->middleware(new CorsMiddleware([
    'allowed_origins' => ['https://example.com'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['Content-Type', 'Authorization'],
    'exposed_headers' => ['X-Total-Count'],
    'max_age' => 3600,
    'credentials' => true
]));
```

### Rate Limiting

```php
use PivotPHP\Middleware\RateLimitMiddleware;

$app->middleware(new RateLimitMiddleware([
    'max_attempts' => 60,
    'decay_minutes' => 1,
    'response_headers' => true // Add X-RateLimit-* headers
]));

// Or use the shorthand
$app->middleware('throttle:60,1');
```

### CSRF Protection

```php
use PivotPHP\Middleware\CsrfMiddleware;

$app->middleware(new CsrfMiddleware([
    'except' => ['/webhooks/*'], // Exclude paths
    'token_name' => '_token',
    'header_name' => 'X-CSRF-TOKEN'
]));
```

### Request Logging

```php
use PivotPHP\Middleware\LoggingMiddleware;

$app->middleware(new LoggingMiddleware([
    'logger' => $logger, // PSR-3 logger
    'level' => 'info',
    'format' => '{method} {uri} {status} {response_time}ms'
]));
```

## Middleware Parameters

Pass parameters to middleware using a colon syntax:

```php
// In route definition
$app->get('/cached', function($req, $res) {
    return $res->json(['time' => time()]);
})->middleware('cache:300,public');

// In middleware class
class CacheMiddleware implements MiddlewareInterface
{
    private int $duration;
    private string $visibility;

    public function __construct(int $duration = 60, string $visibility = 'private')
    {
        $this->duration = $duration;
        $this->visibility = $visibility;
    }

    public function process($request, $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        return $response->withHeader(
            'Cache-Control',
            "{$this->visibility}, max-age={$this->duration}"
        );
    }
}
```

## Middleware Priority

Middleware is executed in the order it's registered:

```php
// Execution order: 1 → 2 → 3 → Route → 3 → 2 → 1
$app->middleware(new Middleware1()); // 1
$app->middleware(new Middleware2()); // 2
$app->middleware(new Middleware3()); // 3
```

For route-specific middleware:

```php
// Global middleware runs first, then route middleware
$app->middleware(new GlobalMiddleware());

$app->get('/test', function($req, $res) {
    // Handler
})->middleware(new RouteMiddleware());

// Order: GlobalMiddleware → RouteMiddleware → Handler
```

## Conditional Middleware

Apply middleware based on conditions:

```php
class ConditionalMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        // Only apply to API routes
        if (str_starts_with($request->getUri()->getPath(), '/api/')) {
            // Apply middleware logic
            $request = $request->withHeader('X-API-Request', 'true');
        }

        return $handler->handle($request);
    }
}
```

## Middleware Best Practices

1. **Keep middleware focused**: Each middleware should have a single responsibility
2. **Order matters**: Register middleware in the correct order
3. **Early returns**: Return early for error conditions to avoid unnecessary processing
4. **Immutable requests**: Always create new request instances instead of modifying
5. **Use attributes**: Store middleware data in request attributes
6. **Handle exceptions**: Catch and handle exceptions appropriately

## Example: Custom Auth Middleware

Here's a complete example of JWT authentication middleware:

```php
namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class JwtAuthMiddleware implements MiddlewareInterface
{
    private string $secret;
    private array $except = [];

    public function __construct(string $secret, array $except = [])
    {
        $this->secret = $secret;
        $this->except = $except;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Check if route is excluded
        $path = $request->getUri()->getPath();
        foreach ($this->except as $pattern) {
            if (fnmatch($pattern, $path)) {
                return $handler->handle($request);
            }
        }

        // Extract token
        $token = $this->extractToken($request);
        if (!$token) {
            return $this->unauthorizedResponse('Token not provided');
        }

        try {
            // Decode token
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));

            // Add user to request
            $request = $request->withAttribute('user', $decoded->user);
            $request = $request->withAttribute('token', $decoded);

            return $handler->handle($request);
        } catch (\Exception $e) {
            return $this->unauthorizedResponse('Invalid token');
        }
    }

    private function extractToken(ServerRequestInterface $request): ?string
    {
        $header = $request->getHeaderLine('Authorization');

        if (preg_match('/Bearer\s+(.+)/', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function unauthorizedResponse(string $message): ResponseInterface
    {
        return new JsonResponse([
            'error' => $message
        ], 401);
    }
}

// Usage
$app->middleware(new JwtAuthMiddleware($_ENV['JWT_SECRET'], [
    '/login',
    '/register',
    '/public/*'
]));
```
