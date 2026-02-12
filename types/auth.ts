export type UserRole = "customer" | "staff" | "admin" | "superadmin";

export type AuthUser = {
  userId: string;
  phone: string;
  role: UserRole;
  tenantId?: string;
  impersonatedBy?: string;
};

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

export type AuthResponse =
  | { success: true; user: AuthUser }
  | { success: false; error: string };
