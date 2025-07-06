---
layout: docs
title: Requests & Responses
permalink: /docs/requests-responses/
---

# Requests & Responses

HelixPHP uses PSR-7 compliant HTTP message objects for requests and responses, providing a consistent and interoperable interface for handling HTTP communication.

## The Request Object

The request object represents the HTTP request and provides methods to access request data.

### Accessing Request Data

```php
$app->post('/users', function($request, $response) {
    // Get all input data
    $all = $request->all();
    
    // Get specific input with default value
    $name = $request->input('name', 'Anonymous');
    $email = $request->input('email');
    
    // Get nested input using dot notation
    $city = $request->input('address.city');
    
    // Get only specific fields
    $credentials = $request->only(['email', 'password']);
    
    // Get all except specific fields
    $data = $request->except(['password', 'password_confirmation']);
    
    // Check if input exists
    if ($request->has('email')) {
        // Process email
    }
    
    // Check if multiple inputs exist
    if ($request->hasAny(['email', 'username'])) {
        // Process login
    }
});
```

### Request Body

```php
// Get raw body content
$raw = $request->getBody()->getContents();

// Get parsed JSON body
$data = $request->body();

// Get specific field from JSON
$name = $request->body('name');

// For form data
$formData = $request->getParsedBody();
```

### Query Parameters

```php
// Get all query parameters
$queryParams = $request->getQueryParams();

// Get specific query parameter
$page = $request->query('page', 1);
$perPage = $request->query('per_page', 20);

// Get query string
$queryString = $request->getUri()->getQuery();
```

### Route Parameters

```php
$app->get('/users/{id}/posts/{postId}', function($request, $response) {
    // Get route parameters
    $userId = $request->param('id');
    $postId = $request->param('postId');
    
    // Get all route parameters
    $params = $request->params();
});
```

### Headers

```php
// Get all headers
$headers = $request->getHeaders();

// Get specific header
$contentType = $request->header('Content-Type');
$auth = $request->header('Authorization');

// Get header line (concatenated values)
$accept = $request->getHeaderLine('Accept');

// Check if header exists
if ($request->hasHeader('X-Requested-With')) {
    // AJAX request
}
```

### Request Method

```php
// Get HTTP method
$method = $request->getMethod();

// Check specific methods
if ($request->isGet()) {
    // Handle GET
}

if ($request->isPost()) {
    // Handle POST
}

if ($request->isMethod('PUT')) {
    // Handle PUT
}

// Check if request is AJAX
if ($request->isAjax()) {
    // Return JSON
}

// Check if request wants JSON
if ($request->wantsJson()) {
    return $response->json($data);
}
```

### Request URI

```php
// Get full URI
$uri = $request->getUri();

// Get components
$scheme = $uri->getScheme();        // http or https
$host = $uri->getHost();            // example.com
$port = $uri->getPort();            // 80, 443, or custom
$path = $uri->getPath();            // /users/123
$query = $uri->getQuery();          // page=1&sort=name
$fragment = $uri->getFragment();    // section1

// Get full URL
$fullUrl = $request->fullUrl();     // https://example.com/users/123?page=1

// Get URL without query string
$url = $request->url();             // https://example.com/users/123

// Get path
$path = $request->path();           // users/123
```

### File Uploads

```php
$app->post('/upload', function($request, $response) {
    // Get uploaded file
    $file = $request->file('avatar');
    
    if ($file && $file->getError() === UPLOAD_ERR_OK) {
        // Get file info
        $filename = $file->getClientFilename();
        $size = $file->getSize();
        $type = $file->getClientMediaType();
        
        // Move uploaded file
        $newPath = 'uploads/' . uniqid() . '_' . $filename;
        $file->moveTo($newPath);
        
        return $response->json([
            'path' => $newPath,
            'size' => $size,
            'type' => $type
        ]);
    }
    
    // Multiple files
    $files = $request->file('documents');
    foreach ($files as $file) {
        // Process each file
    }
});
```

### Request Attributes

```php
// Set attribute (typically in middleware)
$request = $request->withAttribute('user', $user);

// Get attribute
$user = $request->getAttribute('user');

// Get all attributes
$attributes = $request->getAttributes();

// Check if attribute exists
if ($request->hasAttribute('user')) {
    // User is authenticated
}
```

## The Response Object

The response object represents the HTTP response to be sent back to the client.

### Basic Responses

```php
// Plain text response
return $response->write('Hello World');

// HTML response
return $response->html('<h1>Hello World</h1>');

// JSON response
return $response->json([
    'message' => 'Success',
    'data' => $userData
]);

// Empty response
return $response->noContent();
```

### Status Codes

```php
// Set status code
return $response->status(201)->json($data);

// Common status methods
return $response->ok($data);          // 200
return $response->created($data);     // 201
return $response->accepted();         // 202
return $response->noContent();        // 204

return $response->badRequest($error); // 400
return $response->unauthorized();     // 401
return $response->forbidden();        // 403
return $response->notFound();         // 404
return $response->unprocessable($errors); // 422

return $response->serverError();      // 500

// Get current status
$status = $response->getStatusCode();
$reason = $response->getReasonPhrase();
```

### Headers

```php
// Set single header
$response = $response->header('X-Custom', 'value');

// Set multiple headers
$response = $response->withHeaders([
    'X-Custom' => 'value',
    'X-Another' => 'another-value'
]);

// PSR-7 style
$response = $response->withHeader('Content-Type', 'application/json');
$response = $response->withAddedHeader('X-Custom', 'value');

// Remove header
$response = $response->withoutHeader('X-Powered-By');
```

### Cookies

```php
// Set cookie
$response = $response->cookie('name', 'value', [
    'expires' => time() + 3600,
    'path' => '/',
    'domain' => '.example.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Simple cookie (expires in 1 hour)
$response = $response->cookie('session', $sessionId, 3600);

// Forever cookie (5 years)
$response = $response->forever('remember_token', $token);

// Delete cookie
$response = $response->forget('name');
```

### Redirects

```php
// Basic redirect
return $response->redirect('/dashboard');

// Redirect with status code
return $response->redirect('/login', 302);

// Redirect to named route
return $response->route('profile', ['id' => $userId]);

// Redirect back
return $response->back();

// Redirect with flash data
return $response->redirect('/dashboard')
    ->with('success', 'Profile updated successfully!');

// Redirect with input
return $response->redirect('/form')
    ->withInput($request->all())
    ->withErrors($validator->errors());
```

### File Downloads

```php
// Force file download
return $response->download('/path/to/file.pdf');

// Download with custom name
return $response->download('/path/to/file.pdf', 'invoice.pdf');

// Stream file
return $response->file('/path/to/image.jpg');

// Stream with headers
return $response->file('/path/to/document.pdf', [
    'Content-Type' => 'application/pdf',
    'Cache-Control' => 'public, max-age=3600'
]);
```

### Streaming Responses

```php
// Stream large data
return $response->stream(function() {
    $handle = fopen('large-file.csv', 'r');
    
    while (!feof($handle)) {
        echo fread($handle, 1024);
        ob_flush();
        flush();
    }
    
    fclose($handle);
});

// Server-sent events
return $response->stream(function() {
    while (true) {
        echo "data: " . json_encode(['time' => time()]) . "\n\n";
        ob_flush();
        flush();
        sleep(1);
    }
}, [
    'Content-Type' => 'text/event-stream',
    'Cache-Control' => 'no-cache'
]);
```

## Working with JSON

### JSON Requests

```php
$app->post('/api/users', function($request, $response) {
    // Check if request is JSON
    if (!$request->isJson()) {
        return $response->badRequest('Invalid content type');
    }
    
    // Get JSON data
    $data = $request->json();
    
    // Get specific field
    $email = $request->json('email');
    
    // Validate JSON
    if (!$request->json()->has(['email', 'password'])) {
        return $response->unprocessable([
            'errors' => ['Missing required fields']
        ]);
    }
});
```

### JSON Responses

```php
// Basic JSON response
return $response->json(['status' => 'success']);

// JSON with status code
return $response->status(201)->json($user);

// Pretty printed JSON
return $response->json($data, JSON_PRETTY_PRINT);

// JSONP response
return $response->jsonp('callback', $data);

// JSON with custom encoder options
return $response->json($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
```

## Response Macros

Create reusable response methods:

```php
// Define macro
Response::macro('success', function($data = null, $message = 'Success') {
    return $this->json([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
});

Response::macro('error', function($message = 'Error', $code = 400) {
    return $this->status($code)->json([
        'success' => false,
        'message' => $message
    ]);
});

// Use macros
return $response->success($userData, 'User created');
return $response->error('Invalid credentials', 401);
```

## Content Negotiation

```php
$app->get('/data', function($request, $response) {
    $data = ['name' => 'John', 'email' => 'john@example.com'];
    
    // Check what client accepts
    $accept = $request->header('Accept');
    
    if (str_contains($accept, 'application/xml')) {
        return $response->xml($data);
    } elseif (str_contains($accept, 'text/csv')) {
        return $response->csv($data);
    } else {
        return $response->json($data);
    }
});
```

## Best Practices

1. **Always return responses**: Every route handler must return a response object
2. **Use appropriate status codes**: Use semantic HTTP status codes
3. **Set correct content types**: Always set the appropriate Content-Type header
4. **Handle errors gracefully**: Return meaningful error messages with proper status codes
5. **Use immutable responses**: Response objects are immutable, always reassign
6. **Validate input**: Always validate request data before processing
7. **Use type hints**: Type hint request and response parameters for better IDE support

```php
use Helix\Http\Request;
use Helix\Http\Response;

$app->post('/users', function(Request $request, Response $response) {
    // Better IDE support and type safety
    return $response->json(['created' => true]);
});
```