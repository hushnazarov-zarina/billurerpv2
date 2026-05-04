import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

interface Props {
  title: string;
  module: string;
}

export default function StubPage({ title, module }: Props) {
  const { data } = useQuery({
    queryKey: [module, 'ping'],
    queryFn: () => api.get(`/api/${module}`).catch(() => null)
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-extrabold mb-1">{title}</h1>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-6">Modul: {module}</p>

      <div className="card border-l-4 border-amber-400">
        <div className="text-3xl mb-2">🚧</div>
        <h2 className="text-base font-bold text-slate-800">Bu modul keyingi bosqichda quriladi</h2>
        <p className="text-sm text-slate-600 mt-2">
          Skeleton tayyor — backend endpoint <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/api/{module}</code> mavjud
          va auth bilan himoyalangan. Real biznes-logika keyingi sprint'larda yoziladi.
        </p>
        {data && (
          <pre className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600 overflow-auto">
{JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>

      <div className="card mt-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Phase reja</h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>✓ <strong>Phase 0</strong> (hozir): Skeleton + auth + RBAC</li>
          <li>○ <strong>Phase 1</strong>: Clients + Orders to'liq biznes-logika</li>
          <li>○ <strong>Phase 2</strong>: Workers + QR token + scanning</li>
          <li>○ <strong>Phase 3</strong>: Production tracking + stage events</li>
          <li>○ <strong>Phase 4</strong>: Quality + Inventory + Surplus</li>
          <li>○ <strong>Phase 5</strong>: Print + Reports + Excel export</li>
          <li>○ <strong>Phase 6</strong>: Real-time dashboard + final polish</li>
        </ul>
      </div>
    </div>
  );
}
