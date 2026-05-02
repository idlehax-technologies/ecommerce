import { describe, it, expect } from "vitest";
import { getMembershipEnriched } from "@/lib/memberships/domain";
import { AccessActor } from "@/types/auth";

describe("Memberships — Visibility", () => {

    it("should block cross-tenant membership access", () => {
        const actor: AccessActor = {
            type: "tenant",
            membership: {
                userId: "u_customer",
                tenantId: "tenant_alpha",
                role: "customer",
            }
        };

        expect(() =>
            getMembershipEnriched(actor, "m_mnsnhs_admin")
        ).toThrow();
    });

});