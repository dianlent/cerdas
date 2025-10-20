import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🎓
        </motion.div>
        <div className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl text-gray-600 font-semibold">Memuat Cerdas...</p>
      </div>
    </div>
  )
}
