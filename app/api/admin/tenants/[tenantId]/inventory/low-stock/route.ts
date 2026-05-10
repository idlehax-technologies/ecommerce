import { NextResponse } from "next/server";

import { requireSuperadmin } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { detectLowStock } from "@/lib/tenantInventory/lowStock";
import { guardRequest } from "@/lib/security/requestGuard";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, { requireAuth: true });
        requireSuperadmin(user);

        const report = detectLowStock(tenantId);

        return NextResponse.json({ report });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}