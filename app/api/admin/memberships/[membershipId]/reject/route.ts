import { NextResponse } from "next/server";
import { rejectMembership } from "@/lib/memberships/domain";

export async function POST(
    _: Request,
    { params }: { params: { membershipId: string } }
) {
    try {
        return NextResponse.json(rejectMembership(params.membershipId));
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
}
