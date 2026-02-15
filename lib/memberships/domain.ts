import { membershipStore } from "./storage";
import { toNewMembership, toPublicMembership } from "./mappers";
import { assertDoesNotExist, assertExists, assertPending } from "./guards";

export function requestMembership(userId: string, tenantId: string) {
    const existing = membershipStore
        .getByUser(userId)
        .find((m) => m.tenantId === tenantId && (m.status === "pending" || m.status === "approved"));

    assertDoesNotExist(existing);

    const m = toNewMembership(userId, tenantId);
    membershipStore.save(m);

    return toPublicMembership(m);
}

export function myMemberships(userId: string) {
    return membershipStore.getByUser(userId).map(toPublicMembership);
}

export function pendingMemberships() {
    return membershipStore.getPending().map(toPublicMembership);
}

export function getMembership(membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);
    return toPublicMembership(m);
}

export function approveMembership(membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);
    assertPending(m);

    m.status = "approved";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);

    return toPublicMembership(m);
}

export function rejectMembership(membershipId: string) {
    const m = membershipStore.get(membershipId);
    assertExists(m);
    assertPending(m);

    m.status = "rejected";
    m.updatedAt = new Date().toISOString();
    membershipStore.save(m);

    return toPublicMembership(m);
}
