import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { Users, Shield, Search, Plus, Save, Edit2, X as XIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const { user, signUp } = useAuthStore()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editing, setEditing] = useState({}) // map: id -> { full_name, avatar_url, role }
  const [inviting, setInviting] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'teacher'
  })

  const fetchProfiles = async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      setError('Gagal memuat data pengguna')
    } else {
      setProfiles(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const byRole = roleFilter === 'all' ? true : p.role === roleFilter
      const byQuery = query
        ? (p.full_name || '').toLowerCase().includes(query.toLowerCase()) ||
          (p.email || '').toLowerCase().includes(query.toLowerCase())
        : true
      return byRole && byQuery
    })
  }, [profiles, roleFilter, query])

  const startEdit = (p) => {
    setEditing((prev) => ({
      ...prev,
      [p.id]: {
        full_name: p.full_name || '',
        avatar_url: p.avatar_url || '',
        role: p.role || 'student',
      },
    }))
  }

  const cancelEdit = (id) => {
    setEditing((prev) => {
      const n = { ...prev }
      delete n[id]
      return n
    })
  }

  const onEditField = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const saveEdit = async (id) => {
    const payload = editing[id]
    if (!payload) return
    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: payload.full_name,
        avatar_url: payload.avatar_url,
        role: payload.role,
      })
      .eq('id', id)
    if (!err) {
      setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)))
      cancelEdit(id)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviting(true)
    setError('')
    const res = await signUp(inviteForm.email, inviteForm.password, inviteForm.fullName, inviteForm.role)
    if (!res.success) {
      setError(res.error || 'Gagal mengundang guru')
    } else {
      setInviteForm({ email: '', password: '', fullName: '', role: 'teacher' })
      fetchProfiles()
    }
    setInviting(false)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary-orange" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-3">
          <a href="/admin/subjects" className="btn-primary">Kelola Mata Pelajaran</a>
          <a href="/admin/questions" className="btn-primary">Kelola Pertanyaan</a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500">Total Pengguna</div>
          <div className="text-2xl font-bold">{profiles.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Guru</div>
          <div className="text-2xl font-bold">{profiles.filter((p) => p.role === 'teacher').length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Siswa & Orang Tua</div>
          <div className="text-2xl font-bold">{profiles.filter((p) => p.role === 'student' || p.role === 'parent').length}</div>
        </div>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleInvite} className="grid md:grid-cols-5 gap-3">
          <input
            type="text"
            className="input-field md:col-span-2"
            placeholder="Nama Lengkap"
            value={inviteForm.fullName}
            onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="email@guru.com"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password sementara"
            value={inviteForm.password}
            onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
            required
            minLength={6}
          />
          <button disabled={inviting} className="btn-primary flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Undang Guru
          </button>
        </form>
      </div>

      <div className="card mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="input-field"
              placeholder="Cari nama atau email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input-field md:w-60" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Guru</option>
            <option value="student">Siswa</option>
            <option value="parent">Orang Tua</option>
          </select>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="py-10 text-center">Memuat...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Nama</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Avatar URL</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const e = editing[p.id]
                return (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="py-3 pr-4 font-medium">
                      {e ? (
                        <input
                          type="text"
                          className="input-field"
                          value={e.full_name}
                          onChange={(ev) => onEditField(p.id, 'full_name', ev.target.value)}
                        />
                      ) : (
                        p.full_name
                      )}
                    </td>
                    <td className="py-3 pr-4">{p.email}</td>
                    <td className="py-3 pr-4">
                      {e ? (
                        <input
                          type="text"
                          className="input-field"
                          placeholder="https://..."
                          value={e.avatar_url}
                          onChange={(ev) => onEditField(p.id, 'avatar_url', ev.target.value)}
                        />
                      ) : (
                        <span className="truncate max-w-[240px] inline-block align-middle">{p.avatar_url || '-'}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {e ? (
                        <select
                          value={e.role}
                          onChange={(ev) => onEditField(p.id, 'role', ev.target.value)}
                          className="input-field"
                        >
                          <option value="admin">Admin</option>
                          <option value="teacher">Guru</option>
                          <option value="student">Siswa</option>
                          <option value="parent">Orang Tua</option>
                        </select>
                      ) : (
                        p.role
                      )}
                    </td>
                    <td className="py-3 pr-4 flex gap-2">
                      {e ? (
                        <>
                          <button onClick={() => saveEdit(p.id)} className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" /> Simpan
                          </button>
                          <button onClick={() => cancelEdit(p.id)} className="px-3 py-2 rounded-xl border-2 border-gray-200 flex items-center gap-2">
                            <XIcon className="w-4 h-4" /> Batal
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(p)} className="px-3 py-2 rounded-xl border-2 border-gray-200 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
