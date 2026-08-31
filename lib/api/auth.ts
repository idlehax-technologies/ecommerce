import { apiFetch } from "./fetch";

import type { AuthUser } from "@/types/auth";

export async function requestOtp(
    phone: string
): Promise<{ success: true }> {
    return apiFetch<{ success: true }>("/api/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
    });
}

export async function verifyOtp(
    phone: string,
    code: string
): Promise<{ user: AuthUser }> {
    return apiFetch<{ user: AuthUser }>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
    });
}

export async function logout(): Promise<{ success: true }> {
    return apiFetch<{ success: true }>("/api/auth/logout", {
        method: "POST",
    });
}

export async function me(): Promise<{ user: AuthUser }> {
    return apiFetch<{ user: AuthUser }>("/api/auth/me");
}

export async function stopAssume(): Promise<{ success: true }> {
    return apiFetch<{ success: true }>("/api/auth/stop-assume", {
        method: "POST",
    });
}