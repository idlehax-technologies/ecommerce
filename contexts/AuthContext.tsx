// context/AuthContext.tsx

"use client";

import { AuthState, AuthUser, UserRole } from "@/types/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* =============================
   Validation
============================= */

export const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordValid = (pw: string) => pw.length >= 6;

export const validateAuthForm = (
  email: string,
  password: string
): string | null => {
  if (!email || !password) return "All fields are required";
  if (!isEmailValid(email)) return "Invalid email format";
  if (!isPasswordValid(password)) return "Password must be 6+ chars";
  return null;
};


/* =============================
   Context
============================= */

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>; // ❗ role removed
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth outside provider");
  return context;
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* boot check */

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);


  /* login */

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const v = validateAuthForm(email, password);
      if (v) throw new Error(v);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      setUser(data.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  /* signup — no role */

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const v = validateAuthForm(email, password);
      if (v) throw new Error(v);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ❗ role removed
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Signup failed");
      }

      setUser(data.user);
    } catch (err: any) {
      setError(err.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  /* logout */

  const logout = async () => {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


/* =============================
   Guards
============================= */

export const useRequireAuth = (role?: UserRole | UserRole[]) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role) {
      const allowed = Array.isArray(role) ? role : [role];

      if (!allowed.includes(user.role)) {
        router.replace("/unauthorized");
      }
    }
  }, [user, loading, role]);

  return { user, loading };
};
