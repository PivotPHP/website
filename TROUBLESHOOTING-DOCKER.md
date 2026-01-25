# 🚨 Problemas de Rede Docker - Soluções

## Problema Identificado

```
dial tcp: lookup registry-1.docker.io: no such host
```

Isso indica problema de DNS ou conectividade de rede do Docker.

## ✅ Soluções

### 1. Verificar Conectividade

```bash
# Testar DNS
ping registry-1.docker.io
ping docker.io

# Verificar DNS do sistema
cat /etc/resolv.conf

# Testar com Google DNS
nslookup registry-1.docker.io 8.8.8.8
```

### 2. Configurar DNS do Docker

Edite `/etc/docker/daemon.json`:

```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

Reinicie o Docker:

```bash
sudo systemctl restart docker
```

### 3. Usar Proxy HTTP (se aplicável)

```json
{
  "proxies": {
    "http-proxy": "http://proxy.example.com:3128",
    "https-proxy": "http://proxy.example.com:3128",
    "no-proxy": "localhost,127.0.0.1"
  }
}
```

### 4. Alternativa: GitHub Actions

Se o Docker local não funcionar, use GitHub Actions para validar:

```yaml
# .github/workflows/jekyll-validation.yml
name: Validar Jekyll

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true

      - name: Build site
        run: bundle exec jekyll build --verbose

      - name: Verificar redirects
        run: |
          find _site -name "*.html" -path "*docs*" | wc -l

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: site
          path: _site/
```

### 5. Alternativa: Ruby Local

Se preferir instalar Ruby localmente:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ruby-full build-essential zlib1g-dev

# Configurar gems no home
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Instalar bundler
gem install bundler

# No diretório website/
bundle install
bundle exec jekyll serve
```

### 6. Usar Imagem Pre-baixada

Se você tiver acesso a outro ambiente com Docker:

```bash
# Em máquina com rede
docker pull ruby:3.1-slim
docker save ruby:3.1-slim > ruby-3.1-slim.tar

# Transferir arquivo .tar para sua máquina

# Na sua máquina
docker load < ruby-3.1-slim.tar

# Agora o build deve funcionar
docker-compose build
```

## 🔍 Diagnóstico

Execute para verificar o problema:

```bash
# Docker está rodando?
docker ps

# DNS do Docker
docker run --rm alpine nslookup registry-1.docker.io

# Configuração atual
cat /etc/docker/daemon.json 2>/dev/null || echo "Arquivo não existe"

# Logs do Docker
sudo journalctl -u docker.service | tail -50
```

## 📋 Status Atual

- ✅ Configuração Docker criada
- ✅ Dockerfile otimizado
- ✅ docker-compose.yml configurado
- ✅ Scripts de validação prontos
- ❌ **Problema de rede impede build da imagem**

## 🎯 Recomendação

**Curto prazo**: Use GitHub Actions para validação (deploy já funciona via GH Pages)

**Médio prazo**: Configure DNS do Docker conforme solução #2

**Longo prazo**: Considere usar Dev Container do VS Code com imagem pre-built
