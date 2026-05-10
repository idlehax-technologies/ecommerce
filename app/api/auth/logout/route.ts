import { NextResponse } from "next/server";

import { handleRouteError } from "@/lib/http/handleRouteError";
import { guardRequest } from "@/lib/security/requestGuard";

export async function POST(req: Request) {
    try {
        await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        })

        const res = NextResponse.json({ success: true });

        res.cookies.set("auth", "", {
            httpOnly: true,
            path: "/",
            maxAge: 0,
        });

        return res;
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}
