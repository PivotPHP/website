# Estrutura de URLs do PivotPHP Website

## 📋 Visão Geral

Este documento descreve a estrutura de URLs do website do PivotPHP, garantindo equivalência entre idiomas para facilitar a troca de idiomas.

## 🔗 Estrutura de URLs

### URLs Equivalentes Entre Idiomas

Para facilitar a troca de idiomas, mantemos URLs estruturalmente idênticas:

```
Inglês (EN)         →  Português (PT)
/                   →  /pt/
/docs/              →  /pt/docs/
/docs/installation/ →  /pt/docs/installation/
/docs/quickstart/   →  /pt/docs/quickstart/
/docs/configuration/→  /pt/docs/configuration/
/docs/routing/      →  /pt/docs/routing/
/docs/middleware/   →  /pt/docs/middleware/
...
```

### 📁 Estrutura de Arquivos

```
_docs/                    # Documentação em inglês
├── index.md              # /docs/
├── installation.md       # /docs/installation/
├── quickstart.md         # /docs/quickstart/
├── configuration.md      # /docs/configuration/
├── routing.md            # /docs/routing/
├── middleware.md         # /docs/middleware/
├── requests-responses.md # /docs/requests-responses/
├── container.md          # /docs/container/
├── security.md           # /docs/security/
├── events.md             # /docs/events/
├── validation.md         # /docs/validation/
├── database.md           # /docs/database/
├── providers.md          # /docs/providers/
├── testing.md            # /docs/testing/
├── deployment.md         # /docs/deployment/
└── why-pivotphp.md       # /docs/why-pivotphp/

pt/docs/                  # Documentação em português
├── index.md              # /pt/docs/
├── installation.md       # /pt/docs/installation/
├── quickstart.md         # /pt/docs/quickstart/
├── configuration.md      # /pt/docs/configuration/
├── routing.md            # /pt/docs/routing/
├── middleware.md         # /pt/docs/middleware/
├── requests-responses.md # /pt/docs/requests-responses/
├── container.md          # /pt/docs/container/
├── security.md           # /pt/docs/security/
├── events.md             # /pt/docs/events/
├── validation.md         # /pt/docs/validation/
├── database.md           # /pt/docs/database/
├── providers.md          # /pt/docs/providers/
├── testing.md            # /pt/docs/testing/
├── deployment.md         # /pt/docs/deployment/
└── why-pivotphp.md       # /pt/docs/why-pivotphp/
```

## 🔧 Configuração Técnica

### 1. Permalinks nos Arquivos

**Inglês (_docs/*.md):**
```yaml
---
layout: docs
title: "Page Title"
permalink: /docs/page-name/
---
```

**Português (pt/docs/*.md):**
```yaml
---
layout: docs-i18n
title: "Título da Página"
permalink: /pt/docs/page-name/
lang: pt
---
```

### 2. Sistema de Rotas JavaScript

O arquivo `assets/js/language-routes.js` mapeia as URLs equivalentes:

```javascript
mappings: {
    '/': '/pt/',
    '/docs/': '/pt/docs/',
    '/docs/installation/': '/pt/docs/installation/',
    '/docs/quickstart/': '/pt/docs/quickstart/',
    // ... outros mapeamentos
}
```

### 3. Sidebar de Navegação

O arquivo `_includes/docs-sidebar-i18n.html` usa URLs equivalentes:

```html
<li><a href="{{ lang_prefix | append: '/docs/installation/' | relative_url }}">{{ t.nav.installation }}</a></li>
<li><a href="{{ lang_prefix | append: '/docs/quickstart/' | relative_url }}">{{ t.nav.quick_start }}</a></li>
```

## ✅ Vantagens desta Estrutura

1. **Troca de Idiomas Facilitada**: URLs estruturalmente idênticas permitem conversão automática
2. **SEO Consistente**: Estrutura clara e previsível
3. **Manutenção Simplificada**: Padrão consistente entre idiomas
4. **Navegação Intuitiva**: Usuários podem prever URLs em diferentes idiomas

## 📝 Regras de Nomenclatura

### Para Novos Documentos

1. **Nome do Arquivo**: Use o mesmo nome em inglês e português
   - ✅ `security.md` (EN) + `security.md` (PT)
   - ❌ `security.md` (EN) + `seguranca.md` (PT)

2. **Permalink**: Use o mesmo slug em ambos os idiomas
   - ✅ `/docs/security/` (EN) + `/pt/docs/security/` (PT)
   - ❌ `/docs/security/` (EN) + `/pt/docs/seguranca/` (PT)

3. **Título**: Traduza apenas o título, não o permalink
   - EN: `title: "Security"`
   - PT: `title: "Segurança"`

### Para Links Internos

Use sempre o permalink inglês como base:
```html
<!-- ✅ Correto -->
<a href="{{ '/pt/docs/security/' | relative_url }}">Segurança</a>

<!-- ❌ Incorreto -->
<a href="{{ '/pt/docs/seguranca/' | relative_url }}">Segurança</a>
```

## 🔍 Teste de Verificação

Para verificar se as URLs estão funcionando corretamente:

1. **Teste Manual**: Navegar entre idiomas usando o seletor
2. **Teste de Links**: Verificar se todos os links internos funcionam
3. **Teste de Rotas**: Confirmar que URLs equivalentes carregam conteúdo correto

## 🚀 Deployment

Após mudanças na estrutura de URLs:

1. Atualizar `language-routes.js` se necessário
2. Verificar todos os links internos
3. Testar troca de idiomas
4. Reiniciar o Jekyll para aplicar mudanças

---

**Mantido por**: Equipe PivotPHP
**Última atualização**: {{ 'now' | date: '%d/%m/%Y' }}
