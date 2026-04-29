import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { listAuditByTenant } from "@/lib/audit/storage";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        requireMembershipRole(user, ["admin", "staff"]);
        const actor = requireTenant(user);

        return NextResponse.json(
            listAuditByTenant(actor.tenantId)
        );
    } catch (err) {
        return handleRouteError(err);
    }
}