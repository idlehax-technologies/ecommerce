import { cookies } from "next/headers";
import { CSRF_COOKIE, CSRF_COOKIE_OPTIONS, CSRF_HEADER } from "../auth/cookies";
import { CsrfValidationError } from "./errors";

export function generateCsrfToken(): string {
    return crypto.randomUUID();
}

export async function ensureCsrfCookie(): Promise<void> {
    const cookieStore = await cookies();

    if (!cookieStore.get(CSRF_COOKIE)) {
        const token = generateCsrfToken();

        cookieStore.set(
            CSRF_COOKIE,
            token,
            CSRF_COOKIE_OPTIONS
        );
    }
}

export async function validateCsrf(req: Request): Promise<void> {
    const cookieStore = await cookies();

    const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
    const headerToken = req.headers.get(CSRF_HEADER);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        throw new CsrfValidationError();
    }
}