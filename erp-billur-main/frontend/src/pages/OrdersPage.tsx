import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

interface Order {
  id: string;
  order_type: string;
  external_code: string;
  client_name: string;
  client_code: string;
  status: string;
  deadline: string;
  total_pieces: number;
  items_count: number;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-200 text-slate-700',
  active: 'bg-green-100 text-green-800',
  problem: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-slate-100 text-slate-500',
  paused: 'bg-amber-100 text-amber-800'
};

export default function OrdersPage() {
  const { data, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => api.get('/api/orders')
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold">📝 Zakazlar</h1>
        <button className="btn btn-primary" disabled>+ Yangi (TODO)</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="text-slate-400">Yuklanmoqda...</div>
        ) : !data?.length ? (
          <div className="text-center text-slate-400 py-10">Zakaz yo'q</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                <th className="text-left py-2 px-2">Tur</th>
                <th className="text-left py-2 px-2">Kod</th>
                <th className="text-left py-2 px-2">Klient</th>
                <th className="text-center py-2 px-2">Status</th>
                <th className="text-center py-2 px-2">Mahsulot</th>
                <th className="text-left py-2 px-2">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {data.map(o => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-2">
                    <span className="badge bg-slate-100 text-slate-700 uppercase">{o.order_type}</span>
                  </td>
                  <td className="py-3 px-2 font-mono text-xs font-semibold">{o.external_code || '—'}</td>
                  <td className="py-3 px-2">{o.client_name || '—'}</td>
                  <td className="py-3 px-2 text-center">
                    <span className={`badge ${STATUS_COLORS[o.status] || 'bg-slate-100'}`}>{o.status}</span>
                  </td>
                  <td className="py-3 px-2 text-center">{o.total_pieces} ({o.items_count} item)</td>
                  <td className="py-3 px-2 text-slate-600 text-xs">{o.deadline || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
