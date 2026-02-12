import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/domain";
import { AuthDomainError } from "@/lib/auth/errors";

export async function POST(req: Request) {
    try {
        const { phone, code } = await req.json();

        const { user, token } = await verifyOtp(phone, code);

        const res = NextResponse.json({ user });

        res.cookies.set("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
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
