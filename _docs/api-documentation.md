---
layout: docs
title: API Documentation with OpenAPI/Swagger
description: Generate interactive API documentation automatically with OpenAPI 3.0 and Swagger UI
---

PivotPHP includes a powerful **OpenAPI/Swagger** documentation system that automatically generates interactive API documentation from your code comments. Build professional API docs with just a few annotations.

## Quick Start

```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Utils\OpenApiExporter;

$app = new Application();

/**
 * @api GET /users/:id
 * @summary Get user by ID
 * @description Returns complete user data
 * @param {integer} id.path.required - User ID
 * @produces application/json
 * @response 200 {User} User data
 * @response 404 {Error} User not found
 */
$app->get('/users/:id', function($req, $res) {
    $userId = $req->params('id');
    $user = $userService->findById($userId);

    if (!$user) {
        return $res->status(404)->json(['error' => 'User not found']);
    }

    return $res->json($user);
});

// Generate OpenAPI documentation
$docs = OpenApiExporter::export($app);

// Serve Swagger UI
$app->get('/docs', function($req, $res) use ($docs) {
    return $res->json($docs);
});

$app->run();
```

## OpenAPI Annotations

### @api - Define Route
```php
/**
 * @api POST /api/products
 * @summary Create new product
 * @description Creates a new product in the system
 */
```

### @param - Parameters
```php
/**
 * @param {string} name.body.required - Product name
 * @param {number} price.body.required - Product price
 * @param {integer} categoryId.path.required - Category ID
 * @param {string} filter.query.optional - Optional filter
 */
```

**Parameter types:**
- `path` - URL parameters (`/users/:id`)
- `query` - Query strings (`?filter=value`)
- `body` - Request body
- `header` - HTTP headers

### @response - Responses
```php
/**
 * @response 200 {Product} Product created successfully
 * @response 400 {ValidationError} Invalid data
 * @response 401 {AuthError} Unauthorized
 * @response 500 {Error} Internal server error
 */
```

### @security - Authentication
```php
/**
 * @security bearerAuth
 * @security apiKey
 * @security basicAuth
 */
```

## Complete CRUD Example

```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Utils\OpenApiExporter;

$app = new Application();

/**
 * @api GET /api/products
 * @summary List products
 * @description Returns paginated list of products with filters
 * @param {integer} page.query.optional - Page number (default: 1)
 * @param {integer} limit.query.optional - Items per page (default: 10)
 * @param {string} category.query.optional - Filter by category
 * @param {string} search.query.optional - Search by name
 * @produces application/json
 * @response 200 {ProductList} Product list
 * @response 400 {Error} Invalid parameters
 */
$app->get('/api/products', function($req, $res) {
    $page = $req->query('page', 1);
    $limit = $req->query('limit', 10);
    $category = $req->query('category');
    $search = $req->query('search');

    $products = $productService->list([
        'page' => $page,
        'limit' => $limit,
        'category' => $category,
        'search' => $search
    ]);

    return $res->json($products);
});

/**
 * @api POST /api/products
 * @summary Create new product
 * @description Creates a new product in the system
 * @param {string} name.body.required - Product name
 * @param {string} description.body.optional - Description
 * @param {number} price.body.required - Price (greater than 0)
 * @param {integer} categoryId.body.required - Category ID
 * @param {array} tags.body.optional - Product tags
 * @produces application/json
 * @security bearerAuth
 * @response 201 {Product} Product created
 * @response 400 {ValidationError} Invalid data
 * @response 401 {AuthError} Unauthorized
 */
$app->post('/api/products', function($req, $res) {
    $data = $req->json();

    // Validation
    if (!$data['name'] || !$data['price'] || !$data['categoryId']) {
        return $res->status(400)->json([
            'error' => 'Required fields: name, price, categoryId'
        ]);
    }

    $product = $productService->create($data);

    return $res->status(201)->json($product);
});

/**
 * @api PUT /api/products/:id
 * @summary Update product
 * @description Updates data of an existing product
 * @param {integer} id.path.required - Product ID
 * @param {string} name.body.optional - Product name
 * @param {string} description.body.optional - Description
 * @param {number} price.body.optional - Price
 * @param {integer} categoryId.body.optional - Category ID
 * @produces application/json
 * @security bearerAuth
 * @response 200 {Product} Product updated
 * @response 404 {Error} Product not found
 * @response 401 {AuthError} Unauthorized
 */
$app->put('/api/products/:id', function($req, $res) {
    $id = $req->params('id');
    $data = $req->json();

    if (!$productService->exists($id)) {
        return $res->status(404)->json(['error' => 'Product not found']);
    }

    $product = $productService->update($id, $data);

    return $res->json($product);
});

/**
 * @api DELETE /api/products/:id
 * @summary Delete product
 * @description Removes a product from the system
 * @param {integer} id.path.required - Product ID
 * @produces application/json
 * @security bearerAuth
 * @response 204 Product deleted successfully
 * @response 404 {Error} Product not found
 * @response 401 {AuthError} Unauthorized
 */
$app->delete('/api/products/:id', function($req, $res) {
    $id = $req->params('id');

    if (!$productService->exists($id)) {
        return $res->status(404)->json(['error' => 'Product not found']);
    }

    $productService->delete($id);

    return $res->status(204)->send();
});

// Generate and serve documentation
$docs = OpenApiExporter::export($app);

$app->get('/api/docs', function($req, $res) use ($docs) {
    return $res->json($docs);
});

$app->get('/api/docs/ui', function($req, $res) {
    $swaggerUi = '
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
        <script>
            SwaggerUIBundle({
                url: "/api/docs",
                dom_id: "#swagger-ui",
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.presets.standalone
                ]
            });
        </script>
    </body>
    </html>';

    return $res->html($swaggerUi);
});

$app->run();
```

## Advanced Configuration

### API Information
```php
$app = new Application([
    'openapi' => [
        'info' => [
            'title' => 'My API',
            'version' => '1.0.0',
            'description' => 'Products and categories API',
            'contact' => [
                'name' => 'Support',
                'email' => 'support@example.com'
            ],
            'license' => [
                'name' => 'MIT',
                'url' => 'https://opensource.org/licenses/MIT'
            ]
        ],
        'servers' => [
            [
                'url' => 'https://api.example.com',
                'description' => 'Production server'
            ],
            [
                'url' => 'https://staging.example.com',
                'description' => 'Staging server'
            ]
        ]
    ]
]);
```

### Data Schemas
```php
/**
 * @schema Product
 * @property {integer} id - Unique product ID
 * @property {string} name - Product name
 * @property {string} description - Detailed description
 * @property {number} price - Price in USD
 * @property {integer} categoryId - Category ID
 * @property {string} createdAt - Creation date (ISO 8601)
 * @property {string} updatedAt - Last update date
 */

/**
 * @schema ProductList
 * @property {array<Product>} data - Product list
 * @property {integer} total - Total products
 * @property {integer} page - Current page
 * @property {integer} limit - Items per page
 */

/**
 * @schema Error
 * @property {string} error - Error message
 * @property {integer} code - Error code
 */
```

### Authentication Setup
```php
$docs = OpenApiExporter::export($app, [
    'security' => [
        'bearerAuth' => [
            'type' => 'http',
            'scheme' => 'bearer',
            'bearerFormat' => 'JWT'
        ],
        'apiKey' => [
            'type' => 'apiKey',
            'in' => 'header',
            'name' => 'X-API-Key'
        ],
        'basicAuth' => [
            'type' => 'http',
            'scheme' => 'basic'
        ]
    ]
]);
```

## Best Practices

### 1. Organize with Tags
```php
/**
 * @api GET /api/users
 * @tags Users
 * @summary List users
 */

/**
 * @api GET /api/products
 * @tags Products
 * @summary List products
 */

/**
 * @api GET /api/orders
 * @tags Orders
 * @summary List orders
 */
```

### 2. API Versioning
```php
/**
 * @api GET /api/v1/users
 * @summary List users (v1)
 * @deprecated true
 */

/**
 * @api GET /api/v2/users
 * @summary List users (v2)
 * @description New version with improved pagination
 */
```

### 3. Consistent Error Responses
```php
/**
 * @schema ApiError
 * @property {string} error - Error message
 * @property {string} code - Error code
 * @property {string} timestamp - Error timestamp
 * @property {string} path - Request path
 */

/**
 * @response 400 {ApiError} Bad request
 * @response 401 {ApiError} Unauthorized
 * @response 403 {ApiError} Forbidden
 * @response 404 {ApiError} Not found
 * @response 500 {ApiError} Internal server error
 */
```

### 4. Request/Response Examples
```php
/**
 * @example request
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 * @example response 201
 * {
 *   "id": 1,
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "createdAt": "2023-12-07T10:30:00Z"
 * }
 */
```

## Custom Swagger UI

```php
$app->get('/docs', function($req, $res) {
    $customSwaggerUi = '
    <!DOCTYPE html>
    <html>
    <head>
        <title>My API - Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
        <style>
            .swagger-ui .topbar { background-color: #2d3748; }
            .swagger-ui .info .title { color: #2d3748; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
        <script>
            SwaggerUIBundle({
                url: "/api/docs.json",
                dom_id: "#swagger-ui",
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.presets.standalone
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        </script>
    </body>
    </html>';

    return $res->html($customSwaggerUi);
});
```

## Export Documentation

### Save to Files
```php
// Generate and save documentation
$docs = OpenApiExporter::export($app);
file_put_contents('docs/api-spec.json', json_encode($docs, JSON_PRETTY_PRINT));

// Generate static HTML
$html = OpenApiExporter::generateHtml($docs);
file_put_contents('docs/api-docs.html', $html);
```

### CI/CD Integration
```bash
# In your deployment script
php generate-docs.php
cp docs/api-spec.json public/
cp docs/api-docs.html public/docs.html
```

## Quality Checklist

### ✅ Complete Documentation
- [ ] All routes documented
- [ ] Parameters with types and validations
- [ ] Success and error responses
- [ ] Request/response examples
- [ ] Data schemas defined
- [ ] Authentication configured

### ✅ Best Practices
- [ ] Tags for grouping
- [ ] Clear and useful descriptions
- [ ] Correct HTTP status codes
- [ ] API versioning
- [ ] Documentation testing
- [ ] Automated deployment

---

**💡 Tip:** PivotPHP's OpenAPI documentation is generated automatically from your code comments. Keep them updated for accurate documentation!

**🔗 Next Steps:**
- [Security Guide]({{ site.baseurl }}/docs/security/) - Secure your APIs
- [Middleware]({{ site.baseurl }}/docs/middleware/) - Add authentication and validation
- [Testing]({{ site.baseurl }}/docs/testing/) - Test your documented APIs