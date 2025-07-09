---
layout: docs
title: Extensão ReactPHP
permalink: /pt/docs/extensions/reactphp/
lang: pt
---

A Extensão ReactPHP fornece um runtime contínuo de alta performance para aplicações PivotPHP usando um modelo de I/O não-bloqueante orientado a eventos. Esta extensão permite que sua aplicação rode continuamente sem reiniciar entre requisições, melhorando drasticamente a performance.

## Instalação

```bash
composer require pivotphp/reactphp
```

## Recursos

- **Runtime Contínuo**: Mantenha sua aplicação em memória entre requisições
- **Arquitetura Orientada a Eventos**: I/O não-bloqueante para lidar com requisições concorrentes
- **Compatível com PSR-7**: Compatibilidade total com a implementação PSR-7 do PivotPHP
- **Alta Performance**: Elimine o overhead de bootstrap para cada requisição
- **Suporte Assíncrono**: Suporte integrado para promises e operações assíncronas
- **Pronto para WebSocket**: Base para comunicação em tempo real (em breve)

## Configuração

Registre o service provider do ReactPHP em sua aplicação:

```php
use PivotPHP\ReactPHP\ReactServiceProvider;

$app->register(new ReactServiceProvider([
    'server' => [
        'host' => '0.0.0.0',
        'port' => 8080,
        'workers' => 4 // Opcional: número de processos worker
    ],
    'options' => [
        'max_request_size' => '10M',
        'timeout' => 30
    ]
]));
```

## Uso Básico

### Executando o Servidor Assíncrono

Em vez de usar o tradicional `$app->run()`, use o runner assíncrono:

```php
// Servidor síncrono tradicional
// $app->run();

// Servidor assíncrono ReactPHP
$app->runAsync();
```

Isso inicia um servidor HTTP contínuo que mantém sua aplicação em memória.

### Handlers de Rota Assíncronos

O ReactPHP permite usar handlers assíncronos com promises:

```php
use React\Promise\Promise;

$app->get('/dados-async', function($req, $res) {
    return new Promise(function($resolve) use ($res) {
        // Simula operação assíncrona
        \React\EventLoop\Loop::get()->addTimer(0.5, function() use ($resolve, $res) {
            $resolve($res->json(['dados' => 'Carregado assincronamente!']));
        });
    });
});
```

### Operações de Banco de Dados

Combine com drivers de banco de dados assíncronos para queries não-bloqueantes:

```php
$app->get('/usuarios', function($req, $res) use ($db) {
    return $db->query('SELECT * FROM usuarios')
        ->then(function($usuarios) use ($res) {
            return $res->json($usuarios);
        });
});
```

## Recursos Avançados

### Acesso ao Event Loop

Acesse o event loop do ReactPHP para operações assíncronas avançadas:

```php
use React\EventLoop\Loop;

$app->get('/resposta-atrasada', function($req, $res) {
    $loop = Loop::get();
    
    $loop->addTimer(2, function() use ($res) {
        $res->json(['mensagem' => 'Resposta após 2 segundos']);
    });
    
    return $res->async(); // Indica resposta assíncrona
});
```

### Tarefas Periódicas

Agende tarefas para executar periodicamente:

```php
use React\EventLoop\Loop;

// Executar limpeza a cada 60 segundos
Loop::get()->addPeriodicTimer(60, function() {
    // Limpar arquivos temporários
    limparArquivosTemp();
});
```

### Processamento de Streams

Lide com uploads e downloads de arquivos eficientemente:

```php
$app->post('/upload', function($req, $res) {
    $body = $req->getBody();
    
    if ($body instanceof \React\Stream\ReadableStreamInterface) {
        $output = new \React\Stream\WritableResourceStream(
            fopen('uploads/arquivo.dat', 'w'),
            Loop::get()
        );
        
        $body->pipe($output);
        
        $output->on('close', function() use ($res) {
            $res->json(['status' => 'enviado']);
        });
    }
    
    return $res->async();
});
```

## Considerações de Performance

### Gerenciamento de Memória

Como a aplicação permanece em memória, a limpeza adequada é essencial:

```php
// Limpar caches periodicamente
Loop::get()->addPeriodicTimer(300, function() use ($app) {
    $app->getContainer()->get('cache')->clear();
    gc_collect_cycles();
});
```

### Pool de Conexões

O ReactPHP funciona bem com pool de conexões:

```php
$app->register(new DatabasePoolProvider([
    'min_connections' => 5,
    'max_connections' => 20
]));
```

## Suporte WebSocket (Em Breve)

Versões futuras incluirão suporte WebSocket:

```php
// Chegando na v1.0
$ws = $app->websocket('/ws');

$ws->on('connection', function($client) {
    $client->on('message', function($msg) use ($client) {
        $client->send('Echo: ' . $msg);
    });
});
```

## Executando em Produção

### Usando Supervisor

Crie uma configuração do supervisor:

```ini
[program:pivotphp-reactphp]
command=php /caminho/para/app/server.php
autostart=true
autorestart=true
stderr_logfile=/var/log/pivotphp-reactphp.err.log
stdout_logfile=/var/log/pivotphp-reactphp.out.log
```

### Usando PM2

Para gerenciamento de processos estilo Node.js:

```json
{
  "apps": [{
    "name": "pivotphp-app",
    "script": "server.php",
    "interpreter": "php",
    "instances": 4,
    "exec_mode": "cluster"
  }]
}
```

## Resolução de Problemas

### Alto Uso de Memória

Monitore e limite o uso de memória:

```php
Loop::get()->addPeriodicTimer(10, function() {
    $memoria = memory_get_usage(true) / 1024 / 1024;
    if ($memoria > 500) { // Limite de 500MB
        error_log("Alto uso de memória: {$memoria}MB");
        // Acionar limpeza ou reinicialização
    }
});
```

### Limites de Conexão

Aumente os limites do sistema para produção:

```bash
# Aumentar limites de descritores de arquivo
ulimit -n 65536

# Atualizar limites do sistema
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf
```

## Melhores Práticas

1. **Design Stateless**: Mantenha os handlers de requisição stateless
2. **Limpeza de Recursos**: Sempre feche recursos (arquivos, conexões)
3. **Tratamento de Erros**: Implemente limites de erro adequados
4. **Monitoramento**: Use verificações de saúde e métricas
5. **Desligamento Gracioso**: Lide com sinais adequadamente

```php
// Desligamento gracioso
$loop = Loop::get();
$loop->addSignal(SIGTERM, function() use ($app, $loop) {
    $app->shutdown();
    $loop->stop();
});
```

## Aplicação de Exemplo

Servidor de exemplo completo:

```php
<?php
require 'vendor/autoload.php';

use PivotPHP\Core\Application;
use PivotPHP\ReactPHP\ReactServiceProvider;

$app = new Application();

// Registrar ReactPHP
$app->register(new ReactServiceProvider([
    'server' => ['port' => 8080]
]));

// Rotas
$app->get('/', fn($req, $res) => $res->json(['status' => 'rodando']));

$app->get('/saude', fn($req, $res) => $res->json([
    'status' => 'saudável',
    'memoria' => memory_get_usage(true),
    'uptime' => time() - $_SERVER['REQUEST_TIME']
]));

// Iniciar servidor assíncrono
echo "Servidor rodando em http://localhost:8080\n";
$app->runAsync();
```

## Recursos

- [Documentação ReactPHP](https://reactphp.org/)
- [PivotPHP ReactPHP GitHub](https://github.com/pivotphp/pivotphp-reactphp)
- [Guia de PHP Assíncrono](https://sergeyzhuk.me/reactphp-series)