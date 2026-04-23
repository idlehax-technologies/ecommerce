import { membershipStore } from "./storage";
import { toNewMembership } from "./mappers";
import type { Membership } from "@/types/membership";
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

export function expirePendingMemberships(): void {
    const now = Date.now();

    const all = membershipStore.getAll();

    for (const m of all) {
        if (m.status !== "PENDING") continue;

        const created = new Date(m.createdAt).getTime();

        if (now - created >= EXPIRY_MS) {
            m.status = "EXPIRED";
            m.updatedAt = new Date().toISOString();
            membershipStore.save(m);
        }
    }
}

/* ---------------- CORE ---------------- */

export function requestMembership(
    userId: string,
    tenantId: string
): Membership {
    expirePendingMemberships(); // ✅ ensure correctness

    const profile = profileStore.get(userId);

    if (!profile) {
        throw new Error("Profile must be completed before requesting membership");
    }

    assertCompleteProfile(profile); // 🔴 critical fix

    if (!profile) {
        throw new Error("Profile must be completed before requesting membership");
    }

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
    return m;
}

export function approveMembership(actor: AccessActor, membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "PENDING");

    m.status = "APPROVED";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);
}

export function rejectMembership(actor: AccessActor, membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "PENDING");

    m.status = "REJECTED";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);
}

export function revokeMembership(actor: AccessActor, membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);

    assertVisible(actor, m);
    assertStatus(m, "APPROVED");

    m.status = "REVOKED";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);
}

export function getActiveMembership(
    userId: string,
    membershipId: string
) {
    expirePendingMemberships(); // ✅ important

    const m = membershipStore.get(membershipId);

    assertExists(m);
    requireOwnership(m, userId);
    assertStatus(m, "APPROVED");

    return m;
}

export function listUserMemberships(userId: string) {
    expirePendingMemberships();

    return membershipStore.listByUser(userId);
}

export function listPendingMemberships(tenantId: string) {
    expirePendingMemberships();

    return membershipStore
        .listByTenant(tenantId)
        .filter((m) => m.status === "PENDING");
}

export function getMembership(id: string) {
    expirePendingMemberships();

    const m = membershipStore.get(id);
    assertExists(m);
    return m;
}

export function selectMembership(
    userId: string,
    membershipId: string
) {
    expirePendingMemberships();

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
    expirePendingMemberships();

    return membershipStore.getAll();
}

export function getAdminMembershipForTenant(tenantId: string) {
    expirePendingMemberships();

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

export function updateMembershipRole(
    actorUserId: string,
    membershipId: string,
    newRole: Membership["role"]
) {
    const m = membershipStore.get(membershipId);

    assertExists(m);

    // ❌ self-upgrade not allowed
    if (m.userId === actorUserId) {
        throw new Error("Cannot modify your own role");
    }

    // ❌ must be approved
    assertStatus(m, "APPROVED");

    // ❌ no-op
    if (m.role === newRole) {
        throw new Error("Role already set");
    }

    m.role = newRole;
    m.updatedAt = new Date().toISOString();

    membershipStore.save(m);
}

export function listMembershipsEnriched(tenantId: string) {
    expirePendingMemberships();

    const memberships = membershipStore.listByTenant(tenantId);

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

export function getMembershipEnriched(
    actor: AccessActor,
    membershipId: string
) {
    expirePendingMemberships();

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

export function listAllMembershipsEnriched() {
    expirePendingMemberships();

    const memberships = membershipStore.getAll();

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