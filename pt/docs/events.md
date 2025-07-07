---
layout: docs-i18n
title: Eventos
permalink: /pt/docs/eventos/
lang: pt
---

# Eventos

O PivotPHP fornece um sistema de eventos simples, mas poderoso, que permite que você assine e escute vários eventos que ocorrem em sua aplicação. Isso proporciona uma ótima maneira de desacoplar vários aspectos da sua aplicação.

## Uso Básico

### Disparando Eventos

A maneira mais simples de disparar um evento é usando o dispatcher de eventos:

```php
use PivotPHP\Events\Dispatcher;

// Disparar um evento simples
$dispatcher = new Dispatcher();
$dispatcher->dispatch('user.registered', $user);

// Usando o helper global
event('user.registered', $user);

// Disparar com múltiplos parâmetros
event('order.placed', [$order, $customer]);
```

### Escutando Eventos

Registre listeners de eventos para responder aos eventos:

```php
// Listener simples
$dispatcher->listen('user.registered', function($user) {
    // Enviar email de boas-vindas
    Mail::send(new WelcomeEmail($user));
});

// Múltiplos listeners para o mesmo evento
$dispatcher->listen('user.registered', function($user) {
    // Registrar log
    Log::info("Novo usuário registrado: {$user->email}");
});

$dispatcher->listen('user.registered', function($user) {
    // Atualizar estatísticas
    Stats::increment('users.registered');
});
```

## Classes de Evento

Para eventos complexos, crie classes de evento dedicadas:

```php
namespace App\Events;

class UserRegistered
{
    public function __construct(
        public User $user,
        public array $additionalData = []
    ) {}
}

// Disparar objeto de evento
event(new UserRegistered($user, ['source' => 'api']));

// Escutar classe de evento
$dispatcher->listen(UserRegistered::class, function(UserRegistered $event) {
    // Acessar dados do evento
    $user = $event->user;
    $source = $event->additionalData['source'] ?? 'web';
});
```

## Listeners de Evento

### Listeners Baseados em Classe

Crie classes de listener dedicadas para melhor organização:

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

// Registrar listener de classe
$dispatcher->listen(UserRegistered::class, SendWelcomeEmail::class);

// Ou com método específico
$dispatcher->listen(UserRegistered::class, [SendWelcomeEmail::class, 'handle']);
```

### Listeners em Fila

Adie tarefas demoradas para jobs em background:

```php
namespace App\Listeners;

use PivotPHP\Contracts\Queue\ShouldQueue;
use PivotPHP\Queue\InteractsWithQueue;

class ProcessUserAnalytics implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(UserRegistered $event): void
    {
        // Isso será executado em background
        Analytics::track('user.registered', [
            'user_id' => $event->user->id,
            'source' => $event->additionalData['source'] ?? 'web'
        ]);
    }

    public function failed(UserRegistered $event, \Throwable $exception): void
    {
        // Lidar com falha
        Log::error("Falha ao processar analytics para usuário {$event->user->id}");
    }
}
```

## Assinantes de Evento

Agrupe listeners de evento relacionados em classes assinantes:

```php
namespace App\Listeners;

class UserEventSubscriber
{
    public function handleUserRegistration(UserRegistered $event): void
    {
        // Lidar com registro
    }

    public function handleUserLogin(UserLoggedIn $event): void
    {
        // Atualizar último login
        $event->user->update(['last_login' => now()]);
    }

    public function handleUserLogout(UserLoggedOut $event): void
    {
        // Limpar cache do usuário
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

// Registrar assinante
$dispatcher->subscribe(UserEventSubscriber::class);
```

## Listeners com Curinga

Escute múltiplos eventos com curingas:

```php
// Escutar todos os eventos de usuário
$dispatcher->listen('user.*', function($event, $data) {
    Log::info("Evento de usuário disparado: {$event}");
});

// Escutar todos os eventos
$dispatcher->listen('*', function($event, $data) {
    // Registrar todos os eventos
    EventLog::create([
        'event' => $event,
        'data' => json_encode($data),
        'timestamp' => now()
    ]);
});
```

## Prioridade de Evento

Controle a ordem de execução dos listeners:

```php
// Prioridade maior executa primeiro (padrão é 0)
$dispatcher->listen('user.registered', function($user) {
    // Validar dados do usuário primeiro
}, priority: 10);

$dispatcher->listen('user.registered', function($user) {
    // Depois enviar email
}, priority: 5);

$dispatcher->listen('user.registered', function($user) {
    // Por fim registrar log
}, priority: 0);
```

## Interrompendo a Propagação de Evento

Evite que listeners adicionais sejam executados:

```php
$dispatcher->listen('payment.processing', function($payment) {
    if ($payment->amount > 10000) {
        // Requer aprovação manual
        $payment->setStatus('pending_approval');

        // Parar outros listeners
        return false;
    }
});

$dispatcher->listen('payment.processing', function($payment) {
    // Isso não será executado se amount > 10000
    $payment->process();
});
```

## Listeners Condicionais

Adicione listeners condicionalmente:

```php
// Escutar apenas em produção
if (app()->environment('production')) {
    $dispatcher->listen('error.occurred', function($error) {
        // Enviar para serviço de rastreamento de erros
        Sentry::captureException($error);
    });
}

// Classe de listener condicional
class ConditionalListener
{
    public function shouldHandle(UserRegistered $event): bool
    {
        // Lidar apenas com usuários premium
        return $event->user->isPremium();
    }

    public function handle(UserRegistered $event): void
    {
        if (!$this->shouldHandle($event)) {
            return;
        }

        // Lidar com registro de usuário premium
    }
}
```

## Provedor de Serviço de Eventos

Organize listeners de evento em um provedor de serviço:

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

        // Registrar listeners
        foreach ($this->listen as $event => $listeners) {
            foreach ($listeners as $listener) {
                $dispatcher->listen($event, $listener);
            }
        }

        // Registrar assinantes
        foreach ($this->subscribe as $subscriber) {
            $dispatcher->subscribe($subscriber);
        }

        // Registrar listeners dinâmicos
        $this->registerDynamicListeners($dispatcher);
    }

    private function registerDynamicListeners(Dispatcher $dispatcher): void
    {
        // Eventos de modelo
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

## Eventos Integrados

O PivotPHP dispara vários eventos integrados:

```php
// Eventos do ciclo de vida da requisição
'request.received' => [$request]
'request.handled' => [$request, $response]

// Eventos de banco de dados
'database.query' => [$query, $bindings, $time]
'database.transaction.begin' => [$connection]
'database.transaction.commit' => [$connection]
'database.transaction.rollback' => [$connection]

// Eventos de cache
'cache.hit' => [$key, $value]
'cache.missed' => [$key]
'cache.write' => [$key, $value, $ttl]
'cache.delete' => [$key]

// Eventos de autenticação
'auth.login' => [$user, $remember]
'auth.logout' => [$user]
'auth.failed' => [$credentials]
```

## Testando Eventos

Teste seus eventos e listeners:

```php
use PivotPHP\Testing\TestCase;
use PivotPHP\Support\Facades\Event;

class UserRegistrationTest extends TestCase
{
    public function test_user_registration_fires_event()
    {
        // Simular eventos
        Event::fake();

        // Executar registro
        $response = $this->post('/register', [
            'name' => 'João Silva',
            'email' => 'joao@exemplo.com',
            'password' => 'senha123'
        ]);

        // Verificar que evento foi disparado
        Event::assertDispatched(UserRegistered::class, function($event) {
            return $event->user->email === 'joao@exemplo.com';
        });

        // Verificar que evento foi disparado exatamente uma vez
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

## Considerações de Performance

### Eventos Assíncronos

Para melhor performance, processe eventos assincronamente:

```php
class AsyncEventDispatcher extends Dispatcher
{
    private Queue $queue;

    public function dispatch($event, $payload = []): void
    {
        // Eventos críticos processados imediatamente
        if ($this->isCritical($event)) {
            parent::dispatch($event, $payload);
            return;
        }

        // Enfileirar eventos não críticos
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

### Agrupamento de Eventos

Agrupe múltiplos eventos para eficiência:

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

        // Disparar imediatamente se não estiver agrupando
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

## Melhores Práticas

1. **Use classes de evento**: Para eventos complexos, crie classes dedicadas
2. **Mantenha listeners focados**: Cada listener deve ter uma única responsabilidade
3. **Enfileire tarefas pesadas**: Use listeners em fila para operações demoradas
4. **Lide com falhas**: Implemente tratamento de erros nos listeners
5. **Teste eventos**: Sempre teste o disparo e manipulação de eventos
6. **Documente eventos**: Documente claramente quais eventos sua aplicação dispara
7. **Evite loops infinitos**: Cuidado com eventos que disparam outros eventos
8. **Use type hints**: Use type hints nos parâmetros de evento para melhor suporte da IDE
