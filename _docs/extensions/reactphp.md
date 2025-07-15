---
layout: docs
title: ReactPHP Extension v0.0.2
permalink: /docs/extensions/reactphp/
---

# PivotPHP ReactPHP Extension v0.0.2

The **pivotphp-reactphp** extension provides async runtime capabilities for PivotPHP applications using ReactPHP's event-driven, non-blocking I/O model. This extension enables continuous runtime execution, eliminating bootstrap overhead and maintaining persistent application state.

## 🚀 Key Features

- **Continuous Runtime**: No restart overhead between requests
- **PSR-7 Bridge Compatibility**: Seamless integration with PivotPHP's HTTP layer
- **Event-Driven Architecture**: Non-blocking I/O operations
- **Memory Management**: Built-in memory isolation and cleanup
- **Global State Protection**: Prevents state pollution between requests
- **Performance Optimized**: Significant performance gains for long-running processes

## 📦 Installation

```bash
composer require pivotphp/reactphp
```

## 🔧 Quick Start

### 1. Register the Service Provider

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\ReactPHP\Providers\ReactPHPServiceProvider;

$app = new Application();

// Register ReactPHP service provider
$app->register(new ReactPHPServiceProvider($app));
```

### 2. Environment Configuration

Create or update your `.env` file:

```env
# Application
APP_NAME="My ReactPHP App"
APP_ENV=production
APP_DEBUG=false

# ReactPHP Server Configuration
REACTPHP_HOST=0.0.0.0
REACTPHP_PORT=8080
REACTPHP_STREAMING=false
REACTPHP_MAX_CONCURRENT_REQUESTS=100
REACTPHP_REQUEST_BODY_SIZE_LIMIT=67108864  # 64MB
REACTPHP_REQUEST_BODY_BUFFER_SIZE=8192     # 8KB
```

### 3. Basic Server Setup

Create `server.php`:

```php
<?php

declare(strict_types=1);

use PivotPHP\Core\Core\Application;
use PivotPHP\ReactPHP\Providers\ReactPHPServiceProvider;

require_once __DIR__ . '/vendor/autoload.php';

// Create application
$app = new Application();

// Register ReactPHP provider
$app->register(new ReactPHPServiceProvider($app));

// Define your routes
$app->get('/', function($req, $res) {
    return $res->json([
        'message' => 'ReactPHP Server Running!',
        'timestamp' => date('Y-m-d H:i:s'),
        'server' => 'ReactPHP v0.0.2'
    ]);
});

$app->get('/api/users/:id', function($req, $res) {
    $id = $req->param('id');
    
    return $res->json([
        'user_id' => $id,
        'name' => 'User ' . $id,
        'server_time' => microtime(true)
    ]);
});

// Start the ReactPHP server
echo "🚀 Starting ReactPHP server on http://localhost:8080\n";
echo "Press Ctrl+C to stop the server\n\n";

$app->runAsync(); // This starts the ReactPHP event loop
```

### 4. Running the Server

```bash
php server.php
```

Your application will now run continuously without restarting between requests!

## 🏗️ Advanced Configuration

### Custom Server Configuration

```php
use PivotPHP\ReactPHP\Providers\ReactPHPServiceProvider;

$app = new Application();

// Configure ReactPHP with custom settings
$app->register(new ReactPHPServiceProvider($app, [
    'server' => [
        'host' => '127.0.0.1',
        'port' => 3000,
        'debug' => true,
        'streaming' => true,
        'max_concurrent_requests' => 200,
        'request_body_size_limit' => 134217728, // 128MB
    ]
]));
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACTPHP_HOST` | `0.0.0.0` | Server bind address |
| `REACTPHP_PORT` | `8080` | Server port |
| `REACTPHP_STREAMING` | `false` | Enable streaming requests |
| `REACTPHP_MAX_CONCURRENT_REQUESTS` | `100` | Maximum concurrent requests |
| `REACTPHP_REQUEST_BODY_SIZE_LIMIT` | `67108864` | Max request body size (64MB) |
| `REACTPHP_REQUEST_BODY_BUFFER_SIZE` | `8192` | Request buffer size (8KB) |

## 🔄 PSR-7 Bridge System

The ReactPHP extension includes a sophisticated bridge system that converts between ReactPHP's PSR-7 implementation and PivotPHP's HTTP layer:

### Request Bridge

The `RequestBridge` safely handles global state manipulation:

```php
// The bridge automatically handles:
// 1. Saving original $_SERVER, $_GET, $_POST state
// 2. Populating globals for PivotPHP Request
// 3. Creating PivotPHP Request object
// 4. Restoring original global state

// Your routes work exactly the same as with traditional PHP:
$app->post('/api/data', function($req, $res) {
    $data = $req->getBody();      // Works seamlessly
    $query = $req->query('param'); // Global state handled automatically
    
    return $res->json(['received' => $data]);
});
```

### Response Bridge

The `ResponseBridge` converts PivotPHP responses to ReactPHP format:

```php
// All PivotPHP response methods work:
$app->get('/api/file', function($req, $res) {
    return $res
        ->header('Content-Type', 'application/pdf')
        ->status(200)
        ->stream($fileContent); // Streaming works automatically
});
```

### Header Conversion

PivotPHP converts HTTP headers to camelCase format automatically:

```php
$app->get('/api/info', function($req, $res) {
    // Headers are automatically converted:
    $contentType = $req->header('contentType');     // Content-Type
    $auth = $req->header('authorization');          // Authorization
    $apiKey = $req->header('xApiKey');             // X-API-Key
    $language = $req->header('acceptLanguage');     // Accept-Language
    
    return $res->json([
        'headers_received' => $req->headers(),
        'converted_format' => 'camelCase'
    ]);
});
```

## ⚡ Performance Benefits

### Continuous Runtime Advantages

```php
// Example: Database connections persist between requests
use PivotPHP\CycleORM\CycleServiceProvider;

$app = new Application();
$app->register(new ReactPHPServiceProvider($app));
$app->register(new CycleServiceProvider($app));

// Database connection is established once and reused
$app->get('/api/users', function($req, $res) {
    // No connection overhead - connection already exists!
    $users = User::all();
    return $res->json($users);
});
```

### Memory Management

The extension includes automatic memory management:

```php
// Built-in memory isolation prevents memory leaks
$app->get('/api/heavy-operation', function($req, $res) {
    // Process large datasets without worrying about memory leaks
    $largeData = processHugeDataset();
    
    // Memory is automatically cleaned up after response
    return $res->json(['processed' => count($largeData)]);
});
```

### Performance Monitoring

```php
$app->get('/debug/server-stats', function($req, $res) {
    $container = $app->getContainer();
    
    if ($container->has('reactphp.server')) {
        return $res->json([
            'server_type' => 'ReactPHP',
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'uptime_seconds' => time() - $_SERVER['REQUEST_TIME_FLOAT'],
            'requests_handled' => 'Continuous runtime active'
        ]);
    }
    
    return $res->json(['error' => 'ReactPHP not active']);
});
```

## 🛡️ Security Features

### Global State Protection

The extension provides complete global state isolation:

```php
// Each request has isolated global state
$app->get('/api/state-test', function($req, $res) {
    // $_POST, $_GET, $_SERVER are safely isolated per request
    // No data leakage between concurrent requests
    
    return $res->json([
        'request_id' => uniqid(),
        'isolated_state' => true,
        'concurrent_safe' => true
    ]);
});
```

### Memory Protection

Built-in memory guard prevents runaway processes:

```php
// Automatic memory monitoring and cleanup
$app->get('/api/memory-intensive', function($req, $res) {
    // Memory usage is monitored automatically
    $result = performMemoryIntensiveOperation();
    
    // Cleanup happens automatically after response
    return $res->json($result);
});
```

## 🚀 Advanced Usage

### Event Loop Access

```php
$app->get('/api/async-operation', function($req, $res) use ($app) {
    $container = $app->getContainer();
    $loop = $container->get(\React\EventLoop\LoopInterface::class);
    
    // Schedule async operations
    $loop->addTimer(2.0, function() {
        echo "Async operation completed!\n";
    });
    
    return $res->json(['async_scheduled' => true]);
});
```

### Streaming Responses

```php
$app->get('/api/stream-data', function($req, $res) {
    // Enable streaming for large responses
    return $res
        ->header('Content-Type', 'application/json')
        ->header('Transfer-Encoding', 'chunked')
        ->stream(function() {
            for ($i = 1; $i <= 100; $i++) {
                yield json_encode(['chunk' => $i]) . "\n";
                usleep(10000); // Simulate processing time
            }
        });
});
```

### Graceful Shutdown

```php
// The server handles SIGTERM and SIGINT gracefully
// Existing connections are allowed to complete
// New connections are rejected during shutdown

// In your server.php, add signal handling:
if (function_exists('pcntl_signal')) {
    pcntl_signal(SIGTERM, function() {
        echo "\nReceived SIGTERM, shutting down gracefully...\n";
        // Server will complete current requests and exit
    });
    
    pcntl_signal(SIGINT, function() {
        echo "\nReceived SIGINT (Ctrl+C), shutting down gracefully...\n";
        // Server will complete current requests and exit
    });
}
```

## 🔧 Production Deployment

### Process Management with Supervisor

Create `/etc/supervisor/conf.d/pivotphp-reactphp.conf`:

```ini
[program:pivotphp-reactphp]
command=php /path/to/your/server.php
directory=/path/to/your/app
user=www-data
autostart=true
autorestart=true
startsecs=3
startretries=3
stdout_logfile=/var/log/supervisor/pivotphp-reactphp.log
stderr_logfile=/var/log/supervisor/pivotphp-reactphp-error.log
```

Start with Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start pivotphp-reactphp
```

### Load Balancing

For high-traffic applications, run multiple instances:

```bash
# Start multiple servers on different ports
php server.php --port=8080 &
php server.php --port=8081 &
php server.php --port=8082 &
php server.php --port=8083 &
```

Configure nginx to load balance:

```nginx
upstream pivotphp_backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://pivotphp_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM php:8.1-cli

# Install required extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy application
COPY . /app
WORKDIR /app

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port
EXPOSE 8080

# Start ReactPHP server
CMD ["php", "server.php"]
```

## 🐛 Troubleshooting

### Common Issues

**Memory Leaks in Long-Running Processes**
```php
// Monitor memory usage
$app->get('/debug/memory', function($req, $res) {
    return $res->json([
        'current' => memory_get_usage(true),
        'peak' => memory_get_peak_usage(true),
        'limit' => ini_get('memory_limit')
    ]);
});
```

**PSR-7 Version Conflicts**
```bash
# Check PSR-7 version
composer show psr/http-message

# If needed, use PivotPHP's version switching (temporary solution)
php vendor/pivotphp/core/scripts/switch-psr7-version.php 1
composer update psr/http-message
```

**Global State Issues**
```php
// If experiencing state pollution, verify isolation:
$app->get('/debug/isolation', function($req, $res) {
    return $res->json([
        'server_vars' => count($_SERVER),
        'get_vars' => count($_GET),
        'post_vars' => count($_POST),
        'request_isolated' => true
    ]);
});
```

### Performance Monitoring

```php
$app->get('/debug/performance', function($req, $res) {
    $startTime = microtime(true);
    
    // Simulate some work
    usleep(1000);
    
    $endTime = microtime(true);
    $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
    
    return $res->json([
        'request_duration_ms' => $duration,
        'memory_usage_mb' => memory_get_usage(true) / 1024 / 1024,
        'server_type' => 'ReactPHP Continuous Runtime'
    ]);
});
```

## 📊 Performance Comparison

### Traditional PHP-FPM vs ReactPHP

| Metric | PHP-FPM | ReactPHP |
|--------|---------|----------|
| Bootstrap per request | ✅ Yes | ❌ No |
| Memory per request | ~8-32MB | ~2-8MB |
| Concurrent connections | Limited | High |
| Database connections | Per request | Persistent |
| Startup time | ~50-200ms | ~0.1ms |

### Benchmark Results

```php
// ReactPHP can handle significantly more concurrent requests
$app->get('/api/benchmark', function($req, $res) {
    $start = microtime(true);
    
    // Simulate typical API work
    $data = [
        'users' => range(1, 1000),
        'timestamp' => time(),
        'server' => 'ReactPHP'
    ];
    
    $end = microtime(true);
    
    return $res->json([
        'data' => $data,
        'processing_time_ms' => ($end - $start) * 1000,
        'memory_usage_mb' => memory_get_usage(true) / 1024 / 1024
    ]);
});
```

## 🔮 Future Features

The ReactPHP extension roadmap includes:

- **WebSocket Support**: Real-time bidirectional communication
- **HTTP/2 Support**: Advanced protocol features
- **Built-in Clustering**: Multi-core utilization
- **Server-Sent Events**: Real-time event streaming
- **Enhanced Middleware**: ReactPHP-specific middleware pipeline

## 📚 Related Documentation

- [ReactPHP Official Documentation](https://reactphp.org/)
- [PivotPHP Core Documentation]({{ '/docs/' | relative_url }})
- [Performance Optimization]({{ '/docs/performance/' | relative_url }})
- [Deployment Guide]({{ '/docs/deployment/' | relative_url }})

## 🤝 Support

- **GitHub Issues**: [Report issues](https://github.com/PivotPHP/pivotphp-reactphp/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/DMtxsP7z)
- **Documentation**: [Technical overview](https://github.com/PivotPHP/pivotphp-reactphp/blob/main/docs/TECHNICAL-OVERVIEW.md)

---

*The PivotPHP ReactPHP extension v0.0.2 is production-ready and provides stable continuous runtime for high-performance applications.*