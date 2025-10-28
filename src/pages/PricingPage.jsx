import { motion } from 'framer-motion'

export default function PricingPage() {
  const plans = [
    { name: 'Gratis', price: 'Rp0', features: ['Akses materi dasar', 'Kuis terbatas', 'Leaderboard'] },
    { name: 'Pro', price: 'Rp39.000/bulan', features: ['Semua materi', 'Tanpa batas kuis', 'Statistik lengkap', 'Badge eksklusif'] },
    { name: 'Keluarga', price: 'Rp79.000/bulan', features: ['Hingga 4 akun', 'Parent dashboard', 'Laporan mingguan'] },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-orange to-primary-pink bg-clip-text text-transparent">Harga</h1>
          <p className="text-gray-600">Pilih paket yang sesuai kebutuhan belajar.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div key={p.name} whileHover={{ y: -4 }} className="card">
              <div className="text-xl font-bold mb-1">{p.name}</div>
              <div className="text-2xl font-extrabold mb-4 text-primary-orange">{p.price}</div>
              <ul className="text-gray-700 space-y-1 mb-4 list-disc ml-5">
                {p.features.map((f) => (<li key={f}>{f}</li>))}
              </ul>
              <button className="btn-primary w-full">Pilih Paket</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
