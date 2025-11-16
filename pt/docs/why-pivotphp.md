---
layout: docs
title: Por que PivotPHP?
permalink: /pt/docs/why-pivotphp/
lang: pt
---
**O Microframework PHP Evolutivo**
*Rápido, sem opiniões, minimalista. Construído para performance, projetado para evoluir.*

[![Última Versão](https://img.shields.io/packagist/v/pivotphp/core.svg)](https://packagist.org/packages/pivotphp/pivotphp-core)
[![Status Build](https://img.shields.io/github/actions/workflow/status/pivotphp/pivotphp-core/tests.yml?branch=main)](https://github.com/pivotphp/pivotphp-core/actions)
[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Versão PHP](https://img.shields.io/badge/php-8.1%2B-777bb4.svg)](https://php.net)
[![Performance](https://img.shields.io/badge/performance-6.2K%20req%2Fsec%20Docker-brightgreen.svg)](#performance)

---

## 🎯 Por que PivotPHP?

Depois de 6 anos construindo APIs de alta performance, sempre esbarrava na mesma parede com frameworks PHP—todos pareciam pesados, opinativos e restritivos. Vindo do Node.js, sentia falta da elegância do Express.js: simples, flexível e poderoso. Numa tarde, frustrado com mais um framework rígido me forçando a pensar do jeito dele, comecei a construir o que se tornaria o PivotPHP.

**O que começou como ExpressPHP virou algo maior.** Conforme o projeto evoluía, percebi que não era só sobre copiar o Express.js—era sobre criar um framework que realmente se adapta às suas necessidades. Como o DNA que se molda a diferentes ambientes, o PivotPHP se adapta ao seu projeto sem perder sua identidade central. Sem padrões forçados, sem recursos inchados, apenas PHP limpo que não atrapalha seu caminho.

O PivotPHP não te diz como construir sua API. Em vez disso, te dá as ferramentas para construí-la **do seu jeito**.

```php
<?php
require 'vendor/autoload.php';

use PivotPHP\App;

$app = new App();

// Rota simples
$app->get('/ola/:nome', function($req, $res) {
    $res->json(['mensagem' => "Olá, {$req->params->nome}!"]);
});

// Middleware que simplesmente funciona
$app->use('/api/*', function($req, $res, $next) {
    $res->header('Content-Type', 'application/json');
    $next();
});

// Recurso RESTful
$app->get('/usuarios/:id', function($req, $res) {
    $usuario = Usuario::find($req->params->id);
    $res->json($usuario);
});

$app->listen(8000);
```

**⚡ 2 minutos. É tudo que você precisa para construir sua primeira API pronta para produção.**

---

## 🚀 Instalação

```bash
composer require pivotphp/pivotphp-core
```

**Requisitos:**
- PHP 8.1 ou superior
- Composer

**Extensões Opcionais:**
```bash
# Para integração com banco de dados
composer require pivotphp/pivotphp-cycle-orm

# Para middleware adicional
composer require pivotphp/middleware-collection
```

---

## ✨ Recursos Principais

### 🧬 **Arquitetura Evolutiva**
O PivotPHP se adapta às suas necessidades, não o contrário. Comece simples, escale complexo.

```php
// Comece simples
$app->get('/', fn() => 'Olá Mundo');

// Evolua naturalmente
$app->group('/api/v1', function($group) {
    $group->middleware([AuthMiddleware::class, RateLimitMiddleware::class]);
    $group->resource('/usuarios', UsuarioController::class);
});
```

### ⚡ **Performance Blazing**
**6.227 req/segundo validado em Docker.** Performance competitiva com excelente experiência do desenvolvedor.

```php
// Roteamento otimizado com cache zero-config
$app->get('/rapido/:id/dados/:tipo', function($req, $res) {
    // Correspondência de rotas auto-cacheada
    // Extração de parâmetros type-safe
    // Tratamento de resposta memory-efficient
    $res->json($dados);
});
```

### 🎛️ **Sintaxe Inspirada no Express.js**
Se você conhece Express.js, já conhece o PivotPHP.

```php
// Padrão de middleware familiar
$app->use(function($req, $res, $next) {
    $req->startTime = microtime(true);
    $next();

    $duracao = microtime(true) - $req->startTime;
    $res->header('X-Response-Time', $duracao . 'ms');
});
```

### 🛡️ **Segurança por Design**
Segurança pronta para produção sem sobrecarga de configuração.

```php
// Auto-sanitização e validação
$app->post('/usuarios', function($req, $res) {
    $dados = $req->validate([
        'email' => 'required|email',
        'nome' => 'required|string|max:100'
    ]);

    // $dados é automaticamente sanitizado e validado
    $usuario = Usuario::create($dados);
    $res->json($usuario, 201);
});
```

### 🔧 **Zero Configuração**
Funciona perfeitamente fora da caixa, configurável quando você precisar.

```php
// Nenhum arquivo de config necessário
$app = new App();

// Mas flexível quando você precisa de controle
$app = new App([
    'debug' => true,
    'cors' => ['origin' => 'localhost:3000'],
    'cache' => ['driver' => 'redis', 'host' => 'localhost']
]);
```

---

## 📊 Performance

O PivotPHP entrega performance competitiva (6.227 req/s Docker validado) sem sacrificar a experiência do desenvolvedor:

| Framework | Req/seg (Docker) | Uso Memória | Tempo Resposta |
|-----------|------------------|-------------|----------------|
| **Slim 4** | **6.881** | ~12MB | **0.29ms** |
| **Lumen** | **6.322** | ~15MB | **0.31ms** |
| **PivotPHP** | **6.227** | **1.61MB** | **0.32ms** |
| **Flight** | **3.179** | ~8MB | **10ms** |

*Benchmarks executados no PHP 8.2, single-threaded, resposta JSON simples. [Ver benchmarks completos →](https://pivotphp.github.io/benchmarks)*

---

## 📚 Documentação

- **[Guia de Início Rápido](https://pivotphp.github.io/website/docs/getting-started/)** - Configure e rode em 5 minutos
- **[Referência da API](https://pivotphp.github.io/website/docs/api/)** - Documentação completa de métodos
- **[Galeria de Exemplos](https://pivotphp.github.io/website/docs/examples/)** - Aplicações do mundo real
- **[Guia de Migração](https://pivotphp.github.io/website/docs/migration/)** - Vindo de outros frameworks
- **[Guia de Performance](https://pivotphp.github.io/website/docs/performance/)** - Melhores práticas de otimização

---

## 🛠️ Exemplos

### API REST com Banco de Dados
```php
<?php
use PivotPHP\App;
use PivotPHP\Database\DB;

$app = new App();

// Auto-conecta banco de dados
DB::connect('mysql://user:pass@localhost/meudb');

$app->get('/usuarios', function($req, $res) {
    $usuarios = DB::table('usuarios')->get();
    $res->json($usuarios);
});

$app->post('/usuarios', function($req, $res) {
    $usuario = DB::table('usuarios')->create($req->body);
    $res->json($usuario, 201);
});

$app->listen(8000);
```

### Microserviço com Autenticação
```php
<?php
use PivotPHP\App;
use PivotPHP\Middleware\{Auth, CORS, RateLimit};

$app = new App();

// Middleware global
$app->use(CORS::allow('*'));
$app->use(RateLimit::perMinute(100));

// Rotas protegidas
$app->group('/api', function($group) {
    $group->middleware(Auth::jwt());

    $group->get('/perfil', function($req, $res) {
        $res->json($req->user);
    });

    $group->post('/posts', function($req, $res) {
        $post = Post::create([
            'user_id' => $req->user->id,
            'conteudo' => $req->body->conteudo
        ]);
        $res->json($post, 201);
    });
});

$app->listen(8000);
```

### API Real-time com WebSockets
```php
<?php
use PivotPHP\App;
use PivotPHP\WebSocket\Server;

$app = new App();

// Rotas HTTP
$app->get('/health', fn() => ['status' => 'ok']);

// Servidor WebSocket
$ws = new Server($app);

$ws->on('connection', function($socket) {
    $socket->emit('welcome', ['mensagem' => 'Conectado ao PivotPHP']);
});

$ws->on('message', function($socket, $dados) {
    // Broadcast para todos os clientes conectados
    $socket->broadcast('update', $dados);
});

$app->listen(8000, $ws);
```

**[Mais Exemplos →](https://github.com/pivotphp/examples)**

---

## 🌟 Ecossistema

### Pacotes Oficiais
- **[pivotphp/pivotphp-cycle-orm](https://github.com/pivotphp/pivotphp-cycle-orm)** - Integração com banco de dados ORM
- **[pivotphp/middleware-collection](https://github.com/pivotphp/middleware-collection)** - Middleware comum
- **[pivotphp/jwt-auth](https://github.com/pivotphp/jwt-auth)** - Autenticação JWT
- **[pivotphp/cache](https://github.com/pivotphp/cache)** - Cache multi-driver

### Pacotes da Comunidade
- **[pivotphp/testing](https://packagist.org/packages/pivotphp/testing)** - Utilitários de teste
- **[pivotphp/swagger](https://packagist.org/packages/pivotphp/swagger)** - Documentação OpenAPI
- **[pivotphp/queue](https://packagist.org/packages/pivotphp/queue)** - Processamento de jobs em background

**[Navegar por todos os pacotes →](https://packagist.org/packages/pivotphp/)**

---

## 🤝 Comunidade

Junte-se à comunidade PivotPHP e ajude a moldar o futuro do desenvolvimento PHP:

- **[GitHub Discussions](https://github.com/pivotphp/pivotphp-core/discussions)** - Perguntas, ideias e anúncios

### Contribuindo

O PivotPHP existe porque a comunidade PHP merece algo melhor. Seja corrigindo typos, reportando bugs ou propondo novos recursos, você está ajudando a tornar essa visão realidade.

```bash
# Faça fork e clone
git clone https://github.com/pivotphp/pivotphp-core.git
cd pivotphp-core

# Instale dependências
composer install

# Execute testes
composer test

# Faça suas mudanças e submeta um PR!
```

**[Diretrizes de Contribuição →](CONTRIBUTING.md)**

---

## 📄 Licença

O PivotPHP é um software open-source licenciado sob a [licença MIT](LICENSE).

---

## 👨‍💻 Sobre o Autor

**Caio Alberto Fernandes** - 6 anos de experiência em desenvolvimento de APIs backend
*"Construindo ferramentas que se adaptam aos desenvolvedores, não o contrário."*

- **GitHub:** [@CAFernandes](https://github.com/CAFernandes)
- **LinkedIn:** [caio-alberto-fernandes](https://www.linkedin.com/in/caio-alberto-fernandes/)
- **PivotPHP Org:** [github.com/pivotphp](https://github.com/pivotphp)

---

## 🔗 Links

- **[Site Oficial](https://pivotphp.github.io/website/)** - Site oficial do PivotPHP
- **[Documentação](https://pivotphp.github.io/website/docs/)** - Documentação completa
- **[Packagist](https://packagist.org/packages/pivotphp/pivotphp-core)** - Pacote Composer
- **[Benchmarks](https://pivotphp.github.io/benchmarks/)** - Comparações de performance

---

## Join the Evolution

PivotPHP isn't just another framework. It's a return to simplicity, performance, and developer happiness. Whether you're building a simple API or a complex microservices architecture, PivotPHP adapts to your needs.

Ready to evolve your PHP development?

[Get Started Now](/docs/installation/) | [View on GitHub](https://github.com/pivotphp)

<div align="center">

**⭐ Dê uma estrela no GitHub — isso ajuda!**

**Feito com ❤️ pela comunidade PHP, para a comunidade PHP.**

*PivotPHP: O framework que evolui com seu projeto.*

</div>
