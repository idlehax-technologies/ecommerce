import { membershipStore } from "./storage";
import { toNewMembership } from "./mappers";
import type { Membership, MembershipView } from "@/types/membership";
import type { DomainEvent } from "@/types/domainEvent";

import {
    assertDoesNotExist,
    assertExists,
    assertStatus,
    assertVisible,
    requireOwnership,
} from "./guards";

import { authStore } from "../auth/storage";
import { profileStore } from "../profiles/storage";
import { tenantStore } from "../tenants/storage";

import { MembershipActor } from "@/types/auth";
import { assertCompleteProfile } from "../profiles/guards";
import { ProfileRequiredError } from "../profiles/errors";
import { AuthUserNotFoundError, ForbiddenError } from "../auth/errors";
import { MembershipInvalidStateError, MembershipNotFoundError } from "./errors";

const MEMBERSHIP_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/* ---------------- EXPIRY ---------------- */

export async function expireMembership(
    membershipId: string
): Promise<{ membership: Membership; event: DomainEvent } | null> {
    const m = await membershipStore.get(membershipId);

    if (!m || m.status !== "PENDING") return null;

    const now = Date.now();
    const created = new Date(m.createdAt).getTime();

    if (now - created < MEMBERSHIP_EXPIRY_MS) return null;

    const from = m.status;

    m.status = "EXPIRED";
    m.updatedAt = new Date().toISOString();
    await membershipStore.save(m);

    return {
        membership: m,
        event: {
            type: "MembershipExpired",
            membership: m,
            from,
            to: "EXPIRED"
        }
    };
}

export async function findExpiredMemberships(): Promise<string[]> {
    const now = Date.now();

    const memberships = await membershipStore.getAll();

    return memberships
        .filter((m) => {
            if (m.status !== "PENDING") return false;

            const created = new Date(m.createdAt).getTime();

            return now - created >= MEMBERSHIP_EXPIRY_MS;
        })
        .map((m) => m.membershipId);
}

/* ---------------- CORE (MUTATIONS) ---------------- */

export async function requestMembership(
    userId: string,
    tenantId: string
): Promise<{ membership: Membership; event: DomainEvent }> {
    const profile = await profileStore.get(userId);

    if (!profile) {
        throw new ProfileRequiredError();
    }

    assertCompleteProfile(profile);

    const memberships = await membershipStore.listByUser(userId);

    const existing = memberships.find(
        (m) =>
            m.tenantId === tenantId &&
            (m.status === "PENDING" || m.status === "APPROVED")
    );

    assertDoesNotExist(existing);

    const m = toNewMembership(userId, tenantId);
    await membershipStore.save(m);

    return {
        membership: m,
        event: {
            type: "MembershipRequested",
            membership: m
        }
    };
}

export async function approveMembership(
    actor: MembershipActor,
    membershipId: string
): Promise<{ membership: Membership; event: DomainEvent }> {
    const m = await membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "PENDING");

    const user = await authStore.getById(m.userId);

    if (!user) {
        throw new AuthUserNotFoundError();
    }

    const from = m.status;

    m.status = "APPROVED";
    m.updatedAt = new Date().toISOString();
    await membershipStore.save(m);

    if (!user.activeMembershipId) {
        await authStore.save({
            ...user,
            activeMembershipId: m.membershipId,
        });
    }

    return {
        membership: m,
        event: {
            type: "MembershipApproved",
            membership: m,
            from,
            to: "APPROVED"
        }
    };
}

export async function rejectMembership(
    actor: MembershipActor,
    membershipId: string
): Promise<{ membership: Membership; event: DomainEvent }> {
    const m = await membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "PENDING");

    const from = m.status;

    m.status = "REJECTED";
    m.updatedAt = new Date().toISOString();
    await membershipStore.save(m);

    return {
        membership: m,
        event: {
            type: "MembershipRejected",
            membership: m,
            from,
            to: "REJECTED"
        }
    };
}

export async function revokeMembership(
    actor: MembershipActor,
    membershipId: string
): Promise<{ membership: Membership; event: DomainEvent }> {
    const m = await membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "APPROVED");

    const user = await authStore.getById(m.userId);

    if (!user) {
        throw new AuthUserNotFoundError();
    }

    const from = m.status;

    if (user.activeMembershipId === m.membershipId) {
        await authStore.save({
            ...user,
            activeMembershipId: undefined,
        });
    }

    m.status = "REVOKED";
    m.updatedAt = new Date().toISOString();
    await membershipStore.save(m);

    return {
        membership: m,
        event: {
            type: "MembershipRevoked",
            membership: m,
            from,
            to: "REVOKED"
        }
    };
}

export async function updateMembershipRole(
    actorUserId: string,
    membershipId: string,
    newRole: Membership["role"]
): Promise<{ membership: Membership; event: DomainEvent }> {
    const m = await membershipStore.get(membershipId);
    assertExists(m);

    if (m.userId === actorUserId) {
        throw new ForbiddenError("Cannot modify your own role");
    }

    assertStatus(m, "APPROVED");

    if (m.role === newRole) {
        throw new MembershipInvalidStateError(
            "Cannot update membership role to the same value"
        );
    }

    const from = m.role;

    m.role = newRole;
    m.updatedAt = new Date().toISOString();
    await membershipStore.save(m);

    return {
        membership: m,
        event: {
            type: "MembershipRoleUpdated",
            membership: m,
            from,
            to: newRole
        }
    };
}

/* ---------------- READ METHODS (UNCHANGED) ---------------- */

export async function getActiveMembership(
    userId: string,
    membershipId: string
): Promise<Membership> {
    const m = await membershipStore.get(membershipId);
    assertExists(m);
    requireOwnership(m, userId);
    assertStatus(m, "APPROVED");

    return m;
}

export async function listPendingMemberships(
    tenantId: string
): Promise<Membership[]> {
    const memberships = await membershipStore.listByTenant(tenantId);

    return memberships
        .filter((m) => m.status === "PENDING");
}

export async function getMembership(
    membershipId: string
): Promise<Membership> {
    const m = await membershipStore.get(membershipId);
    assertExists(m);
    return m;
}

export async function selectMembership(
    userId: string,
    membershipId: string
): Promise<void> {
    const m = await membershipStore.get(membershipId);

    assertExists(m);
    requireOwnership(m, userId);
    assertStatus(m, "APPROVED");

    const user = await authStore.getById(userId);

    if (!user) {
        throw new AuthUserNotFoundError();
    }

    await authStore.save({
        ...user,
        activeMembershipId: membershipId,
    });
}

export async function getAdminMembershipForTenant(
    tenantId: string
): Promise<Membership> {
    const memberships = await membershipStore.listByTenant(tenantId);

    const m = memberships.find(
        (m) =>
            m.role === "admin" &&
            m.status === "APPROVED"
    );

    if (!m) {
        throw new MembershipNotFoundError(
            "No admin membership found for tenant"
        );
    }

    return m;
}

export async function getStaffMembershipForTenant(
    tenantId: string
): Promise<Membership> {
    const memberships = await membershipStore.listByTenant(tenantId);

    const m = memberships.find(
        (m) =>
            m.role === "staff" &&
            m.status === "APPROVED"
    );

    if (!m) {
        throw new MembershipNotFoundError(
            "No staff membership found for tenant"
        );
    }

    return m;
}

/* ---------------- VIEW MAPPERS ---------------- */

async function toMembershipView(
    m: Membership
): Promise<MembershipView> {
    const user = await authStore.getById(m.userId);
    const profile = await profileStore.get(m.userId);
    const tenant = await tenantStore.get(m.tenantId);

    return {
        membershipId: m.membershipId,
        status: m.status,
        role: m.role,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        tenant: {
            tenantId: tenant?.tenantId ?? "",
            name: tenant?.name ?? "",
        },
        user: {
            userId: m.userId,
            fullName: profile?.fullName ?? "",
            phone: user?.phone ?? "",
            email: profile?.email ?? "",
            addressText: profile?.addressText ?? "",
        },
    };
}

/* ---------------- ENRICHED (UNCHANGED) ---------------- */

export async function listMembershipsEnriched(
    tenantId: string,
    limit?: number
): Promise<MembershipView[]> {
    const memberships = await membershipStore.listByTenant(tenantId);

    const sliced = limit
        ? memberships.slice(0, limit)
        : memberships;

    return Promise.all(sliced.map(toMembershipView));
}

export async function getMembershipEnriched(
    actor: MembershipActor,
    membershipId: string
): Promise<MembershipView> {
    const membership = await membershipStore.get(membershipId);

    assertExists(membership);

    assertVisible(actor, membership);

    return toMembershipView(membership);
}

export async function listUserMembershipsEnriched(
    userId: string
): Promise<MembershipView[]> {
    const memberships = await membershipStore.listByUser(userId);

    return Promise.all(memberships.map(toMembershipView));
}

export async function listAllMembershipsEnriched(
    limit?: number
): Promise<MembershipView[]> {
    const memberships = await membershipStore.getAll();

    const sliced = limit
        ? memberships.slice(0, limit)
        : memberships;

    return Promise.all(sliced.map(toMembershipView));
}