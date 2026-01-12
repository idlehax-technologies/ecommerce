import type { User } from "@/types/user";
import type { LoginRequest, SignupRequest } from "@/types/auth";
import { createContext } from "react";

export type AuthState = {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: SignupRequest) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);
