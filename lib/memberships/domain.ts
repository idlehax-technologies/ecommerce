import { membershipStore } from "./storage";
import { toNewMembership } from "./mappers";
import type { Membership } from "@/types/membership";
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

import { AccessActor } from "@/types/auth";
import { assertCompleteProfile } from "../profiles/guards";

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/* ---------------- EXPIRY ---------------- */

export function expireMembership(
    membershipId: string
): { membership: Membership; event: DomainEvent } | null {

    const m = membershipStore.get(membershipId);

    if (!m || m.status !== "PENDING") return null;

    const now = Date.now();
    const created = new Date(m.createdAt).getTime();

    if (now - created < EXPIRY_MS) return null;

    const from = m.status;

    m.status = "EXPIRED";
    m.updatedAt = new Date().toISOString();

    membershipStore.save(m);

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

export function findExpiredMemberships(): string[] {
    const now = Date.now();

    return membershipStore
        .getAll()
        .filter((m) => {
            if (m.status !== "PENDING") return false;

            const created = new Date(m.createdAt).getTime();

            return now - created >= EXPIRY_MS;
        })
        .map((m) => m.membershipId);
}

/* ---------------- CORE (MUTATIONS) ---------------- */

export function requestMembership(
    userId: string,
    tenantId: string
): { membership: Membership; event: DomainEvent } {

    const profile = profileStore.get(userId);
    if (!profile) {
        throw new Error("Profile must be completed before requesting membership");
    }

    assertCompleteProfile(profile);

    const existing = membershipStore
        .listByUser(userId)
        .find(
            (m) =>
                m.tenantId === tenantId &&
                (m.status === "PENDING" || m.status === "APPROVED")
        );

    assertDoesNotExist(existing);

    const m = toNewMembership(userId, tenantId);
    membershipStore.save(m);

    return {
        membership: m,
        event: {
            type: "MembershipRequested",
            membership: m
        }
    };
}

export function approveMembership(
    actor: AccessActor,
    membershipId: string
): { membership: Membership; event: DomainEvent } {

    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "PENDING");

    const from = m.status;

    m.status = "APPROVED";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);

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

export function rejectMembership(
    actor: AccessActor,
    membershipId: string
): { membership: Membership; event: DomainEvent } {

    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "PENDING");

    const from = m.status;

    m.status = "REJECTED";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);

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

export function revokeMembership(
    actor: AccessActor,
    membershipId: string
): { membership: Membership; event: DomainEvent } {

    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "APPROVED");

    const from = m.status;

    m.status = "REVOKED";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);

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

export function updateMembershipRole(
    actorUserId: string,
    membershipId: string,
    newRole: Membership["role"]
): { membership: Membership; event: DomainEvent } {

    const m = membershipStore.get(membershipId);
    assertExists(m);

    if (m.userId === actorUserId) {
        throw new Error("Cannot modify your own role");
    }

    assertStatus(m, "APPROVED");

    if (m.role === newRole) {
        throw new Error("Role already set");
    }

    const from = m.role;

    m.role = newRole;
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);

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

export function getActiveMembership(userId: string, membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);
    requireOwnership(m, userId);
    assertStatus(m, "APPROVED");

    return m;
}

export function listUserMemberships(userId: string) {
    return membershipStore.listByUser(userId);
}

export function listPendingMemberships(tenantId: string) {
    return membershipStore
        .listByTenant(tenantId)
        .filter((m) => m.status === "PENDING");
}

export function getMembership(id: string) {
    const m = membershipStore.get(id);
    assertExists(m);
    return m;
}

export function selectMembership(userId: string, membershipId: string) {
    const m = membershipStore.get(membershipId);

    assertExists(m);
    requireOwnership(m, userId);
    assertStatus(m, "APPROVED");

    authStore.save({
        ...authStore.getById(userId)!,
        activeMembershipId: membershipId,
    });
}

export function listAllMemberships() {
    return membershipStore.getAll();
}

export function getAdminMembershipForTenant(tenantId: string) {
    const m = membershipStore
        .listByTenant(tenantId)
        .find(
            (m) =>
                m.role === "admin" &&
                m.status === "APPROVED"
        );

    if (!m) {
        throw new Error("No admin membership found for tenant");
    }

    return m;
}

/* ---------------- ENRICHED (UNCHANGED) ---------------- */

export function listMembershipsEnriched(
    tenantId: string,
    limit?: number
) {
    const memberships = membershipStore.listByTenant(tenantId);

    const sliced = limit
        ? memberships.slice(0, limit)
        : memberships;

    return sliced.map((m) => {
        const profile = profileStore.get(m.userId);
        const tenant = tenantStore.get(m.tenantId);

        return {
            membershipId: m.membershipId,
            status: m.status,
            role: m.role,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            tenant: {
                tenantId: tenant?.tenantId,
                name: tenant?.name,
            },
            user: {
                userId: m.userId,
                fullName: profile?.fullName ?? "",
                phone: profile?.phone ?? "",
                email: profile?.email ?? "",
                addressText: profile?.addressText ?? "",
            },
        };
    });
}

export function getMembershipEnriched(
    actor: AccessActor,
    membershipId: string
) {
    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);

    const profile = profileStore.get(m.userId);
    const tenant = tenantStore.get(m.tenantId);

    return {
        membershipId: m.membershipId,
        status: m.status,
        role: m.role,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        tenant: {
            tenantId: tenant?.tenantId,
            name: tenant?.name,
        },
        user: {
            userId: m.userId,
            fullName: profile?.fullName ?? "",
            phone: profile?.phone ?? "",
            email: profile?.email ?? "",
            addressText: profile?.addressText ?? "",
        },
    };
}

export function listUserMembershipsEnriched(userId: string) {
    const memberships = membershipStore.listByUser(userId);

    return memberships.map((m) => {
        const profile = profileStore.get(m.userId);
        const tenant = tenantStore.get(m.tenantId);

        return {
            membershipId: m.membershipId,
            status: m.status,
            role: m.role,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            tenant: {
                tenantId: tenant?.tenantId,
                name: tenant?.name,
            },
            user: {
                userId: m.userId,
                fullName: profile?.fullName ?? "",
                phone: profile?.phone ?? "",
                email: profile?.email ?? "",
                addressText: profile?.addressText ?? "",
            },
        };
    });
}

export function listAllMembershipsEnriched(limit?: number) {
    const memberships = membershipStore.getAll();

    const sliced = limit
        ? memberships.slice(0, limit)
        : memberships;

    return sliced.map((m) => {
        const profile = profileStore.get(m.userId);
        const tenant = tenantStore.get(m.tenantId);

        return {
            membershipId: m.membershipId,
            status: m.status,
            role: m.role,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            tenant: {
                tenantId: tenant?.tenantId,
                name: tenant?.name,
            },
            user: {
                userId: m.userId,
                fullName: profile?.fullName ?? "",
                phone: profile?.phone ?? "",
                email: profile?.email ?? "",
                addressText: profile?.addressText ?? "",
            },
        };
    });
}