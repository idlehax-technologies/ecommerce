import { NextResponse } from "next/server";

import { requireSuperadmin } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { adjustStock } from "@/lib/tenantInventory/adjustment";

import { dispatchEvent } from "@/lib/events/dispatcher";
import { guardRequest } from "@/lib/security/requestGuard";
import { recordLatency, recordRequest } from "@/lib/metrics";
import { validateStockAdjustmentInput } from "@/lib/tenantInventory/validators";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    const start = Date.now();
    recordRequest();

    try {
        const { tenantId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireSuperadmin(user);

        const body: unknown = await req.json();

        validateStockAdjustmentInput(body);

        const result = adjustStock({
            tenantId,
            actorId: user.userId,
            request: body,
        });

        if (result.event) {
            await dispatchEvent(result.event, { actorId: user.userId });
        }

        recordLatency(Date.now() - start);

        return NextResponse.json({
            updated: result.updated
        });

    } catch (err: unknown) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}