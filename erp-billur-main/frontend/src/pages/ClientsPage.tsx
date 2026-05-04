import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

interface Client {
  id: string;
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  active_orders: number;
  completed_orders: number;
  is_active: boolean;
  balance_uzs: number;
}

export default function ClientsPage() {
  const { hasPermission } = useAuth();
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data, isLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => api.get('/api/clients')
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold">🏢 Klientlar (Firmalar)</h1>
        {hasPermission('clients.create') && (
          <button onClick={() => setShowAdd(true)} className="btn btn-primary">+ Yangi klient</button>
        )}
      </div>

      <div className="card">
        {isLoading ? (
          <div className="text-slate-400">Yuklanmoqda...</div>
        ) : !data?.length ? (
          <div className="text-center text-slate-400 py-10">Klient yo'q</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                <th className="text-left py-2 px-2">Kod</th>
                <th className="text-left py-2 px-2">Nom</th>
                <th className="text-left py-2 px-2">Kontakt</th>
                <th className="text-center py-2 px-2">Aktiv zakaz</th>
                <th className="text-center py-2 px-2">Tugagan</th>
                <th className="text-right py-2 px-2">Balans</th>
              </tr>
            </thead>
            <tbody>
              {data.map(c => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-2 font-mono text-xs">{c.code}</td>
                  <td className="py-3 px-2 font-semibold">{c.name}</td>
                  <td className="py-3 px-2 text-slate-600">
                    {c.contact_person && <div>{c.contact_person}</div>}
                    {c.phone && <div className="text-xs text-slate-400">{c.phone}</div>}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {c.active_orders > 0 ? (
                      <span className="badge bg-green-100 text-green-800">{c.active_orders}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-600">{c.completed_orders}</td>
                  <td className="py-3 px-2 text-right font-mono text-xs">
                    {Number(c.balance_uzs).toLocaleString('en')} UZS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onSaved={() => qc.invalidateQueries({ queryKey: ['clients'] })} />}
    </div>
  );
}

function AddClientModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ code: '', name: '', contact_person: '', phone: '', email: '', address: '' });
  const [error, setError] = useState('');

  const mut = useMutation({
    mutationFn: (data: any) => api.post('/api/clients', data),
    onSuccess: () => { onSaved(); onClose(); },
    onError: (e: any) => setError(e.message)
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Yangi klient</h2>
        {error && <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        <div className="space-y-3">
          <div>
            <label className="label">Kod *</label>
            <input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="LARETTO" />
          </div>
          <div>
            <label className="label">Firma nomi *</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Kontakt shaxs</label>
            <input className="input" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })} />
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
          <div>
            <label className="label">Manzil</label>
            <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => mut.mutate(form)} disabled={!form.code || !form.name || mut.isPending} className="btn btn-primary flex-1">
              ✓ Saqlash
            </button>
            <button onClick={onClose} className="btn btn-ghost">Bekor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
