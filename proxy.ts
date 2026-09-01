import { NextResponse } from "next/server";
import { ensureCsrfCookie } from "@/lib/security/csrf";

export async function proxy() {
    await ensureCsrfCookie();
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static|favicon.ico).*)"],
};