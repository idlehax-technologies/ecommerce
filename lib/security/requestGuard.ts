import { getUserFromRequest } from "@/lib/auth";
import { validateCsrf } from "./csrf";
import { rateLimit } from "./rateLimit";
import { UnauthorizedError } from "../auth/errors";
import type { AuthUser } from "@/types/auth";

// 🔴 overloads
export async function guardRequest(
    req: Request,
    options: { requireAuth: true; csrf?: boolean; rateLimitKey?: string }
): Promise<AuthUser>;

export async function guardRequest(
    req: Request,
    options?: { requireAuth?: false; csrf?: boolean; rateLimitKey?: string }
): Promise<AuthUser | null>;

// 🔴 implementation
export async function guardRequest(
    req: Request,
    options?: {
        requireAuth?: boolean;
        csrf?: boolean;
        rateLimitKey?: string;
    }
): Promise<AuthUser | null> {
    const user = await getUserFromRequest();

    const baseKey =
        user?.userId ??
        req.headers.get("x-forwarded-for") ??
        "anon";

    const key = `${baseKey}:${options?.rateLimitKey ?? "default"}`;

    rateLimit(key);

    if (options?.csrf) {
        await validateCsrf(req);
    }

    if (options?.requireAuth && !user) {
        throw new UnauthorizedError();
    }

    return user;
}