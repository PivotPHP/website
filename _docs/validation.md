---
layout: docs
title: Validation
permalink: /docs/validation/
---

# Validation

HelixPHP provides a powerful and flexible validation system for validating incoming data. The validator supports a wide variety of validation rules and allows you to easily validate form data, API requests, and more.

## Basic Usage

### Quick Validation

The simplest way to validate data:

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

// Get validated data
$validated = $validator->validated();
```

### Manual Validation

Create a validator instance manually:

```php
use Helix\Validation\Validator;

$validator = new Validator($data, [
    'title' => 'required|min:5|max:255',
    'body' => 'required',
    'publish_at' => 'nullable|date|after:now',
]);

// Check if validation passes
if ($validator->passes()) {
    // Process valid data
}

// Check if validation fails
if ($validator->fails()) {
    $errors = $validator->errors();
}
```

## Available Validation Rules

### String Validation

```php
[
    'username' => 'alpha',           // Only alphabetic characters
    'slug' => 'alpha_dash',          // Letters, numbers, dashes, underscores
    'code' => 'alpha_num',           // Alphanumeric characters
    'name' => 'string|min:2|max:50', // String with length constraints
    'bio' => 'nullable|string',      // Optional string
]
```

### Numeric Validation

```php
[
    'age' => 'integer|min:0|max:150',
    'price' => 'numeric|min:0',
    'quantity' => 'digits:5',         // Exactly 5 digits
    'year' => 'digits_between:2,4',   // Between 2 and 4 digits
    'rating' => 'between:1,5',        // Numeric value between 1 and 5
]
```

### Date Validation

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

### File Validation

```php
[
    'avatar' => 'required|image|max:2048',            // Max 2MB image
    'document' => 'file|mimes:pdf,doc,docx|max:10240', // Max 10MB
    'video' => 'file|mimetypes:video/mp4|max:102400',  // Max 100MB
    'images.*' => 'image|dimensions:min_width=100,min_height=100',
]
```

### Array Validation

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

### Database Validation

```php
[
    'email' => 'unique:users,email',
    'slug' => 'unique:posts,slug,'.$post->id,
    'category_id' => 'exists:categories,id',
    'user_id' => 'exists:users,id,active,1', // Where active = 1
]
```

### Other Common Rules

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

## Custom Validation Rules

### Inline Rules

Create custom validation rules on the fly:

```php
$validator = validate($data, [
    'phone' => [
        'required',
        function ($attribute, $value, $fail) {
            if (!preg_match('/^[0-9]{10}$/', $value)) {
                $fail('The '.$attribute.' must be a 10-digit phone number.');
            }
        },
    ],
]);
```

### Rule Classes

Create reusable validation rule classes:

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
        return 'The :attribute must be uppercase.';
    }
}

// Usage
$validator = validate($data, [
    'code' => ['required', new Uppercase],
]);
```

### Implicit Rules

Rules that run even when the attribute is not present:

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
        return "The :attribute field is required when {$this->field} is {$this->value}.";
    }
}
```

## Conditional Validation

### Required If/Unless

```php
$rules = [
    'email' => 'required_if:contact_method,email',
    'phone' => 'required_if:contact_method,phone',
    'company' => 'required_if:account_type,business',
    'tax_id' => 'required_unless:country,us',
];
```

### Sometimes Rules

Only validate when the field is present:

```php
$validator = validate($data, [
    'email' => 'sometimes|required|email',
    'phone' => 'sometimes|required|digits:10',
]);

// Or with callback
$validator->sometimes('credit_card', 'required|cc_number', function ($input) {
    return $input->payment_type === 'credit';
});

$validator->sometimes(['credit_card', 'cvv'], 'required', function ($input) {
    return $input->payment_type === 'credit';
});
```

### Complex Conditional Rules

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

## Validation Messages

### Custom Messages

```php
$messages = [
    'required' => 'The :attribute field is required.',
    'email.required' => 'We need your email address.',
    'email.email' => 'Please provide a valid email address.',
    'age.min' => 'You must be at least :min years old.',
];

$validator = validate($data, $rules, $messages);
```

### Custom Attributes

```php
$attributes = [
    'email' => 'email address',
    'dob' => 'date of birth',
];

$validator = validate($data, $rules, $messages, $attributes);
```

### Localization

```php
// resources/lang/en/validation.php
return [
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute must be a valid email address.',
    'custom' => [
        'email' => [
            'required' => 'We need to know your email address!',
        ],
    ],
    'attributes' => [
        'email' => 'email address',
    ],
];
```

## Working with Error Messages

### Retrieving Errors

```php
// Get all errors
$errors = $validator->errors();

// Get all messages
$messages = $errors->all();
// ['The name field is required.', 'The email must be a valid email address.']

// Get first error for a field
$emailError = $errors->first('email');

// Get all errors for a field
$emailErrors = $errors->get('email');

// Check if field has error
if ($errors->has('email')) {
    // Handle email error
}

// Get errors as JSON
$json = $errors->toJson();
```

### Error Bags

Group validation errors:

```php
$validator = validate($loginData, $loginRules)
    ->errorBag('login');

$validator = validate($registerData, $registerRules)
    ->errorBag('register');

// In views
@if($errors->login->has('email'))
    <span class="error">{{ $errors->login->first('email') }}</span>
@endif
```

## Form Request Validation

Create dedicated request classes:

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
            'email.unique' => 'This email is already registered.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
    
    public function attributes(): array
    {
        return [
            'email' => 'email address',
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

// In controller
public function store(StoreUserRequest $request)
{
    // Validation is automatic
    $user = User::create($request->validated());
    
    return response()->json($user, 201);
}
```

## Advanced Validation

### Validating Arrays

```php
$validator = validate($request->all(), [
    'users' => 'required|array',
    'users.*.name' => 'required|string',
    'users.*.email' => 'required|email|distinct',
    'users.*.roles' => 'array',
    'users.*.roles.*' => 'exists:roles,id',
]);
```

### Nested Data Validation

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

### Bail Rule

Stop validation on first failure:

```php
$rules = [
    'email' => 'bail|required|email|unique:users',
    // If required fails, email and unique won't run
];
```

### After Validation Hook

```php
$validator = validate($data, $rules);

$validator->after(function ($validator) {
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Something is wrong!');
    }
});
```

## Validation in Different Contexts

### API Validation

```php
class ApiValidator
{
    public function validate(array $data, array $rules): array
    {
        $validator = validate($data, $rules);
        
        if ($validator->fails()) {
            throw new ValidationException(
                'Validation failed',
                $validator->errors()->toArray()
            );
        }
        
        return $validator->validated();
    }
}
```

### Batch Validation

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

## Best Practices

1. **Use Form Requests**: For complex validation, use dedicated form request classes
2. **Validate Early**: Validate data as early as possible in the request lifecycle
3. **Be Specific**: Use specific validation rules rather than generic ones
4. **Custom Messages**: Provide user-friendly error messages
5. **Sanitize vs Validate**: Validation checks data, sanitization cleans it
6. **Client + Server**: Always validate on the server, even with client-side validation
7. **Test Validation**: Write tests for your validation rules
8. **Document Rules**: Document complex validation rules for other developers