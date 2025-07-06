---
layout: docs-i18n
title: Provedores de Serviços
permalink: /pt/docs/provedores/
lang: pt
---

# Provedores de Serviços

Os provedores de serviços são o local central de toda a inicialização da aplicação HelixPHP. Sua própria aplicação, bem como todos os serviços principais do HelixPHP, são inicializados através de provedores de serviços.

## Introdução

Os provedores de serviços são o ponto de conexão entre seu pacote e o HelixPHP. Um provedor de serviços é responsável por vincular coisas ao contêiner de serviços do HelixPHP e informar ao HelixPHP onde carregar recursos do pacote, como views, configurações e arquivos de localização.

## Escrevendo Provedores de Serviços

Todos os provedores de serviços estendem a classe `Helix\Core\ServiceProvider` e contêm dois métodos: `register` e `boot`.

### Estrutura Básica

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra qualquer serviço da aplicação.
     */
    public function register(): void
    {
        // Registra vinculações no contêiner
    }
    
    /**
     * Inicializa qualquer serviço da aplicação.
     */
    public function boot(): void
    {
        // Inicializa sua aplicação
    }
}
```

### O Método Register

Dentro do método `register`, você deve apenas vincular coisas ao contêiner de serviços. Você nunca deve tentar registrar ouvintes de eventos, rotas ou qualquer outra funcionalidade dentro do método `register`.

```php
public function register(): void
{
    // Vinculação simples
    $this->app->bind('mailer', function ($app) {
        return new Mailer($app->make('config')->get('mail'));
    });
    
    // Vinculação singleton
    $this->app->singleton(ConnectionInterface::class, function ($app) {
        return new DatabaseConnection(
            $app->make('config')->get('database')
        );
    });
    
    // Vinculação de instância
    $this->app->instance('api.client', new ApiClient(
        $_ENV['API_KEY']
    ));
}
```

### O Método Boot

O método `boot` é chamado depois que todos os outros provedores de serviços foram registrados, o que significa que você tem acesso a todos os outros serviços registrados pelo framework.

```php
public function boot(): void
{
    // Registra ouvintes de eventos
    Event::listen(UserRegistered::class, SendWelcomeEmail::class);
    
    // Registra middleware
    $this->app->middleware(RateLimitMiddleware::class);
    
    // Publica configuração
    $this->publishes([
        __DIR__.'/../config/services.php' => config_path('services.php'),
    ], 'config');
    
    // Carrega rotas
    $this->loadRoutesFrom(__DIR__.'/../routes/api.php');
    
    // Carrega views
    $this->loadViewsFrom(__DIR__.'/../resources/views', 'package');
}
```

## Registrando Provedores

### Na Configuração

Registre seus provedores de serviços no arquivo de configuração `config/app.php`:

```php
'providers' => [
    /*
     * Provedores de Serviços do Framework HelixPHP...
     */
    Helix\Foundation\Providers\FoundationServiceProvider::class,
    Helix\Routing\RoutingServiceProvider::class,
    Helix\Session\SessionServiceProvider::class,
    
    /*
     * Provedores de Serviços da Aplicação...
     */
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    App\Providers\RouteServiceProvider::class,
],
```

### Provedores Adiados

Se seu provedor está apenas registrando vinculações no contêiner de serviços, você pode escolher adiar seu registro até que uma das vinculações registradas seja realmente necessária:

```php
namespace App\Providers;

use Helix\Core\DeferredServiceProvider;
use App\Services\ImageProcessor;

class ImageServiceProvider extends DeferredServiceProvider
{
    /**
     * Registra qualquer serviço da aplicação.
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
     * Obtém os serviços fornecidos pelo provedor.
     */
    public function provides(): array
    {
        return [ImageProcessor::class];
    }
}
```

## Exemplos Comuns de Provedores de Serviços

### Provedor de Serviços de Rotas

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;
use Helix\Routing\Router;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * O caminho para a rota "home" da sua aplicação.
     */
    public const HOME = '/dashboard';
    
    /**
     * Define suas vinculações de modelo de rota, filtros de padrão, etc.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->defineRoutes();
    }
    
    /**
     * Define as rotas para a aplicação.
     */
    protected function defineRoutes(): void
    {
        $router = $this->app->make(Router::class);
        
        // Rotas da API
        $router->group([
            'prefix' => 'api',
            'middleware' => ['api', 'throttle:60,1'],
        ], function ($router) {
            require base_path('routes/api.php');
        });
        
        // Rotas Web
        $router->group([
            'middleware' => ['web'],
        ], function ($router) {
            require base_path('routes/web.php');
        });
    }
    
    /**
     * Configura os limitadores de taxa para a aplicação.
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

### Provedor de Serviços de Autenticação

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;
use App\Services\Auth\JwtGuard;
use App\Services\Auth\UserProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Registra qualquer serviço de autenticação/autorização.
     */
    public function register(): void
    {
        // Registra provedor de usuário personalizado
        $this->app->singleton('auth.provider', function ($app) {
            return new UserProvider(
                $app->make('hash'),
                $app->make(UserRepository::class)
            );
        });
        
        // Registra guarda personalizado
        $this->app->singleton('auth.guard', function ($app) {
            return new JwtGuard(
                $app->make('auth.provider'),
                $app->make('request'),
                $app->make('config')->get('auth.jwt')
            );
        });
    }
    
    /**
     * Inicializa qualquer serviço de autenticação/autorização.
     */
    public function boot(): void
    {
        // Registra portões de autorização
        Gate::define('update-post', function ($user, $post) {
            return $user->id === $post->user_id;
        });
        
        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });
        
        // Registra políticas
        Gate::policy(Post::class, PostPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
    }
}
```

### Provedor de Serviços de Eventos

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;
use Helix\Events\Dispatcher;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Os mapeamentos de ouvintes de eventos para a aplicação.
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
     * Os assinantes a serem registrados.
     */
    protected array $subscribe = [
        UserEventSubscriber::class,
        PaymentEventSubscriber::class,
    ];
    
    /**
     * Registra qualquer evento para sua aplicação.
     */
    public function boot(): void
    {
        parent::boot();
        
        // Registra eventos de modelo
        User::observe(UserObserver::class);
        Post::observe(PostObserver::class);
        
        // Registra eventos personalizados
        Event::listen('cache.cleared', function () {
            Log::info('Cache da aplicação foi limpo');
        });
    }
    
    /**
     * Determina se eventos e ouvintes devem ser automaticamente descobertos.
     */
    public function shouldDiscoverEvents(): bool
    {
        return true;
    }
    
    /**
     * Obtém os diretórios de ouvintes que devem ser usados para descobrir eventos.
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

### Provedor de Serviços de Transmissão

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;
use Helix\Broadcasting\BroadcastManager;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Inicializa qualquer serviço da aplicação.
     */
    public function boot(): void
    {
        $this->registerChannels();
        
        // Registra rotas de transmissão
        require base_path('routes/channels.php');
    }
    
    /**
     * Registra canais de transmissão.
     */
    protected function registerChannels(): void
    {
        // Autorização de canal privado
        Broadcast::channel('user.{id}', function ($user, $id) {
            return (int) $user->id === (int) $id;
        });
        
        // Autorização de canal de presença
        Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
            if ($user->canJoinRoom($roomId)) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar_url,
                ];
            }
        });
        
        // Transmissão de modelo
        Broadcast::channel('App.Models.Order.{order}', function ($user, Order $order) {
            return $user->id === $order->user_id;
        });
    }
}
```

### Provedor de Serviços de View

```php
namespace App\Providers;

use Helix\Core\ServiceProvider;
use Helix\View\View;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Registra qualquer serviço da aplicação.
     */
    public function register(): void
    {
        //
    }
    
    /**
     * Inicializa qualquer serviço da aplicação.
     */
    public function boot(): void
    {
        // Registra compositores de view
        View::composer('profile', ProfileComposer::class);
        
        View::composer(['dashboard', 'analytics'], function ($view) {
            $view->with('stats', app(StatsService::class)->getStats());
        });
        
        // Registra criadores de view
        View::creator('notifications', function ($view) {
            $view->with('notifications', auth()->user()->unreadNotifications);
        });
        
        // Compartilha dados com todas as views
        View::share('appName', config('app.name'));
        View::share('currentYear', date('Y'));
        
        // Registra diretivas personalizadas
        Blade::directive('datetime', function ($expression) {
            return "<?php echo ($expression)->format('Y-m-d H:i:s'); ?>";
        });
        
        Blade::if('env', function ($environment) {
            return app()->environment($environment);
        });
    }
}
```

## Provedores de Serviços de Pacotes

Ao criar pacotes, use provedores de serviços para registrar recursos do pacote:

```php
namespace YourPackage\Providers;

use Helix\Core\ServiceProvider;

class PackageServiceProvider extends ServiceProvider
{
    /**
     * Inicializa os serviços da aplicação.
     */
    public function boot(): void
    {
        // Carrega rotas do pacote
        $this->loadRoutesFrom(__DIR__.'/../routes.php');
        
        // Carrega views do pacote
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'package');
        
        // Carrega traduções do pacote
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'package');
        
        // Carrega migrações do pacote
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        
        // Publica recursos do pacote
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
        
        // Registra comandos
        $this->commands([
            InstallCommand::class,
            PublishCommand::class,
        ]);
    }
    
    /**
     * Registra os serviços da aplicação.
     */
    public function register(): void
    {
        // Mescla configuração do pacote
        $this->mergeConfigFrom(
            __DIR__.'/../config/package.php', 'package'
        );
        
        // Registra serviços do pacote
        $this->app->singleton('package', function ($app) {
            return new Package($app['config']['package']);
        });
    }
}
```

## Testando Provedores de Serviços

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

## Melhores Práticas

1. **Mantenha provedores focados**: Cada provedor deve ter uma única responsabilidade
2. **Use register apenas para vinculações**: Não acesse outros serviços no register
3. **Adie quando possível**: Use provedores adiados para melhor performance
4. **Documente dependências**: Indique claramente quais serviços seu provedor requer
5. **Teste provedores**: Escreva testes para garantir que os provedores funcionem corretamente
6. **Use configuração**: Permita que usuários configurem seu serviço através de arquivos de configuração
7. **Siga convenções**: Use padrões de nomenclatura e organização padrão
8. **Evite operações pesadas**: Não execute operações caras nos provedores