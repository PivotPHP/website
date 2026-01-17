#!/bin/bash
# Script para validar o site Jekyll com Docker

set -e

echo "🐳 Validando site Jekyll com Docker..."
echo

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Build de produção
echo -e "${YELLOW}[1/4] Build de produção...${NC}"
docker-compose run --rm jekyll-build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro no build${NC}"
    exit 1
fi

echo

# 2. Verificar redirects
echo -e "${YELLOW}[2/4] Verificando redirects gerados...${NC}"
REDIRECT_COUNT=$(find _site -name "*.html" -path "*docs*" -type f | wc -l)
echo "   Encontrados $REDIRECT_COUNT arquivos de redirect"

if [ $REDIRECT_COUNT -gt 20 ]; then
    echo -e "${GREEN}✓ Redirects parecem estar configurados${NC}"
else
    echo -e "${RED}⚠ Poucos redirects encontrados (esperado: ~27)${NC}"
fi

echo

# 3. Verificar estrutura PT
echo -e "${YELLOW}[3/4] Verificando estrutura PT-BR...${NC}"
if [ -d "_site/pt/docs" ]; then
    PT_DOCS=$(find _site/pt/docs -name "*.html" | wc -l)
    echo "   Encontrados $PT_DOCS documentos PT-BR"
    echo -e "${GREEN}✓ Estrutura PT-BR OK${NC}"
else
    echo -e "${RED}✗ Diretório _site/pt/docs não encontrado${NC}"
    exit 1
fi

echo

# 4. Verificar links quebrados (básico)
echo -e "${YELLOW}[4/4] Verificando links internos...${NC}"
BROKEN_LINKS=$(grep -r "href=\"/docs/" _site/pt --include="*.html" | wc -l || echo "0")

if [ "$BROKEN_LINKS" -eq "0" ]; then
    echo -e "${GREEN}✓ Nenhum link quebrado detectado${NC}"
else
    echo -e "${RED}⚠ Encontrados $BROKEN_LINKS possíveis links quebrados${NC}"
    grep -r "href=\"/docs/" _site/pt --include="*.html" | head -5
fi

echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Validação concluída!${NC}"
echo
echo "Para servir localmente:"
echo "  docker-compose up jekyll"
echo
echo "Para testar produção:"
echo "  docker-compose up jekyll-production"
