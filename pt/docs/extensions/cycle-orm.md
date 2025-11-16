---
layout: docs
title: Extensão Cycle ORM v1.0.1
permalink: /pt/docs/extensions/cycle-orm/
lang: pt
---

# Extensão PivotPHP Cycle ORM v1.0.1

A extensão **pivotphp-cycle-orm** fornece integração perfeita de banco de dados com o microframework PivotPHP usando o poderoso Cycle ORM. Esta extensão oferece configuração zero, migrações automáticas, padrão repository e recursos abrangentes de monitoramento.

## 🚀 Recursos Principais

- **Configuração Zero**: Funciona imediatamente com padrões sensatos
- **Segurança de Tipos**: Segurança total de tipos com análise PHPStan Level 8+
- **Padrão Repository**: Padrão repository integrado com cache
- **Monitoramento de Performance**: Log de consultas e profiling de performance
- **Migrações Automáticas**: Compilação de esquema e suporte a migrações
- **Suporte a Múltiplos Bancos**: Conexões SQLite (padrão) e MySQL
- **Middleware de Transação**: Manipulação automática de transações
- **Verificações de Saúde**: Monitoramento de saúde do banco de dados

## 📦 Instalação

```bash
composer require pivotphp/cycle-orm
```

## 🔧 Início Rápido

### 1. Registrar o Service Provider

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\CycleORM\CycleServiceProvider;

$app = new Application();

// Registrar service provider do Cycle ORM
$app->register(new CycleServiceProvider($app));
```

### 2. Configuração de Ambiente

Crie ou atualize seu arquivo `.env`:

```env
# Aplicação
APP_NAME="Meu Projeto"
APP_ENV=development
APP_DEBUG=true

# Configuração do Banco de Dados
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Para MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=meu_banco
# DB_USERNAME=root
# DB_PASSWORD=secret

# Configurações do Cycle ORM
CYCLE_ENTITY_DIRS=src/Entities
CYCLE_LOG_QUERIES=true
CYCLE_PROFILE_QUERIES=true
```

### 3. Criar Sua Primeira Entidade

Crie `src/Entities/User.php`:

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

### 4. Usando em Rotas com Middleware Helper

O PivotPHP Cycle ORM fornece um middleware personalizado que injeta serviços ORM diretamente em sua requisição:

```php
// Em seu arquivo principal da aplicação (public/index.php)

// ... após registrar o CycleServiceProvider

// Middleware personalizado para acesso ao Cycle ORM
$app->use(function ($req, $res, $next) use ($app) {
    $container = $app->getContainer();

    if (!$container->has('cycle.orm')) {
        throw new \RuntimeException('Cycle ORM não registrado corretamente');
    }

    // Obter serviços do Cycle ORM
    $orm = $container->get('cycle.orm');
    $em = $container->get('cycle.em');
    $db = $container->get('cycle.database');
    $repository = $container->get('cycle.repository');

    // Injetar serviços como atributos da requisição
    $req->setAttribute('cycle.orm', $orm);
    $req->setAttribute('cycle.em', $em);
    $req->setAttribute('cycle.db', $db);
    $req->setAttribute('cycle.repository', $repository);

    // Métodos helper
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

// Definir suas rotas
$app->get('/api/users', function($req, $res) {
    try {
        // Obter helper de repository
        $repositoryHelper = $req->getAttribute('repository');
        $repository = $repositoryHelper(User::class);

        // Buscar todos os usuários
        $users = $repository->findAll();

        // Converter para array
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

        // Validação básica
        if (!isset($data['name'], $data['email'], $data['password'])) {
            return $res->status(400)->json([
                'success' => false,
                'error' => 'Nome, email e senha são obrigatórios'
            ]);
        }

        // Obter helpers
        $repositoryHelper = $req->getAttribute('repository');
        $entityManagerHelper = $req->getAttribute('entityManager');

        $repository = $repositoryHelper(User::class);
        $entityManager = $entityManagerHelper();

        // Verificar se o email já existe
        if ($repository->findOne(['email' => $data['email']])) {
            return $res->status(409)->json([
                'success' => false,
                'error' => 'Email já existe'
            ]);
        }

        // Criar novo usuário
        $user = new User();
        $user->setName($data['name']);
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);

        // Persistir no banco de dados
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

## 🏗️ Recursos Avançados

### Repositórios Personalizados

Crie `src/Repositories/UserRepository.php`:

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

### Middleware de Transação

Para manipulação automática de transações:

```php
use PivotPHP\CycleORM\Middleware\TransactionMiddleware;

$app->post('/api/orders',
    new TransactionMiddleware(),
    function($req, $res) {
        // Todas as operações de banco de dados são envolvidas em uma transação
        $order = new Order();
        $req->getAttribute('entityManager')()->persist($order);

        // Se uma exceção ocorrer, a transação é revertida
        foreach ($req->input('items') as $item) {
            $orderItem = new OrderItem();
            $req->getAttribute('entityManager')()->persist($orderItem);
        }

        return $res->json($order);
    }
);
```

### Monitoramento de Performance

```php
use PivotPHP\CycleORM\Monitoring\QueryLogger;
use PivotPHP\CycleORM\Monitoring\PerformanceProfiler;

// Habilitar log de consultas
$app->get('/debug/queries', function($req, $res) use ($app) {
    $logger = $app->getContainer()->get('cycle.query_logger');
    $stats = $logger->getStatistics();

    return $res->json([
        'total_queries' => $stats['total_queries'],
        'total_time' => $stats['total_time'],
        'queries' => $stats['queries']
    ]);
});

// Profiling de performance
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

### Verificações de Saúde

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

## 🛠️ Comandos de Console

### Configurar Comandos de Console

Crie `bin/console`:

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

// Configuração
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
        echo "Comandos disponíveis:\n";
        echo "  cycle:schema:sync  Sincronizar esquema do banco\n";
        echo "  cycle:migrate      Executar migrações\n";
        echo "  cycle:status       Verificar status das migrações\n";
        echo "  help              Mostrar esta mensagem de ajuda\n";
        break;
}
```

Torne-o executável:

```bash
chmod +x bin/console
```

### Usando Comandos de Console

```bash
# Criar/atualizar esquema do banco de dados
php bin/console cycle:schema:sync

# Verificar status
php bin/console cycle:status

# Executar migrações
php bin/console cycle:migrate
```

## 🔧 Opções de Configuração

A extensão Cycle ORM suporta várias opções de configuração via variáveis de ambiente:

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DB_CONNECTION` | `sqlite` | Driver do banco (sqlite, mysql) |
| `DB_DATABASE` | `database/database.sqlite` | Nome/caminho do banco |
| `DB_HOST` | `localhost` | Host do banco (MySQL) |
| `DB_PORT` | `3306` | Porta do banco (MySQL) |
| `DB_USERNAME` | `root` | Usuário do banco (MySQL) |
| `DB_PASSWORD` | `` | Senha do banco (MySQL) |
| `CYCLE_ENTITY_DIRS` | `src/Entities` | Diretórios de entidades |
| `CYCLE_LOG_QUERIES` | `false` | Habilitar log de consultas |
| `CYCLE_PROFILE_QUERIES` | `false` | Habilitar profiling de performance |

## 🚀 Dicas de Performance

### 1. Usar Cache de Repository
O `RepositoryFactory` automaticamente faz cache dos repositories para melhor performance.

### 2. Habilitar Profiling de Consultas
Monitore consultas lentas em desenvolvimento:

```env
CYCLE_LOG_QUERIES=true
CYCLE_PROFILE_QUERIES=true
```

### 3. Otimizar Carregamento de Entidades
Use eager loading para prevenir consultas N+1:

```php
$users = $repository->select()
    ->with('posts')
    ->with('profile')
    ->fetchAll();
```

### 4. Usar Transações para Operações em Lote
Para múltiplas operações, use transações:

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

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro: "O diretório não existe"**
```bash
mkdir -p src/Entities
```

**Erro: "Cycle ORM não registrado corretamente"**
```php
// Certifique-se de registrar o service provider
$app->register(new CycleServiceProvider($app));
```

**Erro: "Falha na conexão com o banco de dados"**
- Verifique sua configuração `.env`
- Certifique-se de que o diretório do banco existe para SQLite
- Verifique os detalhes de conexão MySQL

### Modo Debug

Habilite o modo debug para mensagens de erro detalhadas:

```env
APP_DEBUG=true
```

## 📚 Documentação Relacionada

- [Documentação Oficial do Cycle ORM](https://cycle-orm.dev/)
- [Documentação Core do PivotPHP]({{ '/docs/' | relative_url }})
- [Configuração de Banco de Dados]({{ '/docs/database/' | relative_url }})
- [Desenvolvimento de Extensões]({{ '/docs/extensions/' | relative_url }})

## 🤝 Suporte

- **Issues no GitHub**: [Reportar problemas](https://github.com/PivotPHP/pivotphp-cycle-orm/issues)
- **Documentação**: [Guia completo](https://github.com/PivotPHP/pivotphp-cycle-orm/blob/main/docs/integration-guide.md)

---

*A extensão PivotPHP Cycle ORM está pronta para produção e totalmente testada com o ecossistema PivotPHP v1.2.0.*
