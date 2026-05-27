import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant } from "@/lib/auth/guards";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { executeCheckout } from "@/lib/checkout/service";

import { dispatchEvent } from "@/lib/events/dispatcher";
import { recordLatency, recordRequest, recordUser } from "@/lib/metrics";

export async function POST(req: Request) {
    const start = Date.now();
    recordRequest();

    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const actor = requireTenant(user);
        recordUser(actor.userId);

        const result = await executeCheckout(
            actor.tenantId,
            actor.userId
        );

        await dispatchEvent(result.event, { actorId: actor.userId });

        recordLatency(Date.now() - start);

        return NextResponse.json({
            order: result.order
        });

    } catch (err: unknown) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}