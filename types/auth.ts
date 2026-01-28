export type UserRole = "customer" | "vendor";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
}

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export type LoginRequest = {
    email: string;
    password: string;
};

export type SignupRequest = {
    email: string;
    password: string;
    role: UserRole;
    shopName?: string;
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

