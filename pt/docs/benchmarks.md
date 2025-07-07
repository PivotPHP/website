---
layout: docs-benchmarks
title: Benchmarks de Performance
description: Análise abrangente de performance e benchmarks do PivotPHP
lang: pt
---

# Benchmarks de Performance

O PivotPHP oferece performance excepcional através de arquitetura inteligente e otimizações. Nossos benchmarks abrangentes demonstram performance real em vários cenários.

## Resumo Executivo

<div class="benchmark-highlights">
  <div class="stat-card">
    <div class="stat-value">8.673</div>
    <div class="stat-label">requisições/segundo</div>
    <div class="stat-description">Throughput máximo</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">0,11ms</div>
    <div class="stat-label">latência média</div>
    <div class="stat-description">Endpoints leves</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">5,7MB</div>
    <div class="stat-label">uso de memória</div>
    <div class="stat-description">Pegada consistente</div>
  </div>
</div>

## Performance por Tipo de Requisição

Nossos benchmarks testam três tipos de endpoints para representar cenários do mundo real:

<div class="benchmark-chart">
  <canvas id="requestTypeChart"></canvas>
</div>

| Tipo de Requisição | Descrição | Throughput | Latência Média |
|-------------------|-----------|------------|----------------|
| **Leve** | Processamento mínimo, verificações de status | 8.673 req/s | 0,11ms |
| **Normal** | Respostas API típicas com dados | 5.112 req/s | 0,20ms |
| **Pesada** | Cálculos intensivos de CPU | 439 req/s | 2,28ms |

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

## Performance de Componentes

Componentes individuais do framework demonstram excelente eficiência:

<div class="component-grid">
  <div class="component-card">
    <h4>🚀 Roteamento</h4>
    <div class="metric">4.785 ops/seg</div>
    <div class="description">Resolução de rotas simples</div>
  </div>
  
  <div class="component-card">
    <h4>⚡ Middleware</h4>
    <div class="metric">3.392 ops/seg</div>
    <div class="description">Execução de middleware único</div>
  </div>
  
  <div class="component-card">
    <h4>🔄 Pipeline</h4>
    <div class="metric">4.482 ops/seg</div>
    <div class="description">10 camadas de middleware</div>
  </div>
  
  <div class="component-card">
    <h4>📦 JSON</h4>
    <div class="metric">519 ops/seg</div>
    <div class="description">Processamento JSON</div>
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

Todos os benchmarks foram conduzidos com:

- **Ambiente**: Containers Docker isolados
- **Recursos**: 2 CPUs, 1GB RAM por container
- **Versão PHP**: 8.4.8 com OPcache+JIT habilitado
- **Aquecimento**: 100-1000 iterações antes da medição
- **Duração**: 10+ segundos por teste
- **Métricas**: Throughput, percentis de latência, uso de memória

## Execute Seus Próprios Benchmarks

Teste a performance do PivotPHP em seu ambiente:

```bash
# Clone a suite de benchmarks
git clone https://github.com/pivotphp/benchmarks.git
cd benchmarks

# Execute todos os benchmarks
make benchmark-all

# Execute benchmarks específicos do framework
make benchmark-pivotphp

# Gere relatórios
make report
```

## Conclusão

O PivotPHP entrega:
- **Latência ultra-baixa**: Tempos de resposta abaixo de milissegundo
- **Alto throughput**: Até 8.673 requisições/segundo
- **Eficiência de memória**: Pegada consistente de 5,7MB
- **Escala excelente**: Mantém performance sob carga

Perfeito para APIs de alta performance, microserviços e aplicações em tempo real.

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/benchmark-charts.js' | relative_url }}"></script>