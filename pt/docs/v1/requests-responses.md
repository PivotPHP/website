---
redirect_from:
  - /docs/requests-responses/
  - /en/docs/requests-responses/
  - /en/requests-responses/
layout: docs
title: Requisições e Respostas
permalink: /pt/docs/v1/requests-responses/
lang: pt
version: "1.2.0"
---

O PivotPHP usa objetos de mensagem HTTP compatíveis com PSR-7: `Request` e `Response`
(`PivotPHP\Core\Http\Request` e `PivotPHP\Core\Http\Response`).

## O Objeto Request

### Dados de entrada

```php
$app->post('/usuarios', function($request, $response) {
    // Parâmetro de rota
    $id = $request->param('id');

    // Entrada (query ou corpo), com padrão opcional
    $nome  = $request->input('nome', 'Anônimo');
    $email = $request->get('email');

    // Query string
    $pagina = $request->getQuery('pagina', 1);
    $todos  = $request->getQueryParams();

    // Corpo JSON parseado (stdClass)
    $dados = $request->body();
    $nome  = $dados->nome ?? null;
});
```

### Cabeçalhos

```php
$contentType = $request->header('Content-Type');
$accept      = $request->getHeaderLine('Accept');
$todos       = $request->getHeaders();

if ($request->hasHeader('X-Requested-With')) {
    // requisição AJAX
}
```

### Informações da requisição

```php
$metodo       = $request->getMethod();
$caminho      = $request->getPath();
$ip           = $request->ip();
$userAgent    = $request->userAgent();
$urlCompleta  = $request->fullUrl();

if ($request->isAjax())   { /* ... */ }
if ($request->isSecure()) { /* HTTPS */ }
```

### Upload de arquivos

```php
$app->post('/upload', function($request, $response) {
    if ($request->hasFile('avatar')) {
        $arquivo = $request->file('avatar'); // array do PSR-7 UploadedFile
    }
});
```

### Atributos (PSR-7)

```php
$request = $request->withAttribute('usuario', $usuario);
$usuario = $request->getAttribute('usuario');
$todos   = $request->getAttributes();
```

## O Objeto Response

### Respostas básicas

```php
return $response->text('Olá Mundo');
return $response->html('<h1>Olá Mundo</h1>');
return $response->json(['mensagem' => 'Sucesso']);
return $response->send('texto cru');
```

### Códigos de status

```php
return $response->status(201)->json($dados);

$status = $response->getStatusCode();
$razao  = $response->getReasonPhrase();
```

Não há atalhos por código (`ok()`, `created()`, `notFound()` etc.) — use `status($code)`.

### Cabeçalhos

```php
$response = $response->header('X-Custom', 'valor');
$response = $response->withHeader('Content-Type', 'application/json');
$response = $response->withAddedHeader('X-Custom', 'outro');
```

### Cookies

```php
$response = $response->cookie('sessao', $valor, time() + 3600);
$response = $response->clearCookie('sessao');
```

### Redirecionamentos

```php
return $response->redirect('/dashboard');
return $response->redirect('/login', 301);
```

Não há `back()` nem dados flash.

### Erro e sucesso

```php
return $response->error(404);              // {"error": "Not Found", "code": 404}
return $response->error(422, 'Inválido');  // mensagem customizada
return $response->success($dados);         // resposta de sucesso padronizada
```

### Download / stream

```php
return $response->streamFile('/caminho/arquivo.pdf', [
    'Content-Type' => 'application/pdf',
]);
```

## Trabalhando com JSON

```php
$app->post('/api/usuarios', function($request, $response) {
    $dados = $request->body(); // stdClass

    return $response->json(['status' => 'sucesso']);
});
```

Não há `jsonp()`, `xml()` nem `csv()`.

## Melhores Práticas

1. **Sempre retorne a resposta** de todo handler.
2. **Use `status()`** para definir códigos HTTP.
3. **Type hint** `Request`/`Response` para suporte da IDE:

```php
use PivotPHP\Core\Http\Request;
use PivotPHP\Core\Http\Response;

$app->post('/usuarios', function (Request $request, Response $response) {
    return $response->json(['criado' => true]);
});
```
