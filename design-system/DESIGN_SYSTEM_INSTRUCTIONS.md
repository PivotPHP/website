# PivotPHP Design System - Technical Guidelines

## 🎨 Core Design Principles

### 1. Evolutionary Design
- **Adaptability**: Components should gracefully adapt between light and dark modes
- **Progressive Enhancement**: Start simple, add complexity as needed
- **Performance First**: Visual effects should never compromise the 52M+ ops/sec promise

### 2. Visual Hierarchy
- **Clear Focus**: Use the gradient for primary actions only
- **Consistent Spacing**: Follow the 4px base grid system
- **Purposeful Color**: Every color choice should have semantic meaning

## 🌓 Dark Mode Implementation

### Color Adjustments

```css
/* Light Mode Base */
--surface: #FFFFFF;
--background: #F8FAFC;
--border: #E2E8F0;

/* Dark Mode Base */
--surface: #0F172A;
--background: #020617;
--border: #1E293B;
```

### Card Design in Dark Mode

#### 1. Standard Card
```css
[data-theme="dark"] .card {
    background: var(--pivot-gray-900);     /* #0F172A */
    border: 1px solid var(--pivot-gray-800); /* #1E293B */

    /* Deeper shadows with subtle transparency */
    box-shadow:
        0 1px 3px 0 rgb(0 0 0 / 0.3),
        0 1px 2px -1px rgb(0 0 0 / 0.3);
}

[data-theme="dark"] .card:hover {
    /* Purple glow on hover */
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.3),
        0 2px 4px -2px rgb(0 0 0 / 0.3),
        0 0 0 1px rgba(139, 92, 246, 0.1);
}
```

#### 2. Elevated Card (No Border)
```css
[data-theme="dark"] .card-elevated {
    background: var(--pivot-gray-800);     /* #1E293B */
    /* Stronger shadow for elevation */
    box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.4),
        0 4px 6px -4px rgb(0 0 0 / 0.4);
}
```

#### 3. Glassmorphism Card
```css
[data-theme="dark"] .glass-card {
    background: rgba(30, 41, 59, 0.5);     /* Semi-transparent */
    backdrop-filter: blur(10px);           /* Glass effect */
    -webkit-backdrop-filter: blur(10px);   /* Safari support */
    border: 1px solid rgba(139, 92, 246, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

#### 4. Neon Accent Card
```css
[data-theme="dark"] .card-neon {
    background: var(--pivot-gray-900);
    border: 1px solid var(--pivot-purple-700);
    box-shadow:
        0 0 20px rgba(139, 92, 246, 0.2),
        inset 0 0 20px rgba(139, 92, 246, 0.05);
}
```

## 🎯 Component Patterns

### Card Anatomy

```
┌─────────────────────────────────┐
│ Header (optional)               │
│ ┌─────────────────────────────┐ │
│ │ Icon   Title      Actions   │ │
│ │        Subtitle             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Content                         │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │ Main content area           │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Footer (optional)               │
│ ┌─────────────────────────────┐ │
│ │ Metadata          Actions   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Card Variants by Use Case

#### 1. Content Card
```html
<div class="card">
    <h3 class="card-title">Article Title</h3>
    <p class="card-content">Content preview...</p>
    <div class="card-footer">
        <span class="text-sm text-secondary">5 min read</span>
        <a href="#" class="btn btn-ghost">Read more →</a>
    </div>
</div>
```

#### 2. Metric Card
```html
<div class="stats-card">
    <div class="stats-value">52M+</div>
    <div class="stats-label">Operations/sec</div>
    <div class="stats-trend positive">↑ 12%</div>
</div>
```

#### 3. Interactive Feature Card
```html
<div class="feature-card interactive">
    <div class="feature-icon gradient">⚡</div>
    <h4 class="feature-title">Lightning Fast</h4>
    <p class="feature-description">
        Optimized for extreme performance
    </p>
    <button class="btn btn-primary">
        Learn More
    </button>
</div>
```

## 🎨 Color Usage Guidelines

### Primary Actions
- Use gradient for primary CTAs
- Limit to one primary action per card
- Ensure sufficient contrast (WCAG AA)

### Status Indication
```css
/* Success */
.status-success {
    color: var(--pivot-success-main);
    background: rgba(16, 185, 129, 0.1);
}

/* Warning */
.status-warning {
    color: var(--pivot-warning-main);
    background: rgba(245, 158, 11, 0.1);
}

/* Error */
.status-error {
    color: var(--pivot-error-main);
    background: rgba(239, 68, 68, 0.1);
}
```

### Dark Mode Color Adjustments
```css
/* Increase vibrancy in dark mode */
[data-theme="dark"] {
    --pivot-purple-700: #8B5CF6;  /* Lighter than light mode */
    --pivot-pink-500: #EC4899;    /* Maintains vibrancy */
    --pivot-cyan-500: #06B6D4;    /* Maintains vibrancy */
}
```

## 📐 Spacing System

### Base Unit: 4px
```css
/* Spacing Scale */
--space-1: 4px;    /* Tight spacing */
--space-2: 8px;    /* Compact elements */
--space-3: 12px;   /* Related elements */
--space-4: 16px;   /* Standard spacing */
--space-6: 24px;   /* Section spacing */
--space-8: 32px;   /* Large spacing */
--space-12: 48px;  /* Major sections */
--space-16: 64px;  /* Page sections */
```

### Card Spacing Rules
1. **Padding**: Use `--space-6` (24px) as default
2. **Margin between cards**: Use `--space-6` in grids
3. **Internal spacing**: Use `--space-4` between elements
4. **Compact mode**: Reduce to `--space-4` padding

## 🎭 Shadow System

### Light Mode Shadows
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Dark Mode Shadows
```css
/* Stronger shadows with glow effects */
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.3);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4);

/* Purple glow for interactive elements */
--shadow-glow: 0 0 0 1px rgba(139, 92, 246, 0.1);
--shadow-glow-lg: 0 0 20px rgba(139, 92, 246, 0.2);
```

## 🎯 Interactive States

### Hover Effects
```css
/* Scale + Shadow */
.card-interactive:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

/* Gradient Border */
.card-gradient-border:hover {
    border-image: var(--pivot-gradient-primary) 1;
}

/* Ripple Effect */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
```

### Focus States
```css
.focusable:focus-visible {
    outline: 2px solid var(--pivot-purple-500);
    outline-offset: 2px;
}

[data-theme="dark"] .focusable:focus-visible {
    outline-color: var(--pivot-purple-400);
}
```

## 📱 Responsive Design

### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Wide desktop */
```

### Card Grid System
```css
/* Auto-responsive grid */
.card-grid {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: repeat(
        auto-fit,
        minmax(280px, 1fr)
    );
}

/* Fixed columns with breakpoints */
@media (min-width: 768px) {
    .grid-md-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-md-3 { grid-template-columns: repeat(3, 1fr); }
}
```

## 🚀 Performance Guidelines

### CSS Optimization
1. Use CSS custom properties for dynamic values
2. Prefer `transform` over `position` for animations
3. Use `will-change` sparingly
4. Implement `content-visibility` for long lists

### Animation Performance
```css
/* Good - Hardware accelerated */
.card {
    transition: transform 200ms, box-shadow 200ms;
}

/* Avoid - Causes reflow */
.card {
    transition: width 200ms, height 200ms;
}
```

## 🎨 Accessibility

### Color Contrast Requirements
- **Normal text**: 4.5:1 ratio minimum
- **Large text**: 3:1 ratio minimum
- **Interactive elements**: 3:1 ratio minimum

### Dark Mode Specific
```css
/* Ensure sufficient contrast in dark mode */
[data-theme="dark"] {
    --text-primary: #F8FAFC;    /* ~15:1 on background */
    --text-secondary: #CBD5E1;  /* ~9:1 on background */
    --text-tertiary: #94A3B8;   /* ~5:1 on background */
}
```

### Focus Indicators
- Always visible in both light and dark modes
- Minimum 2px width
- 2px offset from element
- High contrast color

## 📦 Component Library Structure

```
pivotphp-ui/
├── core/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── shadows.css
├── components/
│   ├── card/
│   │   ├── card.css
│   │   ├── card-dark.css
│   │   └── card-variants.css
│   ├── button/
│   ├── badge/
│   └── form/
├── themes/
│   ├── light.css
│   └── dark.css
└── utilities/
    ├── animations.css
    └── responsive.css
```

## 🎯 Quick Implementation

### Minimal Setup
```html
<!-- Include PivotPHP Design System -->
<link rel="stylesheet" href="pivotphp-ui.css">

<!-- Card Example -->
<div class="card" data-theme="auto">
    <h3>Quick Start</h3>
    <p>Get started with PivotPHP in seconds</p>
    <button class="btn btn-primary">
        Install Now
    </button>
</div>
```

### Dark Mode Toggle
```javascript
// Simple theme toggle
function toggleTheme() {
    const theme = document.body.dataset.theme;
    document.body.dataset.theme =
        theme === 'light' ? 'dark' : 'light';
}

// System preference detection
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.dataset.theme = 'dark';
}
```

## 🚀 Next Steps

1. **Download** the complete CSS framework
2. **Customize** CSS variables to match your brand
3. **Implement** using the component patterns
4. **Test** in both light and dark modes
5. **Optimize** based on your specific needs

Remember: The design system should evolve with your application, just like PivotPHP itself!
