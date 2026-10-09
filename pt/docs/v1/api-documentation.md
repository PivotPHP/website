---
redirect_from:
  - /docs/api-documentation/
  - /en/docs/api-documentation/
  - /en/api-documentation/
layout: docs
title: Documentação de API com OpenAPI/Swagger
description: Gere documentação interativa de API automaticamente com OpenAPI 3.0 e Swagger UI
lang: pt
version: "1.2.0"
---

O PivotPHP 1.2.0 inclui o utilitário `OpenApiExporter`, que gera um `array` com a especificação OpenAPI a partir das rotas registradas. Ele **não** lê PHPDoc nem anotações.

## Gerando a especificação

```php
use PivotPHP\Core\Utils\OpenApiExporter;

$docs = OpenApiExporter::export($app);                             // array OpenAPI
$docs = OpenApiExporter::exportStatic($app, 'https://api.example.com'); // com baseUrl

// Ou via instância
$exporter = new OpenApiExporter($app);
$docs = $exporter->generate('https://api.example.com');
```

O retorno é um `array` (não HTML) — grave-o em um arquivo ou devolva-o em uma rota:

```php
$app->get('/openapi.json', function ($req, $res) use ($app) {
    return $res->json(OpenApiExporter::export($app));
});
```

## Limitações

- Sem leitura de PHPDoc (`@api`, `@param`, `@response` são ignorados).
- A saída descreve apenas o método HTTP e o caminho de cada rota; não há descrição de
  parâmetros nem de schemas.
