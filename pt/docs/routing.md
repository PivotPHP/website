---
layout: docs-i18n
title: Roteamento
permalink: /pt/docs/roteamento/
lang: pt
---

# Roteamento

O HelixPHP fornece um sistema de roteamento semelhante ao Express.js que é intuitivo e poderoso. As rotas são definidas usando métodos de verbos HTTP na instância da aplicação.

## Roteamento Básico

A rota mais básica aceita uma URI e uma closure:

```php
$app->get('/', function($request, $response) {
    return $response->send('Olá Mundo!');
});
```

### Métodos de Roteador Disponíveis

O HelixPHP suporta todos os verbos HTTP padrão:

```php
$app->get($uri, $callback);
$app->post($uri, $callback);
$app->put($uri, $callback);
$app->patch($uri, $callback);
$app->delete($uri, $callback);
$app->options($uri, $callback);
$app->head($uri, $callback);
```

Você também pode corresponder a múltiplos verbos usando o método `match`:

```php
$app->match(['get', 'post'], '/contato', function($req, $res) {
    // Manipula GET ou POST
});
```

Ou responder a todos os verbos HTTP usando o método `any`:

```php
$app->any('/api/*', function($req, $res) {
    // Manipula qualquer verbo HTTP
});
```

## Parâmetros de Rota

### Parâmetros Obrigatórios

Capture segmentos da URI usando parâmetros de rota:

```php
$app->get('/usuario/{id}', function($req, $res) {
    $userId = $req->param('id');
    return $res->json(['user_id' => $userId]);
});
```

Você pode ter múltiplos parâmetros:

```php
$app->get('/posts/{ano}/{mes}/{slug}', function($req, $res) {
    $ano = $req->param('ano');
    $mes = $req->param('mes');
    $slug = $req->param('slug');
    
    // Encontrar post por ano, mês e slug
});
```

### Parâmetros Opcionais

Torne um parâmetro opcional adicionando um `?`:

```php
$app->get('/posts/{id?}', function($req, $res) {
    $id = $req->param('id', 'recentes'); // Padrão para 'recentes'
    
    if ($id === 'recentes') {
        // Retornar posts recentes
    } else {
        // Retornar post específico
    }
});
```

### Restrições de Expressão Regular

Você pode restringir parâmetros de rota usando expressões regulares:

```php
// Corresponder apenas IDs numéricos
$app->get('/usuario/{id:[0-9]+}', function($req, $res) {
    // $id é garantidamente numérico
});

// Corresponder padrão específico
$app->get('/posts/{slug:[a-z0-9-]+}', function($req, $res) {
    // $slug corresponde a letras minúsculas, números e hífens
});

// Padrão UUID
$app->get('/api/v1/recursos/{uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}', function($req, $res) {
    // Corresponde ao formato UUID
});
```

## Grupos de Rotas

Agrupe rotas relacionadas para compartilhar atributos comuns como middleware ou prefixos de URL:

```php
$app->group('/api', function($group) {
    // Todas as rotas neste grupo serão prefixadas com /api
    
    $group->get('/usuarios', function($req, $res) {
        // Corresponde: GET /api/usuarios
    });
    
    $group->post('/usuarios', function($req, $res) {
        // Corresponde: POST /api/usuarios
    });
    
    // Grupos aninhados
    $group->group('/v1', function($v1) {
        $v1->get('/status', function($req, $res) {
            // Corresponde: GET /api/v1/status
        });
    });
});
```

### Grupos com Middleware

Aplique middleware a todas as rotas em um grupo:

```php
$app->group('/admin', function($group) {
    // Todas as rotas de admin
})->middleware(['auth', 'admin']);

// Ou aplique middleware dentro do grupo
$app->group('/api', function($group) {
    $group->middleware('throttle:60,1');
    
    $group->get('/usuarios', function($req, $res) {
        // Com limite de taxa
    });
});
```

## Rotas de Controller

Em vez de closures, você pode usar classes de controller:

```php
// Ação única
$app->get('/usuarios', [UserController::class, 'index']);
$app->post('/usuarios', [UserController::class, 'store']);
$app->get('/usuarios/{id}', [UserController::class, 'show']);
$app->put('/usuarios/{id}', [UserController::class, 'update']);
$app->delete('/usuarios/{id}', [UserController::class, 'destroy']);

// Controller de recurso RESTful
$app->resource('/posts', PostController::class);
```

O método `resource` cria as seguintes rotas:

| Verbo | URI | Ação | Nome da Rota |
|-------|-----|------|--------------|
| GET | /posts | index | posts.index |
| GET | /posts/create | create | posts.create |
| POST | /posts | store | posts.store |
| GET | /posts/{id} | show | posts.show |
| GET | /posts/{id}/edit | edit | posts.edit |
| PUT/PATCH | /posts/{id} | update | posts.update |
| DELETE | /posts/{id} | destroy | posts.destroy |

## Rotas Nomeadas

Atribua nomes às rotas para fácil geração de URL:

```php
$app->get('/perfil', function($req, $res) {
    // Mostrar perfil
})->name('perfil');

$app->get('/posts/{id}', function($req, $res) {
    // Mostrar post
})->name('posts.show');

// Gerar URLs
$url = route('perfil'); // /perfil
$url = route('posts.show', ['id' => 123]); // /posts/123
```

## Vinculação de Modelo de Rota

Injete automaticamente instâncias de modelo em suas rotas:

```php
// Vinculação implícita
$app->get('/usuarios/{user}', function($req, $res, User $user) {
    return $res->json($user);
});

// Vinculação personalizada
$app->bind('user', function($value) {
    return User::where('slug', $value)->firstOrFail();
});

$app->get('/usuarios/{user}', function($req, $res, User $user) {
    // $user é resolvido por slug em vez de ID
});
```

## Rotas de Fallback

Defina uma rota de fallback que executa quando nenhuma outra rota corresponde:

```php
$app->fallback(function($req, $res) {
    return $res->status(404)->json([
        'erro' => 'Não Encontrado'
    ]);
});
```

## Cache de Rotas

Para produção, faça cache de suas rotas para melhor desempenho:

```bash
php helix route:cache
```

Limpe o cache de rotas ao fazer alterações:

```bash
php helix route:clear
```

## Melhores Práticas

1. **A ordem importa**: Defina rotas mais específicas antes das genéricas
2. **Use grupos de rotas**: Organize rotas relacionadas juntas
3. **Nomeie suas rotas**: Torna a geração de URL mais fácil e manutenível
4. **Use controllers**: Para lógica complexa, mova o código para classes de controller
5. **Valide parâmetros**: Use restrições de regex para garantir a validade dos parâmetros
6. **Cache em produção**: Sempre faça cache das rotas em produção para desempenho ideal