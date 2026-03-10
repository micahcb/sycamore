"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setAuthToken } from "@/lib/auth-token";

const STORAGE_KEY_TOKEN = "sycamore_auth_token";
const STORAGE_KEY_USER = "sycamore_auth_user";

export type BackendUser = { id: string; phone: string };

type AuthState = {
  user: BackendUser | null;
  token: string | null;
  loading: boolean;
  getToken: () => string | null;
  setSession: (token: string, user: BackendUser) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function loadStoredSession(): { token: string; user: BackendUser } | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const userRaw = localStorage.getItem(STORAGE_KEY_USER);
    if (!token || !userRaw) return null;
    const user = JSON.parse(userRaw) as BackendUser;
    if (!user?.id || !user?.phone) return null;
    return { token, user };
  } catch {
    return null;
  }
}

export function BackendAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored) {
      setTokenState(stored.token);
      setUser(stored.user);
      setAuthToken(stored.token);
    }
    setLoading(false);
  }, []);

  const setSession = useCallback((newToken: string, newUser: BackendUser) => {
    setTokenState(newToken);
    setUser(newUser);
    setAuthToken(newToken);
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
  }, []);

  const signOut = useCallback(() => {
    setTokenState(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  }, []);

  const getToken = useCallback(() => token, [token]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      loading,
      getToken,
      setSession,
      signOut,
    }),
    [user, token, loading, getToken, setSession, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within BackendAuthProvider");
  }
  return ctx;
}
