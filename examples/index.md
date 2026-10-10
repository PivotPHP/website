---
layout: default
title: Code Examples
description: Exemplos reais usando a API do PivotPHP 4.x
---

# Exemplos de Código

Exemplos usando a API atual do PivotPHP 4.x. Todos os handlers recebem
`PivotPHP\Http\ExpressRequest`/`ExpressResponse` e devem **retornar a resposta**.

## API básica

```php
use PivotPHP\Core\Core\Application;

$app = new Application();

$app->get('/api/status', fn ($req, $res) => $res->json([
    'status' => 'online',
    'timestamp' => time(),
    'version' => Application::VERSION,
]));

$app->run();
```

## CRUD em memória

```php
use PivotPHP\Core\Core\Application;

$app = new Application();

$users = [1 => ['id' => 1, 'name' => 'Ana', 'email' => 'ana@exemplo.com']];

$app->get('/api/users', fn ($req, $res) => $res->json(array_values($users)));

$app->get('/api/users/:id<\d+>', function ($req, $res) use ($users) {
    $user = $users[(int) $req->param('id')] ?? null;

    return $user === null ? $res->error(404, 'Usuário não encontrado') : $res->json($user);
});

$app->post('/api/users', function ($req, $res) use (&$users) {
    $name = $req->input('name');
    $email = $req->input('email');

    if (!is_string($name) || $name === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        return $res->status(422)->json(['errors' => ['name' => 'obrigatório', 'email' => 'inválido']]);
    }

    $id = max(array_keys($users)) + 1;
    $users[$id] = ['id' => $id, 'name' => $name, 'email' => $email];

    return $res->status(201)->header('Location', "/api/users/{$id}")->json($users[$id]);
});

$app->put('/api/users/:id<\d+>', function ($req, $res) use (&$users) {
    $id = (int) $req->param('id');
    if (!isset($users[$id])) {
        return $res->error(404, 'Usuário não encontrado');
    }

    $name = $req->input('name');
    if (is_string($name) && $name !== '') {
        $users[$id]['name'] = $name;
    }

    return $res->json($users[$id]);
});

$app->delete('/api/users/:id<\d+>', function ($req, $res) use (&$users) {
    $id = (int) $req->param('id');
    if (!isset($users[$id])) {
        return $res->error(404, 'Usuário não encontrado');
    }

    unset($users[$id]);

    return $res->noContent();
});

$app->run();
```

## Autenticação JWT

Os middlewares de segurança vêm do [`pivotphp/security`]({{ '/pt/docs/security/' | relative_url }})
(instalado com o core; o JWT precisa de `firebase/php-jwt`):

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Http\Factory\Psr17Factory;
use PivotPHP\Security\Jwt\{JwtAuthMiddleware, JwtConfig, JwtIssuer};

$app = new Application();
$factory = new Psr17Factory();

$jwt = new JwtConfig($_ENV['JWT_SECRET'], publicPaths: ['/login']);

$app->use(new JwtAuthMiddleware($factory, $jwt));

$app->post('/login', function ($req, $res) use ($jwt) {
    // ... validar credenciais ...
    $token = (new JwtIssuer($jwt))->issue(['sub' => '42'], ttl: 3600);

    return $res->json(['token' => $token]);
});

$app->get('/me', fn ($req, $res) => $res->json($req->psr7()->getAttribute('user')));

$app->run();
```

## Middleware e hooks

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Events\Event;

$app = new Application();

// Middleware global (callable)
$app->use(function ($req, $res, $next) {
    $response = $next($req->withAttribute('request_id', bin2hex(random_bytes(8))));
    return $response->withHeader('X-Powered-By', 'PivotPHP');
});

// Listener de evento (PSR-14)
$app->on(Event::class, fn (Event $e) => $app->getLogger()?->info($e->getName()));

$app->get('/ping', function ($req, $res) use ($app) {
    $app->dispatchEvent(new Event('ping', ['at' => time()]));
    return $res->json(['pong' => true]);
});

$app->run();
```

## Banco de dados (PDO)

A conexão PDO do core (`PivotPHP\Core\Database\Database`) usa prepared statements:

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Database\Database;

$app = new Application();

$app->singleton(Database::class, fn () => new Database([
    'driver'   => 'sqlite',
    'database' => __DIR__ . '/app.sqlite',
]));

$app->get('/users', function ($req, $res) use ($app) {
    $users = $app->make(Database::class)
        ->select('SELECT id, name FROM users WHERE active = ?', [1]);

    return $res->json($users);
});

$app->run();
```

## Próximos passos

- [Documentação]({{ '/pt/docs/' | relative_url }})
- [Início Rápido]({{ '/pt/docs/quickstart/' | relative_url }})
- [Roteamento]({{ '/pt/docs/routing/' | relative_url }})
- [Segurança]({{ '/pt/docs/security/' | relative_url }})
- Repositório: [github.com/PivotPHP](https://github.com/PivotPHP)
