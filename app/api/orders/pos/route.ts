import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import {
    requireTenant,
    requireMembershipRole
} from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { executePOS } from "@/lib/pos/service";

import {
    assertCreatePOSOrderDTO,
} from "@/lib/orders/validators";

import { dispatchEvent } from "@/lib/events/dispatcher";

import {
    recordLatency,
    recordRequest,
    recordUser,
} from "@/lib/metrics";

export async function POST(req: Request) {
    const start = Date.now();
    recordRequest();

    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireMembershipRole(user, ["staff"]);

        const actor = requireTenant(user);
        recordUser(actor.userId);

        const body: unknown = await req.json();

        assertCreatePOSOrderDTO(body);

        const result = await executePOS({
            tenantId: actor.tenantId,
            staffId: actor.userId,
            items: body.items,
            paymentMethod: body.paymentMethod,
        });

        for (const event of result.events) {
            await dispatchEvent(event, {
                actorId: actor.userId
            });
        }

        recordLatency(Date.now() - start);

        return NextResponse.json({
            order: result.order
        });

    } catch (err: unknown) {
        recordLatency(Date.now() - start);
        return handleRouteError(err);
    }
}