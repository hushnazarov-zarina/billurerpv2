import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      nav('/');
    } catch (err: any) {
      setError(err.message || 'Xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-green-950 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-lg font-extrabold text-slate-900">BILLUR ERP</h1>
          <p className="text-xs text-slate-500 mt-1 tracking-wider">PRODUCTION MANAGEMENT</p>
        </div>
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Tizimga kirish</h2>
        {error && (
          <div className="mb-3 p-3 bg-red-50 text-red-700 text-sm rounded border-l-2 border-red-500">
            {error}
          </div>
        )}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="label">Login</label>
            <input
              autoFocus
              className="input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="label">Parol</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Tekshirilmoqda...' : 'Kirish →'}
          </button>
        </form>
      </div>
    </div>
  );
}
