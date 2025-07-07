---
layout: docs
title: Events
permalink: /docs/events/
---

PivotPHP provides a simple yet powerful event system that allows you to subscribe to and listen for various events that occur in your application. This provides a great way to decouple various aspects of your application.

## Basic Usage

### Dispatching Events

The simplest way to dispatch an event is using the event dispatcher:

```php
use PivotPHP\Events\Dispatcher;

// Dispatch a simple event
$dispatcher = new Dispatcher();
$dispatcher->dispatch('user.registered', $user);

// Using the global helper
event('user.registered', $user);

// Dispatch with multiple parameters
event('order.placed', [$order, $customer]);
```

### Listening to Events

Register event listeners to respond to events:

```php
// Simple listener
$dispatcher->listen('user.registered', function($user) {
    // Send welcome email
    Mail::send(new WelcomeEmail($user));
});

// Multiple listeners for same event
$dispatcher->listen('user.registered', function($user) {
    // Log registration
    Log::info("New user registered: {$user->email}");
});

$dispatcher->listen('user.registered', function($user) {
    // Update statistics
    Stats::increment('users.registered');
});
```

## Event Classes

For complex events, create dedicated event classes:

```php
namespace App\Events;

class UserRegistered
{
    public function __construct(
        public User $user,
        public array $additionalData = []
    ) {}
}

// Dispatch event object
event(new UserRegistered($user, ['source' => 'api']));

// Listen for event class
$dispatcher->listen(UserRegistered::class, function(UserRegistered $event) {
    // Access event data
    $user = $event->user;
    $source = $event->additionalData['source'] ?? 'web';
});
```

## Event Listeners

### Class-Based Listeners

Create dedicated listener classes for better organization:

```php
namespace App\Listeners;

class SendWelcomeEmail
{
    private Mailer $mailer;

    public function __construct(Mailer $mailer)
    {
        $this->mailer = $mailer;
    }

    public function handle(UserRegistered $event): void
    {
        $this->mailer->send(
            new WelcomeEmail($event->user)
        );
    }
}

// Register class listener
$dispatcher->listen(UserRegistered::class, SendWelcomeEmail::class);

// Or with specific method
$dispatcher->listen(UserRegistered::class, [SendWelcomeEmail::class, 'handle']);
```

### Queued Listeners

Defer time-consuming tasks to background jobs:

```php
namespace App\Listeners;

use PivotPHP\Contracts\Queue\ShouldQueue;
use PivotPHP\Queue\InteractsWithQueue;

class ProcessUserAnalytics implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(UserRegistered $event): void
    {
        // This will run in the background
        Analytics::track('user.registered', [
            'user_id' => $event->user->id,
            'source' => $event->additionalData['source'] ?? 'web'
        ]);
    }

    public function failed(UserRegistered $event, \Throwable $exception): void
    {
        // Handle failure
        Log::error("Failed to process analytics for user {$event->user->id}");
    }
}
```

## Event Subscribers

Group related event listeners in subscriber classes:

```php
namespace App\Listeners;

class UserEventSubscriber
{
    public function handleUserRegistration(UserRegistered $event): void
    {
        // Handle registration
    }

    public function handleUserLogin(UserLoggedIn $event): void
    {
        // Update last login
        $event->user->update(['last_login' => now()]);
    }

    public function handleUserLogout(UserLoggedOut $event): void
    {
        // Clear user cache
        Cache::forget("user.{$event->user->id}");
    }

    public function subscribe(Dispatcher $events): array
    {
        return [
            UserRegistered::class => 'handleUserRegistration',
            UserLoggedIn::class => 'handleUserLogin',
            UserLoggedOut::class => 'handleUserLogout',
        ];
    }
}

// Register subscriber
$dispatcher->subscribe(UserEventSubscriber::class);
```

## Wildcard Listeners

Listen to multiple events with wildcards:

```php
// Listen to all user events
$dispatcher->listen('user.*', function($event, $data) {
    Log::info("User event triggered: {$event}");
});

// Listen to all events
$dispatcher->listen('*', function($event, $data) {
    // Log all events
    EventLog::create([
        'event' => $event,
        'data' => json_encode($data),
        'timestamp' => now()
    ]);
});
```

## Event Priority

Control the order of listener execution:

```php
// Higher priority executes first (default is 0)
$dispatcher->listen('user.registered', function($user) {
    // Validate user data first
}, priority: 10);

$dispatcher->listen('user.registered', function($user) {
    // Then send email
}, priority: 5);

$dispatcher->listen('user.registered', function($user) {
    // Finally log
}, priority: 0);
```

## Stopping Event Propagation

Prevent further listeners from executing:

```php
$dispatcher->listen('payment.processing', function($payment) {
    if ($payment->amount > 10000) {
        // Require manual approval
        $payment->setStatus('pending_approval');

        // Stop other listeners
        return false;
    }
});

$dispatcher->listen('payment.processing', function($payment) {
    // This won't run if amount > 10000
    $payment->process();
});
```

## Conditional Listeners

Add listeners conditionally:

```php
// Only listen in production
if (app()->environment('production')) {
    $dispatcher->listen('error.occurred', function($error) {
        // Send to error tracking service
        Sentry::captureException($error);
    });
}

// Conditional listener class
class ConditionalListener
{
    public function shouldHandle(UserRegistered $event): bool
    {
        // Only handle premium users
        return $event->user->isPremium();
    }

    public function handle(UserRegistered $event): void
    {
        if (!$this->shouldHandle($event)) {
            return;
        }

        // Handle premium user registration
    }
}
```

## Event Service Provider

Organize event listeners in a service provider:

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;
use PivotPHP\Events\Dispatcher;

class EventServiceProvider extends ServiceProvider
{
    protected array $listen = [
        UserRegistered::class => [
            SendWelcomeEmail::class,
            UpdateUserStatistics::class,
            NotifyAdminOfNewUser::class,
        ],

        OrderPlaced::class => [
            ProcessPayment::class,
            SendOrderConfirmation::class,
            UpdateInventory::class,
        ],
    ];

    protected array $subscribe = [
        UserEventSubscriber::class,
        PaymentEventSubscriber::class,
    ];

    public function boot(): void
    {
        $dispatcher = $this->app->make(Dispatcher::class);

        // Register listeners
        foreach ($this->listen as $event => $listeners) {
            foreach ($listeners as $listener) {
                $dispatcher->listen($event, $listener);
            }
        }

        // Register subscribers
        foreach ($this->subscribe as $subscriber) {
            $dispatcher->subscribe($subscriber);
        }

        // Register dynamic listeners
        $this->registerDynamicListeners($dispatcher);
    }

    private function registerDynamicListeners(Dispatcher $dispatcher): void
    {
        // Model events
        User::created(function($user) use ($dispatcher) {
            $dispatcher->dispatch(new UserCreated($user));
        });

        User::updated(function($user) use ($dispatcher) {
            if ($user->wasChanged('email')) {
                $dispatcher->dispatch(new UserEmailChanged($user));
            }
        });
    }
}
```

## Built-in Events

PivotPHP dispatches several built-in events:

```php
// Request lifecycle events
'request.received' => [$request]
'request.handled' => [$request, $response]

// Database events
'database.query' => [$query, $bindings, $time]
'database.transaction.begin' => [$connection]
'database.transaction.commit' => [$connection]
'database.transaction.rollback' => [$connection]

// Cache events
'cache.hit' => [$key, $value]
'cache.missed' => [$key]
'cache.write' => [$key, $value, $ttl]
'cache.delete' => [$key]

// Authentication events
'auth.login' => [$user, $remember]
'auth.logout' => [$user]
'auth.failed' => [$credentials]
```

## Testing Events

Test your events and listeners:

```php
use PivotPHP\Testing\TestCase;
use PivotPHP\Support\Facades\Event;

class UserRegistrationTest extends TestCase
{
    public function test_user_registration_fires_event()
    {
        // Fake events
        Event::fake();

        // Perform registration
        $response = $this->post('/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password'
        ]);

        // Assert event was dispatched
        Event::assertDispatched(UserRegistered::class, function($event) {
            return $event->user->email === 'john@example.com';
        });

        // Assert event was dispatched exactly once
        Event::assertDispatchedTimes(UserRegistered::class, 1);
    }

    public function test_welcome_email_is_sent()
    {
        Event::fake([UserRegistered::class]);

        $user = User::factory()->create();
        event(new UserRegistered($user));

        Event::assertListening(
            UserRegistered::class,
            SendWelcomeEmail::class
        );
    }
}
```

## Performance Considerations

### Async Events

For better performance, process events asynchronously:

```php
class AsyncEventDispatcher extends Dispatcher
{
    private Queue $queue;

    public function dispatch($event, $payload = []): void
    {
        // Critical events processed immediately
        if ($this->isCritical($event)) {
            parent::dispatch($event, $payload);
            return;
        }

        // Queue non-critical events
        $this->queue->push(new ProcessEvent($event, $payload));
    }

    private function isCritical($event): bool
    {
        $critical = ['payment.failed', 'security.breach', 'system.error'];

        return in_array($event, $critical) ||
               $event instanceof CriticalEvent;
    }
}
```

### Event Batching

Batch multiple events for efficiency:

```php
class BatchedEventDispatcher
{
    private array $events = [];
    private bool $batching = false;

    public function batch(callable $callback): void
    {
        $this->batching = true;

        $callback();

        $this->batching = false;
        $this->flushEvents();
    }

    public function dispatch($event, $payload = []): void
    {
        if ($this->batching) {
            $this->events[] = [$event, $payload];
            return;
        }

        // Dispatch immediately if not batching
        parent::dispatch($event, $payload);
    }

    private function flushEvents(): void
    {
        foreach ($this->events as [$event, $payload]) {
            parent::dispatch($event, $payload);
        }

        $this->events = [];
    }
}
```

## Best Practices

1. **Use event classes**: For complex events, create dedicated classes
2. **Keep listeners focused**: Each listener should have a single responsibility
3. **Queue heavy tasks**: Use queued listeners for time-consuming operations
4. **Handle failures**: Implement error handling in listeners
5. **Test events**: Always test event dispatching and handling
6. **Document events**: Clearly document what events your application fires
7. **Avoid infinite loops**: Be careful with events that trigger other events
8. **Use type hints**: Type hint event parameters for better IDE support
