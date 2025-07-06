# Deploying to GitHub Pages

## Option 1: Deploy from `docs` folder (Recommended)

1. Build the site locally:
   ```bash
   cd website
   bundle install
   bundle exec jekyll build --destination ../docs
   ```

2. Commit the `docs` folder:
   ```bash
   git add docs/
   git commit -m "Build website for GitHub Pages"
   git push
   ```

3. In GitHub repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs

## Option 2: Deploy from root (move website files)

1. Move all website files to repository root:
   ```bash
   mv website/* .
   mv website/.* . 2>/dev/null || true
   rmdir website
   ```

2. Update `_config.yml`:
   ```yaml
   baseurl: ""  # Empty for root deployment
   ```

3. Push changes and configure GitHub Pages to deploy from root

## Option 3: Use GitHub Actions (Already configured)

The repository includes `.github/workflows/deploy-website.yml` which will:
- Build the Jekyll site on push
- Deploy using GitHub Pages actions

To enable:
1. Go to Settings > Pages
2. Source: GitHub Actions
3. Push changes to trigger deployment

## Local Testing

To test with production URLs locally:
```bash
bundle exec jekyll serve --baseurl ""
```

## Troubleshooting

If CSS/assets are not loading:
1. Check browser console for 404 errors
2. Verify `baseurl` in `_config.yml` matches your GitHub Pages URL structure
3. Use `relative_url` filter for all asset paths in templates