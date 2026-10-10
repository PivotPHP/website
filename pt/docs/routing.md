---
redirect_from:
  - /docs/routing/
  - /en/docs/routing/
  - /en/routing/
layout: docs
title: Roteamento
permalink: /pt/docs/routing/
lang: pt
---

O roteamento do PivotPHP é inspirado no Express.js. As rotas são registradas na instância da
aplicação e cada handler **deve retornar a resposta**.

## Roteamento básico

```php
$app->get('/', fn ($req, $res) => $res->send('Olá Mundo!'));
```

### Métodos disponíveis

A `Application` expõe um método por verbo HTTP:

```php
$app->get($caminho, $handler);
$app->post($caminho, $handler);
$app->put($caminho, $handler);
$app->patch($caminho, $handler);
$app->delete($caminho, $handler);
```

`HEAD` reutiliza a rota `GET` correspondente. Para `OPTIONS` em um caminho conhecido, o framework
responde `204` com o cabeçalho `Allow`. Se um caminho casar com outro verbo, a resposta é `405` +
`Allow`; se nenhuma rota casar, é `404`. Verbetes adicionais (`options()`, `head()`, `any()`) existem
no roteador de baixo nível (`PivotPHP\Routing\Router\Router`), não na `Application`.

## Parâmetros de rota

Capture segmentos do caminho com `:nome` (ou `{nome}`) e leia-os com `$req->param()`:

```php
$app->get('/usuario/:id', fn ($req, $res) => $res->json(['user_id' => $req->param('id')]));
$app->get('/arquivos/{nome}', fn ($req, $res) => $res->json($req->params()));
```

Múltiplos parâmetros:

```php
$app->get('/posts/:ano/:mes/:slug', fn ($req, $res) => $res->json([
    'ano'  => $req->param('ano'),
    'mes'  => $req->param('mes'),
    'slug' => $req->param('slug'),
]));
```

> Os parâmetros de rota chegam como **string**. Faça o cast que precisar
> (`(int) $req->param('id')`). `param()` aceita um valor padrão como segundo argumento.

Parâmetros opcionais (`:param?`) **não** são suportados e lançam erro no registro.

### Constraints (expressões regulares)

Restrinja um parâmetro com `<regex>`:

```php
$app->get('/usuario/:id<\d+>', fn ($req, $res) => $res->json(['id' => $req->param('id')]));
$app->get('/posts/:slug<[a-z0-9-]+>', $handler);
```

Há atalhos prontos:

| Atalho | Padrão |
|---|---|
| `int` | `\d+` |
| `slug` | `[a-z0-9-]+` |
| `alpha` | `[a-zA-Z]+` |
| `alnum` | `[a-zA-Z0-9]+` |
| `uuid` | UUID canônico |
| `date` | `\d{4}-\d{2}-\d{2}` |
| `year` / `month` / `day` | `\d{4}` / `\d{2}` / `\d{2}` |

```php
$app->get('/artigos/:slug<slug>', fn ($req, $res) => $res->json(['slug' => $req->param('slug')]));
$app->get('/arquivos/:id<uuid>', $handler);
$app->get('/agenda/:dia<date>', $handler);
```

## Handlers

São aceitos três formatos de handler:

```php
// Closure
$app->get('/users', fn ($req, $res) => $res->json(['users' => []]));

// Função nomeada
function listUsers($req, $res) { return $res->json([]); }
$app->get('/users', 'listUsers');

// Array callable (recomendado para controllers)
$app->get('/users', [UserController::class, 'index']);
$app->post('/users', [$controller, 'store']);
```

Array callables `[Classe::class, 'metodo']` funcionam tanto para métodos estáticos quanto de
instância. Para métodos de instância, a `Application` resolve a instância pelo contêiner a cada
requisição (respeitando `bind()`/`singleton()`), caindo para `new Classe()` quando não registrada.

> A sintaxe em string `'UserController@index'` **não** é suportada (lança `TypeError`).

## Grupos de rotas

Cada `Application` tem o seu próprio roteador (`PivotPHP\Routing\Router\Router`, desde o core 5.0):
rotas, grupos e middlewares de uma aplicação nunca aparecem em outra.

```php
$app->group('/admin', function () use ($app): void {
    $app->get('/stats', fn ($req, $res) => $res->json(['ok' => true]));
}, [$requireAdmin]);
```

Todo verbo aceita metadados e middlewares de rota depois do handler:
`$app->get('/health', $handler, [], $logRequest)`. Também existem `options()`, `head()`, `any()` e
`match(['GET', 'POST'], $path, $handler)`.

Para associar middlewares a um prefixo sem criar grupo, use o roteador da aplicação:
`$app->getContainer()->get('router')->use('/admin', $requireAdmin)` — vale para as rotas registradas
depois cujo caminho começa com o prefixo, sem alterar os caminhos.

> Até o core 4.x o `Router` era estático (`Router::group(...)`). No 5.0 essas chamadas estáticas não
> existem mais; veja o guia de migração do core.

## Arquivos estáticos

O `StaticFileManager` registra cada arquivo de um diretório como uma rota `GET`:

```php
$app->staticFiles('/public', __DIR__ . '/public');
```

Arquivos e diretórios ocultos (`.env`, `.git/`, `.well-known/`) nunca são publicados, e symlinks só
são seguidos quando o alvo permanece dentro do diretório.

## Boas práticas

1. **Sempre retorne a resposta** do handler (`return $res->json(...)`).
2. **Use controllers** quando a lógica crescer além de algumas linhas.
3. **Valide os parâmetros** no handler antes de usá-los.
4. **Prefira constraints** (`:id<\d+>`) para evitar que valores inválidos cheguem ao handler.
