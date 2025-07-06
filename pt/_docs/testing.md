---
layout: docs-i18n
title: Testes
permalink: /pt/docs/testes/
lang: pt
---

# Testes

O HelixPHP é construído com testes em mente. O framework fornece uma suíte de testes poderosa baseada no PHPUnit, com ajudantes e asserções adicionais para tornar os testes de sua aplicação muito fáceis.

## Começando

### Instalação

O HelixPHP vem com o PHPUnit pré-configurado. Se você precisar instalá-lo manualmente:

```bash
composer require --dev phpunit/phpunit
composer require --dev mockery/mockery
composer require --dev fakerphp/faker
```

### Configuração

O arquivo `phpunit.xml` na raiz do seu projeto configura o ambiente de teste:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         stopOnFailure="false">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <coverage processUncoveredFiles="true">
        <include>
            <directory suffix=".php">./app</directory>
        </include>
    </coverage>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="SESSION_DRIVER" value="array"/>
        <env name="QUEUE_DRIVER" value="sync"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
    </php>
</phpunit>
```

### Executando Testes

```bash
# Executar todos os testes
composer test

# Executar suíte de testes específica
composer test -- --testsuite=Unit

# Executar arquivo de teste específico
composer test tests/Unit/UserTest.php

# Executar método de teste específico
composer test -- --filter test_user_can_be_created

# Executar testes com cobertura
composer test:coverage
```

## Escrevendo Testes

### Estrutura Básica de Teste

```php
namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    /**
     * @test
     */
    public function it_can_create_a_user()
    {
        $user = new User([
            'name' => 'João Silva',
            'email' => 'joao@exemplo.com'
        ]);
        
        $this->assertEquals('João Silva', $user->name);
        $this->assertEquals('joao@exemplo.com', $user->email);
    }
    
    public function test_user_full_name()
    {
        $user = new User([
            'first_name' => 'João',
            'last_name' => 'Silva'
        ]);
        
        $this->assertEquals('João Silva', $user->getFullName());
    }
}
```

### Classe Base de Caso de Teste

```php
namespace Tests;

use Helix\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // Configuração adicional
    }
    
    protected function tearDown(): void
    {
        // Limpeza
        
        parent::tearDown();
    }
}
```

## Testes HTTP

### Testando Rotas

```php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class UserControllerTest extends TestCase
{
    public function test_users_index_returns_list()
    {
        $users = User::factory()->count(3)->create();
        
        $response = $this->get('/api/users');
        
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data')
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'email']
                     ]
                 ]);
    }
    
    public function test_can_create_user()
    {
        $userData = [
            'name' => 'João Silva',
            'email' => 'joao@exemplo.com',
            'password' => 'senha123'
        ];
        
        $response = $this->postJson('/api/users', $userData);
        
        $response->assertStatus(201)
                 ->assertJsonPath('data.email', 'joao@exemplo.com');
        
        $this->assertDatabaseHas('users', [
            'email' => 'joao@exemplo.com'
        ]);
    }
}
```

### Testando Autenticação

```php
class AuthTest extends TestCase
{
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => bcrypt('senha123')
        ]);
        
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'senha123'
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonStructure(['token']);
    }
    
    public function test_authenticated_user_can_access_protected_route()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
                         ->get('/api/profile');
        
        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $user->id);
    }
    
    public function test_unauthenticated_user_cannot_access_protected_route()
    {
        $response = $this->get('/api/profile');
        
        $response->assertStatus(401);
    }
}
```

### Testando Upload de Arquivos

```php
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadTest extends TestCase
{
    public function test_user_can_upload_avatar()
    {
        Storage::fake('avatars');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg');
        
        $response = $this->actingAs($user)
                         ->post('/api/avatar', [
                             'avatar' => $file
                         ]);
        
        $response->assertStatus(200);
        
        Storage::disk('avatars')->assertExists($file->hashName());
        
        $this->assertNotNull($user->fresh()->avatar);
    }
    
    public function test_validates_avatar_is_image()
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 1000);
        
        $response = $this->actingAs($user)
                         ->post('/api/avatar', [
                             'avatar' => $file
                         ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors('avatar');
    }
}
```

## Testes de Banco de Dados

### Transações de Banco de Dados

```php
use Helix\Foundation\Testing\RefreshDatabase;

class DatabaseTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_create_post()
    {
        $user = User::factory()->create();
        
        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Post de Teste',
            'content' => 'Conteúdo de teste'
        ]);
        
        $this->assertDatabaseHas('posts', [
            'title' => 'Post de Teste'
        ]);
        
        $this->assertDatabaseCount('posts', 1);
    }
}
```

### Factories de Modelos

```php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;
    
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'verified_at' => now(),
        ];
    }
    
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'verified_at' => null,
            ];
        });
    }
    
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
            ];
        });
    }
}

// Uso
$users = User::factory()->count(5)->create();
$admin = User::factory()->admin()->create();
$unverified = User::factory()->unverified()->create();
```

### Asserções de Banco de Dados

```php
public function test_database_assertions()
{
    $user = User::factory()->create();
    
    // Afirma que uma tabela contém um registro
    $this->assertDatabaseHas('users', [
        'email' => $user->email
    ]);
    
    // Afirma que uma tabela não contém um registro
    $this->assertDatabaseMissing('users', [
        'email' => 'inexistente@exemplo.com'
    ]);
    
    // Afirma que um registro foi deletado
    $user->delete();
    $this->assertModelMissing($user);
    
    // Afirma contagem
    User::factory()->count(3)->create();
    $this->assertDatabaseCount('users', 3);
    
    // Afirma exclusão suave
    $user->delete();
    $this->assertSoftDeleted($user);
}
```

## Mocking

### Mocking Básico

```php
use Mockery;

class ServiceTest extends TestCase
{
    public function test_service_calls_repository()
    {
        $mockRepo = Mockery::mock(UserRepository::class);
        $mockRepo->shouldReceive('find')
                 ->once()
                 ->with(1)
                 ->andReturn(new User(['id' => 1, 'name' => 'João']));
        
        $this->app->instance(UserRepository::class, $mockRepo);
        
        $service = app(UserService::class);
        $user = $service->getUser(1);
        
        $this->assertEquals('João', $user->name);
    }
    
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
```

### Mocking de Facades

```php
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Event;

class NotificationTest extends TestCase
{
    public function test_welcome_email_is_sent()
    {
        Mail::fake();
        
        $user = User::factory()->create();
        
        Mail::assertSent(WelcomeEmail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }
    
    public function test_event_is_fired()
    {
        Event::fake();
        
        $user = User::factory()->create();
        
        Event::assertDispatched(UserRegistered::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });
    }
}
```

### Mocking de Serviços Externos

```php
class PaymentTest extends TestCase
{
    public function test_payment_is_processed()
    {
        $mockGateway = Mockery::mock(PaymentGateway::class);
        $mockGateway->shouldReceive('charge')
                    ->once()
                    ->with(100, 'USD')
                    ->andReturn(['status' => 'success', 'id' => 'ch_123']);
        
        $this->app->instance(PaymentGateway::class, $mockGateway);
        
        $response = $this->postJson('/api/payments', [
            'amount' => 100,
            'currency' => 'USD'
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonPath('payment_id', 'ch_123');
    }
}
```

## Melhores Práticas de Testes

### Organização de Testes

```php
// tests/Unit/Models/UserTest.php
class UserTest extends TestCase
{
    /** @test */
    public function it_has_fillable_attributes()
    {
        $user = new User();
        
        $this->assertEquals([
            'name', 'email', 'password'
        ], $user->getFillable());
    }
}

// tests/Feature/Api/UserApiTest.php
class UserApiTest extends TestCase
{
    use RefreshDatabase;
    
    /** @test */
    public function it_returns_paginated_users()
    {
        User::factory()->count(25)->create();
        
        $response = $this->getJson('/api/users');
        
        $response->assertStatus(200)
                 ->assertJsonCount(20, 'data')
                 ->assertJsonPath('meta.total', 25);
    }
}
```

### Construtores de Dados de Teste

```php
class UserBuilder
{
    private array $attributes = [];
    
    public function withEmail(string $email): self
    {
        $this->attributes['email'] = $email;
        return $this;
    }
    
    public function asAdmin(): self
    {
        $this->attributes['role'] = 'admin';
        return $this;
    }
    
    public function verified(): self
    {
        $this->attributes['verified_at'] = now();
        return $this;
    }
    
    public function build(): User
    {
        return User::factory()->create($this->attributes);
    }
}

// Uso
$admin = (new UserBuilder())
    ->withEmail('admin@exemplo.com')
    ->asAdmin()
    ->verified()
    ->build();
```

### Traits de Teste

```php
trait InteractsWithPayments
{
    protected function createPayment(array $attributes = []): Payment
    {
        return Payment::factory()->create($attributes);
    }
    
    protected function assertPaymentSuccessful(Payment $payment): void
    {
        $this->assertEquals('completed', $payment->status);
        $this->assertNotNull($payment->completed_at);
    }
    
    protected function mockPaymentGateway($shouldSucceed = true): void
    {
        $mock = Mockery::mock(PaymentGateway::class);
        $mock->shouldReceive('charge')
             ->andReturn($shouldSucceed ? 
                 ['status' => 'success'] : 
                 ['status' => 'failed']);
        
        $this->app->instance(PaymentGateway::class, $mock);
    }
}
```

## Testando Comandos

```php
class CommandTest extends TestCase
{
    public function test_import_command()
    {
        Storage::fake('imports');
        Storage::disk('imports')->put('users.csv', "name,email\nJoão,joao@exemplo.com");
        
        $this->artisan('import:users users.csv')
             ->expectsOutput('Importando usuários...')
             ->expectsOutput('Importados 1 usuários.')
             ->assertExitCode(0);
        
        $this->assertDatabaseHas('users', [
            'email' => 'joao@exemplo.com'
        ]);
    }
    
    public function test_interactive_command()
    {
        $this->artisan('make:service')
             ->expectsQuestion('Qual é o nome do serviço?', 'PaymentService')
             ->expectsQuestion('Gostaria de criar uma interface?', true)
             ->expectsOutput('Serviço criado com sucesso!')
             ->assertExitCode(0);
        
        $this->assertFileExists(app_path('Services/PaymentService.php'));
    }
}
```

## Integração Contínua

### Exemplo do GitHub Actions

```yaml
name: Testes

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ALLOW_EMPTY_PASSWORD: yes
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configurar PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: mbstring, pdo, pdo_mysql
        coverage: xdebug
    
    - name: Instalar Dependências
      run: composer install --no-interaction --prefer-dist
    
    - name: Executar Testes
      env:
        DB_CONNECTION: mysql
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_DATABASE: test_db
        DB_USERNAME: root
        DB_PASSWORD: ''
      run: |
        php artisan migrate --force
        composer test:coverage
    
    - name: Enviar Cobertura
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
```

## Melhores Práticas

1. **Teste comportamento, não implementação**: Foque no que o código faz, não como
2. **Use nomes descritivos para testes**: Deixe claro o que está sendo testado
3. **Siga o padrão AAA**: Arrange, Act, Assert (Organizar, Agir, Afirmar)
4. **Mantenha testes independentes**: Cada teste deve executar isoladamente
5. **Use factories**: Não codifique dados de teste diretamente
6. **Simule dependências externas**: Não faça chamadas reais de API
7. **Teste casos extremos**: Inclua condições de contorno e cenários de erro
8. **Mantenha cobertura de testes**: Busque alta cobertura, mas foque na qualidade