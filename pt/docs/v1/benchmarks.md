---
redirect_from:
  - /docs/benchmarks/
  - /en/docs/benchmarks/
  - /en/benchmarks/
layout: docs-benchmarks
title: Benchmarks de Performance
description: Análise abrangente de performance e benchmarks do PivotPHP
lang: pt
version: "1.2.0"
---

> **⚠️ Aviso de versão**: Todos os benchmarks desta página foram executados contra o PivotPHP Core **v1.2.0** (21 de julho de 2025) e **ainda não foram revalidados** para a linha 2.x (versão atual: v2.1.1). Os números abaixo refletem o estado da v1.2.0 e podem não representar a performance da versão atual do framework.

O PivotPHP oferece performance excepcional através de simplicidade educacional e otimizações mantidas. Nossos benchmarks abrangentes demonstram performance real de APIs em vários cenários, executados em containers Docker padronizados para testes justos e reproduzíveis. **v1.2.0 "Simplicidade sobre Otimização Prematura" alcança 3,6M ops/s geração Swagger UI, 2.122 req/s performance HTTP pico, e 1.418 req/s throughput HTTP médio, estabelecendo excelência educacional sem sacrificar capacidades técnicas.**

## Performance Oficial Release - PivotPHP v1.2.0 - 21 de Julho de 2025

<div class="benchmark-highlights">
  <div class="stat-card">
    <div class="stat-value">3.6M</div>
    <div class="stat-label">ops/seg</div>
    <div class="stat-description">Geração Swagger UI</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">2.122</div>
    <div class="stat-label">req/seg</div>
    <div class="stat-description">Performance HTTP Pico</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">1.418</div>
    <div class="stat-label">req/seg</div>
    <div class="stat-description">HTTP Médio</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">0.36ms</div>
    <div class="stat-label">resposta</div>
    <div class="stat-description">Tempo Mais Rápido</div>
  </div>
</div>

## Análise Performance Oficial PivotPHP v1.2.0

**Framework**: PivotPHP Core v1.2.0 (Simplicity Edition - "Simplicidade sobre Otimização Prematura")  
**Data de Release**: 21 de julho de 2025  
**Ambiente**: Container Docker com PHP 8.4.8 (OPcache + JIT habilitado)  
**Status**: ✅ **Release Oficial Validado**

### Inovações Performance OpenAPI/Swagger (NOVO v1.2.0) - Docker Validado

| Funcionalidade | Operações/Seg | Tempo Médio (ms) | Descrição | Nível Performance |
|----------------|---------------|------------------|-----------|-------------------|
| **Geração OpenAPI** | 3.499.044 | 0.0029 | Geração automática spec OpenAPI 3.0.0 | 🚀 Revolucionário |
| **Renderização Swagger UI** | 3.616.715 | 0.0028 | Interface interativa Swagger UI | 🚀 Revolucionário |
| **Parsing PHPDoc** | 49.844 | 0.200 | Parsing documentação rotas | 💫 Excelente |
| **Middleware Documentação** | 1.697.206 | 0.0059 | Processamento middleware | 🔥 Excepcional |
| **Validação OpenAPI** | 1.670.039 | 0.0060 | Validação especificação | ⚡ Excepcional |
| **Extração Metadados Rota** | 166.567 | 0.060 | Processamento metadados rota | ✨ Sólido |

**Performance Média OpenAPI**: 1.783.236 ops/seg (Ambiente Docker)

### Performance Core Framework (Comparação Docker Validado)

| Operação | v1.1.4 | v1.2.0 | Impacto | Nível Performance |
|----------|---------|---------|---------|-------------------|
| **Criação Aplicação** | 83.077 | 78.500 | -5.5% | 🚀 Revolucionário |
| **Array Callable** | 30.694 | 29.500 | -3.9% | 🔥 Excepcional |
| **Registro Rota** | 33.521 | 31.200 | -6.9% | ⚡ Excepcional |
| **Resposta JSON** | 15.000 | 14.800 | -1.3% | 💫 Excelente |

**Impacto Performance Médio**: -4.4% (Excelente trade-off para simplicidade e valor educacional)

### Performance HTTP Real Ambiente Docker (NOVO)

| Endpoint | Requisições/seg | Tempo Resposta Médio | Taxa Sucesso | Nível Performance |
|----------|-----------------|---------------------|--------------|-------------------|
| **Health Check** | 2.121,79 req/seg | 0.0005s | 100% | 🚀 Revolucionário |
| **OpenAPI JSON** | 1.247,74 req/seg | 0.0008s | 100% | 🔥 Excepcional |
| **Endpoint Principal** | 1.232,77 req/seg | 0.0008s | 100% | 🔥 Excepcional |
| **Teste API Core** | 1.069,28 req/seg | 0.0009s | 100% | ⚡ Excepcional |

**Performance HTTP Média**: 1.417,89 req/seg (Ambiente Docker)  
**Melhor Performance**: 2.121,79 req/seg (endpoint Health)  
**Resposta Mais Rápida**: 0.36ms

### Resumo Validação Ambiente Docker

| Teste | Ambiente | Resultado |
|-------|----------|-----------|
| **Req/seg Média** | Container Docker | 1.417,89 req/seg |
| **Req/seg Pico** | Container Docker | 2.121,79 req/seg |
| **Carregamento Swagger UI** | Container Docker | 0.012s total |
| **Endpoint OpenAPI** | Container Docker | OpenAPI 3.0.0 ✅ |
| **Health Check** | Container Docker | Saudável ✅ |
| **Zero Breaking Changes** | Todos Testes | 100% Compatibilidade ✅ |

## Metodologia de Benchmark e Ambiente de Teste

### Infraestrutura de Teste v1.2.0

**Estrutura de Testes Isolada Docker:**
```
pivotphp-benchmarks/
├── docker-compose-v120.yml        # Orquestração completa v1.2.0
├── http_benchmark_v120.php         # Script HTTP real benchmark
├── phase1/                         # Testes Core Framework
│   ├── Dockerfile-v120            # Container otimizado v1.2.0
│   └── benchmarks/run-v120.php    # Execução testes v1.2.0
├── phase2/                         # Testes Extensões
│   ├── docker/Dockerfile-orm-v120 # Container ORM v1.2.0
│   └── docker/Dockerfile-reactphp-v120 # Container ReactPHP v1.2.0
└── phase3/                         # Validação Ecossistema
    ├── ecosystem-validation/ecosystem-v120-benchmark.php
    └── docker/docker-compose-v120.yml # Ambiente completo
```

### Configuração Ambiente Docker Padronizado

**Especificações Técnicas do Container:**
- **Sistema Operativo**: Ubuntu 22.04 LTS
- **PHP**: 8.4.8-cli (OPcache + JIT habilitado)
- **Recursos**: 2 CPUs, 1GB RAM por container
- **Rede**: Isolamento completo com portas expostas específicas
- **Storage**: Volumes persistentes para logs e resultados

**Configuração PHP Otimizada:**
```ini
opcache.enable=1
opcache.jit=1255
opcache.jit_buffer_size=128M
memory_limit=1024M
max_execution_time=300
```

**Comando Docker Benchmark Executado:**
```bash
# Container PivotPHP v1.2.0 executando em localhost:8090
docker-compose -f docker-compose-v120.yml up -d
php http_benchmark_v120.php  # 1000 requisições, 100 por endpoint
```

### Metodologia de Validação HTTP Real

**Script de Teste HTTP (`http_benchmark_v120.php`):**
- **Endpoints Testados**: 4 endpoints principais (/, /health, /api/test, /openapi.json)
- **Requisições por Endpoint**: 100 requisições sequenciais por endpoint
- **Timeout**: 5 segundos por requisição
- **Métricas Coletadas**: req/seg, tempo médio resposta, taxa sucesso, tempo min/max
- **Validação SSL**: Desabilitada para testes locais
- **Dados Salvos**: JSON com timestamp para reprodutibilidade

**Estrutura Dados Coletados:**
```json
{
  "benchmark_info": {
    "version": "1.2.0",
    "date": "2025-07-21T20:36:02+00:00",
    "requests": 1000,
    "concurrent": 10
  },
  "results": {
    "/health": {
      "requests_per_second": 2121.79,
      "avg_response_time": 0.000469,
      "success_rate": 100
    }
  }
}
```

### Comparação Cross-Framework (Metodologia Equivalente)

**Frameworks Testados em Ambiente Idêntico:**
- **Slim 4**: Container independente, mesma configuração PHP
- **Laravel Lumen**: Container independente, mesma configuração PHP  
- **Flight Framework**: Container independente, mesma configuração PHP
- **PivotPHP**: Container independente, configuração otimizada

**Garantias de Equidade:**
- ✅ **Isolamento Completo**: Cada framework em container separado
- ✅ **Recursos Idênticos**: 2 CPUs, 1GB RAM para todos
- ✅ **PHP Idêntico**: Versão 8.4.8 com OPcache + JIT
- ✅ **Benchmarks Idênticos**: Mesmos endpoints e cenários de teste
- ✅ **Ambiente Controlado**: Docker elimina variações do sistema host

### Reprodutibilidade e Transparência

**Comandos para Reproduzir Benchmarks:**
```bash
# Clonar repositório benchmarks
git clone https://github.com/PivotPHP/pivotphp-benchmarks.git
cd pivotphp-benchmarks

# Executar benchmarks v1.2.0
make -f Makefile-v120 build       # Build containers v1.2.0
make -f Makefile-v120 up          # Iniciar ambiente
php http_benchmark_v120.php       # Executar teste HTTP

# Executar benchmarks comparativos
make -f Makefile-v120 benchmark-all    # Todos frameworks
make -f Makefile-v120 report           # Gerar relatórios

# Acessar resultados
ls -la *.json                     # Arquivos resultado timestamp
```

**Validação Contínua:**
- **Execução Diária**: Benchmarks executados automaticamente
- **Versionamento Resultados**: Todos resultados com timestamp e hash git
- **Ambiente Limpo**: Containers reconstruídos para cada teste
- **Logs Detalhados**: Traces completos de execução disponíveis
- **Comparação Histórica**: Tracking de performance entre versões

### Interpretação dos Resultados

**Métricas de Performance Explicadas:**
- **req/seg**: Requisições processadas por segundo (throughput HTTP)
- **ops/seg**: Operações internas por segundo (processamento framework)
- **Tempo Resposta**: Latência end-to-end da requisição HTTP
- **Taxa Sucesso**: Percentual de requisições com código 2xx
- **Uso Memória**: Consumo RAM pico durante teste

**Categorias de Performance:**
- 🚀 **Revolucionário**: >3M ops/seg ou >2K req/seg
- 🔥 **Excepcional**: >1M ops/seg ou >1K req/seg  
- ⚡ **Excepcional**: >500K ops/seg ou >500 req/seg
- 💫 **Excelente**: >100K ops/seg ou >100 req/seg
- ✨ **Sólido**: >50K ops/seg ou >50 req/seg

### Principais Insights da Validação v1.2.0

- **Foco Educacional Mantém Performance**: 1.418 req/seg médio com arquitetura simplificada
- **OpenAPI Revolucionário**: 3,6M ops/seg geração Swagger UI automática
- **Zero Breaking Changes**: 100% compatibilidade com código v1.1.4
- **Docker Validado**: Todos resultados verificáveis em ambiente isolado
- **Transparência Total**: Código, configuração e dados publicly available

## Resultados de Benchmark Internos - PivotPHP Core v1.2.0

## Análise Cross-Framework

Benchmarks abrangentes comparando PivotPHP com frameworks estabelecidos (Docker v1.2.0 - Gerado: 21/07/2025):

<div class="benchmark-chart">
  <canvas id="variantChart"></canvas>
</div>

### PivotPHP Core v1.2.0 - Resultados Benchmark Docker

| Categoria Benchmark | PivotPHP Core v1.2.0 (Docker) | Uso Memória | Nível Performance |
|---------------------|-------------------------------|-------------|-------------------|
| **Parsing Request HTTP** | 317.847 ops/s | 14MB | Excelente |
| **Criação Response HTTP** | 294.110 ops/s | 14MB | Excelente |
| **Negociação Conteúdo** | 548.849 ops/s | 14MB | Excepcional |
| **Tratamento Status Code** | 692.472 ops/s | 14MB | Excepcional |
| **Processamento Headers** | 301.207 ops/s | 14MB | Excelente |
| **Total Operações HTTP** | 2.154.485 ops/s | 14MB | 🚀 Alta Performance |

### PivotPHP v1.2.0 Performance JSON (Docker)

| Tamanho Dataset JSON | Operations/Sec | Uso Memória | Nível Performance |
|----------------------|----------------|-------------|-------------------|
| **JSON Pequeno (5K iterações)** | 161.171 ops/s | 0MB | Excelente |
| **JSON Médio (5K iterações)** | 17.618 ops/s | 0.03MB | Bom |
| **JSON Grande (1K iterações)** | 1.746 ops/s | 0.26MB | Adequado |
| **JSON Complexo (5K iterações)** | 14.424 ops/s | 1.6MB | Bom |

### Pontos Fortes do Ecossistema PivotPHP

| Variante do Framework | Caso de Uso Especializado | Operações/Seg | Memória | Vantagem Competitiva |
|-----------------------|---------------------------|----------------|--------|-----------------------|
| **ReactPHP v0.1.0** | Apps async/longa duração | **1.970.678 ops/s** | 12MB | **🚀 Domina cenários async** |
| **Core v1.2.0** | APIs estilo Express.js | 2.185.982 ops/s | 20MB | Experiência do desenvolvedor |
| **ORM v1.0.1** | Operações de banco | 457.870 ops/s | **6MB** | **💾 Campeão de memória** |

## Performance de Concorrência

O PivotPHP mantém excelente performance sob vários níveis de carga concorrente:

<div class="benchmark-chart">
  <canvas id="concurrencyChart"></canvas>
</div>

### Resultados de Teste de Carga

<div class="load-test-grid">
  <div class="load-test-card">
    <h4>500 Requisições Concorrentes</h4>
    <table class="benchmark-table">
      <tr>
        <td>API Simples</td>
        <td class="value">7.686 req/s</td>
      </tr>
      <tr>
        <td>API de Dados</td>
        <td class="value">3.384 req/s</td>
      </tr>
      <tr>
        <td>API POST</td>
        <td class="value">2.608 req/s</td>
      </tr>
      <tr>
        <td>API de Computação</td>
        <td class="value">5.864 req/s</td>
      </tr>
    </table>
  </div>
  
  <div class="load-test-card">
    <h4>1.000 Requisições Concorrentes</h4>
    <table class="benchmark-table">
      <tr>
        <td>API Simples</td>
        <td class="value">-</td>
      </tr>
      <tr>
        <td>API de Dados</td>
        <td class="value">3.344 req/s</td>
      </tr>
      <tr>
        <td>API POST</td>
        <td class="value">2.414 req/s</td>
      </tr>
      <tr>
        <td>API de Computação</td>
        <td class="value">6.169 req/s</td>
      </tr>
    </table>
  </div>
  
  <div class="load-test-card">
    <h4>1.500 Requisições Concorrentes</h4>
    <table class="benchmark-table">
      <tr>
        <td>API Simples</td>
        <td class="value">207 req/s</td>
      </tr>
      <tr>
        <td>API de Dados</td>
        <td class="value">2.555 req/s</td>
      </tr>
      <tr>
        <td>API POST</td>
        <td class="value">2.516 req/s</td>
      </tr>
      <tr>
        <td>API de Computação</td>
        <td class="value">6.597 req/s</td>
      </tr>
    </table>
  </div>
</div>

## Performance Real de API (Benchmarks Cross-Framework)

Performance real de processamento de API medida contra frameworks estabelecidos:

<div class="component-grid">
  <div class="component-card">
    <h4>🌐 Performance HTTP</h4>
    <div class="metric">605K ops/seg</div>
    <div class="description">vs Slim 4: 736K (gap 17,8%)</div>
  </div>
  
  <div class="component-card">
    <h4>🔄 REST API</h4>
    <div class="metric">1,12M ops/seg</div>
    <div class="description">vs Slim 4: 1,30M (gap 13,8%)</div>
  </div>
  
  <div class="component-card">
    <h4>🛡️ API Middleware</h4>
    <div class="metric">460K ops/seg</div>
    <div class="description">vs Slim 4: 461K (gap 0,1%)</div>
  </div>
  
  <div class="component-card">
    <h4>⚡ ReactPHP Async</h4>
    <div class="metric">1,97M ops/seg</div>
    <div class="description">Líder runtime contínuo</div>
  </div>
</div>

## Distribuição de Latência

O PivotPHP mantém latência baixa e consistente através dos percentis:

<div class="latency-chart">
  <canvas id="latencyChart"></canvas>
</div>

| Tipo de Endpoint | P50 | P95 | P99 |
|------------------|-----|-----|-----|
| Simples | 0,13ms | 0,22ms | 0,44ms |
| Dados | 0,30ms | 0,47ms | 0,81ms |
| POST | 0,40ms | 0,61ms | 2,38ms |
| Computação | 0,15ms | 0,22ms | 0,42ms |

## Comparação com Outros Frameworks

A performance do PivotPHP é competitiva com microframeworks estabelecidos:

<div class="comparison-chart">
  <canvas id="comparisonChart"></canvas>
</div>

| Framework | Rota Simples | API JSON | Middleware | Memória |
|-----------|--------------|----------|------------|---------|
| **PivotPHP** | 8.673 req/s | 3.384 req/s | 3.392 ops/s | 5,7MB |
| Slim 4 | ~7.000 req/s | ~2.500 req/s | ~2.800 ops/s | 12MB |
| Lumen | ~6.500 req/s | ~2.200 req/s | ~2.500 ops/s | 15MB |
| Symfony | ~4.000 req/s | ~1.800 req/s | ~2.000 ops/s | 25MB |

## Comportamento de Escala

O PivotPHP demonstra excelentes características de escala:

- **Requisições Leves**: -10,4% de degradação (500 → 1500 requisições)
- **Requisições Normais**: -19,3% de degradação (500 → 1500 requisições)
- **Requisições Pesadas**: +14,5% de melhoria (500 → 1500 requisições)

## Performance no Mundo Real

### Tempos de Resposta da API

```php
// Endpoint leve - média de 0,11ms
$app->get('/status', fn($req, $res) => $res->json(['ok' => true]));

// Endpoint normal - média de 0,20ms
$app->get('/usuarios', function($req, $res) {
    $usuarios = Usuario::paginate(10);
    return $res->json($usuarios);
});

// Endpoint pesado - média de 2,28ms
$app->post('/analisar', function($req, $res) {
    $resultado = CalculoComplexo::processar($req->body());
    return $res->json($resultado);
});
```

## Dicas de Otimização

### 1. Use Endpoints Apropriados
- Reserve processamento pesado para endpoints dedicados
- Implemente cache para operações computacionalmente caras
- Use respostas leves para verificações de saúde

### 2. Aproveite Middleware de Forma Eficiente
```php
// Bom: Middleware condicional
$app->group('/api', function($app) {
    $app->use(new RateLimitMiddleware());
    $app->use(new AuthMiddleware());
    // Rotas aqui
});

// Evite: Middleware pesado global
$app->use(new MiddlewareCaro()); // Aplicado a todas as rotas
```

### 3. Otimize Consultas ao Banco de Dados
```php
// Use carregamento antecipado
$usuarios = Usuario::with('posts', 'comentarios')->get();

// Use query builder para consultas complexas
$estatisticas = DB::table('pedidos')
    ->select(DB::raw('DATE(created_at) as data'), DB::raw('SUM(total) as receita'))
    ->groupBy('data')
    ->get();
```

## Metodologia de Benchmark

Todos os benchmarks foram conduzidos com containers Docker padronizados:

- **Ambiente**: Containers Docker isolados para testes justos
- **Padronização**: Ambiente PHP 8.1+ idêntico em todos os testes
- **Configuração**: Setup padrão Docker compose
- **Isolamento**: Cada variante do framework testada separadamente
- **Reprodutibilidade**: Todos os testes podem ser replicados com `docker-compose up`
- **Métricas**: Operações/segundo, requisições/hora, uso de memória
- **Variantes Testadas**: Core v1.2.0, ORM v1.0.1, ReactPHP v0.1.0

## Entendendo Nossas Métricas de Benchmark

### Esclarecimento: Operações vs Requisições

**"Operações por segundo"** mede operações individuais do framework:
- Parsing de requisição, roteamento, formatação de resposta
- Múltiplas operações por requisição HTTP
- Usado para análise de performance interna

**"Requisições por hora"** mede ciclos HTTP completos:
- Uma chamada de API do início ao fim
- Mais relevante para planejamento de capacidade de produção
- Conversão: `requisições/hora ≈ (ops/seg para HTTP) × 3600`

### Metodologia de Comparação Cross-Framework

```bash
# Executar análise comparativa
cd pivotphp-benchmarks
php scripts/run-comparative-analysis.php

# Benchmarks incluídos:
# - http-performance: Requisição/resposta HTTP completa
# - rest-api: Operações CRUD com validação
# - api-middleware: Autenticação, CORS, rate limiting
# - json-performance: Codificação/decodificação JSON

# Resultados mostram performance real de processamento de API
# vs frameworks estabelecidos como Slim 4
```

## Avaliação Honesta de Performance

Baseado em análise cross-framework abrangente (Julho 2025):

### 🏆 Onde PivotPHP v1.2.0 se Destaca
- **Experiência do Desenvolvedor**: Sintaxe estilo Express.js com performance competitiva
- **Eficiência de Memória**: Ultra-eficiente com pegada de 1,61MB
- **Latência**: Excelente tempo médio de resposta de 0,32ms no Docker
- **Otimização JSON**: Sistema revolucionário de pooling interno (505K ops/s JSON pequeno)
- **Arquitetura**: Conformidade PSR moderna com API intuitiva

### 🥉 Performance de Validação Docker (Realista)
- **Performance HTTP Real**: 6.227 req/s em ambiente Docker padronizado
- **Posicionamento Competitivo**: 3º lugar, apenas 9,5% atrás do líder (Slim 4)
- **Resultados Consistentes**: Performance reproduzível em condições controladas
- **Comparação de Frameworks**: 96% mais rápido que Flight, competitivo com Lumen
- **Alternativa Express.js**: Forte posicionamento para desenvolvimento PHP estilo Express.js

### 📊 Transparência dos Benchmarks
- **Metodologia**: Containers Docker padronizados, 2K iterações
- **Framework de Comparação**: Direto com Slim 4
- **Data do Teste**: 10 de julho de 2025
- **Ambiente**: PHP 8.1+ com OPcache e JIT

### 🎯 Posicionamento Estratégico

O PivotPHP não afirma ser o framework PHP mais rápido. Em vez disso, oferece:

1. **Excelência Especializada**: ReactPHP lidera cenários async
2. **Performance Competitiva**: Core dentro de 12,5% de frameworks estabelecidos
3. **Experiência Superior do Desenvolvedor**: Padrões Express.js em PHP
4. **Otimização de Memória**: Variante ORM para deploys com restrição de recursos
5. **Abordagem de Ecossistema**: Ferramenta certa para o trabalho certo

**Escolha PivotPHP v1.2.0 quando você precisa de performance competitiva com simplicidade educacional, experiência de desenvolvimento estilo Express.js, e geração abrangente de documentação OpenAPI com excelente eficiência de memória.**

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/benchmark-charts.js' | relative_url }}"></script>
