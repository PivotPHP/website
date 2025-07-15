---
layout: docs
title: Documentação de API com OpenAPI/Swagger
description: Gere documentação interativa de API automaticamente com OpenAPI 3.0 e Swagger UI
lang: pt
---

O PivotPHP inclui um poderoso sistema de documentação **OpenAPI/Swagger** que gera automaticamente documentação interativa de API a partir dos comentários do seu código. Construa documentação profissional de API com apenas algumas anotações.

## Início Rápido

```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Utils\OpenApiExporter;

$app = new Application();

/**
 * @api GET /users/:id
 * @summary Buscar usuário por ID
 * @description Retorna dados completos do usuário
 * @param {integer} id.path.required - ID do usuário
 * @produces application/json
 * @response 200 {User} Dados do usuário
 * @response 404 {Error} Usuário não encontrado
 */
$app->get('/users/:id', function($req, $res) {
    $userId = $req->params('id');
    $user = $userService->findById($userId);

    if (!$user) {
        return $res->status(404)->json(['error' => 'Usuário não encontrado']);
    }

    return $res->json($user);
});

// Gerar documentação OpenAPI
$docs = OpenApiExporter::export($app);

// Servir Swagger UI
$app->get('/docs', function($req, $res) use ($docs) {
    return $res->json($docs);
});

$app->run();
```

## Anotações OpenAPI

### @api - Definir Rota
```php
/**
 * @api POST /api/products
 * @summary Criar novo produto
 * @description Cria um novo produto no sistema
 */
```

### @param - Parâmetros
```php
/**
 * @param {string} name.body.required - Nome do produto
 * @param {number} price.body.required - Preço do produto
 * @param {integer} categoryId.path.required - ID da categoria
 * @param {string} filter.query.optional - Filtro opcional
 */
```

**Tipos de parâmetros:**
- `path` - Parâmetros na URL (`/users/:id`)
- `query` - Query strings (`?filter=value`)
- `body` - Corpo da requisição
- `header` - Headers HTTP

### @response - Respostas
```php
/**
 * @response 200 {Product} Produto criado com sucesso
 * @response 400 {ValidationError} Dados inválidos
 * @response 401 {AuthError} Não autorizado
 * @response 500 {Error} Erro interno do servidor
 */
```

### @security - Autenticação
```php
/**
 * @security bearerAuth
 * @security apiKey
 * @security basicAuth
 */
```

## Exemplo CRUD Completo

```php
<?php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Utils\OpenApiExporter;

$app = new Application();

/**
 * @api GET /api/products
 * @summary Listar produtos
 * @description Retorna lista paginada de produtos com filtros
 * @param {integer} page.query.optional - Número da página (padrão: 1)
 * @param {integer} limit.query.optional - Itens por página (padrão: 10)
 * @param {string} category.query.optional - Filtrar por categoria
 * @param {string} search.query.optional - Buscar por nome
 * @produces application/json
 * @response 200 {ProductList} Lista de produtos
 * @response 400 {Error} Parâmetros inválidos
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
 * @summary Criar novo produto
 * @description Cria um novo produto no sistema
 * @param {string} name.body.required - Nome do produto
 * @param {string} description.body.optional - Descrição
 * @param {number} price.body.required - Preço (maior que 0)
 * @param {integer} categoryId.body.required - ID da categoria
 * @param {array} tags.body.optional - Tags do produto
 * @produces application/json
 * @security bearerAuth
 * @response 201 {Product} Produto criado
 * @response 400 {ValidationError} Dados inválidos
 * @response 401 {AuthError} Não autorizado
 */
$app->post('/api/products', function($req, $res) {
    $data = $req->json();

    // Validação
    if (!$data['name'] || !$data['price'] || !$data['categoryId']) {
        return $res->status(400)->json([
            'error' => 'Campos obrigatórios: name, price, categoryId'
        ]);
    }

    $product = $productService->create($data);

    return $res->status(201)->json($product);
});

/**
 * @api PUT /api/products/:id
 * @summary Atualizar produto
 * @description Atualiza dados de um produto existente
 * @param {integer} id.path.required - ID do produto
 * @param {string} name.body.optional - Nome do produto
 * @param {string} description.body.optional - Descrição
 * @param {number} price.body.optional - Preço
 * @param {integer} categoryId.body.optional - ID da categoria
 * @produces application/json
 * @security bearerAuth
 * @response 200 {Product} Produto atualizado
 * @response 404 {Error} Produto não encontrado
 * @response 401 {AuthError} Não autorizado
 */
$app->put('/api/products/:id', function($req, $res) {
    $id = $req->params('id');
    $data = $req->json();

    if (!$productService->exists($id)) {
        return $res->status(404)->json(['error' => 'Produto não encontrado']);
    }

    $product = $productService->update($id, $data);

    return $res->json($product);
});

/**
 * @api DELETE /api/products/:id
 * @summary Deletar produto
 * @description Remove um produto do sistema
 * @param {integer} id.path.required - ID do produto
 * @produces application/json
 * @security bearerAuth
 * @response 204 Produto deletado com sucesso
 * @response 404 {Error} Produto não encontrado
 * @response 401 {AuthError} Não autorizado
 */
$app->delete('/api/products/:id', function($req, $res) {
    $id = $req->params('id');

    if (!$productService->exists($id)) {
        return $res->status(404)->json(['error' => 'Produto não encontrado']);
    }

    $productService->delete($id);

    return $res->status(204)->send();
});

// Gerar e servir documentação
$docs = OpenApiExporter::export($app);

$app->get('/api/docs', function($req, $res) use ($docs) {
    return $res->json($docs);
});

$app->get('/api/docs/ui', function($req, $res) {
    $swaggerUi = '
    <!DOCTYPE html>
    <html>
    <head>
        <title>Documentação da API</title>
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

## Configuração Avançada

### Informações da API
```php
$app = new Application([
    'openapi' => [
        'info' => [
            'title' => 'Minha API',
            'version' => '1.0.0',
            'description' => 'API de produtos e categorias',
            'contact' => [
                'name' => 'Suporte',
                'email' => 'suporte@exemplo.com'
            ],
            'license' => [
                'name' => 'MIT',
                'url' => 'https://opensource.org/licenses/MIT'
            ]
        ],
        'servers' => [
            [
                'url' => 'https://api.exemplo.com',
                'description' => 'Servidor de produção'
            ],
            [
                'url' => 'https://staging.exemplo.com',
                'description' => 'Servidor de teste'
            ]
        ]
    ]
]);
```

### Esquemas de Dados
```php
/**
 * @schema Product
 * @property {integer} id - ID único do produto
 * @property {string} name - Nome do produto
 * @property {string} description - Descrição detalhada
 * @property {number} price - Preço em reais
 * @property {integer} categoryId - ID da categoria
 * @property {string} createdAt - Data de criação (ISO 8601)
 * @property {string} updatedAt - Data da última atualização
 */

/**
 * @schema ProductList
 * @property {array<Product>} data - Lista de produtos
 * @property {integer} total - Total de produtos
 * @property {integer} page - Página atual
 * @property {integer} limit - Itens por página
 */

/**
 * @schema Error
 * @property {string} error - Mensagem de erro
 * @property {integer} code - Código do erro
 */
```

### Configurar Autenticação
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

## Boas Práticas

### 1. Organizar com Tags
```php
/**
 * @api GET /api/users
 * @tags Users
 * @summary Listar usuários
 */

/**
 * @api GET /api/products
 * @tags Products
 * @summary Listar produtos
 */

/**
 * @api GET /api/orders
 * @tags Orders
 * @summary Listar pedidos
 */
```

### 2. Versionamento da API
```php
/**
 * @api GET /api/v1/users
 * @summary Listar usuários (v1)
 * @deprecated true
 */

/**
 * @api GET /api/v2/users
 * @summary Listar usuários (v2)
 * @description Nova versão com paginação melhorada
 */
```

### 3. Respostas de Erro Consistentes
```php
/**
 * @schema ApiError
 * @property {string} error - Mensagem de erro
 * @property {string} code - Código do erro
 * @property {string} timestamp - Timestamp do erro
 * @property {string} path - Caminho da requisição
 */

/**
 * @response 400 {ApiError} Requisição inválida
 * @response 401 {ApiError} Não autorizado
 * @response 403 {ApiError} Acesso negado
 * @response 404 {ApiError} Recurso não encontrado
 * @response 500 {ApiError} Erro interno do servidor
 */
```

### 4. Exemplos de Requisição/Resposta
```php
/**
 * @example request
 * {
 *   "name": "João Silva",
 *   "email": "joao@exemplo.com",
 *   "password": "senha123"
 * }
 * @example response 201
 * {
 *   "id": 1,
 *   "name": "João Silva",
 *   "email": "joao@exemplo.com",
 *   "createdAt": "2023-12-07T10:30:00Z"
 * }
 */
```

## Swagger UI Customizado

```php
$app->get('/docs', function($req, $res) {
    $customSwaggerUi = '
    <!DOCTYPE html>
    <html>
    <head>
        <title>Minha API - Documentação</title>
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

## Exportar Documentação

### Salvar em Arquivos
```php
// Gerar e salvar documentação
$docs = OpenApiExporter::export($app);
file_put_contents('docs/api-spec.json', json_encode($docs, JSON_PRETTY_PRINT));

// Gerar HTML estático
$html = OpenApiExporter::generateHtml($docs);
file_put_contents('docs/api-docs.html', $html);
```

### Integração CI/CD
```bash
# No seu script de deploy
php generate-docs.php
cp docs/api-spec.json public/
cp docs/api-docs.html public/docs.html
```

## Checklist de Qualidade

### ✅ Documentação Completa
- [ ] Todas as rotas documentadas
- [ ] Parâmetros com tipos e validações
- [ ] Respostas de sucesso e erro
- [ ] Exemplos de requisição/resposta
- [ ] Esquemas de dados definidos
- [ ] Autenticação configurada

### ✅ Boas Práticas
- [ ] Tags para agrupamento
- [ ] Descrições claras e úteis
- [ ] Códigos de status HTTP corretos
- [ ] Versionamento da API
- [ ] Testes da documentação
- [ ] Deploy automatizado

---

**💡 Dica:** A documentação OpenAPI do PivotPHP é gerada automaticamente a partir dos comentários do seu código. Mantenha-os sempre atualizados para ter uma documentação precisa!

**🔗 Próximos Passos:**
- [Guia de Segurança]({{ '/pt/docs/security/' | relative_url }}) - Proteja suas APIs
- [Middleware]({{ '/pt/docs/middleware/' | relative_url }}) - Adicione autenticação e validação
- [Testes]({{ '/pt/docs/testing/' | relative_url }}) - Teste suas APIs documentadas