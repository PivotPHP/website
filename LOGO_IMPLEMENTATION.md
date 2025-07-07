# Implementação do Logo PivotPHP

## Baseado nas especificações do DESIGN_IDENTITY.html

### Logo SVG Principal
Criar um arquivo `pivotphp-logo.svg` com as seguintes especificações:

```svg
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradiente do logo -->
  <defs>
    <linearGradient id="pivotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Seta superior (rotacionada -45deg) -->
  <rect x="24" y="50" width="50" height="14" rx="7" fill="url(#pivotGradient)" transform="rotate(-45 49 57)"/>

  <!-- Seta inferior (rotacionada 45deg) -->
  <rect x="46" y="50" width="50" height="14" rx="7" fill="url(#pivotGradient)" transform="rotate(45 71 57)"/>

  <!-- Ponto central -->
  <circle cx="60" cy="60" r="10" fill="#EC4899"/>
  <circle cx="60" cy="60" r="10" fill="none" stroke="#EC4899" stroke-width="4" opacity="0.2"/>
</svg>
```

### Logo Monocromático
Criar `pivotphp-logo-mono.svg`:

```svg
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Seta superior -->
  <rect x="24" y="50" width="50" height="14" rx="7" fill="#0F172A" transform="rotate(-45 49 57)"/>

  <!-- Seta inferior -->
  <rect x="46" y="50" width="50" height="14" rx="7" fill="#0F172A" transform="rotate(45 71 57)"/>

  <!-- Ponto central -->
  <circle cx="60" cy="60" r="10" fill="#0F172A"/>
  <circle cx="60" cy="60" r="10" fill="none" stroke="#0F172A" stroke-width="4" opacity="0.2"/>
</svg>
```

### Logo Branco
Criar `pivotphp-logo-white.svg`:

```svg
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Seta superior -->
  <rect x="24" y="50" width="50" height="14" rx="7" fill="white" transform="rotate(-45 49 57)"/>

  <!-- Seta inferior -->
  <rect x="46" y="50" width="50" height="14" rx="7" fill="white" transform="rotate(45 71 57)"/>

  <!-- Ponto central -->
  <circle cx="60" cy="60" r="10" fill="white"/>
  <circle cx="60" cy="60" r="10" fill="none" stroke="white" stroke-width="4" opacity="0.2"/>
</svg>
```

### Favicon
Criar `favicon.svg`:

```svg
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pivotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Setas menores para favicon -->
  <rect x="6" y="14" width="14" height="4" rx="2" fill="url(#pivotGradient)" transform="rotate(-45 13 16)"/>
  <rect x="12" y="14" width="14" height="4" rx="2" fill="url(#pivotGradient)" transform="rotate(45 19 16)"/>

  <!-- Ponto central menor -->
  <circle cx="16" cy="16" r="3" fill="#EC4899"/>
</svg>
```

### Tamanhos de PNG necessários:
- 512x512px
- 256x256px
- 128x128px
- 64x64px
- 32x32px
- 16x16px

### Localização dos arquivos:
```
assets/images/
├── pivotphp-logo.svg
├── pivotphp-logo-mono.svg
├── pivotphp-logo-white.svg
├── favicon.svg
├── favicon.ico
├── pivotphp-logo-512.png
├── pivotphp-logo-256.png
├── pivotphp-logo-128.png
├── pivotphp-logo-64.png
├── pivotphp-logo-32.png
└── pivotphp-logo-16.png
```

### CSS para o logo no HTML:
```css
.logo {
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.hero-logo {
  width: 120px;
  height: 120px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Implementação no HTML:
```html
<!-- Navegação -->
<img src="/assets/images/pivotphp-logo.svg" alt="PivotPHP" class="logo">

<!-- Hero Section -->
<img src="/assets/images/pivotphp-logo.svg" alt="PivotPHP" class="hero-logo">

<!-- Footer (fundo escuro) -->
<img src="/assets/images/pivotphp-logo-white.svg" alt="PivotPHP" class="footer-logo">
```

### Cores exatas do DESIGN_IDENTITY:
- Primary: #7C3AED (Electric Purple)
- Secondary: #EC4899 (Magenta Pink)
- Accent: #06B6D4 (Cyan)
- Dark: #0F172A (Deep Blue Black)
- Gray: #64748B (Neutral Gray)
- Light: #F8FAFC (Off White)

### Conceito do Design:
- Duas setas formando movimento de pivô/rotação
- Ponto central representa núcleo estável do framework
- Gradiente simboliza evolução e dinamismo
- Design minimalista para legibilidade em qualquer tamanho
