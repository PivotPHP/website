---
layout: docs
title: Service Providers
permalink: /docs/providers/
---

# Service Providers

Service providers are the central place of all PivotPHP application bootstrapping. Your own application, as well as all of PivotPHP's core services, are bootstrapped via service providers.

## Introduction

Service providers are the connection point between your package and PivotPHP. A service provider is responsible for binding things into PivotPHP's service container and informing PivotPHP where to load package resources such as views, configuration, and localization files.

## Writing Service Providers

All service providers extend the `PivotPHP\Core\Core\ServiceProvider` class and contain two methods: `register` and `boot`.

### Basic Structure

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register bindings in the container
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Bootstrap your application
    }
}
```

### The Register Method

Within the `register` method, you should only bind things into the service container. You should never attempt to register any event listeners, routes, or any other piece of functionality within the `register` method.

```php
public function register(): void
{
    // Simple binding
    $this->app->bind('mailer', function ($app) {
        return new Mailer($app->make('config')->get('mail'));
    });

    // Singleton binding
    $this->app->singleton(ConnectionInterface::class, function ($app) {
        return new DatabaseConnection(
            $app->make('config')->get('database')
        );
    });

    // Instance binding
    $this->app->instance('api.client', new ApiClient(
        $_ENV['API_KEY']
    ));
}
```

### The Boot Method

The `boot` method is called after all other service providers have been registered, meaning you have access to all other services that have been registered by the framework.

```php
public function boot(): void
{
    // Register event listeners
    Event::listen(UserRegistered::class, SendWelcomeEmail::class);

    // Register middleware
    $this->app->middleware(RateLimitMiddleware::class);

    // Publish configuration
    $this->publishes([
        __DIR__.'/../config/services.php' => config_path('services.php'),
    ], 'config');

    // Load routes
    $this->loadRoutesFrom(__DIR__.'/../routes/api.php');

    // Load views
    $this->loadViewsFrom(__DIR__.'/../resources/views', 'package');
}
```

## Registering Providers

### In Configuration

Register your service providers in the `config/app.php` configuration file:

```php
'providers' => [
    /*
     * PivotPHP Framework Service Providers...
     */
    PivotPHP\Foundation\Providers\FoundationServiceProvider::class,
    PivotPHP\Routing\RoutingServiceProvider::class,
    PivotPHP\Session\SessionServiceProvider::class,

    /*
     * Application Service Providers...
     */
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    App\Providers\RouteServiceProvider::class,
],
```

### Deferred Providers

If your provider is only registering bindings in the service container, you may choose to defer its registration until one of the registered bindings is actually needed:

```php
namespace App\Providers;

use PivotPHP\Core\Core\DeferredServiceProvider;
use App\Services\ImageProcessor;

class ImageServiceProvider extends DeferredServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ImageProcessor::class, function ($app) {
            return new ImageProcessor(
                $app->make('filesystem'),
                $app->make('config')->get('images')
            );
        });
    }

    /**
     * Get the services provided by the provider.
     */
    public function provides(): array
    {
        return [ImageProcessor::class];
    }
}
```

## Common Service Provider Examples

### Route Service Provider

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;
use PivotPHP\Routing\Router;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->defineRoutes();
    }

    /**
     * Define the routes for the application.
     */
    protected function defineRoutes(): void
    {
        $router = $this->app->make(Router::class);

        // API Routes
        $router->group([
            'prefix' => 'api',
            'middleware' => ['api', 'throttle:60,1'],
        ], function ($router) {
            require base_path('routes/api.php');
        });

        // Web Routes
        $router->group([
            'middleware' => ['web'],
        ], function ($router) {
            require base_path('routes/web.php');
        });
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('login', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
```

### Auth Service Provider

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;
use App\Services\Auth\JwtGuard;
use App\Services\Auth\UserProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any authentication / authorization services.
     */
    public function register(): void
    {
        // Register custom user provider
        $this->app->singleton('auth.provider', function ($app) {
            return new UserProvider(
                $app->make('hash'),
                $app->make(UserRepository::class)
            );
        });

        // Register custom guard
        $this->app->singleton('auth.guard', function ($app) {
            return new JwtGuard(
                $app->make('auth.provider'),
                $app->make('request'),
                $app->make('config')->get('auth.jwt')
            );
        });
    }

    /**
     * Bootstrap any authentication / authorization services.
     */
    public function boot(): void
    {
        // Register authorization gates
        Gate::define('update-post', function ($user, $post) {
            return $user->id === $post->user_id;
        });

        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        // Register policies
        Gate::policy(Post::class, PostPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
    }
}
```

### Event Service Provider

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;
use PivotPHP\Events\Dispatcher;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     */
    protected array $listen = [
        UserRegistered::class => [
            SendEmailVerificationNotification::class,
            LogUserRegistration::class,
            UpdateUserStatistics::class,
        ],

        OrderPlaced::class => [
            ProcessPayment::class,
            SendOrderConfirmation::class,
            UpdateInventory::class,
            NotifyWarehouse::class,
        ],

        PaymentFailed::class => [
            NotifyCustomerOfFailure::class,
            LogFailedPayment::class,
            RevertOrderStatus::class,
        ],
    ];

    /**
     * The subscribers to register.
     */
    protected array $subscribe = [
        UserEventSubscriber::class,
        PaymentEventSubscriber::class,
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();

        // Register model events
        User::observe(UserObserver::class);
        Post::observe(PostObserver::class);

        // Register custom events
        Event::listen('cache.cleared', function () {
            Log::info('Application cache was cleared');
        });
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return true;
    }

    /**
     * Get the listener directories that should be used to discover events.
     */
    protected function discoverEventsWithin(): array
    {
        return [
            $this->app->path('Listeners'),
            $this->app->path('Observers'),
        ];
    }
}
```

### Broadcast Service Provider

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;
use PivotPHP\Broadcasting\BroadcastManager;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerChannels();

        // Register broadcast routes
        require base_path('routes/channels.php');
    }

    /**
     * Register broadcast channels.
     */
    protected function registerChannels(): void
    {
        // Private channel authorization
        Broadcast::channel('user.{id}', function ($user, $id) {
            return (int) $user->id === (int) $id;
        });

        // Presence channel authorization
        Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
            if ($user->canJoinRoom($roomId)) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar_url,
                ];
            }
        });

        // Model broadcasting
        Broadcast::channel('App.Models.Order.{order}', function ($user, Order $order) {
            return $user->id === $order->user_id;
        });
    }
}
```

### View Service Provider

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;
use PivotPHP\View\View;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register view composers
        View::composer('profile', ProfileComposer::class);

        View::composer(['dashboard', 'analytics'], function ($view) {
            $view->with('stats', app(StatsService::class)->getStats());
        });

        // Register view creators
        View::creator('notifications', function ($view) {
            $view->with('notifications', auth()->user()->unreadNotifications);
        });

        // Share data with all views
        View::share('appName', config('app.name'));
        View::share('currentYear', date('Y'));

        // Register custom directives
        Blade::directive('datetime', function ($expression) {
            return "<?php echo ($expression)->format('Y-m-d H:i:s'); ?>";
        });

        Blade::if('env', function ($environment) {
            return app()->environment($environment);
        });
    }
}
```

## Package Service Providers

When creating packages, use service providers to register package resources:

```php
namespace YourPackage\Providers;

use PivotPHP\Core\Core\ServiceProvider;

class PackageServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot(): void
    {
        // Load package routes
        $this->loadRoutesFrom(__DIR__.'/../routes.php');

        // Load package views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'package');

        // Load package translations
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'package');

        // Load package migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Publish package resources
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/package.php' => config_path('package.php'),
            ], 'config');

            $this->publishes([
                __DIR__.'/../resources/views' => resource_path('views/vendor/package'),
            ], 'views');

            $this->publishes([
                __DIR__.'/../resources/assets' => public_path('vendor/package'),
            ], 'assets');
        }

        // Register commands
        $this->commands([
            InstallCommand::class,
            PublishCommand::class,
        ]);
    }

    /**
     * Register the application services.
     */
    public function register(): void
    {
        // Merge package configuration
        $this->mergeConfigFrom(
            __DIR__.'/../config/package.php', 'package'
        );

        // Register package services
        $this->app->singleton('package', function ($app) {
            return new Package($app['config']['package']);
        });
    }
}
```

## Testing Service Providers

```php
namespace Tests\Unit\Providers;

use Tests\TestCase;
use App\Providers\CustomServiceProvider;
use App\Services\CustomService;

class CustomServiceProviderTest extends TestCase
{
    public function test_service_is_registered()
    {
        $this->assertInstanceOf(
            CustomService::class,
            $this->app->make(CustomService::class)
        );
    }

    public function test_bindings_are_correct()
    {
        $this->app->register(CustomServiceProvider::class);

        $this->assertTrue($this->app->bound('custom.service'));
        $this->assertSame(
            $this->app->make('custom.service'),
            $this->app->make('custom.service')
        );
    }

    public function test_configuration_is_published()
    {
        $provider = new CustomServiceProvider($this->app);

        $this->assertArrayHasKey('config', $provider->pathsToPublish());
    }
}
```

## Best Practices

1. **Keep providers focused**: Each provider should have a single responsibility
2. **Use register for bindings only**: Don't access other services in register
3. **Defer when possible**: Use deferred providers for better performance
4. **Document dependencies**: Clearly indicate what services your provider requires
5. **Test providers**: Write tests to ensure providers work correctly
6. **Use configuration**: Allow users to configure your service via config files
7. **Follow conventions**: Use standard naming and organization patterns
8. **Avoid heavy operations**: Don't perform expensive operations in providers
