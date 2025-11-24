"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  loginUser,
  getProfile,
  LoginResponse,
  AuthUser,
} from "@/lib/api/users";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const stored = localStorage.getItem("authToken");
    console.log("Auth init - token found:", !!stored);
    if (stored) {
      setToken(stored);
      console.log("Fetching profile...");
      getProfile()
        .then((profile) => {
          console.log("Profile loaded:", profile);
          setUser(profile);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          console.error("Error response:", err.response?.data);
          console.error("Error status:", err.response?.status);
          // If token is invalid, clear it
          if (err.response?.status === 401) {
            console.log("Token invalid, clearing...");
            localStorage.removeItem("authToken");
            setToken(null);
          }
        })
        .finally(() => {
          console.log("Profile fetch complete");
          setLoading(false);
        });
    } else {
      console.log("No token found");
      setLoading(false);
    }
  }, [mounted]);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const data: LoginResponse = await loginUser({ email, password });
      localStorage.setItem("authToken", data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  }

  async function refreshProfile() {
    if (!token) return;
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      console.error("Failed to refresh profile:", err);
      // If unauthorized, clear token
      if ((err as any).response?.status === 401) {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      }
    }
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    logout,
    refreshProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
