# GitHub Pages Setup Guide

## What I've Created

1. **_config.yml** - Jekyll configuration
2. **index.md** - Landing page (replaces README as homepage)
3. **.gitignore** - Updated with Jekyll exclusions

## Steps to Enable GitHub Pages

### 1. Push Your Files to GitHub

```bash
git add _config.yml index.md .gitignore
git commit -m "Add GitHub Pages configuration"
git push origin main
```

### 2. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: `https://github.com/waynewbishop/swift-algorithms`
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

### 3. Wait for Deployment

- GitHub will automatically build your site (takes 1-2 minutes)
- You'll see a green checkmark when ready
- Your site will be available at: `https://waynewbishop.github.io/swift-algorithms`

## Checking Build Status

Watch for the deployment status:
1. Go to **Actions** tab in your repository
2. You'll see "pages build and deployment" workflow
3. Green checkmark = success, red X = error

## Customizing the Theme

In `_config.yml`, you can change the theme:

```yaml
# Current theme
theme: jekyll-theme-cayman

# Other options:
# theme: jekyll-theme-minimal
# theme: jekyll-theme-slate
# theme: jekyll-theme-architect
# theme: jekyll-theme-dinky
# theme: jekyll-theme-merlot
# theme: jekyll-theme-midnight
# theme: jekyll-theme-modernist
# theme: jekyll-theme-tactile
# theme: jekyll-theme-time-machine
```

After changing, commit and push to see the new theme.

## Testing Locally (Optional)

To preview your site locally before pushing:

```bash
# Install Jekyll (one time only)
gem install bundler jekyll

# Create Gemfile
cat > Gemfile << 'EOF'
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
EOF

# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Open http://localhost:4000/swift-algorithms in your browser
```

## Troubleshooting

### Site Not Showing Up?

1. Check that GitHub Pages is enabled in Settings → Pages
2. Verify the branch is "main" (not "master")
3. Wait 2-3 minutes after pushing
4. Check Actions tab for build errors

### Links Not Working?

- Make sure chapter links in `index.md` don't have `.md` extension
- GitHub Pages automatically converts `01-introduction.md` to `01-introduction/`
- Use relative links: `[Introduction](01-introduction)` not `[Introduction](01-introduction.md)`

### Theme Not Applied?

- Ensure `_config.yml` is in the root directory
- Theme name must match exactly: `jekyll-theme-cayman` (with dashes)
- Commit and push the config file

## Custom Domain (Optional)

If you want a custom domain like `algorithms.waynewbishop.com`:

1. Add a `CNAME` file to your repository with your domain
2. In your domain registrar, add a CNAME record pointing to `waynewbishop.github.io`
3. In GitHub Settings → Pages, add your custom domain

## Files Excluded from GitHub Pages

These files won't appear on your public site (defined in `_config.yml`):
- `Claude.md`
- `COMPLETION-SUMMARY.md`
- `Resources/` folder
- `.git/` folder
- This file (`GITHUB_PAGES_SETUP.md`) - add to exclude list if desired

## Next Steps

1. **Push your files** to GitHub
2. **Enable Pages** in repository settings
3. **Wait** for deployment
4. **Visit** your live site!

Your book will be live at: **https://waynewbishop.github.io/swift-algorithms**

---

**Need help?** GitHub Pages documentation: https://docs.github.com/en/pages
