import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      await new Promise((r) => setTimeout(r, 600))
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-orange to-primary-pink bg-clip-text text-transparent">Kontak</h1>
          <p className="text-gray-600">Ada pertanyaan atau saran? Kirimkan pesan Anda.</p>
        </motion.div>

        <div className="card">
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="input-field"
              placeholder="Nama"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="input-field"
              placeholder="Email"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              className="input-field"
              placeholder="Pesan"
              rows={5}
              required
            />
            <button disabled={status==='submitting'} className="btn-primary w-full">
              {status==='submitting' ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
            {status==='success' && (
              <div className="text-green-600 font-semibold text-center">Terima kasih! Pesan Anda telah dikirim.</div>
            )}
            {status==='error' && (
              <div className="text-red-600 font-semibold text-center">Terjadi kesalahan. Coba lagi.</div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
