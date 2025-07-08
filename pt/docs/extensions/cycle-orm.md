---
layout: docs
title: Extensão Cycle ORM
permalink: /pt/docs/extensions/cycle-orm/
lang: pt
---

O Cycle ORM é um poderoso ORM DataMapper para PHP que fornece uma solução completa para trabalhar com bancos de dados em aplicações PivotPHP.

## Instalação

```bash
composer require pivotphp/cycle-orm
```

## Configuração

Após a instalação, registre o service provider em seu `config/app.php`:

```php
'providers' => [
    // ... outros providers
    PivotPHP\CycleORM\Providers\CycleServiceProvider::class,
],
```

### Configuração do Banco de Dados

Configure sua conexão de banco de dados no `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pivotphp
DB_USERNAME=root
DB_PASSWORD=
```

## Uso Básico

### Definindo Entidades

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
    
    // Getters e setters...
}
```

### Padrão Repository

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

### Usando em Controllers

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

## Relações

### Um-para-Muitos

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

### Muitos-para-Muitos

```php
#[Entity(table: 'users')]
class User
{
    #[ManyToMany(target: Role::class, through: UserRole::class)]
    private Collection $roles;
}
```

## Migrações

### Criando Migrações

```bash
php bin/console cycle:migrate:create CreateUsersTable
```

### Exemplo de Migração

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
# Verificar status das migrações
php bin/console cycle:migrate:status

# Executar migrações pendentes
php bin/console cycle:migrate

# Reverter última migração
php bin/console cycle:migrate --rollback

# Gerar migração a partir das entidades
php bin/console cycle:migrate:generate
```

## Gerenciamento de Esquema

### Sincronizar Esquema (Apenas Desenvolvimento)

```bash
# Sincronizar esquema do banco com as entidades
php bin/console cycle:sync
```

> **Aviso**: O comando `sync` modifica diretamente o esquema do seu banco de dados. Use migrações em produção.

### Cache de Esquema

Para produção, faça cache do seu esquema:

```bash
# Gerar cache do esquema
php bin/console cycle:schema:cache

# Limpar cache do esquema
php bin/console cycle:schema:clear
```

## Recursos Avançados

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

### Transações

```php
$transaction = $this->orm->getTransaction();

try {
    $user = new User();
    // ... definir dados do usuário
    
    $profile = new Profile();
    // ... definir dados do perfil
    
    $this->orm->persist($user);
    $this->orm->persist($profile);
    
    $transaction->run();
} catch (\Exception $e) {
    $transaction->rollback();
    throw $e;
}
```

### Eventos de Entidade

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
        // Enviar email de boas-vindas
        event(new UserCreated($this));
    }
}
```

## Otimização de Performance

### Carregamento Antecipado (Eager Loading)

```php
// Prevenir consultas N+1
$posts = $repository->select()
    ->with('author')
    ->with('comments.author')
    ->fetchAll();
```

### Cache de Consultas

```php
$users = $repository->select()
    ->where('active', true)
    ->cache(3600) // Cache por 1 hora
    ->fetchAll();
```

## Comandos do Console

A extensão Cycle ORM fornece vários comandos de console:

```bash
# Gerenciamento de entidades
php bin/console cycle:entity:list
php bin/console cycle:entity:sync

# Comandos de migração
php bin/console cycle:migrate
php bin/console cycle:migrate:status
php bin/console cycle:migrate:generate

# Comandos de esquema
php bin/console cycle:schema:cache
php bin/console cycle:schema:clear
php bin/console cycle:schema:render

# Comandos de banco de dados
php bin/console cycle:database:list
php bin/console cycle:database:create
php bin/console cycle:database:drop
```

## Mais Informações

Para informações mais detalhadas sobre os recursos do Cycle ORM, visite a [documentação oficial do Cycle ORM](https://cycle-orm.dev/).