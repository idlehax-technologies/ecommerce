import type { AuthUser, UserRole } from "@/types/auth";
import { ForbiddenError, NotInAssumedSessionError, TenantNotAssociatedError, UnauthorizedError } from "./errors";

/**
 * Type predicate.
 * Used when you want to CHECK auth without throwing.
 */
export function isAuthenticated(user: AuthUser | null): user is AuthUser {
    return user !== null;
}

/**
 * Hard requirement: user must exist.
 * Throws if not authenticated.
 */
export function requireAuth(user: AuthUser | null): AuthUser {
    if (!user) {
        throw new UnauthorizedError();
    }
    return user;
}

/**
 * Require a single specific role.
 */
export function requireRole(
    user: AuthUser | null,
    role: UserRole
): AuthUser {
    const u = requireAuth(user);

    if (u.role !== role) {
        throw new ForbiddenError();
    }

    return u;
}

/**
 * Require any one of multiple roles.
 */
export function requireAnyRole(
    user: AuthUser | null,
    roles: UserRole[]
): AuthUser {
    const u = requireAuth(user);

    if (!roles.includes(u.role)) {
        throw new ForbiddenError();
    }

    return u;
}

export function requireTenant(
    user: AuthUser | null
): AuthUser & { tenantId: string } {
    const u = requireAuth(user);

    if (!u.tenantId) {
        throw new TenantNotAssociatedError();
    }

    return u as AuthUser & { tenantId: string };
}

export function requireAssumedSession(
    user: AuthUser | null
): AuthUser & { impersonatedBy: string } {
    const u = requireAuth(user);

    if (!u.impersonatedBy) {
        throw new NotInAssumedSessionError();
    }

    return u as AuthUser & { impersonatedBy: string };
}
