import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembership, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { resolveMismatch } from "@/lib/reconciliation/resolution";
import { dispatchEvent } from "@/lib/events/dispatcher";
import { assertResolutionRequest } from "@/lib/reconciliation/validators";

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        await requireMembershipRole(user, ["admin"]);
        const actor = await requireMembership(user);

        const body: unknown = await req.json();

        assertResolutionRequest(body);

        const result = await resolveMismatch({
            tenantId: actor.tenantId,
            actorId: actor.userId,
            request: body,
        });

        for (const event of result.events) {
            await dispatchEvent(event, { actorId: actor.userId });
        }

        return NextResponse.json({ success: true });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}