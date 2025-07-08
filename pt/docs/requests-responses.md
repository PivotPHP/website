---
layout: docs
title: Requisições e Respostas
permalink: /pt/docs/requests-responses/
lang: pt
---

O PivotPHP usa objetos de mensagem HTTP compatíveis com PSR-7 para requisições e respostas, fornecendo uma interface consistente e interoperável para lidar com comunicação HTTP.

## O Objeto Request

O objeto request representa a requisição HTTP e fornece métodos para acessar dados da requisição.

### Acessando Dados da Requisição

```php
$app->post('/usuarios', function($request, $response) {
    // Obter todos os dados de entrada
    $todos = $request->all();

    // Obter entrada específica com valor padrão
    $nome = $request->input('nome', 'Anônimo');
    $email = $request->input('email');

    // Obter entrada aninhada usando notação de ponto
    $cidade = $request->input('endereco.cidade');

    // Obter apenas campos específicos
    $credenciais = $request->only(['email', 'senha']);

    // Obter todos exceto campos específicos
    $dados = $request->except(['senha', 'confirmacao_senha']);

    // Verificar se entrada existe
    if ($request->has('email')) {
        // Processar email
    }

    // Verificar se múltiplas entradas existem
    if ($request->hasAny(['email', 'usuario'])) {
        // Processar login
    }
});
```

### Corpo da Requisição

```php
// Obter conteúdo bruto do corpo
$bruto = $request->getBody()->getContents();

// Obter corpo JSON parseado
$dados = $request->body();

// Obter campo específico do JSON
$nome = $request->body('nome');

// Para dados de formulário
$dadosForm = $request->getParsedBody();
```

### Parâmetros de Query

```php
// Obter todos os parâmetros de query
$queryParams = $request->getQueryParams();

// Obter parâmetro de query específico
$pagina = $request->query('pagina', 1);
$porPagina = $request->query('por_pagina', 20);

// Obter string de query
$queryString = $request->getUri()->getQuery();
```

### Parâmetros de Rota

```php
$app->get('/usuarios/{id}/posts/{postId}', function($request, $response) {
    // Obter parâmetros de rota
    $usuarioId = $request->param('id');
    $postId = $request->param('postId');

    // Obter todos os parâmetros de rota
    $params = $request->params();
});
```

### Cabeçalhos

```php
// Obter todos os cabeçalhos
$cabecalhos = $request->getHeaders();

// Obter cabeçalho específico
$contentType = $request->header('Content-Type');
$auth = $request->header('Authorization');

// Obter linha de cabeçalho (valores concatenados)
$accept = $request->getHeaderLine('Accept');

// Verificar se cabeçalho existe
if ($request->hasHeader('X-Requested-With')) {
    // Requisição AJAX
}
```

### Método da Requisição

```php
// Obter método HTTP
$metodo = $request->getMethod();

// Verificar métodos específicos
if ($request->isGet()) {
    // Processar GET
}

if ($request->isPost()) {
    // Processar POST
}

if ($request->isMethod('PUT')) {
    // Processar PUT
}

// Verificar se requisição é AJAX
if ($request->isAjax()) {
    // Retornar JSON
}

// Verificar se requisição quer JSON
if ($request->wantsJson()) {
    return $response->json($dados);
}
```

### URI da Requisição

```php
// Obter URI completa
$uri = $request->getUri();

// Obter componentes
$esquema = $uri->getScheme();      // http ou https
$host = $uri->getHost();            // exemplo.com
$porta = $uri->getPort();           // 80, 443, ou personalizada
$caminho = $uri->getPath();         // /usuarios/123
$query = $uri->getQuery();          // pagina=1&ordem=nome
$fragmento = $uri->getFragment();   // secao1

// Obter URL completa
$urlCompleta = $request->fullUrl(); // https://exemplo.com/usuarios/123?pagina=1

// Obter URL sem query string
$url = $request->url();             // https://exemplo.com/usuarios/123

// Obter caminho
$caminho = $request->path();        // usuarios/123
```

### Upload de Arquivos

```php
$app->post('/upload', function($request, $response) {
    // Obter arquivo enviado
    $arquivo = $request->file('avatar');

    if ($arquivo && $arquivo->getError() === UPLOAD_ERR_OK) {
        // Obter informações do arquivo
        $nomeArquivo = $arquivo->getClientFilename();
        $tamanho = $arquivo->getSize();
        $tipo = $arquivo->getClientMediaType();

        // Mover arquivo enviado
        $novoCaminho = 'uploads/' . uniqid() . '_' . $nomeArquivo;
        $arquivo->moveTo($novoCaminho);

        return $response->json([
            'caminho' => $novoCaminho,
            'tamanho' => $tamanho,
            'tipo' => $tipo
        ]);
    }

    // Múltiplos arquivos
    $arquivos = $request->file('documentos');
    foreach ($arquivos as $arquivo) {
        // Processar cada arquivo
    }
});
```

### Atributos da Requisição

```php
// Definir atributo (tipicamente em middleware)
$request = $request->withAttribute('usuario', $usuario);

// Obter atributo
$usuario = $request->getAttribute('usuario');

// Obter todos os atributos
$atributos = $request->getAttributes();

// Verificar se atributo existe
if ($request->hasAttribute('usuario')) {
    // Usuário está autenticado
}
```

## O Objeto Response

O objeto response representa a resposta HTTP a ser enviada de volta ao cliente.

### Respostas Básicas

```php
// Resposta de texto simples
return $response->write('Olá Mundo');

// Resposta HTML
return $response->html('<h1>Olá Mundo</h1>');

// Resposta JSON
return $response->json([
    'mensagem' => 'Sucesso',
    'dados' => $dadosUsuario
]);

// Resposta vazia
return $response->noContent();
```

### Códigos de Status

```php
// Definir código de status
return $response->status(201)->json($dados);

// Métodos de status comuns
return $response->ok($dados);          // 200
return $response->created($dados);     // 201
return $response->accepted();          // 202
return $response->noContent();         // 204

return $response->badRequest($erro);   // 400
return $response->unauthorized();      // 401
return $response->forbidden();         // 403
return $response->notFound();          // 404
return $response->unprocessable($erros); // 422

return $response->serverError();       // 500

// Obter status atual
$status = $response->getStatusCode();
$razao = $response->getReasonPhrase();
```

### Cabeçalhos

```php
// Definir cabeçalho único
$response = $response->header('X-Custom', 'valor');

// Definir múltiplos cabeçalhos
$response = $response->withHeaders([
    'X-Custom' => 'valor',
    'X-Outro' => 'outro-valor'
]);

// Estilo PSR-7
$response = $response->withHeader('Content-Type', 'application/json');
$response = $response->withAddedHeader('X-Custom', 'valor');

// Remover cabeçalho
$response = $response->withoutHeader('X-Powered-By');
```

### Cookies

```php
// Definir cookie
$response = $response->cookie('nome', 'valor', [
    'expires' => time() + 3600,
    'path' => '/',
    'domain' => '.exemplo.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Cookie simples (expira em 1 hora)
$response = $response->cookie('sessao', $sessaoId, 3600);

// Cookie permanente (5 anos)
$response = $response->forever('remember_token', $token);

// Deletar cookie
$response = $response->forget('nome');
```

### Redirecionamentos

```php
// Redirecionamento básico
return $response->redirect('/dashboard');

// Redirecionar com código de status
return $response->redirect('/login', 302);

// Redirecionar para rota nomeada
return $response->route('perfil', ['id' => $usuarioId]);

// Redirecionar de volta
return $response->back();

// Redirecionar com dados flash
return $response->redirect('/dashboard')
    ->with('sucesso', 'Perfil atualizado com sucesso!');

// Redirecionar com entrada
return $response->redirect('/formulario')
    ->withInput($request->all())
    ->withErrors($validador->errors());
```

### Downloads de Arquivo

```php
// Forçar download de arquivo
return $response->download('/caminho/para/arquivo.pdf');

// Download com nome personalizado
return $response->download('/caminho/para/arquivo.pdf', 'fatura.pdf');

// Transmitir arquivo
return $response->file('/caminho/para/imagem.jpg');

// Transmitir com cabeçalhos
return $response->file('/caminho/para/documento.pdf', [
    'Content-Type' => 'application/pdf',
    'Cache-Control' => 'public, max-age=3600'
]);
```

### Respostas em Stream

```php
// Transmitir dados grandes
return $response->stream(function() {
    $handle = fopen('arquivo-grande.csv', 'r');

    while (!feof($handle)) {
        echo fread($handle, 1024);
        ob_flush();
        flush();
    }

    fclose($handle);
});

// Eventos enviados pelo servidor
return $response->stream(function() {
    while (true) {
        echo "data: " . json_encode(['hora' => time()]) . "\n\n";
        ob_flush();
        flush();
        sleep(1);
    }
}, [
    'Content-Type' => 'text/event-stream',
    'Cache-Control' => 'no-cache'
]);
```

## Trabalhando com JSON

### Requisições JSON

```php
$app->post('/api/usuarios', function($request, $response) {
    // Verificar se requisição é JSON
    if (!$request->isJson()) {
        return $response->badRequest('Tipo de conteúdo inválido');
    }

    // Obter dados JSON
    $dados = $request->json();

    // Obter campo específico
    $email = $request->json('email');

    // Validar JSON
    if (!$request->json()->has(['email', 'senha'])) {
        return $response->unprocessable([
            'erros' => ['Campos obrigatórios ausentes']
        ]);
    }
});
```

### Respostas JSON

```php
// Resposta JSON básica
return $response->json(['status' => 'sucesso']);

// JSON com código de status
return $response->status(201)->json($usuario);

// JSON formatado
return $response->json($dados, JSON_PRETTY_PRINT);

// Resposta JSONP
return $response->jsonp('callback', $dados);

// JSON com opções personalizadas
return $response->json($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
```

## Macros de Response

Crie métodos de resposta reutilizáveis:

```php
// Definir macro
Response::macro('sucesso', function($dados = null, $mensagem = 'Sucesso') {
    return $this->json([
        'sucesso' => true,
        'mensagem' => $mensagem,
        'dados' => $dados
    ]);
});

Response::macro('erro', function($mensagem = 'Erro', $codigo = 400) {
    return $this->status($codigo)->json([
        'sucesso' => false,
        'mensagem' => $mensagem
    ]);
});

// Usar macros
return $response->sucesso($dadosUsuario, 'Usuário criado');
return $response->erro('Credenciais inválidas', 401);
```

## Negociação de Conteúdo

```php
$app->get('/dados', function($request, $response) {
    $dados = ['nome' => 'João', 'email' => 'joao@exemplo.com'];

    // Verificar o que o cliente aceita
    $accept = $request->header('Accept');

    if (str_contains($accept, 'application/xml')) {
        return $response->xml($dados);
    } elseif (str_contains($accept, 'text/csv')) {
        return $response->csv($dados);
    } else {
        return $response->json($dados);
    }
});
```

## Melhores Práticas

1. **Sempre retorne respostas**: Todo handler de rota deve retornar um objeto response
2. **Use códigos de status apropriados**: Use códigos de status HTTP semânticos
3. **Defina tipos de conteúdo corretos**: Sempre defina o cabeçalho Content-Type apropriado
4. **Trate erros graciosamente**: Retorne mensagens de erro significativas com códigos de status adequados
5. **Use respostas imutáveis**: Objetos response são imutáveis, sempre reatribua
6. **Valide entrada**: Sempre valide dados da requisição antes de processar
7. **Use type hints**: Type hint parâmetros request e response para melhor suporte IDE

```php
use PivotPHP\Http\Request;
use PivotPHP\Http\Response;

$app->post('/usuarios', function(Request $request, Response $response) {
    // Melhor suporte IDE e segurança de tipos
    return $response->json(['criado' => true]);
});
```
