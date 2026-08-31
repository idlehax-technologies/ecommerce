import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembershipRole, requireMembership } from "@/lib/auth/guards";

import { getTenantInventoryView } from "@/lib/tenantInventory/service";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        await requireMembershipRole(user, ["staff", "admin"]);

        const actor = await requireMembership(user);

        const rows = await getTenantInventoryView(actor.tenantId);

        return NextResponse.json({ rows });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}