// types/auth.ts

export type UserRole = "customer" | "staff" | "admin" | "superadmin";

export type AuthUser = {
  userId: string;
  email: string;
  role: UserRole;

  // tenant boundary (school membership)
  tenantId?: string;

  // superadmin userId
  impersonatedBy?: string;
};

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  // no role
  // no tenant
  // server assigns later
};

export type AuthResponse =
  | {
    success: true;
    user: AuthUser;
  }
  | {
    success: false;
    error: string;
  };
