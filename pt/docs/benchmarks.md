---
layout: docs-benchmarks
title: Benchmarks de Performance
description: Análise abrangente de performance e benchmarks do PivotPHP
lang: pt
---

O PivotPHP oferece performance competitiva através de arquitetura inteligente e otimizações. Nossos benchmarks abrangentes demonstram performance real de APIs em vários cenários, executados em containers Docker padronizados para testes justos e reproduzíveis. **Validação Docker mostra PivotPHP alcançando 6.227 req/s com latência de 0,32ms, ficando em 3º lugar entre os frameworks avaliados** com forte posicionamento para desenvolvimento estilo Express.js.

## Resultados da Validação Docker - 11 de Julho de 2025

<div class="benchmark-highlights">
  <div class="stat-card">
    <div class="stat-value">6.227</div>
    <div class="stat-label">req/seg</div>
    <div class="stat-description">Docker Validado</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">0,32ms</div>
    <div class="stat-label">latência</div>
    <div class="stat-description">Resposta Média</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">3º</div>
    <div class="stat-label">lugar</div>
    <div class="stat-description">Ranking Framework</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">1,61MB</div>
    <div class="stat-label">uso memória</div>
    <div class="stat-description">Ultra-Eficiente</div>
  </div>
</div>

## Comparação Cross-Framework Docker (Ambiente Real)

**Ambiente de Teste**: Containers Docker padronizados, PHP 8.2-cli, 2 CPUs, limite de 1GB RAM  
**Data do Teste**: 11 de julho de 2025  
**Metodologia**: Requisições HTTP reais via containers Docker

| Framework | Req/seg | Latência | Ranking | Ambiente |
|-----------|---------|----------|---------|----------|
| **Slim 4** | **6.881** | 0,29ms | 🥇 1º | 🐳 Docker |
| **Lumen** | **6.322** | 0,31ms | 🥈 2º | 🐳 Docker |
| **PivotPHP Core** | **6.227** | 0,32ms | 🥉 3º | 🐳 Docker |
| **Flight** | **3.179** | 10ms | 4º | 🐳 Docker |

### Principais Insights da Validação Docker

- **Performance Competitiva**: PivotPHP alcança 6.227 req/s, apenas 1,5% atrás do Lumen e 9,5% atrás do Slim 4
- **Excelente Latência**: 0,32ms tempo médio de resposta em ambiente controlado
- **96% Mais Rápido**: Supera o Flight em 96% em condições realistas
- **Resultados Consistentes**: Validação Docker fornece comparação reproduzível e justa
- **Vantagem Express.js**: Experiência superior do desenvolvedor com performance competitiva

## Resultados de Benchmark Internos - PivotPHP Core v1.1.1

## Análise Cross-Framework

Benchmarks abrangentes comparando PivotPHP com frameworks estabelecidos (Docker v1.1.1 - Gerado: 11/07/2025):

<div class="benchmark-chart">
  <canvas id="variantChart"></canvas>
</div>

### PivotPHP Core v1.1.1 - Resultados Benchmark Docker

| Categoria Benchmark | PivotPHP Core v1.1.1 (Docker) | Uso Memória | Nível Performance |
|---------------------|-------------------------------|-------------|-------------------|
| **Parsing Request HTTP** | 317.847 ops/s | 14MB | Excelente |
| **Criação Response HTTP** | 294.110 ops/s | 14MB | Excelente |
| **Negociação Conteúdo** | 548.849 ops/s | 14MB | Excepcional |
| **Tratamento Status Code** | 692.472 ops/s | 14MB | Excepcional |
| **Processamento Headers** | 301.207 ops/s | 14MB | Excelente |
| **Total Operações HTTP** | 2.154.485 ops/s | 14MB | 🚀 Alta Performance |

### PivotPHP v1.1.1 Performance JSON (Docker)

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
| **Core v1.1.0** | APIs estilo Express.js | 2.185.982 ops/s | 20MB | Experiência do desenvolvedor |
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
- **Variantes Testadas**: Core v1.1.0, ORM v1.0.1, ReactPHP v0.1.0

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

### 🏆 Onde PivotPHP v1.1.1 se Destaca
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

**Escolha PivotPHP v1.1.1 quando você precisa de performance competitiva (6.227 req/s) em ambientes Docker reais, experiência de desenvolvimento estilo Express.js, e otimização JSON moderna com excelente eficiência de memória (pegada de 1,61MB).**

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/benchmark-charts.js' | relative_url }}"></script>