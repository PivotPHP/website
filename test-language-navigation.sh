#!/bin/bash

echo "Testing Language Navigation with /website baseurl"
echo "=============================================="

BASE_URL="http://localhost:4000/website"

# Test navigation from English to Portuguese
echo -e "\n[Testing EN -> PT Navigation]"
echo "Starting from: $BASE_URL/docs/"

# Simulate clicking language switcher
PT_URL=$(curl -s "$BASE_URL/docs/" | grep -oP 'LanguageRoutes\.convertUrl\("[^"]+", "en", "pt"\)' | head -1 | sed 's/.*convertUrl("//' | sed 's/",.*//')
echo "Language switcher would redirect to: /website/pt/docs/"

# Test if PT docs page exists
PT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/pt/docs/")
echo "PT docs page status: $PT_STATUS"

# Test navigation from Portuguese to English
echo -e "\n[Testing PT -> EN Navigation]"
echo "Starting from: $BASE_URL/pt/docs/"

# Test if EN redirect works
EN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/docs/")
echo "EN docs page status: $EN_STATUS"

# Test specific page conversions
echo -e "\n[Testing Specific Page Conversions]"

PAGES=(
    "/docs/installation/:/pt/docs/instalacao/"
    "/docs/quickstart/:/pt/docs/inicio-rapido/"
    "/docs/routing/:/pt/docs/roteamento/"
)

for page_pair in "${PAGES[@]}"; do
    IFS=':' read -r en_page pt_page <<< "$page_pair"
    
    en_url="${BASE_URL}${en_page}"
    pt_url="${BASE_URL}${pt_page}"
    
    en_status=$(curl -s -o /dev/null -w "%{http_code}" "$en_url")
    pt_status=$(curl -s -o /dev/null -w "%{http_code}" "$pt_url")
    
    echo "EN: $en_page -> Status: $en_status"
    echo "PT: $pt_page -> Status: $pt_status"
    echo ""
done

# Check if language routes script is loaded
echo -e "\n[Checking Language Routes Script]"
if curl -s "$BASE_URL/" | grep -q "language-routes.js"; then
    echo "✓ language-routes.js is loaded"
else
    echo "✗ language-routes.js NOT loaded"
fi

# Check if baseUrl is correctly set
echo -e "\n[Checking baseUrl in language-routes.js]"
curl -s "$BASE_URL/assets/js/language-routes.js" | grep "baseUrl:" | head -1

echo -e "\n=============================================="
echo "Test completed!"