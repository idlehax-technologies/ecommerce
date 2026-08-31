import { Membership } from "@/types/membership";
import { MembershipInvalidInputError } from "./errors";

export function assertRequestMembership(
    body: unknown
): asserts body is { tenantId: string } {
    if (!body || typeof body !== "object") {
        throw new MembershipInvalidInputError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.tenantId !== "string") {
        throw new MembershipInvalidInputError("tenantId is required");
    }
}

export function assertSelectMembership(
    body: unknown
): asserts body is { membershipId: string } {
    if (!body || typeof body !== "object") {
        throw new MembershipInvalidInputError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.membershipId !== "string") {
        throw new MembershipInvalidInputError("membershipId is required");
    }
}

export function assertUpdateMembershipRole(
    body: unknown
): asserts body is { role: Membership["role"] } {
    if (!body || typeof body !== "object") {
        throw new MembershipInvalidInputError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (
        obj.role !== "customer" &&
        obj.role !== "staff" &&
        obj.role !== "admin"
    ) {
        throw new MembershipInvalidInputError("Invalid role");
    }
}