---

layout: docs
title: Documentação de API com OpenAPI/Swagger
description: Gere documentação interativa de API automaticamente com OpenAPI 3.0 e Swagger UI
lang: pt
version: "2.1.1"
---

O PivotPHP gera documentação **OpenAPI/Swagger** automaticamente a partir das rotas registradas no `Router` — sem parsing de PHPDoc nem anotações. O responsável é o middleware `ApiDocumentationMiddleware`.

## Habilitando

Registre o middleware com `$app->use()`:

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;

$app = new Application();

$app->get('/usuarios', function ($req, $res) {
    return $res->json(['usuarios' => []]);
});

$app->use(new ApiDocumentationMiddleware([
    'docs_path'    => '/docs',      // JSON OpenAPI 3.0.0
    'swagger_path' => '/swagger',   // Swagger UI
    'base_url'     => 'http://localhost:8080',
]));

$app->run();
```

## Endpoints

- `GET /docs` — especificação OpenAPI 3.0.0 em JSON.
- `GET /swagger` — interface Swagger UI (carrega o Swagger UI do CDN unpkg).

## Opções

| Opção | Padrão | Descrição |
|---|---|---|
| `docs_path` | `/docs` | Caminho do endpoint JSON |
| `swagger_path` | `/swagger` | Caminho da Swagger UI |
| `base_url` | `http://localhost:8080` | URL base usada em `servers` |
| `version` | `Application::VERSION` | Campo `info.version` |
| `enabled` | `true` | `false` desativa o middleware |

## O que é gerado

Cada rota registrada vira uma entrada básica de caminho (método HTTP + caminho) com uma
resposta `200`. Não há leitura de PHPDoc — anotações como `@api`, `@param` e `@response` são
ignoradas. Para documentação rica (parâmetros, schemas, descrições), gere o spec manualmente.

## Exemplo de saída

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "PivotPHP API",
    "version": "2.3.4"
  },
  "servers": [
    { "url": "http://localhost:8080" }
  ],
  "paths": {
    "/usuarios": {
      "get": {
        "summary": "Route: get /usuarios",
        "responses": {
          "200": { "description": "Successful response" }
        }
      }
    }
  }
}
```
