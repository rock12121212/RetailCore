import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as loginApi, logout as logoutApi, refresh as refreshApi } from '../api/auth.js';
import { clearAuthTokens, setAuthTokens } from '../api/tokenStore.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const applyAuthData = useCallback((data) => {
    setUser(data?.user || null);
    setAccessToken(data?.accessToken || null);
    setCsrfToken(data?.csrfToken || null);
    setAuthTokens(data || {});
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser || null);
  }, []);

  const login = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await loginApi(payload);
      applyAuthData(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [applyAuthData]);

  const refresh = useCallback(async () => {
    try {
      const data = await refreshApi();
      applyAuthData(data);
      return data;
    } catch (error) {
      clearAuthTokens();
      setUser(null);
      setAccessToken(null);
      setCsrfToken(null);
      return null;
    }
  }, [applyAuthData]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutApi();
    } finally {
      clearAuthTokens();
      setUser(null);
      setAccessToken(null);
      setCsrfToken(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refresh();
      setIsInitializing(false);
    };

    init();
  }, [refresh]);

  const value = useMemo(() => ({
    user,
    accessToken,
    csrfToken,
    isAuthenticated: Boolean(user),
    loading,
    isInitializing,
    login,
    logout,
    refresh,
    updateUser,
  }), [user, accessToken, csrfToken, loading, isInitializing, login, logout, refresh, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
