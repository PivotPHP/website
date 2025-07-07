#!/bin/bash

# Script to create Portuguese documentation structure
echo "Creating Portuguese documentation pages..."

# Create quickstart page
cat > pt/_docs/quickstart.md << 'EOF'
---
layout: docs-i18n
title: Início Rápido
permalink: /pt/docs/quickstart/
lang: pt
---

# Início Rápido

Este guia mostrará como criar sua primeira aplicação PivotPHP. Vamos construir uma API REST simples para gerenciar tarefas.

## Passo 1: Crie Sua Aplicação

Primeiro, crie um novo arquivo `public/index.php`:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use Helix\Core\Application;

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
```

## O Que Vem a Seguir?

Parabéns! Você construiu sua primeira aplicação PivotPHP. Para aprender mais:

- Explore [Roteamento]({{ '/pt/docs/routing/' | relative_url }}) para recursos avançados de roteamento
- Aprenda sobre [Middleware]({{ '/pt/docs/middleware/' | relative_url }}) para processamento de requisições
- Entenda o [Container de Serviços]({{ '/pt/docs/container/' | relative_url }}) para injeção de dependência
- Confira integração com [Banco de Dados]({{ '/pt/docs/database/' | relative_url }}) usando Cycle ORM
EOF

echo "Portuguese documentation structure created!"
echo "Don't forget to:"
echo "1. Translate remaining documentation pages"
echo "2. Update permalinks in each file"
echo "3. Test the language switcher"
