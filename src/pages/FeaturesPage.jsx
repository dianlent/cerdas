import { motion } from 'framer-motion'
import { BookOpen, Trophy, Star, Sparkles, Rocket, Heart } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    { icon: <BookOpen className="w-8 h-8 text-primary-orange" />, title: 'Belajar Interaktif', desc: 'Kuis dan game edukatif untuk Matematika, Bahasa Inggris, dan Sains.' },
    { icon: <Trophy className="w-8 h-8 text-primary-pink" />, title: 'Achievements', desc: 'Badge dan pencapaian untuk memotivasi belajar.' },
    { icon: <Star className="w-8 h-8 text-yellow-500" />, title: 'Level & Poin', desc: 'Naik level dan kumpulkan poin untuk membuka fitur.' },
    { icon: <Sparkles className="w-8 h-8 text-primary-purple" />, title: 'Daily Streak', desc: 'Jaga konsistensi belajar harianmu.' },
    { icon: <Rocket className="w-8 h-8 text-primary-blue" />, title: 'Progress Tracking', desc: 'Statistik lengkap untuk memantau perkembangan.' },
    { icon: <Heart className="w-8 h-8 text-red-500" />, title: 'Parent Dashboard', desc: 'Pantau progres anak secara real-time.' },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-orange to-primary-pink bg-clip-text text-transparent">Fitur</h1>
          <p className="text-gray-600">Semua yang kamu butuhkan untuk belajar menyenangkan dan terarah.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="card">
              <div className="mb-3">{f.icon}</div>
              <div className="text-lg font-semibold mb-1">{f.title}</div>
              <div className="text-gray-600">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
