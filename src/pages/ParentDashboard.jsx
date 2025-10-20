import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { 
  LogOut, Users, TrendingUp, Clock, Trophy, 
  Star, BookOpen, Award, Calendar 
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ParentDashboard() {
  const { user, profile, parent, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [linkedStudents, setLinkedStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentStats, setStudentStats] = useState(null)
  const [recentSessions, setRecentSessions] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadParentData()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentDetails(selectedStudent.id)
    }
  }, [selectedStudent])

  const loadParentData = async () => {
    try {
      if (!parent?.id) return

      // Load linked students
      const { data: links } = await supabase
        .from('parent_student_links')
        .select(`
          *,
          students (
            *,
            profiles (full_name, email)
          )
        `)
        .eq('parent_id', parent.id)

      const students = links?.map(link => ({
        ...link.students,
        relationship: link.relationship
      })) || []

      setLinkedStudents(students)
      
      if (students.length > 0) {
        setSelectedStudent(students[0])
      }
    } catch (error) {
      console.error('Error loading parent data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudentDetails = async (studentId) => {
    try {
      // Load student stats
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()
      setStudentStats(student)

      // Load recent sessions
      const { data: sessions } = await supabase
        .from('game_sessions')
        .select('*, subjects(name, icon)')
        .eq('student_id', studentId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10)
      setRecentSessions(sessions || [])

      // Load achievements
      const { data: earnedAchievements } = await supabase
        .from('student_achievements')
        .select('*, achievements(*)')
        .eq('student_id', studentId)
      setAchievements(earnedAchievements || [])
    } catch (error) {
      console.error('Error loading student details:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (linkedStudents.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-r from-primary-pink to-primary-purple text-white py-8 px-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Dashboard Orang Tua 👨‍👩‍👧‍👦
                </h1>
                <p className="text-white/90">Halo, {profile?.full_name}!</p>
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

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto card text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Belum Ada Siswa Terhubung</h2>
            <p className="text-gray-600 mb-6">
              Hubungkan akun Anda dengan akun siswa untuk mulai memantau progres belajar mereka.
            </p>
            <p className="text-sm text-gray-500">
              💡 Fitur untuk menghubungkan siswa akan segera hadir!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-pink to-primary-purple text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Dashboard Orang Tua 👨‍👩‍👧‍👦
              </h1>
              <p className="text-white/90">Pantau progres belajar anak Anda</p>
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
        {/* Student Selector */}
        {linkedStudents.length > 1 && (
          <div className="mb-6">
            <div className="card">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Siswa:
              </label>
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const student = linkedStudents.find(s => s.id === e.target.value)
                  setSelectedStudent(student)
                }}
                className="input-field"
              >
                {linkedStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.profiles?.full_name} ({student.relationship})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {selectedStudent && studentStats && (
          <>
            {/* Student Info Card */}
            <div className="card mb-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-pink to-primary-purple rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedStudent.profiles?.full_name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedStudent.profiles?.full_name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedStudent.relationship && `${selectedStudent.relationship} • `}
                    Kelas {selectedStudent.grade_level || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Star className="w-6 h-6" />}
                label="Total Poin"
                value={studentStats.total_points || 0}
                color="from-yellow-400 to-orange-400"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Level"
                value={studentStats.current_level || 1}
                color="from-blue-400 to-cyan-400"
              />
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                label="Badge"
                value={achievements.length}
                color="from-purple-400 to-pink-400"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                label="Waktu Belajar"
                value={`${studentStats.total_study_time || 0} min`}
                color="from-green-400 to-emerald-400"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Activity */}
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary-pink" />
                    Aktivitas Belajar Terakhir
                  </h2>
                  {recentSessions.length > 0 ? (
                    <div className="space-y-3">
                      {recentSessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                      ))}
                    </div>
                  ) : (
                    <div className="card text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Belum ada aktivitas belajar</p>
                    </div>
                  )}
                </section>

                {/* Progress Chart Placeholder */}
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary-blue" />
                    Progres Belajar
                  </h2>
                  <div className="card">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Total Game Dimainkan</span>
                          <span className="font-semibold">{recentSessions.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-orange to-primary-pink h-2 rounded-full" 
                            style={{ width: `${Math.min((recentSessions.length / 10) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Streak Saat Ini</span>
                          <span className="font-semibold">{studentStats.current_streak || 0} hari</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" 
                            style={{ width: `${Math.min((studentStats.current_streak / 7) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-orange" />
                    Badge yang Diraih
                  </h2>
                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((earned) => (
                        <AchievementCard key={earned.id} achievement={earned.achievements} />
                      ))}
                    </div>
                  ) : (
                    <div className="card text-center py-6">
                      <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Belum ada badge</p>
                    </div>
                  )}
                </section>

                {/* Tips */}
                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    💡 Tips untuk Orang Tua
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Dorong anak untuk belajar setiap hari</li>
                    <li>✓ Rayakan setiap pencapaian mereka</li>
                    <li>✓ Diskusikan materi yang dipelajari</li>
                    <li>✓ Jaga konsistensi waktu belajar</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
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
        </div>
      </div>
    </motion.div>
  )
}

function SessionCard({ session }) {
  const accuracy = session.total_questions > 0 
    ? Math.round((session.correct_answers / session.total_questions) * 100)
    : 0

  const date = new Date(session.completed_at)
  const formattedDate = date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="card flex items-center gap-4">
      <div className="text-4xl">{session.subjects?.icon || '📚'}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{session.subjects?.name || 'Unknown'}</h4>
        <div className="text-sm text-gray-600">
          {session.correct_answers}/{session.total_questions} benar • {accuracy}% akurasi
        </div>
        <div className="text-xs text-gray-500 mt-1">{formattedDate}</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-primary-pink">+{session.total_points_earned}</div>
        <div className="text-xs text-gray-500">poin</div>
      </div>
    </div>
  )
}

function AchievementCard({ achievement }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="card text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300"
    >
      <div className="text-3xl mb-2 animate-bounce-slow">{achievement.icon}</div>
      <div className="text-xs font-semibold">{achievement.name}</div>
    </motion.div>
  )
}
