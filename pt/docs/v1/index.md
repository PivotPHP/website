---
redirect_from:
  - /docs/index/
  - /en/docs/index/
  - /en/index/
layout: docs
title: Bem-vindo ao PivotPHP
permalink: /pt/docs/v1/
lang: pt
version: "1.2.0"
---

<div style="text-align: center; margin: 2rem 0 3rem;">
  <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">🚀 PivotPHP v1.2.0</h1>
  <p class="lead" style="font-size: 1.25rem; color: var(--pivot-primary);">O microframework PHP evolutivo reimaginado</p>
  <p style="font-size: 1.1rem; opacity: 0.85;">Simplicidade Educacional • Documentação Automática • Performance Excepcional</p>
</div>

<div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%); border-left: 4px solid rgba(34, 197, 94, 0.8); padding: 1.5rem; margin: 2rem 0; border-radius: 8px;">
  <h3 style="margin-top: 0;">🎉 Release v1.2.0 - "Simplicidade sobre Otimização Prematura"</h3>
  <p><strong>21 de julho de 2025</strong> - Release oficial com documentação OpenAPI/Swagger automática, arquitetura simplificada e foco educacional mantendo excelente performance.</p>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
    <div><strong>Swagger UI:</strong> 3,6M ops/seg</div>
    <div><strong>HTTP Pico:</strong> 2.122 req/seg</div>
    <div><strong>Resposta:</strong> 0,36ms (mínima)</div>
    <div><strong>Docker:</strong> ✅ Validado</div>
  </div>
</div>

## 💡 Por que PivotPHP?

PivotPHP traz a **simplicidade e elegância do Express.js** para o ecossistema PHP, com **documentação automática OpenAPI/Swagger** e arquitetura reimaginada. Ideal para:

- **🎓 Aprendizado**: Padrões modernos em PHP sem complexidade
- **⚡ Prototipagem**: Do conceito ao deploy em minutos
- **📚 Documentação**: Swagger UI automático via PHPDoc
- **🚀 APIs Modernas**: REST, middleware, injeção de dependência
- **🔬 Proof of Concept**: Validação rápida de ideias

---

## 🎯 Início Rápido

### Instalação

```bash
composer create-project pivotphp/skeleton meu-projeto
cd meu-projeto
php -S localhost:8000 -t public
```

### Seu Primeiro Endpoint

```php
<?php
use PivotPHP\Core\Application;

$app = new Application();

/**
 * @api {get} /hello/:name Saudação personalizada
 */
$app->get('/hello/:name', function($req, $res) {
    $name = $req->params['name'];
    $res->json(['message' => "Olá, $name!"]);
});

$app->run();
```

**Swagger automático em** `/swagger` 🎉

---

## 🌟 Recursos Principais

### 📚 Documentação Automática OpenAPI/Swagger
**Performance revolucionária**: 3,6M+ ops/seg para geração Swagger UI

- **OpenAPI 3.0.0 automático** baseado em PHPDoc
- **Swagger UI interativo** disponível em `/swagger`
- **Performance excepcional**: 3,5M ops/seg geração + 3,6M render
- **Zero configuração**: Apenas documente seus endpoints

### ⚡ Performance Validada em Docker

| Métrica | Valor |
|---------|-------|
| **HTTP Pico** | 2.122 req/seg |
| **HTTP Médio** | 1.418 req/seg |
| **OpenAPI Médio** | 1,78M ops/seg |
| **Resposta Mínima** | 0,36ms |

### 🛡️ Segurança Integrada

- ✅ **Proteção CSRF** automática
- ✅ **Prevenção XSS** em templates
- ✅ **Rate Limiting** configurável
- ✅ **Validação de entrada** robusta
- ✅ **Headers de segurança** por padrão

### 🔧 Zero Configuração

```php
<?php
require 'vendor/autoload.php';

$app = new PivotPHP\Core\Application();
$app->get('/', fn($req, $res) => $res->json(['status' => 'ok']));
$app->run();
```

### 📦 Compatibilidade PSR

- **PSR-7**: Mensagens HTTP padronizadas
- **PSR-15**: Middleware universalmente compatível
- **PSR-12**: Código limpo e consistente
- **PSR-4**: Autoloading moderno

---

## 🤝 Comunidade e Suporte

- **GitHub**: [github.com/pivotphp/pivotphp-core](https://github.com/pivotphp/pivotphp-core)
- **Issues**: [Reporte bugs](https://github.com/pivotphp/pivotphp-core/issues)
- **Discussões**: [Comunidade](https://github.com/pivotphp/pivotphp-core/discussions)
- **Packagist**: [packagist.org/packages/pivotphp/core](https://packagist.org/packages/pivotphp/core)

---

## 📄 Licença

PivotPHP é software de código aberto licenciado sob a **[MIT License](https://opensource.org/licenses/MIT)**.

Desenvolvido no Brasil 🇧🇷 com foco em educação e simplicidade.
