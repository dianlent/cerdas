-- ============================================
-- CERDAS EDUCATION PLATFORM - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  grade_level INTEGER,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. PARENTS TABLE
-- ============================================
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. PARENT-STUDENT LINKS TABLE
-- ============================================
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT, -- e.g., 'mother', 'father', 'guardian'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- ============================================
-- 5. SUBJECTS TABLE
-- ============================================
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  color TEXT, -- hex color code
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. QUESTIONS TABLE
-- ============================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank')),
  options JSONB, -- array of options for multiple choice
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  points_value INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. GAME SESSIONS TABLE
-- ============================================
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  total_points_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER, -- time taken to complete
  completed_at TIMESTAMP WITH TIME ZONE,
  answers JSONB, -- detailed answer log
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  badge_color TEXT,
  requirement_type TEXT NOT NULL, -- 'points', 'streak', 'games_played', 'perfect_score'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. STUDENT ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_students_profile_id ON students(profile_id);
CREATE INDEX idx_parents_profile_id ON parents(profile_id);
CREATE INDEX idx_parent_student_links_parent ON parent_student_links(parent_id);
CREATE INDEX idx_parent_student_links_student ON parent_student_links(student_id);
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_game_sessions_student ON game_sessions(student_id);
CREATE INDEX idx_game_sessions_subject ON game_sessions(subject_id);
CREATE INDEX idx_student_achievements_student ON student_achievements(student_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profile on signup" ON profiles
  FOR INSERT WITH CHECK (true);

-- Students policies
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (
    profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      JOIN parents p ON p.id = psl.parent_id
      WHERE psl.student_id = students.id AND p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Students can insert own data" ON students
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Parents policies
CREATE POLICY "Parents can view own data" ON parents
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Parents can update own data" ON parents
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Parents can insert own data" ON parents
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Parent-Student links policies
CREATE POLICY "Parents can view own links" ON parent_student_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parents WHERE id = parent_id AND profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND profile_id = auth.uid()
    )
  );

-- Subjects policies (public read)
CREATE POLICY "Anyone can view subjects" ON subjects
  FOR SELECT USING (is_active = true);

-- Questions policies (public read)
CREATE POLICY "Anyone can view questions" ON questions
  FOR SELECT USING (true);

-- Game sessions policies
CREATE POLICY "Students can view own sessions" ON game_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      JOIN parents p ON p.id = psl.parent_id
      WHERE psl.student_id = game_sessions.student_id AND p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own sessions" ON game_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own sessions" ON game_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND profile_id = auth.uid()
    )
  );

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- Student achievements policies
CREATE POLICY "Students can view own achievements" ON student_achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM parent_student_links psl
      JOIN parents p ON p.id = psl.parent_id
      WHERE psl.student_id = student_achievements.student_id AND p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own achievements" ON student_achievements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students WHERE id = student_id AND profile_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS FOR AUTO-UPDATING TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
