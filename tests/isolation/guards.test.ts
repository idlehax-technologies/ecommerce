import { describe, it, expect } from "vitest";
import { requireMembershipRole } from "@/lib/auth/guards";
import type { AuthUser } from "@/types/auth";

describe("Guards — Tenant Enforcement", () => {
    it("should reject insufficient role", () => {
        const user: AuthUser = {
            userId: "u_customer",
            phone: "999",
            isSuperadmin: false,
            activeMembershipId: "m_u_customer_alpha",
        };

        expect(() =>
            requireMembershipRole(user, ["admin"])
        ).toThrow();
    });
});