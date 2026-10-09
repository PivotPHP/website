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

O PivotPHP fornece um sistema de roteamento semelhante ao Express.js. As rotas são definidas usando métodos de verbos HTTP na instância da aplicação.

## Roteamento Básico

Uma rota recebe um caminho e um handler. O handler recebe a requisição e a resposta e deve escrever o resultado na resposta:

```php
$app->get('/', function ($req, $res) {
    return $res->send('Olá Mundo!');
});
```

> Use sempre os métodos da resposta (`send()`, `json()`, `text()`, `html()`). Retornar uma string diretamente do handler não escreve nada no corpo da resposta.

### Métodos Disponíveis

A `Application` oferece um método por verbo HTTP:

```php
$app->get($caminho, $handler);
$app->post($caminho, $handler);
$app->put($caminho, $handler);
$app->patch($caminho, $handler);
$app->delete($caminho, $handler);
```

Não há métodos para `OPTIONS`, `HEAD`, múltiplos verbos (`match`) ou qualquer verbo (`any`) na `Application`. Requisições `HEAD` e `OPTIONS` sem rota correspondente recebem `404`.

## Parâmetros de Rota

Capture segmentos do caminho com `:nome` e leia-os com `$req->param()`:

```php
$app->get('/usuario/:id', function ($req, $res) {
    return $res->json(['user_id' => $req->param('id')]);
});
```

Você pode ter múltiplos parâmetros:

```php
$app->get('/posts/:ano/:mes/:slug', function ($req, $res) {
    return $res->json([
        'ano'  => $req->param('ano'),
        'mes'  => $req->param('mes'),
        'slug' => $req->param('slug'),
    ]);
});
```

`param()` aceita um valor padrão como segundo argumento (`$req->param('id', 0)`), devolvido quando o parâmetro não existe.

> Valores numéricos são convertidos para inteiro: em `/usuario/05`, `$req->param('id')` retorna `5` (`int`). Valores não numéricos chegam como `string`.

### Restrições de Expressão Regular

Restrinja um parâmetro a um padrão com `<regex>`:

```php
$app->get('/usuario/:id<\d+>', function ($req, $res) {
    return $res->json(['id' => $req->param('id')]);
});
```

Há atalhos prontos: `:slug<slug>` (`[a-z0-9-]+`), `:id<uuid>` e `:data<date>` (`YYYY-MM-DD`):

```php
$app->get('/artigo/:slug<slug>', function ($req, $res) {
    return $res->json(['slug' => $req->param('slug')]);
});
```

## Rotas de Controller

Em vez de closures, use um array callable `[Classe::class, 'método']`:

```php
class UserController
{
    public function index($req, $res)
    {
        return $res->json(['usuarios' => []]);
    }

    public function show($req, $res)
    {
        return $res->json(['id' => $req->param('id')]);
    }
}

$app->get('/usuarios', [UserController::class, 'index']);
$app->get('/usuarios/:id', [UserController::class, 'show']);
```

Métodos estáticos e de instância são aceitos. Para métodos de instância, o controller é instanciado **sem argumentos** a cada requisição — um construtor com parâmetros obrigatórios causa erro `500`. A sintaxe em string `'UserController@index'` não é suportada.

## Boas Práticas

1. **Escreva na resposta**: retorne `$res->json(...)`, `$res->send(...)` etc. em todo handler.
2. **Use controllers** para lógica que cresce além de algumas linhas.
3. **Valide parâmetros no handler**: confira tipo e formato de `$req->param()` antes de usá-los.
