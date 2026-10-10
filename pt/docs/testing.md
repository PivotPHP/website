---
redirect_from:
  - /docs/testing/
  - /en/docs/testing/
  - /en/testing/
layout: docs
title: Testes
permalink: /pt/docs/testing/
lang: pt
---

O PivotPHP é testado com **PHPUnit**. A estratégia recomendada é exercitar a aplicação real pelo
método `Application::handle()`, que recebe uma `ServerRequestInterface` PSR-7 e devolve uma
`ResponseInterface` — sem servidor web.

## Instalação

O template `pivotphp/skeleton` já inclui PHPUnit. Para adicioná-lo manualmente a um projeto:

```bash
composer require --dev phpunit/phpunit
composer require --dev nyholm/psr7
```

## Executando os testes

```bash
composer test                                  # toda a suíte
vendor/bin/phpunit tests/ApiTest.php           # um arquivo
vendor/bin/phpunit --filter testWelcome        # um teste
```

## Testando rotas com `handle()`

Monte a requisição com uma fábrica PSR-17 (`Nyholm\Psr7\Factory\Psr17Factory` ou
`PivotPHP\Http\Factory\Psr17Factory`) e passe-a para `$app->handle()`:

```php
<?php
namespace Tests;

use Nyholm\Psr7\Factory\Psr17Factory;
use PHPUnit\Framework\TestCase;
use PivotPHP\Core\Core\Application;
use Psr\Http\Message\ResponseInterface;

final class ApiTest extends TestCase
{
    private Application $app;
    private Psr17Factory $factory;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->app->get('/health', fn ($req, $res) => $res->json(['status' => 'ok']));
        $this->factory = new Psr17Factory();
    }

    public function testHealth(): void
    {
        $response = $this->app->handle($this->factory->createServerRequest('GET', '/health'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('{"status":"ok"}', (string) $response->getBody());
    }
}
```

## Requisições com corpo JSON

```php
private function postJson(Application $app, string $uri, array $data): ResponseInterface
{
    $factory = new Psr17Factory();

    $request = $factory->createServerRequest('POST', $uri)
        ->withHeader('Content-Type', 'application/json')
        ->withBody($factory->createStream((string) json_encode($data)));

    return $app->handle($request);
}

public function testCreateUser(): void
{
    $this->app->post('/users', fn ($req, $res) => $res->status(201)->json($req->json()));

    $response = $this->postJson($this->app, '/users', ['name' => 'Ana']);

    $this->assertSame(201, $response->getStatusCode());
    $this->assertSame(['name' => 'Ana'], json_decode((string) $response->getBody(), true));
}
```

## Testando o bootstrap real (skeleton)

O skeleton expõe `bootstrap/app.php`, que devolve a `Application` já montada. Nos testes, defina as
variáveis de ambiente antes de incluí-lo:

```php
protected function setUp(): void
{
    $_ENV['APP_ENV'] = 'testing';
    $_ENV['APP_DEBUG'] = 'false';
    putenv('APP_ENV=testing');

    $this->app = require __DIR__ . '/../bootstrap/app.php';
}
```

## Verificando comportamento de framework

```php
// 405 + Allow em método não permitido para um caminho conhecido
$response = $app->handle($factory->createServerRequest('PATCH', '/users'));
$this->assertSame(405, $response->getStatusCode());
$this->assertStringContainsString('GET', $response->getHeaderLine('Allow'));

// 404 para rota inexistente
$response = $app->handle($factory->createServerRequest('GET', '/nao-existe'));
$this->assertSame(404, $response->getStatusCode());

// 400 para JSON malformado
$request = $factory->createServerRequest('POST', '/users')
    ->withHeader('Content-Type', 'application/json')
    ->withBody($factory->createStream('{invalid'));
$this->assertSame(400, $app->handle($request)->getStatusCode());
```

## Isolamento entre testes

Cada `Application` tem o seu próprio roteador (core 5.0), então **cada nova `Application` começa
isolada** — rotas, grupos e arquivos estáticos de uma não aparecem em outra. Crie uma nova
`Application` em `setUp()`; não é preciso limpar estado global entre os testes.

## Mocking

Não há helpers de mocking específicos do framework. Use os dublês do próprio PHPUnit e registre-os
no contêiner com `instance()`:

```php
$repo = $this->createMock(UserRepository::class);
$repo->method('all')->willReturn([['id' => 1, 'name' => 'Ana']]);

$app->instance(UserRepository::class, $repo);
$app->get('/users', fn ($req, $res) => $res->json($app->make(UserRepository::class)->all()));
```

## Integração contínua (GitHub Actions)

```yaml
name: Testes

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configurar PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          extensions: mbstring

      - name: Instalar dependências
        run: composer install --no-interaction --prefer-dist

      - name: Executar testes
        run: composer test
```

## Boas práticas

1. **Teste comportamento, não implementação.**
2. **Use nomes descritivos** para os testes.
3. **Siga o padrão AAA** (Arrange, Act, Assert).
4. **Mantenha testes independentes** — nova `Application` por teste.
5. **Simule dependências externas** com dublês registrados no contêiner.
6. **Cubra casos de erro**: 400, 404, 405, 422.
