#!/bin/bash
# Valida o site Jekyll usando Docker.
# O build de produção roda sob o profile "build" e grava em _site-build/.

set -e

BUILD_DIR="_site-build"
BASEURL="/website"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🐳 Validando site Jekyll com Docker..."
echo

# 1. Build de produção
echo -e "${YELLOW}[1/4] Build de produção...${NC}"
if docker compose --profile build run --rm jekyll-build; then
    echo -e "${GREEN}✓ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro no build${NC}"
    exit 1
fi

echo

# 2. Verificar redirects gerados
echo -e "${YELLOW}[2/4] Verificando páginas geradas...${NC}"
PAGE_COUNT=$(find "$BUILD_DIR" -name "*.html" -type f | wc -l | tr -d ' ')
echo "   Encontrados $PAGE_COUNT arquivos HTML"
if [ "$PAGE_COUNT" -gt 20 ]; then
    echo -e "${GREEN}✓ Páginas geradas OK${NC}"
else
    echo -e "${RED}⚠ Poucas páginas geradas ($PAGE_COUNT)${NC}"
fi

echo

# 3. Verificar estrutura PT
echo -e "${YELLOW}[3/4] Verificando estrutura PT-BR...${NC}"
if [ -d "$BUILD_DIR/pt/docs" ]; then
    PT_DOCS=$(find "$BUILD_DIR/pt/docs" -name "*.html" | wc -l | tr -d ' ')
    echo "   Encontrados $PT_DOCS documentos PT-BR"
    echo -e "${GREEN}✓ Estrutura PT-BR OK${NC}"
else
    echo -e "${RED}✗ Diretório $BUILD_DIR/pt/docs não encontrado${NC}"
    exit 1
fi

echo

# 4. Verificar links internos (exige baseurl e destino existente)
echo -e "${YELLOW}[4/4] Verificando links internos...${NC}"
BROKEN=$(BASEURL="$BASEURL" BUILD_DIR="$BUILD_DIR" python3 - <<'PY'
import re, os, pathlib, html
root = pathlib.Path(os.environ["BUILD_DIR"])
baseurl = os.environ["BASEURL"]
files = set()
for p in root.rglob("*"):
    if p.is_file():
        rel = "/" + str(p.relative_to(root))
        files.add(rel)
        if rel.endswith("/index.html"):
            files.add(rel[:-len("index.html")])
href_re = re.compile(r'(?:href|src)=["\']([^"\']+)["\']')
issues = []
for p in root.rglob("*.html"):
    text = p.read_text(errors="ignore")
    for m in href_re.finditer(text):
        u = html.unescape(m.group(1)).split("#")[0].split("?")[0]
        if not u.startswith("/") or u.startswith("//"):
            continue
        if not u.startswith(baseurl):
            issues.append(f"sem baseurl: {u} ({p.relative_to(root)})")
            continue
        cand = u[len(baseurl):] or "/"
        if not (cand in files or cand + "index.html" in files or (cand.endswith("/") and cand + "index.html" in files)):
            issues.append(f"quebrado: {u} ({p.relative_to(root)})")
for i in issues:
    print(i)
PY
)
if [ -z "$BROKEN" ]; then
    echo -e "${GREEN}✓ Nenhum link quebrado ou sem baseurl detectado${NC}"
else
    echo -e "${RED}⚠ Problemas de link encontrados:${NC}"
    echo "$BROKEN" | head -10
fi

echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Validação concluída!${NC}"
echo
echo "Para servir localmente:"
echo "  docker compose up jekyll"
echo
echo "Para testar produção:"
echo "  docker compose --profile production up jekyll-production"
