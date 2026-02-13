import { NextResponse } from "next/server";
import { getMembership } from "@/lib/memberships/domain";

export async function GET(
    _: Request,
    { params }: { params: { membershipId: string } }
) {
    try {
        return NextResponse.json(getMembership(params.membershipId));
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message },
            { status: e.status ?? 400 }
        );
    }
}
