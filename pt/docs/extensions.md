---
layout: docs-i18n
title: Extensões
permalink: /pt/docs/extensions/
lang: pt
---

O PivotPHP suporta várias extensões para aprimorar sua funcionalidade. Estas extensões são pacotes opcionais que se integram perfeitamente com o framework principal.

## Extensões Disponíveis

### Extensões Oficiais

- **[Cycle ORM](/pt/docs/extensions/cycle-orm/)** - ORM completo com geração de esquema, migrações e relações
- Mais extensões em breve...

### Extensões da Comunidade

A comunidade PivotPHP está desenvolvendo ativamente extensões. Confira nossa [organização no GitHub]({{ site.github_url }}) para os pacotes mais recentes.

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