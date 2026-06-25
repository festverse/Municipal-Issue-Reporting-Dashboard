import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile, updateProfileAPI } from '../api/client';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getProfile()
      .then((data) => setUser(data.user ?? data))
      .catch(() => { localStorage.removeItem('token'); setToken(null); })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (body) => {
    const data = await registerUser(body);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (body) => {
    const data = await updateProfileAPI(body);
    if (data && data.user) {
      setUser(prev => ({ ...prev, ...data.user }));
    }
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
