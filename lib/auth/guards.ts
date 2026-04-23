import type { AccessActor, AuthUser } from "@/types/auth";
import { UnauthorizedError, ForbiddenError, NotInAssumedSessionError } from "./errors";
import { getMembership } from "@/lib/memberships/domain";
import { MembershipRole } from "@/types/membership";

export function requireAuth(user: AuthUser | null): AuthUser {
    if (!user) throw new UnauthorizedError();
    return user;
}

export function requireMembership(user: AuthUser | null) {
    const u = requireAuth(user);

    if (!u.activeMembershipId) {
        throw new ForbiddenError("No active membership");
    }

    const membership = getMembership(u.activeMembershipId);

    if (membership.status !== "APPROVED") {
        throw new ForbiddenError("Membership not approved");
    }

    return {
        userId: u.userId,
        tenantId: membership.tenantId,
        role: membership.role,
    };
}

export function requireMembershipRole(
    user: AuthUser | null,
    roles: MembershipRole[]
) {
    const actor = requireMembership(user);

    if (!roles.includes(actor.role)) {
        throw new ForbiddenError();
    }

    return actor;
}

export function requireTenant(user: AuthUser | null) {
    return requireMembership(user);
}

export function requireSuperadmin(user: AuthUser | null): AuthUser {
    const u = requireAuth(user);

    if (!u.isSuperadmin) {
        throw new ForbiddenError("Superadmin only");
    }

    return u;
}

export function requireAccess(
    user: AuthUser | null,
    roles: MembershipRole[]
): AccessActor {
    const u = requireAuth(user);

    if (u.isSuperadmin) {
        return { type: "superadmin", userId: u.userId };
    }

    const membership = requireMembership(u);

    if (!roles.includes(membership.role)) {
        throw new ForbiddenError("Insufficient role");
    }

    return {
        type: "tenant",
        membership,
    };
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
