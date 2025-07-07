#!/bin/bash

echo "Testing HelixPHP Website Routes"
echo "=============================="

BASE_URL="http://localhost:4000/website"

# Test English routes
echo -e "\n[English Routes]"
EN_ROUTES=(
    "/"
    "/docs/"
    "/docs/installation/"
    "/docs/quickstart/"
    "/docs/configuration/"
    "/docs/routing/"
    "/docs/middleware/"
    "/docs/requests-responses/"
    "/docs/container/"
    "/docs/security/"
    "/docs/events/"
    "/docs/validation/"
    "/docs/database/"
    "/docs/providers/"
    "/docs/testing/"
    "/docs/deployment/"
    "/docs/why-helix/"
)

for route in "${EN_ROUTES[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}")
    if [ "$status" = "200" ]; then
        echo "✓ ${route} - ${status}"
    else
        echo "✗ ${route} - ${status}"
    fi
done

# Test Portuguese routes
echo -e "\n[Portuguese Routes]"
PT_ROUTES=(
    "/pt/"
    "/pt/docs/"
    "/pt/docs/instalacao/"
    "/pt/docs/inicio-rapido/"
    "/pt/docs/configuracao/"
    "/pt/docs/roteamento/"
    "/pt/docs/middleware/"
    "/pt/docs/requisicoes-respostas/"
    "/pt/docs/container/"
    "/pt/docs/seguranca/"
    "/pt/docs/eventos/"
    "/pt/docs/validacao/"
    "/pt/docs/banco-de-dados/"
    "/pt/docs/provedores/"
    "/pt/docs/testes/"
    "/pt/docs/deploy/"
    "/pt/docs/why-helix/"
)

for route in "${PT_ROUTES[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}")
    if [ "$status" = "200" ]; then
        echo "✓ ${route} - ${status}"
    else
        echo "✗ ${route} - ${status}"
    fi
done

# Test language switcher functionality
echo -e "\n[Language Switcher Test]"
echo "Testing if language switcher exists on pages..."

# Check English page
if curl -s "${BASE_URL}/docs/" | grep -q "language-switcher"; then
    echo "✓ Language switcher found on English docs"
else
    echo "✗ Language switcher NOT found on English docs"
fi

# Check Portuguese page
if curl -s "${BASE_URL}/pt/docs/" | grep -q "language-switcher"; then
    echo "✓ Language switcher found on Portuguese docs"
else
    echo "✗ Language switcher NOT found on Portuguese docs"
fi

# Test assets
echo -e "\n[Assets Test]"
ASSETS=(
    "/assets/js/language-routes.js"
    "/assets/js/language-persistence.js"
    "/assets/js/mobile-nav.js"
    "/assets/css/mobile.css"
    "/assets/css/mobile-overrides.css"
)

for asset in "${ASSETS[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${asset}")
    if [ "$status" = "200" ]; then
        echo "✓ ${asset} - ${status}"
    else
        echo "✗ ${asset} - ${status}"
    fi
done

echo -e "\n=============================="
echo "Test completed!"