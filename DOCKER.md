# 🐳 Configuração Docker para Jekyll

Esta configuração permite desenvolver e testar o site Jekyll sem instalar Ruby localmente.

## 🚀 Quick Start

```bash
# Build da imagem Docker
docker-compose build

# Iniciar servidor de desenvolvimento
docker-compose up jekyll

# Acessar: http://localhost:4000
```

## 📋 Comandos Disponíveis

### Desenvolvimento

```bash
# Servidor com hot-reload (recomendado para desenvolvimento)
docker-compose up jekyll

# Acesse: http://localhost:4000
# LiveReload na porta 35729
```

### Build e Validação

```bash
# Build de produção
docker-compose run --rm jekyll-build

# Testar build de produção localmente
docker-compose up jekyll-production

# Script completo de validação
./validate-site.sh
```

### Usando Makefile

```bash
make docker-serve      # Desenvolvimento
make docker-build      # Build produção
make docker-prod       # Testar produção
make docker-validate   # Validar tudo
make docker-clean      # Limpar cache
```

## 🔧 Estrutura Docker

### Dockerfile

Baseado em `ruby:3.1-slim` com:
- Build essentials
- Git
- Bundler 2.4.22
- Todas as gems do Gemfile

### docker-compose.yml

Três serviços configurados:

1. **jekyll**: Desenvolvimento com hot-reload
2. **jekyll-build**: Build de produção
3. **jekyll-production**: Servidor de produção para testes

### Volume Cache

```yaml
volumes:
  bundle_cache:  # Cache de gems entre rebuilds
```

## 🔍 Validação

O script `validate-site.sh` verifica:

1. ✅ Build sem erros
2. ✅ Redirects configurados (~27 esperados)
3. ✅ Estrutura PT-BR presente
4. ✅ Links internos funcionando

```bash
# Executar validação completa
./validate-site.sh

# Verificar manualmente
docker-compose run --rm jekyll-build
ls -la _site/pt/docs/
find _site -name "*.html" -path "*docs*" | wc -l
```

### Configuração de DNS do Docker (Importante)

DNS para baixar imagens base não pode ser configurado via Dockerfile. Ele é responsabilidade do daemon do Docker no host.

Use o script de configuração:

```bash
cd website/
sudo ./setup-docker-dns.sh

# Opcional: definir servidores DNS
sudo DNS_LIST="1.1.1.1,8.8.8.8" ./setup-docker-dns.sh

# Depois, re-tente o build
docker-compose build
```

Se preferir, configure manualmente em `/etc/docker/daemon.json`:

```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

Reinicie o serviço:

```bash
sudo systemctl restart docker || sudo service docker restart
```

## 🐛 Troubleshooting

### Build Lento

```bash
# Cache das gems está funcionando?
docker volume ls | grep bundle_cache

# Reconstruir do zero se necessário
docker-compose build --no-cache
```

### Erros de Permissão

```bash
# Ajustar permissões do _site
sudo chown -R $USER:$USER _site .jekyll-cache
```

### Porta 4000 em Uso

```bash
# Verificar processos
lsof -i :4000

# Ou usar porta diferente
docker-compose run --rm -p 4001:4000 jekyll
```

### Problemas de Rede/DNS

Se houver erro ao baixar imagens Docker:
```bash
# Verificar conectividade
ping docker.io

# Verificar DNS
cat /etc/resolv.conf

# Reconstruir com cache local
docker-compose build
```

## 📦 Dependências

Instaladas automaticamente via `Gemfile`:

- **github-pages** (~228): Inclui Jekyll + plugins permitidos
- **jekyll-redirect-from**: Para redirects 301
- **webrick** (~1.7): Servidor web para Ruby 3+
- **faraday-retry**: Compatibilidade Faraday v2.0+

## 🔄 Workflow Recomendado

### Para Desenvolvimento

```bash
# 1. Iniciar container
docker-compose up jekyll

# 2. Editar arquivos normalmente
# 3. Ver mudanças em tempo real
# 4. Ctrl+C para parar
```

### Para Deploy

```bash
# 1. Validar antes de commit
./validate-site.sh

# 2. Verificar build de produção
docker-compose run --rm jekyll-build

# 3. Commit e push
git add .
git commit -m "Atualizar documentação"
git push origin main

# 4. GitHub Pages faz deploy automático
```

## 🌐 Variáveis de Ambiente

```yaml
# Desenvolvimento
JEKYLL_ENV=development
  - Drafts habilitados
  - Source maps CSS
  - Mensagens debug

# Produção
JEKYLL_ENV=production
  - Assets minificados
  - URLs absolutas
  - Otimizações ativas
```

## 📝 Notas

- **Volume Persistente**: Gems ficam em cache entre builds
- **Hot Reload**: Mudanças aparecem automaticamente no browser
- **Force Polling**: Necessário para sistemas de arquivos virtualizados
- **Incremental Build**: Rebuild apenas arquivos modificados
