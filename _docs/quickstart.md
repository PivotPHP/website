---
layout: docs
title: Quick Start
permalink: /docs/quickstart/
---

This guide will walk you through creating your first PivotPHP application. We'll build a simple REST API for managing tasks.

<div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid rgba(59, 130, 246, 0.8); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
  <strong>ℹ️ Development Status</strong><br>
  PivotPHP is ideal for local development and API concept validation. The framework is under active development with new features being added regularly.
</div>

## Step 1: Create Your Application

First, create a new file `public/index.php`:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;

// Create the application instance
$app = new Application();

// Define your first route
$app->get('/', function($request, $response) {
    return $response->json([
        'message' => 'Welcome to PivotPHP!',
        'timestamp' => time()
    ]);
});

// Run the application
$app->run();
```

## Step 2: Start the Development Server

Run the built-in PHP development server:

```bash
php -S localhost:8000 -t public
```

Visit `http://localhost:8000` in your browser. You should see a JSON response.

## Step 3: Add More Routes

Let's create a simple task management API:

```php
// In-memory task storage (for demo purposes)
$tasks = [];

// List all tasks
$app->get('/tasks', function($req, $res) use (&$tasks) {
    return $res->json($tasks);
});

// Get a specific task
$app->get('/tasks/:id', function($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->status(404)->json([
            'error' => 'Task not found'
        ]);
    }

    return $res->json($tasks[$id]);
});

// Create a new task
$app->post('/tasks', function($req, $res) use (&$tasks) {
    $data = $req->body();

    // Simple validation
    if (empty($data['title'])) {
        return $res->status(400)->json([
            'error' => 'Title is required'
        ]);
    }

    $id = uniqid();
    $task = [
        'id' => $id,
        'title' => $data['title'],
        'completed' => false,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $tasks[$id] = $task;

    return $res->status(201)->json($task);
});

// Update a task
$app->put('/tasks/:id', function($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->status(404)->json([
            'error' => 'Task not found'
        ]);
    }

    $data = $req->body();
    $tasks[$id] = array_merge($tasks[$id], $data);

    return $res->json($tasks[$id]);
});

// Delete a task
$app->delete('/tasks/:id', function($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->status(404)->json([
            'error' => 'Task not found'
        ]);
    }

    unset($tasks[$id]);

    return $res->status(204)->send();
});
```

## Step 4: Add Middleware

Let's add some middleware for logging and CORS:

```php
// Logging middleware
$app->middleware(function($req, $handler) {
    $start = microtime(true);

    // Process the request
    $response = $handler->handle($req);

    // Log the request
    $duration = round((microtime(true) - $start) * 1000, 2);
    error_log(sprintf(
        "%s %s - %dms",
        $req->getMethod(),
        $req->getUri()->getPath(),
        $duration
    ));

    return $response;
});

// CORS middleware
$app->middleware(function($req, $handler) {
    $response = $handler->handle($req);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type');
});
```

## Step 5: Test Your API

You can test your API using curl or any HTTP client:

```bash
# Create a task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn PivotPHP"}'

# List all tasks
curl http://localhost:8000/tasks

# Update a task
curl -X PUT http://localhost:8000/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a task
curl -X DELETE http://localhost:8000/tasks/{id}
```

## Complete Example

Here's the complete code for reference:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;

$app = new Application();

// Middleware
$app->middleware(function($req, $handler) {
    $start = microtime(true);
    $response = $handler->handle($req);
    $duration = round((microtime(true) - $start) * 1000, 2);
    error_log(sprintf("%s %s - %dms", $req->getMethod(), $req->getUri()->getPath(), $duration));
    return $response;
});

$app->middleware(function($req, $handler) {
    $response = $handler->handle($req);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type');
});

// Routes
$tasks = [];

$app->get('/', function($req, $res) {
    return $res->json(['message' => 'Task API', 'version' => '1.0']);
});

$app->get('/tasks', function($req, $res) use (&$tasks) {
    return $res->json(array_values($tasks));
});

$app->get('/tasks/{id}', function($req, $res) use (&$tasks) {
    $id = $req->param('id');
    if (!isset($tasks[$id])) {
        return $res->status(404)->json(['error' => 'Task not found']);
    }
    return $res->json($tasks[$id]);
});

$app->post('/tasks', function($req, $res) use (&$tasks) {
    $data = $req->body();
    if (empty($data['title'])) {
        return $res->status(400)->json(['error' => 'Title is required']);
    }

    $id = uniqid();
    $task = [
        'id' => $id,
        'title' => $data['title'],
        'completed' => false,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $tasks[$id] = $task;
    return $res->status(201)->json($task);
});

$app->put('/tasks/{id}', function($req, $res) use (&$tasks) {
    $id = $req->param('id');
    if (!isset($tasks[$id])) {
        return $res->status(404)->json(['error' => 'Task not found']);
    }

    $tasks[$id] = array_merge($tasks[$id], $req->body());
    return $res->json($tasks[$id]);
});

$app->delete('/tasks/{id}', function($req, $res) use (&$tasks) {
    $id = $req->param('id');
    if (!isset($tasks[$id])) {
        return $res->status(404)->json(['error' => 'Task not found']);
    }

    unset($tasks[$id]);
    return $res->status(204)->send();
});

$app->run();
```

## What's Next?

Congratulations! You've built your first PivotPHP application. To learn more:

- Explore [Routing]({{ site.baseurl }}/docs/routing/) for advanced routing features
- Learn about [Middleware]({{ site.baseurl }}/docs/middleware/) for request processing
- Understand [Service Container]({{ site.baseurl }}/docs/container/) for dependency injection
- Check out [Database]({{ site.baseurl }}/docs/database/) integration with Cycle ORM
