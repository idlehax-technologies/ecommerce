import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { handleRouteError } from "@/lib/http/handleRouteError";

import { getTenantById } from "@/lib/tenants/service";
import { requireMembership } from "@/lib/auth/guards";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const actor = await requireMembership(user);

        const tenant = await getTenantById(actor.tenantId);

        return NextResponse.json({ tenant });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}