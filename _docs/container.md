---
layout: docs
title: Service Container
permalink: /docs/container/
---

# Service Container

The HelixPHP service container is a powerful tool for managing class dependencies and performing dependency injection. It's essentially a sophisticated factory that creates and manages object instances for your application.

## Introduction to Dependency Injection

Dependency injection is a technique where an object receives its dependencies rather than creating them itself. This leads to more flexible, testable, and maintainable code.

```php
// Without dependency injection
class UserController
{
    public function index()
    {
        $db = new Database(); // Hard dependency
        $users = $db->query('SELECT * FROM users');
        return json_encode($users);
    }
}

// With dependency injection
class UserController
{
    private Database $db;
    
    public function __construct(Database $db)
    {
        $this->db = $db; // Injected dependency
    }
    
    public function index()
    {
        $users = $this->db->query('SELECT * FROM users');
        return json_encode($users);
    }
}
```

## Basic Usage

### Binding

Register bindings in the container:

```php
// Simple binding
$app->bind('database', function($container) {
    return new Database(
        $_ENV['DB_HOST'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    );
});

// Class binding
$app->bind(Database::class, function($container) {
    return new MySQLDatabase(config('database'));
});

// Interface to implementation binding
$app->bind(
    UserRepositoryInterface::class,
    UserRepository::class
);
```

### Resolving

Retrieve instances from the container:

```php
// Using make
$db = $app->make('database');
$db = $app->make(Database::class);

// Using array access
$db = $app['database'];

// Using helper function
$db = app('database');
$db = app(Database::class);
```

### Singleton Binding

Create shared instances that are only resolved once:

```php
// Singleton binding
$app->singleton('cache', function($container) {
    return new CacheManager(
        $container->make('redis')
    );
});

// The same instance is returned every time
$cache1 = $app->make('cache');
$cache2 = $app->make('cache');
// $cache1 === $cache2 (true)
```

### Instance Binding

Bind an existing instance:

```php
$api = new ApiClient($_ENV['API_KEY']);
$app->instance('api', $api);

// Or bind the instance directly
$app->instance(ApiClient::class, new ApiClient($_ENV['API_KEY']));
```

## Automatic Resolution

The container can automatically resolve classes and their dependencies:

```php
class UserRepository
{
    private Database $db;
    
    public function __construct(Database $db)
    {
        $this->db = $db;
    }
}

class UserController
{
    private UserRepository $repository;
    
    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }
}

// The container automatically creates all dependencies
$controller = $app->make(UserController::class);
```

## Method Injection

Inject dependencies into method calls:

```php
class UserController
{
    public function show(Request $request, UserRepository $users, $id)
    {
        $user = $users->find($id);
        return response()->json($user);
    }
}

// Call method with dependency injection
$response = $app->call([UserController::class, 'show'], ['id' => 123]);
```

## Contextual Binding

Give different implementations based on context:

```php
// When UserController needs a Cache, give it RedisCache
$app->when(UserController::class)
    ->needs(Cache::class)
    ->give(RedisCache::class);

// When AdminController needs a Cache, give it FileCache
$app->when(AdminController::class)
    ->needs(Cache::class)
    ->give(FileCache::class);

// With closure
$app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(function($container) {
        return Storage::disk('photos');
    });
```

## Binding Primitives

Inject primitive values like strings or integers:

```php
$app->when(Service::class)
    ->needs('$apiKey')
    ->give($_ENV['API_KEY']);

$app->when(Mailer::class)
    ->needs('$options')
    ->give([
        'host' => $_ENV['MAIL_HOST'],
        'port' => $_ENV['MAIL_PORT']
    ]);

class Service
{
    private string $apiKey;
    
    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }
}
```

## Tagged Bindings

Group related bindings with tags:

```php
// Tag multiple bindings
$app->bind('reports.daily', DailyReport::class);
$app->bind('reports.weekly', WeeklyReport::class);
$app->bind('reports.monthly', MonthlyReport::class);

$app->tag([
    'reports.daily',
    'reports.weekly',
    'reports.monthly'
], 'reports');

// Resolve all tagged bindings
$reports = $app->tagged('reports');

foreach ($reports as $report) {
    $report->generate();
}
```

## Service Providers

Organize your bindings in service providers:

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container
     */
    public function register(): void
    {
        $this->app->singleton(Cache::class, function($app) {
            return new RedisCache(
                $app->make('redis.connection')
            );
        });
        
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );
    }
    
    /**
     * Bootstrap any application services
     */
    public function boot(): void
    {
        // Perform actions after all services are registered
        $cache = $this->app->make(Cache::class);
        $cache->flush();
    }
}
```

## Container Events

Listen to resolution events:

```php
// Before resolving
$app->resolving(Database::class, function($db, $app) {
    // Configure database before it's returned
    $db->setTimezone('UTC');
});

// After resolving
$app->afterResolving(Logger::class, function($logger, $app) {
    // Add handlers after logger is created
    $logger->pushHandler(new StreamHandler('path/to/log'));
});

// Global resolving callback
$app->resolving(function($object, $app) {
    // Called for every resolution
});
```

## Extending Bindings

Extend resolved services:

```php
$app->extend(Database::class, function($db, $app) {
    // Add query logging
    $db->enableQueryLog();
    
    $db->listen(function($query) use ($app) {
        $app->make('logger')->info($query);
    });
    
    return $db;
});
```

## Factory Pattern

Create factories for complex object creation:

```php
interface ReportFactory
{
    public function create(string $type): Report;
}

class ReportFactoryImpl implements ReportFactory
{
    private Container $container;
    
    public function __construct(Container $container)
    {
        $this->container = $container;
    }
    
    public function create(string $type): Report
    {
        return match($type) {
            'daily' => $this->container->make(DailyReport::class),
            'weekly' => $this->container->make(WeeklyReport::class),
            'monthly' => $this->container->make(MonthlyReport::class),
            default => throw new InvalidArgumentException("Unknown report type: {$type}")
        };
    }
}

$app->singleton(ReportFactory::class, ReportFactoryImpl::class);
```

## Dependency Injection in Controllers

Controllers automatically receive dependency injection:

```php
class UserController
{
    private UserRepository $users;
    private Mailer $mailer;
    
    public function __construct(UserRepository $users, Mailer $mailer)
    {
        $this->users = $users;
        $this->mailer = $mailer;
    }
    
    public function store(Request $request, Validator $validator)
    {
        // Both constructor and method dependencies are injected
        $validated = $validator->validate($request->all(), [
            'email' => 'required|email',
            'name' => 'required|string'
        ]);
        
        $user = $this->users->create($validated);
        $this->mailer->send(new WelcomeEmail($user));
        
        return response()->json($user);
    }
}
```

## Advanced Patterns

### Decorator Pattern

```php
interface Cache
{
    public function get(string $key);
    public function set(string $key, $value);
}

class RedisCache implements Cache
{
    // Redis implementation
}

class LoggingCache implements Cache
{
    private Cache $cache;
    private Logger $logger;
    
    public function __construct(Cache $cache, Logger $logger)
    {
        $this->cache = $cache;
        $this->logger = $logger;
    }
    
    public function get(string $key)
    {
        $this->logger->info("Getting cache key: {$key}");
        return $this->cache->get($key);
    }
    
    public function set(string $key, $value)
    {
        $this->logger->info("Setting cache key: {$key}");
        return $this->cache->set($key, $value);
    }
}

// Binding with decoration
$app->bind(Cache::class, function($app) {
    $redis = new RedisCache();
    
    if ($app->environment('local')) {
        return new LoggingCache($redis, $app->make(Logger::class));
    }
    
    return $redis;
});
```

### Strategy Pattern

```php
interface PaymentGateway
{
    public function charge(int $amount): bool;
}

class StripeGateway implements PaymentGateway
{
    public function charge(int $amount): bool
    {
        // Stripe implementation
    }
}

class PayPalGateway implements PaymentGateway
{
    public function charge(int $amount): bool
    {
        // PayPal implementation
    }
}

// Contextual binding based on configuration
$app->bind(PaymentGateway::class, function($app) {
    return match(config('payment.gateway')) {
        'stripe' => $app->make(StripeGateway::class),
        'paypal' => $app->make(PayPalGateway::class),
        default => throw new Exception('Invalid payment gateway')
    };
});
```

## Testing with the Container

```php
class UserServiceTest extends TestCase
{
    public function test_user_creation()
    {
        // Mock dependencies
        $mockRepo = $this->createMock(UserRepository::class);
        $mockMailer = $this->createMock(Mailer::class);
        
        // Bind mocks to container
        $this->app->instance(UserRepository::class, $mockRepo);
        $this->app->instance(Mailer::class, $mockMailer);
        
        // Test with mocked dependencies
        $service = $this->app->make(UserService::class);
        $service->createUser(['name' => 'John']);
        
        // Assert mock expectations
    }
}
```

## Best Practices

1. **Use interfaces**: Bind to interfaces rather than concrete classes
2. **Avoid container abuse**: Don't use the container as a service locator
3. **Keep it simple**: Don't over-engineer with unnecessary abstractions
4. **Use service providers**: Organize related bindings in providers
5. **Document bindings**: Comment complex bindings for clarity
6. **Prefer constructor injection**: It makes dependencies explicit
7. **Use type hints**: Always type hint dependencies for auto-resolution