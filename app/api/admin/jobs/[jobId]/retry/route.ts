import { NextResponse } from "next/server";

import { guardRequest } from "@/lib/security/requestGuard";
import { requireSuperadmin } from "@/lib/auth/guards";

import { retryJob } from "@/lib/jobs/service";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;

        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        requireSuperadmin(user);

        retryJob(jobId);

        return NextResponse.json({ success: true });

    } catch (err: unknown) {
        return handleRouteError(err);
    }
}