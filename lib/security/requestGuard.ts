import { validateCsrf } from "./csrf";
import { rateLimit } from "@/lib/redis/rateLimit";
import { getUserFromRequest } from "@/lib/session/session";
import { UnauthorizedError } from "@/lib/auth/errors";

import type { AuthUser } from "@/types/auth";

declare global {
    var __devBypassLogged: boolean | undefined;
}

// 🔴 overloads
export async function guardRequest(
    req: Request,
    options: {
        requireAuth: true;
        csrf?: boolean;
    }
): Promise<AuthUser>;

export async function guardRequest(
    req: Request,
    options?: {
        requireAuth?: false;
        csrf?: boolean;
    }
): Promise<AuthUser | null>;

// 🔴 implementation
export async function guardRequest(
    req: Request,
    options?: {
        requireAuth?: boolean;
        csrf?: boolean;
    }
): Promise<AuthUser | null> {

    const isDevBypass =
        process.env.NODE_ENV === "development" &&
        process.env.ALLOW_DEV_BYPASS === "true" &&
        req.headers.get("x-dev-bypass") === "true";

    if (isDevBypass) {
        if (!globalThis.__devBypassLogged) {
            console.log("DEV BYPASS ACTIVE");
            globalThis.__devBypassLogged = true;
        }

        return {
            userId: "test-user",
            memberships: [
                {
                    tenantId: "test-tenant",
                    role: "customer",
                    status: "ACTIVE",
                },
            ],
        } as unknown as AuthUser;
    }

    const user = await getUserFromRequest();

    const baseKey =
        user?.userId ??
        req.headers.get("x-forwarded-for") ??
        "anon";

    const pathname =
        new URL(req.url).pathname;

    const key =
        `${baseKey}:${pathname}`;

    await rateLimit(key);

    if (options?.csrf) {
        await validateCsrf(req);
    }

    if (options?.requireAuth && !user) {
        throw new UnauthorizedError();
    }

    return user;
}