# ⚡ Quick Start Guide

## 🎯 Langkah Cepat (5 Menit)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL dari `supabase/schema.sql` di SQL Editor
3. Jalankan SQL dari `supabase/seed.sql` di SQL Editor
4. Copy Project URL dan Anon Key dari Settings > API

### 3️⃣ Configure Environment

```bash
# Copy .env.example ke .env
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000 🎉

---

## 🧪 Test Account

Setelah registrasi, coba:

**Siswa:**
1. Daftar sebagai Siswa
2. Main game Matematika
3. Kumpulkan poin dan badge!

**Orang Tua:**
1. Daftar sebagai Orang Tua
2. (Link dengan siswa - fitur coming soon)

---

## 📁 File Penting

- `supabase/schema.sql` - Database structure (9 tables)
- `supabase/seed.sql` - Sample data (3 subjects, 5 questions, 4 badges)
- `.env` - Your Supabase credentials
- `src/lib/supabase.js` - Supabase client config
- `src/store/authStore.js` - Authentication state management

---

## 🎮 Fitur yang Sudah Jalan

✅ Authentication (Student & Parent)  
✅ Student Dashboard dengan stats  
✅ 3 Mata Pelajaran (Matematika, Bahasa Inggris, Sains)  
✅ Interactive Math Quiz (5 questions)  
✅ Points & Level System  
✅ Badge Achievements (4 badges)  
✅ Daily Streak Tracking  
✅ Parent Dashboard untuk monitoring  
✅ Responsive Design  
✅ Smooth Animations  

---

## 🚀 Production Build

```bash
npm run build
npm run preview
```

---

**Need detailed setup?** Lihat `SETUP_GUIDE.md`
