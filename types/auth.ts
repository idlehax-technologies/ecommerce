import type { User } from "./user";

export type Session = {
    token: string;
    user: User;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type SignupRequest = {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "VENDOR";
    shopName?: string;
};

export type AuthResponse = {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
};
