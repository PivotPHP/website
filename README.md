# PivotPHP Website

Site oficial e documentação do PivotPHP, construído com Jekyll para GitHub Pages.

## 🐳 Desenvolvimento com Docker (Recomendado)

Não requer instalação de Ruby no sistema!

### Quick Start

```bash
# Ver comandos disponíveis
make help

# Iniciar servidor de desenvolvimento
make docker-serve

# Validar site completo
make docker-validate
```

### Comandos Docker

```bash
# Desenvolvimento com hot-reload
make docker-serve           # http://localhost:4000

# Build de produção
make docker-build

# Testar build de produção
make docker-prod

# Validar redirects e links
make docker-validate

# Limpar cache
make docker-clean
```

## 💎 Desenvolvimento Local (Alternativo)

Requer Ruby 2.7+ instalado no sistema.

### Pré-requisitos

```bash
# Instalar Ruby e Bundler
sudo apt-get install ruby-full build-essential
gem install bundler
```

### Setup

```bash
# Instalar dependências
make install

# Servidor de desenvolvimento
make serve

# Build
make build
```

## 📁 Estrutura

```
website/
├── _config.yml              # Configuração Jekyll
├── _layouts/                # Layouts de página
├── _includes/               # Componentes reutilizáveis
├── pt/
│   └── docs/               # Documentação PT-BR (principal)
├── _sass/                   # Estilos SCSS
├── assets/                  # Imagens, CSS, JS
├── docker-compose.yml       # Configuração Docker
├── validate-site.sh         # Script de validação
└── Makefile                 # Comandos make
```

## ✍️ Adicionando Documentação

1. Criar arquivo markdown em `pt/docs/`
2. Adicionar front matter com layout e permalink
3. Configurar redirects se necessário

Exemplo:
```markdown
---
layout: docs
title: Título da Página
permalink: /pt/docs/sua-pagina/
redirect_from:
  - /docs/sua-pagina/
  - /en/docs/your-page/
---

# Título da Página

Seu conteúdo aqui...
```

## 🔄 Redirects

O site usa `jekyll-redirect-from` para manter compatibilidade com URLs antigas:

```yaml
redirect_from:
  - /docs/old-url/
  - /en/docs/old-url/
```

## 🚀 Deploy

Deploy automático para GitHub Pages ao fazer push na branch main.

### Validação Pré-Deploy

```bash
# Validar antes de commit
make docker-validate

# Verificar output
ls -la _site/pt/docs/
```

## 🌐 Documentação

- **Documentação Principal**: `pt/docs/` (PT-BR)
- **Internacionalização**: Planejada para futuras versões
- **Versão Atual**: v2.0.0

## 📝 License

MIT License - veja o arquivo LICENSE do projeto principal.
