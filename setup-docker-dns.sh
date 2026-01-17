#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Configurando DNS do Docker..."

# Este script deve ser executado com sudo:
#   sudo ./setup-docker-dns.sh

DAEMON_DIR="/etc/docker"
DAEMON_FILE="$DAEMON_DIR/daemon.json"
TIMESTAMP="$(date +%F-%H%M%S)"

# DNS padrão (pode sobrescrever com DNS_LIST="1.1.1.1,8.8.8.8")
DNS_LIST_DEFAULT="8.8.8.8,8.8.4.4"
DNS_LIST="${DNS_LIST:-$DNS_LIST_DEFAULT}"

echo "[1/4] Verificando Docker..."
if ! command -v docker >/dev/null 2>&1; then
  echo "✗ Docker não encontrado. Instale o Docker e tente novamente."
  exit 1
fi
if ! systemctl is-active --quiet docker 2>/dev/null; then
  echo "⚠ Serviço Docker não está ativo. Tentando iniciar..."
  if command -v systemctl >/dev/null 2>&1; then
    sudo systemctl start docker || true
  fi
fi
echo "✓ Docker está rodando"

echo "[2/4] Configurando daemon.json..."
mkdir -p "$DAEMON_DIR"

# Backup se existir
if [ -f "$DAEMON_FILE" ]; then
  cp "$DAEMON_FILE" "${DAEMON_FILE}.bak.${TIMESTAMP}"
  echo "• Backup criado: ${DAEMON_FILE}.bak.${TIMESTAMP}"
fi

# Gerar lista JSON de DNS
DNS_JSON=$(printf '"%s",' ${DNS_LIST//,/ } | sed 's/,$//')

cat > "$DAEMON_FILE" <<EOF
{
  "dns": [${DNS_JSON}]
}
EOF
echo "✓ Arquivo atualizado: $DAEMON_FILE"

echo "[3/4] Reiniciando serviço Docker..."
if command -v systemctl >/dev/null 2>&1; then
  systemctl restart docker || {
    echo "⚠ Falha ao reiniciar via systemctl, tentando via service..."
    service docker restart || true
  }
else
  service docker restart || true
fi
echo "✓ Docker reiniciado"

echo "[4/4] Testando resolução DNS dentro de container..."
docker run --rm alpine:3.19 nslookup registry-1.docker.io || {
  echo "⚠ Falha em resolver registry-1.docker.io. Verifique sua rede/DNS."
  echo "Sugestão: tente DNS_LIST=1.1.1.1,8.8.8.8"
}

echo "✅ Concluído. Agora tente: docker-compose build"
#!/bin/bash
# Script para configurar DNS do Docker

set -e

echo "🔧 Configurando DNS do Docker..."
echo

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se Docker está rodando
echo -e "${YELLOW}[1/4] Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não está instalado${NC}"
    exit 1
fi

if ! docker ps &> /dev/null; then
    echo -e "${RED}✗ Docker não está rodando ou sem permissões${NC}"
    echo "Tente: sudo systemctl start docker"
    exit 1
fi

echo -e "${GREEN}✓ Docker está rodando${NC}"
echo

# 2. Criar/atualizar daemon.json
echo -e "${YELLOW}[2/4] Configurando daemon.json...${NC}"

DAEMON_JSON="/etc/docker/daemon.json"

# Backup do arquivo original se existir
if [ -f "$DAEMON_JSON" ]; then
    echo "   Fazendo backup de $DAEMON_JSON"
    sudo cp "$DAEMON_JSON" "$DAEMON_JSON.backup.$(date +%s)"
fi

# Criar arquivo com DNS configurado
sudo tee "$DAEMON_JSON" > /dev/null <<'EOF'
{
  "dns": ["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

echo -e "${GREEN}✓ daemon.json configurado${NC}"
echo

# 3. Reiniciar Docker
echo -e "${YELLOW}[3/4] Reiniciando Docker...${NC}"
sudo systemctl restart docker

# Esperar Docker ficar pronto
sleep 3

if docker ps &> /dev/null; then
    echo -e "${GREEN}✓ Docker reiniciado com sucesso${NC}"
else
    echo -e "${RED}✗ Erro ao reiniciar Docker${NC}"
    exit 1
fi

echo

# 4. Testar conectividade
echo -e "${YELLOW}[4/4] Testando conectividade...${NC}"
if docker run --rm alpine nslookup registry-1.docker.io &> /dev/null; then
    echo -e "${GREEN}✓ DNS está funcionando${NC}"
else
    echo -e "${YELLOW}⚠ DNS ainda com problemas, mas docker-compose build pode tentar${NC}"
fi

echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo
echo "Próximo passo:"
echo "  docker-compose build"
echo "  docker-compose up jekyll"
echo
