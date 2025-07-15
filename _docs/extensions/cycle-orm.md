---
layout: docs
title: Cycle ORM Extension v1.0.1
permalink: /docs/extensions/cycle-orm/
---

# PivotPHP Cycle ORM Extension v1.0.1

The **pivotphp-cycle-orm** extension provides seamless database integration with the PivotPHP microframework using the powerful Cycle ORM. This extension offers zero-configuration setup, automatic migrations, repository patterns, and comprehensive monitoring capabilities.

## 🚀 Key Features

- **Zero-Configuration Setup**: Works out of the box with sensible defaults
- **Type Safety**: Full type safety with PHPStan Level 8+ analysis
- **Repository Pattern**: Built-in repository pattern with caching
- **Performance Monitoring**: Query logging and performance profiling
- **Automatic Migrations**: Schema compilation and migration support
- **Multiple Database Support**: SQLite (default) and MySQL connections
- **Transaction Middleware**: Automatic transaction handling
- **Health Checks**: Database health monitoring

## 📦 Installation

```bash
composer require pivotphp/cycle-orm
```

## 🔧 Quick Start

### 1. Register the Service Provider

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\CycleORM\CycleServiceProvider;

$app = new Application();

// Register Cycle ORM service provider
$app->register(new CycleServiceProvider($app));
```

### 2. Environment Configuration

Create or update your `.env` file:

```env
# Application
APP_NAME="My Project"
APP_ENV=development
APP_DEBUG=true

# Database Configuration
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# For MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=my_database
# DB_USERNAME=root
# DB_PASSWORD=secret

# Cycle ORM Settings
CYCLE_ENTITY_DIRS=src/Entities
CYCLE_LOG_QUERIES=true
CYCLE_PROFILE_QUERIES=true
```

### 3. Create Your First Entity

Create `src/Entities/User.php`:

```php
<?php

declare(strict_types=1);

namespace App\Entities;

use Cycle\Annotated\Annotation\Column;
use Cycle\Annotated\Annotation\Entity;
use Cycle\Annotated\Annotation\Table;

#[Entity(repository: \App\Repositories\UserRepository::class)]
#[Table(name: 'users')]
class User
{
    #[Column(type: 'primary')]
    private ?int $id = null;

    #[Column(type: 'string', nullable: false)]
    private string $name;

    #[Column(type: 'string', nullable: false, unique: true)]
    private string $email;

    #[Column(type: 'string', nullable: false)]
    private string $password;

    #[Column(type: 'datetime')]
    private \DateTimeInterface $createdAt;

    #[Column(type: 'datetime')]
    private \DateTimeInterface $updatedAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    // Getters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    // Setters
    public function setName(string $name): self
    {
        $this->name = $name;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function setPassword(string $password): self
    {
        $this->password = password_hash($password, PASSWORD_DEFAULT);
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function verifyPassword(string $password): bool
    {
        return password_verify($password, $this->password);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
        ];
    }
}
```

### 4. Using in Routes with Helper Middleware

PivotPHP Cycle ORM provides a custom middleware that injects ORM services directly into your request:

```php
// In your main application file (public/index.php)

// ... after registering the CycleServiceProvider

// Custom middleware for Cycle ORM access
$app->use(function ($req, $res, $next) use ($app) {
    $container = $app->getContainer();

    if (!$container->has('cycle.orm')) {
        throw new \RuntimeException('Cycle ORM not properly registered');
    }

    // Get Cycle ORM services
    $orm = $container->get('cycle.orm');
    $em = $container->get('cycle.em');
    $db = $container->get('cycle.database');
    $repository = $container->get('cycle.repository');

    // Inject services as request attributes
    $req->setAttribute('cycle.orm', $orm);
    $req->setAttribute('cycle.em', $em);
    $req->setAttribute('cycle.db', $db);
    $req->setAttribute('cycle.repository', $repository);

    // Helper methods
    $req->setAttribute('repository', function(string $entityClass) use ($repository) {
        return $repository->getRepository($entityClass);
    });

    $req->setAttribute('entity', function(string $entityClass, array $data = []) use ($orm) {
        return $orm->make($entityClass, $data);
    });

    $req->setAttribute('entityManager', function() use ($em) {
        return $em;
    });

    $next($req, $res);
});

// Define your routes
$app->get('/api/users', function($req, $res) {
    try {
        // Get repository helper
        $repositoryHelper = $req->getAttribute('repository');
        $repository = $repositoryHelper(User::class);

        // Fetch all users
        $users = $repository->findAll();

        // Convert to array
        $userData = array_map(fn(User $user) => $user->toArray(), $users);

        return $res->json([
            'success' => true,
            'data' => $userData,
            'count' => count($userData)
        ]);
    } catch (\Exception $e) {
        return $res->status(500)->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
});

$app->post('/api/users', function($req, $res) {
    try {
        $data = $req->getBody();

        // Basic validation
        if (!isset($data['name'], $data['email'], $data['password'])) {
            return $res->status(400)->json([
                'success' => false,
                'error' => 'Name, email and password are required'
            ]);
        }

        // Get helpers
        $repositoryHelper = $req->getAttribute('repository');
        $entityManagerHelper = $req->getAttribute('entityManager');

        $repository = $repositoryHelper(User::class);
        $entityManager = $entityManagerHelper();

        // Check if email already exists
        if ($repository->findOne(['email' => $data['email']])) {
            return $res->status(409)->json([
                'success' => false,
                'error' => 'Email already exists'
            ]);
        }

        // Create new user
        $user = new User();
        $user->setName($data['name']);
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);

        // Persist to database
        $entityManager->persist($user);
        $entityManager->run();

        return $res->status(201)->json([
            'success' => true,
            'data' => $user->toArray()
        ]);
    } catch (\Exception $e) {
        return $res->status(500)->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
});

$app->run();
```

## 🏗️ Advanced Features

### Custom Repositories

Create `src/Repositories/UserRepository.php`:

```php
<?php

declare(strict_types=1);

namespace App\Repositories;

use Cycle\ORM\Select\Repository;
use App\Entities\User;

class UserRepository extends Repository
{
    public function findByEmail(string $email): ?User
    {
        return $this->findOne(['email' => $email]);
    }

    public function findActive(): array
    {
        return $this->select()
            ->where('active', true)
            ->orderBy('created_at', 'DESC')
            ->fetchAll();
    }

    public function findRecentUsers(int $days = 30): array
    {
        $since = new \DateTime("-{$days} days");
        
        return $this->select()
            ->where('created_at', '>=', $since)
            ->orderBy('created_at', 'DESC')
            ->fetchAll();
    }
}
```

### Transaction Middleware

For automatic transaction handling:

```php
use PivotPHP\CycleORM\Middleware\TransactionMiddleware;

$app->post('/api/orders', 
    new TransactionMiddleware(),
    function($req, $res) {
        // All database operations are wrapped in a transaction
        $order = new Order();
        $req->getAttribute('entityManager')()->persist($order);

        // If an exception occurs, transaction is rolled back
        foreach ($req->input('items') as $item) {
            $orderItem = new OrderItem();
            $req->getAttribute('entityManager')()->persist($orderItem);
        }

        return $res->json($order);
    }
);
```

### Performance Monitoring

```php
use PivotPHP\CycleORM\Monitoring\QueryLogger;
use PivotPHP\CycleORM\Monitoring\PerformanceProfiler;

// Enable query logging
$app->get('/debug/queries', function($req, $res) use ($app) {
    $logger = $app->getContainer()->get('cycle.query_logger');
    $stats = $logger->getStatistics();
    
    return $res->json([
        'total_queries' => $stats['total_queries'],
        'total_time' => $stats['total_time'],
        'queries' => $stats['queries']
    ]);
});

// Performance profiling
$app->get('/debug/profile', function($req, $res) use ($app) {
    $profiler = $app->getContainer()->get('cycle.profiler');
    $profile = $profiler->getProfile();
    
    return $res->json([
        'duration' => $profile['duration'],
        'memory_peak' => $profile['memory_peak'],
        'queries_count' => $profile['queries_count']
    ]);
});
```

### Health Checks

```php
use PivotPHP\CycleORM\Health\CycleHealthCheck;

$app->get('/health', function($req, $res) use ($app) {
    $health = $app->getContainer()->get('cycle.health');
    $status = $health->check();

    return $res->json([
        'status' => $status->isHealthy() ? 'healthy' : 'unhealthy',
        'database' => $status->getData(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});
```

## 🛠️ Console Commands

### Setup Console Commands

Create `bin/console`:

```php
#!/usr/bin/env php
<?php

declare(strict_types=1);

use PivotPHP\Core\Core\Application;
use PivotPHP\CycleORM\CycleServiceProvider;
use PivotPHP\CycleORM\Commands\SchemaCommand;
use PivotPHP\CycleORM\Commands\MigrateCommand;
use PivotPHP\CycleORM\Commands\StatusCommand;

require_once dirname(__DIR__) . '/vendor/autoload.php';

chdir(dirname(__DIR__));

// Configuration
$_ENV['DB_CONNECTION'] = 'sqlite';
$_ENV['DB_DATABASE'] = __DIR__ . '/../database/database.sqlite';
$_ENV['CYCLE_ENTITY_DIRS'] = 'src/Entities';

$app = new Application();
$app->register(new CycleServiceProvider($app));
$container = $app->getContainer();

$command = $argv[1] ?? 'help';

switch ($command) {
    case 'cycle:schema:sync':
        $schemaCommand = new SchemaCommand(['--sync' => true], $container);
        $schemaCommand->handle();
        break;

    case 'cycle:migrate':
        $migrateCommand = new MigrateCommand([], $container);
        $migrateCommand->handle();
        break;

    case 'cycle:status':
        $statusCommand = new StatusCommand([], $container);
        $statusCommand->handle();
        break;

    case 'help':
    default:
        echo "Available commands:\n";
        echo "  cycle:schema:sync  Sync database schema\n";
        echo "  cycle:migrate      Run migrations\n";
        echo "  cycle:status       Check migration status\n";
        echo "  help              Show this help message\n";
        break;
}
```

Make it executable:

```bash
chmod +x bin/console
```

### Using Console Commands

```bash
# Create/update database schema
php bin/console cycle:schema:sync

# Check status
php bin/console cycle:status

# Run migrations
php bin/console cycle:migrate
```

## 🔧 Configuration Options

The Cycle ORM extension supports various configuration options via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_CONNECTION` | `sqlite` | Database driver (sqlite, mysql) |
| `DB_DATABASE` | `database/database.sqlite` | Database name/path |
| `DB_HOST` | `localhost` | Database host (MySQL) |
| `DB_PORT` | `3306` | Database port (MySQL) |
| `DB_USERNAME` | `root` | Database username (MySQL) |
| `DB_PASSWORD` | `` | Database password (MySQL) |
| `CYCLE_ENTITY_DIRS` | `src/Entities` | Entity directories |
| `CYCLE_LOG_QUERIES` | `false` | Enable query logging |
| `CYCLE_PROFILE_QUERIES` | `false` | Enable performance profiling |

## 🚀 Performance Tips

### 1. Use Repository Caching
The `RepositoryFactory` automatically caches repositories for better performance.

### 2. Enable Query Profiling
Monitor slow queries in development:

```env
CYCLE_LOG_QUERIES=true
CYCLE_PROFILE_QUERIES=true
```

### 3. Optimize Entity Loading
Use eager loading to prevent N+1 queries:

```php
$users = $repository->select()
    ->with('posts')
    ->with('profile')
    ->fetchAll();
```

### 4. Use Transactions for Bulk Operations
For multiple operations, use transactions:

```php
$em = $req->getAttribute('entityManager')();

try {
    $em->getTransaction()->begin();
    
    foreach ($items as $item) {
        $entity = new Entity();
        $em->persist($entity);
    }
    
    $em->run();
    $em->getTransaction()->commit();
} catch (\Exception $e) {
    $em->getTransaction()->rollback();
    throw $e;
}
```

## 🐛 Troubleshooting

### Common Issues

**Error: "The directory does not exist"**
```bash
mkdir -p src/Entities
```

**Error: "Cycle ORM not properly registered"**
```php
// Make sure to register the service provider
$app->register(new CycleServiceProvider($app));
```

**Error: "Database connection failed"**
- Check your `.env` configuration
- Ensure database directory exists for SQLite
- Verify MySQL connection details

### Debug Mode

Enable debug mode for detailed error messages:

```env
APP_DEBUG=true
```

## 📚 Related Documentation

- [Cycle ORM Official Documentation](https://cycle-orm.dev/)
- [PivotPHP Core Documentation]({{ '/docs/' | relative_url }})
- [Database Configuration]({{ '/docs/database/' | relative_url }})
- [Extension Development]({{ '/docs/extensions/' | relative_url }})

## 🤝 Support

- **GitHub Issues**: [Report issues](https://github.com/PivotPHP/pivotphp-cycle-orm/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/DMtxsP7z)
- **Documentation**: [Complete guide](https://github.com/PivotPHP/pivotphp-cycle-orm/blob/main/docs/integration-guide.md)

---

*The PivotPHP Cycle ORM extension is production-ready and fully tested with the PivotPHP ecosystem v1.1.0.*