import { NextResponse } from "next/server";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { listActiveTenants } from "@/lib/tenants/domain";

import { guardRequest } from "@/lib/security/requestGuard";

export async function GET(req: Request) {

    try {
        await guardRequest(req, { requireAuth: true });

        const tenants = await listActiveTenants();

        return NextResponse.json({ tenants });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}