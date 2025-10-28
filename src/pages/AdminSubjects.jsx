import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, Save, Trash2, Edit2, ArrowLeft, BookOpen, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ id: null, name: '', icon: '📚', description: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError('Gagal memuat daftar mata pelajaran')
    setSubjects(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!query) return subjects
    const q = query.toLowerCase()
    return subjects.filter(s => (s.name || '').toLowerCase().includes(q))
  }, [subjects, query])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    if (form.id) {
      const { error: err } = await supabase
        .from('subjects')
        .update({ name: form.name, icon: form.icon, description: form.description })
        .eq('id', form.id)
      if (err) setError('Gagal menyimpan perubahan')
    } else {
      const { error: err } = await supabase
        .from('subjects')
        .insert({ name: form.name, icon: form.icon, description: form.description })
      if (err) setError('Gagal membuat mata pelajaran')
    }
    setSaving(false)
    setForm({ id: null, name: '', icon: '📚', description: '' })
    load()
  }

  const editRow = (s) => setForm({ id: s.id, name: s.name || '', icon: s.icon || '📚', description: s.description || '' })

  const remove = async (id) => {
    setError('')
    const { error: err } = await supabase.from('subjects').delete().eq('id', id)
    if (err) setError('Gagal menghapus mata pelajaran')
    load()
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary-orange" />
          <h1 className="text-3xl font-bold">Kelola Mata Pelajaran</h1>
        </div>
        <Link to="/admin" className="px-4 py-2 rounded-xl border-2 border-gray-200 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card md:col-span-1">
          <form onSubmit={submit} className="space-y-3">
            <div className="text-lg font-semibold mb-2">{form.id ? 'Edit' : 'Tambah'} Mata Pelajaran</div>
            <input
              type="text"
              className="input-field"
              placeholder="Nama"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Ikon (emoji)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
            <textarea
              className="input-field"
              placeholder="Deskripsi"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
            <button disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {form.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {form.id ? 'Simpan Perubahan' : 'Tambah Mata Pelajaran'}
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="card mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input-field"
                placeholder="Cari nama mata pelajaran"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="card overflow-x-auto">
            {loading ? (
              <div className="py-8 text-center">Memuat...</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Ikon</th>
                    <th className="py-2 pr-4">Nama</th>
                    <th className="py-2 pr-4">Deskripsi</th>
                    <th className="py-2 pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="py-3 pr-4 text-xl">{s.icon}</td>
                      <td className="py-3 pr-4 font-semibold">{s.name}</td>
                      <td className="py-3 pr-4">{s.description}</td>
                      <td className="py-3 pr-4 flex gap-2">
                        <button onClick={() => editRow(s)} className="px-3 py-2 rounded-xl border-2 border-gray-200 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => remove(s.id)} className="px-3 py-2 rounded-xl border-2 border-red-200 text-red-600 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="py-6 text-center text-gray-500" colSpan={4}>Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-4 text-sm text-red-700">
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
