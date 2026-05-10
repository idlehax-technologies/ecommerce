import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { listAllTenants, createTenantUseCase } from "@/lib/tenants/service";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });
        requireSuperadmin(user);

        const tenants = await listAllTenants();
        return NextResponse.json({ tenants });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const body = await req.json();
        const tenant = await createTenantUseCase(body);

        return NextResponse.json({ tenant });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}