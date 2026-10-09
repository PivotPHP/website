---
redirect_from:
  - /docs/configuration/
  - /en/docs/configuration/
  - /en/configuration/
layout: docs
title: Configuração
permalink: /pt/docs/v1/configuration/
lang: pt
version: "1.2.0"
---

O PivotPHP separa a configuração em duas partes: variáveis de ambiente (`.env`) e o objeto `Config`.

## Variáveis de Ambiente

O arquivo `.env` na raiz do projeto é carregado automaticamente no boot e suas variáveis
ficam disponíveis via `Environment` (não há o helper `env()`).

```bash
APP_NAME=PivotPHP
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost
```

### Lendo variáveis

```php
use PivotPHP\Core\Core\Environment;

$name  = Environment::get('APP_NAME', 'PivotPHP');
$env   = Environment::getEnvironment();   // 'local', 'production', ...
$debug = Environment::isDebug();
$prod  = Environment::isProduction();

if (Environment::has('APP_NAME')) {
    // ...
}
```

Métodos disponíveis: `get()`, `has()`, `getEnvironment()`, `isDevelopment()`, `isDebug()`,
`isProduction()`, `isTesting()`, `isCli()`, `isWeb()`.

## Configuração via Config

O objeto `Config` (`PivotPHP\Core\Core\Config`) guarda pares chave/valor no formato
`namespace.chave` e é acessível via `$app->getConfig()`.

```php
use PivotPHP\Core\Core\Application;

$app = new Application();

$app->configure([
    'app.name'    => 'PivotPHP',
    'app.debug'   => true,
    'database.host' => '127.0.0.1',
]);

$name = $app->getConfig()->get('app.name', 'PivotPHP');
$host = $app->getConfig()->get('database.host');
```

### A partir de um array ou diretório

```php
use PivotPHP\Core\Core\Config;

$config = Config::fromArray([
    'app' => ['name' => 'PivotPHP', 'debug' => true],
]);

$config = Config::fromDirectory(__DIR__ . '/config');
```

### Lendo e escrevendo

```php
$config = $app->getConfig();

$config->set('app.timezone', 'America/Sao_Paulo');  // define
$config->has('app.name');                            // bool
$config->get('app.name', 'padrão');                  // valor com padrão
$config->getNamespace('app');                        // array do namespace 'app'
$config->all();                                      // array completo
```

Não há o helper `config()` nem acesso por array (`$config['app']`); use os métodos acima.

## Detecção de Ambiente

```php
use PivotPHP\Core\Core\Environment;

if (Environment::isProduction()) {
    // apenas produção
} elseif (Environment::isDevelopment()) {
    // apenas desenvolvimento
}

$env = Environment::getEnvironment(); // valor de APP_ENV
```

## Melhores Práticas

1. **Nunca faça commit do `.env`**: adicione-o ao `.gitignore`.
2. **Use `.env` para segredos** e o `Config` para a estrutura da aplicação.
3. **Forneça padrões** via o segundo argumento de `get()`.
4. **Agrupe por namespace** (`app.*`, `database.*`) para manter o `Config` legível.
