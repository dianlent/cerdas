-- ============================================
-- CERDAS EDUCATION PLATFORM - SEED DATA
-- ============================================

-- ============================================
-- SEED SUBJECTS (3 subjects)
-- ============================================
INSERT INTO subjects (id, name, description, icon, color, is_active) VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Matematika', 'Belajar angka, penjumlahan, pengurangan, dan logika matematika', '🔢', '#FF8C42', true),
  ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Bahasa Inggris', 'Belajar vocabulary, grammar, dan conversation', '🇬🇧', '#4ECDC4', true),
  ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Sains', 'Eksplorasi alam, eksperimen, dan penemuan ilmiah', '🔬', '#A78BFA', true);

-- ============================================
-- SEED QUESTIONS - MATEMATIKA (5 questions)
-- ============================================
INSERT INTO questions (subject_id, question_text, question_type, options, correct_answer, explanation, difficulty_level, points_value) VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Berapa hasil dari 5 + 3?',
    'multiple_choice',
    '["6", "7", "8", "9"]'::jsonb,
    '8',
    'Ketika kita menambahkan 5 dan 3, kita menghitung: 5 + 3 = 8. Bayangkan kamu punya 5 permen, lalu dapat 3 permen lagi, totalnya jadi 8 permen!',
    1,
    10
  ),
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Jika kamu punya 10 kelereng dan memberikan 4 ke temanmu, berapa kelereng yang tersisa?',
    'multiple_choice',
    '["4", "5", "6", "7"]'::jsonb,
    '6',
    'Ini adalah soal pengurangan! 10 - 4 = 6. Kamu mulai dengan 10 kelereng, lalu memberikan 4, jadi sisanya 6 kelereng.',
    1,
    10
  ),
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Berapa hasil dari 7 + 8?',
    'multiple_choice',
    '["13", "14", "15", "16"]'::jsonb,
    '15',
    'Penjumlahan 7 + 8 = 15. Cara mudahnya: 7 + 3 = 10, lalu 10 + 5 = 15!',
    2,
    15
  ),
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Manakah angka yang paling besar?',
    'multiple_choice',
    '["23", "32", "29", "25"]'::jsonb,
    '32',
    'Angka 32 adalah yang paling besar! Urutan dari terkecil ke terbesar: 23, 25, 29, 32.',
    2,
    15
  ),
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Berapa hasil dari 12 - 5 + 3?',
    'multiple_choice',
    '["8", "9", "10", "11"]'::jsonb,
    '10',
    'Kerjakan dari kiri ke kanan: 12 - 5 = 7, lalu 7 + 3 = 10. Jadi jawabannya adalah 10!',
    3,
    20
  );

-- ============================================
-- SEED ACHIEVEMENTS (4 badges)
-- ============================================
INSERT INTO achievements (id, name, description, icon, badge_color, requirement_type, requirement_value) VALUES
  ('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Pemula', 'Selesaikan game pertamamu!', '🌟', '#FFD93D', 'games_played', 1),
  ('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'Rajin Belajar', 'Mainkan 10 game!', '📚', '#FF8C42', 'games_played', 10),
  ('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'Master Matematika', 'Kumpulkan 500 poin!', '🏆', '#FF6B9D', 'points', 500),
  ('a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 'Streak Champion', 'Belajar 7 hari berturut-turut!', '🔥', '#4ECDC4', 'streak', 7);

-- ============================================
-- NOTES FOR SETUP
-- ============================================
-- After running this seed:
-- 1. You'll have 3 subjects ready to use
-- 2. 5 math questions ready for the quiz game
-- 3. 4 achievement badges that students can earn
-- 4. Students and parents need to register through the app
-- 5. Game sessions and student achievements will be created automatically through gameplay
