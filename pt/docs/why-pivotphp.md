---
redirect_from:
  - /docs/why-pivotphp/
  - /en/docs/why-pivotphp/
  - /en/why-pivotphp/
layout: docs
title: Por que PivotPHP?
permalink: /pt/docs/why-pivotphp/
lang: pt
---
**O Microframework PHP Evolutivo**
*Express.js no PHP, sobre PSR-7/PSR-15. Simples de começar, fácil de estender.*

[![Última Versão](https://img.shields.io/packagist/v/pivotphp/core.svg)](https://packagist.org/packages/pivotphp/core)
[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/PivotPHP/pivotphp-core/blob/main/LICENSE)
[![Versão PHP](https://img.shields.io/badge/php-8.1%2B-777bb4.svg)](https://php.net)
[![PSR-7 / PSR-15](https://img.shields.io/badge/PSR--7%20%2F%20PSR--15-compliant-brightgreen)](https://www.php-fig.org/psr/psr-15/)

---

## 🎯 Por que PivotPHP?

Vindo do Node.js, sentia falta da elegância do Express.js: simples, flexível e direto. Muitos
frameworks PHP, em contrapartida, são pesados ou opinativos demais. O PivotPHP nasceu para trazer a
sintaxe familiar do Express para o PHP moderno, sem esconder o que acontece por baixo: mensagens
**PSR-7**, pipeline **PSR-15** e um roteador explícito.

O core faz uma coisa bem: liga a aplicação, o roteamento e a pipeline. O resto vive em pacotes.

```php
<?php
require 'vendor/autoload.php';

use PivotPHP\Core\Core\Application;

$app = new Application();

$app->get('/ola/:nome', fn ($req, $res) => $res->json([
    'mensagem' => 'Olá, ' . $req->param('nome') . '!',
]));

$app->post('/usuarios', function ($req, $res) {
    $name = $req->input('name'); // JSON ou form

    if (!is_string($name) || $name === '') {
        return $res->error(422, 'O campo "name" é obrigatório');
    }

    return $res->status(201)->json(['name' => $name]);
});

$app->run();
```

```bash
php -S localhost:8000 index.php
curl http://localhost:8000/ola/PivotPHP
```

---

## 🚀 Instalação

```bash
composer require pivotphp/core
```

**Requisitos:** PHP 8.1+ com `ext-json` e `ext-mbstring`.

O core instala junto `pivotphp/core-routing` (roteamento), `pivotphp/http` (camada HTTP) e
`pivotphp/security` (CORS, headers, CSRF, JWT, rate limiting).

---

## ✨ Recursos Principais

### 🧬 Arquitetura em pacotes

O monólito virou peças pequenas e focadas. Você paga só pelo que usa e pode trocar cada peça.

- `pivotphp/core` — aplicação e pipeline
- `pivotphp/core-routing` — roteamento
- `pivotphp/http` — `ExpressRequest`/`ExpressResponse` sobre PSR-7
- `pivotphp/security` — middlewares de segurança

### 🎛️ Sintaxe inspirada no Express.js

```php
$app->get('/usuarios/:id<\d+>', [UserController::class, 'show']);
```

Parâmetros (`:id`, `{id}`), constraints (`:id<\d+>`, `<slug>`, `<uuid>`, `<date>`) e array callables
`[Controller::class, 'metodo']` — sem a sintaxe legada `'Controller@method'` (que lança `TypeError`).

### 🧅 Pipeline PSR-15

Middleware global com `$app->use()`, em classe PSR-15 ou callable:

```php
use Psr\Http\Server\MiddlewareInterface;

$app->use(new TimingMiddleware());

$app->use(function ($req, $res, $next) {
    $response = $next($req->withAttribute('request_id', bin2hex(random_bytes(8))));
    return $response->withHeader('X-Powered-By', 'PivotPHP');
});
```

### 🛡️ Segurança em pacote próprio

CORS, headers de segurança, CSRF, JWT, rate limiting e proxies confiáveis, com configuração
validada (*fail closed*): ajustes inseguros lançam no boot.

```php
use PivotPHP\Http\Factory\Psr17Factory;
use PivotPHP\Security\Cors\{CorsConfig, CorsMiddleware};
use PivotPHP\Security\Headers\SecurityHeadersMiddleware;

$app->use(new SecurityHeadersMiddleware());
$app->use(new CorsMiddleware(new Psr17Factory(), new CorsConfig(
    allowedOrigins: ['https://app.exemplo.com'],
    allowCredentials: true,
)));
```

### 📦 Container, eventos e extensões

Container PSR-11, eventos PSR-14, hooks e service providers para estender o framework sem
modificá-lo. Veja [Container]({{ '/pt/docs/container/' | relative_url }}),
[Eventos]({{ '/pt/docs/events/' | relative_url }}) e
[Extensões]({{ '/pt/docs/extensions/' | relative_url }}).

### 📖 OpenAPI/Swagger

`ApiDocumentationMiddleware` gera a especificação OpenAPI 3 a partir das rotas registradas. Veja
[Documentação de API]({{ '/pt/docs/api-documentation/' | relative_url }}).

---

## 📊 Performance

Números honestos e reproduzíveis. O benchmark oficial
([`pivotphp/benchmarks`](https://github.com/PivotPHP/pivotphp-benchmarks)) compara frameworks
executando **a mesma API de votação** em containers Docker com recursos idênticos e limitados
(1 CPU / 512 MB, PostgreSQL + Redis).

Cenário `vote-moderate` (100 VUs, 2026-10-10, PivotPHP 4.0):

| Framework | Throughput (req/s) | p95 | Erros |
|---|---|---|---|
| **PivotPHP 4.0** | **229,72** | **209,69 ms** | ~0% |
| Slim 4 | 227,78 | 212,46 ms | ~0% |
| Mezzio | 229,05 | 211,75 ms | ~0% |
| Symfony (microkernel) | 220,22 | 224,97 ms | ~0% |
| Webman (async) | 1.159,45 | 49,28 ms | ~0% |

Entre os frameworks PHP-FPM, o PivotPHP fica no topo do grupo. O Webman (assíncrono, com workers
persistentes) é bem mais rápido — comparação de runtimes diferentes. Regras de justiça, ambiente e
ressalvas estão na [página de benchmarks]({{ '/pt/docs/benchmarks/' | relative_url }}).

---

## 📚 Documentação

- [Início Rápido]({{ '/pt/docs/quickstart/' | relative_url }})
- [Roteamento]({{ '/pt/docs/routing/' | relative_url }})
- [Requisições e Respostas]({{ '/pt/docs/requests-responses/' | relative_url }})
- [Segurança]({{ '/pt/docs/security/' | relative_url }})
- [Banco de Dados]({{ '/pt/docs/database/' | relative_url }})

---

## 🌟 Ecossistema

- [pivotphp/core](https://github.com/PivotPHP/pivotphp-core) — framework (aplicação + pipeline)
- [pivotphp/core-routing](https://github.com/PivotPHP/pivotphp-core-routing) — roteamento
- [pivotphp/http](https://github.com/PivotPHP/pivotphp-http) — camada HTTP
- [pivotphp/security](https://github.com/PivotPHP/pivotphp-security) — segurança
- [pivotphp/skeleton](https://github.com/PivotPHP/pivotphp-skeleton) — template de projeto
- ~~pivotphp/cycle-orm~~ — **pausado** (só core 1.x)

---

## 🤝 Comunidade

- [GitHub](https://github.com/PivotPHP)
- Issues e PRs são bem-vindos no repositório de cada pacote.

---

## ⚠️ Manutenção

O PivotPHP é mantido por uma pessoa e é indicado para provas de conceito, protótipos, estudos e
projetos educacionais. Para sistemas críticos com suporte dedicado, considere Laravel, Symfony ou
Slim.

---

## 📄 Licença

MIT.

---

## 👨‍💻 Autor

**Caio Alberto Fernandes** — [GitHub](https://github.com/CAFernandes) ·
[LinkedIn](https://www.linkedin.com/in/caio-alberto-fernandes/)

<div align="center">

**⭐ Dê uma estrela no GitHub — isso ajuda!**

*PivotPHP: o framework que evolui com seu projeto.*

</div>
