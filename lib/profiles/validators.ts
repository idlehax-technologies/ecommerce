import type { UpsertProfileInput } from "@/types/profile";
import { ProfileInvalidInputError } from "./errors";

export function assertProfileInput(
    body: unknown
): asserts body is UpsertProfileInput {
    if (!body || typeof body !== "object") {
        throw new ProfileInvalidInputError("Invalid request body");
    }

    const b = body as Record<string, unknown>;

    if (typeof b.fullName !== "string") {
        throw new ProfileInvalidInputError("Invalid fullName");
    }

    if (typeof b.email !== "string") {
        throw new ProfileInvalidInputError("Invalid email");
    }

    if (typeof b.addressText !== "string") {
        throw new ProfileInvalidInputError("Invalid addressText");
    }
}