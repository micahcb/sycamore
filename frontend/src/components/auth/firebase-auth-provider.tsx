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
import {
  type User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  getIdToken,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  getToken: (forceRefresh?: boolean) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          const token = await nextUser.getIdToken();
          setIdToken(token);
        } catch {
          setIdToken(null);
        }
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getToken = useCallback(async (forceRefresh = false) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    try {
      const token = await getIdToken(currentUser, forceRefresh);
      setIdToken(token);
      return token;
    } catch {
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIdToken(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      idToken,
      getToken,
      signOut,
    }),
    [user, loading, idToken, getToken, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within FirebaseAuthProvider");
  }
  return ctx;
}
