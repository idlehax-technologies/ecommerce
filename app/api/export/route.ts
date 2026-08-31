import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireMembership, requireMembershipRole } from "@/lib/auth/guards";

import { handleRouteError } from "@/lib/http/handleRouteError";

import { exportData } from "@/lib/export/service";
import { validateExportRequest } from "@/lib/export/validators";

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        await requireMembershipRole(user, ["admin"]);
        const actor = await requireMembership(user);

        const body: unknown = await req.json();
        validateExportRequest(body);

        const result = await exportData(actor.tenantId, body);

        return new NextResponse(
            result.content,
            {
                headers: {
                    "Content-Type": "text/csv; charset=utf-8",
                    "Content-Disposition": `attachment; filename="${result.filename}"`,
                },
            }
        );

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}