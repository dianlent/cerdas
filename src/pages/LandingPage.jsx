import { Link } from 'react-router-dom'
import { BookOpen, Trophy, Star, Sparkles, Rocket, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl"
            >
              🎓
            </motion.div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-orange via-primary-pink to-primary-purple bg-clip-text text-transparent">
            Cerdas
          </h1>
          
          <p className="text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Platform Belajar Interaktif yang Menyenangkan untuk Anak-anak! 🌟
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg"
              >
                Mulai Belajar Sekarang! 🚀
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg"
              >
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-primary-orange" />}
            title="Belajar Interaktif"
            description="Kuis dan game edukatif yang seru untuk Matematika, Bahasa Inggris, dan Sains"
            color="from-orange-100 to-yellow-100"
          />
          <FeatureCard
            icon={<Trophy className="w-12 h-12 text-primary-pink" />}
            title="Kumpulkan Badge"
            description="Raih achievement dan badge keren setiap kali menyelesaikan tantangan"
            color="from-pink-100 to-purple-100"
          />
          <FeatureCard
            icon={<Star className="w-12 h-12 text-primary-yellow" />}
            title="Sistem Poin & Level"
            description="Naik level dan kumpulkan poin untuk membuka fitur-fitur baru"
            color="from-yellow-100 to-orange-100"
          />
          <FeatureCard
            icon={<Sparkles className="w-12 h-12 text-primary-purple" />}
            title="Daily Streak"
            description="Jaga streak belajar harianmu dan jadilah yang terbaik!"
            color="from-purple-100 to-pink-100"
          />
          <FeatureCard
            icon={<Rocket className="w-12 h-12 text-primary-blue" />}
            title="Progress Tracking"
            description="Pantau perkembangan belajarmu dengan statistik lengkap"
            color="from-blue-100 to-cyan-100"
          />
          <FeatureCard
            icon={<Heart className="w-12 h-12 text-red-400" />}
            title="Parent Dashboard"
            description="Orang tua bisa memantau progres dan prestasi anak"
            color="from-red-100 to-pink-100"
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-4xl font-bold mb-12 text-gray-800">
            Kenapa Memilih Cerdas? ✨
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard number="3" label="Mata Pelajaran" emoji="📚" />
            <StatCard number="100+" label="Soal Interaktif" emoji="❓" />
            <StatCard number="4" label="Badge Achievements" emoji="🏆" />
            <StatCard number="∞" label="Keseruan Belajar" emoji="🎉" />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-20 text-center bg-gradient-to-r from-primary-orange to-primary-pink rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Siap Menjadi Lebih Cerdas? 🚀
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan siswa yang sudah belajar dengan cara yang menyenangkan!
          </p>
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-orange font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 text-lg"
            >
              Daftar Gratis Sekarang! 🎁
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`card bg-gradient-to-br ${color}`}
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function StatCard({ number, label, emoji }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card text-center"
    >
      <div className="text-5xl mb-2">{emoji}</div>
      <div className="text-4xl font-bold text-primary-orange mb-2">{number}</div>
      <div className="text-gray-600 font-semibold">{label}</div>
    </motion.div>
  )
}
