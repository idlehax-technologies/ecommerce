import { NextResponse } from "next/server";
import { getStats } from "@/lib/metrics";

export async function GET() {
    return NextResponse.json(getStats(), {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}