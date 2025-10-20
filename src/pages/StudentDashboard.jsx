import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { 
  LogOut, Trophy, Flame, Star, BookOpen, 
  TrendingUp, Award, Clock, Target, Users 
} from 'lucide-react'
import { motion } from 'framer-motion'
import Leaderboard from '../components/Leaderboard'

export default function StudentDashboard() {
  const { user, profile, student, signOut, refreshStudent } = useAuthStore()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [achievements, setAchievements] = useState([])
  const [earnedAchievements, setEarnedAchievements] = useState([])
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load subjects
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
      setSubjects(subjectsData || [])

      // Load all achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
      setAchievements(achievementsData || [])

      // Load earned achievements
      if (student?.id) {
        const { data: earnedData } = await supabase
          .from('student_achievements')
          .select('*, achievements(*)')
          .eq('student_id', student.id)
        setEarnedAchievements(earnedData || [])

        // Load recent game sessions
        const { data: sessionsData } = await supabase
          .from('game_sessions')
          .select('*, subjects(name, icon)')
          .eq('student_id', student.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setRecentSessions(sessionsData || [])
      }

      // Refresh student data
      await refreshStudent()
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handlePlayGame = (subjectId) => {
    navigate(`/game/${subjectId}`)
  }

  const getLevel = (points) => {
    return Math.floor(points / 100) + 1
  }

  const getPointsToNextLevel = (points) => {
    const currentLevel = getLevel(points)
    const nextLevelPoints = currentLevel * 100
    return nextLevelPoints - points
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const earnedAchievementIds = earnedAchievements.map(ea => ea.achievement_id)

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-orange to-primary-pink text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Halo, {profile?.full_name}! 👋
              </h1>
              <p className="text-white/90">Siap belajar hari ini?</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Star className="w-6 h-6" />}
            label="Total Poin"
            value={student?.total_points || 0}
            color="from-yellow-400 to-orange-400"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Level"
            value={student?.current_level || 1}
            color="from-blue-400 to-cyan-400"
            subtitle={`${getPointsToNextLevel(student?.total_points || 0)} poin lagi!`}
          />
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            label="Streak Saat Ini"
            value={`${student?.current_streak || 0} hari`}
            color="from-orange-400 to-red-400"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6" />}
            label="Badge"
            value={earnedAchievements.length}
            color="from-purple-400 to-pink-400"
          />
        </div>

        {/* Toggle View Buttons */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLeaderboard(false)}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              !showLeaderboard
                ? 'bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              Dashboard
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLeaderboard(true)}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              showLeaderboard
                ? 'bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              Peringkat
            </div>
          </motion.button>
        </div>

        {!showLeaderboard ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
            {/* Subjects */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-orange" />
                Pilih Mata Pelajaran
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onClick={() => handlePlayGame(subject.id)}
                  />
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary-blue" />
                Aktivitas Terakhir
              </h2>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <div className="card text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada aktivitas. Yuk mulai belajar!</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-pink" />
                Badge Koleksi
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => {
                  const isEarned = earnedAchievementIds.includes(achievement.id)
                  return (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      earned={isEarned}
                    />
                  )
                })}
              </div>
            </section>

            {/* Progress Info */}
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-purple" />
                Target Harian
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Poin Hari Ini</span>
                    <span className="font-semibold">0 / 50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-orange to-primary-pink h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  💡 Mainkan game untuk mendapatkan poin dan jaga streak-mu!
                </p>
              </div>
            </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary-orange" />
                Papan Peringkat
              </h2>
              <p className="text-gray-600">
                Lihat posisi kamu dan bersaing dengan siswa lainnya!
              </p>
            </div>
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`card bg-gradient-to-br ${color} text-white`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-3 rounded-xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm opacity-90">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
        </div>
      </div>
    </motion.div>
  )
}

function SubjectCard({ subject, onClick }) {
  const colors = {
    '#FF8C42': 'from-orange-400 to-orange-500',
    '#4ECDC4': 'from-cyan-400 to-cyan-500',
    '#A78BFA': 'from-purple-400 to-purple-500',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`card cursor-pointer bg-gradient-to-br ${colors[subject.color] || 'from-gray-400 to-gray-500'} text-white`}
    >
      <div className="text-5xl mb-3 text-center">{subject.icon}</div>
      <h3 className="font-bold text-lg text-center mb-2">{subject.name}</h3>
      <p className="text-sm text-white/80 text-center mb-4">{subject.description}</p>
      <div className="bg-white/20 hover:bg-white/30 text-center py-2 rounded-lg font-semibold transition-colors">
        Mulai Belajar →
      </div>
    </motion.div>
  )
}

function SessionCard({ session }) {
  const accuracy = session.total_questions > 0 
    ? Math.round((session.correct_answers / session.total_questions) * 100)
    : 0

  return (
    <div className="card flex items-center gap-4">
      <div className="text-4xl">{session.subjects?.icon || '📚'}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{session.subjects?.name || 'Unknown'}</h4>
        <div className="text-sm text-gray-600">
          {session.correct_answers}/{session.total_questions} benar • {accuracy}% akurasi
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-primary-orange">+{session.total_points_earned}</div>
        <div className="text-xs text-gray-500">poin</div>
      </div>
    </div>
  )
}

function AchievementBadge({ achievement, earned }) {
  return (
    <motion.div
      whileHover={{ scale: earned ? 1.1 : 1 }}
      className={`card text-center p-4 ${
        earned 
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300' 
          : 'bg-gray-100 opacity-50'
      }`}
    >
      <div className={`text-3xl mb-2 ${earned ? 'animate-bounce-slow' : 'grayscale'}`}>
        {achievement.icon}
      </div>
      <div className="text-xs font-semibold">{achievement.name}</div>
      {earned && (
        <div className="text-xs text-green-600 mt-1">✓ Terkumpul</div>
      )}
    </motion.div>
  )
}
