---
layout: default
title: Code Examples
description: Real-world examples showcasing PivotPHP's capabilities
---

# Code Examples

Learn by example with these real-world PivotPHP applications and snippets.

## Quick Examples

### 🚀 Basic API

```php
use PivotPHP\Core\Core\Application;

$app = new Application();

// Simple REST API
$app->get('/api/status', function($req, $res) {
    return $res->json([
        'status' => 'online',
        'timestamp' => time(),
        'version' => '1.0.0'
    ]);
});

$app->run();
```

### 🔐 Authenticated Route

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Security\Middleware\AuthMiddleware;

$app = new Application();

// Protected endpoint
$app->get('/api/profile', 
    new AuthMiddleware(),
    function($req, $res) {
        $user = $req->getAttribute('user');
        return $res->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email
        ]);
    }
);

$app->run();
```

### 📊 CRUD Operations

```php
use PivotPHP\Core\Core\Application;

$app = new Application();

// Create
$app->post('/api/users', function($req, $res) {
    $data = $req->getParsedBody();
    // Validate and create user
    $user = User::create($data);
    return $res->status(201)->json($user);
});

// Read
$app->get('/api/users/:id', function($req, $res) {
    $user = User::find($req->param('id'));
    if (!$user) {
        return $res->status(404)->json(['error' => 'User not found']);
    }
    return $res->json($user);
});

// Update
$app->put('/api/users/:id', function($req, $res) {
    $user = User::find($req->param('id'));
    if (!$user) {
        return $res->status(404)->json(['error' => 'User not found']);
    }
    $user->update($req->getParsedBody());
    return $res->json($user);
});

// Delete
$app->delete('/api/users/:id', function($req, $res) {
    $user = User::find($req->param('id'));
    if (!$user) {
        return $res->status(404)->json(['error' => 'User not found']);
    }
    $user->delete();
    return $res->status(204)->send();
});

$app->run();
```

## Full Applications

### 📝 Blog API

A complete blog API with posts, comments, and authentication.

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Security\Middleware\AuthMiddleware;
use PivotPHP\Core\Security\Middleware\RateLimitMiddleware;

$app = new Application();

// Middleware
$auth = new AuthMiddleware();
$rateLimit = new RateLimitMiddleware(['max' => 100, 'window' => 3600]);

// Public routes
$app->get('/api/posts', $rateLimit, function($req, $res) {
    $posts = Post::with('author', 'comments')
        ->orderBy('created_at', 'desc')
        ->paginate(10);
    return $res->json($posts);
});

$app->get('/api/posts/:slug', function($req, $res) {
    $post = Post::where('slug', $req->param('slug'))
        ->with('author', 'comments.author')
        ->first();
    
    if (!$post) {
        return $res->status(404)->json(['error' => 'Post not found']);
    }
    
    return $res->json($post);
});

// Protected routes
$app->group('/api/admin', function($app) use ($auth) {
    // Create post
    $app->post('/posts', $auth, function($req, $res) {
        $data = $req->getParsedBody();
        $data['author_id'] = $req->getAttribute('user')->id;
        
        $post = Post::create($data);
        return $res->status(201)->json($post);
    });
    
    // Update post
    $app->put('/posts/:id', $auth, function($req, $res) {
        $post = Post::find($req->param('id'));
        
        if (!$post) {
            return $res->status(404)->json(['error' => 'Post not found']);
        }
        
        // Check ownership
        if ($post->author_id !== $req->getAttribute('user')->id) {
            return $res->status(403)->json(['error' => 'Forbidden']);
        }
        
        $post->update($req->getParsedBody());
        return $res->json($post);
    });
});

$app->run();
```

### 🛒 E-commerce Microservice

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\Core\Events\EventDispatcher;

$app = new Application();
$events = $app->get(EventDispatcher::class);

// Product catalog
$app->get('/api/products', function($req, $res) {
    $filters = $req->getQueryParams();
    
    $query = Product::query();
    
    if (isset($filters['category'])) {
        $query->where('category', $filters['category']);
    }
    
    if (isset($filters['min_price'])) {
        $query->where('price', '>=', $filters['min_price']);
    }
    
    $products = $query->paginate(20);
    return $res->json($products);
});

// Shopping cart
$app->post('/api/cart/items', function($req, $res) use ($events) {
    $data = $req->getParsedBody();
    
    $product = Product::find($data['product_id']);
    if (!$product || $product->stock < $data['quantity']) {
        return $res->status(400)->json(['error' => 'Product not available']);
    }
    
    $cartItem = CartItem::create([
        'session_id' => session_id(),
        'product_id' => $data['product_id'],
        'quantity' => $data['quantity'],
        'price' => $product->price
    ]);
    
    // Emit event
    $events->dispatch('cart.item.added', $cartItem);
    
    return $res->status(201)->json($cartItem);
});

// Checkout
$app->post('/api/checkout', function($req, $res) use ($events) {
    $items = CartItem::where('session_id', session_id())->get();
    
    if ($items->isEmpty()) {
        return $res->status(400)->json(['error' => 'Cart is empty']);
    }
    
    // Create order
    $order = Order::create([
        'total' => $items->sum(fn($item) => $item->price * $item->quantity),
        'status' => 'pending'
    ]);
    
    // Add items to order
    foreach ($items as $item) {
        $order->items()->create($item->toArray());
    }
    
    // Clear cart
    CartItem::where('session_id', session_id())->delete();
    
    // Emit event
    $events->dispatch('order.created', $order);
    
    return $res->json($order);
});

$app->run();
```

## Advanced Examples

### 🔄 WebSocket Integration

```php
use PivotPHP\Core\Core\Application;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

$app = new Application();

// Regular HTTP routes
$app->get('/chat', function($req, $res) {
    return $res->html(file_get_contents('chat.html'));
});

// WebSocket server
class ChatServer implements MessageComponentInterface {
    protected $clients;
    
    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }
    
    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
    }
    
    public function onMessage(ConnectionInterface $from, $msg) {
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
    }
    
    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
    }
    
    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
    }
}

// Start WebSocket server on different port
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new ChatServer()
        )
    ),
    8080
);

$server->run();
```

### 🔐 JWT Authentication

```php
use PivotPHP\Core\Core\Application;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$app = new Application();

$app->post('/api/auth/login', function($req, $res) {
    $credentials = $req->getParsedBody();
    
    $user = User::where('email', $credentials['email'])->first();
    
    if (!$user || !password_verify($credentials['password'], $user->password)) {
        return $res->status(401)->json(['error' => 'Invalid credentials']);
    }
    
    $payload = [
        'iss' => 'pivotphp-api',
        'sub' => $user->id,
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24) // 24 hours
    ];
    
    $token = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
    
    return $res->json([
        'token' => $token,
        'user' => $user
    ]);
});

// JWT Middleware
$jwtAuth = function($req, $res, $next) {
    $auth = $req->getHeader('Authorization')[0] ?? '';
    
    if (!preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
        return $res->status(401)->json(['error' => 'No token provided']);
    }
    
    try {
        $decoded = JWT::decode($matches[1], new Key($_ENV['JWT_SECRET'], 'HS256'));
        $req = $req->withAttribute('user_id', $decoded->sub);
        return $next($req, $res);
    } catch (\Exception $e) {
        return $res->status(401)->json(['error' => 'Invalid token']);
    }
};

// Protected route
$app->get('/api/me', $jwtAuth, function($req, $res) {
    $user = User::find($req->getAttribute('user_id'));
    return $res->json($user);
});

$app->run();
```

## 🎯 Next Steps

- Check out the [full documentation](/docs/)
- Explore the [API reference](/docs/api/)
- Join our [community](https://github.com/pivotphp/core/discussions)
- Star us on [GitHub](https://github.com/pivotphp/core)

## 📦 Example Projects

Complete example applications are available on GitHub:

- [pivotphp-example-blog](https://github.com/pivotphp/example-blog) - Blog API with authentication
- [pivotphp-example-shop](https://github.com/pivotphp/example-shop) - E-commerce microservice
- [pivotphp-example-chat](https://github.com/pivotphp/example-chat) - Real-time chat application
- [pivotphp-example-api](https://github.com/pivotphp/example-api) - RESTful API starter