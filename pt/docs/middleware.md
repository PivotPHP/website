---
layout: docs
title: Middleware
permalink: /pt/docs/middleware/
lang: pt
---

Middleware fornece um mecanismo conveniente para filtrar requisições HTTP que entram em sua aplicação. O PivotPHP implementa o padrão de middleware PSR-15, garantindo compatibilidade com o ecossistema PHP mais amplo.

## Entendendo Middleware

Pense no middleware como camadas de uma cebola. Cada requisição passa por essas camadas ao entrar, e a resposta passa por elas em ordem reversa ao sair.

```
Requisição → Middleware 1 → Middleware 2 → Middleware 3 → Handler da Rota
                                                                  ↓
Resposta ← Middleware 1 ← Middleware 2 ← Middleware 3 ← Resposta
```

## Criando Middleware

### Middleware com Closure

A maneira mais simples de criar middleware é usando uma closure:

```php
$app->middleware(function($request, $handler) {
    // Antes do processamento da requisição
    echo "Requisição chegando!\n";

    // Passar para o próximo middleware/handler
    $response = $handler->handle($request);

    // Após o processamento da requisição
    echo "Resposta saindo!\n";

    return $response;
});
```

### Middleware Baseado em Classes

Para middleware mais complexo, crie uma classe implementando `MiddlewareInterface`:

```php
namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Verificar se o usuário está autenticado
        $token = $request->getHeaderLine('Authorization');

        if (!$this->isValidToken($token)) {
            // Retornar cedo com resposta de erro
            return new JsonResponse([
                'erro' => 'Não autorizado'
            ], 401);
        }

        // Adicionar usuário à requisição
        $request = $request->withAttribute('user', $this->getUserFromToken($token));

        // Continuar para o próximo middleware
        return $handler->handle($request);
    }

    private function isValidToken(string $token): bool
    {
        // Lógica de validação do token
        return !empty($token);
    }

    private function getUserFromToken(string $token)
    {
        // Decodificar token e retornar usuário
        return ['id' => 1, 'nome' => 'João Silva'];
    }
}
```

## Registrando Middleware

### Middleware Global

Registre middleware que executa em toda requisição:

```php
// Usando uma closure
$app->middleware(function($req, $handler) {
    // Executa em toda requisição
    return $handler->handle($req);
});

// Usando uma classe
$app->middleware(new CorsMiddleware());
$app->middleware(new LoggingMiddleware());

// Usando nome da classe (será resolvido do container)
$app->middleware(RateLimitMiddleware::class);
```

### Middleware de Rota

Aplique middleware a rotas específicas:

```php
// Rota única
$app->get('/admin', function($req, $res) {
    return $res->json(['admin' => true]);
})->middleware('auth');

// Múltiplos middleware
$app->post('/api/usuarios', function($req, $res) {
    // Criar usuário
})->middleware(['auth', 'throttle:5,1']);

// Middleware com parâmetros
$app->get('/api/dados', function($req, $res) {
    // Obter dados
})->middleware('cache:300'); // Cache por 300 segundos
```

### Middleware de Grupo

Aplique middleware a grupos de rotas:

```php
$app->group('/api', function($group) {
    $group->get('/usuarios', [UserController::class, 'index']);
    $group->post('/usuarios', [UserController::class, 'store']);
})->middleware(['auth', 'throttle:60,1']);

// Ou dentro do grupo
$app->group('/admin', function($group) {
    $group->middleware(['auth', 'admin']);

    $group->get('/dashboard', function($req, $res) {
        // Dashboard do admin
    });
});
```

## Middleware Integrados

O PivotPHP inclui várias classes de middleware integradas:

### Middleware CORS

```php
use PivotPHP\Middleware\CorsMiddleware;

$app->middleware(new CorsMiddleware([
    'allowed_origins' => ['https://exemplo.com'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['Content-Type', 'Authorization'],
    'exposed_headers' => ['X-Total-Count'],
    'max_age' => 3600,
    'credentials' => true
]));
```

### Limitação de Taxa

```php
use PivotPHP\Middleware\RateLimitMiddleware;

$app->middleware(new RateLimitMiddleware([
    'max_attempts' => 60,
    'decay_minutes' => 1,
    'response_headers' => true // Adicionar headers X-RateLimit-*
]));

// Ou use o atalho
$app->middleware('throttle:60,1');
```

### Proteção CSRF

```php
use PivotPHP\Middleware\CsrfMiddleware;

$app->middleware(new CsrfMiddleware([
    'except' => ['/webhooks/*'], // Excluir caminhos
    'token_name' => '_token',
    'header_name' => 'X-CSRF-TOKEN'
]));
```

### Log de Requisições

```php
use PivotPHP\Middleware\LoggingMiddleware;

$app->middleware(new LoggingMiddleware([
    'logger' => $logger, // Logger PSR-3
    'level' => 'info',
    'format' => '{method} {uri} {status} {response_time}ms'
]));
```

## Parâmetros de Middleware

Passe parâmetros para middleware usando sintaxe de dois pontos:

```php
// Na definição da rota
$app->get('/cached', function($req, $res) {
    return $res->json(['hora' => time()]);
})->middleware('cache:300,public');

// Na classe middleware
class CacheMiddleware implements MiddlewareInterface
{
    private int $duration;
    private string $visibility;

    public function __construct(int $duration = 60, string $visibility = 'private')
    {
        $this->duration = $duration;
        $this->visibility = $visibility;
    }

    public function process($request, $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        return $response->withHeader(
            'Cache-Control',
            "{$this->visibility}, max-age={$this->duration}"
        );
    }
}
```

## Prioridade de Middleware

Middleware é executado na ordem em que é registrado:

```php
// Ordem de execução: 1 → 2 → 3 → Rota → 3 → 2 → 1
$app->middleware(new Middleware1()); // 1
$app->middleware(new Middleware2()); // 2
$app->middleware(new Middleware3()); // 3
```

Para middleware específico de rota:

```php
// Middleware global executa primeiro, depois middleware de rota
$app->middleware(new GlobalMiddleware());

$app->get('/teste', function($req, $res) {
    // Handler
})->middleware(new RouteMiddleware());

// Ordem: GlobalMiddleware → RouteMiddleware → Handler
```

## Middleware Condicional

Aplique middleware baseado em condições:

```php
class ConditionalMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        // Aplicar apenas a rotas de API
        if (str_starts_with($request->getUri()->getPath(), '/api/')) {
            // Aplicar lógica do middleware
            $request = $request->withHeader('X-API-Request', 'true');
        }

        return $handler->handle($request);
    }
}
```

## Melhores Práticas de Middleware

1. **Mantenha middleware focado**: Cada middleware deve ter uma única responsabilidade
2. **A ordem importa**: Registre middleware na ordem correta
3. **Retornos antecipados**: Retorne cedo para condições de erro para evitar processamento desnecessário
4. **Requisições imutáveis**: Sempre crie novas instâncias de requisição em vez de modificar
5. **Use atributos**: Armazene dados do middleware em atributos da requisição
6. **Trate exceções**: Capture e trate exceções apropriadamente

## Exemplo: Middleware de Autenticação Personalizado

Aqui está um exemplo completo de middleware de autenticação JWT:

```php
namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class JwtAuthMiddleware implements MiddlewareInterface
{
    private string $secret;
    private array $except = [];

    public function __construct(string $secret, array $except = [])
    {
        $this->secret = $secret;
        $this->except = $except;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Verificar se a rota está excluída
        $path = $request->getUri()->getPath();
        foreach ($this->except as $pattern) {
            if (fnmatch($pattern, $path)) {
                return $handler->handle($request);
            }
        }

        // Extrair token
        $token = $this->extractToken($request);
        if (!$token) {
            return $this->unauthorizedResponse('Token não fornecido');
        }

        try {
            // Decodificar token
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));

            // Adicionar usuário à requisição
            $request = $request->withAttribute('user', $decoded->user);
            $request = $request->withAttribute('token', $decoded);

            return $handler->handle($request);
        } catch (\Exception $e) {
            return $this->unauthorizedResponse('Token inválido');
        }
    }

    private function extractToken(ServerRequestInterface $request): ?string
    {
        $header = $request->getHeaderLine('Authorization');

        if (preg_match('/Bearer\s+(.+)/', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function unauthorizedResponse(string $message): ResponseInterface
    {
        return new JsonResponse([
            'erro' => $message
        ], 401);
    }
}

// Uso
$app->middleware(new JwtAuthMiddleware($_ENV['JWT_SECRET'], [
    '/login',
    '/registrar',
    '/publico/*'
]));
```
