import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { requireTenant, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { resolveMismatch } from "@/lib/reconciliation/resolution";

export async function POST(req: Request) {
    try {
        const rawUser = await getUserFromRequest();

        requireMembershipRole(rawUser, ["staff"]);
        const actor = requireTenant(rawUser);

        const body = await req.json();

        await resolveMismatch({
            tenantId: actor.tenantId,
            actorId: actor.userId,
            request: body,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return handleRouteError(err);
    }
}