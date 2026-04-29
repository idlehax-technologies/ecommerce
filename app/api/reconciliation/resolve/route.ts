import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { resolveMismatch } from "@/lib/reconciliation/resolution";
import { dispatchEvent } from "@/lib/events/dispatcher";

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireMembershipRole(user, ["staff"]);
        const actor = requireTenant(user);

        const body = await req.json();

        const result = await resolveMismatch({
            tenantId: actor.tenantId,
            actorId: actor.userId,
            request: body,
        });

        for (const event of result.events) {
            await dispatchEvent(event, { actorId: actor.userId });
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        return handleRouteError(err);
    }
}