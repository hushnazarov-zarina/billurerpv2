const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function request<T = any>(method: string, path: string, body?: any): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['x-session-token'] = token;

  const r = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data: any = {};
  try { data = await r.json(); } catch {}

  if (!r.ok) {
    if (r.status === 401) {
      localStorage.removeItem('token');
      window.location.hash = '#/login';
    }
    throw new ApiError(r.status, data.error || 'Server xatosi');
  }
  return data;
}

export const api = {
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: any) => request<T>('POST', path, body),
  put: <T = any>(path: string, body?: any) => request<T>('PUT', path, body),
  del: <T = any>(path: string) => request<T>('DELETE', path)
};
