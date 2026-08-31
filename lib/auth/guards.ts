import type { AuthUser, MembershipActor } from "@/types/auth";
import type { MembershipRole } from "@/types/membership";
import { UnauthorizedError, ForbiddenError, NotInAssumedSessionError } from "./errors";
import { getMembership } from "@/lib/memberships/domain";

export function requireAuth(user: AuthUser | null): AuthUser {
    if (!user) throw new UnauthorizedError();
    return user;
}

export async function requireMembership(
    user: AuthUser | null
): Promise<MembershipActor> {
    const u = requireAuth(user);

    if (!u.activeMembershipId) {
        throw new ForbiddenError("No active membership");
    }

    const membership = await getMembership(u.activeMembershipId);

    if (membership.status !== "APPROVED") {
        throw new ForbiddenError("Membership not approved");
    }

    return {
        userId: u.userId,
        tenantId: membership.tenantId,
        role: membership.role,
    };
}

export async function requireMembershipRole(
    user: AuthUser | null,
    roles: MembershipRole[]
): Promise<MembershipActor> {
    const actor = await requireMembership(user);

    if (!roles.includes(actor.role)) {
        throw new ForbiddenError();
    }

    return actor;
}

export function requireSuperadmin(user: AuthUser | null): AuthUser {
    const u = requireAuth(user);

    if (!u.isSuperadmin) {
        throw new ForbiddenError("Superadmin only");
    }

    return u;
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