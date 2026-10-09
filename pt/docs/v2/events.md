---

layout: docs
title: Eventos
permalink: /pt/docs/v2/events/
lang: pt
version: "2.1.1"
---

O PivotPHP usa o padrão **PSR-14** (`Psr\EventDispatcher`). Eventos são **objetos** e os
listeners são registrados pela **classe** do evento na `Application`.

## Registrando listeners

Use `$app->on()` (ou `$app->addEventListener()`, que é o mesmo) passando a classe do evento:

```php
$app->on(UserRegistered::class, function (UserRegistered $event) {
    // ...
});
```

## Disparando eventos

```php
$app->dispatchEvent(new UserRegistered('joao@exemplo.com'));
```

`dispatchEvent()` recebe o objeto do evento e o devolve ao final.

## Eventos genéricos

Para eventos simples, use a classe `PivotPHP\Core\Events\Event`, que carrega um nome e um
array de dados:

```php
use PivotPHP\Core\Events\Event;

$app->on(Event::class, function (Event $event) {
    $name  = $event->getName();
    $email = $event->get('email');
});

$app->dispatchEvent(new Event('user.registered', ['email' => 'joao@exemplo.com']));
```

Métodos de `Event`: `getName()`, `getData()`, `get($key, $default)`, `set($key, $value)` e
`stopPropagation()`.

## Hooks

`PivotPHP\Core\Events\Hook` é um evento extensível para extensões (implementa
`Psr\EventDispatcher\StoppableEventInterface`):

```php
use PivotPHP\Core\Events\Hook;

$app->on(Hook::class, function (Hook $hook) {
    if ($hook->isPropagationStopped()) {
        return;
    }
    // ...
});

$app->dispatchEvent(new Hook('extension.ready', ['data' => '...']));
```

## Eventos do ciclo de vida

O núcleo define eventos do ciclo de vida da requisição:

- `PivotPHP\Core\Events\ApplicationStarted`
- `PivotPHP\Core\Events\RequestReceived` (propriedades `request` e `receivedAt`)
- `PivotPHP\Core\Events\ResponseSent`

## Exemplo completo

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Events\Event;

$app = new Application();

$app->on(Event::class, function (Event $event) use ($app) {
    $app->getLogger()?->info('Evento: ' . $event->getName());
});

$app->get('/registrar', function ($req, $res) use ($app) {
    $app->dispatchEvent(new Event('user.registered', ['email' => 'joao@exemplo.com']));
    return $res->json(['ok' => true]);
});

$app->run();
```

## Limitações

- Não há filas, assinantes com curinga, prioridades nem `Event::fake()`.
- Registre e dispare **classes** de evento (PSR-14). O par `on('string')` + `fireEvent()`
  não é a forma de uso — `fireEvent()` apenas cria um objeto de evento e o despacha.
