---
layout: docs
title: Database
permalink: /docs/database/
---

# Database

HelixPHP integrates seamlessly with Cycle ORM, providing a powerful and intuitive way to work with databases. Cycle ORM is a modern, schema-driven ORM that offers excellent performance and flexibility.

## Installation

Install the Cycle ORM integration:

```bash
composer require helixphp/cycle-orm
```

## Configuration

Configure your database connection in `config/database.php`:

```php
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
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],
        
        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],
    ],
];
```

## Defining Entities

### Basic Entity

Create entity classes to represent database tables:

```php
namespace App\Entity;

use Cycle\Annotated\Annotation as Cycle;

#[Cycle\Entity(repository: UserRepository::class)]
#[Cycle\Table('users')]
class User
{
    #[Cycle\Column(type: 'primary')]
    private ?int $id = null;
    
    #[Cycle\Column(type: 'string')]
    private string $name;
    
    #[Cycle\Column(type: 'string', unique: true)]
    private string $email;
    
    #[Cycle\Column(type: 'string', nullable: true)]
    private ?string $avatar = null;
    
    #[Cycle\Column(type: 'datetime')]
    private \DateTimeInterface $createdAt;
    
    #[Cycle\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;
    
    public function __construct(string $name, string $email)
    {
        $this->name = $name;
        $this->email = $email;
        $this->createdAt = new \DateTime();
    }
    
    // Getters and setters
    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getName(): string
    {
        return $this->name;
    }
    
    public function setName(string $name): void
    {
        $this->name = $name;
    }
    
    public function getEmail(): string
    {
        return $this->email;
    }
    
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }
}
```

### Column Types

Available column types:

```php
#[Cycle\Column(type: 'primary')]        // Auto-incrementing primary key
#[Cycle\Column(type: 'bigPrimary')]     // Big integer primary key
#[Cycle\Column(type: 'string(255)')]    // VARCHAR with length
#[Cycle\Column(type: 'text')]           // TEXT
#[Cycle\Column(type: 'integer')]        // INTEGER
#[Cycle\Column(type: 'bigInteger')]     // BIGINT
#[Cycle\Column(type: 'float')]          // FLOAT
#[Cycle\Column(type: 'double')]         // DOUBLE
#[Cycle\Column(type: 'decimal(10,2)')]  // DECIMAL with precision
#[Cycle\Column(type: 'boolean')]        // BOOLEAN
#[Cycle\Column(type: 'datetime')]       // DATETIME
#[Cycle\Column(type: 'date')]           // DATE
#[Cycle\Column(type: 'time')]           // TIME
#[Cycle\Column(type: 'timestamp')]      // TIMESTAMP
#[Cycle\Column(type: 'json')]           // JSON
#[Cycle\Column(type: 'uuid')]           // UUID
#[Cycle\Column(type: 'enum', values: ['active', 'inactive'])] // ENUM
```

### Column Options

```php
#[Cycle\Column(
    type: 'string',
    nullable: true,              // Allow NULL
    default: 'pending',          // Default value
    unique: true,                // Unique constraint
    name: 'user_email',          // Custom column name
    precision: 10,               // For decimal
    scale: 2,                    // For decimal
    unsigned: true,              // For integers
    length: 100,                 // For strings
)]
```

## Relationships

### One-to-Many

```php
#[Cycle\Entity]
class User
{
    #[Cycle\Relation\HasMany(target: Post::class)]
    private Collection $posts;
    
    public function __construct()
    {
        $this->posts = new ArrayCollection();
    }
    
    public function getPosts(): Collection
    {
        return $this->posts;
    }
    
    public function addPost(Post $post): void
    {
        $this->posts->add($post);
        $post->setUser($this);
    }
}

#[Cycle\Entity]
class Post
{
    #[Cycle\Relation\BelongsTo(target: User::class, nullable: false)]
    private User $user;
    
    public function getUser(): User
    {
        return $this->user;
    }
    
    public function setUser(User $user): void
    {
        $this->user = $user;
    }
}
```

### Many-to-Many

```php
#[Cycle\Entity]
class User
{
    #[Cycle\Relation\ManyToMany(
        target: Role::class,
        through: UserRole::class,
        throughInnerKey: 'user_id',
        throughOuterKey: 'role_id'
    )]
    private Collection $roles;
    
    public function getRoles(): Collection
    {
        return $this->roles;
    }
    
    public function addRole(Role $role): void
    {
        if (!$this->roles->contains($role)) {
            $this->roles->add($role);
        }
    }
    
    public function removeRole(Role $role): void
    {
        $this->roles->removeElement($role);
    }
}

#[Cycle\Entity]
class Role
{
    #[Cycle\Relation\ManyToMany(
        target: User::class,
        through: UserRole::class,
        throughInnerKey: 'role_id',
        throughOuterKey: 'user_id'
    )]
    private Collection $users;
}

#[Cycle\Entity]
#[Cycle\Table('user_roles')]
class UserRole
{
    #[Cycle\Column(type: 'primary')]
    private ?int $id = null;
    
    #[Cycle\Column(type: 'datetime')]
    private \DateTimeInterface $assignedAt;
}
```

### One-to-One

```php
#[Cycle\Entity]
class User
{
    #[Cycle\Relation\HasOne(
        target: Profile::class,
        nullable: true,
        cascade: true
    )]
    private ?Profile $profile = null;
    
    public function getProfile(): ?Profile
    {
        return $this->profile;
    }
    
    public function setProfile(Profile $profile): void
    {
        $this->profile = $profile;
        $profile->setUser($this);
    }
}

#[Cycle\Entity]
class Profile
{
    #[Cycle\Relation\BelongsTo(target: User::class, nullable: false)]
    private User $user;
}
```

### Embedded Entities

```php
#[Cycle\Entity]
class User
{
    #[Cycle\Relation\Embedded(target: Address::class, prefix: 'address_')]
    private Address $address;
}

#[Cycle\Embeddable]
class Address
{
    #[Cycle\Column(type: 'string')]
    private string $street;
    
    #[Cycle\Column(type: 'string')]
    private string $city;
    
    #[Cycle\Column(type: 'string', length: 10)]
    private string $zipCode;
}
```

## Repositories

### Basic Repository

```php
namespace App\Repository;

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
    
    public function findWithPosts(int $id): ?User
    {
        return $this->select()
            ->where('id', $id)
            ->load('posts')
            ->fetchOne();
    }
    
    public function searchByName(string $query): array
    {
        return $this->select()
            ->where('name', 'like', "%{$query}%")
            ->limit(10)
            ->fetchAll();
    }
}
```

### Query Builder

```php
// Basic queries
$users = $userRepository->select()
    ->where('age', '>', 18)
    ->where('country', 'US')
    ->orderBy('name')
    ->fetchAll();

// Complex conditions
$users = $userRepository->select()
    ->where(function($query) {
        $query->where('status', 'active')
              ->orWhere('role', 'admin');
    })
    ->fetchAll();

// Joins
$posts = $postRepository->select()
    ->innerJoin('users', 'user_id')
    ->where('users.active', true)
    ->fetchAll();

// Aggregates
$count = $userRepository->select()
    ->where('created_at', '>', new DateTime('-30 days'))
    ->count();

$stats = $orderRepository->select()
    ->columns(['status', 'COUNT(*) as total', 'SUM(amount) as revenue'])
    ->groupBy('status')
    ->fetchAll();
```

### Pagination

```php
class UserRepository extends Repository
{
    public function paginate(int $page = 1, int $perPage = 15): Paginator
    {
        $query = $this->select()
            ->orderBy('created_at', 'DESC');
            
        return new Paginator($query, $page, $perPage);
    }
}

// Usage
$paginator = $userRepository->paginate(
    page: $request->query('page', 1),
    perPage: 20
);

$users = $paginator->getItems();
$total = $paginator->getTotal();
$lastPage = $paginator->getLastPage();
```

## Working with Entities

### Creating Entities

```php
// Create new entity
$user = new User('John Doe', 'john@example.com');
$user->setAvatar('avatar.jpg');

// Persist to database
$orm->persist($user);
$orm->run(); // Execute transaction

// Or using repository
$userRepository->persist($user);
```

### Updating Entities

```php
// Find and update
$user = $userRepository->findByPK(1);
$user->setName('Jane Doe');
$user->setUpdatedAt(new DateTime());

$orm->persist($user);
$orm->run();
```

### Deleting Entities

```php
// Delete single entity
$user = $userRepository->findByPK(1);
$orm->delete($user);
$orm->run();

// Delete multiple
$users = $userRepository->select()
    ->where('inactive', true)
    ->where('created_at', '<', new DateTime('-1 year'))
    ->fetchAll();

foreach ($users as $user) {
    $orm->delete($user);
}
$orm->run();
```

### Batch Operations

```php
// Insert multiple
$users = [];
for ($i = 0; $i < 1000; $i++) {
    $users[] = new User("User {$i}", "user{$i}@example.com");
}

foreach ($users as $user) {
    $orm->persist($user);
}
$orm->run(); // Single transaction

// Update multiple
$userRepository->select()
    ->where('newsletter', true)
    ->update(['last_notified' => new DateTime()]);
```

## Migrations

### Creating Migrations

```bash
php helix migrate:create CreateUsersTable
```

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
# Run all pending migrations
php helix migrate

# Rollback last batch
php helix migrate:rollback

# Rollback all
php helix migrate:reset

# Refresh (rollback all and re-run)
php helix migrate:refresh
```

## Schema Generation

Generate database schema from entities:

```bash
# Generate migration from entities
php helix cycle:migrate

# Sync schema without migrations
php helix cycle:sync
```

## Events and Hooks

### Entity Events

```php
#[Cycle\Entity]
class User
{
    use TimestampableEntity;
    
    #[Cycle\Hooks\BeforeCreate]
    public function beforeCreate(): void
    {
        $this->createdAt = new DateTime();
        $this->generateApiToken();
    }
    
    #[Cycle\Hooks\BeforeUpdate]
    public function beforeUpdate(): void
    {
        $this->updatedAt = new DateTime();
    }
    
    #[Cycle\Hooks\AfterCreate]
    public function afterCreate(): void
    {
        event(new UserCreated($this));
    }
}
```

### Global Entity Listeners

```php
class EntityListener
{
    public function creating($entity): void
    {
        if (method_exists($entity, 'setCreatedBy')) {
            $entity->setCreatedBy(auth()->user());
        }
    }
    
    public function updating($entity): void
    {
        if (method_exists($entity, 'setUpdatedBy')) {
            $entity->setUpdatedBy(auth()->user());
        }
    }
}

// Register in service provider
$orm->getSchema()->listen('creating', [EntityListener::class, 'creating']);
$orm->getSchema()->listen('updating', [EntityListener::class, 'updating']);
```

## Advanced Features

### Soft Deletes

```php
#[Cycle\Entity]
#[Cycle\SoftDelete('deleted_at')]
class User
{
    #[Cycle\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $deletedAt = null;
}

// Soft delete
$user->delete(); // Sets deleted_at

// Query including soft deleted
$users = $userRepository->select()
    ->withDeleted()
    ->fetchAll();

// Query only soft deleted
$users = $userRepository->select()
    ->onlyDeleted()
    ->fetchAll();

// Restore
$user->restore(); // Sets deleted_at to null
```

### Optimistic Locking

```php
#[Cycle\Entity]
#[Cycle\OptimisticLock('version')]
class Document
{
    #[Cycle\Column(type: 'integer', default: 1)]
    private int $version = 1;
}

// Throws exception if version doesn't match
try {
    $document->setContent('New content');
    $orm->persist($document);
    $orm->run();
} catch (OptimisticLockException $e) {
    // Handle concurrent modification
}
```

### Table Inheritance

```php
#[Cycle\Entity]
#[Cycle\SingleTableInheritance(discriminator: 'type')]
abstract class Vehicle
{
    #[Cycle\Column(type: 'primary')]
    protected ?int $id = null;
    
    #[Cycle\Column(type: 'string')]
    protected string $brand;
}

#[Cycle\Entity]
#[Cycle\DiscriminatorValue('car')]
class Car extends Vehicle
{
    #[Cycle\Column(type: 'integer')]
    private int $doors;
}

#[Cycle\Entity]
#[Cycle\DiscriminatorValue('motorcycle')]
class Motorcycle extends Vehicle
{
    #[Cycle\Column(type: 'string')]
    private string $type;
}
```

## Best Practices

1. **Use repositories**: Keep database logic in repository classes
2. **Avoid N+1 queries**: Use eager loading for relationships
3. **Use transactions**: Wrap multiple operations in transactions
4. **Index properly**: Add indexes to frequently queried columns
5. **Use value objects**: For complex attributes, use embedded entities
6. **Keep entities simple**: Entities should focus on data, not business logic
7. **Use DTOs**: Transfer data between layers using Data Transfer Objects
8. **Cache queries**: Cache frequently accessed, rarely changing data