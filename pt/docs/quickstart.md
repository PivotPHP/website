---
redirect_from:
  - /docs/quickstart/
  - /en/docs/quickstart/
  - /en/quickstart/
layout: docs
title: Início Rápido
permalink: /pt/docs/quickstart/
lang: pt
---

Este guia mostra como construir sua primeira API com o PivotPHP 4.0. Vamos criar uma API simples de
tarefas (em memória) em poucos minutos.

## Passo 1: Crie a aplicação

Crie `public/index.php`:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;

$app = new Application();

$app->get('/', fn ($req, $res) => $res->json([
    'message' => 'Bem-vindo ao PivotPHP!',
    'timestamp' => time(),
]));

$app->run();
```

Handlers recebem um `PivotPHP\Http\ExpressRequest` (`$req`) e um
`PivotPHP\Http\ExpressResponse` (`$res`) e **devem retornar a resposta**.

## Passo 2: Inicie o servidor de desenvolvimento

```bash
php -S localhost:8000 -t public
```

Acesse `http://localhost:8000` para ver o JSON.

## Passo 3: Adicione rotas

Uma API de tarefas em memória, cobrindo leitura de parâmetros de rota e do corpo da requisição:

```php
// Armazenamento em memória (apenas para demonstração)
$tasks = [];

// Listar todas as tarefas
$app->get('/tasks', fn ($req, $res) => $res->json(array_values($tasks)));

// Obter uma tarefa específica
$app->get('/tasks/:id', function ($req, $res) use (&$tasks) {
    $id = $req->param('id');

    return isset($tasks[$id])
        ? $res->json($tasks[$id])
        : $res->error(404, 'Tarefa não encontrada');
});

// Criar uma nova tarefa (JSON ou form)
$app->post('/tasks', function ($req, $res) use (&$tasks) {
    $title = $req->input('title');

    if (!is_string($title) || trim($title) === '') {
        return $res->status(422)->json(['errors' => ['title' => 'O título é obrigatório.']]);
    }

    $id = uniqid();
    $tasks[$id] = [
        'id' => $id,
        'title' => trim($title),
        'completed' => false,
        'created_at' => date('c'),
    ];

    return $res->status(201)->json($tasks[$id]);
});

// Atualizar uma tarefa
$app->put('/tasks/:id', function ($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->error(404, 'Tarefa não encontrada');
    }

    $completed = $req->input('completed');
    if (is_bool($completed)) {
        $tasks[$id]['completed'] = $completed;
    }

    return $res->json($tasks[$id]);
});

// Remover uma tarefa
$app->delete('/tasks/:id', function ($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->error(404, 'Tarefa não encontrada');
    }

    unset($tasks[$id]);

    return $res->noContent();
});
```

> `$req->param('id')` devolve a string capturada pela rota. Faça o cast (`(int)`, `(string)`) que
> precisar no handler.

## Passo 4: Adicione middleware

Middleware global é registrado com `$app->use()`. Ele pode ser PSR-15 ou um callable
`fn ($req, $res, $next)`:

```php
// Middleware de logging (callable)
$app->use(function ($req, $res, $next) {
    $start = microtime(true);

    // Executa o restante da pipeline
    $response = $next();

    error_log(sprintf(
        '[%s] %s %s - %sms',
        date('c'),
        $req->getMethod(),
        $req->getUri()->getPath(),
        round((microtime(true) - $start) * 1000, 2)
    ));

    return $response;
});
```

No callable, `$req` é o `ServerRequestInterface` do PSR-7, e `$next()` executa a pipeline (você pode
passar uma requisição modificada). Para segurança (CORS, headers, CSRF, JWT) use os middlewares de
[`pivotphp/security`]({{ '/pt/docs/security/' | relative_url }}).

## Passo 5: Organize em controllers

Métodos públicos podem ser usados como array callable `[Controller::class, 'metodo']`:

```php
<?php
// app/Controllers/TaskController.php
namespace App\Controllers;

use PivotPHP\Http\ExpressRequest;
use PivotPHP\Http\ExpressResponse;
use Psr\Http\Message\ResponseInterface;

final class TaskController
{
    /** @var array<string, array<string, mixed>> */
    private array $tasks = [];

    public function index(ExpressRequest $req, ExpressResponse $res): ResponseInterface
    {
        return $res->json(array_values($this->tasks));
    }

    public function show(ExpressRequest $req, ExpressResponse $res): ResponseInterface
    {
        $task = $this->tasks[$req->param('id')] ?? null;

        return $task === null ? $res->error(404, 'Tarefa não encontrada') : $res->json($task);
    }

    public function store(ExpressRequest $req, ExpressResponse $res): ResponseInterface
    {
        $title = $req->input('title');

        if (!is_string($title) || trim($title) === '') {
            return $res->status(422)->json(['errors' => ['title' => 'O título é obrigatório.']]);
        }

        $id = uniqid();
        $this->tasks[$id] = ['id' => $id, 'title' => trim($title), 'completed' => false];

        return $res->status(201)->json($this->tasks[$id]);
    }
}
```

Registre as rotas e, se o controller tiver dependências de construtor, registre-o no contêiner:

```php
use App\Controllers\TaskController;

// Controllers sem dependências são instanciados sob demanda.
$app->get('/tasks', [TaskController::class, 'index']);
$app->get('/tasks/:id', [TaskController::class, 'show']);
$app->post('/tasks', [TaskController::class, 'store']);
```

> A sintaxe em string `'TaskController@index'` **não** é suportada (lança `TypeError`). Use sempre o
> array callable `[TaskController::class, 'index']`.

## Próximos passos

- [Roteamento]({{ '/pt/docs/routing/' | relative_url }}) — parâmetros, constraints e grupos
- [Middleware]({{ '/pt/docs/middleware/' | relative_url }}) — pipeline PSR-15
- [Requisições e Respostas]({{ '/pt/docs/requests-responses/' | relative_url }}) — a API de `$req`/`$res`
- [Container]({{ '/pt/docs/container/' | relative_url }}) — injeção de dependência
- [Segurança]({{ '/pt/docs/security/' | relative_url }}) — CORS, headers, CSRF, JWT
