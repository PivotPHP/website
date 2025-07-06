---
layout: docs-i18n
title: Configuração
permalink: /pt/docs/configuracao/
lang: pt
---

# Configuração

O HelixPHP usa um sistema de configuração simples, mas poderoso, que permite gerenciar as configurações da sua aplicação em diferentes ambientes.

## Configuração de Ambiente

### O Arquivo .env

O HelixPHP usa variáveis de ambiente para gerenciar configurações que variam entre ambientes de implantação. O arquivo `.env` na raiz do seu projeto contém essas variáveis:

```bash
APP_NAME=HelixPHP
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=helix
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_DRIVER=sync

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

### Carregando Variáveis de Ambiente

As variáveis de ambiente são carregadas automaticamente quando sua aplicação inicia:

```php
// Acessar variáveis de ambiente
$debug = $_ENV['APP_DEBUG'];
$dbHost = $_ENV['DB_HOST'];

// Usando o helper env()
$debug = env('APP_DEBUG', false); // Com valor padrão
$appName = env('APP_NAME');
```

### Arquivos Específicos por Ambiente

Você pode ter arquivos de configuração específicos por ambiente:

- `.env` - Arquivo de ambiente padrão
- `.env.local` - Substituições para desenvolvimento local (ignorado pelo git)
- `.env.testing` - Ambiente de testes
- `.env.production` - Ambiente de produção

## Arquivos de Configuração

### Estrutura de Diretórios

Os arquivos de configuração são armazenados no diretório `config/`:

```
config/
├── app.php
├── database.php
├── cache.php
├── session.php
├── mail.php
└── services.php
```

### Criando Arquivos de Configuração

Cada arquivo de configuração retorna um array:

```php
// config/app.php
return [
    'name' => env('APP_NAME', 'HelixPHP'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'UTC',
    'locale' => 'pt_BR',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
];
```

### Acessando Configuração

Use o helper `config()` para acessar valores de configuração:

```php
// Obter um valor
$appName = config('app.name');
$dbHost = config('database.connections.mysql.host');

// Obter com valor padrão
$locale = config('app.locale', 'pt_BR');

// Definir um valor em tempo de execução
config(['app.timezone' => 'America/Sao_Paulo']);

// Verificar se a configuração existe
if (config()->has('mail.driver')) {
    // Configurar email
}
```

## Configuração da Aplicação

### Configurações Básicas

```php
// config/app.php
return [
    /*
    |--------------------------------------------------------------------------
    | Nome da Aplicação
    |--------------------------------------------------------------------------
    */
    'name' => env('APP_NAME', 'HelixPHP'),

    /*
    |--------------------------------------------------------------------------
    | Ambiente da Aplicação
    |--------------------------------------------------------------------------
    | Este valor determina o "ambiente" em que sua aplicação está executando.
    | Valores comuns: local, development, staging, production
    */
    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Modo Debug da Aplicação
    |--------------------------------------------------------------------------
    | Quando habilitado, mensagens detalhadas de erro com stack traces serão exibidas.
    | Deve ser desabilitado em produção.
    */
    'debug' => env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | URL da Aplicação
    |--------------------------------------------------------------------------
    */
    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Fuso Horário da Aplicação
    |--------------------------------------------------------------------------
    */
    'timezone' => 'America/Sao_Paulo',

    /*
    |--------------------------------------------------------------------------
    | Chave de Criptografia
    |--------------------------------------------------------------------------
    | Esta chave é usada para criptografia e deve ser uma string aleatória de 32 caracteres.
    */
    'key' => env('APP_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Provedores de Serviço
    |--------------------------------------------------------------------------
    */
    'providers' => [
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Aliases de Classes
    |--------------------------------------------------------------------------
    */
    'aliases' => [
        'App' => Helix\Support\Facades\App::class,
        'Config' => Helix\Support\Facades\Config::class,
        'DB' => Helix\Support\Facades\DB::class,
        'Route' => Helix\Support\Facades\Route::class,
    ],
];
```

## Configuração do Banco de Dados

```php
// config/database.php
return [
    'default' => env('DB_CONNECTION', 'mysql'),

    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'helix'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
            'options' => [
                PDO::ATTR_PERSISTENT => false,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'helix'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
        ],
    ],

    'migrations' => 'migrations',
];
```

## Configuração de Cache

```php
// config/cache.php
return [
    'default' => env('CACHE_DRIVER', 'file'),

    'stores' => [
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
        ],

        'memcached' => [
            'driver' => 'memcached',
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
        ],

        'array' => [
            'driver' => 'array',
        ],
    ],

    'prefix' => env('CACHE_PREFIX', 'helix_cache'),
];
```

## Configuração Personalizada

### Criando Arquivos de Config Personalizados

Crie seus próprios arquivos de configuração:

```php
// config/services.php
return [
    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook' => [
            'secret' => env('STRIPE_WEBHOOK_SECRET'),
            'tolerance' => env('STRIPE_WEBHOOK_TOLERANCE', 300),
        ],
    ],

    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('GITHUB_REDIRECT_URI'),
    ],
];
```

### Acessando Configuração Personalizada

```php
// Obter configuração do Stripe
$stripeKey = config('services.stripe.key');
$webhookSecret = config('services.stripe.webhook.secret');

// Usar em seus serviços
class StripeService
{
    private string $apiKey;
    
    public function __construct()
    {
        $this->apiKey = config('services.stripe.secret');
        \Stripe\Stripe::setApiKey($this->apiKey);
    }
}
```

## Cache de Configuração

Para melhor desempenho em produção, faça cache da sua configuração:

```bash
# Fazer cache da configuração
php helix config:cache

# Limpar cache de configuração
php helix config:clear
```

Quando a configuração está em cache:
- Todos os arquivos de config são combinados em um único arquivo
- Variáveis de ambiente nos arquivos de config são resolvidas
- Nenhum arquivo de config é carregado a cada requisição
- Mudanças nos arquivos de config requerem limpar o cache

## Configuração Dinâmica

### Configuração em Tempo de Execução

Defina valores de configuração em tempo de execução:

```php
// Definir um único valor
config(['app.timezone' => 'America/Sao_Paulo']);

// Definir múltiplos valores
config([
    'mail.driver' => 'smtp',
    'mail.host' => 'smtp.example.com',
    'mail.port' => 587,
]);

// Mesclar configuração
config()->merge('database.connections.mysql', [
    'strict' => false,
    'timezone' => '+00:00',
]);
```

### Repositório de Configuração

Acesse o repositório de configuração diretamente:

```php
use Helix\Config\Repository;

class ConfigService
{
    private Repository $config;
    
    public function __construct(Repository $config)
    {
        $this->config = $config;
    }
    
    public function getDatabaseConfig(): array
    {
        return $this->config->get('database.connections.mysql');
    }
    
    public function updateMailSettings(array $settings): void
    {
        $this->config->set('mail', array_merge(
            $this->config->get('mail', []),
            $settings
        ));
    }
}
```

## Detecção de Ambiente

```php
use Helix\Core\Application;

// Verificar ambiente atual
if (app()->environment('local')) {
    // Apenas ambiente local
}

if (app()->environment(['local', 'staging'])) {
    // Local ou staging
}

if (app()->environment('production')) {
    // Apenas produção
}

// Usando config
$env = config('app.env');

switch ($env) {
    case 'local':
        // Configuração local
        break;
    case 'production':
        // Configuração de produção
        break;
}
```

## Melhores Práticas

1. **Nunca faça commit de arquivos .env**: Adicione `.env` ao `.gitignore`
2. **Use env() apenas em arquivos de config**: Não chame `env()` fora dos arquivos de configuração
3. **Cache em produção**: Sempre faça cache da configuração em produção
4. **Valide a configuração**: Garanta que valores obrigatórios estejam presentes
5. **Use padrões sensatos**: Forneça padrões para configuração opcional
6. **Documente a configuração**: Comente seus arquivos de configuração
7. **Separe responsabilidades**: Agrupe configurações relacionadas em arquivos separados
8. **Type sua configuração**: Use arrays tipados ou classes de configuração

### Validação de Configuração

```php
// Em um service provider
public function boot()
{
    $this->validateConfiguration();
}

private function validateConfiguration(): void
{
    $required = [
        'app.key' => 'Chave da aplicação não está definida',
        'database.connections.mysql.host' => 'Host do banco de dados não está configurado',
        'mail.driver' => 'Driver de email não está configurado',
    ];
    
    foreach ($required as $key => $message) {
        if (empty(config($key))) {
            throw new \RuntimeException($message);
        }
    }
}
```

### Configuração Tipada

```php
// Criar classes de configuração tipadas
class DatabaseConfig
{
    public function __construct(
        public readonly string $driver,
        public readonly string $host,
        public readonly int $port,
        public readonly string $database,
        public readonly string $username,
        public readonly string $password,
    ) {}
    
    public static function fromArray(array $config): self
    {
        return new self(
            driver: $config['driver'] ?? 'mysql',
            host: $config['host'] ?? 'localhost',
            port: $config['port'] ?? 3306,
            database: $config['database'] ?? '',
            username: $config['username'] ?? '',
            password: $config['password'] ?? '',
        );
    }
}

// Uso
$dbConfig = DatabaseConfig::fromArray(config('database.connections.mysql'));
```