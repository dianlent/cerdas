import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import Leaderboard from '../components/Leaderboard'

export default function LeaderboardPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-orange to-primary-pink text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/student-dashboard')}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                Papan Peringkat
              </h1>
              <p className="text-white/90 mt-1">
                Lihat posisi kamu dan bersaing dengan siswa lainnya!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-4xl mx-auto">
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}
