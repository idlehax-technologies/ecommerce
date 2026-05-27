import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

import { provisionProduct } from "@/lib/tenantInventory/domain";
import { getTenantProvisioningView } from "@/lib/tenantInventory/service";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { validateProvisionInput } from "@/lib/tenantInventory/validators";
import { QUERY_LIMITS } from "@/lib/config/queryLimits";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
        });

        requireSuperadmin(user);

        const rows = await getTenantProvisioningView(
            tenantId,
            QUERY_LIMITS.INVENTORY
        );

        return NextResponse.json({ rows });

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

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireSuperadmin(user);

        const body: unknown = await req.json();

        validateProvisionInput(body);

        const inventory = await provisionProduct(
            tenantId,
            body
        );

        return NextResponse.json({ inventory });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}