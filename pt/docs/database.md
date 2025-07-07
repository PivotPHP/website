---
layout: docs-i18n
title: Banco de Dados
permalink: /pt/docs/banco-de-dados/
lang: pt
---

# Banco de Dados

O PivotPHP integra-se perfeitamente com o Cycle ORM, fornecendo uma maneira poderosa e intuitiva de trabalhar com bancos de dados. O Cycle ORM é um ORM moderno e orientado por esquema que oferece excelente desempenho e flexibilidade.

## Instalação

Instale a integração do Cycle ORM:

```bash
composer require pivotphp/cycle-orm
```

## Configuração

Configure sua conexão de banco de dados em `config/database.php`:

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

## Definindo Entidades

### Entidade Básica

Crie classes de entidade para representar tabelas do banco de dados:

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

    // Getters e setters
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

### Tipos de Coluna

Tipos de coluna disponíveis:

```php
#[Cycle\Column(type: 'primary')]        // Chave primária auto-incrementada
#[Cycle\Column(type: 'bigPrimary')]     // Chave primária de inteiro grande
#[Cycle\Column(type: 'string(255)')]    // VARCHAR com comprimento
#[Cycle\Column(type: 'text')]           // TEXT
#[Cycle\Column(type: 'integer')]        // INTEGER
#[Cycle\Column(type: 'bigInteger')]     // BIGINT
#[Cycle\Column(type: 'float')]          // FLOAT
#[Cycle\Column(type: 'double')]         // DOUBLE
#[Cycle\Column(type: 'decimal(10,2)')]  // DECIMAL com precisão
#[Cycle\Column(type: 'boolean')]        // BOOLEAN
#[Cycle\Column(type: 'datetime')]       // DATETIME
#[Cycle\Column(type: 'date')]           // DATE
#[Cycle\Column(type: 'time')]           // TIME
#[Cycle\Column(type: 'timestamp')]      // TIMESTAMP
#[Cycle\Column(type: 'json')]           // JSON
#[Cycle\Column(type: 'uuid')]           // UUID
#[Cycle\Column(type: 'enum', values: ['active', 'inactive'])] // ENUM
```

### Opções de Coluna

```php
#[Cycle\Column(
    type: 'string',
    nullable: true,              // Permitir NULL
    default: 'pending',          // Valor padrão
    unique: true,                // Restrição única
    name: 'user_email',          // Nome personalizado da coluna
    precision: 10,               // Para decimal
    scale: 2,                    // Para decimal
    unsigned: true,              // Para inteiros
    length: 100,                 // Para strings
)]
```

## Relacionamentos

### Um-para-Muitos

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

### Muitos-para-Muitos

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

### Um-para-Um

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

### Entidades Incorporadas

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

## Repositórios

### Repositório Básico

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

### Construtor de Consultas

```php
// Consultas básicas
$users = $userRepository->select()
    ->where('age', '>', 18)
    ->where('country', 'BR')
    ->orderBy('name')
    ->fetchAll();

// Condições complexas
$users = $userRepository->select()
    ->where(function($query) {
        $query->where('status', 'active')
              ->orWhere('role', 'admin');
    })
    ->fetchAll();

// Junções
$posts = $postRepository->select()
    ->innerJoin('users', 'user_id')
    ->where('users.active', true)
    ->fetchAll();

// Agregações
$count = $userRepository->select()
    ->where('created_at', '>', new DateTime('-30 days'))
    ->count();

$stats = $orderRepository->select()
    ->columns(['status', 'COUNT(*) as total', 'SUM(amount) as revenue'])
    ->groupBy('status')
    ->fetchAll();
```

### Paginação

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

// Uso
$paginator = $userRepository->paginate(
    page: $request->query('page', 1),
    perPage: 20
);

$users = $paginator->getItems();
$total = $paginator->getTotal();
$lastPage = $paginator->getLastPage();
```

## Trabalhando com Entidades

### Criando Entidades

```php
// Criar nova entidade
$user = new User('João Silva', 'joao@exemplo.com');
$user->setAvatar('avatar.jpg');

// Persistir no banco de dados
$orm->persist($user);
$orm->run(); // Executar transação

// Ou usando repositório
$userRepository->persist($user);
```

### Atualizando Entidades

```php
// Encontrar e atualizar
$user = $userRepository->findByPK(1);
$user->setName('Maria Silva');
$user->setUpdatedAt(new DateTime());

$orm->persist($user);
$orm->run();
```

### Excluindo Entidades

```php
// Excluir entidade única
$user = $userRepository->findByPK(1);
$orm->delete($user);
$orm->run();

// Excluir múltiplas
$users = $userRepository->select()
    ->where('inactive', true)
    ->where('created_at', '<', new DateTime('-1 year'))
    ->fetchAll();

foreach ($users as $user) {
    $orm->delete($user);
}
$orm->run();
```

### Operações em Lote

```php
// Inserir múltiplas
$users = [];
for ($i = 0; $i < 1000; $i++) {
    $users[] = new User("Usuário {$i}", "usuario{$i}@exemplo.com");
}

foreach ($users as $user) {
    $orm->persist($user);
}
$orm->run(); // Transação única

// Atualizar múltiplas
$userRepository->select()
    ->where('newsletter', true)
    ->update(['last_notified' => new DateTime()]);
```

## Migrações

### Criando Migrações

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

### Executando Migrações

```bash
# Executar todas as migrações pendentes
php helix migrate

# Reverter último lote
php helix migrate:rollback

# Reverter todas
php helix migrate:reset

# Atualizar (reverter todas e re-executar)
php helix migrate:refresh
```

## Geração de Esquema

Gerar esquema de banco de dados a partir de entidades:

```bash
# Gerar migração a partir de entidades
php helix cycle:migrate

# Sincronizar esquema sem migrações
php helix cycle:sync
```

## Eventos e Hooks

### Eventos de Entidade

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

### Listeners de Entidade Globais

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

// Registrar no provedor de serviço
$orm->getSchema()->listen('creating', [EntityListener::class, 'creating']);
$orm->getSchema()->listen('updating', [EntityListener::class, 'updating']);
```

## Recursos Avançados

### Exclusão Suave

```php
#[Cycle\Entity]
#[Cycle\SoftDelete('deleted_at')]
class User
{
    #[Cycle\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $deletedAt = null;
}

// Exclusão suave
$user->delete(); // Define deleted_at

// Consultar incluindo excluídos suavemente
$users = $userRepository->select()
    ->withDeleted()
    ->fetchAll();

// Consultar apenas excluídos suavemente
$users = $userRepository->select()
    ->onlyDeleted()
    ->fetchAll();

// Restaurar
$user->restore(); // Define deleted_at como null
```

### Bloqueio Otimista

```php
#[Cycle\Entity]
#[Cycle\OptimisticLock('version')]
class Document
{
    #[Cycle\Column(type: 'integer', default: 1)]
    private int $version = 1;
}

// Lança exceção se a versão não corresponder
try {
    $document->setContent('Novo conteúdo');
    $orm->persist($document);
    $orm->run();
} catch (OptimisticLockException $e) {
    // Lidar com modificação concorrente
}
```

### Herança de Tabela

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

## Melhores Práticas

1. **Use repositórios**: Mantenha a lógica de banco de dados em classes de repositório
2. **Evite consultas N+1**: Use carregamento antecipado para relacionamentos
3. **Use transações**: Envolva múltiplas operações em transações
4. **Indexe adequadamente**: Adicione índices a colunas consultadas frequentemente
5. **Use objetos de valor**: Para atributos complexos, use entidades incorporadas
6. **Mantenha entidades simples**: Entidades devem focar em dados, não em lógica de negócios
7. **Use DTOs**: Transfira dados entre camadas usando Objetos de Transferência de Dados
8. **Faça cache de consultas**: Faça cache de dados acessados frequentemente e que mudam raramente
