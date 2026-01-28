"use client";


// STEP 1 — AUTH LOGIC & SAFETY LAYER
import { AuthState, AuthUser, UserRole } from "@/types/auth";

// =============================
// 2) Validation Helpers
// =============================
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

// =============================
// 3) Auth Context
// =============================
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
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

  // boot check
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) setUser(await res.json());
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadMe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const v = validateAuthForm(email, password);
      if (v) throw new Error(v);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      setUser(data.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err; // page decides UX
    } finally {
      setLoading(false); // ✅ GUARANTEED
    }
  };


  const signup = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);

    try {
      const v = validateAuthForm(email, password);
      if (v) throw new Error(v);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
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
      setLoading(false);   // ✅ ALWAYS runs
    }
  };

  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================
// 4) Route Guards
// =============================
import { useRouter } from "next/navigation";

export const useRequireAuth = (role?: UserRole) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (role && user.role !== role) router.replace("/unauthorized");
  }, [user, loading, role]);

  return { user, loading };
};


