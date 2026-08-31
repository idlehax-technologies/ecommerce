import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

import { provisionProduct } from "@/lib/tenantInventory/domain";
import { validateProvisionInput } from "@/lib/tenantInventory/validators";

import { handleRouteError } from "@/lib/http/handleRouteError";

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