# 🏆 Panduan Setup Sistem Peringkat (Leaderboard)

Panduan lengkap untuk mengaktifkan fitur leaderboard pada platform Cerdas.

## 📋 Persyaratan

Pastikan Anda sudah menyelesaikan setup utama aplikasi:
- ✅ Database schema (`supabase/schema.sql`) sudah dijalankan
- ✅ Seed data (`supabase/seed.sql`) sudah dijalankan
- ✅ Environment variables sudah dikonfigurasi
- ✅ Aplikasi sudah bisa berjalan

## 🚀 Langkah Setup Leaderboard

### 1. Jalankan SQL Leaderboard

1. Buka Supabase Dashboard Anda
2. Pergi ke **SQL Editor**
3. Buka file `supabase/leaderboard.sql`
4. Copy seluruh isi file
5. Paste ke SQL Editor
6. Klik **Run** untuk execute

Script ini akan membuat:
- 3 database views untuk leaderboard
- 3 database functions untuk query data
- Indexes untuk performa optimal
- RLS policies untuk keamanan

### 2. Verifikasi Installation

Jalankan query berikut di SQL Editor untuk memastikan semuanya terinstall:

```sql
-- Cek views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE 'leaderboard%';

-- Harus menampilkan:
-- leaderboard_global
-- leaderboard_by_subject
-- leaderboard_weekly
```

### 3. Test Leaderboard Functions

```sql
-- Test get_top_students
SELECT * FROM get_top_students(10);

-- Test get_student_rank (ganti dengan student_id yang valid)
SELECT * FROM get_student_rank('student-uuid-here');

-- Test get_subject_leaderboard (ganti dengan subject_id yang valid)
SELECT * FROM get_subject_leaderboard('subject-uuid-here', 10);
```

## 🎯 Cara Kerja Leaderboard

### Global Leaderboard
- Menampilkan ranking berdasarkan **total_points** dari semua siswa
- Menghitung akurasi, total game, dan achievement
- Auto-update setiap kali siswa menyelesaikan game

### Weekly Leaderboard
- Reset setiap minggu
- Hanya menghitung poin dari game minggu ini
- Memberikan motivasi kompetisi jangka pendek

### Subject Leaderboard
- Ranking per mata pelajaran
- Menampilkan akurasi dan jumlah game per subject
- Membantu siswa fokus meningkatkan skill di area tertentu

## 🎨 Fitur UI Leaderboard

### Pada Student Dashboard
- Toggle button untuk switch antara Dashboard dan Leaderboard
- Terintegrasi langsung di halaman utama
- Tidak perlu navigasi tambahan

### Pada Standalone Page
- Route: `/leaderboard`
- Full-screen view dengan header dan navigation
- Optimal untuk fokus pada kompetisi

### Komponen Leaderboard
- **Tab Global**: Ranking keseluruhan
- **Tab Mingguan**: Kompetisi minggu ini
- **Tab Per Mapel**: Pilih mata pelajaran spesifik
- **My Rank Card**: Tampilan posisi personal
- **Top 3 Badges**: Crown, Silver, Bronze medal
- **Tips Section**: Panduan untuk naik peringkat

## 🔧 Troubleshooting

### Leaderboard Kosong
**Problem**: Tidak ada data yang muncul di leaderboard

**Solusi**:
1. Pastikan ada siswa yang sudah main game
2. Check apakah game sessions tersimpan di database
3. Verifikasi RLS policies sudah correct

### Error "function does not exist"
**Problem**: Function get_top_students tidak ditemukan

**Solusi**:
1. Pastikan `leaderboard.sql` sudah dijalankan
2. Check spelling function name
3. Verify user memiliki EXECUTE permission

### Rank tidak update
**Problem**: Ranking tidak berubah setelah main game

**Solusi**:
1. Refresh halaman leaderboard
2. Check apakah game session berhasil tersimpan
3. Pastikan total_points di students table ter-update

## 📊 Database Schema Leaderboard

### View: leaderboard_global
```sql
Columns:
- student_id (UUID)
- full_name (TEXT)
- avatar_url (TEXT)
- total_points (INTEGER)
- current_level (INTEGER)
- total_games_played (BIGINT)
- accuracy_percentage (NUMERIC)
- total_achievements (BIGINT)
- rank_position (BIGINT)
```

### View: leaderboard_by_subject
```sql
Columns:
- student_id (UUID)
- full_name (TEXT)
- subject_id (UUID)
- subject_name (TEXT)
- subject_points (BIGINT)
- accuracy_percentage (NUMERIC)
- games_played (BIGINT)
- rank_position (BIGINT)
```

### View: leaderboard_weekly
```sql
Columns:
- student_id (UUID)
- full_name (TEXT)
- points_this_week (BIGINT)
- games_played_this_week (BIGINT)
- rank_position (BIGINT)
```

## 🎮 Testing Leaderboard

### Test Flow
1. **Login sebagai Student**
2. **Main beberapa game** untuk dapat poin
3. **Buka Dashboard** dan klik tab "Peringkat"
4. **Verify**:
   - Nama kamu muncul di list
   - Rank position sesuai dengan poin
   - Accuracy percentage calculated correctly
   - "My Rank" card shows your position

### Test Multiple Students
1. Create 3-5 student accounts
2. Play games dengan setiap account
3. Variasikan jumlah poin tiap siswa
4. Check leaderboard menampilkan ranking yang benar
5. Verify top 3 mendapat badge special (Crown/Medal)

## 💡 Tips Optimasi

### Performance
- Indexes sudah otomatis dibuat untuk performa optimal
- Views di-cache oleh PostgreSQL
- Consider materialized views untuk dataset besar (>1000 students)

### Security
- RLS policies memastikan students hanya bisa view data
- Sensitive data (email, dll) tidak exposed di leaderboard
- Functions memiliki permission control

### UX Improvements
- Loading states untuk better experience
- Error handling yang user-friendly
- Smooth animations dengan Framer Motion
- Responsive design untuk mobile

## 🎯 Fitur Tambahan (Future)

Ide untuk pengembangan leaderboard:
- [ ] Filter by grade/class
- [ ] Time-based leaderboards (daily, monthly)
- [ ] Subject-specific achievements
- [ ] Leaderboard badges/rewards
- [ ] Friend comparison feature
- [ ] Export leaderboard to PDF
- [ ] Admin dashboard untuk manage leaderboards

## 📞 Support

Jika mengalami masalah dengan leaderboard system:
1. Check browser console untuk error messages
2. Verify database queries di Supabase logs
3. Review RLS policies di Supabase dashboard
4. Pastikan semua migrations sudah running

---

**Selamat menggunakan fitur Leaderboard! 🎉**

Sistem peringkat ini dirancang untuk meningkatkan motivasi dan engagement siswa dalam belajar. Happy coding! 🚀
