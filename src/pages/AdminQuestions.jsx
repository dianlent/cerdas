import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, Save, Trash2, Edit2, ArrowLeft, HelpCircle, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminQuestions() {
  const [subjects, setSubjects] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [form, setForm] = useState({
    id: null,
    subject_id: '',
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points_value: 10,
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    const [{ data: subs, error: subErr }, { data: qs, error: qErr }] = await Promise.all([
      supabase.from('subjects').select('*').order('name'),
      supabase.from('questions').select('*').order('created_at', { ascending: false }),
    ])
    if (subErr) setError('Gagal memuat mata pelajaran')
    if (qErr) setError('Gagal memuat pertanyaan')
    setSubjects(subs || [])
    setQuestions(qs || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = questions
    if (subjectFilter !== 'all') list = list.filter(q => q.subject_id === subjectFilter)
    if (query) {
      const ql = query.toLowerCase()
      list = list.filter(q => (q.question_text || '').toLowerCase().includes(ql))
    }
    return list
  }, [questions, subjectFilter, query])

  const validateForm = () => {
    const opts = (form.options || []).filter(Boolean)
    if (!form.subject_id) return 'Pilih mata pelajaran'
    if (!form.question_text.trim()) return 'Teks pertanyaan wajib diisi'
    if (opts.length < 2) return 'Minimal 2 opsi jawaban'
    if (!opts.includes(form.correct_answer)) return 'Jawaban benar harus salah satu dari opsi'
    if (!Number.isFinite(Number(form.points_value)) || Number(form.points_value) <= 0) return 'Poin harus angka > 0'
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    const msg = validateForm()
    if (msg) { setError(msg); return }
    setSaving(true)
    setError('')
    const payload = {
      subject_id: form.subject_id,
      question_text: form.question_text,
      options: form.options,
      correct_answer: form.correct_answer,
      explanation: form.explanation,
      points_value: Number(form.points_value),
    }
    if (form.id) {
      const { error: err } = await supabase.from('questions').update(payload).eq('id', form.id)
      if (err) setError('Gagal menyimpan perubahan')
    } else {
      const { error: err } = await supabase.from('questions').insert(payload)
      if (err) setError('Gagal membuat pertanyaan')
    }
    setSaving(false)
    setForm({ id: null, subject_id: '', question_text: '', options: ['', '', '', ''], correct_answer: '', explanation: '', points_value: 10 })
    load()
  }

  const editRow = (q) => setForm({
    id: q.id,
    subject_id: q.subject_id || '',
    question_text: q.question_text || '',
    options: Array.isArray(q.options) ? q.options.slice(0, 4).concat(Array(4).fill('')).slice(0, 4) : ['', '', '', ''],
    correct_answer: q.correct_answer || '',
    explanation: q.explanation || '',
    points_value: q.points_value ?? 10,
  })

  const remove = async (id) => {
    setError('')
    const { error: err } = await supabase.from('questions').delete().eq('id', id)
    if (err) setError('Gagal menghapus pertanyaan')
    load()
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-primary-orange" />
          <h1 className="text-3xl font-bold">Kelola Pertanyaan</h1>
        </div>
        <Link to="/admin" className="px-4 py-2 rounded-xl border-2 border-gray-200 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card md:col-span-1">
          <form onSubmit={submit} className="space-y-3">
            <div className="text-lg font-semibold mb-2">{form.id ? 'Edit' : 'Tambah'} Pertanyaan</div>

            <select
              className="input-field"
              value={form.subject_id}
              onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
              required
            >
              <option value="">Pilih Mata Pelajaran</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>

            <textarea
              className="input-field"
              placeholder="Teks pertanyaan"
              value={form.question_text}
              onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              {form.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="input-field"
                  placeholder={`Opsi ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const copy = [...form.options]
                    copy[idx] = e.target.value
                    setForm({ ...form, options: copy })
                  }}
                />
              ))}
            </div>

            <select
              className="input-field"
              value={form.correct_answer}
              onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
              required
            >
              <option value="">Jawaban Benar</option>
              {form.options.filter(Boolean).map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>

            <textarea
              className="input-field"
              placeholder="Penjelasan (opsional)"
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={3}
            />

            <input
              type="number"
              className="input-field"
              placeholder="Nilai poin (default 10)"
              value={form.points_value}
              onChange={(e) => setForm({ ...form, points_value: e.target.value })}
              min={1}
            />

            <button disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {form.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {form.id ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="card mb-4 grid md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 md:col-span-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input-field"
                placeholder="Cari teks pertanyaan"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select className="input-field" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
              <option value="all">Semua Mata Pelajaran</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>

          <div className="card overflow-x-auto">
            {loading ? (
              <div className="py-8 text-center">Memuat...</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Mata Pelajaran</th>
                    <th className="py-2 pr-4">Pertanyaan</th>
                    <th className="py-2 pr-4">Jawaban Benar</th>
                    <th className="py-2 pr-4">Poin</th>
                    <th className="py-2 pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => {
                    const subj = subjects.find(s => s.id === q.subject_id)
                    return (
                      <tr key={q.id} className="border-t border-gray-100">
                        <td className="py-3 pr-4">{subj ? `${subj.icon} ${subj.name}` : '-'}</td>
                        <td className="py-3 pr-4 font-medium">{q.question_text}</td>
                        <td className="py-3 pr-4">{q.correct_answer}</td>
                        <td className="py-3 pr-4">{q.points_value}</td>
                        <td className="py-3 pr-4 flex gap-2">
                          <button onClick={() => editRow(q)} className="px-3 py-2 rounded-xl border-2 border-gray-200 flex items-center gap-2">
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => remove(q.id)} className="px-3 py-2 rounded-xl border-2 border-red-200 text-red-600 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Hapus
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="py-6 text-center text-gray-500" colSpan={5}>Tidak ada data</td>
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
