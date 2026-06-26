import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile, updateProfileAPI, loginWithGoogleAPI } from '../api/client';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('civic_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getProfile()
      .then((data) => {
        const u = data.user ?? data;
        setUser(u);
        localStorage.setItem('civic_current_user', JSON.stringify(u));
      })
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('civic_current_user'); setToken(null); })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('civic_current_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const loginWithGoogle = useCallback(async (body) => {
    const data = await loginWithGoogleAPI(body);
    localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('civic_current_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (body) => {
    const data = await registerUser(body);
    localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('civic_current_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('civic_current_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (body) => {
    const data = await updateProfileAPI(body);
    if (data && data.user) {
      setUser(prev => {
        const updated = { ...prev, ...data.user };
        localStorage.setItem('civic_current_user', JSON.stringify(updated));
        return updated;
      });
    }
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, register, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
