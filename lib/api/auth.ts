import { apiFetch } from "./fetch";
import type { AuthUser } from "@/types/auth";

export const requestOtp = (phone: string) =>
    apiFetch<{ success: true }>("/api/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
    });

export const verifyOtp = (phone: string, code: string) =>
    apiFetch<{ user: AuthUser }>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
    });

export const logout = () =>
    apiFetch<{ success: true }>("/api/auth/logout", {
        method: "POST",
    });

export const me = () =>
    apiFetch<{ user: AuthUser }>("/api/auth/me");

export const stopAssume = () =>
    apiFetch<{ success: true }>("/api/auth/stop-assume", {
        method: "POST",
    });