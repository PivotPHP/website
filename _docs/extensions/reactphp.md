---
layout: docs
title: ReactPHP Extension
permalink: /docs/extensions/reactphp/
---

ReactPHP provides a high-performance continuous runtime for PivotPHP applications using an event-driven, non-blocking I/O model. This extension allows your application to run continuously without restarting between requests, dramatically improving performance.

## Installation

```bash
composer require pivotphp/reactphp
```

## Features

- **Continuous Runtime**: Keep your application in memory between requests
- **Event-Driven Architecture**: Non-blocking I/O for handling concurrent requests
- **PSR-7 Compatible**: Full compatibility with PivotPHP's PSR-7 implementation
- **High Performance**: Eliminate bootstrap overhead for each request
- **Async Support**: Built-in support for promises and async operations
- **WebSocket Ready**: Foundation for real-time communication (coming soon)

## Configuration

Register the ReactPHP service provider in your application:

```php
use PivotPHP\ReactPHP\ReactServiceProvider;

$app->register(new ReactServiceProvider([
    'server' => [
        'host' => '0.0.0.0',
        'port' => 8080,
        'workers' => 4 // Optional: number of worker processes
    ],
    'options' => [
        'max_request_size' => '10M',
        'timeout' => 30
    ]
]));
```

## Basic Usage

### Running the Async Server

Instead of using the traditional `$app->run()`, use the async runner:

```php
// Traditional synchronous server
// $app->run();

// ReactPHP async server
$app->runAsync();
```

This starts a continuous HTTP server that keeps your application in memory.

### Async Route Handlers

ReactPHP allows you to use async handlers with promises:

```php
use React\Promise\Promise;

$app->get('/async-data', function($req, $res) {
    return new Promise(function($resolve) use ($res) {
        // Simulate async operation
        \React\EventLoop\Loop::get()->addTimer(0.5, function() use ($resolve, $res) {
            $resolve($res->json(['data' => 'Loaded asynchronously!']));
        });
    });
});
```

### Database Operations

Combine with async database drivers for non-blocking queries:

```php
$app->get('/users', function($req, $res) use ($db) {
    return $db->query('SELECT * FROM users')
        ->then(function($users) use ($res) {
            return $res->json($users);
        });
});
```

## Advanced Features

### Event Loop Access

Access the ReactPHP event loop for advanced async operations:

```php
use React\EventLoop\Loop;

$app->get('/delayed-response', function($req, $res) {
    $loop = Loop::get();
    
    $loop->addTimer(2, function() use ($res) {
        $res->json(['message' => 'Response after 2 seconds']);
    });
    
    return $res->async(); // Indicate async response
});
```

### Periodic Tasks

Schedule tasks to run periodically:

```php
use React\EventLoop\Loop;

// Run cleanup every 60 seconds
Loop::get()->addPeriodicTimer(60, function() {
    // Cleanup temporary files
    cleanupTempFiles();
});
```

### Stream Processing

Handle file uploads and downloads efficiently:

```php
$app->post('/upload', function($req, $res) {
    $body = $req->getBody();
    
    if ($body instanceof \React\Stream\ReadableStreamInterface) {
        $output = new \React\Stream\WritableResourceStream(
            fopen('uploads/file.dat', 'w'),
            Loop::get()
        );
        
        $body->pipe($output);
        
        $output->on('close', function() use ($res) {
            $res->json(['status' => 'uploaded']);
        });
    }
    
    return $res->async();
});
```

## Performance Considerations

### Memory Management

Since the application stays in memory, proper cleanup is essential:

```php
// Clear caches periodically
Loop::get()->addPeriodicTimer(300, function() use ($app) {
    $app->getContainer()->get('cache')->clear();
    gc_collect_cycles();
});
```

### Connection Pooling

ReactPHP works well with connection pooling:

```php
$app->register(new DatabasePoolProvider([
    'min_connections' => 5,
    'max_connections' => 20
]));
```

## WebSocket Support (Coming Soon)

Future versions will include WebSocket support:

```php
// Coming in v1.0
$ws = $app->websocket('/ws');

$ws->on('connection', function($client) {
    $client->on('message', function($msg) use ($client) {
        $client->send('Echo: ' . $msg);
    });
});
```

## Running in Production

### Using Supervisor

Create a supervisor configuration:

```ini
[program:pivotphp-reactphp]
command=php /path/to/app/server.php
autostart=true
autorestart=true
stderr_logfile=/var/log/pivotphp-reactphp.err.log
stdout_logfile=/var/log/pivotphp-reactphp.out.log
```

### Using PM2

For Node.js-style process management:

```json
{
  "apps": [{
    "name": "pivotphp-app",
    "script": "server.php",
    "interpreter": "php",
    "instances": 4,
    "exec_mode": "cluster"
  }]
}
```

## Troubleshooting

### High Memory Usage

Monitor and limit memory usage:

```php
Loop::get()->addPeriodicTimer(10, function() {
    $memory = memory_get_usage(true) / 1024 / 1024;
    if ($memory > 500) { // 500MB limit
        error_log("High memory usage: {$memory}MB");
        // Trigger cleanup or restart
    }
});
```

### Connection Limits

Increase system limits for production:

```bash
# Increase file descriptor limits
ulimit -n 65536

# Update system limits
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf
```

## Best Practices

1. **Stateless Design**: Keep request handlers stateless
2. **Resource Cleanup**: Always close resources (files, connections)
3. **Error Handling**: Implement proper error boundaries
4. **Monitoring**: Use health checks and metrics
5. **Graceful Shutdown**: Handle signals properly

```php
// Graceful shutdown
$loop = Loop::get();
$loop->addSignal(SIGTERM, function() use ($app, $loop) {
    $app->shutdown();
    $loop->stop();
});
```

## Example Application

Complete example server:

```php
<?php
require 'vendor/autoload.php';

use PivotPHP\Core\Application;
use PivotPHP\ReactPHP\ReactServiceProvider;

$app = new Application();

// Register ReactPHP
$app->register(new ReactServiceProvider([
    'server' => ['port' => 8080]
]));

// Routes
$app->get('/', fn($req, $res) => $res->json(['status' => 'running']));

$app->get('/health', fn($req, $res) => $res->json([
    'status' => 'healthy',
    'memory' => memory_get_usage(true),
    'uptime' => time() - $_SERVER['REQUEST_TIME']
]));

// Start async server
echo "Server running on http://localhost:8080\n";
$app->runAsync();
```

## Resources

- [ReactPHP Documentation](https://reactphp.org/)
- [PivotPHP ReactPHP GitHub](https://github.com/pivotphp/pivotphp-reactphp)
- [Async PHP Guide](https://sergeyzhuk.me/reactphp-series)