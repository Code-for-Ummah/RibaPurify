# 🚀 Deployment Guide

Complete guide to deploying RibaPurify to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.log statements in production
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Responsive design tested (mobile, tablet, desktop)

### ✅ Performance
- [ ] Build size < 1.5MB total
- [ ] Build time < 10s
- [ ] Initial load < 3s
- [ ] Images optimized
- [ ] Fonts optimized

### ✅ Security
- [ ] Dependencies updated
- [ ] XSS protection (DOMPurify)
- [ ] File validation
- [ ] Size limits enforced

### ✅ Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast ratios meet WCAG 2.1 AA
- [ ] Alt text on images

### ✅ Testing
- [ ] All features tested manually
- [ ] PDF upload (small, large)
- [ ] CSV upload
- [ ] OCR image processing
- [ ] All 16 languages tested
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

## 🏗 Build Process

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Build for Production**

```bash
npm run build
```

**Expected Output:**
```
✓ 1234 modules transformed.
dist/index.html                    0.65 kB │ gzip: 0.35 kB
dist/assets/index-a1b2c3d4.js      450.60 kB │ gzip: 145.23 kB
dist/assets/react-vendor-e5f6g7h8.js  194.59 kB │ gzip: 65.12 kB
dist/assets/pdf-vendor-i9j0k1l2.js    448.41 kB │ gzip: 155.67 kB
dist/assets/blog-translations-m3n4o5p6.js  184.14 kB │ gzip: 48.32 kB
dist/assets/ui-vendor-q7r8s9t0.js     22.71 kB │ gzip: 8.45 kB

✓ built in 4.96s
```

### 3. **Test Production Build Locally**

```bash
npm run preview
```

Open [http://localhost:4173](http://localhost:4173) and test thoroughly.

---

## 🚀 Deployment Options

## Option 1: Vercel (Recommended)

**Pros:**
- ✅ Zero configuration
- ✅ Auto HTTPS
- ✅ Global CDN
- ✅ Free tier (100GB bandwidth)
- ✅ Auto deployments from Git

### Deploy via GitHub

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Code-for-Ummah/RibaPurify.git
git push -u origin main
```

2. **Connect to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Vercel auto-detects Vite config
- Click "Deploy"

3. **Custom Domain** (Optional)

- Go to Project Settings → Domains
- Add custom domain (e.g., `ribapurify.org`)
- Follow DNS instructions

### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Option 2: Netlify

**Pros:**
- ✅ Drag & drop deployment
- ✅ Auto HTTPS
- ✅ Form handling
- ✅ Free tier (100GB bandwidth)

### Deploy via GitHub

1. **Push to GitHub** (same as Vercel)

2. **Connect to Netlify**

- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Select GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`
- Click "Deploy"

### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy via Drag & Drop

1. Build locally: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag `dist/` folder
4. Done!

---

## Option 3: GitHub Pages

**Pros:**
- ✅ Free
- ✅ Custom domain support
- ✅ Direct from repo

**Cons:**
- ❌ Manual deployment
- ❌ No auto HTTPS for custom domains

### Setup

1. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

2. **Add Deploy Script to package.json**

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Set Base Path in vite.config.ts**

```typescript
export default defineConfig({
  base: '/RibaPurify/', // Your repo name
  // ... rest of config
});
```

4. **Deploy**

```bash
npm run deploy
```

5. **Enable GitHub Pages**

- Go to GitHub repo → Settings → Pages
- Source: `gh-pages` branch
- Save

6. **Access**

Site will be at: `https://code-for-ummah.github.io/RibaPurify/`

---

## Option 4: Self-Hosted (Nginx)

**Pros:**
- ✅ Full control
- ✅ No bandwidth limits
- ✅ Custom server config

**Cons:**
- ❌ Requires server management
- ❌ Manual HTTPS setup

### Setup on Ubuntu Server

1. **Build Locally**

```bash
npm run build
```

2. **Upload to Server**

```bash
scp -r dist/* user@yourserver.com:/var/www/ribapurify
```

3. **Install Nginx**

```bash
sudo apt update
sudo apt install nginx
```

4. **Configure Nginx**

Create `/etc/nginx/sites-available/ribapurify`:

```nginx
server {
    listen 80;
    server_name ribapurify.org www.ribapurify.org;
    
    root /var/www/ribapurify;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

5. **Enable Site**

```bash
sudo ln -s /etc/nginx/sites-available/ribapurify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup HTTPS with Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ribapurify.org -d www.ribapurify.org
```

---

## 🔒 Security Headers

### Recommended CSP Headers

Add to your hosting provider's config:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Vercel Example

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📊 Monitoring

### 1. **Google Search Console**

- Verify ownership
- Submit sitemap (if generated)
- Monitor search performance

### 2. **Uptime Monitoring**

Free options:
- [UptimeRobot](https://uptimerobot.com) - 50 monitors free
- [Pingdom](https://pingdom.com) - 1 monitor free
- [StatusCake](https://statuscake.com) - 10 monitors free

### 3. **Analytics** (Optional, Privacy-Respecting)

Since we're privacy-first, **avoid Google Analytics**.

Alternatives:
- [Plausible](https://plausible.io) - Privacy-focused, open-source
- [Fathom](https://usefathom.com) - Simple, privacy-first
- [Umami](https://umami.is) - Self-hosted, privacy-focused

**Note:** Only add analytics if absolutely necessary. Our philosophy is **zero tracking**.

---

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
```

---

## 🌍 Custom Domain Setup

### DNS Configuration

For `ribapurify.org`:

#### Vercel
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Netlify
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site].netlify.app
```

#### GitHub Pages
```
Type: A
Name: @
Value: 185.199.108.153

Type: CNAME
Name: www
Value: code-for-ummah.github.io
```

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** `npm run build` fails

**Solution:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Refresh

**Issue:** Page refreshes give 404 errors

**Solution:** Configure SPA fallback (see Nginx config above)

### Large Bundle Size

**Issue:** Bundle > 2MB

**Solution:**
- Check if code splitting is working
- Remove unused dependencies
- Lazy load heavy components

### Slow Initial Load

**Issue:** Takes >5s to load

**Solution:**
- Enable gzip/brotli compression
- Use CDN (Vercel/Netlify)
- Optimize images
- Lazy load blog posts

---

## 📈 Performance Optimization

### Enable Brotli Compression

**Nginx:**
```nginx
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

**Vercel/Netlify:** Automatic

### CDN Headers

```nginx
# Cache static assets aggressively
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Preconnect to External Resources

In `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

---

## ✅ Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All 16 languages work
- [ ] PDF upload works
- [ ] CSV upload works
- [ ] OCR works
- [ ] Export functionality works
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Browser back button works
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Security headers set
- [ ] Monitoring enabled
- [ ] Performance tested (Lighthouse score >90)

---

## 🎯 Lighthouse Score Goals

Run Lighthouse audit in Chrome DevTools:

**Target Scores:**
- 🟢 **Performance:** >90
- 🟢 **Accessibility:** >90
- 🟢 **Best Practices:** 100
- 🟢 **SEO:** >90

---

## 📧 Support

Issues? Contact:
- **GitHub Issues** - Technical problems
- **Email** - contact@codeforummah.org

---

**May Allah make this deployment successful and benefit the Ummah. Ameen.**

Built with ❤️ by Muslims, for Muslims.
