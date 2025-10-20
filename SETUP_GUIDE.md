# 🚀 Panduan Setup Lengkap - Platform Cerdas

## 📋 Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Setup Supabase](#setup-supabase)
3. [Setup Project](#setup-project)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Pastikan Anda sudah menginstall:
- ✅ **Node.js** versi 18 atau lebih baru ([Download](https://nodejs.org/))
- ✅ **npm** atau **yarn** (sudah termasuk dengan Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ Akun **Supabase** gratis ([Daftar](https://supabase.com))

---

## Setup Supabase

### Langkah 1: Buat Project Baru

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Klik **"New Project"**
3. Isi detail project:
   - **Name**: cerdas-edu-platform
   - **Database Password**: Buat password yang kuat (simpan dengan aman!)
   - **Region**: Pilih yang terdekat dengan lokasi Anda
4. Klik **"Create new project"**
5. Tunggu beberapa menit hingga project selesai dibuat

### Langkah 2: Jalankan Database Schema

1. Di Supabase Dashboard, buka menu **"SQL Editor"** (ikon database di sidebar)
2. Klik **"New Query"**
3. Copy seluruh isi file `supabase/schema.sql` dari project ini
4. Paste ke SQL Editor
5. Klik **"Run"** atau tekan `Ctrl+Enter`
6. Pastikan muncul pesan sukses tanpa error

### Langkah 3: Jalankan Seed Data

1. Masih di SQL Editor, buat query baru
2. Copy seluruh isi file `supabase/seed.sql`
3. Paste ke SQL Editor
4. Klik **"Run"**
5. Verifikasi data berhasil dimasukkan:
   - Buka menu **"Table Editor"**
   - Cek tabel `subjects` (harus ada 3 mata pelajaran)
   - Cek tabel `questions` (harus ada 5 soal matematika)
   - Cek tabel `achievements` (harus ada 4 badge)

### Langkah 4: Dapatkan API Credentials

1. Buka menu **"Settings"** (ikon gear di sidebar)
2. Pilih **"API"**
3. Copy dua nilai ini:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key (di bagian "Project API keys")
4. Simpan kedua nilai ini, akan digunakan di langkah berikutnya

---

## Setup Project

### Langkah 1: Clone/Download Project

```bash
# Jika menggunakan Git
git clone <repository-url>
cd cerdas

# Atau download ZIP dan extract
```

### Langkah 2: Install Dependencies

```bash
npm install
```

Tunggu hingga semua package terinstall (sekitar 2-5 menit).

### Langkah 3: Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Buka file `.env` dengan text editor

3. Isi dengan credentials Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Save file

⚠️ **PENTING**: Jangan commit file `.env` ke Git! File ini sudah ada di `.gitignore`.

---

## Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

Browser akan otomatis terbuka. Jika tidak, buka URL tersebut secara manual.

### Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`.

### Preview Production Build

```bash
npm run preview
```

---

## Testing

### Test Flow Siswa

1. **Registrasi Siswa**
   - Buka http://localhost:3000
   - Klik "Mulai Belajar Sekarang!"
   - Pilih role: **Siswa**
   - Isi form registrasi
   - Klik "Daftar Sekarang"

2. **Dashboard Siswa**
   - Setelah login, Anda akan melihat:
     - Stats cards (Poin, Level, Streak, Badge)
     - 3 Mata pelajaran (Matematika, Bahasa Inggris, Sains)
     - Badge koleksi (masih kosong)

3. **Main Game Matematika**
   - Klik card "Matematika"
   - Jawab 5 pertanyaan
   - Lihat penjelasan setiap jawaban
   - Selesaikan game
   - Lihat hasil dan poin yang didapat

4. **Cek Progress**
   - Kembali ke dashboard
   - Poin bertambah
   - Aktivitas terakhir muncul
   - Badge "Pemula" otomatis didapat

### Test Flow Orang Tua

1. **Registrasi Orang Tua**
   - Logout dari akun siswa
   - Klik "Daftar Sekarang"
   - Pilih role: **Orang Tua**
   - Isi form registrasi
   - Klik "Daftar Sekarang"

2. **Dashboard Orang Tua**
   - Akan melihat pesan "Belum Ada Siswa Terhubung"
   - (Fitur linking siswa bisa dikembangkan lebih lanjut)

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solusi:**
- Pastikan file `.env` ada di root folder
- Pastikan isi `.env` sudah benar
- Restart development server (`Ctrl+C` lalu `npm run dev` lagi)

### Error saat menjalankan SQL Schema

**Solusi:**
- Pastikan tidak ada typo saat copy-paste
- Jalankan schema.sql terlebih dahulu sebelum seed.sql
- Cek error message untuk detail masalah

### Halaman blank/putih setelah login

**Solusi:**
- Buka Developer Console (F12)
- Cek error di tab Console
- Pastikan Supabase credentials benar
- Pastikan RLS policies sudah ter-setup dengan benar

### Game tidak bisa dimainkan

**Solusi:**
- Pastikan seed.sql sudah dijalankan
- Cek tabel `questions` di Supabase, harus ada data
- Cek tabel `subjects` di Supabase, harus ada data

### Badge tidak muncul setelah main game

**Solusi:**
- Refresh halaman
- Cek tabel `student_achievements` di Supabase
- Pastikan requirements achievement sudah terpenuhi

---

## 🎉 Selamat!

Jika semua langkah di atas berhasil, platform Cerdas Anda sudah siap digunakan!

### Next Steps:

1. ✅ Tambahkan lebih banyak soal di berbagai mata pelajaran
2. ✅ Kustomisasi warna dan tema sesuai preferensi
3. ✅ Implementasi fitur linking parent-student
4. ✅ Tambahkan lebih banyak achievement
5. ✅ Deploy ke production (Vercel/Netlify)

---

## 📞 Butuh Bantuan?

Jika mengalami kesulitan:
1. Cek kembali setiap langkah dengan teliti
2. Pastikan semua prerequisites sudah terinstall
3. Cek dokumentasi Supabase: https://supabase.com/docs
4. Cek dokumentasi Vite: https://vitejs.dev/

---

**Happy Coding! 🚀**
