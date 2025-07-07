---
layout: docs-i18n
title: Instalação
permalink: /pt/docs/instalacao/
lang: pt
---

# Instalação

## Requisitos

Antes de instalar o PivotPHP, certifique-se de que seu sistema atenda aos seguintes requisitos:

- **PHP 8.1** ou superior
- **Composer** (versão mais recente recomendada)
- **ext-json** extensão PHP
- **ext-mbstring** extensão PHP

## Instalar via Composer

A maneira recomendada de instalar o PivotPHP é através do [Composer](https://getcomposer.org/):

```bash
composer require pivotphp/framework
```

## Criar um Novo Projeto

Para criar um novo projeto PivotPHP com uma estrutura básica:

```bash
composer create-project pivotphp/pivotphp meu-app
cd meu-app
```

Isso criará um novo diretório chamado `meu-app` com uma estrutura básica de projeto:

```
meu-app/
├── public/
│   └── index.php
├── src/
│   ├── Controllers/
│   ├── Middleware/
│   └── Providers/
├── config/
├── tests/
├── .env.example
├── .gitignore
├── composer.json
└── README.md
```

## Instalação Manual

Se você preferir configurar seu projeto manualmente:

1. Crie um novo diretório para seu projeto
2. Inicialize o Composer:
   ```bash
   composer init
   ```
3. Requisite o PivotPHP:
   ```bash
   composer require pivotphp/framework
   ```
4. Crie seu ponto de entrada:
   ```bash
   mkdir public
   touch public/index.php
   ```

## Verificar a Instalação

Para verificar que o PivotPHP está instalado corretamente, crie um arquivo `index.php` simples:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use PivotPHP\Core\Core\Application;

$app = new Application();

$app->get('/', function($request, $response) {
    return $response->json([
        'message' => 'PivotPHP está funcionando!', // PivotPHP está rodando!
        'version' => Application::VERSION
    ]);
});

$app->run();
```

Em seguida, inicie o servidor PHP integrado:

```bash
php -S localhost:8000 -t public
```

Visite `http://localhost:8000` em seu navegador. Você deve ver uma resposta JSON confirmando que o PivotPHP está funcionando.

## Próximos Passos

Agora que você tem o PivotPHP instalado, você está pronto para construir sua primeira aplicação! Confira nosso [guia de Início Rápido]({{ '/pt/docs/inicio-rapido/' | relative_url }}) para aprender o básico.
