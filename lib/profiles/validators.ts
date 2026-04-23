import type { UpsertProfileInput } from "@/types/profile";

export function assertProfileInput(
    body: unknown
): asserts body is UpsertProfileInput {
    if (!body || typeof body !== "object") {
        throw new Error("Invalid body");
    }

    const b = body as Record<string, unknown>;

    if (typeof b.fullName !== "string") {
        throw new Error("Invalid fullName");
    }

    if (typeof b.email !== "string") {
        throw new Error("Invalid email");
    }

    if (typeof b.addressText !== "string") {
        throw new Error("Invalid addressText");
    }
}