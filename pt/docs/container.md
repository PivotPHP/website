---
redirect_from:
  - /docs/container/
  - /en/docs/container/
  - /en/container/
layout: docs
title: Container de Serviços
permalink: /pt/docs/container/
lang: pt
---

O PivotPHP inclui um contêiner de serviços simples, compatível com PSR-11 (`Psr\Container\ContainerInterface`), para registrar e resolver dependências da aplicação. A classe é `PivotPHP\Core\Providers\Container` e a `Application` expõe os métodos mais usados diretamente.

## Introdução à Injeção de Dependência

Injeção de dependência é uma técnica onde um objeto recebe suas dependências em vez de criá-las. Isso leva a código mais flexível, testável e manutenível.

```php
// Sem injeção de dependência
class UserService
{
    public function all(): array
    {
        $db = new Database(); // Dependência rígida
        return $db->query('SELECT * FROM users');
    }
}

// Com injeção de dependência
class UserService
{
    public function __construct(private Database $db)
    {
    }

    public function all(): array
    {
        return $this->db->query('SELECT * FROM users');
    }
}
```

## API Disponível

| Método em `$app` | Descrição |
|---|---|
| `bind(string $abstract, mixed $concrete = null, bool $shared = false)` | Registra um serviço. Por padrão, cria uma nova instância a cada resolução |
| `singleton(string $abstract, mixed $concrete = null)` | Registra um serviço compartilhado (mesma instância sempre) |
| `instance(string $abstract, mixed $instance)` | Registra um valor ou objeto já construído |
| `alias(string $alias, string $abstract)` | Cria um nome alternativo para um serviço |
| `make(string $abstract)` / `resolve(string $id)` | Resolve um serviço registrado |
| `has(string $id)` | Verifica se um serviço está registrado |
| `getContainer()` | Retorna o contêiner (`Providers\Container`) |

Os métodos de registro retornam a própria `Application`, permitindo encadeamento.

## Registrando Serviços

### Fábricas (closures)

Quando `$concrete` é uma closure, ela é chamada para construir o serviço e recebe o contêiner como argumento:

```php
use PivotPHP\Core\Providers\Container;

$app->bind(Database::class, function (Container $c) {
    return new Database($_ENV['DB_HOST'] ?? 'localhost');
});

$app->bind(UserService::class, function (Container $c) {
    return new UserService($c->get(Database::class));
});
```

### `bind` x `singleton`

```php
// Nova instância a cada make()
$app->bind('report', fn() => new Report());
$app->make('report') !== $app->make('report'); // true

// Mesma instância sempre
$app->singleton(Cache::class, fn() => new FileCache('/tmp/cache'));
$app->make(Cache::class) === $app->make(Cache::class); // true

// Equivalente a singleton
$app->bind(Cache::class, fn() => new FileCache('/tmp/cache'), true);
```

### Instâncias e valores

```php
$app->instance(ApiClient::class, new ApiClient($_ENV['API_KEY'] ?? ''));
$app->instance('app.timezone', 'America/Sao_Paulo');
```

### Aliases

```php
$app->singleton(Cache::class, fn() => new FileCache('/tmp/cache'));
$app->alias('cache', Cache::class);

$app->make('cache') === $app->make(Cache::class); // true
```

### Interfaces

Para vincular uma interface a uma implementação, use uma closure que construa o objeto:

```php
$app->bind(UserRepositoryInterface::class, fn(Container $c) => new SqlUserRepository(
    $c->get(Database::class)
));
```

> **Atenção:** quando `$concrete` não é uma closure, o valor é devolvido como está. `$app->bind(UserRepositoryInterface::class, SqlUserRepository::class)` faz `make()` retornar a **string** `'SqlUserRepository'`, não uma instância.

## Resolvendo Serviços

```php
$service = $app->make(UserService::class);

if ($app->has('cache')) {
    $cache = $app->make('cache');
}

// Acesso direto ao contêiner PSR-11
$db = $app->getContainer()->get(Database::class);
```

O contêiner **não faz resolução automática (autowiring)**: apenas serviços registrados podem ser resolvidos. Resolver um identificador não registrado lança `PivotPHP\Core\Exceptions\Container\ServiceNotFoundException` (que implementa `Psr\Container\NotFoundExceptionInterface`). Erros dentro de uma fábrica são relançados como `PivotPHP\Core\Exceptions\Container\ContainerException`.

## Removendo Serviços

Os métodos de remoção estão no contêiner:

```php
$app->getContainer()->forget(Cache::class); // remove um serviço
$app->getContainer()->flush();              // remove todos os serviços e aliases
```

> `flush()` também remove os serviços internos registrados pelos provedores do framework. Use apenas em testes.

## Provedores de Serviço

Organize registros relacionados em [provedores de serviço]({{ '/pt/docs/providers/' | relative_url }}):

```php
namespace App\Providers;

use PivotPHP\Core\Providers\Container;
use PivotPHP\Core\Providers\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Cache::class, fn() => new FileCache('/tmp/cache'));

        $this->app->bind(UserRepositoryInterface::class, fn(Container $c) => new SqlUserRepository(
            $c->get(Database::class)
        ));
    }
}
```

## Padrões Comuns

### Decorator

```php
$app->singleton(Cache::class, function (Container $c) {
    $cache = new FileCache('/tmp/cache');

    if (($_ENV['APP_ENV'] ?? 'production') === 'local') {
        return new LoggingCache($cache, $c->get(LoggerInterface::class));
    }

    return $cache;
});
```

### Strategy por configuração

```php
$app->bind(PaymentGateway::class, function () use ($app) {
    return match ($app->getConfig()->get('payment.gateway')) {
        'stripe' => new StripeGateway(),
        'paypal' => new PayPalGateway(),
        default => throw new RuntimeException('Gateway de pagamento inválido'),
    };
});
```

## Testando com o Contêiner

Substitua dependências por dublês com `instance()` antes de resolver o serviço:

```php
use PHPUnit\Framework\TestCase;
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Providers\Container;

class UserServiceTest extends TestCase
{
    public function testUsaRepositorioInjetado(): void
    {
        $app = new Application();

        $repo = $this->createMock(UserRepositoryInterface::class);
        $app->instance(UserRepositoryInterface::class, $repo);
        $app->bind(UserService::class, fn(Container $c) => new UserService(
            $c->get(UserRepositoryInterface::class)
        ));

        $this->assertInstanceOf(UserService::class, $app->make(UserService::class));
    }
}
```

## Boas Práticas

1. **Registre por interface**: vincule interfaces a fábricas que constroem a implementação.
2. **Sempre use closures para objetos**: o contêiner não instancia classes a partir do nome.
3. **Prefira injeção no construtor**: resolva dependências na fábrica e passe-as ao construtor, em vez de chamar o contêiner dentro das classes.
4. **Use `singleton` para serviços caros**: conexões e clientes HTTP raramente precisam ser recriados.
5. **Organize em provedores**: agrupe registros relacionados em provedores de serviço.
