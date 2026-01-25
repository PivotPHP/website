---
redirect_from:
  - /docs/index/
  - /en/docs/index/
  - /en/index/
  - /docs/
  - /en/docs/
layout: default
title: Redirecionando para Documentação
permalink: /pt/docs/
lang: pt
---

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Redirecionando...</title>
  <meta http-equiv="refresh" content="0; url=/pt/docs/v1/" />
  <script>
    // Detecta idioma salvo no localStorage
    var savedLang = localStorage.getItem('preferred-language') || 'pt';
    var versions = {{ site.data.versions.versions | jsonify }};
    var canonical = versions.find(v => v.is_canonical);

    if (canonical) {
      // docs_path já inclui o idioma (ex: /pt/docs/v1/), não adicionar novamente
      var targetUrl = canonical.docs_path;
      window.location.replace(targetUrl);
    } else {
      window.location.replace('/pt/docs/v1/');
    }
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0; url=/pt/docs/v1/" />
  </noscript>
</head>
<body>
  <p>Redirecionando para a documentação...</p>
  <p>
    Se não for redirecionado automaticamente,
    <a href="/pt/docs/v1/">clique aqui</a>.
  </p>
</body>
</html>
    <a href="{{ '/pt/docs/installation/' | relative_url }}" style="color: var(--pivot-primary); font-weight: 600;">Começar →</a>
  </div>

  <div style="border: 1px solid rgba(34, 197, 94, 0.3); padding: 1.5rem; border-radius: 8px;">
    <h3 style="margin-top: 0;">🎯 Primeiro Projeto</h3>
    <p>Tutorial passo a passo para construir sua primeira API REST.</p>
    <a href="{{ '/pt/docs/primeiro-projeto/' | relative_url }}" style="color: var(--pivot-primary); font-weight: 600;">Aprender →</a>
  </div>

  <div style="border: 1px solid rgba(34, 197, 94, 0.3); padding: 1.5rem; border-radius: 8px;">
    <h3 style="margin-top: 0;">🔧 Fundamentos</h3>
    <p>Explore routing, middleware e arquitetura do framework.</p>
    <a href="{{ '/pt/docs/routing/' | relative_url }}" style="color: var(--pivot-primary); font-weight: 600;">Explorar →</a>
  </div>
</div>

---

## 🤝 Comunidade e Suporte

- **GitHub**: [github.com/pivotphp/pivotphp-core](https://github.com/pivotphp/pivotphp-core)
- **Issues**: [Reporte bugs](https://github.com/pivotphp/pivotphp-core/issues)
- **Discussões**: [Comunidade](https://github.com/pivotphp/pivotphp-core/discussions)
- **Packagist**: [packagist.org/packages/pivotphp/core](https://packagist.org/packages/pivotphp/core)

---

## 📄 Licença

PivotPHP é software de código aberto licenciado sob a **[MIT License](https://opensource.org/licenses/MIT)**.

Desenvolvido no Brasil 🇧🇷 com foco em educação e simplicidade.

