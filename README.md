# 🎓 Cerdas - Platform Belajar Interaktif

Platform edukasi gamifikasi untuk siswa dengan monitoring orang tua.

## ✨ Fitur Utama

### 1. Sistem Autentikasi
- ✅ Pendaftaran dan login untuk Siswa dan Orang Tua
- ✅ Profile management dengan role-based access
- ✅ Keamanan database dengan Row Level Security

### 2. Dashboard Siswa
- 🔥 Tampilan streak belajar harian
- 🏆 Koleksi badge/achievement
- 📚 Katalog mata pelajaran (Matematika, Bahasa Inggris, Sains)
- ⭐ Sistem poin dan level

### 3. Game Edukasi Interaktif
- 🎮 Kuis matematika dengan soal penjumlahan
- 📝 5 pertanyaan per sesi
- 💡 Penjelasan untuk setiap jawaban
- 📊 Sistem scoring real-time
- ✨ Animasi dan feedback visual

### 4. Gamifikasi
- 💰 Points system - dapatkan poin setiap jawaban benar
- 🏅 Badge achievements (Pemula, Rajin Belajar, Master Matematika, Streak Champion)
- 📈 Level progression
- 🔥 Daily streak tracking

### 5. Sistem Peringkat (Leaderboard) 🆕
- 🏆 **Global Leaderboard** - Peringkat keseluruhan berdasarkan total poin
- ⚡ **Weekly Leaderboard** - Kompetisi mingguan untuk motivasi jangka pendek
- 📚 **Subject Leaderboard** - Peringkat per mata pelajaran (Matematika, Bahasa Inggris, Sains)
- 📊 **Personal Rank Display** - Lihat posisi dan persentil kamu
- 🥇 **Top 3 Highlights** - Crown, silver, dan bronze medal untuk juara
- 🎯 **Accuracy Tracking** - Persentase akurasi jawaban ditampilkan
- 👥 **Real-time Updates** - Peringkat diperbarui otomatis setelah setiap game
- 💫 **Beautiful UI** - Animasi smooth dan desain menarik

### 6. Dashboard Orang Tua
- 👀 Monitoring progres anak
- ⏱️ Statistik waktu belajar
- 🏆 Achievement tracking

### 7. Database & Backend
- 🗄️ 9 tabel database terstruktur
- 📦 Sample data untuk 3 mata pelajaran
- ❓ 5 soal matematika siap dimainkan
- 🏅 4 achievement badges
- 📊 Sistem progress tracking komprehensif

### 8. Desain UI
- 🎨 Tema warna cerah dan kid-friendly (kuning, oranye, pink, biru, ungu)
- 📱 Responsive design untuk semua ukuran layar
- ✨ Animasi smooth dan engaging
- 🎯 Icons dan visual elements yang menarik

## 🚀 Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd cerdas
```

2. Install dependencies
```bash
npm install
```

3. Setup Supabase
   - Buat project baru di [Supabase](https://supabase.com)
   - Copy URL dan Anon Key dari Settings > API
   - Jalankan SQL schema dari `supabase/schema.sql`
   - Jalankan seed data dari `supabase/seed.sql`

4. Setup Leaderboard System
   - Jalankan SQL leaderboard dari `supabase/leaderboard.sql`
   - Script ini akan membuat views dan functions untuk sistem peringkat

5. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` dan isi dengan credentials Supabase Anda:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. Run development server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Database

### Tables (9 total):
1. **profiles** - User profiles dengan role (student/parent)
2. **students** - Data siswa
3. **parents** - Data orang tua
4. **parent_student_links** - Relasi orang tua-siswa
5. **subjects** - Mata pelajaran
6. **questions** - Bank soal
7. **game_sessions** - Sesi permainan
8. **achievements** - Badge/achievement
9. **student_achievements** - Achievement yang diraih siswa

### Leaderboard Views (3 total):
1. **leaderboard_global** - Peringkat global semua siswa berdasarkan total poin
2. **leaderboard_by_subject** - Peringkat per mata pelajaran dengan detail akurasi
3. **leaderboard_weekly** - Peringkat mingguan untuk kompetisi jangka pendek

### Database Functions:
1. **get_top_students()** - Ambil top N siswa dari leaderboard global
2. **get_student_rank()** - Dapatkan peringkat dan statistik siswa tertentu
3. **get_subject_leaderboard()** - Ambil leaderboard untuk mata pelajaran spesifik

## 🎮 Cara Menggunakan

### Untuk Siswa:
1. Daftar dengan role "Student"
2. Login ke dashboard
3. Pilih mata pelajaran
4. Mainkan kuis interaktif
5. Kumpulkan poin dan badge
6. Jaga streak harian!
7. Lihat peringkat kamu di leaderboard
8. Bersaing dengan siswa lainnya!

### Untuk Orang Tua:
1. Daftar dengan role "Parent"
2. Link dengan akun siswa
3. Monitor progres dari dashboard
4. Lihat statistik dan achievement

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6

## 📝 License

MIT License - feel free to use for educational purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
