# PivotPHP Website Simplification Summary

## Changes Made

### 1. Theme System Simplification
- **Created**: `theme-simplified.css` - Uses CSS variables properly without complex selectors
- **Created**: `theme-toggle-simplified.js` - Applies theme only to documentElement
- **Removed**: Multiple `[data-theme="dark"]` selectors and `!important` declarations

### 2. Favicon Updates
- **Updated**: `_includes/head.html` to use new PNG logos instead of non-existent SVG/ICO files
- **Added**: Proper favicon sizes (16x16, 32x32) and apple-touch-icon

### 3. Layout Unification
- **Created**: `docs-unified.html` - Single layout for both default and i18n documentation
- **Handles**: Language detection and conditional includes based on `page.lang`

### 4. Include Files Unification
- **Created**: `footer-unified.html` - Single footer handling both languages
- **Created**: `docs-sidebar-unified.html` - Single sidebar for all languages
- **Uses**: Proper translation lookups with fallbacks

### 5. CSS Consolidation
- **Created**: `pivotphp-simplified.css` - Clean, minimal CSS without duplications
- **Removed**: Duplicate declarations across multiple files
- **Simplified**: Dark theme using CSS variables only

## Migration Steps

To apply these simplifications:

1. **Update layouts to use unified versions**:
   ```yaml
   # In front matter of docs pages
   layout: docs-unified  # instead of docs or docs-i18n
   ```

2. **Update CSS imports**:
   ```html
   <!-- Replace in _includes/head.html -->
   <link rel="stylesheet" href="{{ '/assets/css/pivotphp-simplified.css' | relative_url }}">
   ```

3. **Update theme toggle script**:
   ```html
   <!-- Replace in layouts -->
   <script src="{{ '/assets/js/theme-toggle-simplified.js' | relative_url }}"></script>
   ```

4. **Update includes**:
   ```liquid
   {% include footer-unified.html %}
   {% include docs-sidebar-unified.html %}
   ```

## Benefits

1. **Reduced Complexity**: 
   - Single source of truth for layouts and includes
   - No more `!important` CSS rules
   - Theme applied only to documentElement

2. **Better Maintainability**:
   - CSS variables handle all theme changes
   - Single layout file to maintain
   - Unified translation handling

3. **Improved Performance**:
   - Less CSS to parse
   - Fewer DOM manipulations for theme
   - Single layout reduces Jekyll build complexity

## Next Steps

1. Test the simplified versions thoroughly
2. Remove old layout files once migration is complete
3. Consider consolidating more CSS files (benchmarks.css could be merged)
4. Update any remaining old asset references
5. Consider using CSS custom properties for all component styling