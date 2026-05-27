import { NextResponse } from "next/server";
import { getStats } from "@/lib/metrics";
import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

export async function GET(req: Request) {
    const user = await guardRequest(req, { requireAuth: true });
    requireSuperadmin(user);

    return NextResponse.json(
        { metrics: getStats() },
        {
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}