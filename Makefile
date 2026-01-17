.PHONY: serve build install clean docker-serve docker-build docker-validate docker-prod help

# Local development (requires Ruby)
install:
	bundle install

serve:
	bundle exec jekyll serve --watch

build:
	bundle exec jekyll build

clean:
	bundle exec jekyll clean

# Docker development (no Ruby needed)
docker-serve:
	@echo "🚀 Iniciando servidor de desenvolvimento..."
	docker-compose up jekyll

docker-build:
	@echo "🔨 Build de produção..."
	docker-compose run --rm jekyll-build

docker-prod:
	@echo "🌐 Servidor de produção..."
	docker-compose up jekyll-production

docker-validate:
	@echo "✅ Validando site..."
	./validate-site.sh

docker-install:
	@echo "📦 Instalando dependências..."
	docker-compose run --rm jekyll bundle install

docker-clean:
	@echo "🧹 Limpando cache..."
	rm -rf _site .jekyll-cache .jekyll-metadata

help:
	@echo "Comandos disponíveis:"
	@echo ""
	@echo "  🐳 Docker (recomendado):"
	@echo "    make docker-serve      - Servidor dev com hot-reload"
	@echo "    make docker-build      - Build de produção"
	@echo "    make docker-prod       - Testar build de produção"
	@echo "    make docker-validate   - Validar site completo"
	@echo "    make docker-clean      - Limpar cache"
	@echo ""
	@echo "  💎 Local (requer Ruby):"
	@echo "    make install           - Instalar dependências"
	@echo "    make serve             - Servidor local"
	@echo "    make build             - Build local"
	@echo "    make clean             - Limpar cache"