import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../store/auth';

interface Overview {
  orders: { active: number; problem: number; completed: number; total: number };
  clients: number;
  workers: number;
  open_discrepancies: number;
  today_events: { stage: string; qty: number }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery<Overview>({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => api.get('/api/dashboard/overview')
  });

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-2xl p-6 mb-5 shadow-lg">
        <h1 className="text-xl font-extrabold">Salom, {user?.full_name}!</h1>
        <p className="text-green-200 text-sm mt-1">AND BILLUR TEXTILE — Production ERP</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <Stat icon="📝" label="Aktiv zakazlar" value={data?.orders.active ?? 0} color="green" />
          <Stat icon="⚠️" label="Muammolar" value={data?.orders.problem ?? 0} color="amber" />
          <Stat icon="✅" label="Tugagan" value={data?.orders.completed ?? 0} color="blue" />
          <Stat icon="🏢" label="Klientlar" value={data?.clients ?? 0} color="indigo" />
          <Stat icon="👷" label="Ishchilar" value={data?.workers ?? 0} color="teal" />
          <Stat icon="🚨" label="Discrepancies" value={data?.open_discrepancies ?? 0} color="red" />
        </div>
      )}

      <div className="card">
        <h2 className="text-xs font-bold text-slate-500 uppercase mb-3">Bugungi production</h2>
        {(data?.today_events?.length ?? 0) === 0 ? (
          <p className="text-slate-400 text-sm">Bugun hali events yo'q</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase">
                <th className="text-left py-2">Bosqich</th>
                <th className="text-right py-2">Soni</th>
              </tr>
            </thead>
            <tbody>
              {data?.today_events.map(e => (
                <tr key={e.stage} className="border-t border-slate-100">
                  <td className="py-2 font-medium">{e.stage}</td>
                  <td className="py-2 text-right font-bold">{e.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }: any) {
  const colorMap: any = {
    green: 'border-green-500',
    amber: 'border-amber-500',
    blue: 'border-blue-500',
    indigo: 'border-indigo-500',
    teal: 'border-teal-500',
    red: 'border-red-500'
  };
  return (
    <div className={`card border-l-4 ${colorMap[color]}`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      <div className="text-xs text-slate-500 uppercase font-semibold mt-0.5">{label}</div>
    </div>
  );
}
