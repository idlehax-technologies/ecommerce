import { NextResponse } from "next/server";

import { stopAssumeUseCase } from "@/lib/auth/service";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function POST(req: Request) {
    try {
        await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        await stopAssumeUseCase();

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}