import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

import {
    listTenantInventory,
    provisionProduct,
} from "@/lib/tenantInventory/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        requireSuperadmin(user);

        const rows = listTenantInventory(tenantId);

        return NextResponse.json({ rows });
    } catch (err) {
        return handleRouteError(err);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });
        requireSuperadmin(user);

        const body = await req.json();

        const record = provisionProduct(tenantId, body);

        return NextResponse.json(record);
    } catch (err) {
        return handleRouteError(err);
    }
}