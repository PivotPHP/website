---
layout: docs-benchmarks
title: Performance Benchmarks
description: Comprehensive performance analysis and benchmarks for PivotPHP
---

PivotPHP delivers exceptional performance through intelligent architecture and optimizations. Our comprehensive benchmarks demonstrate real-world performance across various scenarios.

## Executive Summary

<div class="benchmark-highlights">
  <div class="stat-card">
    <div class="stat-value">13,374</div>
    <div class="stat-label">requests/second</div>
    <div class="stat-description">Peak throughput</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">0.07ms</div>
    <div class="stat-label">avg latency</div>
    <div class="stat-description">Simple endpoints</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">0-2MB</div>
    <div class="stat-label">memory usage</div>
    <div class="stat-description">Under load</div>
  </div>
</div>

## Performance by Request Type

Our benchmarks test three types of endpoints to represent real-world scenarios:

<div class="benchmark-chart">
  <canvas id="requestTypeChart"></canvas>
</div>

| Request Type | Description | Throughput | Avg Latency |
|--------------|-------------|------------|-------------|
| **Simple** | Minimal processing, status checks | 13,374 req/s | 0.07ms |
| **JSON** | Typical API responses with data | 2,059 req/s | 0.48ms |
| **Complex** | CPU-intensive calculations | 2,213 req/s | 0.44ms |

## Concurrency Performance

PivotPHP maintains excellent performance under various concurrent load levels:

<div class="benchmark-chart">
  <canvas id="concurrencyChart"></canvas>
</div>

### Stress Test Results

<div class="stress-test-section">
  <div class="benchmark-chart">
    <canvas id="stress-test-chart"></canvas>
  </div>
</div>

<div class="load-test-grid">
  <div class="load-test-card">
    <h4>100 Requests</h4>
    <table class="benchmark-table">
      <tr>
        <td>PivotPHP Core</td>
        <td class="value">9,059 req/s</td>
      </tr>
      <tr>
        <td>PivotPHP ORM</td>
        <td class="value">9,059 req/s</td>
      </tr>
      <tr>
        <td>Slim 4</td>
        <td class="value">2,641 req/s</td>
      </tr>
      <tr>
        <td>Lumen</td>
        <td class="value">2,182 req/s</td>
      </tr>
    </table>
  </div>
  
  <div class="load-test-card">
    <h4>1,000 Requests</h4>
    <table class="benchmark-table">
      <tr>
        <td>PivotPHP Core</td>
        <td class="value">5,661 req/s</td>
      </tr>
      <tr>
        <td>PivotPHP ORM</td>
        <td class="value">5,661 req/s</td>
      </tr>
      <tr>
        <td>Slim 4</td>
        <td class="value">4,782 req/s</td>
      </tr>
      <tr>
        <td>Lumen</td>
        <td class="value">2,313 req/s</td>
      </tr>
    </table>
  </div>
  
  <div class="load-test-card">
    <h4>10,000 Requests</h4>
    <table class="benchmark-table">
      <tr>
        <td>PivotPHP Core</td>
        <td class="value">13,374 req/s</td>
      </tr>
      <tr>
        <td>PivotPHP ORM</td>
        <td class="value">8,893 req/s</td>
      </tr>
      <tr>
        <td>Slim 4</td>
        <td class="value">4,562 req/s</td>
      </tr>
      <tr>
        <td>Lumen</td>
        <td class="value">2,912 req/s</td>
      </tr>
    </table>
  </div>
</div>

## Component Performance

Individual framework components demonstrate excellent efficiency:

<div class="component-grid">
  <div class="component-card">
    <h4>🚀 Routing</h4>
    <div class="metric">4,785 ops/sec</div>
    <div class="description">Simple route resolution</div>
  </div>
  
  <div class="component-card">
    <h4>⚡ Middleware</h4>
    <div class="metric">3,392 ops/sec</div>
    <div class="description">Single middleware execution</div>
  </div>
  
  <div class="component-card">
    <h4>🔄 Pipeline</h4>
    <div class="metric">4,482 ops/sec</div>
    <div class="description">10 middleware layers</div>
  </div>
  
  <div class="component-card">
    <h4>📦 JSON</h4>
    <div class="metric">519 ops/sec</div>
    <div class="description">JSON processing</div>
  </div>
</div>

## Latency Distribution

PivotPHP maintains consistent low latency across percentiles:

<div class="latency-chart">
  <canvas id="latencyChart"></canvas>
</div>

| Endpoint Type | P50 | P95 | P99 |
|---------------|-----|-----|-----|
| Simple | 0.13ms | 0.22ms | 0.44ms |
| Data | 0.30ms | 0.47ms | 0.81ms |
| POST | 0.40ms | 0.61ms | 2.38ms |
| Compute | 0.15ms | 0.22ms | 0.42ms |

## Comparison with Other Frameworks

PivotPHP significantly outperforms established microframeworks:

<div class="comparison-chart">
  <canvas id="comparisonChart"></canvas>
</div>

### Stress Test Results (10,000 requests)

| Framework | Simple Route | JSON API | Complex | Avg Latency |
|-----------|--------------|----------|---------|-------------|
| **PivotPHP Core** | **13,374 req/s** | **2,059 req/s** | **2,213 req/s** | **0.07ms** |
| PivotPHP ORM | 8,893 req/s | 876 req/s | 2,252 req/s | 0.11ms |
| Slim 4 | 4,562 req/s | 4,826 req/s | 1,192 req/s | 0.22ms |
| Lumen | 2,912 req/s | 2,708 req/s | - | 0.34ms |
| Flight | - | - | - | Timeout |

**PivotPHP is 2.9x faster than Slim 4 and 4.6x faster than Lumen!**

## Concurrent Performance Testing

PivotPHP excels at handling concurrent requests with minimal performance degradation:

<div class="benchmark-chart">
  <canvas id="concurrency-performance-chart"></canvas>
</div>

### Concurrent Request Handling

| Connections | Simple API | Data API | Heavy Processing | Efficiency |
|-------------|------------|----------|------------------|------------|
| 1 | 3,931 req/s | 1,229 req/s | 2,647 req/s | 100% |
| 10 | 3,325 req/s | 129 req/s | - | Excellent |
| 50 | 3,033 req/s | 1,163 req/s | 1,447 req/s | Good |
| 100 | **3,991 req/s** | 1,057 req/s | 1,508 req/s | **Excellent** |

## Scaling Behavior

PivotPHP demonstrates excellent scaling characteristics:

- **Synchronous**: Maintains 13,374 req/s even at 10,000 requests
- **Concurrent**: Scales to 3,991 req/s with 100 connections
- **Memory Efficient**: Only 0-2MB usage under heavy load

## Real-World Performance

### API Response Times

```php
// Light endpoint - 0.11ms average
$app->get('/status', fn($req, $res) => $res->json(['ok' => true]));

// Normal endpoint - 0.20ms average
$app->get('/users', function($req, $res) {
    $users = User::paginate(10);
    return $res->json($users);
});

// Heavy endpoint - 2.28ms average
$app->post('/analyze', function($req, $res) {
    $result = ComplexCalculation::process($req->body());
    return $res->json($result);
});
```

## Optimization Tips

### 1. Use Appropriate Endpoints
- Reserve heavy processing for dedicated endpoints
- Implement caching for computationally expensive operations
- Use lightweight responses for health checks

### 2. Leverage Middleware Efficiently
```php
// Good: Conditional middleware
$app->group('/api', function($app) {
    $app->use(new RateLimitMiddleware());
    $app->use(new AuthMiddleware());
    // Routes here
});

// Avoid: Global heavy middleware
$app->use(new ExpensiveMiddleware()); // Applied to all routes
```

### 3. Optimize Database Queries
```php
// Use eager loading
$users = User::with('posts', 'comments')->get();

// Use query builder for complex queries
$stats = DB::table('orders')
    ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as revenue'))
    ->groupBy('date')
    ->get();
```

## Benchmark Methodology

All benchmarks were conducted with:

- **Environment**: Isolated Docker containers
- **Resources**: 2 CPUs, 1GB RAM per container
- **PHP Version**: 8.4.8 with OPcache+JIT enabled
- **Warmup**: 100-1000 iterations before measurement
- **Duration**: 10+ seconds per test
- **Metrics**: Throughput, latency percentiles, memory usage

## Running Your Own Benchmarks

Test PivotPHP performance in your environment:

```bash
# Clone the benchmark suite
git clone https://github.com/pivotphp/benchmarks.git
cd benchmarks

# Run all benchmarks
make benchmark-all

# Run specific framework benchmarks
make benchmark-pivotphp

# Generate reports
make report
```

## Conclusion

PivotPHP delivers:
- **Ultra-low latency**: Sub-millisecond response times
- **High throughput**: Up to 8,673 requests/second
- **Memory efficiency**: 5.7MB consistent footprint
- **Excellent scaling**: Maintains performance under load

Perfect for high-performance APIs, microservices, and real-time applications.

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/benchmark-charts.js' | relative_url }}"></script>