import { MembershipActor } from "@/types/auth";
import type { Membership, MembershipStatus } from "@/types/membership";
import { MembershipAlreadyExistsError, MembershipInvalidStateError, MembershipNotFoundError } from "./errors";
import { ForbiddenError } from "../auth/errors";

/* ---------------- INVARIANTS ---------------- */

export function assertExists(
    m: Membership | null
): asserts m is Membership {
    if (!m) throw new MembershipNotFoundError();
}

export function assertDoesNotExist(
    m: Membership | null | undefined
): asserts m is null | undefined {
    if (m) throw new MembershipAlreadyExistsError();
}

export function assertVisible(
    actor: MembershipActor,
    m: Membership
): void {
    if (m.tenantId !== actor.tenantId) {
        throw new ForbiddenError("Cross-tenant access forbidden");
    }
}

export function assertStatus(m: Membership, expected: MembershipStatus): void {
    if (m.status !== expected) {
        throw new MembershipInvalidStateError(
            `Invalid membership state transition from ${m.status}`
        );
    }
}

/* ---------------- AUTHORIZATION ---------------- */

export function requireOwnership(
    membership: Membership,
    userId: string
): void {
    if (membership.userId !== userId) {
        throw new ForbiddenError();
    }
}