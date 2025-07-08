---
layout: docs
title: Configuration
permalink: /docs/configuration/
---

PivotPHP uses a simple yet powerful configuration system that allows you to manage your application settings across different environments.

## Environment Configuration

### The .env File

PivotPHP uses environment variables to manage configuration that varies between deployment environments. The `.env` file in your project root contains these variables:

```bash
APP_NAME=PivotPHP
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pivotphp
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

### Loading Environment Variables

Environment variables are automatically loaded when your application starts:

```php
// Access environment variables
$debug = $_ENV['APP_DEBUG'];
$dbHost = $_ENV['DB_HOST'];

// Using the env() helper
$debug = env('APP_DEBUG', false); // With default value
$appName = env('APP_NAME');
```

### Environment-Specific Files

You can have environment-specific configuration files:

- `.env` - Default environment file
- `.env.local` - Local development overrides (gitignored)
- `.env.testing` - Testing environment
- `.env.production` - Production environment

## Configuration Files

### Directory Structure

Configuration files are stored in the `config/` directory:

```
config/
├── app.php
├── database.php
├── cache.php
├── session.php
├── mail.php
└── services.php
```

### Creating Configuration Files

Each configuration file returns an array:

```php
// config/app.php
return [
    'name' => env('APP_NAME', 'PivotPHP'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'UTC',
    'locale' => 'en',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
];
```

### Accessing Configuration

Use the `config()` helper to access configuration values:

```php
// Get a value
$appName = config('app.name');
$dbHost = config('database.connections.mysql.host');

// Get with default value
$locale = config('app.locale', 'en');

// Set a value at runtime
config(['app.timezone' => 'America/New_York']);

// Check if configuration exists
if (config()->has('mail.driver')) {
    // Configure mail
}
```

## Application Configuration

### Basic Settings

```php
// config/app.php
return [
    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    */
    'name' => env('APP_NAME', 'PivotPHP'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    | This value determines the "environment" your application is running in.
    | Common values: local, development, staging, production
    */
    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    | When enabled, detailed error messages with stack traces will be shown.
    | Should be disabled in production.
    */
    'debug' => env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    */
    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    */
    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    | This key is used for encryption and should be a random 32-character string.
    */
    'key' => env('APP_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Service Providers
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
    | Class Aliases
    |--------------------------------------------------------------------------
    */
    'aliases' => [
        'App' => PivotPHP\Support\Facades\App::class,
        'Config' => PivotPHP\Support\Facades\Config::class,
        'DB' => PivotPHP\Support\Facades\DB::class,
        'Route' => PivotPHP\Support\Facades\Route::class,
    ],
];
```

## Database Configuration

```php
// config/database.php
return [
    'default' => env('DB_CONNECTION', 'mysql'),

    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'pivotphp'),
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
            'database' => env('DB_DATABASE', 'pivotphp'),
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

## Cache Configuration

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

    'prefix' => env('CACHE_PREFIX', 'pivotphp_cache'),
];
```

## Custom Configuration

### Creating Custom Config Files

Create your own configuration files:

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

### Accessing Custom Configuration

```php
// Get Stripe configuration
$stripeKey = config('services.stripe.key');
$webhookSecret = config('services.stripe.webhook.secret');

// Use in your services
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

## Configuration Caching

For production performance, cache your configuration:

```bash
# Cache configuration
php bin/console config:cache

# Clear configuration cache
php bin/console config:clear
```

When configuration is cached:
- All config files are combined into a single file
- Environment variables in config files are resolved
- No config files are loaded on each request
- Changes to config files require clearing the cache

## Dynamic Configuration

### Runtime Configuration

Set configuration values at runtime:

```php
// Set a single value
config(['app.timezone' => 'America/New_York']);

// Set multiple values
config([
    'mail.driver' => 'smtp',
    'mail.host' => 'smtp.example.com',
    'mail.port' => 587,
]);

// Merge configuration
config()->merge('database.connections.mysql', [
    'strict' => false,
    'timezone' => '+00:00',
]);
```

### Configuration Repository

Access the configuration repository directly:

```php
use PivotPHP\Config\Repository;

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

## Environment Detection

```php
use PivotPHP\Core\Core\Application;

// Check current environment
if (app()->environment('local')) {
    // Local environment only
}

if (app()->environment(['local', 'staging'])) {
    // Local or staging
}

if (app()->environment('production')) {
    // Production only
}

// Using config
$env = config('app.env');

switch ($env) {
    case 'local':
        // Local configuration
        break;
    case 'production':
        // Production configuration
        break;
}
```

## Best Practices

1. **Never commit .env files**: Add `.env` to `.gitignore`
2. **Use env() only in config files**: Don't call `env()` outside configuration files
3. **Cache in production**: Always cache configuration in production
4. **Validate configuration**: Ensure required values are present
5. **Use sensible defaults**: Provide defaults for optional configuration
6. **Document configuration**: Comment your configuration files
7. **Separate concerns**: Group related configuration in separate files
8. **Type your configuration**: Use typed arrays or configuration classes

### Configuration Validation

```php
// In a service provider
public function boot()
{
    $this->validateConfiguration();
}

private function validateConfiguration(): void
{
    $required = [
        'app.key' => 'Application key is not set',
        'database.connections.mysql.host' => 'Database host is not configured',
        'mail.driver' => 'Mail driver is not configured',
    ];

    foreach ($required as $key => $message) {
        if (empty(config($key))) {
            throw new \RuntimeException($message);
        }
    }
}
```

### Typed Configuration

```php
// Create typed configuration classes
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

// Usage
$dbConfig = DatabaseConfig::fromArray(config('database.connections.mysql'));
```
