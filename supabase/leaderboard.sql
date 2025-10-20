-- ============================================
-- LEADERBOARD SYSTEM FOR CERDAS PLATFORM
-- ============================================

-- ============================================
-- 1. GLOBAL LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW leaderboard_global AS
SELECT 
  s.id as student_id,
  p.full_name,
  p.avatar_url,
  s.total_points,
  s.current_level,
  s.current_streak,
  s.longest_streak,
  COUNT(DISTINCT gs.id) as total_games_played,
  COALESCE(SUM(gs.correct_answers), 0) as total_correct_answers,
  COALESCE(SUM(gs.total_questions), 0) as total_questions_attempted,
  CASE 
    WHEN SUM(gs.total_questions) > 0 
    THEN ROUND((SUM(gs.correct_answers)::NUMERIC / SUM(gs.total_questions)::NUMERIC) * 100, 2)
    ELSE 0 
  END as accuracy_percentage,
  COUNT(DISTINCT sa.achievement_id) as total_achievements,
  RANK() OVER (ORDER BY s.total_points DESC) as rank_position
FROM students s
INNER JOIN profiles p ON p.id = s.profile_id
LEFT JOIN game_sessions gs ON gs.student_id = s.id
LEFT JOIN student_achievements sa ON sa.student_id = s.id
GROUP BY s.id, p.full_name, p.avatar_url, s.total_points, s.current_level, s.current_streak, s.longest_streak
ORDER BY s.total_points DESC;

-- ============================================
-- 2. SUBJECT-SPECIFIC LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW leaderboard_by_subject AS
SELECT 
  s.id as student_id,
  p.full_name,
  p.avatar_url,
  sub.id as subject_id,
  sub.name as subject_name,
  sub.icon as subject_icon,
  COUNT(gs.id) as games_played,
  COALESCE(SUM(gs.total_points_earned), 0) as subject_points,
  COALESCE(SUM(gs.correct_answers), 0) as correct_answers,
  COALESCE(SUM(gs.total_questions), 0) as total_questions,
  CASE 
    WHEN SUM(gs.total_questions) > 0 
    THEN ROUND((SUM(gs.correct_answers)::NUMERIC / SUM(gs.total_questions)::NUMERIC) * 100, 2)
    ELSE 0 
  END as accuracy_percentage,
  COALESCE(AVG(gs.duration_seconds), 0) as avg_time_seconds,
  MAX(gs.created_at) as last_played,
  RANK() OVER (PARTITION BY sub.id ORDER BY SUM(gs.total_points_earned) DESC) as rank_position
FROM students s
INNER JOIN profiles p ON p.id = s.profile_id
CROSS JOIN subjects sub
LEFT JOIN game_sessions gs ON gs.student_id = s.id AND gs.subject_id = sub.id
WHERE sub.is_active = true
GROUP BY s.id, p.full_name, p.avatar_url, sub.id, sub.name, sub.icon
HAVING COUNT(gs.id) > 0
ORDER BY sub.id, subject_points DESC;

-- ============================================
-- 3. WEEKLY LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW leaderboard_weekly AS
SELECT 
  s.id as student_id,
  p.full_name,
  p.avatar_url,
  COUNT(gs.id) as games_played_this_week,
  COALESCE(SUM(gs.total_points_earned), 0) as points_this_week,
  COALESCE(SUM(gs.correct_answers), 0) as correct_answers_this_week,
  RANK() OVER (ORDER BY SUM(gs.total_points_earned) DESC) as rank_position
FROM students s
INNER JOIN profiles p ON p.id = s.profile_id
LEFT JOIN game_sessions gs ON gs.student_id = s.id 
  AND gs.created_at >= date_trunc('week', CURRENT_DATE)
GROUP BY s.id, p.full_name, p.avatar_url
HAVING COUNT(gs.id) > 0
ORDER BY points_this_week DESC;

-- ============================================
-- 4. FUNCTION: Get Top N Students (Global)
-- ============================================
CREATE OR REPLACE FUNCTION get_top_students(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_points INTEGER,
  current_level INTEGER,
  total_games_played BIGINT,
  accuracy_percentage NUMERIC,
  rank_position BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.student_id,
    lg.full_name,
    lg.avatar_url,
    lg.total_points,
    lg.current_level,
    lg.total_games_played,
    lg.accuracy_percentage,
    lg.rank_position
  FROM leaderboard_global lg
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. FUNCTION: Get Student Rank
-- ============================================
CREATE OR REPLACE FUNCTION get_student_rank(p_student_id UUID)
RETURNS TABLE (
  rank_position BIGINT,
  total_points INTEGER,
  total_students BIGINT,
  percentile NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.rank_position,
    lg.total_points,
    (SELECT COUNT(*) FROM leaderboard_global) as total_students,
    ROUND((lg.rank_position::NUMERIC / (SELECT COUNT(*) FROM leaderboard_global)::NUMERIC) * 100, 2) as percentile
  FROM leaderboard_global lg
  WHERE lg.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. FUNCTION: Get Subject Leaderboard
-- ============================================
CREATE OR REPLACE FUNCTION get_subject_leaderboard(
  p_subject_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  subject_points BIGINT,
  games_played BIGINT,
  accuracy_percentage NUMERIC,
  rank_position BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lbs.student_id,
    lbs.full_name,
    lbs.avatar_url,
    lbs.subject_points,
    lbs.games_played,
    lbs.accuracy_percentage,
    lbs.rank_position
  FROM leaderboard_by_subject lbs
  WHERE lbs.subject_id = p_subject_id
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES FOR VIEWS
-- ============================================

-- Allow authenticated users to view leaderboards
GRANT SELECT ON leaderboard_global TO authenticated;
GRANT SELECT ON leaderboard_by_subject TO authenticated;
GRANT SELECT ON leaderboard_weekly TO authenticated;

-- Allow execution of leaderboard functions
GRANT EXECUTE ON FUNCTION get_top_students TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_rank TO authenticated;
GRANT EXECUTE ON FUNCTION get_subject_leaderboard TO authenticated;

-- ============================================
-- INDEXES FOR LEADERBOARD PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_student_subject ON game_sessions(student_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_students_points ON students(total_points DESC);
