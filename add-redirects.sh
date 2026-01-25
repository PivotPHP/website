#!/usr/bin/env bash
# Script para adicionar redirect_from aos arquivos PT/docs

cd /home/cfernandes/PivotPHP/website

for md_file in pt/docs/*.md; do
    basename=$(basename "$md_file" .md)

    # Se já tem redirect_from, pule
    if grep -q "^redirect_from:" "$md_file"; then
        echo "✓ $basename já tem redirects"
        continue
    fi

    echo "📝 Adicionando redirects a $basename..."

    # Criar arquivo temporário com redirect_from inserido após o front-matter inicial
    temp_file=$(mktemp)

    # Ler até o primeiro ---
    awk '
    /^---$/ {
        if (!found_end) {
            found_end = 1
            print
            # Inserir redirect_from
            print "redirect_from:"
            print "  - /docs/'$basename'/"
            print "  - /pt/docs/'$basename'/"
            print "  - /en/docs/'$basename'/"
            print "  - /en/'$basename'/"
            next
        }
    }
    { print }
    ' "$md_file" > "$temp_file"

    mv "$temp_file" "$md_file"
done

echo "✅ Concluído!"
