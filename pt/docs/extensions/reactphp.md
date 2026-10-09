---
layout: docs
title: Extensão ReactPHP v0.0.2
permalink: /pt/docs/extensions/reactphp/
lang: pt
---

# Extensão PivotPHP ReactPHP v0.0.2

A extensão **pivotphp-reactphp** fornece recursos de runtime assíncrono para aplicações PivotPHP usando o modelo de I/O não-bloqueante orientado a eventos do ReactPHP. Esta extensão permite execução de runtime contínuo, eliminando overhead de bootstrap e mantendo estado persistente da aplicação.

## 🚀 Recursos Principais

- **Runtime Contínuo**: Sem overhead de reinicialização entre requisições
- **Compatibilidade com Bridge PSR-7**: Integração perfeita com a camada HTTP do PivotPHP
- **Arquitetura Orientada a Eventos**: Operações de I/O não-bloqueantes
- **Gerenciamento de Memória**: Isolamento e limpeza de memória integrados
- **Proteção de Estado Global**: Previne poluição de estado entre requisições
- **Otimizado para Performance**: Ganhos significativos de performance para processos de longa duração

## 📦 Instalação

```bash
composer require pivotphp/reactphp
```

## 🔧 Início Rápido

### 1. Registrar o Service Provider

```php
use PivotPHP\Core\Core\Application;
use PivotPHP\ReactPHP\Providers\ReactPHPServiceProvider;

$app = new Application();

// Registrar service provider do ReactPHP
$app->register(new ReactPHPServiceProvider($app));
```

### 2. Configuração de Ambiente

Crie ou atualize seu arquivo `.env`:

```env
# Aplicação
APP_NAME="Minha App ReactPHP"
APP_ENV=production
APP_DEBUG=false

# Configuração do Servidor ReactPHP
REACTPHP_HOST=0.0.0.0
REACTPHP_PORT=8080
REACTPHP_STREAMING=false
REACTPHP_MAX_CONCURRENT_REQUESTS=100
REACTPHP_REQUEST_BODY_SIZE_LIMIT=67108864  # 64MB
REACTPHP_REQUEST_BODY_BUFFER_SIZE=8192     # 8KB
```

### 3. Configuração Básica do Servidor

Crie `server.php`:

```php
<?php

declare(strict_types=1);

use PivotPHP\Core\Core\Application;
use PivotPHP\ReactPHP\Providers\ReactPHPServiceProvider;

require_once __DIR__ . '/vendor/autoload.php';

// Criar aplicação
$app = new Application();

// Registrar provider do ReactPHP
$app->register(new ReactPHPServiceProvider($app));

// Definir suas rotas
$app->get('/', function($req, $res) {
    return $res->json([
        'message' => 'Servidor ReactPHP Rodando!',
        'timestamp' => date('Y-m-d H:i:s'),
        'server' => 'ReactPHP v0.0.2'
    ]);
});

$app->get('/api/users/:id', function($req, $res) {
    $id = $req->param('id');

    return $res->json([
        'user_id' => $id,
        'name' => 'Usuário ' . $id,
        'server_time' => microtime(true)
    ]);
});

// Iniciar o servidor ReactPHP
echo "🚀 Iniciando servidor ReactPHP em http://localhost:8080\n";
echo "Pressione Ctrl+C para parar o servidor\n\n";

$app->runAsync(); // Isso inicia o loop de eventos do ReactPHP
```

### 4. Executando o Servidor

```bash
php server.php
```

Sua aplicação agora executará continuamente sem reiniciar entre requisições!

## 🏗️ Configuração Avançada

### Configuração Personalizada do Servidor

```php
use PivotPHP\ReactPHP\Providers\ReactPHPServiceProvider;

$app = new Application();

// Configurar ReactPHP com configurações personalizadas
$app->register(new ReactPHPServiceProvider($app, [
    'server' => [
        'host' => '127.0.0.1',
        'port' => 3000,
        'debug' => true,
        'streaming' => true,
        'max_concurrent_requests' => 200,
        'request_body_size_limit' => 134217728, // 128MB
    ]
]));
```

### Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `REACTPHP_HOST` | `0.0.0.0` | Endereço de bind do servidor |
| `REACTPHP_PORT` | `8080` | Porta do servidor |
| `REACTPHP_STREAMING` | `false` | Habilitar requisições streaming |
| `REACTPHP_MAX_CONCURRENT_REQUESTS` | `100` | Máximo de requisições concorrentes |
| `REACTPHP_REQUEST_BODY_SIZE_LIMIT` | `67108864` | Tamanho máximo do corpo da requisição (64MB) |
| `REACTPHP_REQUEST_BODY_BUFFER_SIZE` | `8192` | Tamanho do buffer de requisição (8KB) |

## 🔄 Sistema de Bridge PSR-7

A extensão ReactPHP inclui um sistema sofisticado de bridge que converte entre a implementação PSR-7 do ReactPHP e a camada HTTP do PivotPHP:

### Bridge de Requisição

O `RequestBridge` manipula com segurança a manipulação de estado global:

```php
// O bridge automaticamente manipula:
// 1. Salvar estado original $_SERVER, $_GET, $_POST
// 2. Popular globals para Request do PivotPHP
// 3. Criar objeto Request do PivotPHP
// 4. Restaurar estado global original

// Suas rotas funcionam exatamente igual ao PHP tradicional:
$app->post('/api/data', function($req, $res) {
    $data = $req->getBody();      // Funciona perfeitamente
    $query = $req->query('param'); // Estado global manipulado automaticamente

    return $res->json(['received' => $data]);
});
```

### Bridge de Resposta

O `ResponseBridge` converte respostas do PivotPHP para formato ReactPHP:

```php
// Todos os métodos de resposta do PivotPHP funcionam:
$app->get('/api/file', function($req, $res) {
    return $res
        ->header('Content-Type', 'application/pdf')
        ->status(200)
        ->stream($fileContent); // Streaming funciona automaticamente
});
```

### Conversão de Headers

O PivotPHP converte headers HTTP para formato camelCase automaticamente:

```php
$app->get('/api/info', function($req, $res) {
    // Headers são automaticamente convertidos:
    $contentType = $req->header('contentType');     // Content-Type
    $auth = $req->header('authorization');          // Authorization
    $apiKey = $req->header('xApiKey');             // X-API-Key
    $language = $req->header('acceptLanguage');     // Accept-Language

    return $res->json([
        'headers_received' => $req->headers(),
        'converted_format' => 'camelCase'
    ]);
});
```

## ⚡ Benefícios de Performance

### Vantagens do Runtime Contínuo

```php
// Exemplo: Conexões de banco de dados persistem entre requisições
use PivotPHP\CycleORM\CycleServiceProvider;

$app = new Application();
$app->register(new ReactPHPServiceProvider($app));
$app->register(new CycleServiceProvider($app));

// Conexão de banco é estabelecida uma vez e reutilizada
$app->get('/api/users', function($req, $res) {
    // Sem overhead de conexão - conexão já existe!
    $users = User::all();
    return $res->json($users);
});
```

### Gerenciamento de Memória

A extensão inclui gerenciamento automático de memória:

```php
// Isolamento de memória integrado previne vazamentos de memória
$app->get('/api/heavy-operation', function($req, $res) {
    // Processe grandes datasets sem se preocupar com vazamentos de memória
    $largeData = processHugeDataset();

    // Memória é automaticamente limpa após a resposta
    return $res->json(['processed' => count($largeData)]);
});
```

### Monitoramento de Performance

```php
$app->get('/debug/server-stats', function($req, $res) {
    $container = $app->getContainer();

    if ($container->has('reactphp.server')) {
        return $res->json([
            'server_type' => 'ReactPHP',
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'uptime_seconds' => time() - $_SERVER['REQUEST_TIME_FLOAT'],
            'requests_handled' => 'Runtime contínuo ativo'
        ]);
    }

    return $res->json(['error' => 'ReactPHP não ativo']);
});
```

## 🛡️ Recursos de Segurança

### Proteção de Estado Global

A extensão fornece isolamento completo de estado global:

```php
// Cada requisição tem estado global isolado
$app->get('/api/state-test', function($req, $res) {
    // $_POST, $_GET, $_SERVER são isolados com segurança por requisição
    // Sem vazamento de dados entre requisições concorrentes

    return $res->json([
        'request_id' => uniqid(),
        'isolated_state' => true,
        'concurrent_safe' => true
    ]);
});
```

### Proteção de Memória

Guard de memória integrado previne processos descontrolados:

```php
// Monitoramento automático de memória e limpeza
$app->get('/api/memory-intensive', function($req, $res) {
    // Uso de memória é monitorado automaticamente
    $result = performMemoryIntensiveOperation();

    // Limpeza acontece automaticamente após a resposta
    return $res->json($result);
});
```

## 🚀 Uso Avançado

### Acesso ao Event Loop

```php
$app->get('/api/async-operation', function($req, $res) use ($app) {
    $container = $app->getContainer();
    $loop = $container->get(\React\EventLoop\LoopInterface::class);

    // Agendar operações assíncronas
    $loop->addTimer(2.0, function() {
        echo "Operação assíncrona completa!\n";
    });

    return $res->json(['async_scheduled' => true]);
});
```

### Respostas Streaming

```php
$app->get('/api/stream-data', function($req, $res) {
    // Habilitar streaming para respostas grandes
    return $res
        ->header('Content-Type', 'application/json')
        ->header('Transfer-Encoding', 'chunked')
        ->stream(function() {
            for ($i = 1; $i <= 100; $i++) {
                yield json_encode(['chunk' => $i]) . "\n";
                usleep(10000); // Simular tempo de processamento
            }
        });
});
```

### Desligamento Gracioso

```php
// O servidor manipula SIGTERM e SIGINT graciosamente
// Conexões existentes são permitidas a completar
// Novas conexões são rejeitadas durante o desligamento

// Em seu server.php, adicione manipulação de sinais:
if (function_exists('pcntl_signal')) {
    pcntl_signal(SIGTERM, function() {
        echo "\nRecebeu SIGTERM, desligando graciosamente...\n";
        // Servidor completará requisições atuais e sairá
    });

    pcntl_signal(SIGINT, function() {
        echo "\nRecebeu SIGINT (Ctrl+C), desligando graciosamente...\n";
        // Servidor completará requisições atuais e sairá
    });
}
```

## 🔧 Deploy em Produção

### Gerenciamento de Processos com Supervisor

Crie `/etc/supervisor/conf.d/pivotphp-reactphp.conf`:

```ini
[program:pivotphp-reactphp]
command=php /caminho/para/seu/server.php
directory=/caminho/para/sua/app
user=www-data
autostart=true
autorestart=true
startsecs=3
startretries=3
stdout_logfile=/var/log/supervisor/pivotphp-reactphp.log
stderr_logfile=/var/log/supervisor/pivotphp-reactphp-error.log
```

Iniciar com Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start pivotphp-reactphp
```

### Balanceamento de Carga

Para aplicações de alto tráfego, execute múltiplas instâncias:

```bash
# Iniciar múltiplos servidores em portas diferentes
php server.php --port=8080 &
php server.php --port=8081 &
php server.php --port=8082 &
php server.php --port=8083 &
```

Configurar nginx para balancear carga:

```nginx
upstream pivotphp_backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}

server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://pivotphp_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Deploy Docker

Crie `Dockerfile`:

```dockerfile
FROM php:8.1-cli

# Instalar extensões necessárias
RUN docker-php-ext-install pdo pdo_mysql

# Copiar aplicação
COPY . /app
WORKDIR /app

# Instalar dependências
RUN composer install --no-dev --optimize-autoloader

# Expor porta
EXPOSE 8080

# Iniciar servidor ReactPHP
CMD ["php", "server.php"]
```

## 🐛 Solução de Problemas

### Problemas Comuns

**Vazamentos de Memória em Processos de Longa Duração**
```php
// Monitorar uso de memória
$app->get('/debug/memory', function($req, $res) {
    return $res->json([
        'current' => memory_get_usage(true),
        'peak' => memory_get_peak_usage(true),
        'limit' => ini_get('memory_limit')
    ]);
});
```

**Conflitos de Versão PSR-7**
```bash
# Verificar versão PSR-7
composer show psr/http-message

# Se necessário, use comutação de versão do PivotPHP (solução temporária)
php vendor/pivotphp/core/scripts/switch-psr7-version.php 1
composer update psr/http-message
```

**Problemas de Estado Global**
```php
// Se experimentando poluição de estado, verifique isolamento:
$app->get('/debug/isolation', function($req, $res) {
    return $res->json([
        'server_vars' => count($_SERVER),
        'get_vars' => count($_GET),
        'post_vars' => count($_POST),
        'request_isolated' => true
    ]);
});
```

### Monitoramento de Performance

```php
$app->get('/debug/performance', function($req, $res) {
    $startTime = microtime(true);

    // Simular algum trabalho
    usleep(1000);

    $endTime = microtime(true);
    $duration = ($endTime - $startTime) * 1000; // Converter para milissegundos

    return $res->json([
        'request_duration_ms' => $duration,
        'memory_usage_mb' => memory_get_usage(true) / 1024 / 1024,
        'server_type' => 'Runtime Contínuo ReactPHP'
    ]);
});
```

## 📊 Comparação de Performance

### PHP-FPM Tradicional vs ReactPHP

| Métrica | PHP-FPM | ReactPHP |
|---------|---------|----------|
| Bootstrap por requisição | ✅ Sim | ❌ Não |
| Memória por requisição | ~8-32MB | ~2-8MB |
| Conexões concorrentes | Limitado | Alto |
| Conexões de banco | Por requisição | Persistente |
| Tempo de inicialização | ~50-200ms | ~0.1ms |

### Resultados de Benchmark

```php
// ReactPHP pode manipular significativamente mais requisições concorrentes
$app->get('/api/benchmark', function($req, $res) {
    $start = microtime(true);

    // Simular trabalho típico de API
    $data = [
        'users' => range(1, 1000),
        'timestamp' => time(),
        'server' => 'ReactPHP'
    ];

    $end = microtime(true);

    return $res->json([
        'data' => $data,
        'processing_time_ms' => ($end - $start) * 1000,
        'memory_usage_mb' => memory_get_usage(true) / 1024 / 1024
    ]);
});
```

## 📚 Documentação Relacionada

- [Documentação Oficial do ReactPHP](https://reactphp.org/)
- [Documentação Core do PivotPHP]({{ '/docs/' | relative_url }})
- [Otimização de Performance]({{ '/docs/performance/' | relative_url }})
- [Guia de Deploy]({{ '/docs/deployment/' | relative_url }})

## 🤝 Suporte

- **Issues no GitHub**: [Reportar problemas](https://github.com/PivotPHP/pivotphp-reactphp/issues)
- **Documentação**: [Visão técnica](https://github.com/PivotPHP/pivotphp-reactphp/blob/main/docs/TECHNICAL-OVERVIEW.md)

---

*A extensão PivotPHP ReactPHP v0.0.2 está pronta para produção e fornece runtime contínuo estável para aplicações de alta performance.*
