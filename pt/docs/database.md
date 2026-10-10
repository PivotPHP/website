---
redirect_from:
  - /docs/database/
  - /en/docs/database/
  - /en/database/
layout: docs
title: Banco de Dados
permalink: /pt/docs/database/
lang: pt
---

O `pivotphp/core` inclui uma conexão PDO simples em `PivotPHP\Core\Database\Database` (drivers
`sqlite`, `mysql`/`mariadb` e `pgsql`/`postgres`). Não há ORM no core.

> **Cycle ORM pausado.** A extensão [`pivotphp/cycle-orm`]({{ '/pt/docs/extensions/cycle-orm/' | relative_url }})
> é compatível apenas com o core 1.x e **não** foi migrada para o 4.x. Para ORM no 4.x, use uma
> biblioteca de sua escolha com o `Database` abaixo ou um ORM independente.

## Instanciação

`Database` recebe um array de configuração e conecta no construtor:

```php
use PivotPHP\Core\Database\Database;

// SQLite (desenvolvimento / testes)
$db = new Database([
    'driver'   => 'sqlite',
    'database' => __DIR__ . '/database.sqlite', // ou ':memory:'
]);

// MySQL / MariaDB (porta padrão 3306, charset utf8mb4)
$db = new Database([
    'driver'   => 'mysql',
    'host'     => '127.0.0.1',
    'port'     => 3306,
    'database' => 'meu_banco',
    'username' => 'usuario',
    'password' => 'senha',
]);

// PostgreSQL (porta padrão 5432)
$db = new Database([
    'driver'   => 'pgsql',
    'host'     => '127.0.0.1',
    'database' => 'meu_banco',
    'username' => 'usuario',
    'password' => 'senha',
]);
```

Drivers aceitos: `sqlite`, `mysql`/`mariadb` → `mysql`, `pgsql`/`postgres`/`postgresql` → `pgsql`.
Um driver não suportado lança `InvalidArgumentException`.

Registre a conexão como singleton no contêiner para reutilizá-la:

```php
$app->singleton(Database::class, fn () => new Database([
    'driver'   => $_ENV['DB_DRIVER'] ?? 'sqlite',
    'database' => $_ENV['DB_DATABASE'] ?? ':memory:',
    'host'     => $_ENV['DB_HOST'] ?? 'localhost',
    'username' => $_ENV['DB_USERNAME'] ?? null,
    'password' => $_ENV['DB_PASSWORD'] ?? null,
]));
```

## Consultas

Todos os métodos usam prepared statements com bindings — sempre passe os valores pelo array de
bindings, nunca por interpolação na string SQL.

```php
// SELECT (lista)
$users = $db->select('SELECT id, name FROM users WHERE active = ?', [1]);

// SELECT (um registro)
$user = $db->selectOne('SELECT * FROM users WHERE id = ?', [$id]);

// INSERT / UPDATE / DELETE (retornam bool / rowCount)
$db->insert('INSERT INTO users (name, email) VALUES (?, ?)', [$name, $email]);
$updated = $db->update('UPDATE users SET name = ? WHERE id = ?', [$name, $id]);
$deleted = $db->delete('DELETE FROM users WHERE id = ?', [$id]);

// Último id inserido
$id = $db->lastInsertId();
```

### SQL genérico

```php
$db->statement('INSERT INTO logs (message) VALUES (?)', [$msg]); // um statement
$db->exec($schemaSql);                                            // múltiplos statements (schema/migrações)
```

## Transações

`transaction()` executa um callback, faz `commit()` no sucesso e `rollback()` para **qualquer**
`Throwable` (inclusive `Error`, ex.: `TypeError`):

```php
$db->transaction(function (Database $db) use ($name, $email) {
    $db->insert('INSERT INTO users (name, email) VALUES (?, ?)', [$name, $email]);
    $db->insert('INSERT INTO audit (action) VALUES (?)', ['user.created']);
});
```

Manualmente:

```php
$db->beginTransaction();
try {
    // ...
    $db->commit();
} catch (\Throwable $e) {
    $db->rollback();
    throw $e;
}
```

## Acesso ao PDO

Para recursos não cobertos (drivers/atributos específicos, `PDOStatement`):

```php
$pdo = $db->getPdo();
$stmt = $pdo->prepare('SELECT * FROM users WHERE role = :role');
$stmt->execute(['role' => 'admin']);
$rows = $stmt->fetchAll();
```

## API

| Método | Retorno | Descrição |
|---|---|---|
| `select(string $query, array $bindings = [])` | `array` | Lista de linhas. |
| `selectOne(string $query, array $bindings = [])` | `?array` | Uma linha ou `null`. |
| `insert(string $query, array $bindings = [])` | `bool` | Executa um INSERT. |
| `update(string $query, array $bindings = [])` | `int` | Linhas afetadas. |
| `delete(string $query, array $bindings = [])` | `int` | Linhas afetadas. |
| `statement(string $query, array $bindings = [])` | `bool` | Um statement genérico. |
| `exec(string $sql)` | `int` | Vários statements separados por `;`. |
| `lastInsertId()` | `string` | Último id inserido. |
| `beginTransaction()` / `commit()` / `rollback()` | `bool` | Controle manual de transação. |
| `transaction(callable $callback)` | `mixed` | Transação com commit/rollback automáticos. |
| `getPdo()` | `\PDO` | Instância PDO subjacente. |

## Boas práticas

1. **Use sempre bindings** (`?` ou `:nome`); nunca concatene valores na SQL.
2. **Registre como singleton** para reaproveitar a conexão.
3. **Use `transaction()`** para agrupar operações relacionadas.
4. **Mantenha consultas em um repositório** próprio em vez de espalhá-las pelos handlers.
5. **Para ORM**, prefira uma biblioteca ativa e compatível com o core 4.x.
