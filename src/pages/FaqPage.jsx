import { motion } from 'framer-motion'

export default function FaqPage() {
  const faqs = [
    { q: 'Apa itu Cerdas?', a: 'Cerdas adalah platform belajar berbasis gamifikasi untuk siswa SD dengan dukungan orang tua.' },
    { q: 'Apakah Cerdas gratis?', a: 'Ada paket gratis dan paket berbayar dengan fitur tambahan.' },
    { q: 'Bagaimana orang tua memantau progres?', a: 'Melalui Parent Dashboard yang menampilkan statistik belajar anak.' },
    { q: 'Apakah data saya aman?', a: 'Kami menerapkan kebijakan keamanan dan enkripsi sesuai praktik terbaik.' },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-orange to-primary-pink bg-clip-text text-transparent">FAQ</h1>
          <p className="text-gray-600">Pertanyaan yang sering diajukan.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="card">
              <div className="font-semibold mb-1">{f.q}</div>
              <div className="text-gray-700">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
