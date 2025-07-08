---
layout: docs
title: Database
permalink: /docs/database/
---

PivotPHP provides a simple and efficient database layer using PDO (PHP Data Objects) for basic database operations. For more advanced features like ORM, migrations, and relations, check out the [Cycle ORM Extension](/docs/extensions/cycle-orm/).

## Configuration

Configure your database connection in the `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pivotphp
DB_USERNAME=root
DB_PASSWORD=
```

### Database Configuration File

Create `config/database.php`:

```php
<?php

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
            'options' => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ],
        ],
        
        'pgsql' => [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'pivotphp'),
            'username' => env('DB_USERNAME', 'postgres'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'schema' => 'public',
        ],
        
        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],
    ],
];
```

## Database Service Provider

Create a service provider to register the database connection:

```php
namespace App\Providers;

use PDO;
use PivotPHP\Core\Providers\ServiceProvider;

class DatabaseServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->container->singleton(PDO::class, function ($container) {
            $config = $container->get('config')->get('database');
            $connection = $config['default'];
            $settings = $config['connections'][$connection];
            
            $dsn = $this->buildDsn($settings);
            
            return new PDO(
                $dsn,
                $settings['username'] ?? null,
                $settings['password'] ?? null,
                $settings['options'] ?? []
            );
        });
        
        // Alias for convenience
        $this->container->alias('db', PDO::class);
    }
    
    private function buildDsn(array $config): string
    {
        switch ($config['driver']) {
            case 'mysql':
                return sprintf(
                    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                    $config['host'],
                    $config['port'],
                    $config['database'],
                    $config['charset']
                );
                
            case 'pgsql':
                return sprintf(
                    'pgsql:host=%s;port=%s;dbname=%s',
                    $config['host'],
                    $config['port'],
                    $config['database']
                );
                
            case 'sqlite':
                return 'sqlite:' . $config['database'];
                
            default:
                throw new \InvalidArgumentException("Unsupported driver: {$config['driver']}");
        }
    }
}
```

## Basic Usage

### Dependency Injection

Inject the PDO instance into your controllers or services:

```php
use PDO;
use PivotPHP\Core\Http\Request;
use PivotPHP\Core\Http\Response;

class UserController
{
    public function __construct(
        private PDO $db
    ) {}
    
    public function index(Request $request, Response $response): Response
    {
        $stmt = $this->db->query('SELECT * FROM users ORDER BY created_at DESC');
        $users = $stmt->fetchAll();
        
        return $response->json($users);
    }
}
```

### Query Examples

#### Select Queries

```php
// Fetch all records
$stmt = $db->query('SELECT * FROM users');
$users = $stmt->fetchAll();

// Fetch with parameters
$stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => 'user@example.com']);
$user = $stmt->fetch();

// Fetch with LIKE
$stmt = $db->prepare('SELECT * FROM users WHERE name LIKE :search');
$stmt->execute(['search' => '%john%']);
$users = $stmt->fetchAll();
```

#### Insert Queries

```php
$stmt = $db->prepare('
    INSERT INTO users (name, email, password, created_at) 
    VALUES (:name, :email, :password, :created_at)
');

$stmt->execute([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => password_hash('secret', PASSWORD_DEFAULT),
    'created_at' => date('Y-m-d H:i:s'),
]);

$userId = $db->lastInsertId();
```

#### Update Queries

```php
$stmt = $db->prepare('
    UPDATE users 
    SET name = :name, updated_at = :updated_at 
    WHERE id = :id
');

$stmt->execute([
    'id' => 1,
    'name' => 'Jane Doe',
    'updated_at' => date('Y-m-d H:i:s'),
]);

$affectedRows = $stmt->rowCount();
```

#### Delete Queries

```php
$stmt = $db->prepare('DELETE FROM users WHERE id = :id');
$stmt->execute(['id' => 1]);

$deletedRows = $stmt->rowCount();
```

## Transactions

Handle database transactions for data integrity:

```php
try {
    $db->beginTransaction();
    
    // Insert user
    $stmt = $db->prepare('INSERT INTO users (name, email) VALUES (:name, :email)');
    $stmt->execute(['name' => 'John', 'email' => 'john@example.com']);
    $userId = $db->lastInsertId();
    
    // Insert profile
    $stmt = $db->prepare('INSERT INTO profiles (user_id, bio) VALUES (:user_id, :bio)');
    $stmt->execute(['user_id' => $userId, 'bio' => 'Hello world']);
    
    $db->commit();
} catch (\Exception $e) {
    $db->rollBack();
    throw $e;
}
```

## Query Builder Class

For convenience, you can create a simple query builder:

```php
namespace App\Database;

use PDO;

class QueryBuilder
{
    private PDO $pdo;
    private string $table;
    private array $wheres = [];
    private array $bindings = [];
    private ?int $limit = null;
    private ?int $offset = null;
    private array $orderBy = [];
    
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }
    
    public function table(string $table): self
    {
        $this->table = $table;
        return $this;
    }
    
    public function where(string $column, $operator, $value = null): self
    {
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }
        
        $placeholder = ':where_' . count($this->bindings);
        $this->wheres[] = "$column $operator $placeholder";
        $this->bindings[$placeholder] = $value;
        
        return $this;
    }
    
    public function orderBy(string $column, string $direction = 'ASC'): self
    {
        $this->orderBy[] = "$column $direction";
        return $this;
    }
    
    public function limit(int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }
    
    public function offset(int $offset): self
    {
        $this->offset = $offset;
        return $this;
    }
    
    public function get(): array
    {
        $sql = "SELECT * FROM {$this->table}";
        
        if (!empty($this->wheres)) {
            $sql .= ' WHERE ' . implode(' AND ', $this->wheres);
        }
        
        if (!empty($this->orderBy)) {
            $sql .= ' ORDER BY ' . implode(', ', $this->orderBy);
        }
        
        if ($this->limit !== null) {
            $sql .= " LIMIT {$this->limit}";
        }
        
        if ($this->offset !== null) {
            $sql .= " OFFSET {$this->offset}";
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        
        return $stmt->fetchAll();
    }
    
    public function first(): ?array
    {
        $this->limit(1);
        $results = $this->get();
        
        return $results[0] ?? null;
    }
    
    public function insert(array $data): int
    {
        $columns = array_keys($data);
        $placeholders = array_map(fn($col) => ":$col", $columns);
        
        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s)",
            $this->table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($data);
        
        return $this->pdo->lastInsertId();
    }
    
    public function update(array $data): int
    {
        $sets = [];
        foreach ($data as $column => $value) {
            $sets[] = "$column = :set_$column";
            $this->bindings[":set_$column"] = $value;
        }
        
        $sql = "UPDATE {$this->table} SET " . implode(', ', $sets);
        
        if (!empty($this->wheres)) {
            $sql .= ' WHERE ' . implode(' AND ', $this->wheres);
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        
        return $stmt->rowCount();
    }
    
    public function delete(): int
    {
        $sql = "DELETE FROM {$this->table}";
        
        if (!empty($this->wheres)) {
            $sql .= ' WHERE ' . implode(' AND ', $this->wheres);
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        
        return $stmt->rowCount();
    }
}
```

### Using the Query Builder

```php
// Register in service provider
$this->container->singleton(QueryBuilder::class, function ($container) {
    return new QueryBuilder($container->get(PDO::class));
});

// Usage in controller
public function index(QueryBuilder $query, Response $response): Response
{
    $users = $query->table('users')
        ->where('active', true)
        ->orderBy('created_at', 'DESC')
        ->limit(10)
        ->get();
    
    return $response->json($users);
}
```

## Database Helpers

Create helper functions for common database operations:

```php
namespace App\Database;

use PDO;

class DatabaseHelper
{
    private PDO $pdo;
    
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }
    
    public function tableExists(string $table): bool
    {
        try {
            $result = $this->pdo->query("SELECT 1 FROM $table LIMIT 1");
            return $result !== false;
        } catch (\Exception $e) {
            return false;
        }
    }
    
    public function getTableColumns(string $table): array
    {
        $sql = "SHOW COLUMNS FROM $table";
        $stmt = $this->pdo->query($sql);
        
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    public function truncateTable(string $table): void
    {
        $this->pdo->exec("TRUNCATE TABLE $table");
    }
    
    public function getDatabaseSize(): array
    {
        $sql = "
            SELECT 
                table_schema AS 'database',
                SUM(data_length + index_length) / 1024 / 1024 AS 'size_mb'
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
            GROUP BY table_schema
        ";
        
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch();
    }
}
```

## Best Practices

### 1. Always Use Prepared Statements

```php
// ❌ Don't do this - SQL injection vulnerability
$email = $_POST['email'];
$stmt = $db->query("SELECT * FROM users WHERE email = '$email'");

// ✅ Do this instead
$stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $_POST['email']]);
```

### 2. Handle Exceptions

```php
try {
    $stmt = $db->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();
} catch (PDOException $e) {
    // Log error
    error_log($e->getMessage());
    
    // Return error response
    return $response->json(['error' => 'Database error'], 500);
}
```

### 3. Use Transactions for Multiple Operations

```php
$db->beginTransaction();
try {
    // Multiple database operations
    $db->commit();
} catch (\Exception $e) {
    $db->rollBack();
    throw $e;
}
```

### 4. Close Connections

PDO automatically closes connections when the script ends, but for long-running scripts:

```php
// Close connection
$db = null;
```

## Need More Features?

For advanced database features including:
- Full ORM capabilities
- Database migrations
- Schema management
- Relations (One-to-Many, Many-to-Many)
- Entity events
- Query caching

Check out the [Cycle ORM Extension](/docs/extensions/cycle-orm/) which provides all these features and more.