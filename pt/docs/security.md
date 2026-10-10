---
redirect_from:
  - /docs/security/
  - /en/docs/security/
  - /en/security/
layout: docs
title: Segurança
permalink: /pt/docs/security/
lang: pt
---

A partir da versão 4.0, os middlewares de segurança **não fazem parte do core**: eles vivem no pacote
[`pivotphp/security`](https://github.com/PivotPHP/pivotphp-security), que é instalado junto com o
`pivotphp/core`. O pacote segue o padrão PSR-15 e funciona com qualquer pipeline PSR-15.

Princípios do pacote:

- **Um middleware por preocupação**: CORS, proxies confiáveis, headers, CSRF, JWT e rate limiting.
- **Fail closed**: uma checagem que falha devolve `401`/`403`/`429` e nunca alcança o handler.
- **Configuração validada**: ajustes inseguros (origem `*` com credenciais, segredo JWT vazio,
  `POST` declarado "seguro"...) lançam `InvalidConfigurationException` no momento em que a
  configuração é construída.

## Instalação

```bash
composer require pivotphp/security
```

Os middlewares que geram respostas recebem uma `ResponseFactoryInterface` PSR-17 (por exemplo
`PivotPHP\Http\Factory\Psr17Factory` ou `Nyholm\Psr7\Factory\Psr17Factory`). Cada adapter depende da
sua biblioteca, instalada sob demanda:

| Middleware | Biblioteca | Instalação |
|---|---|---|
| `Cors\CorsMiddleware` | — | — |
| `Proxy\TrustedProxyMiddleware` | — | — |
| `Headers\SecurityHeadersMiddleware` | [bepsvpt/secure-headers](https://github.com/bepsvpt/secure-headers) | `composer require bepsvpt/secure-headers` |
| `Csrf\CsrfMiddleware` | [yiisoft/csrf](https://github.com/yiisoft/csrf) | `composer require yiisoft/csrf` |
| `Jwt\JwtAuthMiddleware`, `Jwt\JwtIssuer` | [firebase/php-jwt](https://github.com/firebase/php-jwt) | `composer require firebase/php-jwt` |
| `RateLimit\RateLimitMiddleware` | [symfony/rate-limiter](https://symfony.com/doc/current/rate_limiter.html) | `composer require symfony/rate-limiter` |

## Ordem recomendada

```text
TrustedProxy → SecurityHeaders → CORS → RateLimit → (body parsing) → CSRF → JWT → rotas
```

- **TrustedProxy primeiro**, para que todo middleware seguinte veja o IP real do cliente.
- **SecurityHeaders e CORS antes de qualquer coisa que rejeite**, para que respostas `401`/`403`/`429`
  ainda tragam os cabeçalhos de segurança e CORS.
- **CORS antes da autenticação**: requisições preflight não carregam credenciais.
- **Body parsing antes do CSRF**, para que os campos de formulário estejam visíveis.

## CORS

```php
use PivotPHP\Http\Factory\Psr17Factory;
use PivotPHP\Security\Cors\CorsConfig;
use PivotPHP\Security\Cors\CorsMiddleware;

$cors = new CorsMiddleware(new Psr17Factory(), new CorsConfig(
    allowedOrigins: ['https://app.exemplo.com'],
    allowCredentials: true,
));

$app->use($cors);
```

| Opção | Padrão | Observação |
|---|---|---|
| `allowedOrigins` | `[]` | `scheme://host[:port]` exato, minúsculo, sem path. `['*']` libera qualquer origem. |
| `allowedMethods` | `GET, POST, PUT, PATCH, DELETE` | |
| `allowedHeaders` | `Content-Type, Authorization` | Cabeçalhos aceitos no preflight. |
| `exposedHeaders` | `[]` | Cabeçalhos legíveis pelo navegador. |
| `allowCredentials` | `false` | |
| `maxAge` | `600` | Cache do preflight em segundos; `null` omite o cabeçalho. |

Comportamento: requisições sem `Origin` passam direto; o preflight (`OPTIONS` +
`Access-Control-Request-Method`) é respondido pelo middleware (`204` quando permitido, `403` caso
contrário) e nunca alcança o handler. `'*'` combinado com `allowCredentials: true` é rejeitado na
configuração.

## Proxies confiáveis

```php
use PivotPHP\Security\Proxy\TrustedProxyConfig;
use PivotPHP\Security\Proxy\TrustedProxyMiddleware;

$app->use(new TrustedProxyMiddleware(new TrustedProxyConfig(
    trustedProxies: ['10.0.0.0/8', '2001:db8::/32'],
)));

// depois: $request->getAttribute('client_ip')
```

O cabeçalho de encaminhamento (`X-Forwarded-For` por padrão) só é considerado quando o `REMOTE_ADDR`
é um proxy confiável. A cadeia é lida da direita para a esquerda; o primeiro endereço não confiável é
o cliente.

## Headers de segurança

```php
use PivotPHP\Security\Headers\SecurityHeadersMiddleware;

$app->use(new SecurityHeadersMiddleware()); // padrões para APIs
```

Cabeçalhos enviados por padrão:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'none'; frame-ancestors 'none'
X-Permitted-Cross-Domain-Policies: none
```

`X-XSS-Protection` (descontinuado) não é enviado. Há `SecurityHeadersConfig` para ajustar HSTS, CSP,
`Referrer-Policy`, `frameOptions` e outros via `overrides`.

## CSRF

Necessário quando a API se autentica com **cookies**. APIs com token no cabeçalho
`Authorization` não são expostas a CSRF.

```php
use PivotPHP\Http\Factory\Psr17Factory;
use PivotPHP\Security\Csrf\CsrfMiddleware;
use Yiisoft\Csrf\Hmac\HmacCsrfToken;
use Yiisoft\Csrf\MaskedCsrfToken;

$token = new MaskedCsrfToken(new HmacCsrfToken($identityGenerator, $secret, 'sha256', 3600));
$app->use(new CsrfMiddleware(new Psr17Factory(), $token, new \PivotPHP\Security\Csrf\CsrfConfig()));

// no handler: $request->getAttribute('csrf_token')->getValue()
```

Os tokens vêm do `yiisoft/csrf`. Por padrão o token é aceito do campo `_csrf` no corpo ou do
cabeçalho `X-CSRF-Token`; `GET`/`HEAD`/`OPTIONS` são considerados seguros e não são verificados.
Falhas devolvem `403` sem alcançar a rota.

## Autenticação JWT

```php
use PivotPHP\Http\Factory\Psr17Factory;
use PivotPHP\Security\Jwt\JwtAuthMiddleware;
use PivotPHP\Security\Jwt\JwtConfig;

$auth = new JwtAuthMiddleware(new Psr17Factory(), new JwtConfig(
    key: $_ENV['JWT_SECRET'],           // ≥ 32 bytes para HS256
    algorithm: 'HS256',
    publicPaths: ['/health', '/docs/*'],
));

$app->use($auth);

// no handler: $request->getAttribute('user') — as claims como array
```

Segredos vazios, segredos menores que o tamanho da saída do hash (32/48/64 bytes) e algoritmos
desconhecidos são rejeitados na configuração. Falhas de verificação devolvem `401` com
`WWW-Authenticate: Bearer`.

### Emitindo tokens

`JwtIssuer` compartilha a mesma `JwtConfig` usada pelo middleware, garantindo que tokens emitidos e
verificados coincidam:

```php
use PivotPHP\Security\Jwt\JwtIssuer;

$issuer = new JwtIssuer($config);                 // HS*: assina com o segredo configurado
$token  = $issuer->issue(['sub' => $userId], ttl: 3600);
```

Gere segredos HMAC com `bin2hex(random_bytes(32))` e guarde-os em variável de ambiente ou gerenciador
de segredos — nunca no código.

## Rate limiting

```php
use PivotPHP\Http\Factory\Psr17Factory;
use PivotPHP\Security\RateLimit\RateLimitConfig;
use PivotPHP\Security\RateLimit\RateLimitMiddleware;
use Symfony\Component\RateLimiter\RateLimiterFactory;

$limiter = new RateLimiterFactory(
    ['id' => 'login', 'policy' => 'sliding_window', 'limit' => 5, 'interval' => '1 minute'],
    $storage,      // e.g. CacheStorage sobre Redis
    $lockFactory,  // symfony/lock — necessário para contagem correta em concorrência
);

$app->use(new RateLimitMiddleware(new Psr17Factory(), $limiter, new RateLimitConfig(keyPrefix: 'login:')));
```

Ao exceder o limite, a resposta é `429` com `Retry-After` e `X-RateLimit-*`, sem alcançar o handler.
Em produção, use um storage compartilhado e um `LockFactory`; `InMemoryStorage` conta por processo.

## Hash de senhas

O pacote de segurança **não** fornece hashing de senhas. Use as funções nativas do PHP:

```php
$hash = password_hash($senha, PASSWORD_DEFAULT);

if (password_verify($senha, $hash)) {
    if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
        $hash = password_hash($senha, PASSWORD_DEFAULT);
        // atualize o hash armazenado
    }
}
```

## Boas práticas

1. **Mantenha o PivotPHP atualizado** para receber correções de segurança.
2. **Use HTTPS** em produção e envie HSTS pelos `SecurityHeadersMiddleware`.
3. **Valide toda entrada** do usuário.
4. **Segredos no ambiente**, nunca no código.
5. **Escape a saída** que for renderizada como HTML; o CSP restritivo padrão ajuda.
6. **Rate limiting em produção precisa de storage compartilhado e lock.**
7. **`app.debug` desligado** para não expor detalhes de exceções.
