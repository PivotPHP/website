---
layout: docs
title: Routing
permalink: /docs/routing/
---

PivotPHP provides an Express.js-like routing system that's intuitive and powerful. Routes are defined using HTTP verb methods on the application instance.

## Basic Routing

The most basic route accepts a URI and a closure:

```php
$app->get('/', function($request, $response) {
    return $response->send('Hello World!');
});
```

### Available Router Methods

PivotPHP supports all standard HTTP verbs:

```php
$app->get($uri, $callback);
$app->post($uri, $callback);
$app->put($uri, $callback);
$app->patch($uri, $callback);
$app->delete($uri, $callback);
$app->options($uri, $callback);
$app->head($uri, $callback);
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

Capture segments of the URI using route parameters:

```php
$app->get('/user/{id}', function($req, $res) {
    $userId = $req->param('id');
    return $res->json(['user_id' => $userId]);
});
```

You can have multiple parameters:

```php
$app->get('/posts/{year}/{month}/{slug}', function($req, $res) {
    $year = $req->param('year');
    $month = $req->param('month');
    $slug = $req->param('slug');

    // Find post by year, month, and slug
});
```

### Optional Parameters

Make a parameter optional by adding a `?`:

```php
$app->get('/posts/{id?}', function($req, $res) {
    $id = $req->param('id', 'latest'); // Default to 'latest'

    if ($id === 'latest') {
        // Return latest posts
    } else {
        // Return specific post
    }
});
```

### Regular Expression Constraints

You can constrain route parameters using regular expressions:

```php
// Only match numeric IDs
$app->get('/user/{id:[0-9]+}', function($req, $res) {
    // $id is guaranteed to be numeric
});

// Match specific pattern
$app->get('/posts/{slug:[a-z0-9-]+}', function($req, $res) {
    // $slug matches lowercase letters, numbers, and hyphens
});

// UUID pattern
$app->get('/api/v1/resources/{uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}', function($req, $res) {
    // Matches UUID format
});
```

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
$app->get('/users/{id}', [UserController::class, 'show']);
$app->put('/users/{id}', [UserController::class, 'update']);
$app->delete('/users/{id}', [UserController::class, 'destroy']);

// RESTful resource controller
$app->resource('/posts', PostController::class);
```

The `resource` method creates the following routes:

| Verb | URI | Action | Route Name |
|------|-----|--------|------------|
| GET | /posts | index | posts.index |
| GET | /posts/create | create | posts.create |
| POST | /posts | store | posts.store |
| GET | /posts/{id} | show | posts.show |
| GET | /posts/{id}/edit | edit | posts.edit |
| PUT/PATCH | /posts/{id} | update | posts.update |
| DELETE | /posts/{id} | destroy | posts.destroy |

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
