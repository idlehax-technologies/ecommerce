import { randomUUID } from "crypto";
import type { Membership, PublicMembership } from "@/types/membership";

export function toNewMembership(userId: string, tenantId: string): Membership {
    const now = new Date().toISOString();

    return {
        membershipId: randomUUID(),
        userId,
        tenantId,
        status: "pending",
        createdAt: now,
        updatedAt: now,
    };
}

export function toPublicMembership(m: Membership): PublicMembership {
    const { userId, ...rest } = m;
    return rest;
}
