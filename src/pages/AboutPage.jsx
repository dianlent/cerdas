import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-orange to-primary-pink bg-clip-text text-transparent">
            Tentang Cerdas
          </h1>
          <p className="text-gray-600">Platform belajar interaktif untuk siswa dan dukungan monitoring untuk orang tua.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Misi</h2>
            <p className="text-gray-700">Membuat proses belajar menjadi menyenangkan, terukur, dan berdampak melalui gamifikasi.</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Nilai</h2>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>Fun-first learning</li>
              <li>Transparansi progres</li>
              <li>Keamanan data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
