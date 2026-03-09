# CDN Scripts with Environment Variables

This project uses Cloudflare Pages Functions to serve JavaScript files with environment variables securely injected at runtime.

## Setup

### 1. Set Environment Variables in Cloudflare Pages

Go to your Cloudflare Pages dashboard:

1. Navigate to your project (cdn-script)
2. Go to **Settings** > **Environment variables**
3. Add the following variables:

| Variable Name | Value |
|---------------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |

**Note:** You can set these for different environments:
- **Production** - for your live deployment
- **Preview** - for pull request previews
- **Development** - for local development

### 2. Deploy to Cloudflare Pages

```bash
# Deploy using Wrangler CLI
npx wrangler pages deploy . --project-name=cdn-script

# Or commit and push to trigger automatic deployment (if connected to Git)
git add .
git commit -m "Update scripts"
git push
```

### 3. Usage

The scripts are now available at:

- `https://cdn-script.pages.dev/dynamic-blog-foxdealer.js`
- `https://cdn-script.pages.dev/sb-store-brands.js`

Include them in your HTML:

```html
<script src="https://cdn-script.pages.dev/dynamic-blog-foxdealer.js" defer></script>
<!-- or -->
<script src="https://cdn-script.pages.dev/sb-store-brands.js" defer></script>
```

## How It Works

### Pages Functions

The `functions/` directory contains Cloudflare Pages Functions that:

1. Read environment variables from `context.env`
2. Inject them into the JavaScript code
3. Serve the script with proper headers (CORS, caching, content-type)

### File Structure

```
cdn-script/
├── functions/
│   ├── dynamic-blog-foxdealer.js.js  # Serves /dynamic-blog-foxdealer.js
│   └── sb-store-brands.js.js         # Serves /sb-store-brands.js
├── dynamic-blog-foxdealer.js         # Source template (not used in production)
├── sb-store-brands.js                # Source template (not used in production)
└── README.md
```

### URL Mapping

Cloudflare Pages automatically maps:
- `functions/dynamic-blog-foxdealer.js.js` → `/dynamic-blog-foxdealer.js`
- `functions/sb-store-brands.js.js` → `/sb-store-brands.js`

## Scripts

### dynamic-blog-foxdealer.js

Loads dynamic blog content from Supabase based on a `slug` query parameter.

**Features:**
- Reads `?slug=your-slug` from URL
- Fetches content from `crm.seo_pages` table
- Injects title into `.page__title` or `.page-title h1 span`
- Injects HTML into `.page__content` or `.primary-wrapper .primary.col`
- Logs with `[dyn-blog][stage]` format

**Usage:**
```html
<script src="https://cdn-script.pages.dev/dynamic-blog-foxdealer.js" defer></script>
```

**Example URL:**
```
https://example.com/blog/?slug=my-article-2025
```

### sb-store-brands.js

Loads brand-specific SEO content based on the current domain.

**Features:**
- URL whitelist with wildcard support (e.g., `https://example.com/page/*`)
- Maps domains to brand names
- Fetches HTML from `crm.seo_html_list` table
- Injects content into `.page__content` or `.primary-wrapper .primary.col`
- MutationObserver for late-rendered content

**Allowed URLs:**
- `https://www.murrayjeepram.ca/how-to-blog/`
- `https://www.murraychevrolet.ca/how-to-blog/`
- `https://murraychevrolet.foxdealersites.com/how-to-blog/*` (wildcard)

**Usage:**
```html
<script src="https://cdn-script.pages.dev/sb-store-brands.js" defer></script>
```

## Local Development

For local testing with Wrangler:

```bash
# Install Wrangler
npm install -g wrangler

# Set environment variables locally
wrangler pages dev . --binding SUPABASE_URL=your_url SUPABASE_ANON_KEY=your_key

# Or create .dev.vars file
echo "SUPABASE_URL=your_url" > .dev.vars
echo "SUPABASE_ANON_KEY=your_key" >> .dev.vars
wrangler pages dev .
```

## Security Notes

- ✅ Environment variables are injected server-side
- ✅ Never commit `.dev.vars` to Git (add to `.gitignore`)
- ✅ The Supabase anon key is public-facing (safe to expose in client-side code)
- ✅ Use Row Level Security (RLS) in Supabase to protect sensitive data
- ⚠️ Scripts have fallback values for backward compatibility

## Troubleshooting

### Scripts not loading environment variables

1. Check that environment variables are set in Cloudflare dashboard
2. Redeploy after setting environment variables
3. Check browser console for errors

### CORS errors

The scripts include `Access-Control-Allow-Origin: *` header by default. If you need specific CORS rules, modify the response headers in the Functions.

### Cache issues

Scripts are cached for 1 hour (`max-age=3600`). To clear cache:
- Hard refresh in browser (Cmd+Shift+R / Ctrl+Shift+R)
- Or modify cache headers in the Functions code
