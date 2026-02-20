"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthState, AuthUser } from "@/types/auth";
import * as api from "@/lib/api/auth";

interface Ctx extends AuthState {
  requestOtp: (p: string) => Promise<void>;
  verifyOtp: (p: string, c: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Ctx | null>(null);

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("Auth outside provider");
  return c;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      setLoading(true);
      try {
        const d = await api.me();
        setUser(d.user);
      } catch {
        // Not an error condition for UI — just means no session.
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrate();
  }, []);

  const requestOtp = async (p: string) => {
    await api.requestOtp(p);
  };

  const verifyOtp = async (p: string, c: string) => {
    setLoading(true);
    try {
      const d = await api.verifyOtp(p, c);
      setUser(d.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, requestOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
