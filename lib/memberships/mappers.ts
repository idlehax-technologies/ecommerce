import { randomUUID } from "crypto";
import type { Membership } from "@/types/membership";

export function toNewMembership(
    userId: string,
    tenantId: string
): Membership {
    const now = new Date().toISOString();

    return {
        membershipId: randomUUID(),
        userId,
        tenantId,
        role: "customer",
        status: "PENDING",
        createdAt: now,
        updatedAt: now,
    };
}