---
layout: docs
title: Security
permalink: /docs/security/
---

# Security

HelixPHP takes security seriously and provides multiple layers of protection out of the box. This guide covers the security features available and best practices for keeping your application secure.

## Overview

HelixPHP includes protection against common security vulnerabilities:

- **CSRF** (Cross-Site Request Forgery)
- **XSS** (Cross-Site Scripting)
- **SQL Injection**
- **Session Hijacking**
- **Brute Force Attacks**
- **Timing Attacks**
- **Directory Traversal**

## CSRF Protection

### How CSRF Protection Works

HelixPHP generates unique tokens for each session to verify that authenticated requests are coming from your application:

```php
// Enable CSRF protection globally
$app->middleware(new CsrfMiddleware());

// In your forms
<form method="POST" action="/profile">
    <?= csrf_field() ?>
    <!-- or -->
    <input type="hidden" name="_token" value="<?= csrf_token() ?>">
    
    <!-- form fields -->
</form>

// For AJAX requests
fetch('/api/data', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

### Excluding Routes

Some routes may need to be excluded from CSRF protection:

```php
$app->middleware(new CsrfMiddleware([
    'except' => [
        '/webhooks/*',
        '/api/public/*'
    ]
]));
```

### Custom Token Verification

```php
class CustomCsrfMiddleware extends CsrfMiddleware
{
    protected function tokensMatch($request): bool
    {
        $token = $this->getTokenFromRequest($request);
        $sessionToken = $request->session()->token();
        
        return hash_equals($sessionToken, $token);
    }
}
```

## XSS Protection

### Automatic Output Escaping

Always escape user input when displaying it:

```php
// In PHP templates
<?= e($userInput) ?>
<?= escape($comment) ?>

// Escape for different contexts
<?= e($data, 'html') ?>      // HTML context (default)
<?= e($data, 'js') ?>        // JavaScript context
<?= e($data, 'css') ?>       // CSS context
<?= e($data, 'attr') ?>      // HTML attribute context
```

### Content Security Policy

Set CSP headers to prevent XSS attacks:

```php
$app->middleware(function($request, $handler) {
    $response = $handler->handle($request);
    
    return $response->withHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com; style-src 'self' 'unsafe-inline';"
    );
});
```

### XSS Protection Headers

```php
class SecurityHeadersMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        
        return $response
            ->withHeader('X-XSS-Protection', '1; mode=block')
            ->withHeader('X-Content-Type-Options', 'nosniff')
            ->withHeader('X-Frame-Options', 'SAMEORIGIN')
            ->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
}
```

## Authentication

### Password Hashing

Always hash passwords using secure algorithms:

```php
use Helix\Security\Hash;

// Hash password
$hashedPassword = Hash::make($request->input('password'));

// Verify password
if (Hash::check($plainPassword, $hashedPassword)) {
    // Password is correct
}

// Check if rehashing is needed
if (Hash::needsRehash($hashedPassword)) {
    $hashedPassword = Hash::make($plainPassword);
    // Update stored password
}
```

### Authentication Example

```php
class AuthController
{
    public function login(Request $request, Response $response)
    {
        $credentials = $request->only(['email', 'password']);
        
        $user = User::where('email', $credentials['email'])->first();
        
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return $response->unauthorized('Invalid credentials');
        }
        
        // Generate secure token
        $token = bin2hex(random_bytes(32));
        
        // Store token
        $user->api_token = hash('sha256', $token);
        $user->save();
        
        return $response->json([
            'token' => $token,
            'user' => $user
        ]);
    }
}
```

### JWT Authentication

```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuth
{
    private string $secret;
    
    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }
    
    public function generateToken(User $user): string
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 hours
            'user' => [
                'id' => $user->id,
                'email' => $user->email
            ]
        ];
        
        return JWT::encode($payload, $this->secret, 'HS256');
    }
    
    public function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
```

## Rate Limiting

Protect against brute force attacks and API abuse:

```php
// Global rate limiting
$app->middleware(new RateLimitMiddleware([
    'max_attempts' => 60,
    'decay_minutes' => 1
]));

// Route-specific limits
$app->post('/login', function($req, $res) {
    // Login logic
})->middleware('throttle:5,1'); // 5 attempts per minute

// Custom rate limiting
class CustomRateLimiter extends RateLimitMiddleware
{
    protected function resolveRequestSignature($request): string
    {
        // Use user ID if authenticated, otherwise IP
        if ($user = $request->getAttribute('user')) {
            return 'user:' . $user->id;
        }
        
        return 'ip:' . $request->getServerParams()['REMOTE_ADDR'];
    }
}
```

## SQL Injection Prevention

### Use Parameter Binding

Always use parameter binding for database queries:

```php
// Using query builder (safe)
$users = DB::table('users')
    ->where('email', $email)
    ->where('active', true)
    ->get();

// Using raw queries with binding (safe)
$users = DB::select(
    'SELECT * FROM users WHERE email = ? AND active = ?',
    [$email, true]
);

// NEVER do this (vulnerable)
$users = DB::select("SELECT * FROM users WHERE email = '$email'");
```

### Input Validation

```php
$validator = validate($request->all(), [
    'email' => 'required|email|max:255',
    'age' => 'required|integer|between:18,100',
    'role' => 'required|in:admin,user,guest'
]);

if ($validator->fails()) {
    return $response->unprocessable($validator->errors());
}
```

## Session Security

### Configure Secure Sessions

```php
// In your session configuration
return [
    'driver' => 'file',
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => true,
    'secure' => true,  // HTTPS only
    'httponly' => true, // No JavaScript access
    'same_site' => 'lax',
    'partitioned' => true
];
```

### Session Fixation Prevention

```php
class SessionSecurityMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        // Regenerate session ID on login
        if ($request->getUri()->getPath() === '/login' && $request->isPost()) {
            session_regenerate_id(true);
        }
        
        // Check for session hijacking
        $sessionIp = $_SESSION['ip_address'] ?? null;
        $currentIp = $request->getServerParams()['REMOTE_ADDR'];
        
        if ($sessionIp && $sessionIp !== $currentIp) {
            session_destroy();
            return response()->unauthorized('Session invalid');
        }
        
        $_SESSION['ip_address'] = $currentIp;
        
        return $handler->handle($request);
    }
}
```

## File Upload Security

### Validate File Uploads

```php
class FileUploadController
{
    public function upload(Request $request, Response $response)
    {
        $validator = validate($request->all(), [
            'file' => 'required|file|mimes:jpg,png,pdf|max:2048'
        ]);
        
        if ($validator->fails()) {
            return $response->unprocessable($validator->errors());
        }
        
        $file = $request->file('file');
        
        // Additional validation
        if (!$this->isValidFile($file)) {
            return $response->badRequest('Invalid file');
        }
        
        // Generate safe filename
        $filename = $this->generateSafeFilename($file);
        
        // Store outside web root
        $path = storage_path('uploads/' . $filename);
        $file->moveTo($path);
        
        return $response->json(['path' => $filename]);
    }
    
    private function isValidFile($file): bool
    {
        // Check actual MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->getStream()->getMetadata('uri'));
        finfo_close($finfo);
        
        $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        
        return in_array($mimeType, $allowedTypes);
    }
    
    private function generateSafeFilename($file): string
    {
        $extension = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
        return uniqid() . '_' . time() . '.' . $extension;
    }
}
```

## Encryption

### Data Encryption

```php
use Helix\Security\Encryption;

// Encrypt data
$encrypted = Encryption::encrypt($sensitiveData);

// Decrypt data
$decrypted = Encryption::decrypt($encrypted);

// Encrypt with custom key
$encrypted = Encryption::encrypt($data, $customKey);
```

### Configuration

```php
// In your .env file
APP_KEY=base64:your-32-character-random-string-here
CIPHER=AES-256-CBC
```

## Security Headers

### Comprehensive Security Headers

```php
class SecurityHeadersMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        
        return $response
            // Prevent XSS
            ->withHeader('X-XSS-Protection', '1; mode=block')
            
            // Prevent MIME sniffing
            ->withHeader('X-Content-Type-Options', 'nosniff')
            
            // Prevent clickjacking
            ->withHeader('X-Frame-Options', 'DENY')
            
            // Force HTTPS
            ->withHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
            
            // Control referrer information
            ->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            
            // Feature policy
            ->withHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
            
            // Content Security Policy
            ->withHeader('Content-Security-Policy', $this->getCspPolicy());
    }
    
    private function getCspPolicy(): string
    {
        return implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ]);
    }
}
```

## API Security

### API Authentication

```php
class ApiAuthMiddleware implements MiddlewareInterface
{
    public function process($request, $handler): ResponseInterface
    {
        $apiKey = $request->getHeaderLine('X-API-Key');
        
        if (!$apiKey) {
            return response()->unauthorized('API key required');
        }
        
        // Constant-time comparison to prevent timing attacks
        $validKey = hash('sha256', $_ENV['API_KEY']);
        $providedKey = hash('sha256', $apiKey);
        
        if (!hash_equals($validKey, $providedKey)) {
            return response()->unauthorized('Invalid API key');
        }
        
        return $handler->handle($request);
    }
}
```

### CORS Configuration

```php
$app->middleware(new CorsMiddleware([
    'allowed_origins' => ['https://app.example.com'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-API-Key'],
    'exposed_headers' => ['X-RateLimit-Remaining'],
    'max_age' => 86400,
    'credentials' => true
]));
```

## Security Best Practices

1. **Keep HelixPHP Updated**: Regularly update to get security patches
2. **Use HTTPS**: Always use SSL/TLS in production
3. **Validate All Input**: Never trust user input
4. **Principle of Least Privilege**: Give minimum necessary permissions
5. **Security Audits**: Regularly audit your code and dependencies
6. **Error Handling**: Never expose sensitive information in error messages
7. **Logging**: Log security events for monitoring
8. **Environment Variables**: Store sensitive configuration in environment variables
9. **Dependencies**: Keep all dependencies updated
10. **Input Sanitization**: Sanitize data before storage and escape before output

## Security Checklist

- [ ] CSRF protection enabled
- [ ] XSS protection headers set
- [ ] All user input validated
- [ ] Passwords hashed with bcrypt
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] File uploads validated
- [ ] SQL injection prevented
- [ ] Sessions configured securely
- [ ] API authentication implemented
- [ ] Error messages don't leak information
- [ ] Dependencies regularly updated
- [ ] Security logging enabled