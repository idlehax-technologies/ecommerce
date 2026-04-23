import { AccessActor } from "@/types/auth";
import type { Membership, MembershipStatus } from "@/types/membership";

/* ---------------- INVARIANTS ---------------- */

export function assertExists(
    m: Membership | null
): asserts m is Membership {
    if (!m) throw new Error("Membership not found");
}

export function assertDoesNotExist(
    m: Membership | null | undefined
): asserts m is null | undefined {
    if (m) throw new Error("Membership already exists");
}

export function assertVisible(actor: AccessActor, m: Membership) {
    if (actor.type === "superadmin") return;

    if (m.tenantId !== actor.membership.tenantId) {
        throw new Error("Forbidden: cross-tenant access");
    }
}

export function assertStatus(m: Membership, expected: MembershipStatus) {
    if (m.status !== expected) {
        throw new Error(`Invalid state transition from ${m.status}`);
    }
}

/* ---------------- AUTHORIZATION ---------------- */

export function requireOwnership(
    membership: Membership,
    userId: string
) {
    if (membership.userId !== userId) {
        throw new Error("Forbidden");
    }
}