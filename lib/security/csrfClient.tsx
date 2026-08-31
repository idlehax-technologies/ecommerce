import { CSRF_COOKIE } from "../auth/cookies";

export function getCsrfToken(): string | null {
    return document.cookie
        .split("; ")
        .find(c => c.startsWith(`${CSRF_COOKIE}=`))
        ?.split("=")[1] ?? null;
}