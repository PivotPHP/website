---
redirect_from:
  - /docs/validation/
  - /en/docs/validation/
  - /en/validation/
layout: docs
title: Validação
permalink: /pt/docs/validation/
lang: pt
---

O PivotPHP inclui um validador simples em `PivotPHP\Core\Validation\Validator`, baseado em regras no
formato string (`'required|email|max:255'`).

## Uso básico

Crie o validador com as regras e valide os dados:

```php
use PivotPHP\Core\Validation\Validator;

$validator = new Validator([
    'name'  => 'required|string|max:255',
    'email' => 'required|email',
    'age'   => 'required|integer|min:18',
]);

if (!$validator->validate($req->json())) {
    return $res->status(422)->json(['errors' => $validator->getErrors()]);
}
```

A fábrica `Validator::make($data, $rules, $messages)` já valida na criação:

```php
$validator = Validator::make($req->json(), [
    'title' => 'required|min:5|max:255',
    'body'  => 'required',
]);

if (!$validator->validate($req->json())) {
    // ...
}
```

> `validate(array $data)` recebe os dados e devolve `bool`. Para os dados já validados, use o payload
> validado conforme a regra de negócio — o `Validator` não devolve um array "validado".

## API

| Método | Descrição |
|---|---|
| `__construct(array $rules = [], array $messages = [])` | Cria o validador com regras e mensagens. |
| `Validator::make(array $data, array $rules, array $messages = [])` | Cria e valida. |
| `setRules(array $rules): self` | (Re)define as regras. |
| `setMessages(array $messages): self` | Define mensagens customizadas. |
| `validate(array $data): bool` | Executa a validação. |
| `getErrors(): array` | Erros por campo (`['campo' => ['msg', ...]]`). |
| `getFirstError(): ?string` | Primeira mensagem de erro. |

## Regras disponíveis

| Regra | Descrição |
|---|---|
| `required` | O campo deve existir e não ser `null`/`''`/array vazio. |
| `nullable` | Se o campo vier `null`, as demais regras são ignoradas. |
| `sometimes` | Só valida quando o campo está presente. |
| `string` | Deve ser uma string. |
| `numeric` | Deve ser numérico. |
| `integer` | Deve ser um inteiro. |
| `email` | Deve ser um e-mail válido. |
| `min:n` | Numérico: valor ≥ n. String: `mb_strlen` ≥ n. Array: ≥ n itens. |
| `max:n` | Numérico: valor ≤ n. String: `mb_strlen` ≤ n. Array: ≤ n itens. |
| `in:a,b,c` | Deve ser um dos valores listados. |
| `regex:/.../` | Deve casar com o padrão. |

Regras desconhecidas (ou com erro de digitação) lançam `\InvalidArgumentException` — não falham em
silêncio.

## Campos opcionais e `nullable`

Campos ausentes que **não** tenham `required` não falham por padrão. Para aceitar `null`
explicitamente, adicione `nullable`:

```php
$validator = new Validator([
    'nickname' => 'nullable|string|max:30',
    'phone'    => 'sometimes|required|string',
]);
```

## Mensagens customizadas

As mensagens padrão estão em português. Para personalizar, passe um array indexado por
`campo.regra`:

```php
$validator = new Validator(
    [
        'email' => 'required|email',
        'age'   => 'required|integer|min:18',
    ],
    [
        'email.required' => 'Precisamos do seu e-mail.',
        'email.email'    => 'Informe um e-mail válido.',
        'age.min'        => 'Você deve ter pelo menos :min anos.',
    ]
);
```

## Exemplo completo em uma rota

```php
use PivotPHP\Core\Validation\Validator;

$app->post('/usuarios', function ($req, $res) {
    $data = $req->json();

    $validator = Validator::make($data, [
        'name'  => 'required|string|min:2|max:100',
        'email' => 'required|email',
        'role'  => 'required|in:admin,user',
    ]);

    if (!$validator->validate($data)) {
        return $res->status(422)->json([
            'errors' => $validator->getErrors(),
        ]);
    }

    // ... persistir ...

    return $res->status(201)->json(['user' => $data]);
});
```

## Limitações

- Não há regras de banco de dados (`unique`, `exists`) nem regras condicionais complexas
  (`required_if`, `Rule::requiredIf`).
- Não há "form requests" nem hooks `after()`. Valide dentro do handler (ou de um middleware próprio).
- `min`/`max` usam `mb_strlen` (caracteres UTF-8) para strings e comparação numérica para números.
