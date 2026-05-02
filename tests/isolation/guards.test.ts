import { describe, it, expect } from "vitest";
import { requireAccess } from "@/lib/auth/guards";
import type { AuthUser } from "@/types/auth";

describe("Guards — Tenant Enforcement", () => {
    it("should reject insufficient role", () => {
        const user: AuthUser = {
            userId: "u_customer",
            phone: "999",
            activeMembershipId: "m_u_customer_alpha",
        };

        expect(() =>
            requireAccess(user, ["admin"])
        ).toThrow();
    });
});