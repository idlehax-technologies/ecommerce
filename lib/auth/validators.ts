import { InvalidOtpError } from "./errors";

export function assertOtpRequest(body: unknown): asserts body is { phone: string } {
    if (!body || typeof body !== "object") {
        throw new InvalidOtpError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.phone !== "string" || obj.phone.trim().length < 8) {
        throw new InvalidOtpError("Invalid phone");
    }
}

export function assertOtpVerify(body: unknown): asserts body is { phone: string; code: string } {
    if (!body || typeof body !== "object") {
        throw new InvalidOtpError("Invalid request body");
    }

    const obj = body as Record<string, unknown>;

    if (typeof obj.phone !== "string") {
        throw new InvalidOtpError("Invalid phone");
    }

    if (typeof obj.code !== "string") {
        throw new InvalidOtpError("Invalid code");
    }
}
