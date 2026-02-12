import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/auth/domain";
import { AuthDomainError } from "@/lib/auth/errors";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        await requestOtp(phone);

        return NextResponse.json({ success: true });
    } catch (err) {
        if (err instanceof AuthDomainError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.status }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
