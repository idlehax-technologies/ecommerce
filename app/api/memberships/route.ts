import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { requestMembership, myMemberships } from "@/lib/memberships/domain";
import { assertRequestMembershipDTO } from "@/lib/memberships/validators";

export async function GET() {
    try {
        const user = await getUserFromRequest();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        return NextResponse.json(myMemberships(user.userId));
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromRequest();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        assertRequestMembershipDTO(body);

        return NextResponse.json(requestMembership(user.userId, body.tenantId));
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
}
