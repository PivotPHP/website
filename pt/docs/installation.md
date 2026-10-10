---
redirect_from:
  - /docs/installation/
  - /en/docs/installation/
  - /en/installation/
layout: docs
title: Instalação
permalink: /pt/docs/installation/
lang: pt
---

O PivotPHP é instalado via [Composer](https://getcomposer.org/). A versão atual do framework é a
**5.0.0** e requer **PHP 8.1** ou superior.

## Requisitos

- **PHP 8.1** ou superior
- **Composer** 2.x
- Extensões PHP: **ext-json** e **ext-mbstring**

O `pivotphp/core` traz três pacotes companheiros como dependências, instalados automaticamente:

| Pacote | Responsabilidade |
|---|---|
| [`pivotphp/core-routing`](https://github.com/PivotPHP/pivotphp-core-routing) | Motor de roteamento |
| [`pivotphp/http`](https://github.com/PivotPHP/pivotphp-http) | Camada HTTP (`ExpressRequest`/`ExpressResponse`) sobre PSR-7 |
| [`pivotphp/security`](https://github.com/PivotPHP/pivotphp-security) | Middlewares de segurança (CORS, headers, CSRF, JWT, rate limit, proxies) |

## Instalar em um projeto existente

```bash
composer require pivotphp/core
```

## Criar um novo projeto

O template oficial cria um projeto completo (config, rotas, controllers, testes):

```bash
composer create-project pivotphp/skeleton meu-app
cd meu-app
composer serve
```

A aplicação sobe em `http://localhost:8000`. A estrutura criada é:

```
meu-app/
├── config/
│   ├── app.php            # configuração app.*
│   └── bootstrap/app.php  # monta a aplicação (config, middleware, rotas)
├── public/index.php       # ponto de entrada HTTP
├── src/
│   ├── Controllers/       # controllers de exemplo (namespace App\Controllers)
│   └── Routers/api.php    # rotas
├── tests/                 # testes PHPUnit
├── .env.example
└── composer.json
```

Todo `config/*.php` é carregado pelo core como arquivo de configuração (deve retornar um array);
scripts como o bootstrap ficam em subpastas (`config/bootstrap/`), que o core não varre.

## Instalação manual

1. Inicialize o Composer no diretório do projeto:

   ```bash
   composer init
   ```

2. Instale o framework:

   ```bash
   composer require pivotphp/core
   ```

3. Crie o ponto de entrada `public/index.php`:

   ```php
   <?php
   require __DIR__ . '/../vendor/autoload.php';

   use PivotPHP\Core\Core\Application;

   $app = new Application();

   $app->get('/', fn ($req, $res) => $res->json([
       'message' => 'PivotPHP está funcionando!',
       'version' => Application::VERSION,
   ]));

   $app->run();
   ```

4. Inicie o servidor embutido do PHP:

   ```bash
   php -S localhost:8000 -t public
   ```

Visite `http://localhost:8000`: você deve receber um JSON confirmando a instalação.

## Próximos passos

- [Início Rápido]({{ '/pt/docs/quickstart/' | relative_url }}) — construa sua primeira API
- [Configuração]({{ '/pt/docs/configuration/' | relative_url }}) — `.env` e o objeto `Config`
- [Roteamento]({{ '/pt/docs/routing/' | relative_url }}) — parâmetros e constraints
