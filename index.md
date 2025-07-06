---
layout: home
title: The Evolutionary PHP Microframework
---

<!-- Metrics Section -->
<section class="metrics">
    <div class="metric">
        <div class="metric-value">52M+</div>
        <div class="metric-label">Ops/Second</div>
    </div>
    <div class="metric">
        <div class="metric-value">PSR-15</div>
        <div class="metric-label">Compliant</div>
    </div>
    <div class="metric">
        <div class="metric-value">270+</div>
        <div class="metric-label">Tests</div>
    </div>
    <div class="metric">
        <div class="metric-value">Zero</div>
        <div class="metric-label">Configuration</div>
    </div>
</section>

<!-- Value Props Section -->
<section class="value-props">
    <div class="container">
        <div class="props-grid">
            <div class="prop-item">
                <span class="prop-icon">🧬</span>
                <h3 class="prop-title">Evolutionary Architecture</h3>
                <p class="prop-desc">Adapts to your needs with a flexible, extensible design</p>
            </div>
            <div class="prop-item">
                <span class="prop-icon">⚡</span>
                <h3 class="prop-title">52M+ Operations/Second</h3>
                <p class="prop-desc">Blazing fast performance optimized for modern PHP</p>
            </div>
            <div class="prop-item">
                <span class="prop-icon">🛡️</span>
                <h3 class="prop-title">Security by Design</h3>
                <p class="prop-desc">Built-in CSRF, XSS protection, and rate limiting</p>
            </div>
            <div class="prop-item">
                <span class="prop-icon">🔧</span>
                <h3 class="prop-title">Zero Configuration</h3>
                <p class="prop-desc">Start building immediately with sensible defaults</p>
            </div>
        </div>
    </div>
</section>

<!-- Code Example -->
<section class="code-preview">
    <div class="container">
        <h3 class="code-header">Express.js-like Syntax for PHP Developers</h3>
        <pre><code>use Helix\Core\Application;

$app = new Application();

$app->get('/', function($req, $res) {
    return $res->json(['message' => 'Welcome to HelixPHP']);
});

$app->post('/users', function($req, $res) {
    $user = User::create($req->body());
    return $res->status(201)->json($user);
});

$app->run();</code></pre>
    </div>
</section>