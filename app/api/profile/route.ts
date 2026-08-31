import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/security/requestGuard";
import { assertProfileInput } from "@/lib/profiles/validators";
import { upsertProfile, getProfile } from "@/lib/profiles/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import type { ProfileDTO } from "@/types/profile";

export async function GET(req: Request) {
    try {
        const user = await guardRequest(req, { requireAuth: true });

        const userProfile = await getProfile(user.userId);

        if (!userProfile) {
            return NextResponse.json({
                profile: null
            });
        }

        const profile: ProfileDTO = {
            fullName: userProfile.fullName,
            email: userProfile.email,
            addressText: userProfile.addressText,
        };

        return NextResponse.json({ profile });
    } catch (err: unknown) {
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

        const userProfile = await upsertProfile(user.userId, body);

        const profile: ProfileDTO = {
            fullName: userProfile.fullName,
            email: userProfile.email,
            addressText: userProfile.addressText,
        };

        return NextResponse.json({ profile });
    } catch (err: unknown) {
        return handleRouteError(err);
    }
}