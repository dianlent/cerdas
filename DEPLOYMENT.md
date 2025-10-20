# 🚀 Deployment Guide - Platform Cerdas

## Deployment Options

Platform Cerdas dapat di-deploy ke berbagai platform hosting gratis. Berikut panduan untuk masing-masing:

---

## 1. 🔷 Vercel (Recommended)

### Kelebihan:
- ✅ Gratis untuk personal projects
- ✅ Auto-deploy dari Git
- ✅ Global CDN
- ✅ Instant rollbacks
- ✅ Custom domains

### Langkah Deploy:

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy ke Vercel**
   - Login ke [Vercel](https://vercel.com)
   - Klik "New Project"
   - Import repository GitHub Anda
   - Configure:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
   
3. **Set Environment Variables**
   - Di Vercel dashboard, buka Settings > Environment Variables
   - Tambahkan:
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_key
     ```

4. **Deploy!**
   - Klik "Deploy"
   - Tunggu beberapa menit
   - Aplikasi Anda live! 🎉

### Auto-Deploy
Setiap push ke branch `main` akan otomatis trigger deployment baru.

---

## 2. 🟢 Netlify

### Kelebihan:
- ✅ Gratis untuk personal projects
- ✅ Drag & drop deployment
- ✅ Form handling
- ✅ Serverless functions

### Langkah Deploy:

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

   Atau drag & drop folder `dist` ke [Netlify Drop](https://app.netlify.com/drop)

3. **Set Environment Variables**
   - Buka Site Settings > Environment Variables
   - Tambahkan variabel Supabase

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## 3. 📦 GitHub Pages

### Kelebihan:
- ✅ Gratis
- ✅ Terintegrasi dengan GitHub
- ✅ Custom domains

### Langkah Deploy:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://<username>.github.io/<repo-name>"
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/<repo-name>/'
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

**Note:** Environment variables harus di-set di GitHub Secrets untuk GitHub Actions.

---

## 4. 🔵 Railway

### Kelebihan:
- ✅ Gratis untuk hobby projects
- ✅ Database hosting included
- ✅ Easy scaling

### Langkah Deploy:

1. Login ke [Railway](https://railway.app)
2. New Project > Deploy from GitHub
3. Select repository
4. Add environment variables
5. Deploy!

---

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

- [ ] ✅ Supabase database sudah setup
- [ ] ✅ Schema.sql sudah dijalankan
- [ ] ✅ Seed.sql sudah dijalankan
- [ ] ✅ Environment variables sudah disiapkan
- [ ] ✅ Build berhasil lokal (`npm run build`)
- [ ] ✅ Preview build berhasil (`npm run preview`)
- [ ] ✅ Tidak ada error di console
- [ ] ✅ Semua fitur tested
- [ ] ✅ .env tidak ter-commit ke Git

---

## 🔒 Security Best Practices

### Environment Variables
- ❌ **JANGAN** commit `.env` ke Git
- ✅ Gunakan platform environment variables
- ✅ Rotate keys secara berkala
- ✅ Gunakan different keys untuk dev/prod

### Supabase Security
- ✅ Enable RLS pada semua tables
- ✅ Review RLS policies
- ✅ Enable email confirmation (optional)
- ✅ Set up rate limiting
- ✅ Monitor usage di Supabase dashboard

### Code Security
- ✅ Update dependencies regularly
- ✅ Run `npm audit` untuk check vulnerabilities
- ✅ Sanitize user inputs
- ✅ Validate data di backend

---

## 🎯 Post-Deployment

### Testing Production
1. Test registrasi siswa
2. Test registrasi orang tua
3. Test login/logout
4. Test game flow
5. Test achievement unlocking
6. Test di berbagai devices
7. Test di berbagai browsers

### Monitoring
- Monitor Supabase usage
- Check error logs
- Monitor performance
- Track user analytics (optional)

### Custom Domain (Optional)
Semua platform di atas support custom domain:
1. Beli domain (Namecheap, GoDaddy, dll)
2. Add domain di platform hosting
3. Update DNS records
4. Wait for propagation (24-48 jam)

---

## 🔧 Troubleshooting Deployment

### Build Errors
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Pastikan prefix `VITE_` ada
- Restart build setelah add variables
- Check typo di variable names

### 404 on Refresh
Tambahkan file `public/_redirects` (Netlify):
```
/* /index.html 200
```

Atau `vercel.json` (Vercel):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### CORS Errors
- Check Supabase URL benar
- Verify RLS policies
- Check browser console untuk detail

---

## 📊 Performance Optimization

### Before Deploy:
```bash
# Optimize build
npm run build

# Check bundle size
npx vite-bundle-visualizer
```

### Optimizations:
- ✅ Code splitting implemented
- ✅ Lazy loading ready
- ✅ Image optimization
- ✅ Minification automatic
- ✅ Tree shaking enabled

---

## 🎉 Success!

Setelah deployment berhasil:
1. ✅ Share URL dengan users
2. ✅ Collect feedback
3. ✅ Monitor usage
4. ✅ Iterate and improve!

---

**Platform URL Examples:**
- Vercel: `https://cerdas.vercel.app`
- Netlify: `https://cerdas.netlify.app`
- Railway: `https://cerdas.up.railway.app`
- Custom: `https://belajar-cerdas.com`

**Happy Deploying! 🚀**
