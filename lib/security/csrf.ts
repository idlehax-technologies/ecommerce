import { cookies } from "next/headers";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken(): string {
    return crypto.randomUUID();
}

export async function ensureCsrfCookie() {
    const cookieStore = await cookies();

    if (!cookieStore.get(CSRF_COOKIE)) {
        const token = generateCsrfToken();

        cookieStore.set(CSRF_COOKIE, token, {
            httpOnly: false, // must be readable by client
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
    }
}

export async function validateCsrf(req: Request) {
    const cookieStore = await cookies();

    const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
    const headerToken = req.headers.get(CSRF_HEADER);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        throw new Error("CSRF validation failed");
    }
}