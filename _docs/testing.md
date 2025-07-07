---
layout: docs
title: Testing
permalink: /docs/testing/
---

PivotPHP is built with testing in mind. The framework provides a powerful testing suite based on PHPUnit, with additional helpers and assertions to make testing your application a breeze.

## Getting Started

### Installation

PivotPHP comes with PHPUnit pre-configured. If you need to install it manually:

```bash
composer require --dev phpunit/phpunit
composer require --dev mockery/mockery
composer require --dev fakerphp/faker
```

### Configuration

The `phpunit.xml` file in your project root configures the testing environment:

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

### Running Tests

```bash
# Run all tests
composer test

# Run specific test suite
composer test -- --testsuite=Unit

# Run specific test file
composer test tests/Unit/UserTest.php

# Run specific test method
composer test -- --filter test_user_can_be_created

# Run tests with coverage
composer test:coverage
```

## Writing Tests

### Basic Test Structure

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
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);

        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
    }

    public function test_user_full_name()
    {
        $user = new User([
            'first_name' => 'John',
            'last_name' => 'Doe'
        ]);

        $this->assertEquals('John Doe', $user->getFullName());
    }
}
```

### Test Case Base Class

```php
namespace Tests;

use PivotPHP\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Additional setup
    }

    protected function tearDown(): void
    {
        // Cleanup

        parent::tearDown();
    }
}
```

## HTTP Tests

### Testing Routes

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
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(201)
                 ->assertJsonPath('data.email', 'john@example.com');

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }
}
```

### Authentication Testing

```php
class AuthTest extends TestCase
{
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123'
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

### Testing File Uploads

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

## Database Testing

### Database Transactions

```php
use PivotPHP\Foundation\Testing\RefreshDatabase;

class DatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_post()
    {
        $user = User::factory()->create();

        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Test Post',
            'content' => 'Test content'
        ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post'
        ]);

        $this->assertDatabaseCount('posts', 1);
    }
}
```

### Model Factories

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

// Usage
$users = User::factory()->count(5)->create();
$admin = User::factory()->admin()->create();
$unverified = User::factory()->unverified()->create();
```

### Database Assertions

```php
public function test_database_assertions()
{
    $user = User::factory()->create();

    // Assert a table contains a record
    $this->assertDatabaseHas('users', [
        'email' => $user->email
    ]);

    // Assert a table doesn't contain a record
    $this->assertDatabaseMissing('users', [
        'email' => 'nonexistent@example.com'
    ]);

    // Assert a record has been deleted
    $user->delete();
    $this->assertModelMissing($user);

    // Assert count
    User::factory()->count(3)->create();
    $this->assertDatabaseCount('users', 3);

    // Assert soft deleted
    $user->delete();
    $this->assertSoftDeleted($user);
}
```

## Mocking

### Basic Mocking

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
                 ->andReturn(new User(['id' => 1, 'name' => 'John']));

        $this->app->instance(UserRepository::class, $mockRepo);

        $service = app(UserService::class);
        $user = $service->getUser(1);

        $this->assertEquals('John', $user->name);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
```

### Mocking Facades

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

### Mocking External Services

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

## Testing Best Practices

### Test Organization

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

### Test Data Builders

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

// Usage
$admin = (new UserBuilder())
    ->withEmail('admin@example.com')
    ->asAdmin()
    ->verified()
    ->build();
```

### Testing Traits

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

## Testing Commands

```php
class CommandTest extends TestCase
{
    public function test_import_command()
    {
        Storage::fake('imports');
        Storage::disk('imports')->put('users.csv', "name,email\nJohn,john@example.com");

        $this->artisan('import:users users.csv')
             ->expectsOutput('Importing users...')
             ->expectsOutput('Imported 1 users.')
             ->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    public function test_interactive_command()
    {
        $this->artisan('make:service')
             ->expectsQuestion('What is the service name?', 'PaymentService')
             ->expectsQuestion('Would you like to create an interface?', true)
             ->expectsOutput('Service created successfully!')
             ->assertExitCode(0);

        $this->assertFileExists(app_path('Services/PaymentService.php'));
    }
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

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

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: mbstring, pdo, pdo_mysql
        coverage: xdebug

    - name: Install Dependencies
      run: composer install --no-interaction --prefer-dist

    - name: Run Tests
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

    - name: Upload Coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what code does, not how
2. **Use descriptive test names**: Make it clear what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent**: Each test should run in isolation
5. **Use factories**: Don't hardcode test data
6. **Mock external dependencies**: Don't make real API calls
7. **Test edge cases**: Include boundary conditions and error scenarios
8. **Maintain test coverage**: Aim for high coverage but focus on quality
