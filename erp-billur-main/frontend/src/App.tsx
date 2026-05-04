import { useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './store/auth';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import StubPage from './pages/StubPage';

function ProtectedLayout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;

  const navItems = [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/clients', icon: '🏢', label: 'Klientlar', perm: 'clients.read' },
    { to: '/orders', icon: '📝', label: 'Zakazlar', perm: 'orders.read' },
    { to: '/production', icon: '🏭', label: 'Production', perm: 'production.read' },
    { to: '/quality', icon: '✅', label: 'Quality', perm: 'quality.read' },
    { to: '/inventory', icon: '📦', label: 'Ombor', perm: 'inventory.read' },
    { to: '/surplus', icon: '🎁', label: 'Izlishka', perm: 'surplus.read' },
    { to: '/workers', icon: '👷', label: 'Ishchilar', perm: 'workers.read' },
    { to: '/qr', icon: '📲', label: 'QR Scan', perm: 'qr.scan' },
    { to: '/boxes', icon: '📦', label: 'BoxApp', perm: 'box.read' },
    { to: '/shipments', icon: '🚛', label: 'Shipmentlar', perm: 'box.read' },
    { to: '/print', icon: '🖨️', label: 'Print', perm: 'print.read' },
    { to: '/reports', icon: '📊', label: 'Hisobotlar', perm: 'reports.read' },
    { to: '/users', icon: '👥', label: 'Foydalanuvchilar', perm: 'users.read' },
    { to: '/audit', icon: '📜', label: 'Audit', perm: 'audit.read' }
  ].filter(i => !i.perm || user.permissions.includes(i.perm));

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-slate-900 text-slate-200 flex flex-col">
        <div className="px-4 py-5 border-b border-slate-800">
          <div className="text-sm font-bold text-white">BILLUR ERP</div>
          <div className="text-xs text-slate-400 mt-0.5">Production System</div>
        </div>
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {navItems.map(it => (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-1 transition ${
                loc.pathname === it.to
                  ? 'bg-green-900/40 text-green-200'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <div className="text-xs text-slate-300 font-semibold">{user.full_name}</div>
          <div className="text-[10px] text-slate-500 uppercase">{user.role_id}</div>
          <button
            onClick={async () => { await logout(); nav('/login'); }}
            className="mt-2 w-full text-xs px-3 py-1.5 bg-slate-800 hover:bg-red-900/50 hover:text-red-300 rounded transition"
          >
            Chiqish
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/production" element={<StubPage title="Production tracking" module="production" />} />
          <Route path="/quality" element={<StubPage title="Quality Check" module="quality" />} />
          <Route path="/inventory" element={<StubPage title="Inventory" module="inventory" />} />
          <Route path="/surplus" element={<StubPage title="Izlishka" module="surplus" />} />
          <Route path="/workers" element={<StubPage title="Ishchilar" module="workers" />} />
          <Route path="/qr" element={<StubPage title="QR Scan" module="qr" />} />
          <Route path="/boxes" element={<StubPage title="BoxApp" module="boxes" />} />
          <Route path="/shipments" element={<StubPage title="Shipmentlar" module="shipments" />} />
          <Route path="/print" element={<StubPage title="Print" module="print" />} />
          <Route path="/reports" element={<StubPage title="Hisobotlar" module="reports" />} />
          <Route path="/audit" element={<StubPage title="Audit log" module="audit" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading, init } = useAuth();
  useEffect(() => { init(); }, [init]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
