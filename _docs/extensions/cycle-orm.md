---
layout: docs
title: Cycle ORM Extension
permalink: /docs/extensions/cycle-orm/
---

Cycle ORM is a powerful DataMapper ORM for PHP that provides a complete solution for working with databases in PivotPHP applications.

## Installation

```bash
composer require pivotphp/cycle-orm
```

## Configuration

After installation, register the service provider in your `config/app.php`:

```php
'providers' => [
    // ... other providers
    PivotPHP\CycleORM\Providers\CycleServiceProvider::class,
],
```

### Database Configuration

Configure your database connection in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pivotphp
DB_USERNAME=root
DB_PASSWORD=
```

## Basic Usage

### Defining Entities

```php
namespace App\Entities;

use Cycle\Annotated\Annotation\Entity;
use Cycle\Annotated\Annotation\Column;

#[Entity(table: 'users')]
class User
{
    #[Column(type: 'primary')]
    private int $id;
    
    #[Column(type: 'string')]
    private string $name;
    
    #[Column(type: 'string', unique: true)]
    private string $email;
    
    #[Column(type: 'datetime')]
    private \DateTimeInterface $createdAt;
    
    // Getters and setters...
}
```

### Repository Pattern

```php
namespace App\Repositories;

use Cycle\ORM\Select\Repository;

class UserRepository extends Repository
{
    public function findByEmail(string $email): ?User
    {
        return $this->select()
            ->where('email', $email)
            ->fetchOne();
    }
    
    public function findActive(): array
    {
        return $this->select()
            ->where('active', true)
            ->orderBy('created_at', 'DESC')
            ->fetchAll();
    }
}
```

### Using in Controllers

```php
use PivotPHP\Core\Http\Request;
use PivotPHP\Core\Http\Response;
use Cycle\ORM\ORMInterface;

class UserController
{
    public function __construct(
        private ORMInterface $orm
    ) {}
    
    public function index(Request $request, Response $response): Response
    {
        $repository = $this->orm->getRepository(User::class);
        $users = $repository->findAll();
        
        return $response->json($users);
    }
    
    public function store(Request $request, Response $response): Response
    {
        $user = new User();
        $user->setName($request->input('name'));
        $user->setEmail($request->input('email'));
        $user->setCreatedAt(new \DateTime());
        
        $this->orm->persist($user);
        $this->orm->run();
        
        return $response->json($user, 201);
    }
}
```

## Relations

### One-to-Many

```php
#[Entity(table: 'posts')]
class Post
{
    #[Column(type: 'primary')]
    private int $id;
    
    #[BelongsTo(target: User::class)]
    private User $author;
    
    #[HasMany(target: Comment::class)]
    private Collection $comments;
}
```

### Many-to-Many

```php
#[Entity(table: 'users')]
class User
{
    #[ManyToMany(target: Role::class, through: UserRole::class)]
    private Collection $roles;
}
```

## Migrations

### Creating Migrations

```bash
php bin/console cycle:migrate:create CreateUsersTable
```

### Migration Example

```php
use Cycle\Migrations\Migration;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        $this->table('users')
            ->addColumn('id', 'primary')
            ->addColumn('name', 'string', ['length' => 255])
            ->addColumn('email', 'string', ['length' => 255])
            ->addColumn('password', 'string', ['length' => 255])
            ->addColumn('created_at', 'datetime')
            ->addColumn('updated_at', 'datetime', ['nullable' => true])
            ->addIndex(['email'], ['unique' => true])
            ->create();
    }
    
    public function down(): void
    {
        $this->table('users')->drop();
    }
}
```

### Running Migrations

```bash
# Check migration status
php bin/console cycle:migrate:status

# Run pending migrations
php bin/console cycle:migrate

# Rollback last migration
php bin/console cycle:migrate --rollback

# Generate migration from entities
php bin/console cycle:migrate:generate
```

## Schema Management

### Sync Schema (Development Only)

```bash
# Sync database schema with entities
php bin/console cycle:sync
```

> **Warning**: The `sync` command directly modifies your database schema. Use migrations in production.

### Schema Cache

For production, cache your schema:

```bash
# Generate schema cache
php bin/console cycle:schema:cache

# Clear schema cache
php bin/console cycle:schema:clear
```

## Advanced Features

### Query Builder

```php
$query = $this->orm->getRepository(User::class)
    ->select()
    ->where('created_at', '>=', new \DateTime('-30 days'))
    ->where(function($query) {
        $query->where('role', 'admin')
              ->orWhere('role', 'moderator');
    })
    ->orderBy('name', 'ASC')
    ->limit(10)
    ->offset(20);

$users = $query->fetchAll();
```

### Transactions

```php
$transaction = $this->orm->getTransaction();

try {
    $user = new User();
    // ... set user data
    
    $profile = new Profile();
    // ... set profile data
    
    $this->orm->persist($user);
    $this->orm->persist($profile);
    
    $transaction->run();
} catch (\Exception $e) {
    $transaction->rollback();
    throw $e;
}
```

### Entity Events

```php
#[Entity(table: 'users')]
class User
{
    #[Column(type: 'datetime')]
    private \DateTimeInterface $updatedAt;
    
    #[PreUpdate]
    public function beforeUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }
    
    #[PostPersist]
    public function afterCreate(): void
    {
        // Send welcome email
        event(new UserCreated($this));
    }
}
```

## Performance Optimization

### Eager Loading

```php
// Prevent N+1 queries
$posts = $repository->select()
    ->with('author')
    ->with('comments.author')
    ->fetchAll();
```

### Query Caching

```php
$users = $repository->select()
    ->where('active', true)
    ->cache(3600) // Cache for 1 hour
    ->fetchAll();
```

## Console Commands

The Cycle ORM extension provides several console commands:

```bash
# Entity management
php bin/console cycle:entity:list
php bin/console cycle:entity:sync

# Migration commands
php bin/console cycle:migrate
php bin/console cycle:migrate:status
php bin/console cycle:migrate:generate

# Schema commands
php bin/console cycle:schema:cache
php bin/console cycle:schema:clear
php bin/console cycle:schema:render

# Database commands
php bin/console cycle:database:list
php bin/console cycle:database:create
php bin/console cycle:database:drop
```

## More Information

For more detailed information about Cycle ORM features, visit the [official Cycle ORM documentation](https://cycle-orm.dev/).