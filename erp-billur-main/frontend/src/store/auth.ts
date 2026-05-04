import { create } from 'zustand';
import { api } from '../api/client';

export interface User {
  id: string;
  username: string;
  full_name: string;
  role_id: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  init: async () => {
    try {
      const r = await api.get<{ user: User | null }>('/api/auth/me');
      set({ user: r.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (username, password) => {
    const r = await api.post<{ token: string; user: User }>('/api/auth/login', { username, password });
    localStorage.setItem('token', r.token);
    // me'ni qayta yuklab permissions ni olish
    const me = await api.get<{ user: User }>('/api/auth/me');
    set({ user: me.user });
  },

  logout: async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    localStorage.removeItem('token');
    set({ user: null });
  },

  hasPermission: (perm) => {
    const u = get().user;
    return !!u && u.permissions.includes(perm);
  }
}));
