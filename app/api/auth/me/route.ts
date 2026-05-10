import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { handleRouteError } from "@/lib/http/handleRouteError";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        return NextResponse.json({ user });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}