import { NextResponse } from "next/server";
import { pendingMemberships } from "@/lib/memberships/domain";

export async function GET() {
    try {
        return NextResponse.json(pendingMemberships());
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 400 });
    }
}
