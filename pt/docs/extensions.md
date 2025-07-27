---
layout: docs
title: Extensões
permalink: /pt/docs/extensions/
lang: pt
---

O PivotPHP tem um ecossistema rico de extensões que adicionam recursos poderosos ao framework principal. Estes pacotes modulares permitem que você escolha exatamente o que precisa para seu projeto.

## Extensões Oficiais

### Banco de Dados & ORM

#### [Cycle ORM v1.0.1](/pt/docs/extensions/cycle-orm/)
Um poderoso ORM DataMapper que fornece uma solução completa de banco de dados com configuração zero.

```bash
composer require pivotphp/cycle-orm
```

**Recursos:**
- Configuração zero com padrões sensatos
- Geração automática de esquema e migrações
- Padrão repository com cache de performance
- Suporte a relacionamentos complexos
- Middleware de transação
- Conexões múltiplas de banco de dados (SQLite, MySQL)
- Monitoramento de performance e profiling de consultas

### Runtime Assíncrono

#### [Extensão ReactPHP v0.0.2](/pt/docs/extensions/reactphp/)
Runtime contínuo pronto para produção usando arquitetura orientada a eventos do ReactPHP para aplicações de alta performance.

```bash
composer require pivotphp/reactphp
```

**Recursos:**
- Servidor HTTP contínuo sem reinicializações (40K+ req/s)
- Compatibilidade com bridge PSR-7 e proteção de estado global
- I/O orientado a eventos e não-bloqueante
- Gerenciamento e isolamento de memória
- Manipulação de desligamento gracioso
- Pronto para deploy em produção

## Extensões da Comunidade

O ecossistema PivotPHP foi projetado para ser extensível! Estamos animados com as extensões que a comunidade criará.

### Extensões Oficiais Disponíveis

- **[pivotphp/core](https://packagist.org/packages/pivotphp/core)** - Framework principal ([GitHub](https://github.com/PivotPHP/pivotphp-core))
- **[pivotphp/cycle-orm](https://packagist.org/packages/pivotphp/cycle-orm)** - Integração Cycle ORM ([GitHub](https://github.com/PivotPHP/pivotphp-cycle-orm))
- **[pivotphp/reactphp](https://packagist.org/packages/pivotphp/reactphp)** - Runtime assíncrono ReactPHP ([GitHub](https://github.com/PivotPHP/pivotphp-reactphp))

### Recursos Integrados

O framework PivotPHP Core já inclui vários recursos avançados:

- **OpenAPI/Swagger** - Geração automática de documentação de API via utilitário `OpenApiExporter`
- **Modo Alta Performance** - Object pooling e lazy loading (v1.2.0)
- **Otimização JSON** - Buffer pooling automático para operações JSON (v1.2.0)
- **Middleware de Segurança** - Proteção CSRF, XSS e rate limiting integrados
- **Monitoramento de Performance** - Métricas em tempo real e ferramentas de profiling

### Extensões Planejadas

Estamos planejando desenvolver ou apoiar o desenvolvimento da comunidade para:

- **Sistema de Queue** - Processamento de jobs em background com múltiplos drivers
- **Cache Avançado** - Cache multi-driver (Redis, Memcached, Arquivo)
- **Serviço de Email** - Abstração de email com suporte a provedores
- **Servidor WebSocket** - Comunicação bidirecional em tempo real
- **GraphQL** - Suporte a linguagem de consulta de API moderna
- **Painel Admin** - Interfaces admin auto-geradas
- **Utilitários de Teste** - Helpers e assertions aprimorados para testes

Confira nossa [organização no GitHub]({{ site.github_url }}) e [Packagist](https://packagist.org/packages/pivotphp/) para atualizações sobre novas extensões.

## Criando Extensões

As extensões no PivotPHP seguem um padrão simples usando Service Providers:

```php
namespace SeuVendor\SuaExtensao;

use PivotPHP\Core\Providers\ServiceProvider;

class SuaExtensaoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Registrar serviços
        $this->container->singleton('seu-servico', function($container) {
            return new SeuServico($container);
        });
    }
    
    public function boot(): void
    {
        // Inicializar extensão
        // Registrar rotas, middleware, etc.
    }
}
```

### Estrutura da Extensão

Uma estrutura típica de extensão PivotPHP:

```
sua-extensao/
├── src/
│   ├── Providers/
│   │   └── SuaExtensaoServiceProvider.php
│   ├── Services/
│   ├── Middleware/
│   └── Commands/
├── config/
│   └── sua-extensao.php
├── tests/
├── composer.json
└── README.md
```

### Publicando uma Extensão

1. Crie sua extensão seguindo a estrutura acima
2. Registre no Packagist com a convenção de nomenclatura: `vendor/pivotphp-{nome-extensao}`
3. Marque suas versões seguindo versionamento semântico
4. Envie para a lista de extensões oficiais via PR

## Diretrizes para Extensões

- Siga os padrões PSR (PSR-4, PSR-12)
- Inclua testes abrangentes
- Forneça documentação clara
- Use versionamento semântico
- Seja compatível com a versão mais recente do PivotPHP