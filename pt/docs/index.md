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
  <meta http-equiv="refresh" content="0; url=/pt/docs/v2/" />
  <script>
    // Detecta idioma salvo no localStorage
    var savedLang = localStorage.getItem('preferred-language') || 'pt';
    var versions = {{ site.data.versions.versions | jsonify }};
    var canonical = versions.find(v => v.is_canonical);

    if (canonical) {
      // docs_path já inclui o idioma (ex: /pt/docs/v2/), não adicionar novamente
      var targetUrl = canonical.docs_path;
      window.location.replace(targetUrl);
    } else {
      window.location.replace('/pt/docs/v2/');
    }
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0; url=/pt/docs/v2/" />
  </noscript>
</head>
<body>
  <p>Redirecionando para a documentação...</p>
  <p>
    Se não for redirecionado automaticamente,
    <a href="/pt/docs/v2/">clique aqui</a>.
  </p>
</body>
</html>
