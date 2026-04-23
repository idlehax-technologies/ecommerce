import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireSuperadmin } from "@/lib/auth/guards";

import {
    listTenantInventory,
    provisionProduct,
} from "@/lib/tenantInventory/domain";

import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const rawUser = await getUserFromRequest();
        requireSuperadmin(rawUser);

        return NextResponse.json(listTenantInventory(tenantId));
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const rawUser = await getUserFromRequest();
        requireSuperadmin(rawUser);

        const body = await req.json();
        const record = provisionProduct(tenantId, body);

        return NextResponse.json(record);
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}