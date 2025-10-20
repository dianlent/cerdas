import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { 
  Trophy, Crown, Medal, Star, Target, 
  TrendingUp, Award, Zap, Users 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Leaderboard() {
  const { student } = useAuthStore()
  const [activeTab, setActiveTab] = useState('global')
  const [globalLeaderboard, setGlobalLeaderboard] = useState([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([])
  const [subjectLeaderboards, setSubjectLeaderboards] = useState({})
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'subject' && selectedSubject) {
      loadSubjectLeaderboard(selectedSubject)
    }
  }, [selectedSubject])

  const loadLeaderboardData = async () => {
    try {
      setLoading(true)

      // Load global leaderboard
      const { data: globalData, error: globalError } = await supabase
        .from('leaderboard_global')
        .select('*')
        .limit(50)

      if (globalError) throw globalError
      setGlobalLeaderboard(globalData || [])

      // Load weekly leaderboard
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('leaderboard_weekly')
        .select('*')
        .limit(20)

      if (weeklyError) throw weeklyError
      setWeeklyLeaderboard(weeklyData || [])

      // Load subjects for tabs
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
      
      setSubjects(subjectsData || [])
      if (subjectsData && subjectsData.length > 0) {
        setSelectedSubject(subjectsData[0].id)
      }

      // Get my rank if student
      if (student?.id) {
        const { data: rankData } = await supabase
          .rpc('get_student_rank', { p_student_id: student.id })
        
        if (rankData && rankData.length > 0) {
          setMyRank(rankData[0])
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjectLeaderboard = async (subjectId) => {
    if (subjectLeaderboards[subjectId]) return // Already loaded

    try {
      const { data, error } = await supabase
        .rpc('get_subject_leaderboard', { 
          p_subject_id: subjectId,
          limit_count: 20
        })

      if (error) throw error
      
      setSubjectLeaderboards(prev => ({
        ...prev,
        [subjectId]: data || []
      }))
    } catch (error) {
      console.error('Error loading subject leaderboard:', error)
    }
  }

  const getRankIcon = (position) => {
    if (position === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (position === 3) return <Medal className="w-6 h-6 text-orange-600" />
    return <span className="text-gray-500 font-bold">#{position}</span>
  }

  const getRankBadgeColor = (position) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500'
    if (position === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600'
    return 'bg-gradient-to-r from-blue-400 to-blue-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat peringkat...</p>
        </div>
      </div>
    )
  }

  const currentLeaderboard = 
    activeTab === 'global' ? globalLeaderboard :
    activeTab === 'weekly' ? weeklyLeaderboard :
    (selectedSubject && subjectLeaderboards[selectedSubject]) || []

  return (
    <div className="space-y-6">
      {/* Header with My Rank */}
      {myRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Peringkat Kamu</h3>
              <p className="text-white/80 text-sm">
                Kamu ada di top {myRank.percentile}% dari {myRank.total_students} siswa!
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">#{myRank.rank_position}</div>
              <div className="text-sm text-white/80">{myRank.total_points} poin</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 border-b pb-4 mb-4 overflow-x-auto">
          <TabButton
            active={activeTab === 'global'}
            onClick={() => setActiveTab('global')}
            icon={<Trophy className="w-4 h-4" />}
            label="Global"
          />
          <TabButton
            active={activeTab === 'weekly'}
            onClick={() => setActiveTab('weekly')}
            icon={<Zap className="w-4 h-4" />}
            label="Mingguan"
          />
          <TabButton
            active={activeTab === 'subject'}
            onClick={() => setActiveTab('subject')}
            icon={<Target className="w-4 h-4" />}
            label="Per Mapel"
          />
        </div>

        {/* Subject Selector for Subject Tab */}
        {activeTab === 'subject' && subjects.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {subjects.map(subject => (
              <motion.button
                key={subject.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                  selectedSubject === subject.id
                    ? 'bg-gradient-to-r from-primary-orange to-primary-pink text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject.icon} {subject.name}
              </motion.button>
            ))}
          </div>
        )}

        {/* Leaderboard List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedSubject || '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {currentLeaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada data peringkat</p>
              </div>
            ) : (
              currentLeaderboard.map((entry, index) => (
                <LeaderboardEntry
                  key={entry.student_id}
                  entry={entry}
                  position={entry.rank_position}
                  isCurrentUser={student?.id === entry.student_id}
                  type={activeTab}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-primary-blue" />
          <h3 className="font-bold">Tips Naik Peringkat</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Main game setiap hari untuk jaga streak
          </li>
          <li className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            Kumpulkan badge untuk bonus poin
          </li>
          <li className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Fokus jawab dengan benar untuk akurasi tinggi
          </li>
        </ul>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        active
          ? 'bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  )
}

function LeaderboardEntry({ entry, position, isCurrentUser, type }) {
  const getRankBadgeColor = (pos) => {
    if (pos === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    if (pos === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500'
    if (pos === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600'
    return 'bg-gradient-to-r from-blue-400 to-blue-600'
  }

  const getRankIcon = (pos) => {
    if (pos === 1) return <Crown className="w-5 h-5 text-white" />
    if (pos === 2) return <Medal className="w-5 h-5 text-white" />
    if (pos === 3) return <Medal className="w-5 h-5 text-white" />
    return null
  }

  const getPoints = () => {
    if (type === 'global') return entry.total_points
    if (type === 'weekly') return entry.points_this_week
    if (type === 'subject') return entry.subject_points
    return 0
  }

  const getAccuracy = () => {
    if (type === 'global' || type === 'subject') {
      return Math.round(entry.accuracy_percentage || 0)
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
          : position <= 3
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      {/* Rank Badge */}
      <div className={`${getRankBadgeColor(position)} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg`}>
        {getRankIcon(position) || (
          <span className="text-white font-bold text-sm">#{position}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {entry.full_name?.charAt(0).toUpperCase() || '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 truncate">
          {entry.full_name}
          {isCurrentUser && (
            <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
              Kamu
            </span>
          )}
        </h4>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {getPoints()} poin
          </span>
          {getAccuracy() !== null && (
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {getAccuracy()}% akurat
            </span>
          )}
          {type === 'global' && entry.current_level && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Level {entry.current_level}
            </span>
          )}
        </div>
      </div>

      {/* Achievement Count (for global) */}
      {type === 'global' && entry.total_achievements > 0 && (
        <div className="text-center">
          <Award className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <div className="text-xs text-gray-600">{entry.total_achievements} badge</div>
        </div>
      )}
    </motion.div>
  )
}
