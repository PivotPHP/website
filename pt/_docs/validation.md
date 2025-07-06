---
layout: docs-i18n
title: Validação
permalink: /pt/docs/validacao/
lang: pt
---

# Validação

O HelixPHP fornece um sistema de validação poderoso e flexível para validar dados recebidos. O validador suporta uma ampla variedade de regras de validação e permite que você valide facilmente dados de formulários, requisições de API e muito mais.

## Uso Básico

### Validação Rápida

A maneira mais simples de validar dados:

```php
$validator = validate($request->all(), [
    'name' => 'required|string|max:255',
    'email' => 'required|email|unique:users',
    'age' => 'required|integer|min:18',
]);

if ($validator->fails()) {
    return response()->json([
        'errors' => $validator->errors()
    ], 422);
}

// Obter dados validados
$validated = $validator->validated();
```

### Validação Manual

Criar uma instância do validador manualmente:

```php
use Helix\Validation\Validator;

$validator = new Validator($data, [
    'title' => 'required|min:5|max:255',
    'body' => 'required',
    'publish_at' => 'nullable|date|after:now',
]);

// Verificar se a validação passou
if ($validator->passes()) {
    // Processar dados válidos
}

// Verificar se a validação falhou
if ($validator->fails()) {
    $errors = $validator->errors();
}
```

## Regras de Validação Disponíveis

### Validação de String

```php
[
    'username' => 'alpha',           // Apenas caracteres alfabéticos
    'slug' => 'alpha_dash',          // Letras, números, traços, underscores
    'code' => 'alpha_num',           // Caracteres alfanuméricos
    'name' => 'string|min:2|max:50', // String com restrições de comprimento
    'bio' => 'nullable|string',      // String opcional
]
```

### Validação Numérica

```php
[
    'age' => 'integer|min:0|max:150',
    'price' => 'numeric|min:0',
    'quantity' => 'digits:5',         // Exatamente 5 dígitos
    'year' => 'digits_between:2,4',   // Entre 2 e 4 dígitos
    'rating' => 'between:1,5',        // Valor numérico entre 1 e 5
]
```

### Validação de Data

```php
[
    'birthday' => 'date',
    'appointment' => 'date_format:Y-m-d H:i:s',
    'start_date' => 'date|after:today',
    'end_date' => 'date|after:start_date',
    'created_at' => 'date|before:now',
    'meeting_time' => 'date|between:2024-01-01,2024-12-31',
]
```

### Validação de Arquivo

```php
[
    'avatar' => 'required|image|max:2048',            // Máximo 2MB imagem
    'document' => 'file|mimes:pdf,doc,docx|max:10240', // Máximo 10MB
    'video' => 'file|mimetypes:video/mp4|max:102400',  // Máximo 100MB
    'images.*' => 'image|dimensions:min_width=100,min_height=100',
]
```

### Validação de Array

```php
[
    'tags' => 'array|min:1|max:5',
    'tags.*' => 'string|distinct',
    'options' => 'array',
    'options.*.name' => 'required|string',
    'options.*.value' => 'required',
    'matrix' => 'array|size:3',
    'matrix.*' => 'array|size:3',
    'matrix.*.*' => 'integer',
]
```

### Validação de Banco de Dados

```php
[
    'email' => 'unique:users,email',
    'slug' => 'unique:posts,slug,'.$post->id,
    'category_id' => 'exists:categories,id',
    'user_id' => 'exists:users,id,active,1', // Onde active = 1
]
```

### Outras Regras Comuns

```php
[
    'email' => 'required|email:rfc,dns',
    'website' => 'url|active_url',
    'password' => 'required|confirmed|min:8',
    'terms' => 'accepted',
    'gender' => 'in:male,female,other',
    'status' => 'not_in:suspended,banned',
    'username' => 'regex:/^[a-z0-9_-]+$/i',
    'json_data' => 'json',
    'ip' => 'ip',
    'ipv4' => 'ipv4',
    'ipv6' => 'ipv6',
    'uuid' => 'uuid',
]
```

## Regras de Validação Personalizadas

### Regras Inline

Crie regras de validação personalizadas na hora:

```php
$validator = validate($data, [
    'phone' => [
        'required',
        function ($attribute, $value, $fail) {
            if (!preg_match('/^[0-9]{10}$/', $value)) {
                $fail('O campo '.$attribute.' deve ser um número de telefone com 10 dígitos.');
            }
        },
    ],
]);
```

### Classes de Regra

Crie classes de regra de validação reutilizáveis:

```php
namespace App\Rules;

use Helix\Contracts\Validation\Rule;

class Uppercase implements Rule
{
    public function passes($attribute, $value): bool
    {
        return strtoupper($value) === $value;
    }
    
    public function message(): string
    {
        return 'O campo :attribute deve estar em maiúsculas.';
    }
}

// Uso
$validator = validate($data, [
    'code' => ['required', new Uppercase],
]);
```

### Regras Implícitas

Regras que executam mesmo quando o atributo não está presente:

```php
namespace App\Rules;

use Helix\Contracts\Validation\ImplicitRule;

class RequiredIf implements ImplicitRule
{
    public function __construct(
        private string $field,
        private mixed $value
    ) {}
    
    public function passes($attribute, $value): bool
    {
        if (request($this->field) === $this->value) {
            return !empty($value);
        }
        
        return true;
    }
    
    public function message(): string
    {
        return "O campo :attribute é obrigatório quando {$this->field} é {$this->value}.";
    }
}
```

## Validação Condicional

### Required If/Unless

```php
$rules = [
    'email' => 'required_if:contact_method,email',
    'phone' => 'required_if:contact_method,phone',
    'company' => 'required_if:account_type,business',
    'tax_id' => 'required_unless:country,br',
];
```

### Regras Sometimes

Valide apenas quando o campo está presente:

```php
$validator = validate($data, [
    'email' => 'sometimes|required|email',
    'phone' => 'sometimes|required|digits:10',
]);

// Ou com callback
$validator->sometimes('credit_card', 'required|cc_number', function ($input) {
    return $input->payment_type === 'credit';
});

$validator->sometimes(['credit_card', 'cvv'], 'required', function ($input) {
    return $input->payment_type === 'credit';
});
```

### Regras Condicionais Complexas

```php
use Helix\Validation\Rule;

$rules = [
    'shipping_method' => 'required',
    'express_reason' => Rule::requiredIf(function () use ($request) {
        return $request->shipping_method === 'express' 
            && $request->total < 100;
    }),
];
```

## Mensagens de Validação

### Mensagens Personalizadas

```php
$messages = [
    'required' => 'O campo :attribute é obrigatório.',
    'email.required' => 'Precisamos do seu endereço de email.',
    'email.email' => 'Por favor, forneça um endereço de email válido.',
    'age.min' => 'Você deve ter pelo menos :min anos.',
];

$validator = validate($data, $rules, $messages);
```

### Atributos Personalizados

```php
$attributes = [
    'email' => 'endereço de email',
    'dob' => 'data de nascimento',
];

$validator = validate($data, $rules, $messages, $attributes);
```

### Localização

```php
// resources/lang/pt/validation.php
return [
    'required' => 'O campo :attribute é obrigatório.',
    'email' => 'O campo :attribute deve ser um endereço de email válido.',
    'custom' => [
        'email' => [
            'required' => 'Precisamos saber seu endereço de email!',
        ],
    ],
    'attributes' => [
        'email' => 'endereço de email',
    ],
];
```

## Trabalhando com Mensagens de Erro

### Recuperando Erros

```php
// Obter todos os erros
$errors = $validator->errors();

// Obter todas as mensagens
$messages = $errors->all();
// ['O campo nome é obrigatório.', 'O email deve ser um endereço de email válido.']

// Obter primeiro erro para um campo
$emailError = $errors->first('email');

// Obter todos os erros para um campo
$emailErrors = $errors->get('email');

// Verificar se o campo tem erro
if ($errors->has('email')) {
    // Lidar com erro de email
}

// Obter erros como JSON
$json = $errors->toJson();
```

### Sacos de Erros

Agrupe erros de validação:

```php
$validator = validate($loginData, $loginRules)
    ->errorBag('login');

$validator = validate($registerData, $registerRules)
    ->errorBag('register');

// Nas views
@if($errors->login->has('email'))
    <span class="error">{{ $errors->login->first('email') }}</span>
@endif
```

## Validação de Form Request

Crie classes de requisição dedicadas:

```php
namespace App\Http\Requests;

use Helix\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }
    
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:8',
            'role' => 'required|in:admin,user',
        ];
    }
    
    public function messages(): array
    {
        return [
            'email.unique' => 'Este email já está registrado.',
            'password.confirmed' => 'A confirmação de senha não corresponde.',
        ];
    }
    
    public function attributes(): array
    {
        return [
            'email' => 'endereço de email',
        ];
    }
    
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }
    
    protected function passedValidation(): void
    {
        $this->replace([
            'password' => bcrypt($this->password),
        ]);
    }
}

// No controller
public function store(StoreUserRequest $request)
{
    // A validação é automática
    $user = User::create($request->validated());
    
    return response()->json($user, 201);
}
```

## Validação Avançada

### Validando Arrays

```php
$validator = validate($request->all(), [
    'users' => 'required|array',
    'users.*.name' => 'required|string',
    'users.*.email' => 'required|email|distinct',
    'users.*.roles' => 'array',
    'users.*.roles.*' => 'exists:roles,id',
]);
```

### Validação de Dados Aninhados

```php
$rules = [
    'company.name' => 'required|string',
    'company.address.street' => 'required|string',
    'company.address.city' => 'required|string',
    'company.address.country' => 'required|string|size:2',
    'company.employees.*.name' => 'required|string',
    'company.employees.*.position' => 'required|string',
];
```

### Regra Bail

Parar validação na primeira falha:

```php
$rules = [
    'email' => 'bail|required|email|unique:users',
    // Se required falhar, email e unique não serão executados
];
```

### Hook Após Validação

```php
$validator = validate($data, $rules);

$validator->after(function ($validator) {
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Algo está errado!');
    }
});
```

## Validação em Diferentes Contextos

### Validação de API

```php
class ApiValidator
{
    public function validate(array $data, array $rules): array
    {
        $validator = validate($data, $rules);
        
        if ($validator->fails()) {
            throw new ValidationException(
                'Validação falhou',
                $validator->errors()->toArray()
            );
        }
        
        return $validator->validated();
    }
}
```

### Validação em Lote

```php
$results = collect($users)->map(function ($userData) {
    $validator = validate($userData, [
        'email' => 'required|email',
        'name' => 'required|string',
    ]);
    
    return [
        'data' => $userData,
        'valid' => $validator->passes(),
        'errors' => $validator->errors()->toArray(),
    ];
});

$invalid = $results->where('valid', false);
```

## Melhores Práticas

1. **Use Form Requests**: Para validação complexa, use classes de form request dedicadas
2. **Valide Cedo**: Valide dados o mais cedo possível no ciclo de vida da requisição
3. **Seja Específico**: Use regras de validação específicas em vez de genéricas
4. **Mensagens Personalizadas**: Forneça mensagens de erro amigáveis ao usuário
5. **Sanitizar vs Validar**: Validação verifica dados, sanitização os limpa
6. **Cliente + Servidor**: Sempre valide no servidor, mesmo com validação no cliente
7. **Teste Validação**: Escreva testes para suas regras de validação
8. **Documente Regras**: Documente regras de validação complexas para outros desenvolvedores