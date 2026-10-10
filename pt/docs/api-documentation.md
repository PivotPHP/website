---
redirect_from:
  - /docs/api-documentation/
  - /en/docs/api-documentation/
  - /en/api-documentation/
layout: docs
title: Documentação de API com OpenAPI/Swagger
description: Gere documentação interativa de API automaticamente com OpenAPI 3.0 e Swagger UI
permalink: /pt/docs/api-documentation/
lang: pt
---

O PivotPHP gera documentação **OpenAPI/Swagger** automaticamente a partir das rotas registradas no
`Router` — sem parsing de PHPDoc nem anotações. O responsável é o
`PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware`.

## Habilitando

Registre o middleware com `$app->use()`:

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Middleware\Http\ApiDocumentationMiddleware;

$app = new Application();

$app->get('/usuarios', fn ($req, $res) => $res->json(['usuarios' => []]));

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

Cada rota registrada vira uma entrada de caminho (método HTTP + caminho) com uma resposta `200`.
Parâmetros de rota (`:id`, `:id<\d+>`, `{id}`) são normalizados para `{id}` e geram objetos
`parameters` (`in: path`, `required: true`). Não há leitura de PHPDoc — anotações como `@api`,
`@param` e `@response` são ignoradas. Para documentação rica (schemas, descrições), gere o spec
manualmente.

## Exemplo de saída

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "PivotPHP API",
    "version": "4.0.2",
    "description": "Auto-generated API documentation"
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
    },
    "/usuarios/{id}": {
      "get": {
        "summary": "Route: get /usuarios/{id}",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "Successful response" }
        }
      }
    }
  }
}
```
