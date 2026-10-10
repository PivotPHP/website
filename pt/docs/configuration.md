---
redirect_from:
  - /docs/configuration/
  - /en/docs/configuration/
  - /en/configuration/
layout: docs
title: Configuração
permalink: /pt/docs/configuration/
lang: pt
---

O PivotPHP separa a configuração em duas partes: variáveis de ambiente (`.env`) e o objeto `Config`
(que pode carregar arquivos PHP de um diretório `config/`).

## Variáveis de ambiente

Ao construir a aplicação com um `basePath`, o arquivo `.env` da raiz é carregado no boot. Variáveis
já presentes no ambiente real têm precedência sobre o `.env`.

```bash
APP_NAME=PivotPHP
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost
```

Leia os valores pelo `PivotPHP\Core\Core\Environment`:

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
`isProduction()`, `isTesting()`, `isCli()`, `isWeb()`, `clearCache()`, `getDebugInfo()`.

## O objeto Config

`Config` (`PivotPHP\Core\Core\Config`) guarda pares chave/valor no formato `namespace.chave` e é
acessível via `$app->getConfig()`.

```php
use PivotPHP\Core\Core\Application;

$app = new Application();

$app->configure([
    'app.name'      => 'PivotPHP',
    'app.debug'     => true,
    'database.host' => '127.0.0.1',
]);

$name = $app->getConfig()->get('app.name', 'PivotPHP');
$host = $app->getConfig()->get('database.host');
```

### Carregando arquivos de um diretório

`Config` pode carregar um diretório `config/` inteiro (um arquivo PHP por nome, retornando um array):

```php
$config = $app->getConfig();
$config->setConfigPath(__DIR__ . '/config')->loadAll();
```

Com um `basePath` definido, o boot já procura `config/` automaticamente (o skeleton usa esse layout).
Arquivos individuais podem ser carregados com `load('app')`.

### Lendo e escrevendo

```php
$config = $app->getConfig();

$config->set('app.timezone', 'America/Sao_Paulo');  // define
$config->has('app.name');                            // bool
$config->get('app.name', 'padrão');                  // valor com padrão
$config->getNamespace('app');                        // array do namespace 'app'
$config->all();                                      // array completo
$config->forget('app.timezone');                     // remove uma chave
$config->merge(['app' => ['locale' => 'pt_BR']]);    // mescla
```

Não há helper global `config()` nem acesso por array (`$config['app']`); use os métodos acima.

## Arquivo de configuração (layout do skeleton)

Um arquivo em `config/` retorna um array associativo. O skeleton usa:

```php
<?php
// config/app.php
return [
    'name'  => $_ENV['APP_NAME'] ?? 'PivotPHP API',
    'env'   => $_ENV['APP_ENV'] ?? 'production',
    'debug' => filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOL),
];
```

E é lido no bootstrap:

```php
$app = new Application(__DIR__);
$debug = $app->getConfig()->get('app.debug', false);
```

## Detecção de ambiente

```php
use PivotPHP\Core\Core\Environment;

if (Environment::isProduction()) {
    // produção
} elseif (Environment::isDevelopment()) {
    // desenvolvimento
}

$env = Environment::getEnvironment(); // valor de APP_ENV
```

## Melhores práticas

1. **Nunca faça commit do `.env`**: adicione-o ao `.gitignore`.
2. **Use `.env` para segredos** e o `Config` para a estrutura da aplicação.
3. **Forneça padrões** via o segundo argumento de `get()`.
4. **Agrupe por namespace** (`app.*`, `database.*`) para manter a configuração legível.
5. **`app.debug` desligado em produção**: com ele ligado, respostas de erro expõem mensagem, arquivo,
   linha e traceback da exceção.
