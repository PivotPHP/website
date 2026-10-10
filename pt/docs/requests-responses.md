---
redirect_from:
  - /docs/requests-responses/
  - /en/docs/requests-responses/
  - /en/requests-responses/
layout: docs
title: Requisições e Respostas
permalink: /pt/docs/requests-responses/
lang: pt
---

Os handlers recebem duas fachadas do pacote [`pivotphp/http`](https://github.com/PivotPHP/pivotphp-http):
`PivotPHP\Http\ExpressRequest` e `PivotPHP\Http\ExpressResponse`. Elas envolvem mensagens **PSR-7**:
o objeto subjacente é acessível via `psr7()`.

## O objeto Request

### Dados de entrada

```php
$app->post('/usuarios', function ($req, $res) {
    $id    = $req->param('id');            // parâmetro de rota (string)
    $todos = $req->params();               // todos os parâmetros de rota
    $page  = $req->query('page', '1');     // query string
    $nome  = $req->input('nome');          // corpo parseado, depois query string
    $dados = $req->json();                 // corpo decodificado como array

    return $res->json(['id' => $id, 'page' => $page]);
});
```

`input()` procura primeiro no corpo parseado (JSON/form) e, em seguida, na query string. `json()`
decodifica o corpo JSON em array (`[]` para corpo vazio) e lança `MalformedJsonException` (que
resulta em `400`) para JSON inválido.

### Cabeçalhos e cookies

```php
$contentType = $req->header('Content-Type');
$token       = $req->header('Authorization');
$sessao      = $req->cookie('session');
```

### Informações da requisição

```php
$metodo    = $req->method();
$caminho   = $req->path();
$ip        = $req->ip();
$userAgent = $req->userAgent();

$req->isAjax();              // X-Requested-With: XMLHttpRequest
$req->isJson();              // Content-Type: application/json
$req->isSecure();            // HTTPS
$req->accepts('text/html');  // negociação de conteúdo (respeita curingas e q)
```

### Upload de arquivos

```php
$file = $req->file('avatar'); // ?UploadedFileInterface
```

### Atributos PSR-7

Para transportar dados entre middleware e handler, use atributos na requisição PSR-7:

```php
$usuario   = $req->psr7()->getAttribute('user');
$requestId = $req->psr7()->getAttribute('request_id');
```

No middleware, defina-os com `withAttribute()` (a requisição é imutável).

## O objeto Response

Os *setters* são fluentes; os *terminais* atualizam a resposta envolvida e a retornam.

### Respostas básicas

```php
return $res->text('Olá Mundo');
return $res->html('<h1>Olá Mundo</h1>');
return $res->json(['mensagem' => 'Sucesso']);
return $res->send($dados);   // JSON para arrays/objetos, texto caso contrário
```

### Códigos de status

```php
return $res->status(201)->json($dados);
```

Não há atalhos por código (`ok()`, `created()` etc.) — use `status($code)`.

### Cabeçalhos

```php
return $res->status(200)->header('X-Custom', 'valor')->json($dados);
```

### Cookies

```php
return $res->cookie('sessao', $valor, [
    'httpOnly' => true,
    'sameSite' => 'Lax',
    'maxAge'   => 3600,
])->json(['ok' => true]);
```

### Redirecionamentos e vazio

```php
return $res->redirect('/dashboard');        // 302
return $res->redirect('/login', 301);       // status customizado
return $res->noContent();                   // 204
```

### Erros

```php
return $res->error(404);                    // {"error": "..."} em JSON
return $res->error(422, 'Tarefa inválida'); // mensagem customizada
```

### PSR-7 subjacente

```php
$psr7 = $res->psr7(); // ResponseInterface final
```

## Tabela de referência

### `ExpressRequest`

| Método | Descrição |
|---|---|
| `params(): array` | Todos os parâmetros de rota. |
| `param(string $name, mixed $default = null)` | Um parâmetro de rota. |
| `query(string $name, mixed $default = null)` | Valor da query string. |
| `input(string $name, mixed $default = null)` | Corpo parseado, depois query string. |
| `json(): array` | Corpo JSON decodificado; lança `MalformedJsonException` se inválido. |
| `header(string $name, ?string $default = null)` | Linha de cabeçalho. |
| `cookie(string $name, ?string $default = null)` | Valor de cookie. |
| `file(string $name)` | Arquivo enviado (`UploadedFileInterface`). |
| `ip()`, `userAgent()`, `method()`, `path()` | Metadados da requisição. |
| `isAjax()`, `isJson()`, `isSecure()`, `accepts(string $type)` | Verificações. |
| `psr7(): ServerRequestInterface` | Requisição PSR-7 subjacente. |

### `ExpressResponse`

| Método | Tipo | Descrição |
|---|---|---|
| `status(int $code)` | setter | Define o status. |
| `header(string $name, string $value)` | setter | Define um cabeçalho. |
| `cookie(string $name, string $value, array $options = [])` | setter | Adiciona `Set-Cookie`. |
| `json(mixed $data, ?int $status = null)` | terminal | Resposta JSON. |
| `text(string $text, ?int $status = null)` | terminal | Texto puro. |
| `html(string $html, ?int $status = null)` | terminal | HTML. |
| `redirect(string $url, int $status = 302)` | terminal | Redirecionamento. |
| `noContent(int $status = 204)` | terminal | Resposta vazia. |
| `send(mixed $data, ?int $status = null)` | terminal | JSON para arrays/objetos, texto caso contrário. |
| `error(int $status, string $message = '')` | terminal | JSON `{"error": "..."}`. |
| `psr7(): ResponseInterface` | — | Resposta PSR-7 subjacente. |

## Melhores práticas

1. **Sempre retorne a resposta** de todo handler.
2. **Use `status()`** para definir códigos HTTP (não há atalhos por código).
3. **Type-hint** `ExpressRequest`/`ExpressResponse` para suporte da IDE:

```php
use PivotPHP\Http\ExpressRequest;
use PivotPHP\Http\ExpressResponse;
use Psr\Http\Message\ResponseInterface;

$app->post('/usuarios', function (ExpressRequest $req, ExpressResponse $res): ResponseInterface {
    return $res->json(['criado' => true]);
});
```
