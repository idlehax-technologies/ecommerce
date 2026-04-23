import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requireAuth } from "@/lib/auth/guards";
import { assertProfileInput } from "@/lib/profiles/validators";
import { upsertProfile, getProfile } from "@/lib/profiles/domain";
import { handleRouteError } from "@/lib/http/handleRouteError";
import { ProfileDTO } from "@/types/profile";

export async function GET() {
    try {
        const user = requireAuth(await getUserFromRequest());

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
        const user = requireAuth(await getUserFromRequest());

        const body: unknown = await req.json();
        assertProfileInput(body);

        const profile = upsertProfile(user.userId, user.phone, body);

        const dto = {
            fullName: profile.fullName,
            email: profile.email,
            addressText: profile.addressText,
        };

        return NextResponse.json(dto);
    } catch (err) {
        return handleRouteError(err);
    }
}