import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

interface User {
  id: string;
  username: string;
  full_name: string;
  role_id: string;
  phone: string;
  email: string;
  is_active: boolean;
  last_login_at: string;
}

interface Role {
  id: string;
  name_uz: string;
}

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users')
  });

  const delMut = useMutation({
    mutationFn: (id: string) => api.del(`/api/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] })
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold">👥 Foydalanuvchilar</h1>
        {hasPermission('users.create') && (
          <button onClick={() => setShowAdd(true)} className="btn btn-primary">+ Yangi user</button>
        )}
      </div>

      <div className="card">
        {isLoading ? (
          <div className="text-slate-400">Yuklanmoqda...</div>
        ) : !data?.length ? (
          <div className="text-center text-slate-400 py-10">User yo'q</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                <th className="text-left py-2 px-2">Username</th>
                <th className="text-left py-2 px-2">F.I.O.</th>
                <th className="text-left py-2 px-2">Rol</th>
                <th className="text-left py-2 px-2">Telefon</th>
                <th className="text-center py-2 px-2">Status</th>
                <th className="text-right py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-2 font-mono text-xs font-semibold">{u.username}</td>
                  <td className="py-3 px-2">{u.full_name}</td>
                  <td className="py-3 px-2">
                    <span className="badge bg-slate-100 text-slate-700">{u.role_id}</span>
                  </td>
                  <td className="py-3 px-2 text-slate-600">{u.phone || '—'}</td>
                  <td className="py-3 px-2 text-center">
                    {u.is_active ? (
                      <span className="badge bg-green-100 text-green-800">Aktiv</span>
                    ) : (
                      <span className="badge bg-slate-100 text-slate-500">Faol emas</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {hasPermission('users.delete') && u.username !== 'admin' && (
                      <button
                        onClick={() => {
                          if (confirm(`"${u.username}" o'chirilsinmi?`)) delMut.mutate(u.id);
                        }}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >🗑</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onSaved={() => qc.invalidateQueries({ queryKey: ['users'] })} />}
    </div>
  );
}

function AddUserModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ username: '', password: '', full_name: '', role_id: 'cutting', phone: '', email: '' });
  const [error, setError] = useState('');

  const { data: roles } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/users/_meta/roles')
  });

  const mut = useMutation({
    mutationFn: (data: any) => api.post('/api/users', data),
    onSuccess: () => { onSaved(); onClose(); },
    onError: (e: any) => setError(e.message)
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Yangi foydalanuvchi</h2>
        {error && <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        <div className="space-y-3">
          <div>
            <label className="label">Username *</label>
            <input className="input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="ali.ishchi" />
          </div>
          <div>
            <label className="label">Parol * (kamida 6 belgi)</label>
            <input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label">F.I.O. *</label>
            <input className="input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Ali Valiyev" />
          </div>
          <div>
            <label className="label">Rol *</label>
            <select className="input" value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })}>
              {roles?.map(r => (
                <option key={r.id} value={r.id}>{r.name_uz} ({r.id})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Telefon</label>
              <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => mut.mutate(form)}
              disabled={!form.username || !form.password || !form.full_name || mut.isPending}
              className="btn btn-primary flex-1"
            >
              ✓ Saqlash
            </button>
            <button onClick={onClose} className="btn btn-ghost">Bekor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
