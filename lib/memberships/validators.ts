import { Membership } from "@/types/membership";

export function assertRequestMembership(
    body: unknown
): asserts body is { tenantId: string } {
    if (!body || typeof body !== "object") {
        throw new Error("Invalid body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.tenantId !== "string") {
        throw new Error("tenantId required");
    }
}

export function assertSelectMembership(
    body: unknown
): asserts body is { membershipId: string } {
    if (!body || typeof body !== "object") {
        throw new Error("Invalid body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.membershipId !== "string") {
        throw new Error("membershipId required");
    }
}

export function assertUpdateMembershipRole(
    body: unknown
): asserts body is { role: Membership["role"] } {
    if (!body || typeof body !== "object") {
        throw new Error("Invalid body");
    }

    const obj = body as Record<string, unknown>;

    if (
        obj.role !== "customer" &&
        obj.role !== "staff" &&
        obj.role !== "admin"
    ) {
        throw new Error("Invalid role");
    }
}