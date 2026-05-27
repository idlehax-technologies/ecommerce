import { NextResponse } from "next/server";

import { handleRouteError }
    from "@/lib/http/handleRouteError";

import { listAllTenants }
    from "@/lib/tenants/service";

import { guardRequest }
    from "@/lib/security/requestGuard";

export async function GET(req: Request) {

    try {
        await guardRequest(req, { requireAuth: true });

        const tenants = await listAllTenants();

        return NextResponse.json({ tenants });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}