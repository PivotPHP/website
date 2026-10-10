---
redirect_from:
  - /docs/middleware/
  - /en/docs/middleware/
  - /en/middleware/
layout: docs
title: Middleware
permalink: /pt/docs/middleware/
lang: pt
---

Middleware no PivotPHP segue o padrão **PSR-15**. Cada requisição atravessa a pilha de middlewares
globais e, em seguida, o roteamento; a resposta percorre o caminho de volta.

```
Requisição → Middleware 1 → Middleware 2 → Rota (handler)
                                                ↓
Resposta  ← Middleware 1 ← Middleware 2 ← Resposta
```

## Registrando middleware global

Use `$app->use()`. Um middleware pode ser uma classe PSR-15 ou um callable
`fn ($req, $res, $next)`. O nome de uma classe também pode ser passado como string: ela é resolvida
pelo contêiner (ou instanciada) automaticamente.

```php
// Classe PSR-15
$app->use(new TimingMiddleware());

// Nome da classe (resolvido pelo contêiner)
$app->use(RateLimitMiddleware::class);

// Callable
$app->use(function ($req, $res, $next) {
    $response = $next();
    return $response->withHeader('X-Powered-By', 'PivotPHP');
});
```

Middlewares globais rodam em ordem de registro, **antes do roteamento** — inclusive para `404` e
preflight `OPTIONS`.

## Escrevendo middleware PSR-15

```php
namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class AuthMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        if ($request->getHeaderLine('Authorization') === '') {
            return (new \PivotPHP\Http\ExpressResponse())->error(401, 'Não autorizado');
        }

        // Modifique a requisição e siga a pipeline.
        return $handler->handle($request->withAttribute('authenticated', true));
    }
}
```

## Middleware callable

No formato callable, `$req` é o `ServerRequestInterface` do PSR-7 e `$res` é um
`ExpressResponse`. `$next()` executa o restante da pipeline e aceita, opcionalmente, uma requisição
modificada.

```php
$app->use(function ($req, $res, $next) {
    // Antes: pode curto-circuitar respondendo sem chamar $next().
    if ($req->getHeaderLine('X-Block') !== '') {
        return $res->error(403, 'Bloqueado');
    }

    // Modificar a requisição e continuar.
    $response = $next($req->withAttribute('request_id', bin2hex(random_bytes(8))));

    return $response->withHeader('X-Handled', 'yes');
});
```

> Cabeçalhos definidos em `$res` **não** são mesclados automaticamente na resposta devolvida por
> `$next()`. Para alterar a resposta final, use `withHeader()` no retorno de `$next()`.

## Middleware por rota e por grupo

A `Application` não tem `$app->use('/caminho', $middleware)`. Para um grupo de rotas, passe os
middlewares para `group()`; para uma única rota, passe-os depois dos metadados:

```php
$app->group('/admin', function () use ($app): void {
    $app->get('/stats', fn ($req, $res) => $res->json(['ok' => true]));
}, [$requireAdmin]);

$app->get('/health', fn ($req, $res) => $res->json(['ok' => true]), [], $logRequest);
```

## Ordem de execução

Middlewares executam na ordem em que são registrados; a resposta volta na ordem inversa.

```php
$app->use(new Middleware1()); // executa primeiro
$app->use(new Middleware2()); // executa depois
$app->use(new Middleware3()); // executa por último
// Ordem: 1 → 2 → 3 → handler → 3 → 2 → 1
```

## Middleware de segurança

Os middlewares de segurança (CORS, headers, CSRF, JWT, rate limiting, proxies confiáveis) vêm do
pacote [`pivotphp/security`]({{ '/pt/docs/security/' | relative_url }}) e são registrados com
`$app->use()` como qualquer outro middleware. A ordem recomendada é:

```text
TrustedProxy → SecurityHeaders → CORS → RateLimit → (body parsing) → CSRF → JWT → rotas
```

## Boas práticas

1. **Uma responsabilidade por middleware.**
2. **A ordem importa**: registre na sequência correta.
3. **Curto-circuito explícito**: para erros, retorne a resposta sem chamar `$next()`.
4. **Requisições imutáveis**: use `withAttribute()`/`withHeader()` em vez de mutar o objeto.
5. **Guarde dados em atributos** da requisição (`getAttribute()`/`withAttribute()`) para consumi-los
   nos handlers.
