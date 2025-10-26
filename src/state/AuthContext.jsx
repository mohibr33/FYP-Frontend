import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ---- Load from localStorage safely ----
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("hp:user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("hp:token"));

  // ---- Keep user/token synced with localStorage ----
  useEffect(() => {
    try {
      if (user) localStorage.setItem("hp:user", JSON.stringify(user));
      else localStorage.removeItem("hp:user");
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("hp:token", token);
      else localStorage.removeItem("hp:token");
    } catch (err) {
      console.error("Error saving token:", err);
    }
  }, [token]);

  // ✅ Instantly sync after login/logout or across tabs
  useEffect(() => {
    const syncAuth = () => {
      try {
        const storedUser = localStorage.getItem("hp:user");
        const storedToken = localStorage.getItem("hp:token");

        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken || null);
      } catch (err) {
        console.error("Auth sync error:", err);
      }
    };

    // Run immediately + when storage updates
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // ---- Attach token to axios requests ----
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  // ---- Logout ----
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hp:user");
    localStorage.removeItem("hp:token");

    // ✅ Broadcast change instantly to update all components
    window.dispatchEvent(new Event("storage"));
  };

  // ---- Context Value ----
  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Custom hook for convenience
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
