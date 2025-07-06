---
layout: docs
title: Why HelixPHP?
permalink: /pt/docs/why-helix/
---
# HelixPHP 🧬

**O Microframework PHP Evolutivo**
*Rápido, sem opiniões, minimalista. Construído para performance, projetado para evoluir.*

[![Última Versão](https://img.shields.io/packagist/v/helixphp/helixphp-core.svg)](https://packagist.org/packages/helixphp/helixphp-core)
[![Status Build](https://img.shields.io/github/actions/workflow/status/helixphp/helixphp-core/tests.yml?branch=main)](https://github.com/helixphp/helixphp-core/actions)
[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Versão PHP](https://img.shields.io/badge/php-8.1%2B-777bb4.svg)](https://php.net)
[![Performance](https://img.shields.io/badge/performance-52M%2B%20ops%2Fsec-brightgreen.svg)](#performance)

---

## 🎯 Por que HelixPHP?

Depois de 6 anos construindo APIs de alta performance, sempre esbarrava na mesma parede com frameworks PHP—todos pareciam pesados, opinativos e restritivos. Vindo do Node.js, sentia falta da elegância do Express.js: simples, flexível e poderoso. Numa tarde, frustrado com mais um framework rígido me forçando a pensar do jeito dele, comecei a construir o que se tornaria o HelixPHP.

**O que começou como ExpressPHP virou algo maior.** Conforme o projeto evoluía, percebi que não era só sobre copiar o Express.js—era sobre criar um framework que realmente se adapta às suas necessidades. Como o DNA que se molda a diferentes ambientes, o HelixPHP se adapta ao seu projeto sem perder sua identidade central. Sem padrões forçados, sem recursos inchados, apenas PHP limpo que não atrapalha seu caminho.

O HelixPHP não te diz como construir sua API. Em vez disso, te dá as ferramentas para construí-la **do seu jeito**.

```php
<?php
require 'vendor/autoload.php';

use Helix\App;

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
composer require helixphp/helixphp-core
```

**Requisitos:**
- PHP 8.1 ou superior
- Composer

**Extensões Opcionais:**
```bash
# Para integração com banco de dados
composer require helixphp/helixphp-cycle-orm

# Para middleware adicional
composer require helixphp/middleware-collection
```

---

## ✨ Recursos Principais

### 🧬 **Arquitetura Evolutiva**
O HelixPHP se adapta às suas necessidades, não o contrário. Comece simples, escale complexo.

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
**52M+ operações/segundo.** Construído para velocidade desde o início.

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
Se você conhece Express.js, já conhece o HelixPHP.

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

O HelixPHP entrega performance excepcional sem sacrificar a experiência do desenvolvedor:

| Framework | Requests/seg | Uso Memória | Tempo Resposta |
|-----------|-------------|-------------|----------------|
| **HelixPHP** | **52.000+** | **8.2 MB** | **0.05ms** |
| Slim 4 | 12.000 | 12.5 MB | 0.12ms |
| Flight | 15.000 | 10.1 MB | 0.08ms |
| Laravel | 3.500 | 25.7 MB | 0.35ms |

*Benchmarks executados no PHP 8.2, single-threaded, resposta JSON simples. [Ver benchmarks completos →](https://helixphp.github.io/benchmarks)*

---

## 📚 Documentação

- **[Guia de Início Rápido](https://helixphp.github.io/website/docs/getting-started/)** - Configure e rode em 5 minutos
- **[Referência da API](https://helixphp.github.io/website/docs/api/)** - Documentação completa de métodos
- **[Galeria de Exemplos](https://helixphp.github.io/website/docs/examples/)** - Aplicações do mundo real
- **[Guia de Migração](https://helixphp.github.io/website/docs/migration/)** - Vindo de outros frameworks
- **[Guia de Performance](https://helixphp.github.io/website/docs/performance/)** - Melhores práticas de otimização

---

## 🛠️ Exemplos

### API REST com Banco de Dados
```php
<?php
use Helix\App;
use Helix\Database\DB;

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
use Helix\App;
use Helix\Middleware\{Auth, CORS, RateLimit};

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
use Helix\App;
use Helix\WebSocket\Server;

$app = new App();

// Rotas HTTP
$app->get('/health', fn() => ['status' => 'ok']);

// Servidor WebSocket
$ws = new Server($app);

$ws->on('connection', function($socket) {
    $socket->emit('welcome', ['mensagem' => 'Conectado ao HelixPHP']);
});

$ws->on('message', function($socket, $dados) {
    // Broadcast para todos os clientes conectados
    $socket->broadcast('update', $dados);
});

$app->listen(8000, $ws);
```

**[Mais Exemplos →](https://github.com/helixphp/examples)**

---

## 🌟 Ecossistema

### Pacotes Oficiais
- **[helixphp/helixphp-cycle-orm](https://github.com/helixphp/helixphp-cycle-orm)** - Integração com banco de dados ORM
- **[helixphp/middleware-collection](https://github.com/helixphp/middleware-collection)** - Middleware comum
- **[helixphp/jwt-auth](https://github.com/helixphp/jwt-auth)** - Autenticação JWT
- **[helixphp/cache](https://github.com/helixphp/cache)** - Cache multi-driver

### Pacotes da Comunidade
- **[helixphp/testing](https://packagist.org/packages/helixphp/testing)** - Utilitários de teste
- **[helixphp/swagger](https://packagist.org/packages/helixphp/swagger)** - Documentação OpenAPI
- **[helixphp/queue](https://packagist.org/packages/helixphp/queue)** - Processamento de jobs em background

**[Navegar por todos os pacotes →](https://packagist.org/packages/helixphp/)**

---

## 🤝 Comunidade

Junte-se à comunidade HelixPHP e ajude a moldar o futuro do desenvolvimento PHP:

- **[GitHub Discussions](https://github.com/helixphp/helixphp-core/discussions)** - Perguntas, ideias e anúncios
- **[Servidor Discord](https://discord.gg/helixphp)** - Chat da comunidade em tempo real
- **[Twitter](https://twitter.com/helixphp)** - Atualizações e novidades
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/helixphp)** - Q&A técnico

### Contribuindo

O HelixPHP existe porque a comunidade PHP merece algo melhor. Seja corrigindo typos, reportando bugs ou propondo novos recursos, você está ajudando a tornar essa visão realidade.

```bash
# Faça fork e clone
git clone https://github.com/helixphp/helixphp-core.git
cd helixphp-core

# Instale dependências
composer install

# Execute testes
composer test

# Faça suas mudanças e submeta um PR!
```

**[Diretrizes de Contribuição →](CONTRIBUTING.md)**

---

## 📄 Licença

O HelixPHP é um software open-source licenciado sob a [licença MIT](LICENSE).

---

## 👨‍💻 Sobre o Autor

**Caio Alberto Fernandes** - 6 anos de experiência em desenvolvimento de APIs backend
*"Construindo ferramentas que se adaptam aos desenvolvedores, não o contrário."*

- **GitHub:** [@CAFernandes](https://github.com/CAFernandes)
- **LinkedIn:** [caio-alberto-fernandes](https://www.linkedin.com/in/caio-alberto-fernandes/)
- **HelixPHP Org:** [github.com/helixphp](https://github.com/helixphp)

---

## 🔗 Links

- **[Site Oficial](https://helixphp.github.io/website/)** - Site oficial do HelixPHP
- **[Documentação](https://helixphp.github.io/website/docs/)** - Documentação completa
- **[Packagist](https://packagist.org/packages/helixphp/helixphp-core)** - Pacote Composer
- **[Benchmarks](https://helixphp.github.io/benchmarks/)** - Comparações de performance

---

## Join the Evolution

HelixPHP isn't just another framework. It's a return to simplicity, performance, and developer happiness. Whether you're building a simple API or a complex microservices architecture, HelixPHP adapts to your needs.

Ready to evolve your PHP development?

[Get Started Now](/docs/installation/) | [View on GitHub](https://github.com/helixphp)

<div align="center">

**⭐ Dê uma estrela no GitHub — isso ajuda!**

**Feito com ❤️ pela comunidade PHP, para a comunidade PHP.**

*HelixPHP: O framework que evolui com seu projeto.*

</div>
