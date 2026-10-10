---
redirect_from:
  - /docs/extensions/
  - /en/docs/extensions/
  - /en/extensions/
layout: docs
title: Extensões
permalink: /pt/docs/extensions/
lang: pt
---

O núcleo do PivotPHP 4.0 é enxuto: aplicação, roteamento e pipeline. Recursos adicionais vivem em
pacotes (alguns instalados junto com o core) ou em service providers de terceiros.

## Pacotes do ecossistema

| Pacote | Papel | Ativo? |
|---|---|---|
| [`pivotphp/core`](https://github.com/PivotPHP/pivotphp-core) | Framework (aplicação + pipeline) | ✅ |
| [`pivotphp/core-routing`](https://github.com/PivotPHP/pivotphp-core-routing) | Motor de roteamento | ✅ |
| [`pivotphp/http`](https://github.com/PivotPHP/pivotphp-http) | Camada HTTP (`ExpressRequest`/`ExpressResponse`) sobre PSR-7 | ✅ |
| [`pivotphp/security`](https://github.com/PivotPHP/pivotphp-security) | Middlewares de segurança (CORS, headers, CSRF, JWT, rate limit) | ✅ |
| [`pivotphp/skeleton`](https://github.com/PivotPHP/pivotphp-skeleton) | Template `composer create-project` | ✅ |
| [`pivotphp/cycle-orm`]({{ '/pt/docs/extensions/cycle-orm/' | relative_url }}) | Integração com Cycle ORM | ⏸️ **Pausado** (só core 1.x) |

Os três primeiros são instalados automaticamente com o `pivotphp/core`. O `pivotphp/security` também
vem como dependência do core.

## Módulos integrados ao core

- **OpenAPI/Swagger** — `ApiDocumentationMiddleware` gera a especificação OpenAPI 3 a partir das
  rotas (ver [Documentação de API]({{ '/pt/docs/api-documentation/' | relative_url }})).
- **Container PSR-11** — `PivotPHP\Core\Providers\Container` (ver [Container]({{ '/pt/docs/container/' | relative_url }})).
- **Eventos PSR-14** — `PivotPHP\Core\Events\EventDispatcher` (ver [Eventos]({{ '/pt/docs/events/' | relative_url }})).
- **Hooks** — `HookManager` (actions/filters) para extensões.
- **Logging PSR-3** — `PivotPHP\Core\Logging\PsrLogger`.
- **Validação** — `PivotPHP\Core\Validation\Validator`.
- **Banco de dados** — `PivotPHP\Core\Database\Database` (PDO).
- **Service providers** — mecanismo de extensão (ver [Provedores]({{ '/pt/docs/providers/' | relative_url }})).

## Criando uma extensão

Extensões são service providers. Estenda `PivotPHP\Core\Providers\ServiceProvider`:

```php
namespace SeuVendor\SuaExtensao;

use PivotPHP\Core\Providers\ServiceProvider;

final class SuaExtensaoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Apenas vincule serviços ao contêiner.
        $this->app->singleton(SeuServico::class, fn () => new SeuServico());
    }

    public function boot(): void
    {
        // Todos os providers já foram registrados: registre rotas, middleware ou hooks.
    }
}
```

Registre a extensão antes do boot:

```php
use App\Providers\SuaExtensaoServiceProvider;
use PivotPHP\Core\Core\Application;

$app = new Application();
$app->register(SuaExtensaoServiceProvider::class);
$app->run();
```

Há também o atalho `$app->registerExtension($nome, $providerClass)`, que usa o gerenciador de
extensões do framework.

### Estrutura típica

```
sua-extensao/
├── src/
│   ├── Providers/
│   │   └── SuaExtensaoServiceProvider.php
│   ├── Services/
│   └── Middleware/
├── tests/
├── composer.json
└── README.md
```

## Diretrizes

- Siga PSR-4, PSR-12, PSR-7 e PSR-15.
- Use `declare(strict_types=1)` e passe PHPStan nível 9.
- Inclua testes e documentação.
- Use versionamento semântico e declare a versão do `pivotphp/core` com a qual é compatível.
