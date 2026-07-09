import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ozbek_admin_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((res) => {
        if (['admin', 'staff'].includes(res.data.user.role)) setUser(res.data.user);
        else localStorage.removeItem('ozbek_admin_token');
      })
      .catch(() => localStorage.removeItem('ozbek_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    if (!['admin', 'staff'].includes(data.user.role)) {
      throw new Error('This account does not have admin access');
    }
    localStorage.setItem('ozbek_admin_token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('ozbek_admin_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
