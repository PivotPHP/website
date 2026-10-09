---
redirect_from:
  - /docs/providers/
  - /en/docs/providers/
  - /en/providers/
layout: docs
title: Provedores de Serviços
permalink: /pt/docs/providers/
lang: pt
---

Provedores de serviços (service providers) são classes que agrupam o registro de serviços no contêiner da aplicação. O próprio PivotPHP usa provedores para inicializar seus serviços internos (contêiner, eventos, logging, hooks, extensões e roteamento).

## Escrevendo um Provedor

Todo provedor estende a classe abstrata `PivotPHP\Core\Providers\ServiceProvider`. O construtor recebe a instância de `Application`, disponível em `$this->app`.

| Método | Obrigatório | Quando é chamado |
|---|---|---|
| `register(): void` | Sim | Imediatamente, quando o provedor é registrado |
| `boot(): void` | Não | Durante `$app->boot()`, depois que todos os provedores foram registrados |

```php
<?php

namespace App\Providers;

use App\Services\Mailer;
use PivotPHP\Core\Providers\ServiceProvider;

class MailServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Apenas vincule serviços ao contêiner aqui
        $this->app->singleton(Mailer::class, function () {
            return new Mailer($_ENV['MAIL_FROM'] ?? 'noreply@exemplo.com');
        });
    }

    public function boot(): void
    {
        // Aqui todos os provedores já foram registrados:
        // é seguro resolver serviços, adicionar rotas ou middleware
        $this->app->get('/mail/from', function ($req, $res) {
            return $res->json(['from' => $this->app->make(Mailer::class)->from]);
        });
    }
}
```

### O método `register`

Use `register()` somente para vincular serviços ao contêiner. Os métodos disponíveis em `$this->app` para isso são:

```php
$this->app->bind('report', fn() => new Report());              // nova instância a cada resolução
$this->app->singleton(Cache::class, fn() => new FileCache());  // instância compartilhada
$this->app->instance('api.key', $_ENV['API_KEY'] ?? '');       // valor já construído
$this->app->alias('cache', Cache::class);                      // nome alternativo
```

### O método `boot`

`boot()` é chamado uma única vez, dentro de `$app->boot()` (que `run()` e `handle()` executam automaticamente se ainda não tiver sido chamado). Nesse ponto, todos os provedores já executaram `register()`, então você pode resolver serviços com `$this->app->make()`, registrar rotas e middleware.

## Registrando Provedores

### Com `$app->register()`

`register()` aceita o nome da classe ou uma instância:

```php
use PivotPHP\Core\Core\Application;
use App\Providers\MailServiceProvider;

$app = new Application();

$app->register(MailServiceProvider::class);
// ou
$app->register(new MailServiceProvider($app));

$app->run();
```

Registrar a mesma classe duas vezes não tem efeito: a segunda chamada é ignorada.

### Pela configuração `app.providers`

Durante o boot, a aplicação também registra as classes listadas na chave de configuração `app.providers`:

```php
$app->getConfig()->set('app.providers', [
    App\Providers\MailServiceProvider::class,
]);
```

### Registre antes do boot

O `boot()` de um provedor só é executado se ele for registrado **antes** de `$app->boot()`. Um provedor registrado depois disso tem seu `register()` executado normalmente, mas o seu `boot()` nunca é chamado. Registre todos os provedores antes de `$app->run()`/`$app->handle()`.

## `provides()` e `isDeferred()`

A classe base também declara `provides(): array` (retorna `[]`) e `isDeferred(): bool` (retorna `false`). A `Application` **não** usa esses métodos: não existe carregamento adiado (deferred) de provedores — todo provedor registrado executa `register()` imediatamente.

## Provedores Internos

A aplicação registra automaticamente, nesta ordem:

| Provedor | Responsabilidade |
|---|---|
| `ContainerServiceProvider` | Serviços básicos do contêiner |
| `EventServiceProvider` | Despachante de eventos (PSR-14) |
| `LoggingServiceProvider` | Logger (PSR-3) |
| `HookServiceProvider` | Sistema de hooks (actions/filters) |
| `ExtensionServiceProvider` | Gerenciador de extensões |
| `RoutingServiceProvider` | Roteador |

Todos ficam no namespace `PivotPHP\Core\Providers`.

## Testando um Provedor

```php
use App\Providers\MailServiceProvider;
use App\Services\Mailer;
use PivotPHP\Core\Core\Application;
use PHPUnit\Framework\TestCase;

class MailServiceProviderTest extends TestCase
{
    public function testRegistraMailerComoSingleton(): void
    {
        $app = new Application();
        $app->register(MailServiceProvider::class);

        $this->assertTrue($app->has(Mailer::class));
        $this->assertSame($app->make(Mailer::class), $app->make(Mailer::class));
    }
}
```

## Boas Práticas

1. **Um provedor por responsabilidade**: agrupe apenas serviços relacionados.
2. **`register()` só vincula**: não resolva outros serviços dentro de `register()`; faça isso em `boot()`.
3. **Registre antes do boot**: provedores registrados depois de `$app->boot()` não têm `boot()` executado.
4. **Evite trabalho pesado**: prefira closures em `bind`/`singleton` para que os serviços só sejam construídos quando resolvidos.
