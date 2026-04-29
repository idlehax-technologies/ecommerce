import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { assertProfileInput } from "@/lib/profiles/validators";
import { upsertProfile, getProfile } from "@/lib/profiles/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { ProfileDTO } from "@/types/profile";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const profile = getProfile(user.userId);

        if (!profile) {
            return NextResponse.json(null);
        }

        const dto: ProfileDTO = {
            fullName: profile.fullName,
            email: profile.email,
            addressText: profile.addressText,
        };

        return NextResponse.json(dto);
    } catch (err) {
        return handleRouteError(err);
    }
}

export async function POST(req: Request) {
    try {
        const user = await guardRequest(req, {
            requireAuth: true,
            csrf: true,
        });

        const body: unknown = await req.json();
        assertProfileInput(body);

        const profile = upsertProfile(user.userId, user.phone, body);

        const dto: ProfileDTO = {
            fullName: profile.fullName,
            email: profile.email,
            addressText: profile.addressText,
        };

        return NextResponse.json(dto);
    } catch (err) {
        return handleRouteError(err);
    }
}