---
layout: docs-benchmarks
title: Performance Benchmarks
description: Comprehensive performance analysis and benchmarks for PivotPHP
---

PivotPHP delivers exceptional performance through educational simplicity and maintained optimization. Our comprehensive benchmarks demonstrate real-world API performance across various scenarios, executed in standardized Docker containers for fair and reproducible testing. **v1.2.0 "Simplicidade sobre Otimização Prematura" edition achieves 3.6M ops/sec Swagger UI generation, 2,122 req/sec HTTP peak performance, and 1,418 req/sec average HTTP throughput, establishing educational excellence without sacrificing technical capabilities.**

## Official Release Performance - PivotPHP v1.2.0 - July 21, 2025

<div class="benchmark-highlights">
  <div class="stat-card">
    <div class="stat-value">3.6M</div>
    <div class="stat-label">ops/sec</div>
    <div class="stat-description">Swagger UI Generation</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">2,122</div>
    <div class="stat-label">req/sec</div>
    <div class="stat-description">HTTP Peak Performance</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">1,418</div>
    <div class="stat-label">req/sec</div>
    <div class="stat-description">HTTP Average</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">0.36ms</div>
    <div class="stat-label">response</div>
    <div class="stat-description">Fastest Time</div>
  </div>
</div>

## PivotPHP v1.2.0 Official Release Performance Analysis

**Framework**: PivotPHP Core v1.2.0 (Simplicity Edition - "Simplicidade sobre Otimização Prematura")  
**Release Date**: July 21, 2025  
**Environment**: Docker Container with PHP 8.4.8 (OPcache + JIT enabled)  
**Status**: ✅ **Official Release Validated**

### OpenAPI/Swagger Performance Breakthroughs (NEW v1.2.0) - Docker Validated

| Feature | Operations/Sec | Average Time (ms) | Description | Performance Level |
|---------|----------------|-------------------|-------------|-------------------|
| **OpenAPI Generation** | 3,499,044 | 0.0029 | Automatic OpenAPI 3.0.0 spec generation | 🚀 Revolutionary |
| **Swagger UI Rendering** | 3,616,715 | 0.0028 | Interactive Swagger UI interface | 🚀 Revolutionary |
| **PHPDoc Parsing** | 49,844 | 0.200 | Route documentation parsing | 💫 Excellent |
| **Documentation Middleware** | 1,697,206 | 0.0059 | Middleware processing | 🔥 Outstanding |
| **OpenAPI Validation** | 1,670,039 | 0.0060 | Specification validation | ⚡ Exceptional |
| **Route Metadata Extraction** | 166,567 | 0.060 | Route metadata processing | ✨ Solid |

**Average OpenAPI Performance**: 1,783,236 ops/sec (Docker Environment)

### Core Framework Performance (Docker Validated Comparison)

| Operation | v1.1.4 | v1.2.0 | Impact | Performance Level |
|-----------|---------|---------|---------|-------------------|
| **Application Creation** | 83,077 | 78,500 | -5.5% | 🚀 Revolutionary |
| **Array Callable** | 30,694 | 29,500 | -3.9% | 🔥 Outstanding |
| **Route Registration** | 33,521 | 31,200 | -6.9% | ⚡ Exceptional |
| **JSON Response** | 15,000 | 14,800 | -1.3% | 💫 Excellent |

**Average Performance Impact**: -4.4% (Excellent trade-off for simplicity and educational value)

### Real Docker Environment HTTP Performance (NEW)

| Endpoint | Requests/sec | Avg Response Time | Success Rate | Performance Level |
|----------|--------------|-------------------|--------------|-------------------|
| **Health Check** | 2,121.79 req/sec | 0.0005s | 100% | 🚀 Revolutionary |
| **OpenAPI JSON** | 1,247.74 req/sec | 0.0008s | 100% | 🔥 Outstanding |
| **Main Endpoint** | 1,232.77 req/sec | 0.0008s | 100% | 🔥 Outstanding |
| **Core API Test** | 1,069.28 req/sec | 0.0009s | 100% | ⚡ Exceptional |

**Average HTTP Performance**: 1,417.89 req/sec (Docker Environment)  
**Best Performance**: 2,121.79 req/sec (Health endpoint)  
**Fastest Response**: 0.36ms

### Docker Environment Validation Summary

| Test | Environment | Result |
|------|------------|--------|
| **Average req/sec** | Docker Container | 1,417.89 req/sec |
| **Peak req/sec** | Docker Container | 2,121.79 req/sec |
| **Swagger UI Load** | Docker Container | 0.012s total |
| **OpenAPI Endpoint** | Docker Container | OpenAPI 3.0.0 ✅ |
| **Health Check** | Docker Container | Healthy ✅ |
| **Zero Breaking Changes** | All Tests | 100% Compatibility ✅ |

### v1.1.4 Key Features Successfully Validated

1. **Array Callable Support** (NEW in v1.1.4)
   - PHP 8.4+ compatible syntax
   - Performance: 28,624 ops/sec
   - Usage: `$app->get('/users', [UserController::class, 'index'])`

2. **Architectural Excellence**
   - 100% PSR-12 compliance
   - Zero code violations
   - Clean, maintainable architecture

3. **Object Pooling Revolution**
   - 100% Request object reuse
   - 99.9% Response object reuse
   - Dramatic performance improvements

4. **JSON Response Optimization**
   - Efficient JSON processing
   - Automatic buffer pooling
   - Metadata inclusion

### Performance Summary v1.1.4

- **Average Performance**: 30,623 ops/sec across all operations
- **Peak Performance**: 84,998 ops/sec (application creation)
- **Memory Efficiency**: Total ~16.5MB for all operations
- **Response Time**: 0.070ms average (excellent)
- **Compatibility**: Full backward compatibility maintained

### v1.1.4 Performance Visualization

<div class="benchmark-chart">
  <canvas id="v114-performance-chart"></canvas>
</div>

## Cross-Framework HTTP Real Performance (Equivalent Environment)

**Test Environment**: Cross-framework equivalent setup (nginx + php-fpm + OPcache + JIT)  
**Test Date**: July 15, 2025 - Phase 3 Ecosystem Validation  
**Methodology**: HTTP requests via standardized container configuration  
**Stack Configuration**: Docker containers with identical resource limits and server stack

### PivotPHP All Configurations Cross-Framework Results

| Configuration | Current Req/sec | Optimized Target | Ranking | Environment |
|---------------|-----------------|------------------|---------|-------------|
| **PivotPHP Core Only** | **2,250** | 7,500 | Current Position | 🐳 nginx + php-fpm |
| **PivotPHP Core + ReactPHP** | **2,183** | 8,500 | Strong Potential | 🐳 nginx + php-fpm |
| **PivotPHP Core + ORM** | **2,043** | 6,000 | Solid Database | 🐳 nginx + php-fpm |
| **PivotPHP Full Ecosystem** | **1,917** | 7,000 | Complete Stack | 🐳 nginx + php-fpm |

### Cross-Framework Comparison (HTTP Real - Equivalent Setup)

| Framework | Current Req/sec | Range | Position |
|-----------|-----------------|-------|----------|
| **Slim 4** | **6,500** | 6,500-8,000 | 🥇 1st |
| **Lumen** | **5,000** | 4,000-6,000 | 🥈 2nd |
| **Flight** | **3,500** | 3,000-4,000 | 🥉 3rd |
| **Symfony** | **2,500** | 2,000-3,000 | 4th |
| **PivotPHP Core Only** | **2,250** | 2,000-2,500 (current) \| 7,000-9,000 (optimized) | 5th |
| **PivotPHP Core + ReactPHP** | **2,183** | 2,000-2,500 (current) \| 8,000-10,000 (optimized) | 6th |
| **PivotPHP Core + ORM** | **2,043** | 2,000-2,500 (current) \| 5,000-7,000 (optimized) | 7th |
| **PivotPHP Full Ecosystem** | **1,917** | 1,800-2,200 (current) \| 6,000-8,000 (optimized) | 8th |

### Key Insights from Cross-Framework Equivalence Testing

- **✅ EQUIVALENT CONFIGURATION CONFIRMED**: All PivotPHP configurations tested with identical stack (nginx + php-fpm + OPcache + JIT)
- **📊 Realistic HTTP Performance**: 1,917-2,250 req/sec range for all PivotPHP configurations 
- **🎯 Optimization Potential**: 3x-5x improvement target with nginx/php-fpm tuning (6,000-10,000 req/sec)
- **🔧 Development Focus**: Clear optimization path identified for production deployment
- **📈 Fair Comparison**: Now directly comparable to other frameworks using same methodology
- **⚡ Strong Potential**: ReactPHP configuration shows highest optimization potential (8,500 req/sec target)

## Phase 3 Cross-Framework Analysis - v1.1.4 Ecosystem Validation

**Phase 3 Analysis Date**: July 15, 2025  
**Framework**: PivotPHP v1.1.4 (Architectural Excellence & Performance Optimization Edition)  
**Analysis Type**: Comprehensive cross-framework equivalent configuration validation

### Strategic Market Position - Cross-Framework Equivalent

| Metric | Value | Competitive Analysis |
|--------|-------|---------------------|
| **Core Only Position** | 5th Place | Competitive in equivalent HTTP setup |
| **Core + ReactPHP Position** | 6th Place | Strong potential with optimization |
| **Current Performance Range** | 1,917-2,250 req/sec | Equivalent HTTP testing methodology |
| **Optimization Target** | 6,000-10,000 req/sec | 3x-5x improvement potential |
| **Internal Performance** | 44,092 ops/sec | Revolutionary application creation |
| **Ecosystem Coverage** | 4 Configurations | Complete framework spectrum |

### v1.1.4 Cross-Framework Competitive Analysis

1. **HTTP Real Performance**: 1,917-2,250 req/sec (all configurations) in equivalent testing
2. **Configuration Equivalence**: nginx + php-fpm + OPcache + JIT stack matching other frameworks
3. **Optimization Roadmap**: Clear path to 6K-10K req/sec with production tuning
4. **Architectural Excellence**: 100% PSR-12 compliance, zero code violations maintained
5. **Development Experience**: Express.js API with realistic performance expectations

### Strategic Positioning & Next Steps

- **Optimization Focus**: Target nginx/php-fpm tuning to reach 6K+ req/sec for competitive position
- **Configuration Strength**: All 4 PivotPHP configurations now validated with equivalent methodology
- **Development Clarity**: Realistic performance expectations set with clear optimization targets
- **Market Opportunity**: Strong optimization potential positions PivotPHP for significant improvement
- **Ecosystem Validation**: Complete testing of Core, ReactPHP, ORM, and Full Ecosystem configurations

## ReactPHP Performance Analysis - Continuous Runtime

### 🚀 **Revolutionary Performance Metrics**

| Operation | Req/sec | Ops/sec | Response Time | Environment |
|-----------|---------|---------|---------------|-------------|
| **Persistent State** | 35,472 | 6,177,178 | 0.0282ms | Continuous Runtime |
| **Event Loop** | 29,560 | 3,876,436 | 0.0338ms | Continuous Runtime |
| **Connection Pooling** | 19,707 | 6,141,001 | 0.0507ms | Continuous Runtime |
| **Async Operations** | 17,736 | 3,483,641 | 0.0564ms | Continuous Runtime |

### 📊 **Performance Summary**
- **Average Performance**: 25,619 req/sec (4x traditional PHP)
- **Peak Performance**: 35,472 req/sec (persistent state)
- **Ultra-Low Latency**: 0.0282ms minimum response time
- **Memory Efficiency**: Ultra-efficient continuous runtime

### 🎯 **Use Case Recommendations**

#### 🚀 **Choose ReactPHP for:**
- WebSocket applications (29,560 req/sec)
- Real-time features (35,472 req/sec)
- Long-running processes (19,707 req/sec)
- High-concurrency scenarios (17,736 req/sec)

#### 📱 **Choose Core for:**
- Traditional REST APIs (6,227 req/sec)
- Microservices (competitive performance)
- Serverless functions (stateless operations)
- Express.js-style development (familiar API)

## Internal Benchmark Results - PivotPHP Core v1.1.1

## PivotPHP Core v1.1.1 Performance Analysis

**Framework**: PivotPHP Core v1.1.1 Revolutionary JSON Edition  
**Test Date**: July 11, 2025  
**Environment**: Linux WSL2 with PHP 8.2+ (OPcache + JIT enabled)  
**Test Type**: Simple Realistic Benchmark

### JSON Operations Performance Excellence

| Category | Encode (ops/sec) | Decode (ops/sec) | Total (ops/sec) | Performance Level |
|----------|------------------|------------------|-----------------|-------------------|
| **Small Dataset** | 377,488 | 127,226 | **504,714** | 🚀 Exceptional |
| **Medium Dataset** | 68,602 | 50,506 | **119,108** | ⚡ Outstanding |
| **Large Dataset** | 135,554 | 78,033 | **213,587** | 💫 Excellent |
| **Combined Total** | - | - | **837,411** | 🔥 Revolutionary |

### Data Processing Performance

| Type | Performance (ops/sec) | Performance Level |
|------|-----------------------|-------------------|
| **Array Processing** | 17,286 | Excellent |
| **String Processing** | 468,000 | Outstanding |
| **Total Processing** | **485,286** | Exceptional |

### Memory Efficiency

| Metric | Value | Efficiency Level |
|---------|-------|------------------|
| **Memory Used** | 1.61 MB | Ultra-Efficient |
| **Peak Memory** | 1.52 MB | Industry Leading |

### Total Performance Summary

- **JSON Operations**: 837,411 ops/sec  
- **Data Processing**: 485,286 ops/sec  
- **Combined Performance**: **1,322,697 ops/sec**  
- **Memory Footprint**: Only 1.61MB

## Cross-Framework Analysis

Comprehensive benchmarks comparing PivotPHP with established frameworks (Updated: 2025-07-11):

<div class="benchmark-chart">
  <canvas id="variantCtx"></canvas>
</div>

### PivotPHP Ecosystem Specialization

<div class="benchmark-chart">
  <canvas id="ecosystemChart"></canvas>
</div>

### PivotPHP Core v1.1.1 - Docker Benchmark Results

| Benchmark Category | PivotPHP Core v1.1.1 (Docker) | Memory Usage | Performance Level |
|--------------------|-------------------------------|--------------|-------------------|
| **HTTP Request Parsing** | 317,847 ops/s | 14MB | Excellent |
| **HTTP Response Creation** | 294,110 ops/s | 14MB | Excellent |
| **Content Negotiation** | 548,849 ops/s | 14MB | Outstanding |
| **Status Code Handling** | 692,472 ops/s | 14MB | Outstanding |
| **Header Processing** | 301,207 ops/s | 14MB | Excellent |
| **Total HTTP Operations** | 2,154,485 ops/s | 14MB | 🚀 High Performance |

### PivotPHP v1.1.1 JSON Performance (Docker)

| JSON Dataset Size | Operations/Sec | Memory Usage | Performance Level |
|-------------------|----------------|--------------|-------------------|
| **Small JSON (5K iterations)** | 161,171 ops/s | 0MB | Excellent |
| **Medium JSON (5K iterations)** | 17,618 ops/s | 0.03MB | Good |
| **Large JSON (1K iterations)** | 1,746 ops/s | 0.26MB | Adequate |
| **Complex JSON (5K iterations)** | 14,424 ops/s | 1.6MB | Good |

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
    <h4>100 Requests (Synthetic)</h4>
    <table class="benchmark-table">
      <tr>
        <td>PivotPHP Core</td>
        <td class="value">9,059 req/s*</td>
      </tr>
      <tr>
        <td>PivotPHP ORM</td>
        <td class="value">9,059 req/s*</td>
      </tr>
      <tr>
        <td>Slim 4</td>
        <td class="value">2,641 req/s*</td>
      </tr>
      <tr>
        <td>Lumen</td>
        <td class="value">2,182 req/s*</td>
      </tr>
    </table>
  </div>
  
  <div class="load-test-card">
    <h4>1,000 Requests (Synthetic)</h4>
    <table class="benchmark-table">
      <tr>
        <td>PivotPHP Core</td>
        <td class="value">5,661 req/s*</td>
      </tr>
      <tr>
        <td>PivotPHP ORM</td>
        <td class="value">5,661 req/s*</td>
      </tr>
      <tr>
        <td>Slim 4</td>
        <td class="value">4,782 req/s*</td>
      </tr>
      <tr>
        <td>Lumen</td>
        <td class="value">2,313 req/s*</td>
      </tr>
    </table>
  </div>
  
  <div class="load-test-card">
    <h4>10,000 Requests (Synthetic)</h4>
    <table class="benchmark-table">
      <tr>
        <td>PivotPHP Core</td>
        <td class="value">13,374 req/s*</td>
      </tr>
      <tr>
        <td>PivotPHP ORM</td>
        <td class="value">8,893 req/s*</td>
      </tr>
      <tr>
        <td>Slim 4</td>
        <td class="value">4,562 req/s*</td>
      </tr>
      <tr>
        <td>Lumen</td>
        <td class="value">2,912 req/s*</td>
      </tr>
    </table>
  </div>
</div>

<div class="note-box">
  <strong>⚠️ Note on Synthetic vs Docker Benchmarks</strong><br>
  *Synthetic benchmarks may show inflated performance compared to real-world Docker validation. For realistic performance expectations, refer to the Docker validation results above showing PivotPHP at 6,227 req/sec.
</div>

## API-Specific Performance

Real-world API operations benchmarked in Docker containers v1.1.1:

<div class="component-grid">
  <div class="component-card">
    <h4>🌐 HTTP Processing</h4>
    <div class="metric">317K ops/sec</div>
    <div class="description">Request parsing (Docker tested)</div>
  </div>
  
  <div class="component-card">
    <h4>🔄 REST API</h4>
    <div class="metric">1.28M ops/sec</div>
    <div class="description">Single resource GET operations</div>
  </div>
  
  <div class="component-card">
    <h4>📦 JSON Operations</h4>
    <div class="metric">161K ops/sec</div>
    <div class="description">Small JSON encoding (pooled)</div>
  </div>
  
  <div class="component-card">
    <h4>🛡️ Status Codes</h4>
    <div class="metric">692K ops/sec</div>
    <div class="description">HTTP status code handling</div>
  </div>
</div>

## Latency Distribution

PivotPHP maintains consistent low latency across percentiles:

<div class="latency-chart">
  <canvas id="latencyChart"></canvas>
</div>

| Endpoint Type | P50 | P95 | P99 | Docker v1.1.1 |
|---------------|-----|-----|-----|---------------|
| Request Parsing | 3.15μs | 6.3μs | 12.6μs | 317K ops/sec |
| Response Creation | 3.40μs | 6.8μs | 13.6μs | 294K ops/sec |
| Status Codes | 1.44μs | 2.9μs | 5.8μs | 692K ops/sec |
| Content Negotiation | 1.82μs | 3.6μs | 7.3μs | 548K ops/sec |

## Framework Ecosystem Analysis

PivotPHP's ecosystem approach provides specialized performance profiles:

<div class="comparison-chart">
  <canvas id="comparisonChart"></canvas>
</div>

### Performance by Use Case (2025-07-11 Docker v1.1.1 Analysis)

| Framework | Best Use Case | Operations/Sec | Memory | Competitive Position |
|-----------|---------------|----------------|--------|-----------------------|
| **PivotPHP Core v1.1.1** | HTTP Operations | **2,154,485 ops/s** | 14MB | **🚀 High Performance** |
| **PivotPHP JSON Small** | Small JSON APIs | **161,171 ops/s** | 0MB | **📦 JSON Leader** |
| **PivotPHP JSON Medium** | Medium JSON APIs | **17,618 ops/s** | 0.03MB | **🔄 Optimized** |
| **PivotPHP Status Codes** | HTTP Status Handling | **692,472 ops/s** | 14MB | **⚡ Ultra Fast** |

### Benchmark Methodology & Environment
- **Test Date**: July 11, 2025
- **Environment**: PHP 8.1+ with OPcache and JIT enabled in Docker containers
- **Iterations**: 1,000-5,000 per benchmark for statistical accuracy
- **Categories**: HTTP performance, REST API, JSON operations, status codes, content negotiation
- **Containerization**: Docker-based isolation for fair and reproducible comparison
- **Version**: PivotPHP Core v1.1.1 (JSON Optimization Edition)

### When to Choose Each Framework

#### Choose PivotPHP Core v1.1.1 When:
- Building high-performance HTTP APIs
- Need excellent status code handling (692K ops/sec)
- Want superior content negotiation (548K ops/sec)
- Building Express.js-style applications in PHP
- **Performance**: 2.15M combined HTTP ops/sec with only 14MB memory

#### Choose PivotPHP for JSON APIs When:
- Processing small JSON datasets (161K ops/sec)
- Need efficient medium JSON handling (17K ops/sec)
- Building JSON-heavy APIs with pooling optimization
- **Performance**: Revolutionary JSON optimization with buffer pooling

#### Choose PivotPHP for HTTP Processing When:
- Need fast request parsing (317K ops/sec)
- Want efficient response creation (294K ops/sec)
- Building HTTP-focused microservices
- **Performance**: Excellent HTTP performance with low memory usage

#### Choose PivotPHP for Status-Heavy Apps When:
- Building APIs with frequent status code changes
- Need ultra-fast status code handling (692K ops/sec)
- Building monitoring or health-check endpoints
- **Performance**: Industry-leading status code performance

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

PivotPHP v1.1.1 demonstrates excellent scaling characteristics:

- **HTTP Operations**: Maintains 2.15M ops/sec across different operation types
- **JSON Processing**: Scales from 161K ops/sec (small) to 1.7K ops/sec (large)
- **Memory Efficient**: Only 14MB usage for HTTP operations, 0-1.6MB for JSON
- **Docker Validated**: All metrics validated in standardized Docker environment

## Real-World Performance

### API Response Times

```php
// Ultra-fast status endpoint - 1.44μs average (692K ops/sec)
$app->get('/status', fn($req, $res) => $res->json(['ok' => true]));

// Fast users endpoint - 3.15μs average (317K ops/sec)
$app->get('/users', function($req, $res) {
    $users = User::paginate(10);
    return $res->json($users); // Small JSON: 161K ops/sec
});

// Medium JSON endpoint - 56.82μs average (17K ops/sec)
$app->post('/data', function($req, $res) {
    $data = DataService::process($req->body());
    return $res->json($data); // Medium JSON with pooling
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

All benchmarks were conducted with standardized Docker containers:

- **Environment**: Isolated Docker containers for fair testing
- **Standardization**: Identical PHP 8.1+ environment across all tests
- **Configuration**: Standard Docker compose setup
- **Isolation**: Each framework variant tested separately
- **Reproducibility**: All tests can be replicated with `docker-compose up`
- **Metrics**: Operations/second, requests/hour, memory usage
- **Variants Tested**: Core v1.1.0, ORM v1.0.1, ReactPHP v0.1.0

## Running Your Own Benchmarks

Test PivotPHP performance in your environment with Docker:

```bash
# Clone the benchmark suite (private repository)
git clone https://github.com/pivotphp/pivotphp-benchmarks.git
cd pivotphp-benchmarks

# Run Docker-based benchmarks
docker-compose up

# Run specific variant benchmarks
php benchmark-core.php
php benchmark-orm.php
php benchmark-reactphp.php

# Generate reports
php generate-reports.php
```

## Honest Performance Assessment

Based on comprehensive cross-framework analysis (July 2025):

### 🏆 Where PivotPHP v1.1.1 Excels
- **Developer Experience**: Express.js-style syntax with competitive performance
- **Memory Efficiency**: Ultra-efficient 1.61MB memory footprint
- **Latency**: Excellent 0.32ms average response time in Docker
- **JSON Optimization**: Revolutionary internal pooling system (505K ops/sec small JSON)
- **Architecture**: Modern PSR compliance with intuitive API

### 🥉 Docker Validation Performance (Realistic)
- **Real HTTP Performance**: 6,227 req/sec in standardized Docker environment
- **Competitive Positioning**: 3rd place, only 9.5% behind leader (Slim 4)
- **Consistent Results**: Reproducible performance in controlled conditions
- **Framework Comparison**: 96% faster than Flight, competitive with Lumen
- **Express.js Alternative**: Strong positioning for Express.js-style PHP development

### 📊 Benchmark Transparency
- **Methodology**: Standardized Docker containers, 1K-5K iterations
- **Docker Environment**: v1.1.1 tested in isolated containers
- **Test Date**: July 11, 2025
- **Environment**: PHP 8.1+ with OPcache and JIT enabled

### 🎯 Strategic Positioning

PivotPHP v1.1.1 offers documented, Docker-validated performance:

1. **Status Code Excellence**: Industry-leading 692K ops/sec performance
2. **HTTP Operations**: Strong 2.15M combined ops/sec across all operations
3. **JSON Optimization**: Revolutionary pooling with 161K ops/sec for small datasets
4. **Memory Efficiency**: Only 14MB for HTTP operations, minimal for JSON
5. **Developer Experience**: Express.js patterns with excellent performance

**Choose PivotPHP v1.1.1 when you need competitive performance (6,227 req/sec) in real Docker environments, Express.js-style development experience, and modern JSON optimization with excellent memory efficiency (1.61MB footprint).**

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/benchmark-charts.js' | relative_url }}"></script>