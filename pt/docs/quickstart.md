---
layout: docs
title: Início Rápido
permalink: /pt/docs/quickstart/
lang: pt
---

Este guia mostrará como criar sua primeira aplicação PivotPHP. Vamos construir uma API REST simples para gerenciar tarefas.

## Passo 1: Crie Sua Aplicação

Primeiro, crie um novo arquivo `public/index.php`:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;

// Crie a instância da aplicação
$app = new Application();

// Defina sua primeira rota
$app->get('/', function($request, $response) {
    return $response->json([
        'message' => 'Bem-vindo ao PivotPHP!',
        'timestamp' => time()
    ]);
});

// Execute a aplicação
$app->run();
```

## Passo 2: Inicie o Servidor de Desenvolvimento

Execute o servidor de desenvolvimento PHP integrado:

```bash
php -S localhost:8000 -t public
```

Visite `http://localhost:8000` em seu navegador. Você deve ver uma resposta JSON.

## Passo 3: Adicione Mais Rotas

Vamos criar uma API simples de gerenciamento de tarefas:

```php
// Armazenamento de tarefas em memória (apenas para demonstração)
$tasks = [];

// Listar todas as tarefas
$app->get('/tasks', function($req, $res) use (&$tasks) {
    return $res->json($tasks);
});

// Obter uma tarefa específica
$app->get('/tasks/{id}', function($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->status(404)->json([
            'error' => 'Tarefa não encontrada'
        ]);
    }

    return $res->json($tasks[$id]);
});

// Criar uma nova tarefa
$app->post('/tasks', function($req, $res) use (&$tasks) {
    $data = $req->body();

    // Validação simples
    if (empty($data['title'])) {
        return $res->status(400)->json([
            'error' => 'Título é obrigatório'
        ]);
    }

    $id = uniqid();
    $task = [
        'id' => $id,
        'title' => $data['title'],
        'completed' => false,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $tasks[$id] = $task;

    return $res->status(201)->json($task);
});

// Atualizar uma tarefa
$app->put('/tasks/{id}', function($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->status(404)->json([
            'error' => 'Tarefa não encontrada'
        ]);
    }

    $data = $req->body();
    $tasks[$id] = array_merge($tasks[$id], $data);

    return $res->json($tasks[$id]);
});

// Deletar uma tarefa
$app->delete('/tasks/{id}', function($req, $res) use (&$tasks) {
    $id = $req->param('id');

    if (!isset($tasks[$id])) {
        return $res->status(404)->json([
            'error' => 'Tarefa não encontrada'
        ]);
    }

    unset($tasks[$id]);

    return $res->status(204);
});
```

## Passo 4: Adicione Middleware

Vamos adicionar um middleware de logging para registrar todas as requisições:

```php
// Middleware de logging
$app->use(function($req, $res, $next) {
    $start = microtime(true);

    // Processa a requisição
    $response = $next($req, $res);

    // Registra a requisição
    $duration = round((microtime(true) - $start) * 1000, 2);
    error_log(sprintf(
        "[%s] %s %s - %dms",
        date('Y-m-d H:i:s'),
        $req->method(),
        $req->path(),
        $duration
    ));

    return $response;
});

// Middleware de CORS
$app->use(function($req, $res, $next) {
    $res->header('Access-Control-Allow-Origin', '*');
    $res->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    $res->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if ($req->method() === 'OPTIONS') {
        return $res->status(204);
    }

    return $next($req, $res);
});
```

## Passo 5: Organizar o Código

Para um projeto real, você deve organizar seu código em classes e usar o Container de Serviços:

```php
// src/Controllers/TaskController.php
namespace App\Controllers;

class TaskController
{
    private array $tasks = [];

    public function index($request, $response)
    {
        return $response->json($this->tasks);
    }

    public function show($request, $response)
    {
        $id = $request->param('id');

        if (!isset($this->tasks[$id])) {
            return $response->status(404)->json([
                'error' => 'Tarefa não encontrada'
            ]);
        }

        return $response->json($this->tasks[$id]);
    }

    public function store($request, $response)
    {
        $data = $request->body();

        if (empty($data['title'])) {
            return $response->status(400)->json([
                'error' => 'Título é obrigatório'
            ]);
        }

        $id = uniqid();
        $task = [
            'id' => $id,
            'title' => $data['title'],
            'completed' => false,
            'created_at' => date('Y-m-d H:i:s')
        ];

        $this->tasks[$id] = $task;

        return $response->status(201)->json($task);
    }
}
```

Então registre as rotas usando o controller:

```php
// Registre o controller no container
$app->singleton(TaskController::class);

// Use o controller nas rotas
$app->get('/tasks', [TaskController::class, 'index']);
$app->get('/tasks/{id}', [TaskController::class, 'show']);
$app->post('/tasks', [TaskController::class, 'store']);
```

## O Que Vem a Seguir?

Parabéns! Você construiu sua primeira aplicação PivotPHP. Para aprender mais:

- Explore [Roteamento]({{ '/pt/docs/routing/' | relative_url }}) para recursos avançados de roteamento
- Aprenda sobre [Middleware]({{ '/pt/docs/middleware/' | relative_url }}) para processamento de requisições
- Entenda o [Container de Serviços]({{ '/pt/docs/container/' | relative_url }}) para injeção de dependência
- Confira integração com [Banco de Dados]({{ '/pt/docs/banco-de-dados/' | relative_url }}) usando Cycle ORM
- Implemente [Segurança]({{ '/pt/docs/seguranca/' | relative_url }}) para proteger suas rotas
- Adicione [Validação]({{ '/pt/docs/validacao/' | relative_url }}) para garantir integridade dos dados

### Recursos Adicionais

- [Repositório GitHub](https://github.com/pivotphp/framework)
- [Exemplos Completos](https://github.com/pivotphp/examples)
- [Comunidade Discord](https://discord.gg/pivotphp)
