# HelixPHP Website

This is the official website and documentation for HelixPHP, built with Jekyll for GitHub Pages.

## Local Development

### Prerequisites

- Ruby 2.7 or higher
- Bundler (`gem install bundler`)

### Setup

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```

3. Open http://localhost:4000 in your browser

### Building for Production

```bash
bundle exec jekyll build
```

The static site will be generated in the `_site` directory.

## Structure

```
website/
├── _config.yml          # Jekyll configuration
├── _layouts/            # Page layouts
├── _includes/           # Reusable components
├── _docs/               # Documentation pages
├── _sass/               # SCSS styles
├── assets/              # Images, CSS, JS
│   ├── css/
│   └── images/
├── index.md             # Homepage
└── Gemfile              # Ruby dependencies
```

## Adding Documentation

1. Create a new markdown file in `_docs/`
2. Add front matter with layout and permalink
3. Update `_includes/docs-sidebar.html` to add navigation

Example:
```markdown
---
layout: docs
title: Your Page Title
permalink: /docs/your-page/
---

# Your Page Title

Your content here...
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## License

MIT License - see the main project LICENSE file.