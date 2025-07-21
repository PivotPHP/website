---
layout: docs
title: Routing
permalink: /docs/routing/
---

PivotPHP v1.1.4 provides an Express.js-like routing system that's intuitive and powerful, with revolutionary performance and PHP 8.4+ array callable support. Routes are defined using HTTP verb methods on the application instance.

## Performance Highlights

- **🚀 Route Registration**: 20,742 ops/sec (exceptional performance)
- **💫 Array Callable**: PHP 8.4+ compatible syntax with 28,624 ops/sec
- **⚡ Parameter Matching**: Advanced constraint validation
- **🎯 Zero Overhead**: Optimized routing with object pooling

## Basic Routing

The most basic route accepts a URI and a closure:

```php
$app->get('/', function($request, $response) {
    return $response->send('Hello World!');
});
```

### Available Router Methods

PivotPHP v1.1.4 supports all standard HTTP verbs with enhanced performance:

```php
$app->get($uri, $callback);
$app->post($uri, $callback);
$app->put($uri, $callback);
$app->patch($uri, $callback);
$app->delete($uri, $callback);
$app->options($uri, $callback);
$app->head($uri, $callback);
```

### NEW: Array Callable Support (v1.1.4)

PHP 8.4+ compatible array callable syntax with 28,624 ops/sec performance:

```php
// Array callable with class (NEW in v1.1.4)
$app->get('/users', [UserController::class, 'index']);
$app->post('/users', [UserController::class, 'store']);
$app->put('/users/:id', [UserController::class, 'update']);
$app->delete('/users/:id', [UserController::class, 'destroy']);

// With instance
$controller = new UserController();
$app->get('/profile', [$controller, 'profile']);
```

### ❌ NOT Supported
```php
// String format Controller@method - DOES NOT WORK!
$app->get('/users', 'UserController@index'); // TypeError!
```

You can also match multiple verbs using the `match` method:

```php
$app->match(['get', 'post'], '/contact', function($req, $res) {
    // Handle GET or POST
});
```

Or respond to all HTTP verbs using the `any` method:

```php
$app->any('/api/*', function($req, $res) {
    // Handle any HTTP verb
});
```

## Route Parameters

### Required Parameters

PivotPHP uses **Express.js-style** route parameters with the `:param` syntax:

```php
$app->get('/user/:id', function($req, $res) {
    $userId = $req->param('id');
    return $res->json(['user_id' => $userId]);
});
```

You can have multiple parameters:

```php
$app->get('/posts/:year/:month/:slug', function($req, $res) {
    $year = $req->param('year');
    $month = $req->param('month');
    $slug = $req->param('slug');

    // Find post by year, month, and slug
});
```

### Optional Parameters

Optional parameters use the `?` suffix and can have default values:

```php
$app->get('/posts/:id?', function($req, $res) {
    $id = $req->param('id', 'latest'); // Default to 'latest'

    if ($id === 'latest') {
        // Return latest posts
    } else {
        // Return specific post
    }
});
```

### Parameter Constraints (PivotPHP Enhanced)

PivotPHP extends Express.js routing with powerful parameter validation using the `<constraint>` syntax:

```php
// Only match numeric IDs
$app->get('/user/:id<\d+>', function($req, $res) {
    // $id is guaranteed to be numeric
});

// Or use array callable (v1.1.4)
$app->get('/user/:id<\d+>', [UserController::class, 'show']);

// Use built-in shortcuts (recommended)
$app->get('/users/:id<int>', function($req, $res) {
    // Same as <\d+> but more readable
});

// Match slug pattern
$app->get('/posts/:slug<slug>', function($req, $res) {
    // Matches lowercase letters, numbers, and hyphens
});

// UUID pattern
$app->get('/api/v1/resources/:uuid<uuid>', function($req, $res) {
    // Matches UUID format
});

// Multiple constraints
$app->get('/archive/:year<year>/:month<month>/:day<day>', function($req, $res) {
    return $res->json([
        'year' => $req->param('year'),   // 4-digit year
        'month' => $req->param('month'), // 2-digit month  
        'day' => $req->param('day')      // 2-digit day
    ]);
});

// File extensions with custom patterns
$app->get('/files/:filename<[\w-]+>.:ext<jpg|png|gif|webp>', function($req, $res) {
    return $res->json([
        'filename' => $req->param('filename'),
        'extension' => $req->param('ext')
    ]);
});
```

#### Built-in Constraint Shortcuts

| Shortcut | Pattern | Description | Example |
|----------|---------|-------------|----------|
| `int` | `\d+` | One or more digits | `:id<int>` |
| `slug` | `[a-z0-9-]+` | URL-safe slug | `:slug<slug>` |
| `alpha` | `[a-zA-Z]+` | Letters only | `:name<alpha>` |
| `alnum` | `[a-zA-Z0-9]+` | Letters and numbers | `:code<alnum>` |
| `uuid` | `[a-f0-9]{8}-[a-f0-9]{4}-...` | UUID format | `:id<uuid>` |
| `date` | `\d{4}-\d{2}-\d{2}` | YYYY-MM-DD | `:date<date>` |
| `year` | `\d{4}` | 4-digit year | `:year<year>` |
| `month` | `\d{2}` | 2-digit month | `:month<month>` |
| `day` | `\d{2}` | 2-digit day | `:day<day>` |

#### Advanced Regex Patterns

```php
// API versioning
$app->get('/api/:version<v\d+>/users', function($req, $res) {
    $version = $req->param('version'); // e.g., "v1", "v2"
    return $res->json(['api_version' => $version]);
});

// Email-like patterns
$app->get('/contact/:email<[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+>', function($req, $res) {
    // Basic email validation at route level
});

// Complex path matching with full regex
$app->get('/archive/{^(\d{4})/(\d{2})/(.+)$}', function($req, $res) {
    $captures = $req->captures(); // Array of captured groups
    return $res->json([
        'year' => $captures[0],
        'month' => $captures[1], 
        'slug' => $captures[2]
    ]);
});
```

#### Benefits of Parameter Constraints

1. **Security**: Invalid requests are rejected at routing level
2. **Performance**: No need for manual validation in handlers
3. **Clean Code**: Validation logic is declarative in routes
4. **Early Failure**: Bad requests fail fast without executing handlers
5. **Documentation**: Route constraints serve as inline documentation

## Route Groups

Group related routes to share common attributes like middleware or URL prefixes:

```php
$app->group('/api', function($group) {
    // All routes in this group will be prefixed with /api

    $group->get('/users', function($req, $res) {
        // Matches: GET /api/users
    });

    $group->post('/users', function($req, $res) {
        // Matches: POST /api/users
    });

    // Nested groups
    $group->group('/v1', function($v1) {
        $v1->get('/status', function($req, $res) {
            // Matches: GET /api/v1/status
        });
    });
});
```

### Groups with Middleware

Apply middleware to all routes in a group:

```php
$app->group('/admin', function($group) {
    // All admin routes
})->middleware(['auth', 'admin']);

// Or apply middleware inside the group
$app->group('/api', function($group) {
    $group->middleware('throttle:60,1');

    $group->get('/users', function($req, $res) {
        // Rate limited
    });
});
```

## Controller Routes

Instead of closures, you can use controller classes:

```php
// Single action
$app->get('/users', [UserController::class, 'index']);
$app->post('/users', [UserController::class, 'store']);
$app->get('/users/:id', [UserController::class, 'show']);
$app->put('/users/:id', [UserController::class, 'update']);
$app->delete('/users/:id', [UserController::class, 'destroy']);

// RESTful resource controller
$app->resource('/posts', PostController::class);
```

The `resource` method creates the following routes:

| Verb | URI | Action | Route Name |
|------|-----|--------|------------|
| GET | /posts | index | posts.index |
| GET | /posts/create | create | posts.create |
| POST | /posts | store | posts.store |
| GET | /posts/:id | show | posts.show |
| GET | /posts/:id/edit | edit | posts.edit |
| PUT/PATCH | /posts/:id | update | posts.update |
| DELETE | /posts/:id | destroy | posts.destroy |

## Named Routes

Assign names to routes for easy URL generation:

```php
$app->get('/profile', function($req, $res) {
    // Show profile
})->name('profile');

$app->get('/posts/{id}', function($req, $res) {
    // Show post
})->name('posts.show');

// Generate URLs
$url = route('profile'); // /profile
$url = route('posts.show', ['id' => 123]); // /posts/123
```

## Route Model Binding

Automatically inject model instances into your routes:

```php
// Implicit binding
$app->get('/users/{user}', function($req, $res, User $user) {
    return $res->json($user);
});

// Custom binding
$app->bind('user', function($value) {
    return User::where('slug', $value)->firstOrFail();
});

$app->get('/users/{user}', function($req, $res, User $user) {
    // $user is resolved by slug instead of ID
});
```

## Fallback Routes

Define a fallback route that executes when no other routes match:

```php
$app->fallback(function($req, $res) {
    return $res->status(404)->json([
        'error' => 'Not Found'
    ]);
});
```

## Route Caching

For production, cache your routes for better performance:

```bash
php helix route:cache
```

Clear the route cache when making changes:

```bash
php helix route:clear
```

## Best Practices

1. **Order matters**: Define more specific routes before generic ones
2. **Use route groups**: Organize related routes together
3. **Name your routes**: Makes URL generation easier and more maintainable
4. **Use controllers**: For complex logic, move code to controller classes
5. **Validate parameters**: Use regex constraints to ensure parameter validity
6. **Cache in production**: Always cache routes in production for optimal performance
