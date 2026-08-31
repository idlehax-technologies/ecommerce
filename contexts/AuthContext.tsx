"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthState, AuthUser } from "@/types/auth";
import * as authApi from "@/lib/api/auth";

type AuthContextValue = AuthState & {
  requestOtp: (p: string) => Promise<void>;
  verifyOtp: (p: string, c: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      setLoading(true);
      try {
        const d = await authApi.me();
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

  const requestOtp = async (phone: string) => {
    await authApi.requestOtp(phone);
  };

  const verifyOtp = async (phone: string, code: string) => {
    const res = await authApi.verifyOtp(phone, code);
    setUser(res.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}