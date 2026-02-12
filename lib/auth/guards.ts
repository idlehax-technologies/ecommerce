import type { AuthUser } from "@/types/auth";

export function isAuthenticated(user: AuthUser | null): user is AuthUser {
    return !!user;
}

export function requireAuth(user: AuthUser | null): AuthUser {
    if (!user) throw new Error("Unauthorized");
    return user;
}
