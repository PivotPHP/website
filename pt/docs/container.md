---
layout: docs-i18n
title: Container de Serviços
permalink: /pt/docs/container/
lang: pt
---

# Container de Serviços

O container de serviços do PivotPHP é uma ferramenta poderosa para gerenciar dependências de classes e realizar injeção de dependência. É essencialmente uma fábrica sofisticada que cria e gerencia instâncias de objetos para sua aplicação.

## Introdução à Injeção de Dependência

Injeção de dependência é uma técnica onde um objeto recebe suas dependências em vez de criá-las. Isso leva a código mais flexível, testável e manutenível.

```php
// Sem injeção de dependência
class UserController
{
    public function index()
    {
        $db = new Database(); // Dependência rígida
        $users = $db->query('SELECT * FROM users');
        return json_encode($users);
    }
}

// Com injeção de dependência
class UserController
{
    private Database $db;

    public function __construct(Database $db)
    {
        $this->db = $db; // Dependência injetada
    }

    public function index()
    {
        $users = $this->db->query('SELECT * FROM users');
        return json_encode($users);
    }
}
```

## Uso Básico

### Vinculação (Binding)

Registre vinculações no container:

```php
// Vinculação simples
$app->bind('database', function($container) {
    return new Database(
        $_ENV['DB_HOST'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    );
});

// Vinculação de classe
$app->bind(Database::class, function($container) {
    return new MySQLDatabase(config('database'));
});

// Vinculação de interface para implementação
$app->bind(
    UserRepositoryInterface::class,
    UserRepository::class
);
```

### Resolução

Recupere instâncias do container:

```php
// Usando make
$db = $app->make('database');
$db = $app->make(Database::class);

// Usando acesso de array
$db = $app['database'];

// Usando função helper
$db = app('database');
$db = app(Database::class);
```

### Vinculação Singleton

Crie instâncias compartilhadas que são resolvidas apenas uma vez:

```php
// Vinculação singleton
$app->singleton('cache', function($container) {
    return new CacheManager(
        $container->make('redis')
    );
});

// A mesma instância é retornada toda vez
$cache1 = $app->make('cache');
$cache2 = $app->make('cache');
// $cache1 === $cache2 (true)
```

### Vinculação de Instância

Vincule uma instância existente:

```php
$api = new ApiClient($_ENV['API_KEY']);
$app->instance('api', $api);

// Ou vincule a instância diretamente
$app->instance(ApiClient::class, new ApiClient($_ENV['API_KEY']));
```

## Resolução Automática

O container pode resolver automaticamente classes e suas dependências:

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

// O container cria automaticamente todas as dependências
$controller = $app->make(UserController::class);
```

## Injeção de Método

Injete dependências em chamadas de método:

```php
class UserController
{
    public function show(Request $request, UserRepository $users, $id)
    {
        $user = $users->find($id);
        return response()->json($user);
    }
}

// Chamar método com injeção de dependência
$response = $app->call([UserController::class, 'show'], ['id' => 123]);
```

## Vinculação Contextual

Forneça implementações diferentes baseadas no contexto:

```php
// Quando UserController precisar de Cache, forneça RedisCache
$app->when(UserController::class)
    ->needs(Cache::class)
    ->give(RedisCache::class);

// Quando AdminController precisar de Cache, forneça FileCache
$app->when(AdminController::class)
    ->needs(Cache::class)
    ->give(FileCache::class);

// Com closure
$app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(function($container) {
        return Storage::disk('photos');
    });
```

## Vinculação de Primitivos

Injete valores primitivos como strings ou inteiros:

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

## Vinculações com Tags

Agrupe vinculações relacionadas com tags:

```php
// Marcar múltiplas vinculações
$app->bind('reports.daily', DailyReport::class);
$app->bind('reports.weekly', WeeklyReport::class);
$app->bind('reports.monthly', MonthlyReport::class);

$app->tag([
    'reports.daily',
    'reports.weekly',
    'reports.monthly'
], 'reports');

// Resolver todas as vinculações marcadas
$reports = $app->tagged('reports');

foreach ($reports as $report) {
    $report->generate();
}
```

## Provedores de Serviço

Organize suas vinculações em provedores de serviço:

```php
namespace App\Providers;

use PivotPHP\Core\Core\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registrar vinculações no container
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
     * Inicializar serviços da aplicação
     */
    public function boot(): void
    {
        // Executar ações após todos os serviços serem registrados
        $cache = $this->app->make(Cache::class);
        $cache->flush();
    }
}
```

## Eventos do Container

Escute eventos de resolução:

```php
// Antes de resolver
$app->resolving(Database::class, function($db, $app) {
    // Configurar banco de dados antes de retornar
    $db->setTimezone('UTC');
});

// Após resolver
$app->afterResolving(Logger::class, function($logger, $app) {
    // Adicionar handlers após logger ser criado
    $logger->pushHandler(new StreamHandler('caminho/para/log'));
});

// Callback de resolução global
$app->resolving(function($object, $app) {
    // Chamado para toda resolução
});
```

## Estendendo Vinculações

Estenda serviços resolvidos:

```php
$app->extend(Database::class, function($db, $app) {
    // Adicionar log de queries
    $db->enableQueryLog();

    $db->listen(function($query) use ($app) {
        $app->make('logger')->info($query);
    });

    return $db;
});
```

## Padrão Factory

Crie factories para criação complexa de objetos:

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
            default => throw new InvalidArgumentException("Tipo de relatório desconhecido: {$type}")
        };
    }
}

$app->singleton(ReportFactory::class, ReportFactoryImpl::class);
```

## Injeção de Dependência em Controllers

Controllers recebem automaticamente injeção de dependência:

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
        // Ambas dependências do construtor e método são injetadas
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

## Padrões Avançados

### Padrão Decorator

```php
interface Cache
{
    public function get(string $key);
    public function set(string $key, $value);
}

class RedisCache implements Cache
{
    // Implementação Redis
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
        $this->logger->info("Obtendo chave de cache: {$key}");
        return $this->cache->get($key);
    }

    public function set(string $key, $value)
    {
        $this->logger->info("Definindo chave de cache: {$key}");
        return $this->cache->set($key, $value);
    }
}

// Vinculação com decoração
$app->bind(Cache::class, function($app) {
    $redis = new RedisCache();

    if ($app->environment('local')) {
        return new LoggingCache($redis, $app->make(Logger::class));
    }

    return $redis;
});
```

### Padrão Strategy

```php
interface PaymentGateway
{
    public function charge(int $amount): bool;
}

class StripeGateway implements PaymentGateway
{
    public function charge(int $amount): bool
    {
        // Implementação Stripe
    }
}

class PayPalGateway implements PaymentGateway
{
    public function charge(int $amount): bool
    {
        // Implementação PayPal
    }
}

// Vinculação contextual baseada em configuração
$app->bind(PaymentGateway::class, function($app) {
    return match(config('payment.gateway')) {
        'stripe' => $app->make(StripeGateway::class),
        'paypal' => $app->make(PayPalGateway::class),
        default => throw new Exception('Gateway de pagamento inválido')
    };
});
```

## Testando com o Container

```php
class UserServiceTest extends TestCase
{
    public function test_user_creation()
    {
        // Mock de dependências
        $mockRepo = $this->createMock(UserRepository::class);
        $mockMailer = $this->createMock(Mailer::class);

        // Vincular mocks ao container
        $this->app->instance(UserRepository::class, $mockRepo);
        $this->app->instance(Mailer::class, $mockMailer);

        // Testar com dependências mockadas
        $service = $this->app->make(UserService::class);
        $service->createUser(['name' => 'João']);

        // Verificar expectativas do mock
    }
}
```

## Melhores Práticas

1. **Use interfaces**: Vincule a interfaces em vez de classes concretas
2. **Evite abuso do container**: Não use o container como localizador de serviços
3. **Mantenha simples**: Não faça engenharia excessiva com abstrações desnecessárias
4. **Use provedores de serviço**: Organize vinculações relacionadas em provedores
5. **Documente vinculações**: Comente vinculações complexas para clareza
6. **Prefira injeção no construtor**: Torna as dependências explícitas
7. **Use type hints**: Sempre declare tipos nas dependências para auto-resolução
